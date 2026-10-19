import pytest
from fastapi.testclient import TestClient
from backend.api.main import app
from backend.services.institution_templates import INSTITUTION_TYPES

client = TestClient(app)

def test_developer_presets_available():
    """Verify that canonical presets for all 5 institution types are available."""
    response = client.get("/api/institutions/developer/presets")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "presets" in data
    types = data["institution_types"]
    assert "School" in types
    assert "College" in types
    assert "University" in types
    assert "Company" in types
    assert "Start-up" in types

    for t in ["School", "College", "University", "Company", "Start-up"]:
        assert t in data["presets"]
        preset = data["presets"][t]
        assert "template_name" in preset
        assert "courses" in preset
        assert "timetable" in preset
        assert "fee_or_stipend" in preset
        assert len(preset["courses"]) >= 3

def test_get_active_templates_for_all_types():
    """Verify that every institution type has an active template accessible."""
    for inst_type in ["School", "College", "University", "Company", "Start-up"]:
        response = client.get(f"/api/institutions/{inst_type}/template")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        tpl = data["template"]
        assert tpl["developer_mode_enabled"] is True
        assert "template_data" in tpl

def test_publish_custom_template_in_developer_mode():
    """Verify that an institution can publish its own custom template in Developer Mode."""
    custom_payload = {
        "institution_id": "inst_tcs_corp",
        "institution_type": "Company",
        "institution_name": "Tata Consultancy Services (TCS) Innovation Lab",
        "template_name": "TCS Enterprise AI Elite Fellowship 2026",
        "template_category": "FULL_PORTAL",
        "developer_mode_enabled": True,
        "is_active": True,
        "version": "2.1.0",
        "published_to_roles": "student,faculty,parent,admin,all",
        "theme_config": {
            "badge": "Custom Dev Mode • Tier-1 AI R&D Partner",
            "icon": "fa-building",
            "accent_color": "amber",
            "banner_notice": "Special 2026 Spring Batch: High-Performance GPU Inference Track Active."
        },
        "template_data": {
            "program": "Elite Corporate AI Fellowship Program",
            "department": "Autonomous Agent Systems & Neural Networks",
            "courses": [
                {
                    "course_code": "TCS-AI-01",
                    "course_name": "Distributed LLM Training & Quantization",
                    "credits": 5,
                    "instructor": "Dr. Sameer Gupta",
                    "room": "AI Lab A1",
                    "attendance_percentage": 98.0,
                    "classes_attended": 49,
                    "total_classes": 50,
                    "status": "COMPLIANT"
                },
                {
                    "course_code": "TCS-AI-02",
                    "course_name": "Autonomous Agent Orchestration with LangGraph",
                    "credits": 4,
                    "instructor": "Shalini Nair",
                    "room": "Virtual War Room",
                    "attendance_percentage": 96.0,
                    "classes_attended": 48,
                    "total_classes": 50,
                    "status": "COMPLIANT"
                }
            ],
            "timetable": [
                {
                    "day": "Monday",
                    "slots": [
                        {"time": "09:30 - 10:30", "subject": "AI Fellowship Daily Standup", "code": "TCS-STANDUP", "faculty": "Dr. Sameer Gupta", "room": "Pod 1"}
                    ]
                }
            ],
            "fee_or_stipend": {
                "type": "COMPANY_STIPEND",
                "title": "Elite Fellowship Payout",
                "currency": "INR (₹)",
                "monthly_stipend": 55000,
                "performance_bonus": 20000,
                "total_monthly_payout": 75000,
                "status": "ACTIVE_DISBURSED"
            }
        }
    }

    response = client.post("/api/institutions/inst_tcs_corp/template", json=custom_payload)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "SUCCESS"
    assert res_data["template"]["template_name"] == "TCS Enterprise AI Elite Fellowship 2026"
    assert res_data["template"]["version"] == "2.1.0"

def test_student_sees_custom_template_in_portal():
    """Verify that student fetching institution details receives the custom template designed in Developer Mode."""
    # Student views TCS Innovation Lab details
    response = client.get("/api/students/stu_001/institutions/inst_tcs_corp/details")
    assert response.status_code == 200
    portal = response.json()
    
    # Must contain developer_mode metadata
    assert "developer_mode" in portal
    assert portal["developer_mode"]["enabled"] is True
    assert portal["developer_mode"]["template_name"] == "TCS Enterprise AI Elite Fellowship 2026"
    assert portal["developer_mode"]["version"] == "2.1.0"
    
    # Must reflect custom courses updated by company in Developer Mode
    courses = portal["courses"]
    course_codes = [c["course_code"] for c in courses]
    assert "TCS-AI-01" in course_codes
    assert "TCS-AI-02" in course_codes
    
    # Must reflect updated stipend
    assert portal["fee"]["stipend"]["monthly_stipend"] == 55000

def test_toggle_developer_mode():
    """Verify developer mode toggle works."""
    response = client.post("/api/institutions/Company/developer-mode/toggle", json={"enabled": False})
    assert response.status_code == 200
    data = response.json()
    assert data["developer_mode_enabled"] is False

    # Turn it back on
    response = client.post("/api/institutions/Company/developer-mode/toggle", json={"enabled": True})
    assert response.status_code == 200
    assert response.json()["developer_mode_enabled"] is True

def test_reset_template_to_preset():
    """Verify template reset reverts to canonical preset."""
    response = client.post("/api/institutions/inst_tcs_corp/template/reset")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "Corporate" in data["template"]["template_name"] or "Apprenticeship" in data["template"]["template_name"]
