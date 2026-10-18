import os
import json
from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)

def _get_auth_headers(username, password):
    res = client.post("/api/auth/login", json={"username": username, "password": password})
    assert res.status_code == 200, f"Login failed for {username}: {res.text}"
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_chat_categories_overview():
    headers = _get_auth_headers("amit", "amit123")
    res = client.get("/api/chat/categories", headers=headers)
    assert res.status_code == 200, res.text
    categories = res.json()
    assert len(categories) == 3
    cat_names = [c["category"] for c in categories]
    assert "PERSONAL" in cat_names
    assert "PRIVATE" in cat_names
    assert "GLOBAL" in cat_names
    for cat in categories:
        assert "description" in cat
        assert "total_messages" in cat
        assert isinstance(cat["total_messages"], int)
        assert len(cat["active_channels"]) > 0
    print("[OK] /api/chat/categories returned all 3 valid categories with metadata.")

def test_global_chat_flow():
    admin_headers = _get_auth_headers("msrch", "msrch1410#")
    student_headers = _get_auth_headers("amit", "amit123")

    # 1. Fetch global messages before send
    res = client.get("/api/chat/category/GLOBAL?channel_id=campus_global", headers=student_headers)
    assert res.status_code == 200, res.text
    initial_messages = res.json()
    initial_count = len(initial_messages)

    # 2. Admin broadcasts to campus_global
    test_msg = "Official Campus Advisory: Library will remain open 24/7 during midterm examinations."
    send_res = client.post(
        "/api/chat/send",
        headers=admin_headers,
        json={
            "category": "GLOBAL",
            "channel_id": "campus_global",
            "message": test_msg
        }
    )
    assert send_res.status_code == 201, send_res.text
    sent_data = send_res.json()
    assert sent_data["category"] == "GLOBAL"
    assert sent_data["channel_id"] == "campus_global"
    assert sent_data["sender_username"] == "msrch"
    assert sent_data["message"] == test_msg

    # 3. Student fetches global messages and verifies arrival
    fetch_res = client.get("/api/chat/category/GLOBAL?channel_id=campus_global", headers=student_headers)
    assert fetch_res.status_code == 200, fetch_res.text
    updated_messages = fetch_res.json()
    assert len(updated_messages) == initial_count + 1
    assert any(m["message"] == test_msg for m in updated_messages)
    print("[OK] GLOBAL category chat broadcast and retrieval verified.")

def test_private_chat_flow():
    student_headers = _get_auth_headers("amit", "amit123")
    faculty_headers = _get_auth_headers("faculty", "faculty123")

    # 1. Send private club message via /api/chat/send
    private_msg = "Testing custom LoRA weights for the robotics vision pipeline."
    send_res = client.post(
        "/api/chat/send",
        headers=student_headers,
        json={
            "category": "PRIVATE",
            "channel_id": "grp_ai_club",
            "message": private_msg
        }
    )
    assert send_res.status_code == 201, send_res.text
    sent_data = send_res.json()
    assert sent_data["category"] == "PRIVATE"
    assert sent_data["channel_id"] == "grp_ai_club"
    assert sent_data["sender_username"] == "amit"

    # 2. Verify faculty in the club receives the private message
    fetch_res = client.get("/api/chat/category/PRIVATE?channel_id=grp_ai_club", headers=faculty_headers)
    assert fetch_res.status_code == 200, fetch_res.text
    messages = fetch_res.json()
    assert any(m["message"] == private_msg for m in messages)

    # 3. Verify community routes cross-sync into PRIVATE category
    comm_msg = "Community route sync test message."
    comm_res = client.post(
        "/api/community/groups/grp_ai_club/messages",
        headers=student_headers,
        json={"message": comm_msg}
    )
    assert comm_res.status_code == 201, comm_res.text

    # Check that it appears in /api/chat/category/PRIVATE
    sync_check = client.get("/api/chat/category/PRIVATE?channel_id=grp_ai_club", headers=faculty_headers)
    assert sync_check.status_code == 200
    sync_msgs = sync_check.json()
    assert any(m["message"] == comm_msg for m in sync_msgs)
    print("[OK] PRIVATE category chat and community cross-sync verified.")

def test_personal_chat_flow():
    student_headers = _get_auth_headers("amit", "amit123")
    faculty_headers = _get_auth_headers("faculty", "faculty123")

    # 1. Faculty sends confidential direct message to student
    direct_msg = "Amit, your research draft has been accepted for peer presentation."
    send_res = client.post(
        "/api/chat/send",
        headers=faculty_headers,
        json={
            "category": "PERSONAL",
            "recipient_username": "amit",
            "message": direct_msg
        }
    )
    assert send_res.status_code == 201, send_res.text
    sent_data = send_res.json()
    assert sent_data["category"] == "PERSONAL"
    assert sent_data["recipient_username"] == "amit"
    assert sent_data["sender_username"] == "faculty"
    assert sent_data["channel_id"] == "direct_amit_faculty"

    # 2. Student fetches 1-on-1 messages with faculty
    fetch_res = client.get("/api/chat/category/PERSONAL?peer_username=faculty", headers=student_headers)
    assert fetch_res.status_code == 200, fetch_res.text
    msgs = fetch_res.json()
    matching = [m for m in msgs if m["message"] == direct_msg]
    assert len(matching) > 0
    # Verifying that reading updates read status
    assert matching[0]["is_read"] is True

    # 3. Backward compatibility check: verify legacy mentor_chats has message
    legacy_res = client.get("/api/chat/messages/amit?mentor_username=faculty", headers=student_headers)
    assert legacy_res.status_code == 200, legacy_res.text
    legacy_msgs = legacy_res.json()
    assert any(m["message"] == direct_msg for m in legacy_msgs)
    print("[OK] PERSONAL category direct chat and legacy backward sync verified.")

def test_invalid_category_rejection():
    headers = _get_auth_headers("amit", "amit123")
    res = client.post(
        "/api/chat/send",
        headers=headers,
        json={
            "category": "SECRET_UNKNOWN",
            "message": "This should fail"
        }
    )
    assert res.status_code == 400
    assert "Category must be one of" in res.json()["detail"]
    print("[OK] Invalid category input validation rejected with HTTP 400.")

def test_educational_ai_criteria_catalog():
    headers = _get_auth_headers("amit", "amit123")
    res = client.get("/api/chat/ai/criteria", headers=headers)
    assert res.status_code == 200, res.text
    criteria = res.json()
    assert len(criteria) == 8
    crit_ids = [c["id"] for c in criteria]
    assert "POLICY_REGULATION" in crit_ids
    assert "CONCEPT_TUTORING" in crit_ids
    assert "QUIZ_GENERATION" in crit_ids
    assert "THREAD_SUMMARIZATION" in crit_ids
    assert "ACADEMIC_INTEGRITY" in crit_ids
    assert "CAREER_PATHWAY" in crit_ids
    assert "EXAM_REVISION" in crit_ids
    assert "CODE_LAB_ASSIST" in crit_ids
    for c in criteria:
        assert "name" in c
        assert "badge" in c
        assert "icon" in c
        assert "description" in c
        assert len(c["sample_prompts"]) > 0
    print("[OK] /api/chat/ai/criteria returned all 8 Educational Criteria.")

def test_direct_meta_ai_chat_flow():
    student_headers = _get_auth_headers("amit", "amit123")

    # Student sends direct question to edumentor_ai (Meta AI)
    query_text = "What is the minimum attendance required for semester exams?"
    send_res = client.post(
        "/api/chat/send",
        headers=student_headers,
        json={
            "category": "PERSONAL",
            "recipient_username": "edumentor_ai",
            "message": query_text
        }
    )
    assert send_res.status_code == 201, send_res.text

    # Verify conversation with edumentor_ai contains AI response
    fetch_res = client.get("/api/chat/category/PERSONAL?peer_username=edumentor_ai", headers=student_headers)
    assert fetch_res.status_code == 200, fetch_res.text
    messages = fetch_res.json()
    ai_replies = [m for m in messages if m["sender_username"] == "edumentor_ai"]
    assert len(ai_replies) > 0
    latest_ai = ai_replies[-1]
    assert "75%" in latest_ai["message"] or "attendance" in latest_ai["message"].lower()
    assert latest_ai["criteria"] == "POLICY_REGULATION"
    print("[OK] Direct 1-on-1 chat with Meta AI triggers grounded educational response.")

def test_in_chat_ai_mention_in_global():
    student_headers = _get_auth_headers("amit", "amit123")

    # In campus_global, student mentions @ai to test with a quiz
    send_res = client.post(
        "/api/chat/send",
        headers=student_headers,
        json={
            "category": "GLOBAL",
            "channel_id": "campus_global",
            "message": "@ai quiz on Data Structures: Stacks and Queues"
        }
    )
    assert send_res.status_code == 201, send_res.text

    # Verify campus_global now contains the AI response with QUIZ_GENERATION criteria
    fetch_res = client.get("/api/chat/category/GLOBAL?channel_id=campus_global", headers=student_headers)
    assert fetch_res.status_code == 200, fetch_res.text
    messages = fetch_res.json()
    ai_replies = [m for m in messages if m["sender_username"] == "edumentor_ai"]
    assert len(ai_replies) > 0
    latest_ai = ai_replies[-1]
    assert "QUIZ" in latest_ai["message"].upper() or "QUESTION" in latest_ai["message"].upper()
    assert latest_ai["criteria"] == "QUIZ_GENERATION"
    print("[OK] In-channel mention @ai in GLOBAL agora successfully generated quiz response.")

def test_in_chat_explicit_criteria_override():
    faculty_headers = _get_auth_headers("faculty", "faculty123")

    # Mention @ai with explicit criteria parameter
    send_res = client.post(
        "/api/chat/send",
        headers=faculty_headers,
        json={
            "category": "GLOBAL",
            "channel_id": "campus_global",
            "message": "@meta advise students on placement preparation roadmap",
            "criteria": "CAREER_PATHWAY"
        }
    )
    assert send_res.status_code == 201, send_res.text

    fetch_res = client.get("/api/chat/category/GLOBAL?channel_id=campus_global", headers=faculty_headers)
    assert fetch_res.status_code == 200
    messages = fetch_res.json()
    ai_replies = [m for m in messages if m["sender_username"] == "edumentor_ai"]
    assert len(ai_replies) > 0
    latest_ai = ai_replies[-1]
    assert latest_ai["criteria"] == "CAREER_PATHWAY"
    print("[OK] Explicit criteria override respected in chat.")

def test_direct_ai_ask_endpoint():
    student_headers = _get_auth_headers("amit", "amit123")
    res = client.post(
        "/api/chat/ai/ask",
        headers=student_headers,
        json={
            "query": "Give me an exam cheat sheet on sorting algorithms",
            "criteria": "EXAM_REVISION"
        }
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["criterion"] == "EXAM_REVISION"
    assert "answer" in data
    assert len(data["answer"]) > 20
    print("[OK] Standalone /api/chat/ai/ask endpoint executed successfully.")

if __name__ == "__main__":
    test_chat_categories_overview()
    test_global_chat_flow()
    test_private_chat_flow()
    test_personal_chat_flow()
    test_invalid_category_rejection()
    test_educational_ai_criteria_catalog()
    test_direct_meta_ai_chat_flow()
    test_in_chat_ai_mention_in_global()
    test_in_chat_explicit_criteria_override()
    test_direct_ai_ask_endpoint()
    print("\nALL 3-CATEGORY CHAT & META AI EDUCATIONAL CRITERIA TESTS PASSED SUCCESSFULLY!")

