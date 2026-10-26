#!/usr/bin/env bash
echo "========================================================"
echo "Starting EduIdentityAI Platform (Full Stack Ecosystem)"
echo "========================================================"

echo "[1/3] Initializing & Seeding Federated Databases..."
python3 infrastructure/db_init/init_db.py

echo "[2/3] Starting FastAPI Backend API (Port 8000)..."
uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

echo "[3/3] Starting React Frontend Dev Server (Port 3000)..."
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

npm run dev

# Cleanup background backend process on exit
kill $BACKEND_PID
