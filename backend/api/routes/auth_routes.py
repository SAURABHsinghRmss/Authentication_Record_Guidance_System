from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta, datetime, timezone
import uuid
import random
from passlib.context import CryptContext
from jose import jwt

from backend.services.db import get_db
from backend.models.student import UserModel, InstitutionModel, UserRegister, UserLogin, Token, OtpSendRequest, OtpVerifyRequest, BiometricVerificationRequest, BiometricVerificationResponse, ApaarVerificationRequest, DigiLockerFetchRequest
from backend.core.config import settings
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
def login(form_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "username": user.username,
        "institution_verified": user.institution_verified
    }

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
