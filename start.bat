@echo off
echo ========================================================
echo Starting EduIdentityAI Platform (Full Stack Ecosystem)
echo ========================================================

echo [1/3] Initializing & Seeding Federated Databases...
python infrastructure\db_init\init_db.py

echo [2/3] Starting FastAPI Backend API (Port 8000) in new window...
start "EduIdentity Backend API" cmd /k "uvicorn backend.main:app --reload --port 8000"

echo [3/3] Starting React Frontend Dev Server (Port 3000)...
if not exist node_modules (
    echo Installing Node dependencies...
    npm install
)

npm run dev
pause
