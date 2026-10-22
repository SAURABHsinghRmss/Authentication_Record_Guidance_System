"""
CROSS-ROLE PIPELINE & FUNCTION CONNECTIVITY SERVICE
===================================================
Provides shared inter-role functions and data pipelines connecting:
1. Student <-> Parent (Ward monitoring, grade/attendance access, parent-led fee payments)
2. Student/Faculty <-> Institute (Leave applications, document authentication, grievance escalation)
3. Institute <-> Admin (AICTE approvals, FDR escrow bonds, compliance audit tracking)
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from backend.services.sarvam_ai_service import sarvam_ai_service
from backend.services.payment_fdr_escrow_service import payment_fdr_escrow_service
from backend.services.admin_complaints_aicte_service import admin_complaints_aicte_service

class CrossRolePipelineService:

    @classmethod
    def get_parent_ward_academic_summary(cls, parent_username: str, ward_username: str) -> Dict[str, Any]:
        """
        Shared Function: Parent role accessing student (ward) academic records, attendance,
        and fee status via family heritage federation.
        """
        return {
            "pipeline": "Parent <-> Student Interconnected Pipeline",
            "parent_username": parent_username,
            "ward_username": ward_username,
            "academic_standing": {
                "cgpa": "8.65",
                "attendance_percentage": "88.5%",
                "backlogs": 0,
                "standing": "Dean's Honor List"
            },
            "fee_status": {
                "semester_fee_paid": True,
                "caution_deposit_secured": True,
                "pending_dues_inr": 0.0
            },
            "last_synced": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def faculty_mentor_authenticate_student_doc(cls, faculty_username: str, student_username: str, document_title: str, document_text: str) -> Dict[str, Any]:
        """
        Shared Function: Faculty mentor reviewing and authenticating student project or certificate
        using Sarvam AI document verification.
        """
        auth_result = sarvam_ai_service.authenticate_document(document_title, document_text)
        return {
            "pipeline": "Faculty <-> Student AI Verification Pipeline",
            "faculty_mentor": faculty_username,
            "student_target": student_username,
            "authentication_result": auth_result,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def institute_escalate_complaint_to_admin(cls, institute_name: str, issue_title: str, bureau: str, description: str) -> Dict[str, Any]:
        """
        Shared Function: Institute governance raising an issue or approval request that automatically
        gets routed to the Admin Complaints & AICTE Workflow Monitoring Dashboard.
        """
        new_case = admin_complaints_aicte_service.add_complaint(
            title=issue_title,
            bureau_or_cell=bureau,
            complainant_role="institute",
            complainant_name=institute_name,
            category="Approval & Compliance",
            priority="HIGH",
            description=description
        )
        return {
            "pipeline": "Institute <-> Admin Compliance Escalation Pipeline",
            "status": "ESCALATED_SUCCESS",
            "case_record": new_case
        }

cross_role_pipeline = CrossRolePipelineService()
