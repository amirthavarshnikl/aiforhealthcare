@echo off
REM ReportEase Frontend Startup Script for Windows
REM This script starts the React dev server

echo.
echo ====================================================
echo REPORTEASE FRONTEND STARTUP
echo ====================================================
echo.

REM Navigate to frontend directory
cd /d "%~dp0\frontend-react"

echo [*] Starting Vite dev server on http://localhost:5173
echo.

REM Start the frontend
npm run dev
