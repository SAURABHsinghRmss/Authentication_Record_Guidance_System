import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Student Authentication, Record and Guidance System"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "supersecretjwtkey_antigravity_student_identity_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./eduidentity.db")
    
    # Polyglot Multi-Database Federation URLs
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DB_DIR: str = os.getenv("DB_DIR", os.path.join(BASE_DIR, "databases"))
    
    AUTH_DB_URL: str = os.getenv("AUTH_DB_URL", f"sqlite:///{os.path.join(DB_DIR, 'auth_iam.db').replace('\\', '/')}")
    ACADEMIC_DB_URL: str = os.getenv("ACADEMIC_DB_URL", f"sqlite:///{os.path.join(DB_DIR, 'academic_sis.db').replace('\\', '/')}")
    FAMILY_DB_URL: str = os.getenv("FAMILY_DB_URL", f"sqlite:///{os.path.join(DB_DIR, 'family_heritage.db').replace('\\', '/')}")
    INSTITUTE_DB_URL: str = os.getenv("INSTITUTE_DB_URL", f"sqlite:///{os.path.join(DB_DIR, 'institutions_governance.db').replace('\\', '/')}")
    SECURITY_DB_URL: str = os.getenv("SECURITY_DB_URL", f"sqlite:///{os.path.join(DB_DIR, 'security_audit.db').replace('\\', '/')}")
    # Domain DB 6: Career Pathways, Skills & Placements
    CAREER_DB_URL: str = os.getenv("CAREER_DB_URL", f"sqlite:///{os.path.join(DB_DIR, 'career_pathways.db').replace('\\', '/')}")
    # Domain DB 7: Notifications, Events & System Alerts
    NOTIFICATIONS_DB_URL: str = os.getenv("NOTIFICATIONS_DB_URL", f"sqlite:///{os.path.join(DB_DIR, 'notifications_events.db').replace('\\', '/')}")

    VALKEY_HOST: str = os.getenv("VALKEY_HOST", "localhost")
    VALKEY_PORT: int = int(os.getenv("VALKEY_PORT", 6379))
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", 6333))
    LOGS_STORAGE_DIR: str = os.getenv(
        "LOGS_STORAGE_DIR",
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "storage", "logs", "users")
    )
    CLOUD_STORAGE_ENABLED: bool = os.getenv("CLOUD_STORAGE_ENABLED", "false").lower() == "true"
    CLOUD_STORAGE_BUCKET: str = os.getenv("CLOUD_STORAGE_BUCKET", "eduidentity-user-logs")

settings = Settings()
