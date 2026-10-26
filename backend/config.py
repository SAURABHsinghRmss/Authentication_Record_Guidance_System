import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASES_DIR = os.path.join(BASE_DIR, "databases")

class Settings:
    PROJECT_NAME: str = "EduIdentityAI Backend API"
    VERSION: str = "1.0.0"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "eduidentity-secret-key-2026-secure-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours

    # Paths to the 7 federated SQLite databases
    DB_PATHS = {
        "academic_sis": f"sqlite+aiosqlite:///{os.path.join(DATABASES_DIR, 'academic_sis.db')}",
        "auth_iam": f"sqlite+aiosqlite:///{os.path.join(DATABASES_DIR, 'auth_iam.db')}",
        "career_pathways": f"sqlite+aiosqlite:///{os.path.join(DATABASES_DIR, 'career_pathways.db')}",
        "family_heritage": f"sqlite+aiosqlite:///{os.path.join(DATABASES_DIR, 'family_heritage.db')}",
        "institutions_governance": f"sqlite+aiosqlite:///{os.path.join(DATABASES_DIR, 'institutions_governance.db')}",
        "notifications_events": f"sqlite+aiosqlite:///{os.path.join(DATABASES_DIR, 'notifications_events.db')}",
        "security_audit": f"sqlite+aiosqlite:///{os.path.join(DATABASES_DIR, 'security_audit.db')}",
    }

settings = Settings()
