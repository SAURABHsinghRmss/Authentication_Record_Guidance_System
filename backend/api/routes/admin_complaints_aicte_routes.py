"""
ADMIN COMPLAINTS & AICTE APPROVAL WORKFLOW ROUTES
===================================================
Exposes endpoints for:
1. Admin Complaints Monitoring & Tracking Dashboard (AICTE Bureaus/Cells, Payments, etc.)
2. Integrated AICTE Approval Workflow Automation Compliance Monitoring & Alert Management
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.api.dependencies import require_role
from backend.services.admin_complaints_aicte_service import admin_complaints_aicte_service

router = APIRouter(prefix="/admin", tags=["Admin Complaints & AICTE Workflow"])

class ComplaintCreateRequest(BaseModel):
    title: str
    bureau_or_cell: str
    complainant_role: str = "institute"
    complainant_name: str
    category: str
    priority: str = "NORMAL" # NORMAL, HIGH, URGENT
    description: str

class ComplaintStatusUpdateRequest(BaseModel):
    status: str # PENDING, UNDER_REVIEW, RESOLVED, ESCALATED
    resolution_notes: Optional[str] = None

@router.get("/complaints")
def get_admin_complaints_dashboard(current_user=Depends(require_role(["admin", "msrch"]))):
    """
    Get integrated dashboard for monitoring and tracking different institutional complaint cases
    across AICTE Bureaus/Cells, payments, and academic matters. Admin only.
    """
    try:
        return admin_complaints_aicte_service.get_complaints_dashboard()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/complaints", status_code=status.HTTP_201_CREATED)
def create_admin_complaint(
    payload: ComplaintCreateRequest,
    current_user=Depends(require_role(["admin", "institute", "msrch"]))
):
    """
    Register a new institutional complaint case for AICTE Bureaus/Cells or payment tracking.
    """
    try:
        new_case = admin_complaints_aicte_service.add_complaint(
            title=payload.title,
            bureau_or_cell=payload.bureau_or_cell,
            complainant_role=payload.complainant_role,
            complainant_name=payload.complainant_name,
            category=payload.category,
            priority=payload.priority,
            description=payload.description
        )
        return {
            "status": "SUCCESS",
            "message": "Complaint case successfully registered and routed.",
            "case": new_case
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/complaints/{case_id}")
def update_complaint_case(
    case_id: str,
    payload: ComplaintStatusUpdateRequest,
    current_user=Depends(require_role(["admin", "msrch"]))
):
    """
    Update complaint status and resolution notes. Admin only.
    """
    updated = admin_complaints_aicte_service.update_complaint_status(
        case_id=case_id,
        status=payload.status,
        resolution_notes=payload.resolution_notes or ""
    )
    if not updated:
        raise HTTPException(status_code=404, detail=f"Complaint case {case_id} not found.")
    return {
        "status": "SUCCESS",
        "message": f"Complaint case {case_id} updated successfully.",
        "case": updated
    }

@router.get("/aicte-workflow")
def get_aicte_approval_workflow(current_user=Depends(require_role(["admin", "institute", "msrch"]))):
    """
    Get Integrated AICTE Approval Workflow Automation Compliance Monitoring and Alert Management System status.
    """
    try:
        return admin_complaints_aicte_service.get_aicte_workflow_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/aicte-alerts/{alert_id}/resolve")
def resolve_aicte_alert(
    alert_id: str,
    current_user=Depends(require_role(["admin", "msrch"]))
):
    """
    Resolve an active AICTE compliance alert. Admin only.
    """
    resolved = admin_complaints_aicte_service.resolve_alert(alert_id)
    if not resolved:
        raise HTTPException(status_code=404, detail=f"AICTE alert {alert_id} not found.")
    return {
        "status": "SUCCESS",
        "message": f"AICTE compliance alert {alert_id} marked as resolved.",
        "alert": resolved
    }
