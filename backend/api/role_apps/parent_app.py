"""
PARENT / GUARDIAN ROLE BACKEND SERVER
Port: 8003
Handles: Parent authentication (mobile+email), family verification, Sarvam AI compliance
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response
from contextlib import asynccontextmanager
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
import time

from backend.services.db import engine, Base, SessionLocal
from backend.models.student import UserModel, InstitutionModel
from backend.api.routes import auth_routes, student_routes, rag_router, ws_router, chat_routes, notification_routes, community_chat_routes, copilot_chat_routes, institution_template_routes
from backend.api.middleware.rate_limiter import RateLimiterMiddleware
from backend.core.config import settings
from passlib.context import CryptContext
import uuid

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

ROLE = "parent"
PORT = 8003

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(InstitutionModel).count() == 0:
            db.add(InstitutionModel(
                id=f"inst_{uuid.uuid4().hex[:8]}",
                name="GL Bajaj Institute of Technology and Management",
                status="VERIFIED", requested_by="system"
            ))
            db.commit()
        if not db.query(UserModel).filter(UserModel.username == "parent_alex").first():
            db.add(UserModel(
                id="usr_par_alex_demo", username="parent_alex",
                email="rajesh.sharma@gmail.com",
                personal_email="rajesh.sharma@gmail.com",
                mobile_number="+91 9876543211", mobile_verified=True,
                linked_student_id="amit",
                hashed_password=pwd_context.hash("parent123"),
                role="parent", full_name="Mr. Rajesh Sharma (Guardian)",
                institution_name="Parent Portal", institution_verified=True
            ))
            db.commit()
    finally:
        db.close()
    yield

app = FastAPI(
    title=f"EduIdentityAI — Parent/Guardian Backend (Port {PORT})",
    version="2.3.0",
    description="Role-isolated Parent authentication, family ward link & Sarvam AI compliance server.",
    lifespan=lifespan
)

app.add_middleware(RateLimiterMiddleware, max_requests=100, window_seconds=60)
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
    response.headers["X-Role-Server"] = "PARENT"
    response.headers["X-Server-Port"] = str(PORT)
    return response

app.include_router(auth_routes.router, prefix=settings.API_V1_STR)
app.include_router(student_routes.router, prefix=settings.API_V1_STR)
app.include_router(chat_routes.router, prefix=settings.API_V1_STR)
app.include_router(notification_routes.router, prefix=settings.API_V1_STR)
app.include_router(community_chat_routes.router, prefix=settings.API_V1_STR)
app.include_router(copilot_chat_routes.router, prefix=settings.API_V1_STR)
app.include_router(institution_template_routes.router, prefix=settings.API_V1_STR)
app.include_router(rag_router.router)
app.include_router(ws_router.router)

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY", "role_server": "PARENT",
        "port": PORT, "sarvam_ai": "ENABLED",
        "service": "Parent Auth, Family Link & Sarvam AI Regulatory Compliance",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/")
def root():
    return {"role": "parent", "port": PORT, "status": "ONLINE",
            "login_flow": "mobile_number → email_linked → sarvam_api_key → jwt_token"}
