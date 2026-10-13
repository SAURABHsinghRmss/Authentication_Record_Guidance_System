from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, event
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

    @property
    def is_permanent(self) -> bool:
        return (self.username or "").strip().lower() == "msrch"

@event.listens_for(UserModel, "before_delete")
def prevent_universal_user_deletion(mapper, connection, target):
    if target.username and target.username.strip().lower() == "msrch":
        raise ValueError("Universal developer user 'msrch' is permanent and cannot be deleted.")

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

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    institution_name: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    full_name: Optional[str] = None
    institution_name: Optional[str] = None
    institution_verified: bool
    is_permanent: bool = False

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str
    institution_verified: bool
    storage_location: Optional[str] = None
    last_work_summary: Optional[str] = None

class WorkActionRequest(BaseModel):
    action_type: str
    description: str
    metadata: Optional[dict] = None

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

class MentorChatModel(Base):
    __tablename__ = "mentor_chats"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, index=True)
    mentor_username = Column(String, index=True)
    sender_role = Column(String) # "student" or "faculty"
    sender_name = Column(String)
    message = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ChatMessageCreate(BaseModel):
    student_id: str
    mentor_username: str = "faculty"
    sender_role: str
    sender_name: str
    message: str

class ChatMessageResponse(BaseModel):
    id: str
    student_id: str
    mentor_username: str
    sender_role: str
    sender_name: str
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True

class CounselingNoticeModel(Base):
    __tablename__ = "counseling_notices"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, index=True)
    student_name = Column(String)
    faculty_username = Column(String)
    notice_type = Column(String, default="ATTENDANCE_WARNING")
    message = Column(Text)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String, default="DISPATCHED")

class CounselingNoticeCreate(BaseModel):
    student_id: str
    student_name: str
    faculty_username: str = "faculty"
    notice_type: str = "ATTENDANCE_WARNING"
    message: str

class CounselingNoticeResponse(BaseModel):
    id: str
    student_id: str
    student_name: str
    faculty_username: str
    notice_type: str
    message: str
    timestamp: datetime
    status: str

    class Config:
        from_attributes = True

class CommunityGroupModel(Base):
    __tablename__ = "community_groups"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String, default="CLUB") # CLUB, COMMUNITY, STUDY_GROUP, FACULTY_BOARD
    role_access = Column(String, default="all") # student, faculty, admin, all
    description = Column(String, nullable=True)
    created_by = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CommunityMessageModel(Base):
    __tablename__ = "community_messages"

    id = Column(String, primary_key=True, index=True)
    group_id = Column(String, index=True)
    sender_username = Column(String)
    sender_name = Column(String)
    sender_role = Column(String)
    message = Column(Text)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CommunityGroupCreate(BaseModel):
    name: str
    category: str = "CLUB"
    role_access: str = "all"
    description: Optional[str] = None

class CommunityGroupResponse(BaseModel):
    id: str
    name: str
    category: str
    role_access: str
    description: Optional[str] = None
    created_by: str
    timestamp: datetime

    class Config:
        from_attributes = True

class CommunityMessageCreate(BaseModel):
    message: str

class CommunityMessageResponse(BaseModel):
    id: str
    group_id: str
    sender_username: str
    sender_name: str
    sender_role: str
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True

class StudySessionSummaryModel(Base):
    __tablename__ = "study_session_summaries"

    id = Column(String, primary_key=True, index=True)
    group_id = Column(String, index=True)
    summary_text = Column(Text)
    key_takeaways = Column(Text)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class InteractiveQuizModel(Base):
    __tablename__ = "interactive_quizzes"

    id = Column(String, primary_key=True, index=True)
    group_id = Column(String, index=True)
    question = Column(Text)
    options = Column(String)  # JSON-encoded list of options
    correct_answer = Column(String)
    created_by = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class StudySummaryResponse(BaseModel):
    id: str
    group_id: str
    summary_text: str
    key_takeaways: str
    timestamp: datetime

    class Config:
        from_attributes = True

class InteractiveQuizCreate(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class InteractiveQuizResponse(BaseModel):
    id: str
    group_id: str
    question: str
    options: List[str]
    correct_answer: Optional[str] = None # Can be omitted for student view
    created_by: str
    timestamp: datetime

    class Config:
        from_attributes = True

class QuizAnswerRequest(BaseModel):
    selected_answer: str

class QuizAnswerResponse(BaseModel):
    correct: bool
    explanation: str
    correct_answer: str

