@echo off
TITLE EduIdentityAI — Master Startup & Role Orchestrator
color 0B
cls

:MENU
echo ==============================================================================
echo   EduIdentityAI — MASTER STARTUP & ROLE ORCHESTRATOR
echo   AI-Powered Application Validation, Documentation Authentication
echo   and Regulatory Compliance Verification via Sarvam AI
echo ==============================================================================
echo.
echo   Please select your startup mode:
echo.
echo     [1] Standard Unified System (Gateway :8000 + Frontend :3000)
echo     [2] Multi-Role Isolated Servers (Role Ports 8001-8005 + Gateway :8000 + Frontend :3000)
echo     [3] Run Automated Test Suite (Pytest - 63 Tests)
echo     [4] Exit
echo.
echo ==============================================================================
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto UNIFIED
if "%choice%"=="2" goto MULTIROLE
if "%choice%"=="3" goto TESTSUITE
if "%choice%"=="4" goto EXIT

echo Invalid choice. Please try again.
timeout /t 2 /nobreak >nul
goto MENU

:UNIFIED
echo.
echo [1/2] Starting Unified FastAPI Backend Gateway on http://localhost:8000 ...
set PYTHONPATH=%CD%
start "EduAI — Gateway :8000" cmd /k "set PYTHONPATH=%CD% && python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Frontend Portal Server on http://localhost:3000 ...
start "EduAI — Frontend :3000" cmd /k "cd frontend && npx vite --port 3000"

echo.
echo ==============================================================================
echo  UNIFIED SYSTEM ONLINE!
echo  - Frontend Portal:  http://localhost:3000
echo  - FastAPI Docs:     http://localhost:8000/docs
echo  - Health Check:     http://localhost:8000/health
echo ==============================================================================
pause
goto MENU

:MULTIROLE
echo.
echo Launching Multi-Role Isolated Servers via start_role_servers.bat ...
call start_role_servers.bat
goto MENU

:TESTSUITE
echo.
echo Running automated pytest test suite ...
set PYTHONPATH=%CD%
pytest backend/tests/
echo.
pause
goto MENU

:EXIT
echo Exiting EduIdentityAI orchestrator. Goodbye!
exit
