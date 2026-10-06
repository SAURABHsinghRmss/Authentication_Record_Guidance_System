import unittest
from fastapi.testclient import TestClient
from backend.api.main import app
from backend.services.db import engine, Base, SessionLocal
from backend.models.student import StudentModel, UserModel, InstitutionModel
import json
import os
import uuid

client = TestClient(app)

class TestEduIdentityAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            if db.query(InstitutionModel).count() == 0:
                default_inst = InstitutionModel(
                    id=f"inst_{uuid.uuid4().hex[:8]}",
                    name="GL Bajaj Institute of Technology and Management",
                    status="VERIFIED",
                    requested_by="system"
                )
                db.add(default_inst)
                db.commit()

            if db.query(StudentModel).count() == 0:
                json_path = "backend/models/sample_students.json"
                if os.path.exists(json_path):
                    with open(json_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        for s in data.get("students", []):
                            db.add(StudentModel(**s))
                db.commit()
        finally:
            db.close()

    def test_health_check(self):
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "HEALTHY")

    def test_list_students(self):
        response = client.get("/api/students")
        self.assertEqual(response.status_code, 200)
        students = response.json()
        self.assertGreaterEqual(len(students), 1)

    def test_rag_query(self):
        response = client.post("/rag_query", json={"query": "credit transfer policy", "top_k": 2})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("answer", data)
        self.assertGreaterEqual(len(data["citations"]), 1)

    def test_biometric_verify(self):
        response = client.post("/api/auth/biometric-verify", json={"student_id": "stu_001", "mode": "face"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["verified"])

    def test_user_registration_and_login(self):
        uname = f"user_{uuid.uuid4().hex[:6]}"
        reg_payload = {
            "username": uname,
            "email": f"{uname}@uni.edu",
            "password": "securepassword123",
            "full_name": "New Test User",
            "role": "student",
            "institution_name": "GL Bajaj Institute of Technology and Management"
        }
        response = client.post("/api/auth/register", json=reg_payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["username"], uname)
        self.assertTrue(data["institution_verified"])

        login_payload = {
            "username": uname,
            "password": "securepassword123"
        }
        response = client.post("/api/auth/login", json=login_payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)

if __name__ == "__main__":
    unittest.main()
