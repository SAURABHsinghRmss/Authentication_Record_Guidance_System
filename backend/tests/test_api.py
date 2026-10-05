import unittest
from fastapi.testclient import TestClient
from backend.api.main import app
from backend.services.db import engine, Base, SessionLocal
from backend.models.student import StudentModel, UserModel
import json
import os

client = TestClient(app)

class TestEduIdentityAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
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

if __name__ == "__main__":
    unittest.main()
