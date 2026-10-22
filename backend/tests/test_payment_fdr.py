"""
Tests for Payment, Security Deposit & FDR Escrow Portal
"""

import pytest
from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)

def get_admin_token():
    resp = client.post("/api/auth/login", json={"username": "msrch", "password": "msrch1410#"})
    if resp.status_code == 200:
        return resp.json()["access_token"]
    resp2 = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    if resp2.status_code == 200:
        return resp2.json()["access_token"]
    return None

def test_payment_processing_and_ledger():
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    # Process payment
    payment_payload = {
        "beneficiary_name": "GL Bajaj Institute",
        "payment_type": "SECURITY_DEPOSIT",
        "amount_inr": 15000.0,
        "mode": "UPI (GooglePay / PhonePe / Paytm)",
        "remarks": "Caution money security deposit."
    }
    resp = client.post("/api/payments-fdr/process", json=payment_payload, headers=headers)
    assert resp.status_code == 201
    assert resp.json()["status"] == "SUCCESS"
    
    # Get ledger
    resp_ledger = client.get("/api/payments-fdr/ledger", headers=headers)
    assert resp_ledger.status_code == 200
    assert isinstance(resp_ledger.json(), list)

def test_fdr_escrow_portal_and_creation():
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    # Get FDR Escrow Portal
    resp = client.get("/api/payments-fdr/fdr-portal", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total_fdr_escrow_inr" in data
    
    # Create FDR Escrow Bond
    fdr_payload = {
        "institution_name": "GL Bajaj Institute",
        "issuing_bank": "Punjab National Bank (PNB)",
        "fdr_number": "PNB/FDR/2026/88392",
        "principal_amount_inr": 5000000.0,
        "deposit_type": "AICTE Statutory Reserve FDR Escrow Bond",
        "maturity_date": "2031-12-31",
        "interest_rate_percent": 7.8
    }
    resp_create = client.post("/api/payments-fdr/fdr-portal/create", json=fdr_payload, headers=headers)
    assert resp_create.status_code == 201
    assert resp_create.json()["status"] == "SUCCESS"
