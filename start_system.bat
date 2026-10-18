@echo off
TITLE EduIdentityAI - Student Authentication, Record & Guidance System
echo ==============================================================================
echo   EduIdentityAI — Starting Student Authentication, Record & Guidance Platform
echo ==============================================================================

echo [1/2] Starting FastAPI Backend Server on http://localhost:8000 ...
set PYTHONPATH=%CD%
start cmd /k "set PYTHONPATH=%CD% && python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Frontend Portal Server on http://localhost:3000 ...
start cmd /k "cd frontend && npx vite --port 3000"

echo ==============================================================================
echo  SYSTEM ONLINE!
echo  - Frontend Portal:  http://localhost:3000 (or http://localhost:8000/portal/index.html)
echo  - FastAPI Docs:     http://localhost:8000/docs
echo  - Health Check:     http://localhost:8000/health
echo ==============================================================================
pause
