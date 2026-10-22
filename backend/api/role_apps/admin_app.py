"""
ADMIN / SUPER-ADMIN ROLE BACKEND SERVER
Port: 8005
Handles: Admin authentication (master token), system federation, Sarvam AI oversight
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response
from contextlib import asynccontextmanager
from sqlalchemy import text
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
import time

from backend.services.db import engine, Base, SessionLocal
from backend.models.student import UserModel, InstitutionModel
from backend.api.routes import auth_routes, student_routes, rag_router, ws_router, chat_routes, notification_routes, community_chat_routes, copilot_chat_routes, institution_template_routes, db_admin_routes
from backend.api.middleware.rate_limiter import RateLimiterMiddleware
from backend.core.config import settings
from passlib.context import CryptContext
import uuid

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

ROLE = "admin"
PORT = 8005

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TRIGGER IF NOT EXISTS prevent_delete_msrch
            BEFORE DELETE ON users
            FOR EACH ROW
            WHEN LOWER(OLD.username) = 'msrch'
            BEGIN
                SELECT RAISE(ABORT, 'Universal developer user msrch is permanent and cannot be deleted.');
            END;
        """))
        conn.commit()
    db = SessionLocal()
    try:
        if db.query(InstitutionModel).count() == 0:
            db.add(InstitutionModel(
                id=f"inst_{uuid.uuid4().hex[:8]}",
                name="GL Bajaj Institute of Technology and Management",
                status="VERIFIED", requested_by="system"
            ))
            db.commit()
        msrch = db.query(UserModel).filter(UserModel.username == "msrch").first()
        if not msrch:
            db.add(UserModel(
                id="usr_msrch_universal", username="msrch",
                email="msrch@uni.edu",
                personal_email="msrch.dev@gmail.com",
                mobile_number="+91 9999999999", mobile_verified=True,
                hashed_password=pwd_context.hash("msrch1410#"),
                role="admin", admin_clearance_level="SUPER_ADMIN",
                full_name="Master Developer / Administrator (msrch)",
                institution_name="GL Bajaj Institute of Technology and Management",
                institution_verified=True
            ))
            db.commit()
        else:
            msrch.role = "admin"
            msrch.institution_verified = True
            if pwd_context.verify("admin123", msrch.hashed_password):
                msrch.hashed_password = pwd_context.hash("msrch1410#")
            db.commit()
    finally:
        db.close()
    yield

app = FastAPI(
    title=f"EduIdentityAI — Admin/Super-Admin Backend (Port {PORT})",
    version="2.3.0",
    description="Role-isolated Admin authentication, 7-DB federation oversight & Sarvam AI governance server.",
    lifespan=lifespan
)

app.add_middleware(RateLimiterMiddleware, max_requests=500, window_seconds=60)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    response.headers["X-Process-Time"] = str(round((time.time() - start_time) * 1000, 2))
    response.headers["X-Role-Server"] = "ADMIN"
    response.headers["X-Server-Port"] = str(PORT)
    return response

app.include_router(auth_routes.router, prefix=settings.API_V1_STR)
app.include_router(student_routes.router, prefix=settings.API_V1_STR)
app.include_router(chat_routes.router, prefix=settings.API_V1_STR)
app.include_router(notification_routes.router, prefix=settings.API_V1_STR)
app.include_router(community_chat_routes.router, prefix=settings.API_V1_STR)
app.include_router(copilot_chat_routes.router, prefix=settings.API_V1_STR)
app.include_router(institution_template_routes.router, prefix=settings.API_V1_STR)
app.include_router(db_admin_routes.router, prefix=settings.API_V1_STR)
app.include_router(rag_router.router)
app.include_router(ws_router.router)

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY", "role_server": "ADMIN",
        "port": PORT, "sarvam_ai": "ENABLED",
        "clearance": "SUPER_ADMIN",
        "service": "Admin Auth, 7-DB Federation & Sarvam AI Governance",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/")
def root():
    return {"role": "admin", "port": PORT, "status": "ONLINE",
            "login_flow": "mobile_number → email_linked → master_token → sarvam_api_key → jwt_token"}
