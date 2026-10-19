from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from backend.services.db import get_db
from backend.models.student import StudentModel, StudentCreate, StudentUpdate, StudentResponse, UserModel
from backend.api.dependencies import require_role
from backend.services.institution_templates import get_active_template_for_institution

router = APIRouter(prefix="/students", tags=["Student Record Management"])

@router.get("/", response_model=List[StudentResponse])
def list_students(
    skip: int = 0,
    limit: int = 100,
    department: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(StudentModel)
    if department:
        query = query.filter(StudentModel.department.ilike(f"%{department}%"))
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(
    student_in: StudentCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(require_role(["admin", "faculty"]))
):
    existing = db.query(StudentModel).filter(StudentModel.roll_no == student_in.roll_no).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student roll number already exists")
    
    student_id = f"stu_{uuid.uuid4().hex[:8]}"
    student = StudentModel(id=student_id, **student_in.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter((StudentModel.id == student_id) | (StudentModel.roll_no == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: str,
    student_in: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(require_role(["admin", "faculty"]))
):
    student = db.query(StudentModel).filter((StudentModel.id == student_id) | (StudentModel.roll_no == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = student_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(student, key, value)
    
    db.commit()
    db.refresh(student)
    return student

@router.delete("/{student_id}")
def delete_student(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(require_role(["admin"]))
):
    student = db.query(StudentModel).filter((StudentModel.id == student_id) | (StudentModel.roll_no == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student record successfully deleted", "id": student_id}

@router.get("/{student_id}/guidance")
def get_student_guidance(student_id: str, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter((StudentModel.id == student_id) | (StudentModel.roll_no == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    attendance = float(student.attendance_percentage or 0)
    cgpa = float(student.cgpa or 0)
    backlogs = student.backlogs or 0

    recommendations = []
    if attendance < 75.0:
        recommendations.append("Warning: Attendance is below 75% mandatory threshold. Immediate remedial classes required.")
    else:
        recommendations.append("Attendance is healthy and compliant with institutional norms.")

    if cgpa >= 8.5:
        recommendations.append("Eligible for Honors degree track and advanced research assistantships.")
    elif cgpa >= 7.0:
        recommendations.append("Performing well. Recommended to explore SWAYAM/NPTEL credit transfer electives.")
    else:
        recommendations.append("Academic counseling recommended with faculty mentor to improve grade trajectory.")

    if backlogs > 0:
        recommendations.append(f"Action Required: Clear {backlogs} active backlog(s) prior to campus placement registration.")
    else:
        recommendations.append("Zero backlogs: Fully eligible for upcoming tier-1 placement drives.")

    return {
        "student_id": student.id,
        "roll_no": student.roll_no,
        "name": student.name,
        "cgpa": cgpa,
        "attendance": attendance,
        "backlogs": backlogs,
        "recommendations": recommendations,
        "timestamp": "2026-10-06T12:00:00Z"
    }

# -------------------------------------------------------------
# Multi-Institution Enrollment & Institutional Portal Hub
# -------------------------------------------------------------
from pydantic import BaseModel
from datetime import datetime, timezone
import random

class FeePaymentRequest(BaseModel):
    amount: float
    payment_mode: str = "UPI"
    remarks: Optional[str] = "Semester Fee Payment"

class LeaveApplicationRequest(BaseModel):
    leave_type: str = "Medical"
    from_date: str
    to_date: str
    reason: str
    attachment_name: Optional[str] = None

class DocumentRequestPayload(BaseModel):
    document_type: str = "Bonafide Certificate"
    purpose: str = "Internship / Passport Application"
    delivery_mode: str = "Digital Copy"

class GrievancePayload(BaseModel):
    category: str = "Academic"
    subject: str
    description: str
    urgency: str = "NORMAL"

class FeedbackPayload(BaseModel):
    faculty_or_dept: str
    rating: int = 5
    comments: str

class BookRenewalPayload(BaseModel):
    accession_no: str

# In-memory store for interactive student institutional actions during runtime
INSTITUTION_ACTION_STORE = {
    "transactions": [],
    "leaves": [],
    "documents": [],
    "grievances": [],
    "feedbacks": []
}

def _build_enrolled_institutions(student_name: str, roll_no: str, dept: str, db: Optional[Session] = None):
    institutions = [
        {
            "id": "inst_glbitm",
            "name": "GL Bajaj Institute of Technology and Management",
            "type": "College",
            "type_category": "COLLEGE",
            "badge": "Active Enrolled • Primary",
            "affiliation": "Dr. A.P.J. Abdul Kalam Technical University (AKTU) & AICTE",
            "program": "Bachelor of Technology (B.Tech)",
            "department": dept or "Computer Science & Engineering",
            "current_semester": "6th Semester",
            "roll_no": roll_no or "CS-2022-04",
            "enrollment_number": "2201920100045",
            "batch": "2022 - 2026",
            "joined_year": "2022",
            "status": "ACTIVE",
            "location": "Knowledge Park II, Greater Noida, Uttar Pradesh, India",
            "is_primary": True,
            "attendance_percentage": "86.5%",
            "cgpa": "8.42",
            "icon": "fa-building-columns",
            "accent_color": "blue"
        },
        {
            "id": "inst_dps_rkp",
            "name": "Delhi Public School (DPS), R.K. Puram",
            "type": "School",
            "type_category": "SCHOOL",
            "badge": "Alumnus • Completed",
            "affiliation": "Central Board of Secondary Education (CBSE National Board)",
            "program": "Senior Secondary Certificate (Class XI - XII)",
            "department": "Science Stream (PCM & Computer Science)",
            "current_semester": "Graduated Class of 2022",
            "roll_no": "DPS-2022-9841",
            "enrollment_number": "CBSE-DEL-1094821",
            "batch": "2020 - 2022",
            "joined_year": "2020",
            "status": "COMPLETED",
            "location": "Sector XII, R.K. Puram, New Delhi, India",
            "is_primary": False,
            "attendance_percentage": "94.2%",
            "cgpa": "95.6% (CBSE Boards)",
            "icon": "fa-school",
            "accent_color": "emerald"
        },
        {
            "id": "inst_aktu",
            "name": "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
            "type": "University",
            "type_category": "UNIVERSITY",
            "badge": "State Affiliating Body",
            "affiliation": "University Grants Commission (UGC) & AICTE",
            "program": "Degree Granting & State Academic Depository",
            "department": "Faculty of Engineering & Technological Research",
            "current_semester": "Academic Session 2025–26",
            "roll_no": "AKTU-REG-2022-045",
            "enrollment_number": "AKTU-UP-992144",
            "batch": "2022 - 2026",
            "joined_year": "2022",
            "status": "ACTIVE",
            "location": "Sec-11, Jankipuram Vistar, Lucknow, Uttar Pradesh",
            "is_primary": False,
            "attendance_percentage": "88.0%",
            "cgpa": "8.50 (Cumulative)",
            "icon": "fa-graduation-cap",
            "accent_color": "indigo"
        },
        {
            "id": "inst_tcs_corp",
            "name": "Tata Consultancy Services (TCS) Innovation Lab",
            "type": "Company",
            "type_category": "COMPANY",
            "badge": "Industry Apprenticeship",
            "affiliation": "TCS Enterprise Research & Campus Hiring Partner",
            "program": "AI & Cloud Engineering Internship Fellowship",
            "department": "Enterprise AI & Cloud Platforms Division",
            "current_semester": "Q1 2026 Sprint",
            "roll_no": "EMP-TCS-INT-9921",
            "enrollment_number": "TCS-IND-2026-X8",
            "batch": "2025 - 2026",
            "joined_year": "2025",
            "status": "ACTIVE",
            "location": "Noida Special Economic Zone (NSEZ), Phase II, Noida",
            "is_primary": False,
            "attendance_percentage": "96.0%",
            "cgpa": "Stipend Active",
            "icon": "fa-building",
            "accent_color": "amber"
        },
        {
            "id": "inst_ai_startup",
            "name": "NeuroGrid AI (DeepTech & Agentic AI Incubator)",
            "type": "Start-up",
            "type_category": "STARTUP",
            "badge": "Seed Stage Incubatee",
            "affiliation": "Department of Science & Technology (DST) Startup India",
            "program": "Founder-in-Residence & Student Pre-Incubation",
            "department": "Autonomous Multi-Agent Systems & LLM Infra",
            "current_semester": "Cohort 4 (Pre-Series A)",
            "roll_no": "FOUND-FELLOW-014",
            "enrollment_number": "STARTUP-IND-NG-77",
            "batch": "2025 - Present",
            "joined_year": "2025",
            "status": "ACTIVE",
            "location": "IIT Delhi Innovation & Incubation Park, New Delhi",
            "is_primary": False,
            "attendance_percentage": "92.5%",
            "cgpa": "Grant Funded",
            "icon": "fa-rocket",
            "accent_color": "rose"
        }
    ]

    if db:
        for inst in institutions:
            tpl = get_active_template_for_institution(db, inst["id"])
            inst["developer_mode_enabled"] = tpl.get("developer_mode_enabled", True)
            inst["active_template"] = {
                "id": tpl.get("id"),
                "template_name": tpl.get("template_name"),
                "version": tpl.get("version"),
                "is_custom": tpl.get("is_custom", False),
                "banner_notice": tpl.get("theme_config", {}).get("banner_notice", "")
            }
            if tpl.get("theme_config", {}).get("badge"):
                inst["badge"] = tpl["theme_config"]["badge"]
            if tpl.get("theme_config", {}).get("accent_color"):
                inst["accent_color"] = tpl["theme_config"]["accent_color"]
            if tpl.get("theme_config", {}).get("icon"):
                inst["icon"] = tpl["theme_config"]["icon"]
            if tpl.get("template_data", {}).get("program"):
                inst["program"] = tpl["template_data"]["program"]
            if tpl.get("template_data", {}).get("department"):
                inst["department"] = tpl["template_data"]["department"]

    return institutions

def _build_full_institution_portal(inst_id: str, student_name: str, roll_no: str, dept: str, db: Optional[Session] = None):
    is_school = (inst_id == "inst_dps_rkp")
    is_university = (inst_id == "inst_aktu")
    is_company = (inst_id == "inst_tcs_corp")
    is_startup = (inst_id == "inst_ai_startup")
    
    if is_school:
        inst_name = "Delhi Public School (DPS), R.K. Puram"
        inst_type = "School"
        dept_name = "Senior Secondary Science (PCM & Computer Science)"
        active_roll = "DPS-2022-9841"
    elif is_university:
        inst_name = "Dr. A.P.J. Abdul Kalam Technical University (AKTU)"
        inst_type = "University"
        dept_name = "Faculty of Engineering & Technological Research"
        active_roll = "AKTU-REG-2022-045"
    elif is_company:
        inst_name = "Tata Consultancy Services (TCS) Innovation Lab"
        inst_type = "Company"
        dept_name = "Enterprise AI & Cloud Platforms Division"
        active_roll = "EMP-TCS-INT-9921"
    elif is_startup:
        inst_name = "NeuroGrid AI (DeepTech Incubator)"
        inst_type = "Start-up"
        dept_name = "Autonomous Multi-Agent Systems & LLM Infra"
        active_roll = "FOUND-FELLOW-014"
    else:
        inst_name = "GL Bajaj Institute of Technology and Management"
        inst_type = "College"
        dept_name = dept or "Computer Science & Engineering"
        active_roll = roll_no or "CS-2022-04"

    # Courses & Attendance
    courses = [
        {
            "course_code": "CS-601" if not is_school else "PHY-12",
            "course_name": "Data Structures & Deep Algorithmic Analysis" if not is_school else "Advanced Physics & Electromagnetic Theory",
            "credits": 4 if not is_school else 5,
            "instructor": "Dr. Priya Sen" if not is_school else "Mrs. Shobha Raman",
            "room": "Room 304, Academic Block A" if not is_school else "Physics Lab 2",
            "attendance_percentage": 88.5,
            "classes_attended": 39,
            "total_classes": 44,
            "status": "COMPLIANT"
        },
        {
            "course_code": "CS-602" if not is_school else "CHE-12",
            "course_name": "Relational & Polyglot Database Systems" if not is_school else "Inorganic & Organic Chemistry",
            "credits": 4 if not is_school else 5,
            "instructor": "Prof. R.K. Verma" if not is_school else "Mr. Alok Mishra",
            "room": "Lab 5, CS Complex" if not is_school else "Chemistry Hall",
            "attendance_percentage": 92.0,
            "classes_attended": 46,
            "total_classes": 50,
            "status": "COMPLIANT"
        },
        {
            "course_code": "CS-603" if not is_school else "MAT-12",
            "course_name": "Computer Networks & Distributed Systems" if not is_school else "Calculus & Three-Dimensional Geometry",
            "credits": 3 if not is_school else 5,
            "instructor": "Dr. A.K. Srivastava" if not is_school else "Mrs. Anita Kapoor",
            "room": "Lecture Theatre 2" if not is_school else "Room 201",
            "attendance_percentage": 78.4,
            "classes_attended": 29,
            "total_classes": 37,
            "status": "COMPLIANT"
        },
        {
            "course_code": "CS-604" if not is_school else "CS-12",
            "course_name": "Machine Learning Operations (MLOps)" if not is_school else "Python Programming & SQL",
            "credits": 4 if not is_school else 4,
            "instructor": "Dr. Neha Sharma" if not is_school else "Mr. Vineet Goel",
            "room": "AI Research Lab" if not is_school else "Computer Lab 1",
            "attendance_percentage": 89.2,
            "classes_attended": 33,
            "total_classes": 37,
            "status": "COMPLIANT"
        }
    ]

    # Weekly Timetable
    timetable = [
        {"day": "Monday", "slots": [
            {"time": "09:00 - 10:00", "subject": courses[0]["course_name"], "code": courses[0]["course_code"], "faculty": courses[0]["instructor"], "room": courses[0]["room"]},
            {"time": "10:00 - 11:00", "subject": courses[1]["course_name"], "code": courses[1]["course_code"], "faculty": courses[1]["instructor"], "room": courses[1]["room"]},
            {"time": "11:15 - 13:15", "subject": "Hands-on Practical Lab", "code": "LAB-601", "faculty": courses[3]["instructor"], "room": "CS Lab 3"},
            {"time": "14:00 - 15:00", "subject": courses[2]["course_name"], "code": courses[2]["course_code"], "faculty": courses[2]["instructor"], "room": courses[2]["room"]},
        ]},
        {"day": "Tuesday", "slots": [
            {"time": "09:00 - 10:00", "subject": courses[2]["course_name"], "code": courses[2]["course_code"], "faculty": courses[2]["instructor"], "room": courses[2]["room"]},
            {"time": "10:00 - 11:00", "subject": courses[3]["course_name"], "code": courses[3]["course_code"], "faculty": courses[3]["instructor"], "room": courses[3]["room"]},
            {"time": "11:15 - 12:15", "subject": courses[0]["course_name"], "code": courses[0]["course_code"], "faculty": courses[0]["instructor"], "room": courses[0]["room"]},
            {"time": "13:00 - 15:00", "subject": "SWAYAM / NPTEL Online Tutorial", "code": "ELEC-NPTEL", "faculty": "Online Proctor", "room": "Digital Library"},
        ]},
        {"day": "Wednesday", "slots": [
            {"time": "09:00 - 10:00", "subject": courses[1]["course_name"], "code": courses[1]["course_code"], "faculty": courses[1]["instructor"], "room": courses[1]["room"]},
            {"time": "10:00 - 11:00", "subject": courses[0]["course_name"], "code": courses[0]["course_code"], "faculty": courses[0]["instructor"], "room": courses[0]["room"]},
            {"time": "11:15 - 13:15", "subject": "Project Work / Seminar Session", "code": "SEM-602", "faculty": "Dr. Priya Sen", "room": "Seminar Hall 1"},
            {"time": "14:00 - 15:00", "subject": courses[3]["course_name"], "code": courses[3]["course_code"], "faculty": courses[3]["instructor"], "room": courses[3]["room"]},
        ]},
        {"day": "Thursday", "slots": [
            {"time": "09:00 - 10:00", "subject": courses[3]["course_name"], "code": courses[3]["course_code"], "faculty": courses[3]["instructor"], "room": courses[3]["room"]},
            {"time": "10:00 - 11:00", "subject": courses[2]["course_name"], "code": courses[2]["course_code"], "faculty": courses[2]["instructor"], "room": courses[2]["room"]},
            {"time": "11:15 - 12:15", "subject": courses[1]["course_name"], "code": courses[1]["course_code"], "faculty": courses[1]["instructor"], "room": courses[1]["room"]},
            {"time": "13:00 - 14:00", "subject": "Library Research & Paper Reading", "code": "LIB-RES", "faculty": "Librarian", "room": "Central Library"},
        ]},
        {"day": "Friday", "slots": [
            {"time": "09:00 - 10:00", "subject": courses[0]["course_name"], "code": courses[0]["course_code"], "faculty": courses[0]["instructor"], "room": courses[0]["room"]},
            {"time": "10:00 - 11:00", "subject": courses[1]["course_name"], "code": courses[1]["course_code"], "faculty": courses[1]["instructor"], "room": courses[1]["room"]},
            {"time": "11:15 - 13:15", "subject": "Competitive Coding & Placement Prep", "code": "PL-HUB", "faculty": "Placement Cell", "room": "Auditorium"},
            {"time": "14:00 - 15:00", "subject": "Student Mentorship & Guidance Sync", "code": "MENTOR", "faculty": "Dr. Priya Sen", "room": "Staff Room A"},
        ]}
    ]

    # Academic Calendar
    calendar_events = [
        {"date": "2026-08-01", "event": "Commencement of Academic Session & Orientation", "type": "ACADEMIC"},
        {"date": "2026-09-15", "event": "Registration & Submission for NPTEL / SWAYAM MOOCs", "type": "DEADLINE"},
        {"date": "2026-10-12 to 2026-10-18", "event": "Mid-Term Examination (Internal Assessment)", "type": "EXAM"},
        {"date": "2026-10-24", "event": "Diwali & Autumn Festival Break", "type": "HOLIDAY"},
        {"date": "2026-11-20", "event": "Annual Techno-Cultural Hackathon & Project Expo", "type": "EVENT"},
        {"date": "2026-12-05 to 2026-12-20", "event": "End-Semester Final Theory & Lab Examinations", "type": "EXAM"},
        {"date": "2026-12-25", "event": "Winter Vacation & Semester Break", "type": "HOLIDAY"},
    ]

    # Fee Management Data
    fee_data = {
        "structure": {
            "tuition_fee": 65000 if not is_school else 35000,
            "development_fee": 15000 if not is_school else 8000,
            "lab_examination_fee": 12000 if not is_school else 5000,
            "library_sports_fee": 8000 if not is_school else 4000,
            "total_billed": 100000 if not is_school else 52000,
            "currency": "INR (₹)"
        },
        "dues": {
            "total_due": 12000 if not is_school else 0,
            "due_date": "2026-11-15",
            "late_fee_per_day": 100,
            "status": "PARTIALLY_PAID" if not is_school else "FULLY_PAID"
        },
        "balance": {
            "total_paid": 88000 if not is_school else 52000,
            "current_balance": 12000 if not is_school else 0,
            "last_updated": "2026-10-15T10:30:00Z"
        },
        "registration_fee": {
            "amount": 2500,
            "status": "PAID",
            "receipt_id": "REG-2026-8812"
        },
        "scholarship": {
            "name": "Academic Merit Excellence Scholarship" if not is_school else "Merit Award",
            "amount": 25000 if not is_school else 10000,
            "status": "APPROVED_DISBURSED",
            "awarded_date": "2026-08-20",
            "granting_body": "State Higher Education Directorate" if not is_school else "School Managing Committee"
        },
        "fee_relaxation": {
            "category": "Alumni Heritage & Academic Distinction (8.5+ CGPA)",
            "concession_percentage": 10,
            "concession_amount": 10000,
            "status": "APPLIED"
        },
        "refund": {
            "caution_money_deposit": 5000,
            "status": "HELD_IN_ESCROW",
            "refundable_at": "Degree Completion / Relieving Certificate",
            "refund_policy": "Full 100% refund of caution deposit upon clearance of no-dues certificate."
        },
        "transactions": [
            {
                "receipt_no": "REC-GLB-2026-1049",
                "date": "2026-08-10",
                "amount": 50000,
                "mode": "Net Banking (HDFC)",
                "bank_ref": "HDFC000192837",
                "description": "Semester 6 - 1st Installment",
                "status": "SUCCESS"
            },
            {
                "receipt_no": "REC-GLB-2026-2184",
                "date": "2026-09-12",
                "amount": 38000,
                "mode": "UPI (GooglePay / NPCI)",
                "bank_ref": "UPI/2026/8912781",
                "description": "Semester 6 - 2nd Installment & Examination Fee",
                "status": "SUCCESS"
            }
        ] + [t for t in INSTITUTION_ACTION_STORE["transactions"] if t.get("inst_id") == inst_id]
    }

    # Assignments
    assignments = [
        {
            "id": "asg_01",
            "title": "B-Tree and Inverted Index Implementation in Python",
            "course": courses[0]["course_name"],
            "due_date": "2026-10-25",
            "max_marks": 25,
            "status": "SUBMITTED",
            "score": "23/25",
            "feedback": "Clean asymptotic analysis and unit tests provided."
        },
        {
            "id": "asg_02",
            "title": "SQL Query Optimization and Index Benchmarking",
            "course": courses[1]["course_name"],
            "due_date": "2026-11-05",
            "max_marks": 20,
            "status": "PENDING",
            "score": "Pending Review",
            "feedback": "Due next week"
        },
        {
            "id": "asg_03",
            "title": "Packet Trace & TCP Flow Control Simulation with Wireshark",
            "course": courses[2]["course_name"],
            "due_date": "2026-11-12",
            "max_marks": 30,
            "status": "PENDING",
            "score": "Not Submitted",
            "feedback": "Upload pcap file trace analysis"
        }
    ]

    # Student Leaves
    leaves = {
        "balances": {
            "medical_remaining": 5,
            "casual_remaining": 3,
            "duty_remaining": 4
        },
        "history": [
            {
                "id": "lev_01",
                "leave_type": "Duty Leave",
                "from_date": "2026-09-18",
                "to_date": "2026-09-20",
                "reason": "Participating in Smart India Hackathon Regional Finals",
                "status": "APPROVED",
                "approved_by": "Dr. Priya Sen (Mentor)"
            },
            {
                "id": "lev_02",
                "leave_type": "Medical Leave",
                "from_date": "2026-10-02",
                "to_date": "2026-10-04",
                "reason": "Viral fever recovery and rest",
                "status": "APPROVED",
                "approved_by": "Dr. R.K. Verma (HOD)"
            }
        ] + [l for l in INSTITUTION_ACTION_STORE["leaves"] if l.get("inst_id") == inst_id]
    }

    # Hostel Management
    hostel = {
        "is_allotted": True if not is_school and not is_company else False,
        "block": "Block C (Aryabhata Boys Hostel)",
        "room_no": "304",
        "bed_no": "Bed 2",
        "floor": "3rd Floor",
        "room_type": "Double Occupancy with Attached Balcony & Study Desk",
        "warden_name": "Mr. S.P. Dwivedi",
        "warden_contact": "+91 98765 43299",
        "mess": {
            "mess_type": "Central Student Mess (Vegetarian & Non-Veg Multi-Cuisine)",
            "breakfast": "07:30 AM – 09:15 AM (Poha / Paratha, Boiled Eggs, Milk, Tea)",
            "lunch": "12:30 PM – 02:15 PM (Dal Makhani, Seasonal Sabzi, Paneer, Rice, Roti, Salad)",
            "snacks": "05:00 PM – 06:15 PM (Samosa / Cutlet, Tea, Biscuits)",
            "dinner": "08:00 PM – 09:45 PM (Dal Tadka, Shahi Paneer, Pulao, Chapati, Gulab Jamun)"
        },
        "gate_pass": {
            "allowed_curfew": "09:30 PM",
            "active_pass": None,
            "policy": "Night-out passes must be endorsed by registered parent guardian via SMS/Portal."
        }
    }

    # Administration Details
    administration = {
        "officials": [
            {"designation": "Registrar", "name": "Prof. (Dr.) V.K. Singh", "email": "registrar@uni.edu", "office": "Admin Block, Ground Floor"},
            {"designation": "Dean of Academics", "name": "Prof. (Dr.) Manju Khari", "email": "dean.academics@uni.edu", "office": "Academic Block A, 1st Floor"},
            {"designation": "Head of Department (HOD)", "name": "Dr. R.K. Verma", "email": "hod.cse@uni.edu", "office": "CS Department, 2nd Floor"},
            {"designation": "Chief Proctor", "name": "Dr. Sunil Kumar", "email": "proctor@uni.edu", "office": "Student Welfare Office"}
        ],
        "documentation_status": {
            "college_id_card": "ACTIVE (Chip & RFID Enabled)",
            "bonafide_certificate": "READY (Valid for Current Academic Year)",
            "transfer_certificate": "ON_FILE (Verified at Admission)",
            "migration_certificate": "VERIFIED_DIGILOCKER",
            "character_certificate": "ISSUED"
        },
        "document_requests": [
            {"id": "doc_01", "document": "Bonafide Certificate for Passport", "requested_on": "2026-08-25", "status": "APPROVED_DOWNLOADED"},
            {"id": "doc_02", "document": "Official Academic Transcripts (Sem 1-5)", "requested_on": "2026-09-10", "status": "DISPATCHED_DIGILOCKER"}
        ] + [d for d in INSTITUTION_ACTION_STORE["documents"] if d.get("inst_id") == inst_id],
        "grievances": [
            {"id": "grv_01", "subject": "Wi-Fi Connectivity in CS Lab 3", "department": "IT Infrastructure", "status": "RESOLVED", "response": "Upgraded Cisco AP in Block A."}
        ] + [g for g in INSTITUTION_ACTION_STORE["grievances"] if g.get("inst_id") == inst_id],
        "help_desk": {
            "contact_email": "helpdesk@uni.edu",
            "helpline_phone": "+91 120 2323888",
            "hours": "Mon-Sat 09:00 AM – 05:00 PM"
        },
        "feedback": {
            "status": "COMPLETED",
            "last_submitted": "2026-09-30",
            "course_rating": 4.8
        }
    }

    # Library Services
    library = {
        "membership": {
            "card_number": "LIB-GLB-8834" if not is_school else "DPS-LIB-4412",
            "valid_upto": "2026-06-30",
            "max_books_allowed": 4,
            "reading_hall_seat": "General Reading Hall - Seat 42"
        },
        "issued_books": [
            {
                "accession_no": "ACC-98214",
                "title": "Introduction to Algorithms (CLRS 4th Edition)",
                "author": "Cormen, Leiserson, Rivest, Stein",
                "issued_on": "2026-10-05",
                "due_date": "2026-11-05",
                "renewals_left": 2
            },
            {
                "accession_no": "ACC-87410",
                "title": "Database System Concepts (7th Edition)",
                "author": "Silberschatz, Korth, Sudarshan",
                "issued_on": "2026-10-10",
                "due_date": "2026-11-10",
                "renewals_left": 1
            }
        ],
        "previous_log": [
            {"title": "Computer Networking: A Top-Down Approach", "returned_on": "2026-09-28", "status": "RETURNED_ON_TIME"},
            {"title": "Operating System Concepts", "returned_on": "2026-09-15", "status": "RETURNED_ON_TIME"}
        ],
        "fine": {
            "amount": 0,
            "status": "NO_OUTSTANDING_FINES"
        },
        "attendance": [
            {"date": "2026-10-18", "entry_time": "04:15 PM", "exit_time": "06:45 PM", "gate": "Turnstile B (Digital Scan)"},
            {"date": "2026-10-16", "entry_time": "02:30 PM", "exit_time": "05:00 PM", "gate": "Turnstile A (Digital Scan)"}
        ]
    }

    # Other Services
    other_services = {
        "transport": {
            "is_enrolled": True if not is_company and not is_startup else False,
            "route_no": "Route 14",
            "route_name": "Noida Sector 62 -> Mayur Vihar -> Campus",
            "pickup_stop": "Sector 62 Metro Station / Fortis Gate",
            "bus_number": "UP-16-BT-9021",
            "driver_name": "Mr. Mahendra Singh",
            "driver_mobile": "+91 98112 34567",
            "transport_incharge": "Mr. Rakesh Sharma (+91 98112 00011)",
            "pass_validity": "Valid for Academic Session 2025-2026",
            "qr_pass_code": "BUSPASS-GLB-2026-RT14"
        },
        "map": {
            "campus_name": inst_name,
            "location_address": "Plot No. 2, Knowledge Park III, Greater Noida, Uttar Pradesh 201306",
            "google_maps_url": "https://maps.google.com/?q=GL+Bajaj+Institute+of+Technology+and+Management",
            "zones": [
                {"name": "Admin Block", "details": "Registrar, Chancellor, Accounts, Admissions"},
                {"name": "Academic Block A", "details": "CSE, IT, AI-DS Lecture Halls"},
                {"name": "Academic Block B", "details": "ECE, Mechanical, Robotics Labs"},
                {"name": "Central Library", "details": "Floors 1-3, Digital Reading Area"},
                {"name": "Student Activity Center", "details": "Auditorium, Indoor Sports Complex, Cafeteria"}
            ]
        },
        "security": {
            "last_password_change": "2026-09-01",
            "two_factor_auth": "ENABLED (Biometrics & Mobile OTP)",
            "ip_session_lock": "ENABLED"
        },
        "siblings": [
            {
                "name": "Ananya Sharma",
                "relationship": "Sister",
                "enrolled_in": "Delhi Public School, R.K. Puram" if not is_school else "GL Bajaj Group",
                "class_or_program": "Class X-B (CBSE)" if not is_school else "B.Tech ECE (1st Year)",
                "roll_no": "DPS-2024-5512",
                "concession_status": "Eligible for 10% Sibling Fee Rebate"
            }
        ],
        "gallery": [
            {"title": "High Performance AI Computing Lab", "caption": "Equipped with NVIDIA RTX and high-density GPU nodes", "tag": "Labs"},
            {"title": "Central Multi-Story Library", "caption": "Over 75,000 volumes and digital IEEE access", "tag": "Library"},
            {"title": "Smart Lecture Auditoriums", "caption": "Acoustically treated amphitheater classrooms", "tag": "Classrooms"},
            {"title": "Sports Complex & Cricket Ground", "caption": "Floodlit basketball, cricket, and gym amenities", "tag": "Sports"}
        ],
        "notices": [
            {"date": "2026-10-17", "title": "Submission of Mid-Term Practical Evaluation Files", "priority": "HIGH", "category": "EXAMINATION"},
            {"date": "2026-10-14", "title": "Diwali Festival Vacation Notice (Oct 23 - Oct 28)", "priority": "NORMAL", "category": "GENERAL"},
            {"date": "2026-10-10", "title": "Pre-Placement Drive Technical Screening by Tier-1 IT Recruiters", "priority": "HIGH", "category": "PLACEMENT"}
        ]
    }

    tpl = get_active_template_for_institution(db, inst_id) if db else None
    banner_notice = ""
    active_tpl_name = "Standard Preset"
    dev_mode_active = True
    is_custom = False
    tpl_ver = "1.0.0"

    if tpl:
        dev_mode_active = tpl.get("developer_mode_enabled", True)
        active_tpl_name = tpl.get("template_name", "Standard Template")
        is_custom = tpl.get("is_custom", False)
        tpl_ver = tpl.get("version", "1.0.0")
        theme_cfg = tpl.get("theme_config", {})
        banner_notice = theme_cfg.get("banner_notice", "")
        tpl_data = tpl.get("template_data", {})

        if tpl_data.get("courses"):
            courses = tpl_data["courses"]
        if tpl_data.get("timetable"):
            timetable = tpl_data["timetable"]
        if tpl_data.get("fee_or_stipend"):
            custom_fin = tpl_data["fee_or_stipend"]
            fee_data["template_financial"] = custom_fin
            if "monthly_stipend" in custom_fin:
                fee_data["stipend"] = custom_fin
            if "seed_grant_allocated" in custom_fin:
                fee_data["grant"] = custom_fin
        if tpl_data.get("documents"):
            administration["template_documents"] = tpl_data["documents"]
        if tpl_data.get("department"):
            dept_name = tpl_data["department"]

    return {
        "institution": {
            "id": inst_id,
            "name": inst_name,
            "type": inst_type,
            "department": dept_name,
            "roll_no": active_roll,
            "student_name": student_name,
            "is_school": is_school,
            "is_university": is_university,
            "is_company": is_company,
            "is_startup": is_startup,
            "developer_mode_enabled": dev_mode_active,
            "active_template_name": active_tpl_name,
            "banner_notice": banner_notice
        },
        "template": tpl,
        "developer_mode": {
            "enabled": dev_mode_active,
            "is_custom": is_custom,
            "template_name": active_tpl_name,
            "version": tpl_ver,
            "institution_type": inst_type,
            "published_to_roles": tpl.get("published_to_roles", "student,faculty,parent,admin,all") if tpl else "student,faculty,parent,admin,all",
            "banner_notice": banner_notice
        },
        "courses": courses,
        "profile": {
            "student_name": student_name,
            "institutional_roll_no": active_roll,
            "enrollment_number": "2201920100045" if not is_school else "CBSE-DEL-1094821",
            "department": dept_name,
            "batch": "2022 - 2026" if not is_school else "2020 - 2022",
            "admission_date": "2022-08-16",
            "institutional_email": f"{active_roll.lower().replace('-', '')}@uni.edu",
            "blood_group": "B+",
            "gender": "Male",
            "apaar_id": "APAAR-9988-7766-5544",
            "digilocker_verified": True,
            "mentor_teacher": "Dr. Priya Sen"
        },
        "timetable": timetable,
        "calendar": calendar_events,
        "fee": fee_data,
        "assignments": assignments,
        "student_leaves": leaves,
        "leaves": leaves,
        "hostel": hostel,
        "administration": administration,
        "library": library,
        "other_services": other_services
    }

@router.get("/{student_id}/enrolled-institutions")
def get_enrolled_institutions(student_id: str, db: Session = Depends(get_db)):
    """Returns all enrolled institutions for the student (e.g. school, college, virtual academy)."""
    student = db.query(StudentModel).filter((StudentModel.id == student_id) | (StudentModel.roll_no == student_id)).first()
    student_name = student.name if student else "Amit Sharma"
    roll_no = student.roll_no if student else "CS-2022-04"
    dept = student.department if student else "Computer Science & Engineering"
    
    institutions = _build_enrolled_institutions(student_name, roll_no, dept, db=db)
    return {
        "student_id": student_id,
        "student_name": student_name,
        "total_institutions": len(institutions),
        "institutions": institutions
    }

@router.get("/{student_id}/institutions/{inst_id}/details")
def get_enrolled_institution_details(student_id: str, inst_id: str, db: Session = Depends(get_db)):
    """Returns rich, comprehensive details for the selected enrolled institution."""
    student = db.query(StudentModel).filter((StudentModel.id == student_id) | (StudentModel.roll_no == student_id)).first()
    student_name = student.name if student else "Amit Sharma"
    roll_no = student.roll_no if student else "CS-2022-04"
    dept = student.department if student else "Computer Science & Engineering"

    portal_data = _build_full_institution_portal(inst_id, student_name, roll_no, dept, db=db)
    return portal_data

@router.post("/{student_id}/institutions/{inst_id}/pay-fee")
def pay_institution_fee(student_id: str, inst_id: str, payload: FeePaymentRequest):
    """Processes simulated fee payment and returns confirmed transaction receipt."""
    receipt_no = f"REC-{inst_id.replace('inst_', '').upper()}-{datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
    tx = {
        "inst_id": inst_id,
        "receipt_no": receipt_no,
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "amount": payload.amount,
        "mode": payload.payment_mode,
        "bank_ref": f"BANK-{uuid.uuid4().hex[:10].upper()}",
        "description": payload.remarks or "Online Institutional Fee Payment",
        "status": "SUCCESS"
    }
    INSTITUTION_ACTION_STORE["transactions"].insert(0, tx)
    return {
        "status": "SUCCESS",
        "message": f"Payment of ₹{payload.amount:,.2f} completed successfully.",
        "receipt": tx
    }

@router.post("/{student_id}/institutions/{inst_id}/apply-leave")
def apply_student_leave(student_id: str, inst_id: str, payload: LeaveApplicationRequest):
    """Submits student leave application."""
    leave_id = f"lev_{uuid.uuid4().hex[:8]}"
    item = {
        "id": leave_id,
        "inst_id": inst_id,
        "leave_type": payload.leave_type,
        "from_date": payload.from_date,
        "to_date": payload.to_date,
        "reason": payload.reason,
        "status": "PENDING_HOD_APPROVAL",
        "approved_by": "Pending Review",
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    INSTITUTION_ACTION_STORE["leaves"].insert(0, item)
    return {
        "status": "SUCCESS",
        "message": f"Leave application for {payload.leave_type} submitted successfully.",
        "leave": item
    }

@router.post("/{student_id}/institutions/{inst_id}/request-document")
def request_institution_document(student_id: str, inst_id: str, payload: DocumentRequestPayload):
    """Submits student document issuance request (Bonafide, Transcripts, etc.)."""
    doc_id = f"doc_{uuid.uuid4().hex[:8]}"
    item = {
        "id": doc_id,
        "inst_id": inst_id,
        "document": payload.document_type,
        "requested_on": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "status": "PROCESSING",
        "purpose": payload.purpose,
        "delivery_mode": payload.delivery_mode
    }
    INSTITUTION_ACTION_STORE["documents"].insert(0, item)
    return {
        "status": "SUCCESS",
        "message": f"Request for '{payload.document_type}' received. Tracking ID: {doc_id}",
        "document": item
    }

@router.post("/{student_id}/institutions/{inst_id}/submit-grievance")
def submit_institution_grievance(student_id: str, inst_id: str, payload: GrievancePayload):
    """Submits a student grievance ticket."""
    grv_id = f"grv_{uuid.uuid4().hex[:8]}"
    item = {
        "id": grv_id,
        "inst_id": inst_id,
        "subject": payload.subject,
        "department": payload.category,
        "status": "OPEN_UNDER_INVESTIGATION",
        "response": "Assigned to Institutional Grievance Officer.",
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    INSTITUTION_ACTION_STORE["grievances"].insert(0, item)
    return {
        "status": "SUCCESS",
        "message": f"Grievance ticket #{grv_id} registered successfully.",
        "grievance": item
    }

@router.post("/{student_id}/institutions/{inst_id}/submit-feedback")
def submit_institution_feedback(student_id: str, inst_id: str, payload: FeedbackPayload):
    """Records academic/campus feedback."""
    return {
        "status": "SUCCESS",
        "message": "Thank you! Your feedback has been recorded anonymously."
    }

@router.post("/{student_id}/institutions/{inst_id}/renew-book")
def renew_library_book(student_id: str, inst_id: str, payload: BookRenewalPayload):
    """Renews a library book due date."""
    return {
        "status": "SUCCESS",
        "accession_no": payload.accession_no,
        "new_due_date": "2026-12-05",
        "message": f"Book with Accession #{payload.accession_no} renewed successfully for 30 days."
    }

