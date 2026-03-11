#!/bin/bash
# ===============================================
# MasukiBooks - Stop Script (Linux/Mac)
# ===============================================

echo "Stopping MasukiBooks..."

# Stop backend
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        sleep 2
        # Force kill if still running
        kill -9 $BACKEND_PID 2>/dev/null
    fi
    rm .backend.pid
fi

# Stop frontend
if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        sleep 2
        # Force kill if still running
        kill -9 $FRONTEND_PID 2>/dev/null
    fi
    rm .frontend.pid
fi

echo "MasukiBooks stopped."
