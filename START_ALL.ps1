# ReportEase - Complete Application Startup Script
# Run this PowerShell script to start everything

Write-Host "`n" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ReportEase - Complete Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor Green

# Step 1: Start MongoDB
Write-Host "[Step 1] Starting MongoDB..." -ForegroundColor Yellow
try {
    Start-Service MongoDB -ErrorAction SilentlyContinue
    Write-Host "SUCCESS: MongoDB service started" -ForegroundColor Green
} catch {
    Write-Host "WARNING: MongoDB service not found or already running" -ForegroundColor Yellow
    Write-Host "Try installing from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# Step 2: Start Backend
Write-Host "`n[Step 2] Starting Backend..." -ForegroundColor Yellow
Start-Process PowerShell -ArgumentList @"
cd 'd:\medicalreport\backend'
Write-Host 'Backend Starting...' -ForegroundColor Cyan
python main.py
"@ -WindowStyle Normal

Start-Sleep -Seconds 3

# Step 3: Start Frontend
Write-Host "`n[Step 3] Starting Frontend..." -ForegroundColor Yellow
Start-Process PowerShell -ArgumentList @"
cd 'd:\medicalreport\frontend-react'
Write-Host 'Frontend Starting...' -ForegroundColor Cyan
npm run dev
"@ -WindowStyle Normal

Start-Sleep -Seconds 2

# Summary
Write-Host "`n" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Services Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`n"
Write-Host "Open in your browser:" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor Green
Write-Host "  API Docs:  http://localhost:8000/docs" -ForegroundColor Green
Write-Host "`n"
Write-Host "To verify everything works, run:" -ForegroundColor Yellow
Write-Host "  python d:\medicalreport\backend\final_test.py" -ForegroundColor Green
Write-Host "`n"

# Wait for user input
Read-Host "Press Enter to keep windows open, or close this window"
