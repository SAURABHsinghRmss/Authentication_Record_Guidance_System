#!/bin/bash
# ==============================================================================
# EduIdentityAI - Master Initialization Script
# ==============================================================================

echo "[SYSTEM] Initializing Authentication, Record and Guidance System..."

cleanup() {
    echo "[SYSTEM] Shutting down all background processes..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    docker-compose -f infrastructure/docker-compose.yml down
    exit
}
trap cleanup SIGINT SIGTERM

# 1. Install local Python dependencies
echo "[INSTALL] Loading Python backend dependencies from local cache..."
pip install --no-index --find-links=./dependencies/python_wheels -r backend/requirements.txt

# 2. Boot Infrastructure Containers
echo "[DOCKER] Starting PostgreSQL and Valkey containers..."
docker-compose -f infrastructure/docker-compose.yml up -d db cache
sleep 3

# 3. Start Backend REST API
echo "[BACKEND] Starting FastAPI server..."
export PYTHONPATH="$(pwd)"
uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 4. Start Frontend Web Portal
echo "[FRONTEND] Serving Lit/Alpine.js UI Portal..."
cd frontend || exit
npm install --offline --cache ../dependencies/node_cache
npm run dev &
FRONTEND_PID=$!
cd ..

echo "======================================================================"
echo " SYSTEM ONLINE AND OPERATIONAL"
echo "======================================================================"
echo " - Frontend Portal:   http://localhost:3000"
echo " - Backend API:       http://localhost:8000/docs"
echo " - Grafana SLA:       http://localhost:3001"
echo " - Database Port:     5432 (PostgreSQL)"
echo "======================================================================"
wait
