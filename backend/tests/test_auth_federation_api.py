import os
import json
from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)

def test_login_primary():
    res = client.post("/api/auth/login", json={"username": "msrch", "password": "msrch1410#"})
    assert res.status_code == 200, res.text
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "admin"
    assert data["db_source"] == "primary_eduidentity"
    assert data["federation_status"] == "7_DATABASES_ONLINE"
    print("[OK] Primary login successful. Data:", {k: data[k] for k in ["role", "db_source", "federation_status", "unread_notifications"]})

def test_login_demo_student():
    res = client.post("/api/auth/login", json={"username": "amit", "password": "amit123"})
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["role"] == "student"
    print("[OK] Student demo login successful:", data["username"])

def test_diagnostics_endpoint():
    res = client.get("/api/auth/federation/diagnostics")
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["databases_count"] == 7
    print("[OK] Federation diagnostics endpoint returned 7 healthy databases!")

if __name__ == "__main__":
    test_login_primary()
    test_login_demo_student()
    test_diagnostics_endpoint()
    print("\nALL MULTI-DB AUTH & FEDERATION TESTS PASSED SUCCESSFULLY!")
