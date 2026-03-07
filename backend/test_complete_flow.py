#!/usr/bin/env python3
"""
Comprehensive end-to-end test for ReportEase application
Tests all critical flows to ensure the system works correctly
"""

import asyncio
import requests
import json
from pathlib import Path
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000/api"
TEST_RESULTS = []

# Color codes for output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def log_test(name, passed, details=""):
    """Log test result"""
    status = f"{Colors.GREEN}✓ PASS{Colors.RESET}" if passed else f"{Colors.RED}✗ FAIL{Colors.RESET}"
    print(f"{status} | {name}")
    if details:
        print(f"     {details}")
    TEST_RESULTS.append({'name': name, 'passed': passed})

def print_header(text):
    """Print section header"""
    print(f"\n{Colors.BLUE}{'='*70}")
    print(f"  {text}")
    print(f"{'='*70}{Colors.RESET}\n")

# ============================================================================
# TEST 1: HEALTH CHECK
# ============================================================================
def test_health_check():
    """Test backend health endpoint"""
    print_header("TEST 1: HEALTH CHECK")

    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        passed = response.status_code == 200

        if passed:
            data = response.json()
            mongodb = data.get('mongodb', False)
            vectordb = data.get('vectordb', False)
            log_test("Health Check", passed,
                    f"MongoDB: {mongodb}, VectorDB: {vectordb}, Status: {data.get('status')}")
        else:
            log_test("Health Check", False, f"Status code: {response.status_code}")

    except Exception as e:
        log_test("Health Check", False, str(e))

# ============================================================================
# TEST 2: USER ENDPOINTS
# ============================================================================
def test_user_endpoints():
    """Test user creation and retrieval"""
    print_header("TEST 2: USER ENDPOINTS")

    # Create user
    user_data = {
        "name": "Test User",
        "email": f"test_{datetime.now().timestamp()}@example.com",
        "password": "testpass123"
    }

    try:
        response = requests.post(f"{BASE_URL}/users", json=user_data, timeout=5)
        if response.status_code in [200, 201]:
            user = response.json()
            user_id = user.get('_id' or 'id')
            log_test("Create User", True, f"User ID: {user_id}")

            # Try to retrieve user
            if user_id:
                response = requests.get(f"{BASE_URL}/users/{user_id}", timeout=5)
                passed = response.status_code in [200, 201]
                log_test("Retrieve User", passed, f"Status: {response.status_code}")
        else:
            log_test("Create User", False, f"Status code: {response.status_code}")
    except Exception as e:
        log_test("Create User", False, str(e))

# ============================================================================
# TEST 3: EMBEDDINGS
# ============================================================================
def test_embeddings():
    """Test embedding generation"""
    print_header("TEST 3: EMBEDDINGS")

    embedding_request = {
        "text": "Patient presents with elevated hemoglobin levels indicating polycythaemia."
    }

    try:
        response = requests.post(f"{BASE_URL}/embeddings/generate",
                                json=embedding_request, timeout=30)
        passed = response.status_code == 200

        if passed:
            result = response.json()
            embedding = result.get('embedding', [])
            dimension = len(embedding)
            log_test("Generate Embedding", passed, f"Dimension: {dimension}")
        else:
            log_test("Generate Embedding", False, f"Status: {response.status_code}")

    except Exception as e:
        log_test("Generate Embedding", False, str(e))

# ============================================================================
# TEST 4: RAG ENDPOINTS
# ============================================================================
def test_rag_endpoints():
    """Test RAG query and statistics"""
    print_header("TEST 4: RAG ENDPOINTS")

    # Test RAG stats
    try:
        response = requests.get(f"{BASE_URL}/rag/stats", timeout=5)
        passed = response.status_code == 200

        if passed:
            stats = response.json()
            log_test("RAG Statistics", passed,
                    f"Documents: {stats.get('document_count', 'unknown')}")
        else:
            log_test("RAG Statistics", False, f"Status: {response.status_code}")

    except Exception as e:
        log_test("RAG Statistics", False, str(e))


# ============================================================================
# TEST 5: REPORT ENDPOINTS
# ============================================================================
def test_report_endpoints():
    """Test report CRUD operations"""
    print_header("TEST 5: REPORT ENDPOINTS")

    report_data = {
        "user_id": "demo_user",
        "file_name": "test_report.pdf",
        "original_text": "Test medical report content",
        "simplified_text": "Test simplified content",
        "language": "en",
        "metadata": {"patient_name": "Test Patient"}
    }

    try:
        # Create report
        response = requests.post(f"{BASE_URL}/reports", json=report_data, timeout=5)
        if response.status_code in [200, 201]:
            report = response.json()
            report_id = report.get('_id') or report.get('id')
            log_test("Create Report", True, f"Report ID: {report_id}")

            # Retrieve report
            if report_id:
                response = requests.get(f"{BASE_URL}/reports/{report_id}", timeout=5)
                passed = response.status_code in [200, 201]
                log_test("Retrieve Report", passed, f"Status: {response.status_code}")
        else:
            log_test("Create Report", False, f"Status: {response.status_code}")

    except Exception as e:
        log_test("Create Report", False, str(e))

# ============================================================================
# TEST 6: SUMMARY ENDPOINTS
# ============================================================================
def test_summary_endpoints():
    """Test summary retrieval"""
    print_header("TEST 6: SUMMARY ENDPOINTS")

    # First create a report
    report_data = {
        "user_id": "demo_user",
        "file_name": "test_report.pdf",
        "original_text": "Patient presents with elevated hemoglobin levels",
        "simplified_text": "Patient has more red blood cells than normal",
        "language": "en",
        "metadata": {"patient_name": "Test Patient"}
    }

    try:
        response = requests.post(f"{BASE_URL}/reports", json=report_data, timeout=5)
        if response.status_code in [200, 201]:
            report = response.json()
            report_id = report.get('_id') or report.get('id')

            if report_id:
                # Get summary
                response = requests.get(f"{BASE_URL}/reports/{report_id}/summary", timeout=5)
                passed = response.status_code in [200, 201]

                if passed:
                    summary = response.json()
                    log_test("Get Summary", passed,
                            f"Has medical_summary: {'medical_summary' in summary}")
                else:
                    log_test("Get Summary", False, f"Status: {response.status_code}")
            else:
                log_test("Get Summary", False, "No report ID returned")
        else:
            log_test("Get Summary", False, f"Failed to create report: {response.status_code}")

    except Exception as e:
        log_test("Get Summary", False, str(e))

# ============================================================================
# TEST 7: TRANSLATION ENDPOINTS
# ============================================================================
def test_translation_endpoints():
    """Test translation retrieval"""
    print_header("TEST 7: TRANSLATION ENDPOINTS")

    # First create a report
    report_data = {
        "user_id": "demo_user",
        "file_name": "test_report.pdf",
        "original_text": "Patient presents with elevated hemoglobin levels",
        "simplified_text": "Patient has more red blood cells than normal",
        "translated_text": "பரीட்சை மிக அधிक ரற்றக வணு உள்ளன",
        "language": "ta",
        "metadata": {"patient_name": "Test Patient"}
    }

    try:
        response = requests.post(f"{BASE_URL}/reports", json=report_data, timeout=5)
        if response.status_code in [200, 201]:
            report = response.json()
            report_id = report.get('_id') or report.get('id')

            if report_id:
                # Get translation
                response = requests.get(f"{BASE_URL}/reports/{report_id}/translation?language=ta",
                                       timeout=5)
                passed = response.status_code in [200, 201]

                if passed:
                    translation = response.json()
                    log_test("Get Translation", passed,
                            f"Language: {translation.get('language', 'unknown')}")
                else:
                    log_test("Get Translation", False, f"Status: {response.status_code}")
            else:
                log_test("Get Translation", False, "No report ID returned")
        else:
            log_test("Get Translation", False, f"Failed to create report: {response.status_code}")

    except Exception as e:
        log_test("Get Translation", False, str(e))

# ============================================================================
# TEST 8: FRONTEND API CONNECTIVITY
# ============================================================================
def test_frontend_api_connectivity():
    """Test that frontend can connect to backend"""
    print_header("TEST 8: FRONTEND API CONNECTIVITY")

    # Test basic API request like frontend would make
    try:
        response = requests.get(f"{BASE_URL}/health",  timeout=5)
        passed = response.status_code == 200
        log_test("Frontend → Backend Connection", passed,
                f"Status: {response.status_code}, Base URL: {BASE_URL}")
    except Exception as e:
        log_test("Frontend → Backend Connection", False, str(e))

# ============================================================================
# RESULTS SUMMARY
# ============================================================================
def print_summary():
    """Print test summary"""
    print_header("TEST SUMMARY")

    total = len(TEST_RESULTS)
    passed = sum(1 for t in TEST_RESULTS if t['passed'])
    failed = total - passed

    print(f"Total Tests: {total}")
    print(f"{Colors.GREEN}Passed: {passed}{Colors.RESET}")
    print(f"{Colors.RED}Failed: {failed}{Colors.RESET}")

    if failed == 0:
        print(f"\n{Colors.GREEN}✓ ALL TESTS PASSED!{Colors.RESET}")
    else:
        print(f"\n{Colors.RED}✗ SOME TESTS FAILED{Colors.RESET}")
        print("\nFailed tests:")
        for test in TEST_RESULTS:
            if not test['passed']:
                print(f"  - {test['name']}")

# ============================================================================
# MAIN
# ============================================================================
def main():
    """Run all tests"""
    print(f"\n{Colors.BLUE}")
    print("="*70)
    print("  ReportEase End-to-End Test Suite")
    print("  Backend API Verification")
    print("="*70)
    print(f"{Colors.RESET}")

    # Run all tests
    test_health_check()
    test_user_endpoints()
    test_embeddings()
    test_rag_endpoints()
    test_report_endpoints()
    test_summary_endpoints()
    test_translation_endpoints()
    test_frontend_api_connectivity()

    # Print summary
    print_summary()

if __name__ == "__main__":
    main()
