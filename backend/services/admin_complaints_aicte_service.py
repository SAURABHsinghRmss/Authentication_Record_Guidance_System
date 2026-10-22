"""
ADMIN COMPLAINTS & AICTE APPROVAL WORKFLOW AUTOMATION SERVICE
==============================================================
Provides:
1. Institutional Complaint Cases Monitoring & Tracking Dashboard (AICTE Bureaus/Cells, Payments, Academic, etc.)
2. Integrated AICTE Approval Workflow Automation Compliance Monitoring & Alert Management System
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid

class AdminComplaintsAicteService:
    # In-memory stores initialized with realistic demo data
    COMPLAINTS_STORE = [
        {
            "case_id": "cmp_882901",
            "title": "AICTE Approval Bureau - Intake Expansion Review Delay",
            "bureau_or_cell": "AICTE Approval Bureau (AB)",
            "complainant_role": "institute",
            "complainant_name": "GL Bajaj Institute of Technology and Management",
            "category": "Approval Processing",
            "priority": "HIGH",
            "status": "UNDER_REVIEW",
            "description": "Delay in processing AICTE intake capacity expansion from 120 to 180 seats in CSE (AI & ML). EVC report submitted.",
            "created_at": "2026-10-18T10:30:00Z",
            "resolution_notes": "Awaiting final scrutiny by Regional Committee member secretary."
        },
        {
            "case_id": "cmp_441299",
            "title": "AICTE Payment & SIF Fee Reconciliation Mismatch",
            "bureau_or_cell": "AICTE Payment & Finance Cell",
            "complainant_role": "institute",
            "complainant_name": "Greater Noida Engineering College",
            "category": "Payments & Fees",
            "priority": "URGENT",
            "status": "ESCALATED",
            "description": "Annual SIF inspection fee payment of ₹1,50,000 processed via SBIePay but not reflected in AICTE portal dashboard.",
            "created_at": "2026-10-20T14:15:00Z",
            "resolution_notes": "Transaction UTR #SBI2026998877 forwarded to finance reconciliation desk."
        },
        {
            "case_id": "cmp_773412",
            "title": "Anti-Ragging Cell - Mandatory Compliance Affidavit Verification",
            "bureau_or_cell": "AICTE Anti-Ragging & Grievance Cell",
            "complainant_role": "admin",
            "complainant_name": "System Administrator (msrch)",
            "category": "Regulatory Compliance",
            "priority": "NORMAL",
            "status": "RESOLVED",
            "description": "Verify online anti-ragging undertaking submissions by 100% of newly enrolled 1st-year students.",
            "created_at": "2026-10-15T09:00:00Z",
            "resolution_notes": "All 1,240 student affidavits verified and archived in compliance with Supreme Court directives."
        },
        {
            "case_id": "cmp_119823",
            "title": "Faculty-Student Ratio & Biometric Attendance Audit Discrepancy",
            "bureau_or_cell": "AICTE Quality Assurance Bureau (QAB)",
            "complainant_role": "faculty",
            "complainant_name": "Dr. Priya Sen",
            "category": "Faculty & Standards",
            "priority": "HIGH",
            "status": "PENDING",
            "description": "Biometric attendance integration for visiting adjunct faculty members reporting intermittent sync failures.",
            "created_at": "2026-10-21T11:45:00Z",
            "resolution_notes": "IT maintenance ticket raised for biometric gateway API endpoint."
        }
    ]

    AICTE_WORKFLOW_STAGES = [
        {
            "stage_id": "stg_01",
            "stage_name": "Stage 1: Application Intake & Scrutiny",
            "description": "Online submission of Extension of Approval (EoA) / New Institution application with mandatory disclosures.",
            "status": "COMPLETED",
            "completion_percentage": 100,
            "target_deadline": "2026-03-31",
            "assigned_bureau": "Approval Bureau (AB)"
        },
        {
            "stage_id": "stg_02",
            "stage_name": "Stage 2: Expert Visit Committee (EVC) Inspection",
            "description": "Physical/Virtual inspection of labs, library, infrastructure, and faculty credentials by AICTE appointed experts.",
            "status": "IN_PROGRESS",
            "completion_percentage": 85,
            "target_deadline": "2026-05-15",
            "assigned_bureau": "Inspection & Monitoring Cell"
        },
        {
            "stage_id": "stg_03",
            "stage_name": "Stage 3: Standing Hearing Committee (SHC) Review",
            "description": "Scrutiny of EVC observations, deficiency rectification reports, and institutional clarifications.",
            "status": "PENDING",
            "completion_percentage": 40,
            "target_deadline": "2026-06-10",
            "assigned_bureau": "Scrutiny & Evaluation Bureau"
        },
        {
            "stage_id": "stg_04",
            "stage_name": "Stage 4: Executive Committee (EC) Approval",
            "description": "Final executive review and grant of approval status for academic year intake and courses.",
            "status": "PENDING",
            "completion_percentage": 0,
            "target_deadline": "2026-06-30",
            "assigned_bureau": "AICTE Executive Council"
        },
        {
            "stage_id": "stg_05",
            "stage_name": "Stage 5: Final Letter of Approval (LoA) / EoA Issuance",
            "description": "Cryptographically signed digital EoA dispatch and Academic Bank of Credits (ABC) registry synchronization.",
            "status": "PENDING",
            "completion_percentage": 0,
            "target_deadline": "2026-07-05",
            "assigned_bureau": "Dispatch & Digital Registry Cell"
        }
    ]

    AICTE_ALERTS_STORE = [
        {
            "alert_id": "alt_901",
            "severity": "CRITICAL",
            "source": "Payment Gateway Reconciliation",
            "message": "Gateway mismatch detected in 2 institutional fee transactions for SIF inspection.",
            "status": "ACTIVE",
            "timestamp": "2026-10-22T08:12:00Z"
        },
        {
            "alert_id": "alt_902",
            "severity": "WARNING",
            "source": "Faculty-Student Ratio Monitor",
            "message": "Department of Civil Engineering approaching maximum allowable student-faculty ratio (1:20).",
            "status": "ACTIVE",
            "timestamp": "2026-10-21T16:30:00Z"
        },
        {
            "alert_id": "alt_903",
            "severity": "INFO",
            "source": "Mandatory Disclosure AI Audit",
            "message": "Annual mandatory disclosure portal update successfully verified by Sarvam-105B AI auditor.",
            "status": "ACKNOWLEDGED",
            "timestamp": "2026-10-20T12:00:00Z"
        }
    ]

    @classmethod
    def get_complaints_dashboard(cls) -> Dict[str, Any]:
        cases = cls.COMPLAINTS_STORE
        total = len(cases)
        pending = sum(1 for c in cases if c["status"] in ["PENDING", "UNDER_REVIEW", "ESCALATED"])
        resolved = sum(1 for c in cases if c["status"] == "RESOLVED")
        
        bureau_counts = {}
        for c in cases:
            b = c["bureau_or_cell"]
            bureau_counts[b] = bureau_counts.get(b, 0) + 1

        return {
            "total_cases": total,
            "pending_or_escalated": pending,
            "resolved_cases": resolved,
            "bureau_breakdown": bureau_counts,
            "cases": cases
        }

    @classmethod
    def add_complaint(cls, title: str, bureau_or_cell: str, complainant_role: str, complainant_name: str, category: str, priority: str, description: str) -> Dict[str, Any]:
        new_case = {
            "case_id": f"cmp_{uuid.uuid4().hex[:6]}",
            "title": title,
            "bureau_or_cell": bureau_or_cell,
            "complainant_role": complainant_role,
            "complainant_name": complainant_name,
            "category": category,
            "priority": priority,
            "status": "PENDING",
            "description": description,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "resolution_notes": "Newly registered complaint case. Under triage."
        }
        cls.COMPLAINTS_STORE.insert(0, new_case)
        return new_case

    @classmethod
    def update_complaint_status(cls, case_id: str, status: str, resolution_notes: str) -> Optional[Dict[str, Any]]:
        for c in cls.COMPLAINTS_STORE:
            if c["case_id"] == case_id:
                c["status"] = status
                if resolution_notes:
                    c["resolution_notes"] = resolution_notes
                return c
        return None

    @classmethod
    def get_aicte_workflow_status(cls) -> Dict[str, Any]:
        return {
            "workflow_title": "Integrated AICTE Approval Workflow Automation & Compliance",
            "overall_progress_percentage": 45,
            "active_cycle": "Academic Year 2026-2027",
            "stages": cls.AICTE_WORKFLOW_STAGES,
            "alerts": cls.AICTE_ALERTS_STORE,
            "compliance_status": "MONITORED_AND_SECURE",
            "last_audit_timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def resolve_alert(cls, alert_id: str) -> Optional[Dict[str, Any]]:
        for alt in cls.AICTE_ALERTS_STORE:
            if alt["alert_id"] == alert_id:
                alt["status"] = "RESOLVED"
                return alt
        return None

admin_complaints_aicte_service = AdminComplaintsAicteService()
