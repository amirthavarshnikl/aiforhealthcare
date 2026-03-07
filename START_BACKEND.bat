@echo off
REM ReportEase Backend Startup Script for Windows
REM This script starts the FastAPI backend server

echo.
echo ====================================================
echo REPORTEASE BACKEND STARTUP
echo ====================================================
echo.

REM Navigate to backend directory
cd /d "%~dp0\backend"

REM Activate virtual environment
call ..\venv\Scripts\activate.bat

REM Run startup checks
echo [*] Running startup checks...
python startup_check.py

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Startup checks failed!
    pause
    exit /b 1
)

echo.
echo [*] Starting FastAPI server on http://localhost:8000
echo.

REM Start the backend
python main.py
