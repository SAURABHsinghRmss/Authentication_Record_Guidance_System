from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone

from backend.api.dependencies import require_role
from backend.services.db_federation import (
    DatabaseFederationManager,
    SecurityAuditEvent, SecuritySession,
    GovernanceInstitution, InstituteSession,
    FamilyWardLink, ParentGuardian, FamilySession,
    SISStudent, AcademicSession
)

router = APIRouter(prefix="/databases", tags=["Database Federation & Admin"])


@router.get("/health")
def federation_health(current_user=Depends(require_role(["admin", "msrch"]))):
    """
    Returns real-time health diagnostics for all 5 specialized domain databases.
    Admin-only endpoint.
    """
    try:
        diagnostics = DatabaseFederationManager.get_federation_diagnostics()
        return diagnostics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Federation diagnostics failed: {str(e)}")


@router.get("/audit-events")
def get_audit_events(
    limit: int = Query(default=50, ge=1, le=500),
    event_type: Optional[str] = Query(default=None),
    actor_role: Optional[str] = Query(default=None),
    current_user=Depends(require_role(["admin", "msrch"]))
):
    """
    Returns recent security audit events from security_audit.db.
    Filterable by event_type and actor_role. Admin-only.
    """
    try:
        with SecuritySession() as db:
            query = db.query(SecurityAuditEvent)
            if event_type:
                query = query.filter(SecurityAuditEvent.event_type == event_type.upper())
            if actor_role:
                query = query.filter(SecurityAuditEvent.actor_role == actor_role.lower())
            events = query.order_by(SecurityAuditEvent.timestamp.desc()).limit(limit).all()
            return [
                {
                    "id": e.id,
                    "event_type": e.event_type,
                    "actor_username": e.actor_username,
                    "actor_role": e.actor_role,
                    "target_entity": e.target_entity,
                    "client_ip": e.client_ip,
                    "status": e.status,
                    "details": e.details_json,
                    "timestamp": e.timestamp.isoformat() if e.timestamp else None
                }
                for e in events
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not query audit events: {str(e)}")


@router.get("/institutions/governance")
def get_governance_institutions(
    limit: int = Query(default=100, ge=1, le=1000),
    current_user=Depends(require_role(["admin", "institute", "msrch"]))
):
    """
    Returns all registered institutions from the Institutions Governance DB.
    Accessible by admin and institute roles.
    """
    try:
        with InstituteSession() as db:
            insts = db.query(GovernanceInstitution).limit(limit).all()
            return [
                {
                    "id": inst.id,
                    "name": inst.name,
                    "institution_type": inst.institution_type,
                    "location": inst.location,
                    "educational_domain": inst.educational_domain,
                    "mission_scope": inst.mission_scope,
                    "status": inst.status,
                    "accreditation_number": inst.accreditation_number,
                    "accreditation_verified": inst.accreditation_verified,
                    "is_virtual": inst.is_virtual,
                    "requested_by": inst.requested_by,
                    "created_at": inst.created_at.isoformat() if inst.created_at else None
                }
                for inst in insts
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not query governance institutions: {str(e)}")


@router.get("/family/ward-links")
def get_family_ward_links(
    parent_username: Optional[str] = Query(default=None),
    student_identifier: Optional[str] = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    current_user=Depends(require_role(["admin", "msrch"]))
):
    """
    Returns parent-student ward links from Family Heritage DB.
    Admin-only. Optionally filter by parent_username or student_identifier.
    """
    try:
        with FamilySession() as db:
            query = db.query(FamilyWardLink)
            if parent_username:
                query = query.filter(FamilyWardLink.parent_username == parent_username)
            if student_identifier:
                query = query.filter(FamilyWardLink.student_identifier == student_identifier)
            links = query.limit(limit).all()

            guardians = db.query(ParentGuardian).all()
            guardian_map = {g.parent_username: g for g in guardians}

            return [
                {
                    "id": link.id,
                    "parent_username": link.parent_username,
                    "student_identifier": link.student_identifier,
                    "verification_status": link.verification_status,
                    "linked_at": link.linked_at.isoformat() if link.linked_at else None,
                    "guardian_info": {
                        "full_name": guardian_map[link.parent_username].full_name if link.parent_username in guardian_map else None,
                        "vital_status": guardian_map[link.parent_username].vital_status if link.parent_username in guardian_map else None,
                        "source_of_income": guardian_map[link.parent_username].source_of_income if link.parent_username in guardian_map else None
                    }
                }
                for link in links
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not query family ward links: {str(e)}")


@router.get("/academic/students")
def get_sis_students(
    limit: int = Query(default=100, ge=1, le=1000),
    department: Optional[str] = Query(default=None),
    current_user=Depends(require_role(["admin", "institute", "msrch"]))
):
    """
    Returns students from the Academic SIS database.
    Accessible by admin and institute roles.
    """
    try:
        with AcademicSession() as db:
            query = db.query(SISStudent)
            if department:
                query = query.filter(SISStudent.department.ilike(f"%{department}%"))
            students = query.limit(limit).all()
            return [
                {
                    "id": s.id,
                    "roll_no": s.roll_no,
                    "name": s.name,
                    "email": s.email,
                    "department": s.department,
                    "semester": s.semester,
                    "cgpa": s.cgpa,
                    "attendance_percentage": s.attendance_percentage,
                    "credits_earned": s.credits_earned,
                    "max_credits": s.max_credits,
                    "backlogs": s.backlogs,
                    "apaar_id": s.apaar_id,
                    "digilocker_verified": s.digilocker_verified,
                    "status": s.status,
                    "created_at": s.created_at.isoformat() if s.created_at else None
                }
                for s in students
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not query SIS students: {str(e)}")
