@echo off
REM Complete ReportEase Backend Setup and Start Script
REM This fixes ALL backend issues including "report not found"

setlocal enabledelayedexpansion

title ReportEase Backend - Complete Setup & Start
color 0E

cls
echo.
echo ============================================================
echo   ReportEase Backend - COMPLETE FIX & STARTUP
echo ============================================================
echo.

REM ==================== STEP 1: Start MongoDB ====================
echo [STEP 1] Starting MongoDB Service...
echo.

net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo SUCCESS: MongoDB service started
) else (
    echo INFO: MongoDB may already be running or not installed as service
    echo Attempting to start mongod manually...
    start mongod
    timeout /t 3 /nobreak
)

echo.
echo MongoDB Check:
netstat -ano | findstr :27017 >nul 2>&1
if %errorlevel% equ 0 (
    echo SUCCESS: MongoDB is listening on port 27017
) else (
    echo WARNING: MongoDB not detected on port 27017
    echo Please ensure MongoDB is installed and running
)

REM ==================== STEP 2: Install Python Dependencies ====================
echo.
echo [STEP 2] Installing/Updating Python Dependencies...
echo.

cd /d d:\medicalreport\backend

REM Upgrade pip
python -m pip install --upgrade pip >nul 2>&1

REM Install core dependencies
echo Installing core dependencies...
pip install fastapi uvicorn pymongo pydantic python-dotenv >nul 2>&1
if %errorlevel% equ 0 (
    echo SUCCESS: Core dependencies installed
) else (
    echo ERROR: Failed to install core dependencies
    pause
    exit /b 1
)

REM Install ML dependencies
echo Installing ML dependencies...
pip install chromadb sentence-transformers easyocr pillow >nul 2>&1
if %errorlevel% equ 0 (
    echo SUCCESS: ML dependencies installed
) else (
    echo WARNING: Some ML dependencies may have failed
)

REM ==================== STEP 3: Setup Environment Variables ====================
echo.
echo [STEP 3] Checking Environment Configuration...
echo.

if not exist ".env" (
    echo Creating .env file...
    (
        echo # MongoDB Configuration
        echo MONGO_URI=mongodb://localhost:27017
        echo DB_NAME=medicalreport
        echo.
        echo # Gemini API ^(optional - for translation^)
        echo GEMINI_API_KEY=your_gemini_api_key_here
        echo.
        echo # API Settings
        echo DEBUG=False
        echo API_PORT=8000
    ) > .env
    echo SUCCESS: .env file created
) else (
    echo SUCCESS: .env file already exists
)

REM ==================== STEP 4: Verify Python Installation ====================
echo.
echo [STEP 4] Verifying Python Installation...
echo.

python -c "import fastapi; import uvicorn; import pymongo; print('SUCCESS: All required packages installed')" 2>nul
if %errorlevel% equ 0 (
    echo SUCCESS: Python environment is ready
) else (
    echo ERROR: Python environment issue
    pause
    exit /b 1
)

REM ==================== STEP 5: Start Backend ====================
echo.
echo ============================================================
echo   STARTING BACKEND SERVER
echo ============================================================
echo.
echo Backend will start on: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Waiting for database connection...
echo.

python main.py

pause
