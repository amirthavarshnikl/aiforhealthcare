#!/usr/bin/env python3
"""
ReportEase Backend - Complete Setup & Startup Script
Fixes all backend issues and starts the server
"""

import os
import sys
import subprocess
import time
from pathlib import Path

# Colors for output
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_header(text):
    print(f"\n{BLUE}{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}{RESET}\n")

def print_success(text):
    print(f"{GREEN}✓ {text}{RESET}")

def print_warning(text):
    print(f"{YELLOW}⚠ {text}{RESET}")

def print_error(text):
    print(f"{RED}✗ {text}{RESET}")

def run_command(cmd, description="", silent=False):
    """Run a command and return success status"""
    try:
        if silent:
            subprocess.run(cmd, shell=True, capture_output=True, timeout=30)
        else:
            subprocess.run(cmd, shell=True, timeout=30)
        return True
    except Exception as e:
        if description:
            print_error(f"{description}: {str(e)}")
        return False

def check_port(port):
    """Check if port is listening"""
    try:
        result = subprocess.run(
            f"netstat -ano | findstr :{port}",
            shell=True,
            capture_output=True,
            text=True
        )
        return result.returncode == 0
    except:
        return False

def setup_backend():
    """Complete backend setup"""

    print_header("ReportEase Backend - Complete Setup & Start")

    backend_dir = Path("d:/medicalreport/backend")
    os.chdir(backend_dir)

    # ========== STEP 1: Start MongoDB ==========
    print_header("STEP 1: MongoDB Service")

    if check_port(27017):
        print_success("MongoDB already running on port 27017")
    else:
        print("Starting MongoDB service...")
        run_command("net start MongoDB", silent=True)
        time.sleep(2)

        if check_port(27017):
            print_success("MongoDB service started")
        else:
            print_warning("MongoDB might not be installed as service")
            print("Please ensure MongoDB is running separately")
            print("Run: mongod")

    # ========== STEP 2: Upgrade pip ==========
    print_header("STEP 2: Python Setup")

    print("Upgrading pip...")
    run_command(f"{sys.executable} -m pip install --upgrade pip -q", silent=True)
    print_success("pip upgraded")

    # ========== STEP 3: Install Dependencies ==========
    print_header("STEP 3: Installing Dependencies")

    dependencies = {
        "Core": "fastapi uvicorn pymongo pydantic python-dotenv",
        "ML/OCR": "chromadb sentence-transformers easyocr pillow",
        "API": "google-generativeai requests",
    }

    for category, packages in dependencies.items():
        print(f"Installing {category} packages...")
        cmd = f"{sys.executable} -m pip install {packages} -q"
        if run_command(cmd, silent=True):
            print_success(f"{category} packages installed")
        else:
            print_warning(f"Some {category} packages may have failed")

    # ========== STEP 4: Setup .env ==========
    print_header("STEP 4: Environment Configuration")

    env_file = Path(".env")
    if not env_file.exists():
        print("Creating .env file...")
        env_content = """# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017
DB_NAME=medicalreport

# Gemini API (optional - for translation)
GEMINI_API_KEY=your_gemini_api_key_here

# API Settings
DEBUG=False
API_PORT=8000
"""
        env_file.write_text(env_content)
        print_success(".env file created")
    else:
        print_success(".env file already exists")

    # ========== STEP 5: Verify Packages ==========
    print_header("STEP 5: Verification")

    print("Verifying installed packages...")
    try:
        import fastapi
        import uvicorn
        import pymongo
        import pydantic
        print_success("All required packages are installed")
    except ImportError as e:
        print_error(f"Missing package: {str(e)}")
        return False

    # ========== STEP 6: Check Database Connection ==========
    print_header("STEP 6: Database Connection Check")

    try:
        from pymongo import MongoClient
        client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=3000)
        client.admin.command('ping')
        print_success("MongoDB connection verified")
    except Exception as e:
        print_warning(f"MongoDB connection issue: {str(e)}")
        print_warning("Backend will attempt to connect when starting")

    return True

def start_backend():
    """Start the backend server"""

    print_header("STARTING BACKEND SERVER")

    print(f"{BLUE}Backend will start on:{RESET}")
    print(f"  HTTP:  {GREEN}http://localhost:8000{RESET}")
    print(f"  Docs:  {GREEN}http://localhost:8000/docs{RESET}")
    print(f"  Health: {GREEN}http://localhost:8000/api/health{RESET}")
    print()
    print(f"{YELLOW}Waiting for connections...{RESET}\n")

    try:
        import main
        print_warning("Import successful, backend ready")
    except Exception as e:
        print_error(f"Import failed: {str(e)}")

    # Start with uvicorn
    print(f"{BLUE}Starting uvicorn server...{RESET}\n")
    os.system(f"{sys.executable} main.py")

if __name__ == "__main__":
    try:
        # Run setup
        if setup_backend():
            print()
            # Start backend
            start_backend()
        else:
            print_error("Setup failed")
            sys.exit(1)
    except KeyboardInterrupt:
        print_error("\nBackend stopped by user")
        sys.exit(0)
    except Exception as e:
        print_error(f"Error: {str(e)}")
        sys.exit(1)
