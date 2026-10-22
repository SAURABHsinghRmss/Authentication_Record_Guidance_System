from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from backend.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def init_db_schema():
    """Ensure all required columns exist in sqlite/postgres tables without data loss."""
    try:
        import backend.models.student  # noqa: F401 - registers models with Base
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"[DB MIGRATION WARNING] Table creation notice: {e}")
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        with engine.connect() as conn:
            if "users" in tables:
                existing_user_cols = {col["name"] for col in inspector.get_columns("users")}
                new_user_cols = {
                    "country_id_number": "VARCHAR",
                    "country_id_type": "VARCHAR DEFAULT 'National ID / Aadhaar'",
                    "country_id_verified": "BOOLEAN DEFAULT 0",
                    "parent_verification_status": "VARCHAR DEFAULT 'ALIVE'",
                    "parent_relation": "VARCHAR",
                    "source_of_income": "VARCHAR",
                    "income_bracket": "VARCHAR",
                    "linked_student_id": "VARCHAR",
                    "is_present_in_student_db": "BOOLEAN DEFAULT 0",
                    "student_db_reference": "VARCHAR",
                    "institute_affiliation_type": "VARCHAR DEFAULT 'EXISTING'",
                    "affiliated_institute_name": "VARCHAR",
                    "virtual_institute_name": "VARCHAR",
                    "virtual_institute_focus": "VARCHAR",
                    "admin_clearance_level": "VARCHAR",
                    "admin_master_token": "VARCHAR",
                    "sarvam_api_key": "VARCHAR"
                }
                for col_name, col_def in new_user_cols.items():
                    if col_name not in existing_user_cols:
                        conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}"))
            
            if "institutions" in tables:
                existing_inst_cols = {col["name"] for col in inspector.get_columns("institutions")}
                new_inst_cols = {
                    "location": "VARCHAR",
                    "institution_type": "VARCHAR DEFAULT 'University'",
                    "accreditation_number": "VARCHAR",
                    "accreditation_verified": "BOOLEAN DEFAULT 0",
                    "educational_domain": "VARCHAR",
                    "mission_scope": "TEXT",
                    "is_virtual": "BOOLEAN DEFAULT 0"
                }
                for col_name, col_def in new_inst_cols.items():
                    if col_name not in existing_inst_cols:
                        conn.execute(text(f"ALTER TABLE institutions ADD COLUMN {col_name} {col_def}"))
            if "community_groups" in tables:
                grp_cols = {col["name"] for col in inspector.get_columns("community_groups")}
                if "chat_type" not in grp_cols:
                    conn.execute(text("ALTER TABLE community_groups ADD COLUMN chat_type VARCHAR DEFAULT 'PRIVATE'"))
            conn.commit()
    except Exception as e:
        print(f"[DB MIGRATION WARNING] Column migration notice: {e}")

init_db_schema()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------------------------------------
# Polyglot Multi-Database Federation Re-exports
# -------------------------------------------------------------
from backend.services.db_federation import (
    auth_engine, academic_engine, family_engine, institute_engine,
    security_engine, career_engine, notifications_engine,
    AuthSession, AcademicSession, FamilySession, InstituteSession,
    SecuritySession, CareerSession, NotificationsSession,
    DatabaseFederationManager,
    get_auth_db, get_academic_db, get_family_db, get_institute_db,
    get_security_db, get_career_db, get_notifications_db,
    # Model classes re-exported for direct import convenience
    IAMUser, SISStudent, ParentGuardian, FamilyWardLink, AlumniHeritage,
    GovernanceInstitution, VirtualCampus,
    SecurityAuditEvent, ThreatIntelligenceRecord,
    CareerProfile, InternshipRecord, PlacementDriveEntry,
    NotificationRecord, SystemEventLog,
)
