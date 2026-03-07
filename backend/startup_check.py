"""
Startup validation checks for ReportEase backend
Ensures all critical dependencies and configurations are in place before starting
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file FIRST
load_dotenv()

def check_env_variables():
    """Check all required environment variables"""
    print("\n[*] Checking Environment Variables...")
    print("-" * 50)

    gemini_key = os.getenv("GEMINI_API_KEY")
    mongo_uri = os.getenv("MONGO_URI")

    checks = {
        "GEMINI_API_KEY": gemini_key,
        "MONGO_URI": mongo_uri,
    }

    all_ok = True
    for var_name, value in checks.items():
        if not value:
            print(f"[X] {var_name}: NOT SET")
            all_ok = False
        elif value == "your_gemini_api_key_here":
            print(f"[!] {var_name}: PLACEHOLDER VALUE (needs real key)")
            all_ok = False
        else:
            # Show masked value for security
            display_value = value[:20] + "..." if len(value) > 20 else value
            print(f"[OK] {var_name}: {display_value}")

    return all_ok


def check_dependencies():
    """Check all required Python packages"""
    print("\n[*] Checking Python Dependencies...")
    print("-" * 50)

    required = [
        "fastapi",
        "uvicorn",
        "pymongo",
        "chromadb",
        "google.generativeai",
        "sentence_transformers",
        "pydantic",
    ]

    all_ok = True
    for package in required:
        try:
            __import__(package)
            print(f"[OK] {package}")
        except ImportError:
            print(f"[X] {package}: NOT INSTALLED")
            all_ok = False

    return all_ok


def check_directories():
    """Check required directories"""
    print("\n[*] Checking Directory Structure...")
    print("-" * 50)

    required_dirs = [
        "./database",
        "./services",
    ]

    required_files = [
        "./models.py",
    ]

    all_ok = True
    for dir_path in required_dirs:
        if Path(dir_path).exists():
            print(f"[OK] {dir_path}/")
        else:
            print(f"[X] {dir_path}/: NOT FOUND")
            all_ok = False

    for file_path in required_files:
        if Path(file_path).exists():
            print(f"[OK] {file_path}")
        else:
            print(f"[X] {file_path}: NOT FOUND")
            all_ok = False

    return all_ok


def run_startup_checks():
    """Run all startup checks"""
    print("\n" + "="*50)
    print("[STARTUP] REPORTEASE BACKEND VALIDATION")
    print("="*50)

    checks = [
        ("Environment Variables", check_env_variables()),
        ("Dependencies", check_dependencies()),
        ("Directory Structure", check_directories()),
    ]

    all_passed = all(result for _, result in checks)

    print("\n" + "="*50)
    if all_passed:
        print("[OK] ALL CHECKS PASSED - System ready to start!")
        print("="*50 + "\n")
        return True
    else:
        print("[ERROR] STARTUP CHECKS FAILED - Please fix issues above")
        print("="*50 + "\n")
        return False


if __name__ == "__main__":
    if not run_startup_checks():
        sys.exit(1)
