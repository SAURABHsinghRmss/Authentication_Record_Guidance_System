import json
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.models.student import InstitutionTemplateModel, InstitutionTemplateCreate

# ============================================================================
# CANONICAL 5 INSTITUTION TYPES & THEIR DEFAULT PRESETS
# Supported types: School, College, University, Company, Start-up
# ============================================================================

INSTITUTION_TYPES = ["School", "College", "University", "Company", "Start-up"]

def normalize_institution_type(raw_type: str) -> str:
    """Normalizes any string representation to one of the 5 canonical institution types."""
    t = (raw_type or "").strip().lower().replace("-", "").replace(" ", "").replace("_", "")
    if "school" in t or "k12" in t:
        return "School"
    elif "university" in t or "univ" in t:
        return "University"
    elif "company" in t or "corp" in t or "enterprise" in t or "industry" in t:
        return "Company"
    elif "start" in t or "incub" in t or "accelerat" in t:
        return "Start-up"
    else:
        return "College"

DEFAULT_TEMPLATES: Dict[str, Dict[str, Any]] = {
    "School": {
        "template_name": "Standard K-12 Secondary & Senior Secondary Template",
        "version": "1.0.0",
        "badge": "CBSE / State Board Accredited",
        "icon": "fa-school",
        "accent_color": "emerald",
        "type_category": "SCHOOL",
        "program": "Senior Secondary Certificate (Class XI - XII Science & Tech)",
        "department": "Science Stream (Physics, Chemistry, Maths & CS)",
        "banner_notice": "Academic Session 2025-26: Term II Board Examinations & Practical Assessments Active.",
        "role_badge_title": "Student Roll & Scholar ID",
        "financial_label": "School Term Fee & Sports Dues",
        "courses": [
            {
                "course_code": "PHY-12",
                "course_name": "Advanced Physics & Electromagnetic Theory",
                "credits": 5,
                "instructor": "Mrs. Shobha Raman (PGT Physics)",
                "room": "Physics Lab 2",
                "attendance_percentage": 94.5,
                "classes_attended": 42,
                "total_classes": 45,
                "status": "COMPLIANT"
            },
            {
                "course_code": "CHE-12",
                "course_name": "Inorganic, Organic & Analytical Chemistry",
                "credits": 5,
                "instructor": "Mr. Alok Mishra (PGT Chemistry)",
                "room": "Chemistry Hall",
                "attendance_percentage": 91.0,
                "classes_attended": 40,
                "total_classes": 44,
                "status": "COMPLIANT"
            },
            {
                "course_code": "MAT-12",
                "course_name": "Calculus, Vectors & 3D Analytical Geometry",
                "credits": 5,
                "instructor": "Mrs. Anita Kapoor (HOD Mathematics)",
                "room": "Room 201",
                "attendance_percentage": 96.0,
                "classes_attended": 48,
                "total_classes": 50,
                "status": "COMPLIANT"
            },
            {
                "course_code": "CS-12",
                "course_name": "Python Programming, Relational SQL & Cyber Ethics",
                "credits": 4,
                "instructor": "Mr. Vineet Goel (Computer Science Dept)",
                "room": "Computer Lab 1",
                "attendance_percentage": 95.0,
                "classes_attended": 38,
                "total_classes": 40,
                "status": "COMPLIANT"
            }
        ],
        "timetable": [
            {
                "day": "Monday",
                "slots": [
                    {"time": "08:00 - 08:45", "subject": "Morning Assembly & Value Education", "code": "ASM", "faculty": "Principal", "room": "Central Ground"},
                    {"time": "08:45 - 09:30", "subject": "Advanced Physics", "code": "PHY-12", "faculty": "Mrs. Shobha Raman", "room": "Room 201"},
                    {"time": "09:30 - 10:15", "subject": "Organic Chemistry", "code": "CHE-12", "faculty": "Mr. Alok Mishra", "room": "Room 201"},
                    {"time": "10:30 - 11:50", "subject": "Physics Practical Lab", "code": "PHY-LAB", "faculty": "Mrs. Shobha Raman", "room": "Physics Lab 2"},
                    {"time": "12:20 - 01:05", "subject": "Calculus & Geometry", "code": "MAT-12", "faculty": "Mrs. Anita Kapoor", "room": "Room 201"},
                    {"time": "01:05 - 01:50", "subject": "Python Coding Lab", "code": "CS-12", "faculty": "Mr. Vineet Goel", "room": "Computer Lab 1"}
                ]
            },
            {
                "day": "Wednesday",
                "slots": [
                    {"time": "08:00 - 08:45", "subject": "Mathematics Tutorial", "code": "MAT-12", "faculty": "Mrs. Anita Kapoor", "room": "Room 201"},
                    {"time": "08:45 - 09:30", "subject": "Chemistry Practical Lab", "code": "CHE-LAB", "faculty": "Mr. Alok Mishra", "room": "Chemistry Hall"},
                    {"time": "09:45 - 10:30", "subject": "Physical Education / Sports", "code": "PE-12", "faculty": "Coach Singh", "room": "Sports Complex"},
                    {"time": "10:30 - 11:15", "subject": "English Core & Public Speaking", "code": "ENG-12", "faculty": "Ms. Roy", "room": "Room 201"},
                    {"time": "11:45 - 01:15", "subject": "Science Exhibition & Olympiad Prep", "code": "OLYMP-PREP", "faculty": "Science Faculty", "room": "Auditorium"}
                ]
            }
        ],
        "fee_or_stipend": {
            "type": "SCHOOL_TUITION",
            "title": "Quarterly Term Fee Breakdown",
            "currency": "INR (₹)",
            "tuition_fee": 35000,
            "development_fee": 8000,
            "lab_examination_fee": 5000,
            "library_sports_fee": 4000,
            "total_billed": 52000,
            "total_due": 0,
            "status": "FULLY_PAID",
            "caution_deposit": 5000,
            "scholarship_name": "School Managing Committee Merit Waiver (100% Tuition)"
        },
        "documents": [
            {"id": "doc_sch_01", "name": "Class XII CBSE Bonafide Certificate", "type": "BONAFIDE", "status": "AVAILABLE_DIGILOCKER"},
            {"id": "doc_sch_02", "name": "Term I Progress Report Card", "type": "REPORT_CARD", "status": "ISSUED"},
            {"id": "doc_sch_03", "name": "Parent / Guardian Excursion Consent Form", "type": "CONSENT", "status": "SIGNED"}
        ]
    },

    "College": {
        "template_name": "Autonomous Engineering & Polytechnic College Template",
        "version": "1.0.0",
        "badge": "AICTE / AKTU Autonomous Engineering",
        "icon": "fa-building-columns",
        "accent_color": "blue",
        "type_category": "COLLEGE",
        "program": "Bachelor of Technology (B.Tech)",
        "department": "Computer Science & Engineering",
        "banner_notice": "Spring 2026: NBA & NAAC A+ Accredited Autonomous Curriculum with Continuous Assessment.",
        "role_badge_title": "Student Roll & AKTU Registration",
        "financial_label": "Semester Tuition & Laboratory Dues",
        "courses": [
            {
                "course_code": "CS-601",
                "course_name": "Data Structures & Deep Algorithmic Analysis",
                "credits": 4,
                "instructor": "Dr. Priya Sen",
                "room": "Room 304, Academic Block A",
                "attendance_percentage": 88.5,
                "classes_attended": 39,
                "total_classes": 44,
                "status": "COMPLIANT"
            },
            {
                "course_code": "CS-602",
                "course_name": "Relational & Polyglot Database Systems",
                "credits": 4,
                "instructor": "Prof. R.K. Verma",
                "room": "Lab 5, CS Complex",
                "attendance_percentage": 92.0,
                "classes_attended": 46,
                "total_classes": 50,
                "status": "COMPLIANT"
            },
            {
                "course_code": "CS-603",
                "course_name": "Computer Networks & Distributed Systems",
                "credits": 3,
                "instructor": "Dr. A.K. Srivastava",
                "room": "Lecture Theatre 2",
                "attendance_percentage": 78.4,
                "classes_attended": 29,
                "total_classes": 37,
                "status": "COMPLIANT"
            },
            {
                "course_code": "CS-604",
                "course_name": "Machine Learning Operations (MLOps)",
                "credits": 4,
                "instructor": "Dr. Neha Sharma",
                "room": "AI Research Lab",
                "attendance_percentage": 89.2,
                "classes_attended": 33,
                "total_classes": 37,
                "status": "COMPLIANT"
            }
        ],
        "timetable": [
            {
                "day": "Monday",
                "slots": [
                    {"time": "09:00 - 10:00", "subject": "Data Structures & Algorithms", "code": "CS-601", "faculty": "Dr. Priya Sen", "room": "Room 304"},
                    {"time": "10:00 - 11:00", "subject": "Database Systems", "code": "CS-602", "faculty": "Prof. R.K. Verma", "room": "Lab 5"},
                    {"time": "11:15 - 13:15", "subject": "Hands-on Practical Lab", "code": "LAB-601", "faculty": "Dr. Neha Sharma", "room": "CS Lab 3"},
                    {"time": "14:00 - 15:00", "subject": "Computer Networks", "code": "CS-603", "faculty": "Dr. A.K. Srivastava", "room": "Lecture Theatre 2"}
                ]
            },
            {
                "day": "Friday",
                "slots": [
                    {"time": "09:00 - 10:00", "subject": "Data Structures & Algorithms", "code": "CS-601", "faculty": "Dr. Priya Sen", "room": "Room 304"},
                    {"time": "10:00 - 11:00", "subject": "Database Systems", "code": "CS-602", "faculty": "Prof. R.K. Verma", "room": "Lab 5"},
                    {"time": "11:15 - 13:15", "subject": "Competitive Coding & Placement Prep", "code": "PL-HUB", "faculty": "Placement Cell", "room": "Auditorium"},
                    {"time": "14:00 - 15:00", "subject": "Student Mentorship & Guidance Sync", "code": "MENTOR", "faculty": "Dr. Priya Sen", "room": "Staff Room A"}
                ]
            }
        ],
        "fee_or_stipend": {
            "type": "COLLEGE_SEMESTER_FEE",
            "title": "Semester 6 Institutional Fee Summary",
            "currency": "INR (₹)",
            "tuition_fee": 65000,
            "development_fee": 15000,
            "lab_examination_fee": 12000,
            "library_sports_fee": 8000,
            "total_billed": 100000,
            "total_due": 12000,
            "status": "PARTIALLY_PAID",
            "caution_deposit": 5000,
            "scholarship_name": "State Technical Merit Excellence Fellowship (₹25,000)"
        },
        "documents": [
            {"id": "doc_col_01", "name": "Institutional Bonafide Certificate", "type": "BONAFIDE", "status": "APPROVED_DOWNLOADED"},
            {"id": "doc_col_02", "name": "Consolidated Semester Grade Card (Sem 1-5)", "type": "TRANSCRIPT", "status": "VERIFIED_NAD"},
            {"id": "doc_col_03", "name": "Hostel Gate Pass & No-Dues Clearance", "type": "GATE_PASS", "status": "ACTIVE"}
        ]
    },

    "University": {
        "template_name": "State Research University & Post-Graduate Template",
        "version": "1.0.0",
        "badge": "UGC Approved • Central Depository Body",
        "icon": "fa-graduation-cap",
        "accent_color": "indigo",
        "type_category": "UNIVERSITY",
        "program": "Master of Technology & Doctoral Research Studies",
        "department": "Faculty of Advanced Computing & Applied Sciences",
        "banner_notice": "Academic Bank of Credits (ABC) & National Academic Depository (NAD) Synchronized.",
        "role_badge_title": "University Registration & Scholar Depository ID",
        "financial_label": "Annual Academic Depository & Research Grant",
        "courses": [
            {
                "course_code": "RES-801",
                "course_name": "Advanced Research Methodology & Statistical Modeling",
                "credits": 4,
                "instructor": "Prof. (Dr.) Manju Khari",
                "room": "Research Block R-101",
                "attendance_percentage": 92.5,
                "classes_attended": 37,
                "total_classes": 40,
                "status": "COMPLIANT"
            },
            {
                "course_code": "RES-802",
                "course_name": "Distributed Consensus, Zero-Knowledge & Blockchain Infra",
                "credits": 4,
                "instructor": "Dr. Sunil Kumar",
                "room": "High-Performance Computing Lab",
                "attendance_percentage": 88.0,
                "classes_attended": 35,
                "total_classes": 40,
                "status": "COMPLIANT"
            },
            {
                "course_code": "RES-803",
                "course_name": "Foundation Models & Multimodal Agent Architectures",
                "credits": 4,
                "instructor": "Prof. (Dr.) V.K. Singh",
                "room": "Doctoral Seminar Hall",
                "attendance_percentage": 90.0,
                "classes_attended": 36,
                "total_classes": 40,
                "status": "COMPLIANT"
            },
            {
                "course_code": "RES-804",
                "course_name": "Doctoral Dissertation Defense & Peer Review",
                "credits": 6,
                "instructor": "University Academic Council",
                "room": "Senate Hall",
                "attendance_percentage": 95.0,
                "classes_attended": 19,
                "total_classes": 20,
                "status": "COMPLIANT"
            }
        ],
        "timetable": [
            {
                "day": "Tuesday",
                "slots": [
                    {"time": "10:00 - 12:00", "subject": "Research Methodology Seminar", "code": "RES-801", "faculty": "Prof. (Dr.) Manju Khari", "room": "R-101"},
                    {"time": "13:00 - 15:00", "subject": "HPC Distributed Cluster Lab", "code": "RES-802", "faculty": "Dr. Sunil Kumar", "room": "HPC Lab"},
                    {"time": "15:30 - 17:00", "subject": "Doctoral Colloquium & Research Presentation", "code": "RES-804", "faculty": "Senate Council", "room": "Senate Hall"}
                ]
            },
            {
                "day": "Thursday",
                "slots": [
                    {"time": "10:00 - 12:00", "subject": "Foundation Models Deep Dive", "code": "RES-803", "faculty": "Prof. (Dr.) V.K. Singh", "room": "Doctoral Seminar Hall"},
                    {"time": "14:00 - 16:00", "subject": "Academic Bank of Credits Audit Session", "code": "ABC-AUDIT", "faculty": "University Registrar", "room": "Admin Block"}
                ]
            }
        ],
        "fee_or_stipend": {
            "type": "UNIVERSITY_RESEARCH_FEE",
            "title": "Annual University Depository & Research Assessment",
            "currency": "INR (₹)",
            "tuition_fee": 45000,
            "development_fee": 10000,
            "lab_examination_fee": 15000,
            "library_sports_fee": 10000,
            "total_billed": 80000,
            "total_due": 0,
            "status": "FULLY_PAID",
            "caution_deposit": 10000,
            "scholarship_name": "UGC Junior Research Fellowship (JRF) Monthly Endowment (₹37,000/mo)"
        },
        "documents": [
            {"id": "doc_uni_01", "name": "Official University Degree Scroll", "type": "DEGREE", "status": "SEALED_DIGILOCKER"},
            {"id": "doc_uni_02", "name": "Academic Bank of Credits (ABC) Transcript", "type": "TRANSCRIPT", "status": "LIVE_SYNCHRONIZED"},
            {"id": "doc_uni_03", "name": "State Migration & Eligibility Certificate", "type": "MIGRATION", "status": "APPROVED"}
        ]
    },

    "Company": {
        "template_name": "Enterprise Apprenticeship & Corporate Training Template",
        "version": "1.0.0",
        "badge": "Industry Apprenticeship & R&D Partner",
        "icon": "fa-building",
        "accent_color": "amber",
        "type_category": "COMPANY",
        "program": "AI & Cloud Engineering Fellowship Internship",
        "department": "Enterprise AI & Cloud Platforms Division",
        "banner_notice": "Corporate Work-Integrated Learning: Sprint Q1 2026 Production Milestones Active.",
        "role_badge_title": "Employee ID & Corporate SSO Token",
        "financial_label": "Monthly Apprenticeship Stipend & Performance Bonus",
        "courses": [
            {
                "course_code": "CORP-101",
                "course_name": "Production Multi-Cloud Architecture (AWS / GCP / Azure)",
                "credits": 4,
                "instructor": "Rohan Joshi (Principal Cloud Architect)",
                "room": "Virtual Corporate Lab 4",
                "attendance_percentage": 98.0,
                "classes_attended": 49,
                "total_classes": 50,
                "status": "COMPLIANT"
            },
            {
                "course_code": "CORP-102",
                "course_name": "Enterprise Kubernetes, GitOps & Microservice Resiliency",
                "credits": 4,
                "instructor": "Shalini Nair (Staff DevOps Engineer)",
                "room": "DevOps War Room",
                "attendance_percentage": 96.0,
                "classes_attended": 48,
                "total_classes": 50,
                "status": "COMPLIANT"
            },
            {
                "course_code": "CORP-103",
                "course_name": "LLM Evaluation, RAG Pipelines & Security Best Practices",
                "credits": 4,
                "instructor": "Sameer Gupta (Lead AI Research Engineer)",
                "room": "AI Innovation Center",
                "attendance_percentage": 94.0,
                "classes_attended": 47,
                "total_classes": 50,
                "status": "COMPLIANT"
            },
            {
                "course_code": "CORP-104",
                "course_name": "Agile Sprint Delivery, CI/CD & Peer Code Review",
                "credits": 3,
                "instructor": "Vikram Seth (Director of Engineering)",
                "room": "Scrum Room Alpha",
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
                    {"time": "09:30 - 10:00", "subject": "Engineering Standup & Sprint Sync", "code": "STANDUP", "faculty": "Vikram Seth", "room": "Virtual Pod 1"},
                    {"time": "10:30 - 12:30", "subject": "Multi-Cloud Architecture Review", "code": "CORP-101", "faculty": "Rohan Joshi", "room": "War Room"},
                    {"time": "14:00 - 16:30", "subject": "Hands-on Enterprise Kubernetes Sprint", "code": "CORP-102", "faculty": "Shalini Nair", "room": "DevOps Pod"}
                ]
            },
            {
                "day": "Wednesday",
                "slots": [
                    {"time": "09:30 - 10:00", "subject": "Daily Scrum & Blocker Resolution", "code": "SCRUM", "faculty": "Scrum Master", "room": "Virtual Pod 1"},
                    {"time": "11:00 - 13:00", "subject": "LLM Evaluation & Agent Benchmarking", "code": "CORP-103", "faculty": "Sameer Gupta", "room": "AI Center"},
                    {"time": "15:00 - 16:30", "subject": "Sprint Demo & Code Review Walkthrough", "code": "CORP-104", "faculty": "Vikram Seth", "room": "Demo Hall"}
                ]
            }
        ],
        "fee_or_stipend": {
            "type": "COMPANY_STIPEND",
            "title": "Corporate Apprenticeship Compensation & Allowances",
            "currency": "INR (₹)",
            "monthly_stipend": 45000,
            "performance_bonus": 15000,
            "learning_allowance": 10000,
            "total_monthly_payout": 70000,
            "payout_schedule": "Last working day of every calendar month",
            "tax_deduction_status": "Form 16 / TDS Compliant",
            "status": "ACTIVE_DISBURSED"
        },
        "documents": [
            {"id": "doc_cmp_01", "name": "Official Internship Offer & Appointment Letter", "type": "OFFER_LETTER", "status": "EXECUTED"},
            {"id": "doc_cmp_02", "name": "Corporate Non-Disclosure Agreement (NDA)", "type": "NDA", "status": "DIGITALLY_SIGNED"},
            {"id": "doc_cmp_03", "name": "Experience & Performance Recommendation Letter", "type": "EXPERIENCE", "status": "APPROVED"}
        ]
    },

    "Start-up": {
        "template_name": "DeepTech Incubator & Venture Accelerator Template",
        "version": "1.0.0",
        "badge": "Seed Stage Incubatee • Cohort 4",
        "icon": "fa-rocket",
        "accent_color": "rose",
        "type_category": "STARTUP",
        "program": "Founder-in-Residence & Student Pre-Incubation Fellow",
        "department": "Autonomous Multi-Agent Systems & GenAI Infra",
        "banner_notice": "DST Startup India Seed Fund Scheme (SISFS): Pre-Series A Milestone Validation Active.",
        "role_badge_title": "Founder Fellow ID & Cap Table Token",
        "financial_label": "Incubation Seed Grant & Founder Fellowship",
        "courses": [
            {
                "course_code": "STUP-01",
                "course_name": "Product-Market Fit & Customer Discovery Sprints",
                "credits": 4,
                "instructor": "Ananya Roy (Venture Partner)",
                "room": "Incubator Hub A",
                "attendance_percentage": 96.0,
                "classes_attended": 24,
                "total_classes": 25,
                "status": "COMPLIANT"
            },
            {
                "course_code": "STUP-02",
                "course_name": "Scalable Agentic AI & Low-Latency Inference Pipelines",
                "credits": 4,
                "instructor": "Devrat Patel (Co-Founder & CTO)",
                "room": "GPU Cluster Lab",
                "attendance_percentage": 92.5,
                "classes_attended": 37,
                "total_classes": 40,
                "status": "COMPLIANT"
            },
            {
                "course_code": "STUP-03",
                "course_name": "Venture Capital Pitching & Unit Economics Modeling",
                "credits": 3,
                "instructor": "Rajesh Singhania (Angel Investor)",
                "room": "Pitch Room",
                "attendance_percentage": 90.0,
                "classes_attended": 18,
                "total_classes": 20,
                "status": "COMPLIANT"
            },
            {
                "course_code": "STUP-04",
                "course_name": "Rapid Prototyping, Viral Loops & Growth Hacking",
                "credits": 3,
                "instructor": "Tanvi Kulkarni (Growth Lead)",
                "room": "Growth Sandbox",
                "attendance_percentage": 95.0,
                "classes_attended": 19,
                "total_classes": 20,
                "status": "COMPLIANT"
            }
        ],
        "timetable": [
            {
                "day": "Tuesday",
                "slots": [
                    {"time": "10:00 - 11:30", "subject": "Product-Market Fit & Customer Interviews", "code": "STUP-01", "faculty": "Ananya Roy", "room": "Incubator Hub A"},
                    {"time": "12:00 - 14:00", "subject": "AI Pipeline Optimization & Model Pruning", "code": "STUP-02", "faculty": "Devrat Patel", "room": "GPU Lab"},
                    {"time": "16:00 - 17:30", "subject": "Founder Mentorship 1-on-1", "code": "MENTOR-1ON1", "faculty": "Rajesh Singhania", "room": "Pitch Room"}
                ]
            },
            {
                "day": "Thursday",
                "slots": [
                    {"time": "11:00 - 13:00", "subject": "VC Deck Polish & Pitch Rehearsal", "code": "STUP-03", "faculty": "Rajesh Singhania", "room": "Pitch Room"},
                    {"time": "14:30 - 16:30", "subject": "Growth Hacking & Analytics Sprint", "code": "STUP-04", "faculty": "Tanvi Kulkarni", "room": "Sandbox"},
                    {"time": "17:00 - 18:30", "subject": "Demo Day Preparation & Dry Run", "code": "DEMO-RUN", "faculty": "Accelerator Board", "room": "Auditorium"}
                ]
            }
        ],
        "fee_or_stipend": {
            "type": "STARTUP_GRANT",
            "title": "Incubation Seed Funding & Founder Fellowship",
            "currency": "INR (₹)",
            "seed_grant_allocated": 500000,
            "seed_grant_disbursed": 350000,
            "monthly_founder_stipend": 40000,
            "cloud_credits_awarded": "$10,000 USD (Google Cloud for Startups)",
            "equity_stake": "0% Non-Dilutive Government Grant",
            "status": "MILESTONE_ACTIVE"
        },
        "documents": [
            {"id": "doc_stp_01", "name": "DST Startup India Incubation Agreement", "type": "AGREEMENT", "status": "EXECUTED"},
            {"id": "doc_stp_02", "name": "Intellectual Property (IP) Protection & Patent File", "type": "IP_PATENT", "status": "FILED"},
            {"id": "doc_stp_03", "name": "Milestone Validation & Demo Signoff Certificate", "type": "MILESTONE", "status": "APPROVED"}
        ]
    }
}

# ----------------------------------------------------------------------------
# Helper: Seed or Ensure Templates in Database
# ----------------------------------------------------------------------------
def seed_default_templates_if_empty(db: Session):
    """Ensures each of the 5 canonical institution types has a baseline active template."""
    for type_name, preset in DEFAULT_TEMPLATES.items():
        type_key = f"type_{type_name.lower().replace('-', '_')}"
        existing = db.query(InstitutionTemplateModel).filter(
            (InstitutionTemplateModel.institution_type == type_name) |
            (InstitutionTemplateModel.institution_id == type_key)
        ).first()

        if not existing:
            tpl_id = f"tpl_{type_key}_{uuid.uuid4().hex[:6]}"
            new_tpl = InstitutionTemplateModel(
                id=tpl_id,
                institution_id=type_key,
                institution_type=type_name,
                institution_name=f"{type_name} Autonomous Template",
                template_name=preset["template_name"],
                template_category="FULL_PORTAL",
                developer_mode_enabled=True,
                is_active=True,
                version=preset["version"],
                published_to_roles="student,faculty,parent,admin,all",
                theme_config=json.dumps({
                    "badge": preset["badge"],
                    "icon": preset["icon"],
                    "accent_color": preset["accent_color"],
                    "banner_notice": preset.get("banner_notice", "")
                }),
                template_data=json.dumps({
                    "program": preset["program"],
                    "department": preset["department"],
                    "role_badge_title": preset.get("role_badge_title"),
                    "financial_label": preset.get("financial_label"),
                    "courses": preset["courses"],
                    "timetable": preset["timetable"],
                    "fee_or_stipend": preset["fee_or_stipend"],
                    "documents": preset["documents"]
                }),
                created_by="system_developer_seed"
            )
            db.add(new_tpl)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"[TEMPLATE SEED NOTICE] Could not commit seed: {e}")

# ----------------------------------------------------------------------------
# Helper: Retrieve Active Template for Institution or Institution Type
# ----------------------------------------------------------------------------
def get_active_template_for_institution(db: Session, inst_id_or_type: str) -> Dict[str, Any]:
    """
    Finds the active template for a given institution ID or institution type.
    Falls back to canonical preset if no custom template is saved.
    """
    seed_default_templates_if_empty(db)
    
    canonical_type = normalize_institution_type(inst_id_or_type)
    type_key = f"type_{canonical_type.lower().replace('-', '_')}"

    # First check if there is an exact match for this institution_id
    custom = db.query(InstitutionTemplateModel).filter(
        InstitutionTemplateModel.institution_id == inst_id_or_type,
        InstitutionTemplateModel.is_active == True
    ).first()

    # Second check by canonical type_key
    if not custom:
        custom = db.query(InstitutionTemplateModel).filter(
            InstitutionTemplateModel.institution_id == type_key,
            InstitutionTemplateModel.is_active == True
        ).first()

    # Third check by institution_type directly
    if not custom:
        custom = db.query(InstitutionTemplateModel).filter(
            func.lower(InstitutionTemplateModel.institution_type) == canonical_type.lower(),
            InstitutionTemplateModel.is_active == True
        ).first()

    if custom:
        try:
            theme = json.loads(custom.theme_config) if custom.theme_config else {}
        except Exception:
            theme = {}
        try:
            data = json.loads(custom.template_data) if custom.template_data else {}
        except Exception:
            data = {}

        return {
            "id": custom.id,
            "institution_id": custom.institution_id,
            "institution_type": custom.institution_type,
            "institution_name": custom.institution_name,
            "template_name": custom.template_name,
            "template_category": custom.template_category,
            "developer_mode_enabled": custom.developer_mode_enabled,
            "is_active": custom.is_active,
            "version": custom.version,
            "published_to_roles": custom.published_to_roles,
            "theme_config": theme,
            "template_data": data,
            "created_by": custom.created_by,
            "created_at": custom.created_at.isoformat() if custom.created_at else None,
            "updated_at": custom.updated_at.isoformat() if custom.updated_at else None,
            "is_custom": True
        }

    # Fallback to standard preset
    preset = DEFAULT_TEMPLATES.get(canonical_type, DEFAULT_TEMPLATES["College"])
    return {
        "id": f"default_{type_key}",
        "institution_id": inst_id_or_type,
        "institution_type": canonical_type,
        "institution_name": f"{canonical_type} Default Template",
        "template_name": preset["template_name"],
        "template_category": "FULL_PORTAL",
        "developer_mode_enabled": True,
        "is_active": True,
        "version": preset["version"],
        "published_to_roles": "student,faculty,parent,admin,all",
        "theme_config": {
            "badge": preset["badge"],
            "icon": preset["icon"],
            "accent_color": preset["accent_color"],
            "banner_notice": preset.get("banner_notice", "")
        },
        "template_data": {
            "program": preset["program"],
            "department": preset["department"],
            "role_badge_title": preset.get("role_badge_title"),
            "financial_label": preset.get("financial_label"),
            "courses": preset["courses"],
            "timetable": preset["timetable"],
            "fee_or_stipend": preset["fee_or_stipend"],
            "documents": preset["documents"]
        },
        "created_by": "system_default",
        "is_custom": False
    }

# ----------------------------------------------------------------------------
# Helper: Save or Update Template from Developer Mode
# ----------------------------------------------------------------------------
def save_or_update_template(db: Session, payload: InstitutionTemplateCreate, user: str = "institution_developer") -> Dict[str, Any]:
    norm_type = normalize_institution_type(payload.institution_type)
    inst_id = payload.institution_id or f"type_{norm_type.lower().replace('-', '_')}"

    existing = db.query(InstitutionTemplateModel).filter(
        (InstitutionTemplateModel.institution_id == inst_id) |
        ((InstitutionTemplateModel.institution_type == norm_type) & (InstitutionTemplateModel.institution_id.like("type_%")))
    ).first()

    theme_str = json.dumps(payload.theme_config or {})
    data_str = json.dumps(payload.template_data or {})

    if existing:
        existing.institution_type = norm_type
        existing.institution_name = payload.institution_name or existing.institution_name
        existing.template_name = payload.template_name
        existing.template_category = payload.template_category or "FULL_PORTAL"
        existing.developer_mode_enabled = payload.developer_mode_enabled
        existing.is_active = payload.is_active
        existing.version = payload.version or "1.0.1"
        existing.published_to_roles = payload.published_to_roles or "student,faculty,parent,admin,all"
        existing.theme_config = theme_str
        existing.template_data = data_str
        existing.created_by = user
        existing.updated_at = datetime.now(timezone.utc)
        target = existing
    else:
        target = InstitutionTemplateModel(
            id=f"tpl_{uuid.uuid4().hex[:8]}",
            institution_id=inst_id,
            institution_type=norm_type,
            institution_name=payload.institution_name or f"{norm_type} Custom Instance",
            template_name=payload.template_name,
            template_category=payload.template_category or "FULL_PORTAL",
            developer_mode_enabled=payload.developer_mode_enabled,
            is_active=payload.is_active,
            version=payload.version or "1.0.0",
            published_to_roles=payload.published_to_roles or "student,faculty,parent,admin,all",
            theme_config=theme_str,
            template_data=data_str,
            created_by=user,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(target)

    db.commit()
    db.refresh(target)

    return get_active_template_for_institution(db, inst_id)
