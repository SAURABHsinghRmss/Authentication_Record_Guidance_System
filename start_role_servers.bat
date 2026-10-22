@echo off
TITLE EduIdentityAI — Role-Isolated Backend Servers + Frontend
color 0A
echo.
echo  ==============================================================================
echo   EduIdentityAI — ROLE-ISOLATED BACKEND SERVERS v2.3
echo   AI-Powered Application Validation, Documentation Authentication
echo   and Regulatory Compliance Verification via Sarvam AI
echo  ==============================================================================
echo.
echo  Login Flow for ALL roles:
echo    1. Enter MOBILE NUMBER → Get OTP
echo    2. Verify OTP → System resolves linked EMAIL
echo    3. Enter PASSWORD (linked to email)
echo    4. Enter SARVAM API KEY for AI validation features
echo    5. JWT Token issued → Routed to role-specific backend
echo.
echo  ROLE-SPECIFIC BACKEND SERVERS:
echo    Student   →  http://localhost:8001/docs
echo    Faculty   →  http://localhost:8002/docs
echo    Parent    →  http://localhost:8003/docs
echo    Institute →  http://localhost:8004/docs
echo    Admin     →  http://localhost:8005/docs
echo.
echo  UNIFIED GATEWAY (main backend, all routes):
echo    Gateway   →  http://localhost:8000/docs
echo.
echo  FRONTEND PORTAL:
echo    Portal    →  http://localhost:3000
echo  ==============================================================================
echo.

set PYTHONPATH=%CD%

echo [0/6] Setting PYTHONPATH=%CD%
echo.

REM ─────────────────────────────────────────────────────────────────────────────
REM SERVER 1: UNIFIED GATEWAY (Port 8000) — all roles, main app
REM ─────────────────────────────────────────────────────────────────────────────
echo [1/6] Starting UNIFIED GATEWAY (Port 8000) ...
start "EduAI — Gateway :8000" cmd /k "color 07 && set PYTHONPATH=%CD% && echo [GATEWAY] Starting on http://localhost:8000 ... && python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload --log-level info"
timeout /t 2 /nobreak >nul

REM ─────────────────────────────────────────────────────────────────────────────
REM SERVER 2: STUDENT BACKEND (Port 8001)
REM ─────────────────────────────────────────────────────────────────────────────
echo [2/6] Starting STUDENT BACKEND (Port 8001) ...
start "EduAI — Student :8001" cmd /k "color 09 && set PYTHONPATH=%CD% && echo [STUDENT] Starting on http://localhost:8001 ... && python -m uvicorn backend.api.role_apps.student_app:app --host 0.0.0.0 --port 8001 --reload --log-level info"
timeout /t 2 /nobreak >nul

REM ─────────────────────────────────────────────────────────────────────────────
REM SERVER 3: FACULTY BACKEND (Port 8002)
REM ─────────────────────────────────────────────────────────────────────────────
echo [3/6] Starting FACULTY BACKEND (Port 8002) ...
start "EduAI — Faculty :8002" cmd /k "color 0D && set PYTHONPATH=%CD% && echo [FACULTY] Starting on http://localhost:8002 ... && python -m uvicorn backend.api.role_apps.faculty_app:app --host 0.0.0.0 --port 8002 --reload --log-level info"
timeout /t 2 /nobreak >nul

REM ─────────────────────────────────────────────────────────────────────────────
REM SERVER 4: PARENT BACKEND (Port 8003)
REM ─────────────────────────────────────────────────────────────────────────────
echo [4/6] Starting PARENT BACKEND (Port 8003) ...
start "EduAI — Parent :8003" cmd /k "color 06 && set PYTHONPATH=%CD% && echo [PARENT] Starting on http://localhost:8003 ... && python -m uvicorn backend.api.role_apps.parent_app:app --host 0.0.0.0 --port 8003 --reload --log-level info"
timeout /t 2 /nobreak >nul

REM ─────────────────────────────────────────────────────────────────────────────
REM SERVER 5: INSTITUTE BACKEND (Port 8004)
REM ─────────────────────────────────────────────────────────────────────────────
echo [5/6] Starting INSTITUTE BACKEND (Port 8004) ...
start "EduAI — Institute :8004" cmd /k "color 0B && set PYTHONPATH=%CD% && echo [INSTITUTE] Starting on http://localhost:8004 ... && python -m uvicorn backend.api.role_apps.institute_app:app --host 0.0.0.0 --port 8004 --reload --log-level info"
timeout /t 2 /nobreak >nul

REM ─────────────────────────────────────────────────────────────────────────────
REM SERVER 6: ADMIN BACKEND (Port 8005)
REM ─────────────────────────────────────────────────────────────────────────────
echo [6/6] Starting ADMIN BACKEND (Port 8005) ...
start "EduAI — Admin :8005" cmd /k "color 04 && set PYTHONPATH=%CD% && echo [ADMIN] Starting on http://localhost:8005 ... && python -m uvicorn backend.api.role_apps.admin_app:app --host 0.0.0.0 --port 8005 --reload --log-level info"
timeout /t 3 /nobreak >nul

REM ─────────────────────────────────────────────────────────────────────────────
REM FRONTEND PORTAL (Port 3000)
REM ─────────────────────────────────────────────────────────────────────────────
echo [7/7] Starting FRONTEND PORTAL (Port 3000) ...
start "EduAI — Frontend :3000" cmd /k "color 02 && cd frontend && echo [FRONTEND] Starting on http://localhost:3000 ... && npx vite --port 3000"

echo.
echo  ==============================================================================
echo  ALL SYSTEMS ONLINE!
echo.
echo  ROLE-SPECIFIC BACKENDS (API + Docs):
echo    Student   →  http://localhost:8001  [docs: /docs]
echo    Faculty   →  http://localhost:8002  [docs: /docs]
echo    Parent    →  http://localhost:8003  [docs: /docs]
echo    Institute →  http://localhost:8004  [docs: /docs]
echo    Admin     →  http://localhost:8005  [docs: /docs]
echo.
echo  UNIFIED GATEWAY (primary, all routes):
echo    Gateway   →  http://localhost:8000  [docs: /docs]
echo.
echo  FRONTEND PORTAL:
echo    Portal    →  http://localhost:3000
echo    (or)      →  http://localhost:8000/portal/index.html
echo.
echo  HEALTH CHECKS:
echo    curl http://localhost:8000/health
echo    curl http://localhost:8001/health
echo    curl http://localhost:8002/health
echo    curl http://localhost:8003/health
echo    curl http://localhost:8004/health
echo    curl http://localhost:8005/health
echo.
echo  SARVAM AI (per-user key):
echo    POST /api/auth/save-sarvam-key   (authenticated)
echo    POST /api/auth/validate-sarvam-key
echo    GET  /api/auth/role-server-info
echo    GET  /api/auth/all-role-servers
echo  ==============================================================================
pause
