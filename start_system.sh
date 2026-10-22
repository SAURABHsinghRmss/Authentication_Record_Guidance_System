#!/usr/bin/env bash
# ==============================================================================
# EduIdentityAI — Master Startup & Role Orchestrator (Linux / macOS)
# ==============================================================================

export PYTHONPATH="$(pwd)"

while true; do
    clear
    echo "=============================================================================="
    echo "  EduIdentityAI — MASTER STARTUP & ROLE ORCHESTRATOR"
    echo "  AI-Powered Application Validation, Documentation Authentication"
    echo "  and Regulatory Compliance Verification via Sarvam AI"
    echo "=============================================================================="
    echo ""
    echo "  Please select your startup mode:"
    echo ""
    echo "    [1] Standard Unified System (Gateway :8000 + Frontend :3000)"
    echo "    [2] Multi-Role Isolated Servers (Role Ports 8001-8005 + Gateway :8000 + Frontend :3000)"
    echo "    [3] Run Automated Test Suite (Pytest - 63 Tests)"
    echo "    [4] Exit"
    echo ""
    echo "=============================================================================="
    read -p "Enter your choice (1-4): " choice

    case $choice in
        1)
            echo "[1/2] Starting Unified FastAPI Backend Gateway on http://localhost:8000 ..."
            python3 -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload &
            GATEWAY_PID=$!
            
            echo "[2/2] Starting Frontend Portal Server on http://localhost:3000 ..."
            cd frontend && npx vite --port 3000 &
            FRONTEND_PID=$!
            cd ..

            echo ""
            echo "=============================================================================="
            echo " UNIFIED SYSTEM ONLINE!"
            echo " - Frontend Portal:  http://localhost:3000"
            echo " - FastAPI Docs:     http://localhost:8000/docs"
            echo "=============================================================================="
            read -p "Press [ENTER] to stop servers and return to menu..."
            kill $GATEWAY_PID $FRONTEND_PID 2>/dev/null
            ;;
        2)
            echo "Starting Multi-Role Isolated Servers..."
            python3 -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload &
            python3 -m uvicorn backend.api.role_apps.student_app:app --host 0.0.0.0 --port 8001 --reload &
            python3 -m uvicorn backend.api.role_apps.faculty_app:app --host 0.0.0.0 --port 8002 --reload &
            python3 -m uvicorn backend.api.role_apps.parent_app:app --host 0.0.0.0 --port 8003 --reload &
            python3 -m uvicorn backend.api.role_apps.institute_app:app --host 0.0.0.0 --port 8004 --reload &
            python3 -m uvicorn backend.api.role_apps.admin_app:app --host 0.0.0.0 --port 8005 --reload &
            cd frontend && npx vite --port 3000 &
            cd ..
            echo "All role servers launched!"
            read -p "Press [ENTER] to stop all servers and return to menu..."
            pkill -f uvicorn
            pkill -f vite
            ;;
        3)
            echo "Running automated pytest test suite..."
            pytest backend/tests/
            read -p "Press [ENTER] to continue..."
            ;;
        4)
            echo "Exiting EduIdentityAI orchestrator. Goodbye!"
            exit 0
            ;;
        *)
            echo "Invalid choice. Please enter 1, 2, 3, or 4."
            sleep 2
            ;;
    esac
done
