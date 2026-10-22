"""
CROSS-ROLE PIPELINE API ROUTES
==============================
Exposes endpoints for cross-role function connectivity:
1. Parent accessing ward academic & fee summary
2. Faculty authenticating student documents via Sarvam AI
3. Institute escalating compliance cases to Admin dashboard
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from backend.api.dependencies import require_role
from backend.services.cross_role_pipeline_service import cross_role_pipeline

router = APIRouter(prefix="/cross-role", tags=["Cross-Role Function Connectivity & Pipelining"])

class ParentWardRequest(BaseModel):
    ward_username: str = "amit"

class FacultyAuthDocRequest(BaseModel):
    student_username: str = "amit"
    document_title: str
    document_text: str

class InstituteEscalateRequest(BaseModel):
    institute_name: str
    issue_title: str
    bureau: str = "AICTE Approval Bureau (AB)"
    description: str

@router.post("/parent-ward-summary")
def get_parent_ward_summary(
    payload: ParentWardRequest,
    current_user=Depends(require_role(["parent", "admin", "msrch"]))
):
    """Parent role accessing student ward academic and fee summary."""
    try:
        return cross_role_pipeline.get_parent_ward_academic_summary(
            parent_username=current_user.username,
            ward_username=payload.ward_username
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/faculty-auth-student-doc")
def faculty_auth_student_doc(
    payload: FacultyAuthDocRequest,
    current_user=Depends(require_role(["faculty", "admin", "msrch"]))
):
    """Faculty mentor reviewing and authenticating student document using Sarvam AI."""
    try:
        return cross_role_pipeline.faculty_mentor_authenticate_student_doc(
            faculty_username=current_user.username,
            student_username=payload.student_username,
            document_title=payload.document_title,
            document_text=payload.document_text
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/institute-escalate-admin")
def institute_escalate_admin(
    payload: InstituteEscalateRequest,
    current_user=Depends(require_role(["institute", "admin", "msrch"]))
):
    """Institute governance escalating a compliance case or approval issue to the Admin dashboard."""
    try:
        return cross_role_pipeline.institute_escalate_complaint_to_admin(
            institute_name=payload.institute_name,
            issue_title=payload.issue_title,
            bureau=payload.bureau,
            description=payload.description
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
