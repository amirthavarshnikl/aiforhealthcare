@echo off
REM ReportEase Application Launcher - Complete Startup Script

title ReportEase Application Launcher
color 0A

echo.
echo ========================================
echo   ReportEase - Complete Startup
echo ========================================
echo.

REM Check and Start MongoDB
echo [Step 1] Checking MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo SUCCESS: MongoDB service started
) else (
    echo WARNING: MongoDB service not found
    echo Try installing from: https://www.mongodb.com/try/download/community
    echo Or run: mongod
)

echo.
echo [Step 2] Starting Backend...
start cmd /k "cd d:\medicalreport\backend && python main.py"
timeout /t 3 /nobreak

echo.
echo [Step 3] Starting Frontend...
start cmd /k "cd d:\medicalreport\frontend-react && npm run dev"
timeout /t 3 /nobreak

echo.
echo ========================================
echo   Services Started!
echo ========================================
echo.
echo Open in browser:
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo.
echo To verify everything works:
echo   Run: python d:\medicalreport\backend\final_test.py
echo.
pause
