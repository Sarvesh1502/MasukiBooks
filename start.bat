@echo off
REM ===============================================
REM MasukiBooks - Windows Quick Start Script
REM ===============================================

echo.
echo ================================================
echo   MasukiBooks - Starting Application
echo ================================================
echo.

REM Set Java 21 and Maven paths
set "JAVA_HOME=C:\Users\Sarvesh B\.jdk\jdk-21.0.8"
set "MAVEN_HOME=C:\Users\Sarvesh B\maven\apache-maven-3.9.9"
set "PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%"

REM Check if Java is installed
"%JAVA_HOME%\bin\java.exe" -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java 21 not found at: %JAVA_HOME%
    echo Please check the path and try again
    pause
    exit /b 1
)

REM Check if Maven is installed
"%MAVEN_HOME%\bin\mvn.cmd" -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Maven not found at: %MAVEN_HOME%
    echo Please check the path and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and try again
    pause
    exit /b 1
)

echo [OK] All prerequisites found
echo   Java: %JAVA_HOME%
echo   Maven: %MAVEN_HOME%
echo   Node: 
node --version
echo.

REM Start Backend
echo ================================================
echo   Step 1: Starting Backend Server
echo ================================================
echo.
cd masuki-backend\masukibooks-backend
echo [INFO] Starting Spring Boot backend (local profile with H2 database)...
echo [INFO] This will take 20-30 seconds on first run
echo.
start "MasukiBooks Backend" cmd /k "set JAVA_HOME=%JAVA_HOME%&& set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%&& mvn spring-boot:run -Dspring-boot.run.profiles=local"
ping 127.0.0.1 -n 3 >nul
cd ..\..

REM Wait for backend to initialize
echo [INFO] Waiting for backend to initialize (30 seconds)...
ping 127.0.0.1 -n 31 >nul

REM Start Frontend
echo.
echo ================================================
echo   Step 2: Starting Frontend Server
echo ================================================
echo.
cd masukibooks-frontend

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] Installing frontend dependencies...
    echo [INFO] This will take 2-3 minutes on first run
    call npm install
)

echo.
echo [INFO] Starting Vite development server...
start "MasukiBooks Frontend" cmd /k "npm run dev"
cd ..

REM Wait a moment for frontend to start
ping 127.0.0.1 -n 5 >nul

echo.
echo ================================================
echo   MasukiBooks Started Successfully!
echo ================================================
echo.
echo Backend running at: http://localhost:8081
echo Frontend running at: http://localhost:5173
echo.
echo Two terminal windows have been opened:
echo   1. Backend terminal (Spring Boot)
echo   2. Frontend terminal (Vite)
echo.
echo Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173
echo.
echo ================================================
echo   To stop the application:
echo   - Close both terminal windows
echo   - Or press Ctrl+C in each terminal
echo ================================================
echo.
pause
