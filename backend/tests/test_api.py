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

            msrch_user = db.query(UserModel).filter(UserModel.username == "msrch").first()
            if not msrch_user:
                msrch_user = UserModel(
                    id="usr_msrch_universal",
                    username="msrch",
                    email="msrch@uni.edu",
                    hashed_password=pwd_context.hash("msrch1410#"),
                    role="admin",
                    full_name="Master Developer / Administrator (msrch)",
                    institution_name="GL Bajaj Institute of Technology and Management",
                    institution_verified=True
                )
                db.add(msrch_user)
                db.commit()
            else:
                msrch_user.role = "admin"
                msrch_user.hashed_password = pwd_context.hash("msrch1410#")
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
            "personal_email": f"{uname}@gmail.com",
            "college_email": f"{uname}@uni.edu",
            "mobile_number": "+19876543210",
            "mobile_verified": True,
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

    def test_msrch_developer_login_and_access(self):
        # 1. Login with correct developer password msrch1410#
        login_payload = {
            "username": "msrch",
            "password": "msrch1410#"
        }
        res = client.post("/api/auth/login", json=login_payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["username"], "msrch")
        self.assertEqual(data["role"], "admin")
        self.assertIn("access_token", data)

        token = data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Check /api/auth/me profile
        me_res = client.get("/api/auth/me", headers=headers)
        self.assertEqual(me_res.status_code, 200)
        profile = me_res.json()
        self.assertEqual(profile["username"], "msrch")
        self.assertEqual(profile["role"], "admin")
        self.assertTrue(profile["is_permanent"])

        # 2. Login with incorrect password should be rejected
        bad_payload = {
            "username": "msrch",
            "password": "wrong_password_test"
        }
        bad_res = client.post("/api/auth/login", json=bad_payload)
        self.assertEqual(bad_res.status_code, 401)

    def test_msrch_permanent_cannot_be_deleted(self):
        # Login as msrch to get admin token
        login_res = client.post("/api/auth/login", json={"username": "msrch", "password": "msrch1410#"})
        self.assertEqual(login_res.status_code, 200)
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Attempt to delete msrch via API endpoint
        del_res = client.delete("/api/auth/users/msrch", headers=headers)
        self.assertEqual(del_res.status_code, 403)
        self.assertIn("cannot be deleted", del_res.json()["detail"])

        # Attempt to delete msrch directly in SQLAlchemy ORM
        db = SessionLocal()
        try:
            user = db.query(UserModel).filter(UserModel.username == "msrch").first()
            self.assertIsNotNone(user)
            with self.assertRaises(ValueError):
                db.delete(user)
                db.flush()
        finally:
            db.rollback()
            db.close()

    def test_msrch_can_be_altered(self):
        login_res = client.post("/api/auth/login", json={"username": "msrch", "password": "msrch1410#"})
        self.assertEqual(login_res.status_code, 200)
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Alter msrch details (full_name and email)
        update_payload = {
            "full_name": "Developer msrch (Audited)",
            "email": "msrch.dev@uni.edu"
        }
        update_res = client.put("/api/auth/users/msrch", json=update_payload, headers=headers)
        self.assertEqual(update_res.status_code, 200)
        updated_data = update_res.json()
        self.assertEqual(updated_data["full_name"], "Developer msrch (Audited)")
        self.assertEqual(updated_data["email"], "msrch.dev@uni.edu")
        self.assertTrue(updated_data["is_permanent"])

    def test_user_work_logging_and_cloud_readiness(self):
        # 1. Register a user with a Gmail address
        gmail_user = f"dev_{uuid.uuid4().hex[:6]}"
        gmail_email = f"{gmail_user}@gmail.com"
        reg_payload = {
            "username": gmail_user,
            "personal_email": gmail_email,
            "college_email": f"{gmail_user}@uni.edu",
            "mobile_number": "+19876543210",
            "mobile_verified": True,
            "password": "strongPassword123!",
            "full_name": "Gmail Test Developer",
            "role": "student",
            "institution_name": "GL Bajaj Institute of Technology and Management"
        }
        reg_res = client.post("/api/auth/register", json=reg_payload)
        self.assertEqual(reg_res.status_code, 200)

        # 2. Login to trigger user work log creation at their Gmail storage location
        login_payload = {
            "username": gmail_user,
            "password": "strongPassword123!"
        }
        login_res = client.post("/api/auth/login", json=login_payload)
        self.assertEqual(login_res.status_code, 200)
        data = login_res.json()
        token = data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        self.assertIn("storage_location", data)
        storage_loc = data["storage_location"]
        self.assertTrue(os.path.exists(storage_loc))
        self.assertTrue(os.path.exists(os.path.join(storage_loc, "last_work.json")))

        # 3. Retrieve initial last work
        last_work_res = client.get("/api/auth/work-logs/me/last-work", headers=headers)
        self.assertEqual(last_work_res.status_code, 200)
        last_work_data = last_work_res.json()
        self.assertEqual(last_work_data["email"], f"{gmail_user}@uni.edu")
        self.assertIn("cloud_storage_uri", last_work_data)

        # 4. Record work action performed in session
        action_payload = {
            "action_type": "BUG_INVESTIGATION",
            "description": "Tested API routes and student guidance recommendations",
            "metadata": {"test_case": "TC_042", "module": "guidance"}
        }
        rec_res = client.post("/api/auth/work-logs/me/record", json=action_payload, headers=headers)
        self.assertEqual(rec_res.status_code, 200)
        self.assertEqual(rec_res.json()["summary"], "Tested API routes and student guidance recommendations")

        # 5. Log in again as the same Gmail user and verify 'previous_work' preserved their last work
        login_res_2 = client.post("/api/auth/login", json=login_payload)
        self.assertEqual(login_res_2.status_code, 200)
        self.assertEqual(
            login_res_2.json()["last_work_summary"],
            "Tested API routes and student guidance recommendations"
        )

        # 6. Admin inspects storage locations and cloud sync readiness
        admin_login = client.post("/api/auth/login", json={"username": "msrch", "password": "msrch1410#"})
        admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

        locs_res = client.get("/api/auth/work-logs/locations", headers=admin_headers)
        self.assertEqual(locs_res.status_code, 200)
        locations = locs_res.json()
        self.assertTrue(any(loc["email"] == f"{gmail_user}@uni.edu" for loc in locations))

        sync_res = client.post("/api/auth/work-logs/cloud-sync", headers=admin_headers)
        self.assertEqual(sync_res.status_code, 200)
        self.assertIn("files", sync_res.json())

if __name__ == "__main__":
    unittest.main()
