from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)

def test_get_enrolled_institutions():
    response = client.get("/api/students/stu_001/enrolled-institutions")
    assert response.status_code == 200
    data = response.json()
    assert "institutions" in data
    types = [i["type"] for i in data["institutions"]]
    assert "College" in types
    assert "School" in types
    assert "University" in types
    assert "Company" in types
    assert "Start-up" in types

def test_get_institution_details():
    response = client.get("/api/students/stu_001/institutions/inst_glbitm/details")
    assert response.status_code == 200
    inst = response.json()
    assert inst["institution"]["id"] == "inst_glbitm"
    assert inst["institution"]["type"] == "College"
    assert "courses" in inst
    assert "profile" in inst
    assert "timetable" in inst
    assert "calendar" in inst
    assert "fee" in inst
    assert "assignments" in inst
    assert "leaves" in inst
    assert "hostel" in inst
    assert "administration" in inst
    assert "library" in inst
    assert "other_services" in inst

def test_fee_payment_action():
    payload = {
        "amount": 25000.0,
        "payment_mode": "UPI",
        "remarks": "Semester 6 Tuitions test"
    }
    response = client.post("/api/students/stu_001/institutions/inst_glbitm/pay-fee", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "receipt" in data
    assert data["receipt"]["amount"] == 25000.0

def test_leave_application():
    payload = {
        "leave_type": "Medical Leave",
        "from_date": "2026-11-01",
        "to_date": "2026-11-03",
        "reason": "Viral fever recovery",
        "document_url": "doc_medical_presc.pdf"
    }
    response = client.post("/api/students/stu_001/institutions/inst_glbitm/apply-leave", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "leave" in data
    assert data["leave"]["leave_type"] == "Medical Leave"

def test_document_request():
    payload = {
        "document_type": "Bonafide Certificate",
        "purpose": "Passport verification"
    }
    response = client.post("/api/students/stu_001/institutions/inst_glbitm/request-document", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "document" in data
    assert data["document"]["document"] == "Bonafide Certificate"

def test_grievance_submission():
    payload = {
        "category": "Hostel & Mess",
        "subject": "Hot water supply in Block B",
        "description": "Geyser on 2nd floor is tripping during morning hours."
    }
    response = client.post("/api/students/stu_001/institutions/inst_glbitm/submit-grievance", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "grievance" in data
    assert data["grievance"]["subject"] == "Hot water supply in Block B"

def test_library_renewal():
    payload = {
        "accession_no": "ACC-98214"
    }
    response = client.post("/api/students/stu_001/institutions/inst_glbitm/renew-book", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert data["accession_no"] == "ACC-98214"
