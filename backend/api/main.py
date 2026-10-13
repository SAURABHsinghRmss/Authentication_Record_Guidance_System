from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager
import time
import json
import os
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST, Counter, Histogram
from starlette.responses import Response

from sqlalchemy import text
from backend.services.db import engine, Base, SessionLocal
from backend.models.student import StudentModel, UserModel, InstitutionModel
from backend.api.routes import auth_routes, student_routes, rag_router, ws_router, chat_routes, notification_routes, community_chat_routes, copilot_chat_routes
from backend.api.middleware.rate_limiter import RateLimiterMiddleware
from backend.core.config import settings
from passlib.context import CryptContext
import uuid

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# Prometheus Metrics
REQUEST_COUNT = Counter("http_requests_total", "Total HTTP Requests", ["method", "endpoint"])
REQUEST_LATENCY = Histogram("http_request_duration_seconds", "HTTP Request Latency")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed database
    Base.metadata.create_all(bind=engine)

    # SQLite trigger to permanently protect universal user 'msrch' from deletion
    with engine.connect() as conn:
        conn.execute(text(
            """
            CREATE TRIGGER IF NOT EXISTS prevent_delete_msrch
            BEFORE DELETE ON users
            FOR EACH ROW
            WHEN LOWER(OLD.username) = 'msrch'
            BEGIN
                SELECT RAISE(ABORT, 'Universal developer user msrch is permanent and cannot be deleted.');
            END;
            """
        ))
        conn.commit()

    db = SessionLocal()
    try:
        # Seed default verified institution
        if db.query(InstitutionModel).count() == 0:
            default_inst = InstitutionModel(
                id=f"inst_{uuid.uuid4().hex[:8]}",
                name="GL Bajaj Institute of Technology and Management",
                status="VERIFIED",
                requested_by="system"
            )
            db.add(default_inst)
            db.commit()

        # Ensure permanent universal developer user 'msrch' exists with password 'msrch1410#'
        msrch_user = db.query(UserModel).filter(UserModel.username == "msrch").first()
        if not msrch_user:
            msrch_user = UserModel(
                id="usr_msrch_universal",
                username="msrch",
                email="msrch@uni.edu",
                hashed_password=pwd_context.hash("msrch1410#"),
                role="admin",
                full_name="Master Developer / Administrator (msrch)",
                institution_name="GL Bajaj Institute of Technology and Management",
                institution_verified=True
            )
            db.add(msrch_user)
            db.commit()
        else:
            # Ensure admin role and verified status
            msrch_user.role = "admin"
            msrch_user.institution_verified = True
            # If the user still has default legacy 'admin123' password, upgrade to 'msrch1410#'
            if pwd_context.verify("admin123", msrch_user.hashed_password):
                msrch_user.hashed_password = pwd_context.hash("msrch1410#")
            db.commit()

        # Ensure fallback standard admin user 'admin' exists for tests
        admin_user = db.query(UserModel).filter(UserModel.username == "admin").first()
        if not admin_user:
            admin_user = UserModel(
                id=f"usr_{uuid.uuid4().hex[:8]}",
                username="admin",
                email="admin@uni.edu",
                hashed_password=pwd_context.hash("admin123"),
                role="admin",
                full_name="System Administrator",
                institution_name="GL Bajaj Institute of Technology and Management",
                institution_verified=True
            )
            db.add(admin_user)
            db.commit()

        # Check if students exist
        count = db.query(StudentModel).count()
        if count == 0:
            json_path = "backend/models/sample_students.json"
            if os.path.exists(json_path):
                with open(json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for s in data.get("students", []):
                        db.add(StudentModel(**s))
            
            student_user = UserModel(
                id=f"usr_{uuid.uuid4().hex[:8]}",
                username="amit",
                email="amit.sharma@uni.edu",
                hashed_password=pwd_context.hash("amit123"),
                role="student",
                full_name="Amit Sharma",
                institution_name="GL Bajaj Institute of Technology and Management",
                institution_verified=True
            )
            db.add(student_user)
            db.commit()
    finally:
        db.close()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="2.3.0",
    lifespan=lifespan
)

# Rate Limiting Middleware
app.add_middleware(RateLimiterMiddleware, max_requests=100, window_seconds=60)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Timing Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))
    return response

# Include Routers
app.include_router(auth_routes.router, prefix=settings.API_V1_STR)
app.include_router(student_routes.router, prefix=settings.API_V1_STR)
app.include_router(chat_routes.router, prefix=settings.API_V1_STR)
app.include_router(notification_routes.router, prefix=settings.API_V1_STR)
app.include_router(community_chat_routes.router, prefix=settings.API_V1_STR)
app.include_router(copilot_chat_routes.router, prefix=settings.API_V1_STR)
app.include_router(rag_router.router)
app.include_router(ws_router.router)

# Health & Metrics Endpoints
@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "database": "CONNECTED",
        "vector_store": "ACTIVE",
        "rate_limiter": "ACTIVE",
        "institutional_verification": "STRICT_ACTIVE",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

# Root landing redirect
@app.get("/")
def root():
    return RedirectResponse(url="/portal/index.html")

# Mount Frontend Portal static files
if os.path.exists("frontend"):
    app.mount("/portal", StaticFiles(directory="frontend", html=True), name="portal")
