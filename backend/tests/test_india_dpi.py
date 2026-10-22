"""
Tests for India Digital Public Infrastructure (DPI) Integration Services
"""

import pytest
from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)

def get_auth_token():
    resp = client.post("/api/auth/login", json={"username": "amit", "password": "amit123"})
    if resp.status_code == 200:
        return resp.json()["access_token"]
    return None

def test_verify_apaar_abc():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    resp = client.post(
        "/api/india-dpi/verify-apaar-abc",
        json={"apaar_id": "APAAR-9988-7766", "student_name": "Amit Sharma"},
        headers=headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["verified"] is True
    assert "DigiLocker" in data["service"]

def test_verify_nsp_scholarship():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    resp = client.post(
        "/api/india-dpi/verify-nsp-scholarship",
        json={"student_id": "stu_amit", "category": "General"},
        headers=headers
    )
    assert resp.status_code == 200
    assert "National Scholarship Portal" in resp.json()["service"]

def test_verify_aicte_portal():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    resp = client.post(
        "/api/india-dpi/verify-aicte-portal",
        json={"accreditation_number": "AICTE-UP-2026", "institution_name": "GL Bajaj"},
        headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "APPROVED"

def test_verify_uidai_aadhaar():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    resp = client.post(
        "/api/india-dpi/verify-uidai-aadhaar",
        json={"aadhaar_number": "987654321098"},
        headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()["uidai_status"] == "AUTHENTICATED"

def test_verify_pfms_payment():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    resp = client.post(
        "/api/india-dpi/verify-pfms-payment",
        json={"utr_number": "UTR2026998877", "amount": 12500.0},
        headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()["reconciliation_status"] == "RECONCILED"
