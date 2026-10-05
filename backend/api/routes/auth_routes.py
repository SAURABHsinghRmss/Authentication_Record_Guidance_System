from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone
import uuid
import random
from passlib.context import CryptContext
from jose import jwt

from backend.services.db import get_db
from backend.models.student import UserModel, UserRegister, UserLogin, Token, OtpSendRequest, OtpVerifyRequest, BiometricVerificationRequest, BiometricVerificationResponse, ApaarVerificationRequest, DigiLockerFetchRequest
from backend.core.config import settings
from ai_engine.pipelines.biometric_worker import biometric_pipeline

router = APIRouter(prefix="/auth", tags=["Authentication & Biometrics"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Temporary in-memory OTP storage
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
    
    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    hashed_pw = get_password_hash(user_in.password)
    user = UserModel(
        id=user_id,
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pw,
        role=user_in.role,
        full_name=user_in.full_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "username": user.username}

@router.post("/login", response_model=Token)
def login(form_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "username": user.username}

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
    
    # Clear OTP after success
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
