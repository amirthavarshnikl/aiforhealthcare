# QUICK FIX: Install Backend Dependencies

## Step 1: Activate Virtual Environment

### On Windows PowerShell:
```powershell
cd d:\medicalreport\backend
.\venv\Scripts\Activate.ps1
```

### On Windows Command Prompt:
```cmd
cd d:\medicalreport\backend
venv\Scripts\activate.bat
```

### On macOS/Linux:
```bash
cd d:\medicalreport\backend
source venv/bin/activate
```

## Step 2: Install All Dependencies

Run this command (copy-paste exactly):

```bash
pip install -r requirements.txt
```

This will install:
- fastapi (web framework)
- uvicorn (ASGI server)
- pymongo (database)
- chromadb (vector store)
- sentence-transformers (embeddings)
- easyocr (text extraction)
- And all other dependencies

## Step 3: Verify Installation

```bash
pip list | grep -i fastapi
```

Should show: `fastapi                0.104.1`

## Step 4: Start Backend

```bash
python main.py
```

You should see:
```
==================================================
🚀 Starting Medical Report AI Backend...
==================================================
✓ MongoDB Connected Successfully
✓ All systems initialized successfully!
==================================================
```

---

## If You Get Errors:

### Error: "No module named 'pip'"
Solution:
```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### Error: "Permission denied"
Solution:
```bash
pip install --user -r requirements.txt
```

### Error: "venv not found"
Solution: Create virtual environment first:
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## Complete Fresh Start (if everything is broken)

```powershell
# Navigate to backend
cd d:\medicalreport\backend

# Remove old venv if exists
Remove-Item venv -Recurse -Force -ErrorAction SilentlyContinue

# Create new virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install all dependencies
pip install -r requirements.txt

# Start backend
python main.py
```

---

## Next: Start Frontend (in new terminal)

```bash
cd d:\medicalreport\frontend-react
npm install
npm run dev
```

---

**After this, both should be running:**
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
