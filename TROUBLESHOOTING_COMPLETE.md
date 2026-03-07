# ReportEase Backend - COMPLETE TROUBLESHOOTING & FIX GUIDE

**Issue**: "Report not found" error when trying to access reports
**Root Cause**: MongoDB not running or backend not properly configured
**Solution**: Complete system reinstall and startup

---

## 🚨 CRITICAL CHECKLIST

Before running backend, verify:

- [ ] **MongoDB is installed** - https://www.mongodb.com/try/download/community
- [ ] **MongoDB is running** - Run: `net start MongoDB` or `mongod`
- [ ] **Port 27017 is available** - Run: `netstat -ano | findstr :27017`
- [ ] **Python is installed** - Run: `python --version` (should be 3.8+)
- [ ] **Working directory is correct** - Should be: `d:\medicalreport\backend`

---

## 🔧 AUTOMATED FIX (Recommended)

### Option A: Python Script (Best)

```cmd
cd d:\medicalreport\backend
python setup_and_run.py
```

**What it does:**
- Checks MongoDB
- Installs all Python packages
- Sets up .env file
- Starts backend server
- Keeps running and monitoring

### Option B: Batch Script

```cmd
d:\medicalreport\backend\START_BACKEND.bat
```

**What it does:**
- Same as above but in batch format

---

## 🎯 MANUAL FIX (If automated fails)

### Step 1: Start MongoDB

```cmd
REM Check if running
netstat -ano | findstr :27017

REM If not running, start service
net start MongoDB

REM If service doesn't exist, start manually
mongod
```

**Expected output (port checking):**
```
TCP    127.0.0.1:27017       0.0.0.0:0              LISTENING
```

### Step 2: Install Python Packages

```cmd
cd d:\medicalreport\backend

REM Upgrade pip first
python -m pip install --upgrade pip

REM Install all requirements
pip install -r requirements.txt

REM Or install individually
pip install fastapi uvicorn pymongo pydantic python-dotenv
pip install chromadb sentence-transformers easyocr pillow
```

### Step 3: Create .env File

Create file: `d:\medicalreport\backend\.env`

Content:
```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=medicalreport
GEMINI_API_KEY=your_key_here
DEBUG=False
API_PORT=8000
```

### Step 4: Test Python Import

```cmd
python -c "import fastapi; import uvicorn; import pymongo; print('OK')"
```

Should output: `OK`

### Step 5: Start Backend

```cmd
cd d:\medicalreport\backend
python main.py
```

Should see:
```
==================================================
🚀 Starting Medical Report AI Backend...
==================================================

📋 Checking required environment variables...
✓ GEMINI_API_KEY configured

✓ MongoDB Connected Successfully
✓ All systems initialized successfully!
==================================================

INFO:     Application startup complete [uvicorn]
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## ✅ VERIFICATION

### Test 1: Backend Health

```cmd
curl http://localhost:8000/api/health
```

Should return:
```json
{"status":"healthy","mongodb":true,"vectordb":true,"embeddings":true,"timestamp":"2026-03-07T..."}
```

### Test 2: Check MongoDB Connection

```cmd
mongo
> use medicalreport
> db.reports.count()
```

Should work without errors.

### Test 3: Run Full Test Suite

```cmd
python d:\medicalreport\backend\final_test.py
```

Should show:
```
RESULTS: 26 Passed, 0 Failed
```

---

## 🚨 COMMON ERRORS & FIXES

### Error: "Could not import module 'backend'"

**Cause**: Dependencies not installed

**Fix**:
```cmd
cd d:\medicalreport\backend
pip install -r requirements.txt
```

---

### Error: "MongoDB Connection Failed"

**Cause**: MongoDB not running

**Fix**:
```cmd
net start MongoDB
```

Or if service doesn't exist:
```cmd
mongod
```

---

### Error: "Port 8000 already in use"

**Cause**: Another process using port 8000

**Fix**:
```cmd
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

### Error: "Module not found" (fastapi, uvicorn, etc.)

**Cause**: Virtual environment not activated or packages not installed

**Fix**:
```cmd
REM Navigate to backend
cd d:\medicalreport\backend

REM If using venv, activate it
venv\Scripts\activate.bat

REM Install packages
pip install -r requirements.txt
```

---

### Error: "AttributeError: module 'main' has no attribute 'app'"

**Cause**: main.py has syntax errors

**Fix**:
```cmd
python -m py_compile main.py
```

If it shows errors, fix the Python syntax.

---

### Error: "Report not found" when uploading

**Cause**:
- MongoDB not connected
- Reports collection not created
- Database authentication issue

**Fix**:
1. Check MongoDB status: `net start MongoDB`
2. Check connection: `curl http://localhost:8000/api/health`
3. Verify `mongodb: true` in response
4. Run backend again: `python main.py`

---

## 🔄 COMPLETE SYSTEM RESTART

If nothing works, do a complete restart:

```cmd
REM 1. Kill all Python processes
taskkill /IM python.exe /F

REM 2. Restart MongoDB
net stop MongoDB
timeout /t 2 /nobreak
net start MongoDB

REM 3. Go to backend
cd d:\medicalreport\backend

REM 4. Clear Python cache
rmdir /s /q __pycache__
rmdir /s /q .pytest_cache

REM 5. Reinstall packages
pip uninstall -y fastapi uvicorn pymongo
pip install -r requirements.txt

REM 6. Start backend
python main.py
```

---

## 📊 DEBUGGING TIPS

### Enable Verbose Logging

Edit `main.py` and add:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Check Each Component

```bash
# Check MongoDB
python -c "from pymongo import MongoClient; client = MongoClient(); print(client.admin.command('ping'))"

# Check Embeddings
python -c "from sentence_transformers import SentenceTransformer; model = SentenceTransformer('all-MiniLM-L6-v2'); print('OK')"

# Check FastAPI
python -c "import fastapi; print(fastapi.__version__)"
```

---

## 🎯 FINAL CHECKLIST BEFORE RUNNING

- [ ] MongoDB running: `netstat -ano | findstr :27017`
- [ ] Python packages installed: `pip list | findstr fastapi`
- [ ] .env file exists: `d:\medicalreport\backend\.env`
- [ ] No port conflicts: `netstat -ano | findstr :8000`
- [ ] Backend directory: `d:\medicalreport\backend`

---

## 🚀 QUICKEST WORKING SOLUTION

1. **Open Command Prompt** in `d:\medicalreport\backend`

2. **Run this command**:
```cmd
python setup_and_run.py
```

3. **Wait for message**: "Backend will start on: http://localhost:8000"

4. **In another terminal, test**:
```cmd
curl http://localhost:8000/api/health
```

5. **Start frontend** (in third terminal):
```cmd
cd d:\medicalreport\frontend-react
npm run dev
```

6. **Open browser**: http://localhost:5173

7. **Upload a file and test!**

---

**This should completely fix your backend!** ✅
