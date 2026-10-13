import unittest
from fastapi.testclient import TestClient
from backend.api.main import app
from backend.services.db import engine, Base, SessionLocal
from backend.models.student import UserModel, CommunityMessageModel, CommunityGroupModel
import uuid
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
client = TestClient(app)

class TestEduMentorCopilotAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            # Ensure test user exists and get token
            user = db.query(UserModel).filter(UserModel.username == "test_copilot_user").first()
            if not user:
                user = UserModel(
                    id=f"usr_{uuid.uuid4().hex[:8]}",
                    username="test_copilot_user",
                    email="copilot_user@uni.edu",
                    hashed_password=pwd_context.hash("password123"),
                    role="student",
                    full_name="Copilot Test User",
                    institution_name="GL Bajaj",
                    institution_verified=True
                )
                db.add(user)
                db.commit()

            # Ensure test community group exists
            group = db.query(CommunityGroupModel).filter(CommunityGroupModel.id == "grp_test_group").first()
            if not group:
                group = CommunityGroupModel(
                    id="grp_test_group",
                    name="Test Study Hive",
                    category="STUDY_GROUP",
                    role_access="all",
                    description="Group for testing EduMentor Co-Pilot",
                    created_by="test_copilot_user"
                )
                db.add(group)
                db.commit()
        finally:
            db.close()

    def get_auth_token(self):
        res = client.post("/api/auth/login", json={
            "username": "test_copilot_user",
            "password": "password123"
        })
        if res.status_code == 200:
            return res.json()["access_token"]
        return ""

    def test_verify_access(self):
        token = self.get_auth_token()
        res = client.post("/api/copilot/verify-access", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["trust_tier_access"], "ELITE_VERIFIED")

    def test_summarize_session(self):
        token = self.get_auth_token()
        res = client.post("/api/copilot/groups/grp_test_group/summarize", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("summary_text", data)
        self.assertIn("key_takeaways", data)

    def test_quiz_workflow(self):
        token = self.get_auth_token()
        # Create quiz
        quiz_payload = {
            "question": "What is the minimum attendance required by institutional policy?",
            "options": ["50%", "75%", "90%", "100%"],
            "correct_answer": "75%"
        }
        res = client.post("/api/copilot/groups/grp_test_group/quiz", json=quiz_payload, headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(res.status_code, 201)
        quiz_data = res.json()
        quiz_id = quiz_data["id"]

        # List quizzes
        res_list = client.get("/api/copilot/groups/grp_test_group/quizzes", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(res_list.status_code, 200)
        self.assertGreaterEqual(len(res_list.json()), 1)

        # Answer quiz
        ans_payload = {"selected_answer": "75%"}
        res_ans = client.post(f"/api/copilot/quizzes/{quiz_id}/answer", json=ans_payload, headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(res_ans.status_code, 200)
        ans_data = res_ans.json()
        self.assertTrue(ans_data["correct"])
