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
    personal_email = Column(String, nullable=True)
    college_email = Column(String, nullable=True)
    mobile_number = Column(String, nullable=True)
    mobile_verified = Column(Boolean, default=False)
    gender = Column(String, nullable=True)
    aadhaar_number = Column(String, nullable=True)
    country_id_number = Column(String, nullable=True)
    country_id_type = Column(String, default="National ID / Aadhaar")
    country_id_verified = Column(Boolean, default=False)
    digilocker_verified = Column(Boolean, default=False)
    digilocker_auto_filled = Column(Boolean, default=False)
    parent_verification_status = Column(String, default="ALIVE") # ALIVE, DECEASED, ADOPTED
    parent_relation = Column(String, nullable=True) # Biological, Adoptive, Guardian, Self
    parent_username = Column(String, nullable=True)
    source_of_income = Column(String, nullable=True) # for parent role
    income_bracket = Column(String, nullable=True) # for parent role
    linked_student_id = Column(String, nullable=True) # for parent role
    is_present_in_student_db = Column(Boolean, default=False) # cross-role check
    student_db_reference = Column(String, nullable=True) # details of matched student record
    institute_affiliation_type = Column(String, default="EXISTING") # EXISTING, VIRTUAL
    affiliated_institute_name = Column(String, nullable=True)
    virtual_institute_name = Column(String, nullable=True)
    virtual_institute_focus = Column(String, nullable=True)
    admin_clearance_level = Column(String, nullable=True) # SUPER_ADMIN, REGIONAL_DIRECTOR, etc.
    admin_master_token = Column(String, nullable=True)
    hashed_password = Column(String)
    role = Column(String, default="student") # student, faculty, admin, parent, institute
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
    location = Column(String, nullable=True)
    institution_type = Column(String, default="University") # University, Autonomous College, Polytechnic, School (K-12), EdTech / Coaching, Research Institute, Virtual University
    accreditation_number = Column(String, nullable=True) # AISHE / UGC / AICTE / CBSE / State / ISO
    accreditation_verified = Column(Boolean, default=False)
    educational_domain = Column(String, nullable=True) # STEM, Medical, Engineering, Humanities, Skills
    mission_scope = Column(Text, nullable=True)
    is_virtual = Column(Boolean, default=False)
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
    email: Optional[str] = None
    personal_email: str
    college_email: str
    mobile_number: str
    password: str
    full_name: str
    role: str = "student"
    institution_name: str
    mobile_verified: bool = False

class UserLogin(BaseModel):
    username: str
    password: str
    captcha_answer: Optional[int] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    personal_email: Optional[str] = None
    college_email: Optional[str] = None
    mobile_number: Optional[str] = None
    password: Optional[str] = None
    institution_name: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    username: str
    email: Optional[str] = None
    personal_email: Optional[str] = None
    college_email: Optional[str] = None
    mobile_number: Optional[str] = None
    mobile_verified: bool = False
    gender: Optional[str] = None
    country_id_number: Optional[str] = None
    country_id_type: Optional[str] = None
    country_id_verified: bool = False
    parent_verification_status: Optional[str] = None
    parent_relation: Optional[str] = None
    parent_username: Optional[str] = None
    source_of_income: Optional[str] = None
    income_bracket: Optional[str] = None
    linked_student_id: Optional[str] = None
    is_present_in_student_db: bool = False
    student_db_reference: Optional[str] = None
    institute_affiliation_type: Optional[str] = None
    affiliated_institute_name: Optional[str] = None
    virtual_institute_name: Optional[str] = None
    virtual_institute_focus: Optional[str] = None
    admin_clearance_level: Optional[str] = None
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
    full_name: Optional[str] = None
    institution_name: Optional[str] = None
    institution_verified: bool
    storage_location: Optional[str] = None
    last_work_summary: Optional[str] = None
    digilocker_auto_fill_pending: Optional[bool] = False
    is_present_in_student_db: Optional[bool] = False
    student_db_reference: Optional[str] = None
    parent_verification_status: Optional[str] = None
    virtual_institute_name: Optional[str] = None
    parent_relation: Optional[str] = None
    source_of_income: Optional[str] = None
    income_bracket: Optional[str] = None
    linked_student_id: Optional[str] = None
    db_source: Optional[str] = "primary_eduidentity"
    federation_status: Optional[str] = "7_DATABASES_ONLINE"
    unread_notifications: Optional[int] = 0
    career_profile: Optional[dict] = None
    last_login_at: Optional[str] = None

class WorkActionRequest(BaseModel):
    action_type: str
    description: str
    metadata: Optional[dict] = None

class OtpSendRequest(BaseModel):
    email: str

class OtpVerifyRequest(BaseModel):
    email: str
    otp_code: str

class MobileOtpSendRequest(BaseModel):
    mobile_number: str

class MobileOtpVerifyRequest(BaseModel):
    mobile_number: str
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

class UnifiedChatMessageModel(Base):
    """
    Unified chat storage partitioned across 3 categories:
    - PERSONAL: Direct 1-on-1 conversations between students, mentors, parents, or AI advisor
    - PRIVATE: Enclosed restricted group/community channels (study groups, faculty councils, admin councils)
    - GLOBAL: Campus-wide broadcast, all-institution announcements, and public student-faculty agora
    """
    __tablename__ = "unified_chat_messages"

    id = Column(String, primary_key=True, index=True)
    category = Column(String, index=True, default="GLOBAL")  # "PERSONAL", "PRIVATE", "GLOBAL"
    channel_id = Column(String, index=True, default="campus_global") # target group_id, recipient username, or 'campus_global'
    sender_username = Column(String, index=True)
    sender_name = Column(String)
    sender_role = Column(String)
    recipient_username = Column(String, index=True, nullable=True) # for PERSONAL direct messaging
    message = Column(Text)
    criteria = Column(String, nullable=True) # Active educational criterion (e.g. POLICY_REGULATION, QUIZ_GENERATION, etc.)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_read = Column(Boolean, default=False)

class UnifiedChatSendRequest(BaseModel):
    category: str = "GLOBAL"  # "PERSONAL", "PRIVATE", "GLOBAL"
    channel_id: Optional[str] = "campus_global"
    recipient_username: Optional[str] = None
    message: str
    criteria: Optional[str] = None # Optional educational criteria override

class UnifiedChatMessageResponse(BaseModel):
    id: str
    category: str
    channel_id: str
    sender_username: str
    sender_name: str
    sender_role: str
    recipient_username: Optional[str] = None
    message: str
    criteria: Optional[str] = None
    timestamp: datetime
    is_read: bool = False

    class Config:
        from_attributes = True

class ChatCategorySummary(BaseModel):
    category: str
    description: str
    total_messages: int
    unread_count: int
    active_channels: List[str]

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

class ParentSearchRequest(BaseModel):
    query: str

class ParentCreateRequest(BaseModel):
    username: str
    password: str
    full_name: str
    personal_email: str
    mobile_number: Optional[str] = None

class AdvancedStudentRegisterRequest(BaseModel):
    full_name: str
    gender: str
    personal_email: str
    mobile_number: str
    mobile_verified: bool = True
    aadhaar_number: str
    digilocker_verified: bool = True
    parent_username: Optional[str] = None
    create_parent: Optional[ParentCreateRequest] = None
    institution_name: str
    username: str
    password: str

class CountryIdVerifyRequest(BaseModel):
    country_id_number: str
    country_id_type: str = "Aadhaar / National ID"

class CountryIdVerifyResponse(BaseModel):
    verified: bool
    country_id_number: str
    country_id_type: str
    status: str
    message: str

class CrossRoleCheckRequest(BaseModel):
    identifier: str

class CrossRoleCheckResponse(BaseModel):
    found: bool
    role: Optional[str] = None
    message: str
    student_id: Optional[str] = None
    student_name: Optional[str] = None
    department: Optional[str] = None

class StudentRoleRegisterRequest(BaseModel):
    name: str
    gender: str
    personal_email: str
    mobile_number: str
    mobile_verified: bool = True
    country_id_number: str
    country_id_type: str = "Aadhaar / National ID"
    country_id_verified: bool = True
    parent_verification_status: str = "ALIVE" # ALIVE, DECEASED, ADOPTED
    parent_username: Optional[str] = None
    create_parent: Optional[ParentCreateRequest] = None
    institution_name: str
    username: str
    password: str

class ParentRoleRegisterRequest(BaseModel):
    name: str
    gender: str
    personal_email: str
    mobile_number: str
    mobile_verified: bool = True
    country_id_number: str
    country_id_type: str = "Aadhaar / National ID"
    country_id_verified: bool = True
    parent_verification_status: str = "ALIVE" # Biological / Adoptive / Single Surviving
    parent_relation: Optional[str] = "Biological"
    source_of_income: str # Salaried, Business, Government Service, Agriculture, Self-Employed, Retired, Other
    income_bracket: Optional[str] = "3-8 LPA"
    linked_student_id: Optional[str] = None
    username: str
    password: str

class MentorTeacherRegisterRequest(BaseModel):
    name: str
    gender: str
    personal_email: str
    mobile_number: str
    mobile_verified: bool = True
    country_id_number: str
    country_id_type: str = "Aadhaar / National ID / Faculty ID"
    country_id_verified: bool = True
    parent_verification_status: str = "ALIVE"
    institute_affiliation_type: str = "EXISTING" # EXISTING or VIRTUAL
    affiliated_institute_name: Optional[str] = None
    virtual_institute_name: Optional[str] = None
    virtual_institute_focus: Optional[str] = None
    username: str
    password: str

class InstituteRoleRegisterRequest(BaseModel):
    name: str
    location: str
    institution_type: str = "University" # University, Autonomous College, Polytechnic, School (K-12), EdTech / Coaching, Research Institute, Virtual University
    accreditation_number: str # AISHE / UGC / AICTE / CBSE / State / ISO Code
    educational_domain: str # STEM & AI, Medical, Engineering, Humanities, Vocational, etc.
    mission_scope: str # Purpose & what it does
    admin_email: str
    username: str
    password: str

class AdminRoleRegisterRequest(BaseModel):
    name: str
    admin_clearance_level: str = "SUPER_ADMIN" # SUPER_ADMIN, REGIONAL_DIRECTOR, SYSTEM_CONTROLLER
    admin_master_token: str # Master passcode verification
    personal_email: str
    mobile_number: Optional[str] = None
    username: str
    password: str

class InstitutionResponse(BaseModel):
    id: str
    name: str
    status: str
    requested_by: Optional[str] = None
    location: Optional[str] = None
    institution_type: Optional[str] = None
    accreditation_number: Optional[str] = None
    accreditation_verified: bool = False
    educational_domain: Optional[str] = None
    mission_scope: Optional[str] = None
    is_virtual: bool = False
    created_at: datetime

    class Config:
        from_attributes = True



