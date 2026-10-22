"""
Tests for Sarvam AI Integration Service (Application Validation, Document Authentication, Regulatory Compliance)
"""

import pytest
from backend.services.sarvam_ai_service import sarvam_ai_service

def test_sarvam_application_validation():
    result = sarvam_ai_service.validate_application(
        applicant_name="Amit Sharma",
        role="student",
        application_data={"cgpa": "8.5", "institution": "GL Bajaj"},
        api_key="sarvam_test_key_12345"
    )
    assert result["status"] == "SUCCESS"
    assert result["verified"] is True
    assert "Sarvam" in result["engine"]

def test_sarvam_document_authentication():
    result = sarvam_ai_service.authenticate_document(
        document_title="Degree Certificate - B.Tech CSE",
        document_text="This is to certify that Amit Sharma has successfully graduated.",
        api_key="sarvam_test_key_12345"
    )
    assert result["status"] == "AUTHENTICATED"
    assert result["tamper_detected"] is False
    assert result["authenticity_score"] > 0.9

def test_sarvam_regulatory_compliance():
    result = sarvam_ai_service.verify_regulatory_compliance(
        institution_name="GL Bajaj Institute",
        compliance_scope="UGC ABC & AICTE Norms",
        api_key="sarvam_test_key_12345"
    )
    assert result["status"] == "COMPLIANT"
    assert result["audit_rating"] == "A++ (Fully Compliant)"
    assert len(result["standards_met"]) >= 3
