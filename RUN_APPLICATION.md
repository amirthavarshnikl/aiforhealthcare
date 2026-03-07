# ReportEase - Complete Application Setup & Run Instructions

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ installed
- MongoDB running locally or connection string configured
- Git (optional, for version control)

---

## Directory Structure

```
d:\medicalreport\
├── backend/                    # FastAPI server
│   ├── main.py                # FastAPI app (entry point)
│   ├── config.py              # Configuration
│   ├── models.py              # Pydantic models
│   ├── services/              # ML pipelines
│   ├── database/              # DB connections
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend-react/            # React application
│   ├── src/
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite config
└── README.md
```

---

## Step 1: Setup Backend

### 1A. Navigate to Backend Directory
```bash
cd d:\medicalreport\backend
```

### 1B. Create Virtual Environment (First Time Only)
```bash
python -m venv venv
```

### 1C. Activate Virtual Environment

**On Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**On Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**On macOS/Linux:**
```bash
source venv/bin/activate
```

### 1D. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 1E. Configure Environment Variables
Create or edit `.env` file in `backend/`:
```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017
DB_NAME=medicalreport

# Gemini API (for translation)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Flask/API settings
DEBUG=False
API_PORT=8000
```

### 1F. Start MongoDB (if running locally)
```bash
mongod
```

Or if MongoDB is installed as a service:
```bash
# Windows
net start MongoDB
```

### 1G. Start FastAPI Backend Server
```bash
python main.py
```

**Expected Output:**
```
==================================================
🚀 Starting Medical Report AI Backend...
==================================================

📋 Checking required environment variables...
✓ GEMINI_API_KEY configured

✓ MongoDB Connected Successfully
✓ All systems initialized successfully!
==================================================
```

**Backend will run at**: `http://localhost:8000`
**API Documentation**: `http://localhost:8000/docs`

---

## Step 2: Setup Frontend (New Terminal/PowerShell)

### 2A. Navigate to Frontend Directory
```bash
cd d:\medicalreport\frontend-react
```

### 2B. Install Node Dependencies
```bash
npm install
```

### 2C. Configure Environment (Optional)
Create `.env.local` file:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2D. Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.3.1  ready in 345 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Frontend will run at**: `http://localhost:5173`

---

## Step 3: Verify System is Running

### 3A. Check Backend Health
```bash
curl http://localhost:8000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "mongodb": true,
  "vectordb": true,
  "embeddings": true,
  "timestamp": "2026-03-07T10:00:00.000000"
}
```

### 3B. Check Frontend Access
Open browser: `http://localhost:5173`

Should see ReportEase homepage with "Upload Your Report" section

### 3C. Run System Test
```bash
cd d:\medicalreport\backend
python final_test.py
```

**Expected Output:**
```
======================================================================
  REPORTEASE END-TO-END SYSTEM TEST
======================================================================

[Phase 1] Backend Connectivity
✅ Backend accessible
✅ MongoDB connected
✅ VectorDB connected

...

RESULTS: 26 Passed, 0 Failed

✅ ALL TESTS PASSED - System is fully operational!
```

---

## Step 4: Using the Application

### 4A. Upload a Medical Report

1. Navigate to `http://localhost:5173`
2. Click "Upload Your Report" or navigate to `/upload`
3. Select a medical document (PDF, PNG, JPG)
4. Fill in report details:
   - Report Name
   - Report Type (Blood Work, X-Ray, etc.)
   - Report Date
   - Patient Name
5. Select language for translation (English, Tamil, Hindi, Kannada)
6. Click "Analyze Report"

### 4B. View Summary

1. After processing, you'll be redirected to the Summary page
2. You'll see:
   - Medical summary
   - Simplified explanation
   - Key findings
   - Health score

### 4C. View Translations

1. On summary page, click "View Translations"
2. Or navigate to `/translation/{reportId}`
3. Select language tabs to see translations in:
   - English (Original) 🌐
   - Tamil தமிழ் 🇮🇳
   - Hindi हिन्दी 🇮🇳
   - Kannada ಕನ್ನಡ 🇮🇳

### 4D. Export Results

- Copy to Clipboard: Copies translation text
- Download as TXT: Downloads as text file
- Share on WhatsApp: Opens WhatsApp with translation

---

## Production Build

### Frontend Production Build
```bash
cd d:\medicalreport\frontend-react
npm run build
```

This creates optimized build in `dist/` folder:
```
dist/
├── index.html           (0.47 kB)
├── assets/
│   ├── index-*.css     (56.23 kB)
│   └── index-*.js      (238.50 kB)
```

### Serve Production Build Locally
```bash
npm run preview
```

---

## Troubleshooting

### Issue: MongoDB Connection Error
```
✗ MongoDB Connection Failed: Server selection timed out
```
**Solution**:
- Install MongoDB from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): Update `MONGO_URI` in `.env`

### Issue: Backend Won't Start
```
ModuleNotFoundError: No module named 'fastapi'
```
**Solution**:
```bash
pip install -r requirements.txt
```

### Issue: Frontend Won't Start
```
Module not found: Can't resolve '@babel/plugin-proposal-decorators'
```
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port Already in Use
```
Address already in use
```
**Solution**:
- Backend (8000): Kill process on port 8000
- Frontend (5173): Kill process on port 5173
- Or change port: `npm run dev -- --port 3000`

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Backend CORS is already configured. Make sure:
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:5173`
- Both on localhost

---

## Quick Start Commands (Copy-Paste)

### Terminal 1 - Backend
```powershell
cd d:\medicalreport\backend
.\venv\Scripts\Activate.ps1
python main.py
```

### Terminal 2 - Frontend
```powershell
cd d:\medicalreport\frontend-react
npm run dev
```

### Terminal 3 - Tests (Optional)
```powershell
cd d:\medicalreport\backend
python final_test.py
```

---

## API Endpoints Reference

### Health & Status
- `GET /api/health` - System health check

### Reports
- `POST /api/upload-report` - Upload & process report
- `GET /api/reports/{id}` - Get report details
- `GET /api/reports/{id}/summary` - Get AI summary
- `GET /api/reports/{id}/translation?language=ta` - Get translation

### Embeddings
- `POST /api/embeddings/generate` - Generate text embeddings
- `POST /api/embeddings/batch` - Batch generate embeddings

### RAG System
- `POST /api/rag/query` - Query knowledge base
- `GET /api/rag/stats` - RAG statistics
- `POST /api/rag/add` - Add documents to RAG

---

## Frontend Routes

- `/` - Home page
- `/upload` - Upload medical report
- `/summary/:reportId` - View AI summary
- `/translation/:reportId` - View translations

---

## File Locations for Quick Reference

| File | Purpose |
|------|---------|
| `backend/main.py` | FastAPI entry point |
| `backend/.env` | Backend configuration |
| `frontend-react/src/App.jsx` | React routing |
| `frontend-react/src/pages/UploadPage.jsx` | Upload interface |
| `frontend-react/.env.local` | Frontend configuration |

---

## Environment Setup (First Time)

```bash
# 1. Backend setup
cd d:\medicalreport\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 2. Frontend setup
cd d:\medicalreport\frontend-react
npm install

# 3. Start services
# Terminal 1:
cd d:\medicalreport\backend
.\venv\Scripts\Activate.ps1
python main.py

# Terminal 2:
cd d:\medicalreport\frontend-react
npm run dev

# 3. Verify
# Terminal 3:
curl http://localhost:8000/api/health
# Open browser: http://localhost:5173
```

---

## Monitoring

### Backend Logs
- Can be found in `backend/` directory
- Real-time output in terminal

### Frontend Errors
- Browser console (F12 > Console tab)
- Network requests (F12 > Network tab)

### Test Results
```bash
python d:\medicalreport\backend\final_test.py
```

---

## Next Steps

1. ✅ Start backend server
2. ✅ Start frontend server
3. ✅ Open browser to `http://localhost:5173`
4. ✅ Try uploading a medical document
5. ✅ View AI summary and translations

---

## Support

- **Backend Documentation**: `http://localhost:8000/docs` (when running)
- **API Schema**: `http://localhost:8000/openapi.json`
- **Test Reports**: See `FINAL_TEST_REPORT.md` in project root

---

**Happy Testing! 🚀**
