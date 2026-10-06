import unittest
from fastapi.testclient import TestClient
from backend.api.main import app
from backend.services.db import engine, Base, SessionLocal
from backend.models.student import StudentModel, UserModel, InstitutionModel
import json
import os
import uuid
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
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

            if db.query(UserModel).filter(UserModel.username == "admin").count() == 0:
                admin_user = UserModel(
                    id=f"usr_{uuid.uuid4().hex[:8]}",
                    username="admin",
                    email="admin@uni.edu",
                    hashed_password=pwd_context.hash("admin123"),
                    role="admin",
                    full_name="System Administrator",
                    institution_name="GL Bajaj Institute of Technology and Management",
                    institution_verified=True
                )
                db.add(admin_user)
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

    def test_admin_student_crud(self):
        # Login as admin
        login_payload = {
            "username": "admin",
            "password": "admin123"
        }
        res = client.post("/api/auth/login", json=login_payload)
        self.assertEqual(res.status_code, 200)
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Create student as admin
        new_student = {
            "roll_no": f"TST-{uuid.uuid4().hex[:4]}",
            "name": "Admin Test Student",
            "email": "admintest@uni.edu",
            "department": "Computer Science",
            "semester": "5th Semester",
            "cgpa": "9.0",
            "attendance_percentage": "95.0",
            "credits_earned": "100",
            "max_credits": "160",
            "backlogs": 0,
            "status": "VERIFIED"
        }
        res = client.post("/api/students", json=new_student, headers=headers)
        self.assertEqual(res.status_code, 201)
        created_id = res.json()["id"]

        # Delete student as admin
        res = client.delete(f"/api/students/{created_id}", headers=headers)
        self.assertEqual(res.status_code, 200)

if __name__ == "__main__":
    unittest.main()
