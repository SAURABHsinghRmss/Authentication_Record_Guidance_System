import unittest
import uuid
from fastapi.testclient import TestClient
from backend.api.main import app
from backend.services.db import engine, Base, SessionLocal
from backend.models.student import UserModel, StudentModel, InstitutionModel

client = TestClient(app)

class TestInterconnectedAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        # Seed standard test accounts via login
        client.post("/api/auth/login", json={"username": "amit", "password": "amit123"})

    def test_01_country_id_verification(self):
        # 12-digit Aadhaar
        res = client.post("/api/auth/verify/country-id", json={
            "country_id_number": "998877665544",
            "country_id_type": "Aadhaar / National ID"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["verified"])
        self.assertEqual(data["status"], "AUTHENTICATED")
        self.assertEqual(data["country_id_number"], "9988-7766-5544")

        # Alphanumeric Passport
        res_pass = client.post("/api/auth/verify/country-id", json={
            "country_id_number": "Z8947219",
            "country_id_type": "Passport"
        })
        self.assertEqual(res_pass.status_code, 200)
        self.assertTrue(res_pass.json()["verified"])

    def test_02_cross_role_check(self):
        # Existing seeded student 'amit'
        res_found = client.post("/api/auth/verify/cross-role-check", json={"identifier": "amit"})
        self.assertEqual(res_found.status_code, 200)
        data = res_found.json()
        self.assertTrue(data["found"])
        self.assertEqual(data["role"], "student")

        # Non-existing random user
        res_not_found = client.post("/api/auth/verify/cross-role-check", json={"identifier": "unknown_entity_999"})
        self.assertEqual(res_not_found.status_code, 200)
        self.assertFalse(res_not_found.json()["found"])

    def test_03_student_registration_with_parent(self):
        uid = uuid.uuid4().hex[:6]
        student_uname = f"stu_test_{uid}"
        parent_uname = f"par_test_{uid}"
        payload = {
            "name": f"Student Tester {uid}",
            "gender": "Female",
            "personal_email": f"{student_uname}@gmail.com",
            "mobile_number": f"+91 987654{uid[:4]}",
            "mobile_verified": True,
            "country_id_number": f"11223344{uid[:4]}",
            "country_id_type": "Aadhaar / National ID",
            "country_id_verified": True,
            "parent_verification_status": "ALIVE",
            "create_parent": {
                "username": parent_uname,
                "password": "ParentPassword123!",
                "full_name": f"Parent of {uid}",
                "personal_email": f"{parent_uname}@gmail.com",
                "mobile_number": f"+91 912345{uid[:4]}"
            },
            "institution_name": "GL Bajaj Institute of Technology and Management",
            "username": student_uname,
            "password": "StudentPassword123!"
        }
        res = client.post("/api/auth/register/student", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["role"], "student")
        self.assertEqual(data["username"], student_uname)
        self.assertEqual(data["parent_verification_status"], "ALIVE")

        # Verify in DB that parent account was also created
        db = SessionLocal()
        parent_user = db.query(UserModel).filter(UserModel.username == parent_uname).first()
        self.assertIsNotNone(parent_user)
        self.assertEqual(parent_user.role, "parent")

        # Verify student record created in students table
        stu_record = db.query(StudentModel).filter(StudentModel.email == f"{student_uname}@gmail.com").first()
        self.assertIsNotNone(stu_record)
        db.close()

    def test_04_parent_registration_with_income_and_cross_role(self):
        uid = uuid.uuid4().hex[:6]
        parent_uname = f"parent_gov_{uid}"
        payload = {
            "name": f"Govt Officer {uid}",
            "gender": "Male",
            "personal_email": f"{parent_uname}@gmail.com",
            "mobile_number": f"+91 998877{uid[:4]}",
            "mobile_verified": True,
            "country_id_number": f"55667788{uid[:4]}",
            "country_id_type": "National Identity Card",
            "country_id_verified": True,
            "parent_verification_status": "ALIVE",
            "parent_relation": "Biological",
            "source_of_income": "Government Service (Education Ministry)",
            "income_bracket": "8-15 LPA",
            "linked_student_id": "amit",
            "username": parent_uname,
            "password": "GovtParentPass123!"
        }
        res = client.post("/api/auth/register/parent", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["role"], "parent")
        self.assertEqual(data["username"], parent_uname)

    def test_05_mentor_registration_virtual_institute(self):
        uid = uuid.uuid4().hex[:6]
        mentor_uname = f"prof_virtual_{uid}"
        v_inst_name = f"Global AI Research Institute {uid}"
        payload = {
            "name": f"Prof. Alan {uid}",
            "gender": "Male",
            "personal_email": f"{mentor_uname}@gmail.com",
            "mobile_number": f"+91 976543{uid[:4]}",
            "mobile_verified": True,
            "country_id_number": f"99880011{uid[:4]}",
            "country_id_type": "Faculty Identification Card",
            "country_id_verified": True,
            "parent_verification_status": "ALIVE",
            "institute_affiliation_type": "VIRTUAL",
            "virtual_institute_name": v_inst_name,
            "virtual_institute_focus": "Advanced Machine Learning & Quantum Advising",
            "username": mentor_uname,
            "password": "MentorPassword123!"
        }
        res = client.post("/api/auth/register/mentor", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["role"], "faculty")
        self.assertEqual(data["virtual_institute_name"], v_inst_name)

        # Check virtual institute was registered in database
        db = SessionLocal()
        v_inst = db.query(InstitutionModel).filter(InstitutionModel.name == v_inst_name).first()
        self.assertIsNotNone(v_inst)
        self.assertTrue(v_inst.is_virtual)
        self.assertEqual(v_inst.institution_type, "Virtual University")
        db.close()

    def test_06_institute_registration(self):
        uid = uuid.uuid4().hex[:6]
        inst_name = f"National Tech Institute {uid}"
        payload = {
            "name": inst_name,
            "location": "Bengaluru, Karnataka, India",
            "institution_type": "Autonomous College",
            "accreditation_number": f"AICTE-KA-{uid.upper()}",
            "educational_domain": "Engineering, Computer Science, and Aerospace",
            "mission_scope": "Excellence in technological innovation and high-grade student research.",
            "admin_email": f"registrar@{uid}.ac.in",
            "username": f"inst_admin_{uid}",
            "password": "CollegeAdminPass123!"
        }
        res = client.post("/api/auth/register/institute", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["role"], "institute")
        self.assertTrue(data["institution_verified"])

        # Check in DB
        db = SessionLocal()
        inst = db.query(InstitutionModel).filter(InstitutionModel.name == inst_name).first()
        self.assertIsNotNone(inst)
        self.assertEqual(inst.status, "VERIFIED")
        self.assertEqual(inst.location, "Bengaluru, Karnataka, India")
        db.close()

    def test_07_admin_registration_security(self):
        uid = uuid.uuid4().hex[:6]
        # Invalid Master Passcode -> 403 Forbidden
        bad_res = client.post("/api/auth/register/admin", json={
            "name": f"Fake Admin {uid}",
            "admin_clearance_level": "SUPER_ADMIN",
            "admin_master_token": "WRONG_TOKEN",
            "personal_email": f"bad_admin_{uid}@gmail.com",
            "username": f"bad_adm_{uid}",
            "password": "AdminPassword123!"
        })
        self.assertEqual(bad_res.status_code, 403)

        # Valid Master Passcode
        good_res = client.post("/api/auth/register/admin", json={
            "name": f"Chief Auditor {uid}",
            "admin_clearance_level": "SUPER_ADMIN",
            "admin_master_token": "MSRCH-ROOT-2026",
            "personal_email": f"auditor_{uid}@gmail.com",
            "username": f"adm_sec_{uid}",
            "password": "AdminPassword123!"
        })
        self.assertEqual(good_res.status_code, 200)
        self.assertEqual(good_res.json()["role"], "admin")

    def test_08_login_all_seeded_roles(self):
        roles_to_test = [
            ("msrch", "msrch1410#", "admin"),
            ("amit", "amit123", "student"),
            ("faculty", "faculty123", "faculty"),
            ("parent_alex", "parent123", "parent"),
            ("institute_admin", "inst123", "institute"),
        ]
        for uname, pwd, expected_role in roles_to_test:
            res = client.post("/api/auth/login", json={"username": uname, "password": pwd})
            self.assertEqual(res.status_code, 200, f"Failed login for {uname}")
            data = res.json()
            self.assertEqual(data["role"], expected_role)
            self.assertIn("access_token", data)
            self.assertIn("is_present_in_student_db", data)
