import os
import time
import json
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List

from sqlalchemy import (
    create_engine, Column, String, Integer, Float, Boolean, DateTime, Text, text, inspect
)
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Session
from backend.core.config import settings

# Ensure databases directory exists
os.makedirs(settings.DB_DIR, exist_ok=True)

# -----------------------------------------------------------------------
# 1. Declarative Bases — one per domain database
# -----------------------------------------------------------------------
class AuthBase(DeclarativeBase):
    pass

class AcademicBase(DeclarativeBase):
    pass

class FamilyBase(DeclarativeBase):
    pass

class InstituteBase(DeclarativeBase):
    pass

class SecurityBase(DeclarativeBase):
    pass

class CareerBase(DeclarativeBase):
    pass

class NotificationsBase(DeclarativeBase):
    pass

# -----------------------------------------------------------------------
# 2. Domain Models
# -----------------------------------------------------------------------

# ── DB 1: Auth & IAM (auth_iam.db) ─────────────────────────────────────
class IAMUser(AuthBase):
    __tablename__ = "iam_users"

    id                   = Column(String, primary_key=True, index=True)
    username             = Column(String, unique=True, index=True)
    email                = Column(String, unique=True, index=True)
    personal_email       = Column(String, nullable=True)
    hashed_password      = Column(String, nullable=False)
    role                 = Column(String, default="student")
    admin_clearance_level = Column(String, nullable=True)
    admin_master_token   = Column(String, nullable=True)
    country_id_number    = Column(String, nullable=True)
    country_id_verified  = Column(Boolean, default=False)
    is_permanent         = Column(Boolean, default=False)
    is_active            = Column(Boolean, default=True)
    login_count          = Column(Integer, default=0)
    failed_login_attempts = Column(Integer, default=0)
    last_failed_login_at  = Column(DateTime, nullable=True)
    created_at           = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_login_at        = Column(DateTime, nullable=True)

class IAMSessionToken(AuthBase):
    __tablename__ = "iam_session_tokens"

    id          = Column(String, primary_key=True, index=True)
    username    = Column(String, index=True)
    role        = Column(String)
    token_hash  = Column(String, index=True)
    client_ip   = Column(String, nullable=True)
    user_agent  = Column(String, nullable=True)
    issued_at   = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at  = Column(DateTime)

# ── DB 2: Academic SIS (academic_sis.db) ────────────────────────────────
class SISStudent(AcademicBase):
    __tablename__ = "sis_students"

    id                   = Column(String, primary_key=True, index=True)
    roll_no              = Column(String, unique=True, index=True)
    name                 = Column(String, index=True)
    email                = Column(String, unique=True, index=True)
    department           = Column(String)
    semester             = Column(String)
    cgpa                 = Column(String)
    attendance_percentage = Column(String)
    credits_earned       = Column(String)
    max_credits          = Column(String)
    backlogs             = Column(Integer, default=0)
    apaar_id             = Column(String, nullable=True)
    digilocker_verified  = Column(Boolean, default=False)
    status               = Column(String, default="VERIFIED")
    created_at           = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SISCourseEnrollment(AcademicBase):
    __tablename__ = "sis_course_enrollments"

    id          = Column(String, primary_key=True, index=True)
    student_id  = Column(String, index=True)
    course_code = Column(String)
    course_name = Column(String)
    credits     = Column(Integer, default=4)
    semester    = Column(String)
    grade       = Column(String, default="A")

# ── DB 3: Family Heritage Registry (family_heritage.db) ─────────────────
class ParentGuardian(FamilyBase):
    __tablename__ = "parent_guardians"

    id                   = Column(String, primary_key=True, index=True)
    parent_username      = Column(String, unique=True, index=True)
    full_name            = Column(String)
    gender               = Column(String, default="Male")
    personal_email       = Column(String, unique=True, index=True)
    mobile_number        = Column(String, nullable=True)
    country_id_number    = Column(String, nullable=True)
    country_id_verified  = Column(Boolean, default=False)
    vital_status         = Column(String, default="ALIVE")   # ALIVE, DECEASED, ADOPTED
    relationship_to_ward = Column(String, default="Biological")
    source_of_income     = Column(String, nullable=True)
    income_bracket       = Column(String, nullable=True)
    is_alumni            = Column(Boolean, default=False)
    alumni_reference     = Column(String, nullable=True)
    created_at           = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class FamilyWardLink(FamilyBase):
    __tablename__ = "family_ward_links"

    id                  = Column(String, primary_key=True, index=True)
    parent_username     = Column(String, index=True)
    student_identifier  = Column(String, index=True)   # username or roll_no
    verification_status = Column(String, default="CONFIRMED")
    linked_at           = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AlumniHeritage(FamilyBase):
    __tablename__ = "alumni_heritage_registry"

    id                = Column(String, primary_key=True, index=True)
    person_identifier = Column(String, unique=True, index=True)
    full_name         = Column(String)
    degree            = Column(String)
    graduating_batch  = Column(String)
    is_verified_alumni = Column(Boolean, default=True)

# ── DB 4: Institutions Governance & Accreditation (institutions_governance.db) ──
class GovernanceInstitution(InstituteBase):
    __tablename__ = "governance_institutions"

    id                   = Column(String, primary_key=True, index=True)
    name                 = Column(String, unique=True, index=True)
    institution_type     = Column(String, default="University")
    location             = Column(String)
    educational_domain   = Column(String)
    mission_scope        = Column(Text, nullable=True)
    is_virtual           = Column(Boolean, default=False)
    status               = Column(String, default="VERIFIED")
    requested_by         = Column(String, nullable=True)
    accreditation_number = Column(String, nullable=True)
    accreditation_verified = Column(Boolean, default=False)
    created_at           = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class VirtualCampus(InstituteBase):
    __tablename__ = "virtual_campuses"

    id                    = Column(String, primary_key=True, index=True)
    name                  = Column(String, unique=True, index=True)
    founder_mentor_username = Column(String, index=True)
    focus_domain          = Column(String)
    active_mentees        = Column(Integer, default=0)
    created_at            = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ── DB 5: Security Audit, Threat Intel & Biometrics (security_audit.db) ──
class SecurityAuditEvent(SecurityBase):
    __tablename__ = "security_audit_events"

    id             = Column(String, primary_key=True, index=True)
    event_type     = Column(String, index=True)
    actor_username = Column(String, index=True)
    actor_role     = Column(String)
    target_entity  = Column(String, nullable=True)
    client_ip      = Column(String, nullable=True)
    status         = Column(String, default="SUCCESS")
    details_json   = Column(Text, nullable=True)
    timestamp      = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ThreatIntelligenceRecord(SecurityBase):
    __tablename__ = "threat_intelligence_records"

    id              = Column(String, primary_key=True, index=True)
    url_or_domain   = Column(String, unique=True, index=True)
    trust_score     = Column(Float)
    is_safe         = Column(Boolean)
    category        = Column(String)
    indicators_json = Column(Text, nullable=True)
    scanned_at      = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ── DB 6: Career Pathways, Skills & Placements (career_pathways.db) ──────
class CareerProfile(CareerBase):
    """One record per registered user — tracks career trajectory."""
    __tablename__ = "career_profiles"

    id              = Column(String, primary_key=True, index=True)
    username        = Column(String, unique=True, index=True)
    full_name       = Column(String)
    role            = Column(String, default="student")
    institution     = Column(String, nullable=True)
    skills_json     = Column(Text, default="[]")           # JSON list of skill strings
    career_goal     = Column(String, nullable=True)
    linkedin_url    = Column(String, nullable=True)
    github_url      = Column(String, nullable=True)
    portfolio_url   = Column(String, nullable=True)
    placement_status = Column(String, default="SEEKING")   # SEEKING, PLACED, HIGHER_STUDIES
    company_placed  = Column(String, nullable=True)
    placement_ctc   = Column(String, nullable=True)
    created_at      = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at      = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class InternshipRecord(CareerBase):
    """Internship and work experience entries per user."""
    __tablename__ = "internship_records"

    id          = Column(String, primary_key=True, index=True)
    username    = Column(String, index=True)
    company     = Column(String)
    role_title  = Column(String)
    duration    = Column(String)            # e.g. "Jun 2025 – Aug 2025"
    stipend     = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    certificate_ref = Column(String, nullable=True)
    created_at  = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class PlacementDriveEntry(CareerBase):
    """Campus placement drive participation records."""
    __tablename__ = "placement_drive_entries"

    id              = Column(String, primary_key=True, index=True)
    username        = Column(String, index=True)
    company_name    = Column(String)
    drive_date      = Column(String, nullable=True)
    round_cleared   = Column(String, default="Applied")  # Applied, Written, HR, Offer
    offer_received  = Column(Boolean, default=False)
    offer_ctc       = Column(String, nullable=True)
    created_at      = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ── DB 7: Notifications, Events & System Alerts (notifications_events.db) ──
class NotificationRecord(NotificationsBase):
    """Per-user notification and system alert records."""
    __tablename__ = "notification_records"

    id           = Column(String, primary_key=True, index=True)
    username     = Column(String, index=True)
    title        = Column(String)
    body         = Column(Text)
    category     = Column(String, default="GENERAL")   # GENERAL, AUTH, ACADEMIC, CAREER, ADMIN
    priority     = Column(String, default="NORMAL")    # LOW, NORMAL, HIGH, CRITICAL
    is_read      = Column(Boolean, default=False)
    action_url   = Column(String, nullable=True)
    created_at   = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SystemEventLog(NotificationsBase):
    """Global system-level event/announcement log."""
    __tablename__ = "system_event_logs"

    id           = Column(String, primary_key=True, index=True)
    event_name   = Column(String, index=True)
    triggered_by = Column(String, nullable=True)   # username or "system"
    scope        = Column(String, default="GLOBAL")  # GLOBAL, ROLE, USER
    scope_target = Column(String, nullable=True)     # role name or username
    message      = Column(Text)
    meta_json    = Column(Text, default="{}")
    created_at   = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# -----------------------------------------------------------------------
# 3. Engines & Session Factories
# -----------------------------------------------------------------------
_sqlite_args = {"check_same_thread": False}

auth_engine         = create_engine(settings.AUTH_DB_URL,          connect_args=_sqlite_args)
academic_engine     = create_engine(settings.ACADEMIC_DB_URL,      connect_args=_sqlite_args)
family_engine       = create_engine(settings.FAMILY_DB_URL,        connect_args=_sqlite_args)
institute_engine    = create_engine(settings.INSTITUTE_DB_URL,     connect_args=_sqlite_args)
security_engine     = create_engine(settings.SECURITY_DB_URL,      connect_args=_sqlite_args)
career_engine       = create_engine(settings.CAREER_DB_URL,        connect_args=_sqlite_args)
notifications_engine = create_engine(settings.NOTIFICATIONS_DB_URL, connect_args=_sqlite_args)

AuthSession          = sessionmaker(autocommit=False, autoflush=False, bind=auth_engine)
AcademicSession      = sessionmaker(autocommit=False, autoflush=False, bind=academic_engine)
FamilySession        = sessionmaker(autocommit=False, autoflush=False, bind=family_engine)
InstituteSession     = sessionmaker(autocommit=False, autoflush=False, bind=institute_engine)
SecuritySession      = sessionmaker(autocommit=False, autoflush=False, bind=security_engine)
CareerSession        = sessionmaker(autocommit=False, autoflush=False, bind=career_engine)
NotificationsSession = sessionmaker(autocommit=False, autoflush=False, bind=notifications_engine)

# -----------------------------------------------------------------------
# 4. Database Federation Manager
# -----------------------------------------------------------------------
class DatabaseFederationManager:
    """
    Coordinates federated reads, writes, and health checks across
    7 specialized domain databases.
    """

    # ── Initialisation ──────────────────────────────────────────────────
    @classmethod
    def init_all_databases(cls):
        """Create tables across all 7 domain databases and seed baseline data."""
        AuthBase.metadata.create_all(bind=auth_engine)
        AcademicBase.metadata.create_all(bind=academic_engine)
        FamilyBase.metadata.create_all(bind=family_engine)
        InstituteBase.metadata.create_all(bind=institute_engine)
        SecurityBase.metadata.create_all(bind=security_engine)
        CareerBase.metadata.create_all(bind=career_engine)
        NotificationsBase.metadata.create_all(bind=notifications_engine)

        # Automatic schema migration for pre-existing tables in federated DBs
        cls._migrate_federated_schemas()

        cls._seed_auth_iam()
        cls._seed_academic_sis()
        cls._seed_family_heritage()
        cls._seed_institutions_governance()
        cls._seed_career_profiles()
        cls._seed_notifications()

    @classmethod
    def _migrate_federated_schemas(cls):
        """Auto-add newly introduced columns to existing sqlite database tables."""
        try:
            insp = inspect(auth_engine)
            if "iam_users" in insp.get_table_names():
                cols = {c["name"] for c in insp.get_columns("iam_users")}
                missing = {
                    "login_count": "INTEGER DEFAULT 0",
                    "failed_login_attempts": "INTEGER DEFAULT 0",
                    "last_failed_login_at": "DATETIME",
                    "is_active": "BOOLEAN DEFAULT 1",
                    "is_permanent": "BOOLEAN DEFAULT 0"
                }
                with auth_engine.connect() as conn:
                    for col_name, col_type in missing.items():
                        if col_name not in cols:
                            conn.execute(text(f"ALTER TABLE iam_users ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
            
            if "iam_session_tokens" in insp.get_table_names():
                tok_cols = {c["name"] for c in insp.get_columns("iam_session_tokens")}
                if "user_agent" not in tok_cols:
                    with auth_engine.connect() as conn:
                        conn.execute(text("ALTER TABLE iam_session_tokens ADD COLUMN user_agent VARCHAR"))
                        conn.commit()
        except Exception as e:
            print(f"[FEDERATED MIGRATION NOTICE] {e}")

    # ── Seed Methods ─────────────────────────────────────────────────────
    @classmethod
    def _seed_auth_iam(cls):
        from passlib.context import CryptContext
        pwd_ctx = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

        with AuthSession() as db:
            if not db.query(IAMUser).filter(IAMUser.username == "msrch").first():
                db.add(IAMUser(
                    id="usr_msrch_iam",
                    username="msrch",
                    email="msrch@uni.edu",
                    personal_email="msrch.dev@gmail.com",
                    hashed_password=pwd_ctx.hash("msrch1410#"),
                    role="admin",
                    admin_clearance_level="SUPER_ADMIN",
                    admin_master_token="MSRCH-ROOT-2026",
                    is_permanent=True,
                    login_count=0
                ))

            demos = [
                ("amit",           "amit@uni.edu",            "student",  "amit123",    "9876-5432-1098"),
                ("faculty",        "faculty@uni.edu",          "faculty",  "faculty123", "4321-8765-9876"),
                ("parent_alex",    "rajesh.sharma@gmail.com",  "parent",   "parent123",  "8765-4321-1234"),
                ("institute_admin","director@glbitm.ac.in",    "institute","inst123",    "AICTE-UP-2026"),
                ("admin",          "admin@uni.edu",            "admin",    "admin123",   "MSRCH-ROOT-2026"),
            ]
            for uname, mail, role, pwd, cid in demos:
                if not db.query(IAMUser).filter(IAMUser.username == uname).first():
                    db.add(IAMUser(
                        id=f"usr_{uname}_iam",
                        username=uname,
                        email=mail,
                        personal_email=mail,
                        hashed_password=pwd_ctx.hash(pwd),
                        role=role,
                        country_id_number=cid,
                        country_id_verified=True,
                        admin_clearance_level="SUPER_ADMIN" if role == "admin" else None,
                        login_count=0
                    ))
            db.commit()

    @classmethod
    def _seed_academic_sis(cls):
        with AcademicSession() as db:
            if not db.query(SISStudent).filter(SISStudent.roll_no == "CS-2022-04").first():
                db.add(SISStudent(
                    id="stu_amit_sis",
                    roll_no="CS-2022-04",
                    name="Amit Sharma",
                    email="amit@uni.edu",
                    department="Computer Science",
                    semester="6th Semester",
                    cgpa="8.2",
                    attendance_percentage="85.0",
                    credits_earned="96",
                    max_credits="160",
                    backlogs=0,
                    apaar_id="APAAR-9988-7766-5544",
                    digilocker_verified=True,
                    status="VERIFIED"
                ))
            db.commit()

    @classmethod
    def _seed_family_heritage(cls):
        with FamilySession() as db:
            if not db.query(ParentGuardian).filter(ParentGuardian.parent_username == "parent_alex").first():
                db.add(ParentGuardian(
                    id="par_alex_heritage",
                    parent_username="parent_alex",
                    full_name="Mr. Rajesh Sharma",
                    gender="Male",
                    personal_email="rajesh.sharma@gmail.com",
                    mobile_number="+91 9876543211",
                    country_id_number="8765-4321-1234",
                    country_id_verified=True,
                    vital_status="ALIVE",
                    relationship_to_ward="Biological",
                    source_of_income="Salaried (Senior IT Architect)",
                    income_bracket="8-15 LPA",
                    is_alumni=True,
                    alumni_reference="Alumni Record: Rajesh Sharma (Batch of 2002)"
                ))

            if not db.query(FamilyWardLink).filter(FamilyWardLink.parent_username == "parent_alex").first():
                db.add(FamilyWardLink(
                    id="link_alex_amit",
                    parent_username="parent_alex",
                    student_identifier="amit",
                    verification_status="CONFIRMED"
                ))

            known_alumni = [
                ("rajesh.sharma@gmail.com", "Rajesh Sharma",   "B.Tech Computer Science",          "2002"),
                ("dr.priya.sen@gmail.com",  "Dr. Priya Sen",   "M.Tech & Ph.D Computer Science",   "2018"),
                ("8765-4321-1234",          "Rajesh Sharma",   "B.Tech Computer Science",          "2002"),
                ("4321-8765-9876",          "Dr. Priya Sen",   "M.Tech & Ph.D Computer Science",   "2018"),
                ("amit@uni.edu",            "Amit Sharma",     "B.Tech Computer Science (Enrolled)","2026"),
            ]
            for ident, name, deg, batch in known_alumni:
                if not db.query(AlumniHeritage).filter(AlumniHeritage.person_identifier == ident).first():
                    db.add(AlumniHeritage(
                        id=f"alm_{uuid.uuid4().hex[:8]}",
                        person_identifier=ident,
                        full_name=name,
                        degree=deg,
                        graduating_batch=batch,
                        is_verified_alumni=True
                    ))
            db.commit()

    @classmethod
    def _seed_institutions_governance(cls):
        with InstituteSession() as db:
            if not db.query(GovernanceInstitution).filter(
                GovernanceInstitution.name == "GL Bajaj Institute of Technology and Management"
            ).first():
                db.add(GovernanceInstitution(
                    id="inst_glbitm_gov",
                    name="GL Bajaj Institute of Technology and Management",
                    institution_type="Autonomous College",
                    location="Greater Noida, Uttar Pradesh, India",
                    educational_domain="Engineering, Technology & Applied AI",
                    mission_scope="Empowering future-ready engineers with high-standard academic programs.",
                    is_virtual=False,
                    status="VERIFIED",
                    requested_by="system",
                    accreditation_number="AICTE-UP-2026-REG",
                    accreditation_verified=True
                ))
            db.commit()

    @classmethod
    def _seed_career_profiles(cls):
        """Seed career profiles for demo accounts."""
        demo_profiles = [
            ("amit",           "Amit Sharma",                      "student",   "GL Bajaj",
             '["Python","Machine Learning","Data Structures","SQL"]', "AI/ML Engineer",
             "SEEKING"),
            ("faculty",        "Dr. Priya Sen",                     "faculty",   "GL Bajaj",
             '["AI Research","Python","Academic Mentoring","NLP"]',  "AI Research & Teaching",
             "PLACED"),
            ("parent_alex",    "Mr. Rajesh Sharma",                 "parent",    "Parent Portal",
             '["Project Management","Enterprise Architecture"]',      "Retired Senior Architect",
             "PLACED"),
            ("institute_admin","GL Bajaj Academic Directorate",      "institute", "GL Bajaj",
             '["Institutional Governance","NAAC Accreditation"]',     "Academic Excellence",
             "PLACED"),
            ("msrch",          "Master Developer / Administrator",   "admin",     "GL Bajaj",
             '["Full Stack Development","AI Engineering","DevOps","System Architecture"]',
             "Universal Admin & Builder", "PLACED"),
        ]
        with CareerSession() as db:
            for uname, fname, role, inst, skills, goal, status in demo_profiles:
                if not db.query(CareerProfile).filter(CareerProfile.username == uname).first():
                    db.add(CareerProfile(
                        id=f"car_{uname}_profile",
                        username=uname,
                        full_name=fname,
                        role=role,
                        institution=inst,
                        skills_json=skills,
                        career_goal=goal,
                        placement_status=status,
                        company_placed="GL Bajaj Group" if status == "PLACED" else None,
                        placement_ctc="15 LPA" if status == "PLACED" else None
                    ))
            db.commit()

    @classmethod
    def _seed_notifications(cls):
        """Seed welcome and system notification records for demo users."""
        demo_notifs = [
            ("amit",           "Welcome to EduIdentityAI!",
             "Your student profile is active. Explore AI Guidance, biometrics, and DigiLocker sync.",
             "AUTH", "HIGH"),
            ("faculty",        "Faculty Portal Activated",
             "Your faculty workspace is ready. Manage mentees and explore AI teaching tools.",
             "AUTH", "HIGH"),
            ("parent_alex",    "Parent Portal Unlocked",
             "You can now view your ward's academic progress, attendance, and financial status.",
             "AUTH", "NORMAL"),
            ("institute_admin","Institution Verified",
             "GL Bajaj Institute is verified. You can now manage accreditation and student records.",
             "ADMIN", "HIGH"),
            ("msrch",          "SUPER_ADMIN Access Granted",
             "Universal developer admin access confirmed. All 7 database domains are online.",
             "ADMIN", "CRITICAL"),
        ]
        with NotificationsSession() as db:
            for uname, title, body, cat, pri in demo_notifs:
                if not db.query(NotificationRecord).filter(
                    NotificationRecord.username == uname,
                    NotificationRecord.category == "AUTH"
                ).first():
                    db.add(NotificationRecord(
                        id=f"notif_{uname}_{uuid.uuid4().hex[:8]}",
                        username=uname,
                        title=title,
                        body=body,
                        category=cat,
                        priority=pri,
                        is_read=False
                    ))

            # System-level boot event
            if not db.query(SystemEventLog).filter(SystemEventLog.event_name == "SYSTEM_BOOT").first():
                db.add(SystemEventLog(
                    id=f"sys_{uuid.uuid4().hex[:8]}",
                    event_name="SYSTEM_BOOT",
                    triggered_by="system",
                    scope="GLOBAL",
                    message="EduIdentityAI 7-Domain Federation initialised successfully.",
                    meta_json=json.dumps({"db_count": 7, "version": "2.4.0"})
                ))
            db.commit()

    # ── Login Sync ───────────────────────────────────────────────────────
    @classmethod
    def sync_login(
        cls,
        username: str,
        role: str,
        client_ip: str = "127.0.0.1",
        user_agent: str = "Unknown",
        token_hash: str = "",
        expires_at: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """
        Called after a successful login.
        1. Updates last_login_at and login_count in auth_iam.db.
        2. Resets failed_login_attempts.
        3. Writes an IAMSessionToken row.
        4. Records a security audit event.
        5. Creates an unread login-notification for the user.
        6. Returns career profile and unread notification count.
        """
        now = datetime.now(timezone.utc)

        # 1. Update IAM user record
        with AuthSession() as adb:
            iam_user = adb.query(IAMUser).filter(IAMUser.username == username).first()
            if iam_user:
                iam_user.last_login_at = now
                iam_user.login_count = (iam_user.login_count or 0) + 1
                iam_user.failed_login_attempts = 0
                adb.commit()

            # 2. Store session token in IAM DB
            if token_hash and expires_at:
                session_tok = IAMSessionToken(
                    id=f"sess_{uuid.uuid4().hex[:12]}",
                    username=username,
                    role=role,
                    token_hash=token_hash[:64],
                    client_ip=client_ip,
                    user_agent=user_agent[:200] if user_agent else None,
                    issued_at=now,
                    expires_at=expires_at
                )
                adb.add(session_tok)
                adb.commit()

        # 3. Security audit
        cls.record_audit_event(
            event_type="USER_LOGIN",
            actor_username=username,
            actor_role=role,
            client_ip=client_ip,
            status="SUCCESS",
            details={"user_agent": user_agent[:100] if user_agent else "Unknown"}
        )

        # 4. Create login notification
        try:
            with NotificationsSession() as ndb:
                ndb.add(NotificationRecord(
                    id=f"notif_login_{uuid.uuid4().hex[:12]}",
                    username=username,
                    title="New Login Detected",
                    body=f"Secure login from IP {client_ip} at {now.strftime('%Y-%m-%d %H:%M UTC')}.",
                    category="AUTH",
                    priority="NORMAL",
                    is_read=False
                ))
                ndb.commit()
        except Exception:
            pass

        # 5. Fetch career profile
        career_info = None
        try:
            with CareerSession() as cdb:
                cp = cdb.query(CareerProfile).filter(CareerProfile.username == username).first()
                if cp:
                    career_info = {
                        "career_goal": cp.career_goal,
                        "placement_status": cp.placement_status,
                        "skills": json.loads(cp.skills_json or "[]"),
                        "company_placed": cp.company_placed,
                    }
        except Exception:
            pass

        # 6. Unread notification count
        unread_count = 0
        try:
            with NotificationsSession() as ndb:
                unread_count = ndb.query(NotificationRecord).filter(
                    NotificationRecord.username == username,
                    NotificationRecord.is_read == False
                ).count()
        except Exception:
            pass

        return {
            "last_login_at": now.isoformat(),
            "career_profile": career_info,
            "unread_notifications": unread_count
        }

    @classmethod
    def record_failed_login(cls, username: str, client_ip: str = "127.0.0.1"):
        """Increment failed login counter and record audit event."""
        try:
            with AuthSession() as adb:
                iam_user = adb.query(IAMUser).filter(IAMUser.username == username).first()
                if iam_user:
                    iam_user.failed_login_attempts = (iam_user.failed_login_attempts or 0) + 1
                    iam_user.last_failed_login_at = datetime.now(timezone.utc)
                    adb.commit()
        except Exception:
            pass

        cls.record_audit_event(
            event_type="LOGIN_FAILED",
            actor_username=username,
            actor_role="unknown",
            client_ip=client_ip,
            status="FAILURE",
            details={"reason": "Invalid credentials"}
        )

    @classmethod
    def lookup_iam_user(cls, username: str) -> Optional[Dict[str, Any]]:
        """
        Check auth_iam.db for a user — used as fallback auth source when the
        primary eduidentity.db doesn't have the user yet.
        Returns hashed_password + role if found, else None.
        """
        try:
            with AuthSession() as adb:
                iam = adb.query(IAMUser).filter(IAMUser.username == username).first()
                if iam:
                    return {
                        "username": iam.username,
                        "email": iam.email,
                        "hashed_password": iam.hashed_password,
                        "role": iam.role,
                        "is_permanent": iam.is_permanent,
                        "is_active": iam.is_active,
                        "admin_clearance_level": iam.admin_clearance_level,
                        "last_login_at": iam.last_login_at.isoformat() if iam.last_login_at else None,
                        "login_count": iam.login_count or 0,
                        "failed_login_attempts": iam.failed_login_attempts or 0,
                    }
        except Exception:
            pass
        return None

    # ── Security Audit ───────────────────────────────────────────────────
    @classmethod
    def record_audit_event(
        cls,
        event_type: str,
        actor_username: str,
        actor_role: str,
        client_ip: Optional[str] = "127.0.0.1",
        status: str = "SUCCESS",
        details: Optional[Dict[str, Any]] = None,
        target_entity: Optional[str] = None
    ):
        try:
            with SecuritySession() as db:
                db.add(SecurityAuditEvent(
                    id=f"audit_{uuid.uuid4().hex[:12]}",
                    event_type=event_type,
                    actor_username=actor_username or "anonymous",
                    actor_role=actor_role or "guest",
                    target_entity=target_entity,
                    client_ip=client_ip,
                    status=status,
                    details_json=json.dumps(details or {}),
                    timestamp=datetime.now(timezone.utc)
                ))
                db.commit()
        except Exception as e:
            print(f"[SECURITY DB AUDIT WARNING] Could not write audit log: {e}")

    # ── Cross-Role Alumni Check ──────────────────────────────────────────
    @classmethod
    def check_alumni_cross_role(cls, identifier: str) -> Optional[Dict[str, Any]]:
        ident_clean = (identifier or "").strip().lower()
        if not ident_clean:
            return None

        with FamilySession() as fdb:
            alumni = fdb.query(AlumniHeritage).filter(
                (AlumniHeritage.person_identifier.ilike(f"%{ident_clean}%")) |
                (AlumniHeritage.full_name.ilike(f"%{ident_clean}%"))
            ).first()
            if alumni:
                return {
                    "found": True,
                    "database": "family_heritage.db",
                    "full_name": alumni.full_name,
                    "degree": alumni.degree,
                    "batch": alumni.graduating_batch,
                    "reference": f"Alumni Record: {alumni.full_name} ({alumni.degree}, {alumni.graduating_batch})"
                }

        with AcademicSession() as adb:
            student = adb.query(SISStudent).filter(
                (SISStudent.roll_no.ilike(f"%{ident_clean}%")) |
                (SISStudent.email.ilike(f"%{ident_clean}%")) |
                (SISStudent.name.ilike(f"%{ident_clean}%"))
            ).first()
            if student:
                return {
                    "found": True,
                    "database": "academic_sis.db",
                    "full_name": student.name,
                    "roll_no": student.roll_no,
                    "department": student.department,
                    "reference": f"Active SIS Student: {student.name} ({student.roll_no}, {student.department})"
                }

        return None

    # ── Registration Federation Helpers ─────────────────────────────────
    @classmethod
    def _create_career_profile(cls, username: str, full_name: str, role: str, institution: str):
        """Create a blank career profile on registration."""
        try:
            with CareerSession() as cdb:
                if not cdb.query(CareerProfile).filter(CareerProfile.username == username).first():
                    cdb.add(CareerProfile(
                        id=f"car_{uuid.uuid4().hex[:8]}",
                        username=username,
                        full_name=full_name,
                        role=role,
                        institution=institution,
                        skills_json="[]",
                        placement_status="SEEKING",
                    ))
                    cdb.commit()
        except Exception as e:
            print(f"[CAREER DB WARNING] Could not create career profile: {e}")

    @classmethod
    def _create_welcome_notification(cls, username: str, role: str, institution: str):
        """Push a welcome notification on registration."""
        role_messages = {
            "student":   ("Welcome, Student! 🎓",
                          f"Your student account is live at {institution}. "
                          "Explore AI Guidance, DigiLocker sync, and biometric verification."),
            "faculty":   ("Faculty Workspace Ready 📚",
                          f"Welcome to {institution}. "
                          "Your faculty portal is active — manage students and AI mentoring tools."),
            "parent":    ("Parent Portal Activated 👨‍👩‍👧",
                          "You can now monitor your ward's academic progress, "
                          "attendance records, and career development."),
            "institute": ("Institution Registered ✅",
                          f"{institution} is now registered. "
                          "Manage accreditation, student records, and institution reports."),
            "admin":     ("Admin Clearance Granted 🔐",
                          "Your administrator account is active. "
                          "All 7 domain databases are accessible from the admin panel."),
        }
        title, body = role_messages.get(role, ("Account Created", "Your EduIdentityAI account is ready."))
        try:
            with NotificationsSession() as ndb:
                ndb.add(NotificationRecord(
                    id=f"notif_welcome_{uuid.uuid4().hex[:12]}",
                    username=username,
                    title=title,
                    body=body,
                    category="AUTH",
                    priority="HIGH",
                    is_read=False
                ))
                ndb.add(SystemEventLog(
                    id=f"sys_reg_{uuid.uuid4().hex[:8]}",
                    event_name="USER_REGISTERED",
                    triggered_by=username,
                    scope="USER",
                    scope_target=username,
                    message=f"New {role} account registered: {username} at {institution}",
                    meta_json=json.dumps({"role": role, "institution": institution})
                ))
                ndb.commit()
        except Exception as e:
            print(f"[NOTIFICATIONS DB WARNING] Could not create welcome notification: {e}")

    @classmethod
    def sync_student_registration(
        cls,
        username: str,
        email: str,
        hashed_password: str,
        name: str,
        gender: str,
        country_id_number: str,
        country_id_type: str,
        parent_status: str,
        parent_username: Optional[str],
        institution_name: str,
        client_ip: str = "127.0.0.1"
    ):
        """
        Syncs student registration across:
        auth_iam.db + academic_sis.db + family_heritage.db +
        career_pathways.db + notifications_events.db + security_audit.db
        """
        # 1. Auth IAM DB
        with AuthSession() as adb:
            if not adb.query(IAMUser).filter(IAMUser.username == username).first():
                adb.add(IAMUser(
                    id=f"usr_{uuid.uuid4().hex[:8]}",
                    username=username,
                    email=email,
                    personal_email=email,
                    hashed_password=hashed_password,
                    role="student",
                    country_id_number=country_id_number,
                    country_id_verified=True,
                    login_count=0
                ))
                adb.commit()

        # 2. Academic SIS DB
        with AcademicSession() as sdb:
            roll = f"UNI2026-{uuid.uuid4().hex[:4].upper()}"
            if not sdb.query(SISStudent).filter(SISStudent.email == email).first():
                sdb.add(SISStudent(
                    id=f"stu_{uuid.uuid4().hex[:8]}",
                    roll_no=roll,
                    name=name,
                    email=email,
                    department="Engineering & Technology",
                    semester="1st Semester",
                    cgpa="8.0",
                    attendance_percentage="100.0",
                    credits_earned="0",
                    max_credits="160",
                    backlogs=0,
                    apaar_id=f"APAAR-{uuid.uuid4().hex[:8].upper()}",
                    digilocker_verified=True,
                    status="VERIFIED"
                ))
                sdb.commit()

        # 3. Family Heritage DB link
        if parent_username:
            with FamilySession() as fdb:
                fdb.add(FamilyWardLink(
                    id=f"link_{uuid.uuid4().hex[:8]}",
                    parent_username=parent_username,
                    student_identifier=username,
                    verification_status=f"VERIFIED_{parent_status}"
                ))
                fdb.commit()

        # 4. Career Pathways DB
        cls._create_career_profile(username, name, "student", institution_name)

        # 5. Notifications DB
        cls._create_welcome_notification(username, "student", institution_name)

        # 6. Security Audit DB
        cls.record_audit_event(
            event_type="STUDENT_REGISTRATION",
            actor_username=username,
            actor_role="student",
            client_ip=client_ip,
            details={
                "institution": institution_name,
                "parent_status": parent_status,
                "country_id": country_id_number,
                "dbs_synced": ["auth_iam", "academic_sis", "family_heritage",
                               "career_pathways", "notifications_events"]
            }
        )

    @classmethod
    def sync_parent_registration(
        cls,
        username: str,
        email: str,
        hashed_password: str,
        name: str,
        gender: str,
        mobile: str,
        country_id_number: str,
        parent_status: str,
        parent_relation: str,
        source_of_income: str,
        income_bracket: str,
        linked_student_id: Optional[str],
        is_alumni: bool,
        alumni_ref: Optional[str],
        client_ip: str = "127.0.0.1"
    ):
        """
        Syncs parent registration across:
        auth_iam.db + family_heritage.db + career_pathways.db +
        notifications_events.db + security_audit.db
        """
        # 1. Auth IAM DB
        with AuthSession() as adb:
            if not adb.query(IAMUser).filter(IAMUser.username == username).first():
                adb.add(IAMUser(
                    id=f"usr_{uuid.uuid4().hex[:8]}",
                    username=username,
                    email=email,
                    personal_email=email,
                    hashed_password=hashed_password,
                    role="parent",
                    country_id_number=country_id_number,
                    country_id_verified=True,
                    login_count=0
                ))
                adb.commit()

        # 2. Family Heritage DB
        with FamilySession() as fdb:
            if not fdb.query(ParentGuardian).filter(ParentGuardian.parent_username == username).first():
                fdb.add(ParentGuardian(
                    id=f"par_{uuid.uuid4().hex[:8]}",
                    parent_username=username,
                    full_name=name,
                    gender=gender,
                    personal_email=email,
                    mobile_number=mobile,
                    country_id_number=country_id_number,
                    country_id_verified=True,
                    vital_status=parent_status,
                    relationship_to_ward=parent_relation,
                    source_of_income=source_of_income,
                    income_bracket=income_bracket,
                    is_alumni=is_alumni,
                    alumni_reference=alumni_ref
                ))
                fdb.commit()

            if linked_student_id:
                fdb.add(FamilyWardLink(
                    id=f"link_{uuid.uuid4().hex[:8]}",
                    parent_username=username,
                    student_identifier=linked_student_id,
                    verification_status="CONFIRMED"
                ))
                fdb.commit()

        # 3. Career Pathways DB
        cls._create_career_profile(username, name, "parent", "Parent Portal")

        # 4. Notifications DB
        cls._create_welcome_notification(username, "parent", "Parent Portal")

        # 5. Security Audit DB
        cls.record_audit_event(
            event_type="PARENT_REGISTRATION",
            actor_username=username,
            actor_role="parent",
            client_ip=client_ip,
            details={
                "vital_status": parent_status,
                "income": source_of_income,
                "linked_ward": linked_student_id,
                "dbs_synced": ["auth_iam", "family_heritage", "career_pathways", "notifications_events"]
            }
        )

    @classmethod
    def sync_mentor_registration(
        cls,
        username: str,
        email: str,
        hashed_password: str,
        name: str,
        country_id_number: str,
        affiliation_type: str,
        affiliated_institute: Optional[str],
        virtual_institute_name: Optional[str],
        virtual_institute_focus: Optional[str],
        client_ip: str = "127.0.0.1"
    ):
        """
        Syncs mentor/faculty registration across:
        auth_iam.db + institutions_governance.db + career_pathways.db +
        notifications_events.db + security_audit.db
        """
        # 1. Auth IAM DB
        with AuthSession() as adb:
            if not adb.query(IAMUser).filter(IAMUser.username == username).first():
                adb.add(IAMUser(
                    id=f"usr_{uuid.uuid4().hex[:8]}",
                    username=username,
                    email=email,
                    personal_email=email,
                    hashed_password=hashed_password,
                    role="faculty",
                    country_id_number=country_id_number,
                    country_id_verified=True,
                    login_count=0
                ))
                adb.commit()

        # 2. Institutions Governance DB (virtual campus)
        if affiliation_type == "VIRTUAL" and virtual_institute_name:
            with InstituteSession() as idb:
                if not idb.query(VirtualCampus).filter(VirtualCampus.name == virtual_institute_name).first():
                    idb.add(VirtualCampus(
                        id=f"vc_{uuid.uuid4().hex[:8]}",
                        name=virtual_institute_name,
                        founder_mentor_username=username,
                        focus_domain=virtual_institute_focus or "Advanced AI & Academic Guidance",
                        active_mentees=1
                    ))
                    idb.commit()

        inst_label = virtual_institute_name or affiliated_institute or "GL Bajaj"

        # 3. Career Pathways DB
        cls._create_career_profile(username, name, "faculty", inst_label)

        # 4. Notifications DB
        cls._create_welcome_notification(username, "faculty", inst_label)

        # 5. Security Audit DB
        cls.record_audit_event(
            event_type="MENTOR_REGISTRATION",
            actor_username=username,
            actor_role="faculty",
            client_ip=client_ip,
            details={
                "affiliation_type": affiliation_type,
                "virtual_campus": virtual_institute_name,
                "dbs_synced": ["auth_iam", "institutions_governance", "career_pathways", "notifications_events"]
            }
        )

    @classmethod
    def sync_institute_registration(
        cls,
        username: str,
        email: str,
        hashed_password: str,
        name: str,
        location: str,
        institution_type: str,
        accreditation_number: str,
        educational_domain: str,
        mission_scope: str,
        client_ip: str = "127.0.0.1"
    ):
        """
        Syncs institute registration across:
        auth_iam.db + institutions_governance.db + career_pathways.db +
        notifications_events.db + security_audit.db
        """
        # 1. Auth IAM DB
        with AuthSession() as adb:
            if not adb.query(IAMUser).filter(IAMUser.username == username).first():
                adb.add(IAMUser(
                    id=f"usr_{uuid.uuid4().hex[:8]}",
                    username=username,
                    email=email,
                    personal_email=email,
                    hashed_password=hashed_password,
                    role="institute",
                    country_id_number=accreditation_number,
                    country_id_verified=True,
                    login_count=0
                ))
                adb.commit()

        # 2. Institutions Governance DB
        with InstituteSession() as idb:
            if not idb.query(GovernanceInstitution).filter(GovernanceInstitution.name == name).first():
                idb.add(GovernanceInstitution(
                    id=f"inst_{uuid.uuid4().hex[:8]}",
                    name=name,
                    institution_type=institution_type,
                    location=location,
                    educational_domain=educational_domain,
                    mission_scope=mission_scope,
                    is_virtual=(institution_type == "Virtual University"),
                    status="VERIFIED",
                    requested_by=username,
                    accreditation_number=accreditation_number,
                    accreditation_verified=True
                ))
                idb.commit()

        # 3. Career Pathways DB
        cls._create_career_profile(username, f"{name} Authority", "institute", name)

        # 4. Notifications DB — institute approved event
        cls._create_welcome_notification(username, "institute", name)
        try:
            with NotificationsSession() as ndb:
                ndb.add(SystemEventLog(
                    id=f"sys_inst_{uuid.uuid4().hex[:8]}",
                    event_name="INSTITUTION_REGISTERED",
                    triggered_by=username,
                    scope="GLOBAL",
                    message=f"Institution '{name}' registered and verified (Accred: {accreditation_number}).",
                    meta_json=json.dumps({"institution": name, "type": institution_type, "location": location})
                ))
                ndb.commit()
        except Exception:
            pass

        # 5. Security Audit DB
        cls.record_audit_event(
            event_type="INSTITUTE_REGISTRATION",
            actor_username=username,
            actor_role="institute",
            client_ip=client_ip,
            details={
                "institution": name,
                "accreditation": accreditation_number,
                "type": institution_type,
                "dbs_synced": ["auth_iam", "institutions_governance", "career_pathways", "notifications_events"]
            }
        )

    @classmethod
    def sync_admin_registration(
        cls,
        username: str,
        email: str,
        hashed_password: str,
        admin_clearance_level: str,
        admin_master_token: str,
        client_ip: str = "127.0.0.1"
    ):
        """
        Syncs admin registration across:
        auth_iam.db + career_pathways.db + notifications_events.db + security_audit.db
        """
        # 1. Auth IAM DB
        with AuthSession() as adb:
            if not adb.query(IAMUser).filter(IAMUser.username == username).first():
                adb.add(IAMUser(
                    id=f"usr_{uuid.uuid4().hex[:8]}",
                    username=username,
                    email=email,
                    personal_email=email,
                    hashed_password=hashed_password,
                    role="admin",
                    admin_clearance_level=admin_clearance_level,
                    admin_master_token=admin_master_token,
                    login_count=0
                ))
                adb.commit()

        # 2. Career Pathways DB
        cls._create_career_profile(username, username, "admin", "Global Operations Center")

        # 3. Notifications DB
        cls._create_welcome_notification(username, "admin", "Global Operations Center")

        # 4. Security Audit DB
        cls.record_audit_event(
            event_type="ADMIN_REGISTRATION",
            actor_username=username,
            actor_role="admin",
            client_ip=client_ip,
            details={
                "clearance_level": admin_clearance_level,
                "dbs_synced": ["auth_iam", "career_pathways", "notifications_events"]
            }
        )

    # ── User Notifications & Career Helpers ─────────────────────────────
    @classmethod
    def get_user_notifications(
        cls, username: str, limit: int = 20, unread_only: bool = False
    ) -> List[Dict[str, Any]]:
        """Fetch notifications for a user from notifications_events.db."""
        try:
            with NotificationsSession() as ndb:
                q = ndb.query(NotificationRecord).filter(NotificationRecord.username == username)
                if unread_only:
                    q = q.filter(NotificationRecord.is_read == False)
                records = q.order_by(NotificationRecord.created_at.desc()).limit(limit).all()
                return [
                    {
                        "id": r.id,
                        "title": r.title,
                        "body": r.body,
                        "category": r.category,
                        "priority": r.priority,
                        "is_read": r.is_read,
                        "created_at": r.created_at.isoformat() if r.created_at else None,
                    }
                    for r in records
                ]
        except Exception as e:
            print(f"[NOTIFICATIONS DB] Failed to fetch notifications: {e}")
            return []

    @classmethod
    def mark_notification_read(cls, notification_id: str, username: str) -> bool:
        try:
            with NotificationsSession() as ndb:
                rec = ndb.query(NotificationRecord).filter(
                    NotificationRecord.id == notification_id,
                    NotificationRecord.username == username
                ).first()
                if rec:
                    rec.is_read = True
                    ndb.commit()
                    return True
        except Exception:
            pass
        return False

    @classmethod
    def get_career_profile(cls, username: str) -> Optional[Dict[str, Any]]:
        """Fetch career profile from career_pathways.db."""
        try:
            with CareerSession() as cdb:
                cp = cdb.query(CareerProfile).filter(CareerProfile.username == username).first()
                if not cp:
                    return None
                internships = cdb.query(InternshipRecord).filter(
                    InternshipRecord.username == username
                ).all()
                drives = cdb.query(PlacementDriveEntry).filter(
                    PlacementDriveEntry.username == username
                ).all()
                return {
                    "career_goal": cp.career_goal,
                    "placement_status": cp.placement_status,
                    "company_placed": cp.company_placed,
                    "placement_ctc": cp.placement_ctc,
                    "skills": json.loads(cp.skills_json or "[]"),
                    "linkedin_url": cp.linkedin_url,
                    "github_url": cp.github_url,
                    "portfolio_url": cp.portfolio_url,
                    "internships": [
                        {
                            "company": i.company, "role": i.role_title,
                            "duration": i.duration, "stipend": i.stipend,
                            "verified": i.is_verified
                        } for i in internships
                    ],
                    "placement_drives": [
                        {
                            "company": d.company_name, "date": d.drive_date,
                            "round_cleared": d.round_cleared, "offer": d.offer_received,
                            "ctc": d.offer_ctc
                        } for d in drives
                    ],
                }
        except Exception as e:
            print(f"[CAREER DB] Failed to fetch career profile: {e}")
            return None

    # ── Full Federation Diagnostics ─────────────────────────────────────
    @classmethod
    def get_federation_diagnostics(cls) -> Dict[str, Any]:
        """Inspects all 7 connected domain databases and returns full telemetry."""
        db_configs = [
            ("auth_iam",              "Identity & Access Management (IAM)",
             settings.AUTH_DB_URL,          auth_engine),
            ("academic_sis",           "Student Information System (SIS 3NF)",
             settings.ACADEMIC_DB_URL,      academic_engine),
            ("family_heritage",        "Family Registry & Alumni Lineage",
             settings.FAMILY_DB_URL,        family_engine),
            ("institutions_governance","Institutional Governance & Accreditation",
             settings.INSTITUTE_DB_URL,     institute_engine),
            ("security_audit",         "Security Telemetry, Threat Intel & Biometrics",
             settings.SECURITY_DB_URL,      security_engine),
            ("career_pathways",        "Career Pathways, Skills & Placements",
             settings.CAREER_DB_URL,        career_engine),
            ("notifications_events",   "Notifications, Events & System Alerts",
             settings.NOTIFICATIONS_DB_URL, notifications_engine),
        ]

        databases_info: Dict[str, Any] = {}
        total_records = 0
        all_online = True

        for db_key, display_name, db_url, engine_obj in db_configs:
            start_t = time.perf_counter()
            status = "CONNECTED"
            table_stats: Dict[str, int] = {}
            error_msg = None
            db_size_kb = 0.0

            try:
                with engine_obj.connect() as conn:
                    conn.execute(text("SELECT 1"))
                latency_ms = round((time.perf_counter() - start_t) * 1000, 2)
            except Exception as e:
                status = "OFFLINE"
                all_online = False
                latency_ms = -1.0
                error_msg = str(e)

            if status == "CONNECTED":
                try:
                    insp = inspect(engine_obj)
                    existing_tables = insp.get_table_names()
                    with engine_obj.connect() as conn:
                        for tbl in existing_tables:
                            res = conn.execute(text(f"SELECT COUNT(*) FROM {tbl}")).scalar()
                            table_stats[tbl] = res
                            total_records += (res or 0)
                except Exception as e:
                    error_msg = str(e)

            try:
                clean_path = db_url.replace("sqlite:///", "")
                if os.path.exists(clean_path):
                    db_size_kb = round(os.path.getsize(clean_path) / 1024, 2)
            except Exception:
                pass

            databases_info[db_key] = {
                "display_name": display_name,
                "url": db_url,
                "status": status,
                "latency_ms": latency_ms,
                "tables": table_stats,
                "file_size_kb": db_size_kb,
                "error": error_msg,
            }

        return {
            "status": "HEALTHY" if all_online else "DEGRADED",
            "federation_mode": "POLYGLOT_MULTI_DATABASE_v2",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "databases_count": len(db_configs),
            "total_records_synchronized": total_records,
            "databases": databases_info,
        }


# Initialize all 7 domain databases immediately on import
DatabaseFederationManager.init_all_databases()

# -----------------------------------------------------------------------
# 5. FastAPI Dependency Injectors
# -----------------------------------------------------------------------
def get_auth_db():
    db = AuthSession()
    try:
        yield db
    finally:
        db.close()

def get_academic_db():
    db = AcademicSession()
    try:
        yield db
    finally:
        db.close()

def get_family_db():
    db = FamilySession()
    try:
        yield db
    finally:
        db.close()

def get_institute_db():
    db = InstituteSession()
    try:
        yield db
    finally:
        db.close()

def get_security_db():
    db = SecuritySession()
    try:
        yield db
    finally:
        db.close()

def get_career_db():
    db = CareerSession()
    try:
        yield db
    finally:
        db.close()

def get_notifications_db():
    db = NotificationsSession()
    try:
        yield db
    finally:
        db.close()
