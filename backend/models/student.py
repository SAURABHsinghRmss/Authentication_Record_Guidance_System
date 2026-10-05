from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional, List
from backend.services.db import Base

class StudentModel(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    roll_no = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    department = Column(String)
    semester = Column(String)
    cgpa = Column(String)
    attendance_percentage = Column(String)
    credits_earned = Column(String)
    max_credits = Column(String)
    backlogs = Column(Integer, default=0)
    apaar_id = Column(String, nullable=True)
    digilocker_verified = Column(Boolean, default=False)
    face_enrolled = Column(Boolean, default=False)
    voice_enrolled = Column(Boolean, default=False)
    biometric_hash = Column(String, nullable=True)
    status = Column(String, default="PENDING_REVIEW")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="student") # student, faculty, admin
    full_name = Column(String)
    institution_name = Column(String)
    institution_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class InstitutionModel(Base):
    __tablename__ = "institutions"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    status = Column(String, default="PENDING") # PENDING, VERIFIED
    requested_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# Pydantic Schemas
class StudentBase(BaseModel):
    roll_no: str
    name: str
    email: str
    department: str
    semester: str
    cgpa: str
    attendance_percentage: str
    credits_earned: str
    max_credits: str
    backlogs: int = 0
    apaar_id: Optional[str] = None
    digilocker_verified: bool = False
    face_enrolled: bool = False
    voice_enrolled: bool = False
    status: str = "PENDING_REVIEW"

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[str] = None
    cgpa: Optional[str] = None
    attendance_percentage: Optional[str] = None
    credits_earned: Optional[str] = None
    backlogs: Optional[int] = None
    apaar_id: Optional[str] = None
    digilocker_verified: Optional[bool] = None
    status: Optional[str] = None

class StudentResponse(StudentBase):
    id: str

    class Config:
        from_attributes = True

class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    full_name: str
    role: str = "student"
    institution_name: str

class UserLogin(BaseModel):
    username: str
    password: str
    captcha_answer: Optional[int] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str
    institution_verified: bool

class OtpSendRequest(BaseModel):
    email: str

class OtpVerifyRequest(BaseModel):
    email: str
    otp_code: str

class QueryRequest(BaseModel):
    query: str
    student_id: Optional[str] = None
    top_k: int = 3

class Citation(BaseModel):
    id: str
    topic: str
    content: str
    score: float

class QueryResponse(BaseModel):
    answer: str
    citations: List[Citation]
    latency_ms: float
    timestamp: str

class BiometricVerificationRequest(BaseModel):
    student_id: str
    mode: str  # "face", "ocr", "voice", "fusion"
    image_data: Optional[str] = None
    audio_data: Optional[str] = None

class BiometricVerificationResponse(BaseModel):
    status: str
    verified: bool
    confidence: float
    message: str
    mode: str
    timestamp: str

class ApaarVerificationRequest(BaseModel):
    apaar_id: str
    student_name: str
    dob: Optional[str] = None

class DigiLockerFetchRequest(BaseModel):
    apaar_id: str
    document_type: str = "DEGREE_CERTIFICATE"
