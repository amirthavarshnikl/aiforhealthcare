# CRITICAL FIX: MongoDB Not Running

## The Problem
MongoDB is not running on your computer. Backend can't store or retrieve reports without it.

## Solution: Start MongoDB

### Option 1: MongoDB as Windows Service (RECOMMENDED)

```cmd
net start MongoDB
```

If this works, you should see:
```
The MongoDB service is starting.
The MongoDB service has been successfully started.
```

### Option 2: Start MongoDB Manually

```bash
# Find MongoDB installation
mongod
```

It should output:
```
[initandlisten] waiting for connections on port 27017
```

### Option 3: MongoDB Atlas (Cloud Version)

1. Go to: https://www.mongodb.com/cloud
2. Create free account
3. Get connection string
4. Update in `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=medicalreport
```

---

## Complete Startup Guide

### Step 1: Start MongoDB
```cmd
net start MongoDB
```
Or keep it running with:
```bash
mongod
```

### Step 2: Start Backend (Terminal 1)
```powershell
cd d:\medicalreport\backend
python main.py
```

You should see:
```
✓ MongoDB Connected Successfully
✓ All systems initialized successfully!
```

### Step 3: Start Frontend (Terminal 2)
```powershell
cd d:\medicalreport\frontend-react
npm run dev
```

### Step 4: Verify Everything
```powershell
cd d:\medicalreport\backend
python final_test.py
```

---

## Check MongoDB Status

```bash
# Check if MongoDB is running
netstat -an | findstr 27017
```

Should show MongoDB listening on port 27017

---

## After Starting MongoDB

1. Backend will connect automatically
2. You can create/upload reports
3. Reports will be stored in MongoDB
4. No more "report not found" errors

---

## Troubleshooting

### MongoDB won't start?
- Install from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud)

### Still getting errors?
- Restart backend: `python main.py`
- Check MongoDB is on port 27017
- Check `.env` file has correct MONGO_URI

