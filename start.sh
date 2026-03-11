#!/bin/bash
# ===============================================
# MasukiBooks - Linux/Mac Quick Start Script
# ===============================================

echo ""
echo "================================================"
echo "   MasukiBooks - Starting Application"
echo "================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}[ERROR] Java is not installed${NC}"
    echo "Please install Java 21 and try again"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}[ERROR] Maven is not installed${NC}"
    echo "Please install Maven 3.9+ and try again"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed${NC}"
    echo "Please install Node.js 18+ and try again"
    exit 1
fi

echo -e "${GREEN}[OK] All prerequisites found${NC}"
echo ""

# Start Backend
echo "================================================"
echo "   Step 1: Starting Backend Server"
echo "================================================"
echo ""
cd masuki-backend/masukibooks-backend
echo "[INFO] Starting Spring Boot backend..."
echo "[INFO] This will take 20-30 seconds on first run"
echo ""

# Start backend in background
mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo "[INFO] Backend PID: $BACKEND_PID"
cd ../..

# Save PID for cleanup
echo $BACKEND_PID > .backend.pid

# Wait for backend to initialize
echo "[INFO] Waiting for backend to initialize (30 seconds)..."
sleep 30

# Start Frontend
echo ""
echo "================================================"
echo "   Step 2: Starting Frontend Server"
echo "================================================"
echo ""
cd masukibooks-frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing frontend dependencies..."
    echo "[INFO] This will take 2-3 minutes on first run"
    npm install
fi

echo ""
echo "[INFO] Starting Vite development server..."

# Start frontend in background
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "[INFO] Frontend PID: $FRONTEND_PID"
cd ..

# Save PID for cleanup
echo $FRONTEND_PID > .frontend.pid

# Wait for frontend to start
sleep 5

echo ""
echo "================================================"
echo "   MasukiBooks Started Successfully!"
echo "================================================"
echo ""
echo -e "${GREEN}Backend running at: http://localhost:8081${NC}"
echo -e "${GREEN}Frontend running at: http://localhost:5173${NC}"
echo ""
echo "Logs:"
echo "  - Backend: masuki-backend/masukibooks-backend/backend.log"
echo "  - Frontend: masukibooks-frontend/frontend.log"
echo ""
echo "To view logs in real-time:"
echo "  - Backend: tail -f masuki-backend/masukibooks-backend/backend.log"
echo "  - Frontend: tail -f masukibooks-frontend/frontend.log"
echo ""
echo "================================================"
echo "   To stop the application:"
echo "   Run: ./stop.sh"
echo "   Or: kill $BACKEND_PID $FRONTEND_PID"
echo "================================================"
echo ""

# Try to open browser (works on Mac and some Linux)
if command -v open &> /dev/null; then
    sleep 3
    open http://localhost:5173
elif command -v xdg-open &> /dev/null; then
    sleep 3
    xdg-open http://localhost:5173
else
    echo "Open http://localhost:5173 in your browser"
fi

echo ""
echo "Application is running in the background."
echo "Press Ctrl+C to return to terminal (app will keep running)"
echo ""

# Wait for user input
read -p "Press Enter to continue..."
