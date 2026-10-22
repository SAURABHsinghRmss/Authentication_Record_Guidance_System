"""
Tests for Admin Complaints Dashboard & AICTE Approval Workflow Automation
"""

import pytest
from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)

def get_admin_token():
    # Login as admin 'msrch'
    resp = client.post("/api/auth/login", json={"username": "msrch", "password": "msrch1410#"})
    if resp.status_code == 200:
        return resp.json()["access_token"]
    # Fallback to standard admin
    resp2 = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    if resp2.status_code == 200:
        return resp2.json()["access_token"]
    return None

def test_admin_complaints_dashboard():
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    resp = client.get("/api/admin/complaints", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total_cases" in data
    assert "bureau_breakdown" in data
    assert isinstance(data["cases"], list)

def test_admin_create_and_update_complaint():
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    # Create complaint
    new_cmp = {
        "title": "AICTE Payment Gateway Discrepancy",
        "bureau_or_cell": "AICTE Payment & Finance Cell",
        "complainant_role": "institute",
        "complainant_name": "Test Institute",
        "category": "Payments & Fees",
        "priority": "URGENT",
        "description": "Fee transaction status pending reconciliation."
    }
    resp = client.post("/api/admin/complaints", json=new_cmp, headers=headers)
    assert resp.status_code == 201
    created = resp.json()["case"]
    case_id = created["case_id"]
    
    # Update status
    update_payload = {
        "status": "RESOLVED",
        "resolution_notes": "Reconciled with SBIePay transaction log."
    }
    resp_update = client.patch(f"/api/admin/complaints/{case_id}", json=update_payload, headers=headers)
    assert resp_update.status_code == 200
    assert resp_update.json()["case"]["status"] == "RESOLVED"

def test_aicte_approval_workflow_status():
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    resp = client.get("/api/admin/aicte-workflow", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "workflow_title" in data
    assert isinstance(data["stages"], list)
    assert isinstance(data["alerts"], list)
    assert len(data["stages"]) >= 5
