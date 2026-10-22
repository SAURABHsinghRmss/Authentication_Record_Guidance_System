"""
Tests for Cross-Role Function Connectivity and Pipelining
"""

import pytest
from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)

def get_token(username, password):
    resp = client.post("/api/auth/login", json={"username": username, "password": password})
    if resp.status_code == 200:
        return resp.json()["access_token"]
    return None

def test_parent_ward_pipeline():
    # Login as parent or admin
    token = get_token("msrch", "msrch1410#")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    resp = client.post("/api/cross-role/parent-ward-summary", json={"ward_username": "amit"}, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "academic_standing" in data
    assert data["ward_username"] == "amit"

def test_faculty_auth_student_doc_pipeline():
    token = get_token("msrch", "msrch1410#")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    resp = client.post(
        "/api/cross-role/faculty-auth-student-doc",
        json={"student_username": "amit", "document_title": "B.Tech Final Project Report", "document_text": "AI Academic Identity & Record Governance System."},
        headers=headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["authentication_result"]["status"] == "AUTHENTICATED"

def test_institute_escalate_admin_pipeline():
    token = get_token("msrch", "msrch1410#")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    resp = client.post(
        "/api/cross-role/institute-escalate-admin",
        json={
            "institute_name": "GL Bajaj Institute",
            "issue_title": "AICTE EVC Report Escalation",
            "bureau": "AICTE Approval Bureau (AB)",
            "description": "Urgent review requested for intake expansion approval."
        },
        headers=headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ESCALATED_SUCCESS"
    assert "case_record" in data
