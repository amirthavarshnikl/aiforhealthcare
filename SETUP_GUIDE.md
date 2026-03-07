# 🏥 ReportEase - Complete Startup Guide

## ⚠️ IMPORTANT: Backend Must Run FIRST!

The error you're seeing is because your **backend server is not running**. When the frontend tries to upload a file, it fails because there's no backend to communicate with.

---

## 🚀 STEP 1: Start the Backend Server (Port 8000)

### Option A: Use Startup Script (EASIEST)
Simply **double-click**:
```
START_BACKEND.bat
```

OR

### Option B: Manual Terminal
1. Open a **NEW terminal window**
2. Navigate to the project:
   ```bash
   cd d:\medicalreport
   ```
3. Activate virtual environment:
   ```bash
   venv\Scripts\activate
   ```
4. Start the backend:
   ```bash
   cd backend
   python main.py
   ```

You should see:
```
==================================================
🚀 Starting Medical Report AI Backend...
==================================================
✓ GEMINI_API_KEY configured
✓ All systems initialized successfully!
==================================================

INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## 🚀 STEP 2: Start the Frontend Server (Port 5173)

### Option A: Use Startup Script
In a **DIFFERENT terminal window**, double-click:
```
START_FRONTEND.bat
```

OR

### Option B: Manual Terminal
1. Open a **NEW terminal window** (keep backend terminal running)
2. Navigate to frontend:
   ```bash
   cd d:\medicalreport\frontend-react
   ```
3. Start frontend:
   ```bash
   npm run dev
   ```

You should see:
```
VITE v7.3.1

Local: http://localhost:5173
```

---

## ✅ VERIFICATION CHECKLIST

After both are running, check:

- [ ] **Backend Terminal**: Shows "Uvicorn running on http://0.0.0.0:8000"
- [ ] **Frontend Terminal**: Shows "Local: http://localhost:5173"
- [ ] **Browser**: Frontend loads without errors at http://localhost:5173
- [ ] **Upload Page**: Can navigate to /upload page
- [ ] **File Upload**: Can select a Med report PDF
- [ ] **API Connection**: Upload works without "Failed to fetch" error

---

## 🔧 Troubleshooting

### "Failed to fetch" error when uploading
**Solution**: Your backend is not running. Follow Step 1 above.

### "Cannot GET /uploads/..." error
**Solution**: Normal - this error appears during processing. Wait for "Analyzing..." to complete.

### Port 8000 already in use
```bash
# Kill process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

### Dependencies not installed
```bash
cd backend
pip install -r requirements.txt
cd ../frontend-react
npm install
```

---

## 📋 Full Workflow

1. Upload medical report (PDF/JPG)
2. Backend's OCR extracts text
3. Backend's Gemini AI simplifies medical terms
4. Backend's Gemini AI translates to selected language
5. Results saved to MongoDB
6. Frontend displays summary page
7. User can view analysis and translation

---

## 🛠️ Files Created for You

- `START_BACKEND.bat` - Quick backend launcher
- `START_FRONTEND.bat` - Quick frontend launcher
- `backend/startup_check.py` - Pre-flight validation script

---

## ✨ All Issues Fixed

✅ Double headers removed
✅ Upload button navigation fixed
✅ Black boxes replaced with styled icons
✅ Gemini API integrated
✅ Environment variables configured
✅ CORS enabled
✅ File upload pipeline connected

**Your system is ready to run!**
