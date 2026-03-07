# SIMPLEST WAY TO RUN BACKEND

## Method 1: One Command (Recommended)

Open **Command Prompt** in `d:\medicalreport\backend\` and run:

```cmd
python setup_and_run.py
```

This will:
1. Start MongoDB
2. Install all dependencies automatically
3. Setup configuration
4. Start backend server
5. Keep it running

---

## Method 2: Batch Script

Double-click:
```
d:\medicalreport\backend\START_BACKEND.bat
```

---

## Method 3: Manual (If above don't work)

### Terminal 1: Start MongoDB
```cmd
net start MongoDB
```

Wait 2 seconds, then verify:
```cmd
netstat -ano | findstr :27017
```

Should show MongoDB listening.

### Terminal 2: Install Dependencies
```cmd
cd d:\medicalreport\backend
pip install -r requirements.txt
```

### Terminal 3: Start Backend
```cmd
cd d:\medicalreport\backend
python main.py
```

---

## Method 4: Using Uvicorn Directly

```cmd
cd d:\medicalreport\backend
pip install uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Verify Backend is Working

In a new terminal, run:

```cmd
curl http://localhost:8000/api/health
```

Should show:
```json
{"status":"healthy","mongodb":true,"vectordb":true,"embeddings":true}
```

---

## After Backend is Running

### Terminal 4: Start Frontend
```cmd
cd d:\medicalreport\frontend-react
npm install
npm run dev
```

Frontend will start on: http://localhost:5173

---

## Test Everything

```cmd
python d:\medicalreport\backend\final_test.py
```

Should show: **26 Passed, 0 Failed**

---

## If Still Getting Errors

### Check 1: Is MongoDB running?
```cmd
netstat -ano | findstr :27017
```

If nothing, start MongoDB:
```cmd
mongod
```

### Check 2: Are dependencies installed?
```cmd
pip list | findstr fastapi
```

If not found:
```cmd
pip install -r requirements.txt
```

### Check 3: Port conflict?
```cmd
netstat -ano | findstr :8000
```

If port 8000 in use:
```cmd
taskkill /PID <PID> /F
```

---

## FASTEST WAY TO GET RUNNING:

1. **Start MongoDB** (copy-paste):
```cmd
net start MongoDB
```

2. **Run Setup Script** (copy-paste):
```cmd
cd d:\medicalreport\backend
python setup_and_run.py
```

That's it! Backend will start automatically.

---

## After that works:

3. **Start Frontend** (new terminal):
```cmd
cd d:\medicalreport\frontend-react
npm run dev
```

4. **Open Browser**:
```
http://localhost:5173
```

5. **Upload a medical report** and test!

---

**Try Method 1 first - it should just work!**
