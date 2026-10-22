"""
INSTITUTIONAL ERP BACKEND SERVICE
=================================
Comprehensive 7-module Institutional Academic ERP Service for GL Bajaj Institute of Technology & Management.
Simulates realistic, fully structured institutional ERP records adhering to AKTU / AICTE standards.

Modules:
1. Academic (Timetable, Calendar, Course Plan, Assignments, Attendance, Leaves, Mentor Counselling, Class Teacher)
2. Exam (Results, Datesheet, Exam Registration, Subject Registration)
3. Fees (Structure, Dues, Payments, Balance, Registration Fee, Discount/Waiver, Scholarship, Adjustment, Relaxation, Refund, Pocket Money, Cheque Bounce, Head-wise, NEFT/RTGS)
4. Hostel (My Room, Room Status, Hostel Leave, Previous Registration, Mess Menu)
5. Administration (Official Detail, Document Status, Document Request, Grievance, Helpdesk, Feedback)
6. Library (Membership, Issued Books, Log, Fines, Attendance)
7. Other Services (Transport, Training & Placement, Sibling Info, Gallery, Notices, Diary, Homework, PTM, No-Dues, Seating Plan)
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, date


class InstitutionalERPService:
    """
    Central Institutional ERP service providing mock-backed yet hyper-realistic,
    high-fidelity data for higher education enterprise portals.
    """

    # Common Institutional Profile Metadata
    INSTITUTE_METADATA = {
        "institution_name": "GL Bajaj Institute of Technology and Management",
        "institution_code": "GLBITM-192",
        "affiliation": "Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow",
        "accreditation": "NAAC A+ Grade | NBA Accredited CSE & ECE | AICTE Approved",
        "campus_location": "Plot No. 2, Knowledge Park III, Greater Noida, UP - 201306",
        "academic_session": "2025-2026 (Even Semester)",
        "current_term": "Semester VI (Spring 2026)"
    }

    # =========================================================================
    # MODULE 1: ACADEMIC
    # =========================================================================

    @classmethod
    def get_timetable(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Weekly timetable with days, periods, subjects, teachers, and rooms."""
        schedule = {
            "Monday": [
                {"period": 1, "time": "09:00 - 10:00", "subject_code": "KCS-601", "subject": "Software Engineering", "faculty": "Prof. Priya Srivastava", "room": "B-302", "type": "Lecture"},
                {"period": 2, "time": "10:00 - 11:00", "subject_code": "KCS-602", "subject": "Compiler Design", "faculty": "Dr. Alok Ranjan", "room": "B-302", "type": "Lecture"},
                {"period": "Break", "time": "11:00 - 11:15", "subject": "Tea / Recess", "faculty": "-", "room": "Campus Cafeteria", "type": "Break"},
                {"period": 3, "time": "11:15 - 12:15", "subject_code": "KCS-603", "subject": "Computer Networks", "faculty": "Prof. Rajesh Verma", "room": "B-302", "type": "Lecture"},
                {"period": 4, "time": "12:15 - 01:15", "subject_code": "KOE-068", "subject": "Embedded Systems (Open Elective)", "faculty": "Dr. Neha Gupta", "room": "LH-1", "type": "Lecture"},
                {"period": "Lunch", "time": "01:15 - 02:00", "subject": "Lunch Break", "faculty": "-", "room": "Central Mess", "type": "Break"},
                {"period": "5-6", "time": "02:00 - 04:00", "subject_code": "KCS-651", "subject": "Compiler Design Lab (Batch 1)", "faculty": "Dr. Alok Ranjan & Er. Vivek", "room": "Computing Lab-4", "type": "Practical"}
            ],
            "Tuesday": [
                {"period": 1, "time": "09:00 - 10:00", "subject_code": "KCS-603", "subject": "Computer Networks", "faculty": "Prof. Rajesh Verma", "room": "B-302", "type": "Lecture"},
                {"period": 2, "time": "10:00 - 11:00", "subject_code": "KCS-601", "subject": "Software Engineering", "faculty": "Prof. Priya Srivastava", "room": "B-302", "type": "Lecture"},
                {"period": "Break", "time": "11:00 - 11:15", "subject": "Tea Break", "faculty": "-", "room": "-", "type": "Break"},
                {"period": 3, "time": "11:15 - 12:15", "subject_code": "KCS-061", "subject": "Big Data Analytics (Dept Elective)", "faculty": "Dr. Manish Kumar", "room": "B-302", "type": "Lecture"},
                {"period": 4, "time": "12:15 - 01:15", "subject_code": "KOE-068", "subject": "Embedded Systems", "faculty": "Dr. Neha Gupta", "room": "LH-1", "type": "Lecture"},
                {"period": "Lunch", "time": "01:15 - 02:00", "subject": "Lunch Break", "faculty": "-", "room": "-", "type": "Break"},
                {"period": "5-6", "time": "02:00 - 04:00", "subject_code": "KCS-652", "subject": "Software Engineering Lab", "faculty": "Prof. Priya Srivastava", "room": "Software Eng Lab-2", "type": "Practical"}
            ],
            "Wednesday": [
                {"period": 1, "time": "09:00 - 10:00", "subject_code": "KCS-602", "subject": "Compiler Design", "faculty": "Dr. Alok Ranjan", "room": "B-302", "type": "Lecture"},
                {"period": 2, "time": "10:00 - 11:00", "subject_code": "KCS-603", "subject": "Computer Networks", "faculty": "Prof. Rajesh Verma", "room": "B-302", "type": "Lecture"},
                {"period": "Break", "time": "11:00 - 11:15", "subject": "Tea Break", "faculty": "-", "room": "-", "type": "Break"},
                {"period": 3, "time": "11:15 - 12:15", "subject_code": "KCS-601", "subject": "Software Engineering", "faculty": "Prof. Priya Srivastava", "room": "B-302", "type": "Tutorial"},
                {"period": 4, "time": "12:15 - 01:15", "subject_code": "KCS-061", "subject": "Big Data Analytics", "faculty": "Dr. Manish Kumar", "room": "B-302", "type": "Lecture"},
                {"period": "Lunch", "time": "01:15 - 02:00", "subject": "Lunch Break", "faculty": "-", "room": "-", "type": "Break"},
                {"period": "5-6", "time": "02:00 - 04:00", "subject_code": "KNC-601", "subject": "Constitution of India / Aptitude Seminar", "faculty": "Dr. R. K. Sharma", "room": "Auditorium Hall 2", "type": "Seminar"}
            ],
            "Thursday": [
                {"period": 1, "time": "09:00 - 10:00", "subject_code": "KOE-068", "subject": "Embedded Systems", "faculty": "Dr. Neha Gupta", "room": "LH-1", "type": "Lecture"},
                {"period": 2, "time": "10:00 - 11:00", "subject_code": "KCS-602", "subject": "Compiler Design", "faculty": "Dr. Alok Ranjan", "room": "B-302", "type": "Lecture"},
                {"period": "Break", "time": "11:00 - 11:15", "subject": "Tea Break", "faculty": "-", "room": "-", "type": "Break"},
                {"period": 3, "time": "11:15 - 12:15", "subject_code": "KCS-603", "subject": "Computer Networks", "faculty": "Prof. Rajesh Verma", "room": "B-302", "type": "Tutorial"},
                {"period": 4, "time": "12:15 - 01:15", "subject_code": "KCS-601", "subject": "Software Engineering", "faculty": "Prof. Priya Srivastava", "room": "B-302", "type": "Lecture"},
                {"period": "Lunch", "time": "01:15 - 02:00", "subject": "Lunch Break", "faculty": "-", "room": "-", "type": "Break"},
                {"period": "5-6", "time": "02:00 - 04:00", "subject_code": "KCS-653", "subject": "Web Tech / Cloud Computing Project Lab", "faculty": "Er. Sneha Singh", "room": "Cloud Lab-1", "type": "Practical"}
            ],
            "Friday": [
                {"period": 1, "time": "09:00 - 10:00", "subject_code": "KCS-061", "subject": "Big Data Analytics", "faculty": "Dr. Manish Kumar", "room": "B-302", "type": "Lecture"},
                {"period": 2, "time": "10:00 - 11:00", "subject_code": "KCS-602", "subject": "Compiler Design", "faculty": "Dr. Alok Ranjan", "room": "B-302", "type": "Tutorial"},
                {"period": "Break", "time": "11:00 - 11:15", "subject": "Tea Break", "faculty": "-", "room": "-", "type": "Break"},
                {"period": 3, "time": "11:15 - 12:15", "subject_code": "KOE-068", "subject": "Embedded Systems", "faculty": "Dr. Neha Gupta", "room": "LH-1", "type": "Tutorial"},
                {"period": 4, "time": "12:15 - 01:15", "subject_code": "KCS-603", "subject": "Computer Networks", "faculty": "Prof. Rajesh Verma", "room": "B-302", "type": "Lecture"},
                {"period": "Lunch", "time": "01:15 - 02:00", "subject": "Lunch Break", "faculty": "-", "room": "-", "type": "Break"},
                {"period": "5-6", "time": "02:00 - 04:00", "subject_code": "TRAIN-06", "subject": "Corporate Placement & Soft Skills Training", "faculty": "CRPC Team", "room": "Seminar Hall-1", "type": "Training"}
            ],
            "Saturday": [
                {"period": 1, "time": "09:00 - 11:00", "subject_code": "CLUB-CSE", "subject": "Open Source Club / Competitive Coding", "faculty": "Coding Society Mentors", "room": "Innovation Center", "type": "Activity"},
                {"period": 2, "time": "11:15 - 01:15", "subject_code": "PROJECT-VI", "subject": "Mini Project Review & Mentorship", "faculty": "Dr. Alok Ranjan", "room": "B-214", "type": "Project"}
            ]
        }
        return {
            "status": "success",
            "student_id": student_id,
            "student_name": "Amit Sharma",
            "semester": "6th Semester",
            "section": "CSE-A",
            "academic_year": "2025-2026",
            "effective_from": "2026-01-15",
            "working_hours": "09:00 AM - 04:00 PM",
            "timetable": schedule,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_calendar(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Academic calendar events (exams, holidays, semester dates)."""
        events = [
            {"date": "2026-01-15", "title": "Semester VI Classes Commence", "type": "Academic", "category": "Milestone", "description": "Start of regular lecture sessions for Even Semester 2025-26."},
            {"date": "2026-01-26", "title": "Republic Day", "type": "Holiday", "category": "Gazetted", "description": "National Holiday with flag hoisting on Central Ground."},
            {"date": "2026-02-23 to 2026-02-28", "title": "Sessional Exam I (Mid-Term)", "type": "Examination", "category": "Internal", "description": "Mandatory 30-mark mid-term evaluation across all enrolled subjects."},
            {"date": "2026-03-13 to 2026-03-16", "title": "Holi Break", "type": "Holiday", "category": "Gazetted", "description": "Institutional vacation for Holi festivities."},
            {"date": "2026-03-27 to 2026-03-29", "title": "Utkarsh 2026 - Annual Fest", "type": "Cultural/Technical", "category": "Flagship Event", "description": "Inter-college cultural and technocrat symposium."},
            {"date": "2026-04-14", "title": "Dr. B.R. Ambedkar Jayanti", "type": "Holiday", "category": "Gazetted", "description": "National Gazetted Holiday."},
            {"date": "2026-04-20 to 2026-04-26", "title": "Pre-University Test (PUT / Sessional II)", "type": "Examination", "category": "Internal", "description": "Complete syllabus pre-university simulation examination."},
            {"date": "2026-05-02 to 2026-05-08", "title": "Remedial & Doubt Clearing Sessions", "type": "Academic", "category": "Support", "description": "Special guidance classes for students requiring extra focus."},
            {"date": "2026-05-12 to 2026-05-18", "title": "AKTU External Practical Examinations", "type": "Examination", "category": "University", "description": "External viva and lab evaluations appointed by AKTU."},
            {"date": "2026-05-25 to 2026-06-15", "title": "AKTU End Semester Theory Examinations", "type": "Examination", "category": "University", "description": "Even Semester End-Term Board Examinations."},
            {"date": "2026-06-20 to 2026-07-31", "title": "Mandatory Summer Internship Window", "type": "Internship", "category": "Industrial Training", "description": "6-8 weeks industrial immersion as prescribed by AICTE curriculum."}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "academic_year": "2025-2026",
            "semester": "Even Semester (6th Sem)",
            "total_working_days": 104,
            "holidays_count": 18,
            "events": events,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_course_plan(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Course syllabi with units, topics, planned lectures, and completion %."""
        courses = [
            {
                "course_code": "KCS-601",
                "course_title": "Software Engineering",
                "credits": 4,
                "faculty": "Prof. Priya Srivastava",
                "completion_percentage": 82,
                "total_lectures_planned": 45,
                "lectures_delivered": 37,
                "units": [
                    {"unit_no": 1, "unit_title": "Introduction & Software Process Models", "topics": "SDLC, Waterfall, Spiral, Agile Scrum, Sprint Planning", "status": "Completed", "hours": 9},
                    {"unit_no": 2, "unit_title": "Software Requirements Engineering", "topics": "SRS Documentation, Functional & Non-Functional, Use Case Modeling", "status": "Completed", "hours": 9},
                    {"unit_no": 3, "unit_title": "Software Design Principles & UML", "topics": "Architectural Design, Class/Sequence Diagrams, Refactoring", "status": "Completed", "hours": 10},
                    {"unit_no": 4, "unit_title": "Software Testing & Quality Assurance", "topics": "Unit Testing, Black/White Box, CI/CD, SonarQube, ISO 9001", "status": "In Progress (75%)", "hours": 9},
                    {"unit_no": 5, "unit_title": "Software Maintenance & Estimation", "topics": "COCOMO Model, Function Point Analysis, Reverse Engineering", "status": "Pending", "hours": 8}
                ]
            },
            {
                "course_code": "KCS-602",
                "course_title": "Compiler Design",
                "credits": 4,
                "faculty": "Dr. Alok Ranjan",
                "completion_percentage": 78,
                "total_lectures_planned": 44,
                "lectures_delivered": 34,
                "units": [
                    {"unit_no": 1, "unit_title": "Introduction to Compilers & Lexical Analysis", "topics": "Phases of Compiler, Lexical Tokens, Flex/Lex, DFA Minimization", "status": "Completed", "hours": 8},
                    {"unit_no": 2, "unit_title": "Syntax Analysis & Parsing", "topics": "CFG, LL(1), Shift-Reduce, LR(0), SLR(1), LALR, Yacc", "status": "Completed", "hours": 11},
                    {"unit_no": 3, "unit_title": "Syntax-Directed Translation & Semantic Analysis", "topics": "SDD, S-Attributed, L-Attributed, Type Checking", "status": "Completed", "hours": 8},
                    {"unit_no": 4, "unit_title": "Intermediate Code Generation & Symbol Tables", "topics": "Three-Address Code, Quadruples, Triples, Hash Tables", "status": "In Progress (60%)", "hours": 9},
                    {"unit_no": 5, "unit_title": "Code Optimization & Code Generation", "topics": "Basic Blocks, Flow Graphs, DAG, Register Allocation, Peephole", "status": "Pending", "hours": 8}
                ]
            },
            {
                "course_code": "KCS-603",
                "course_title": "Computer Networks",
                "credits": 4,
                "faculty": "Prof. Rajesh Verma",
                "completion_percentage": 85,
                "total_lectures_planned": 46,
                "lectures_delivered": 39,
                "units": [
                    {"unit_no": 1, "unit_title": "Data Communication & Physical Layer", "topics": "OSI & TCP/IP Reference Models, Transmission Media, Switching", "status": "Completed", "hours": 8},
                    {"unit_no": 2, "unit_title": "Data Link Layer & MAC Protocols", "topics": "Framing, Error Detection (CRC), Sliding Window, CSMA/CD, Ethernet", "status": "Completed", "hours": 10},
                    {"unit_no": 3, "unit_title": "Network Layer & IP Addressing", "topics": "IPv4/IPv6, Subnetting, CIDR, Distance Vector, Link State, BGP", "status": "Completed", "hours": 11},
                    {"unit_no": 4, "unit_title": "Transport Layer Protocols", "topics": "TCP 3-Way Handshake, UDP, Congestion Control (Reno/Vegas), Flow Control", "status": "Completed", "hours": 9},
                    {"unit_no": 5, "unit_title": "Application Layer & Network Security", "topics": "DNS, HTTP/2, SMTP, TLS/SSL, Symmetric vs Asymmetric Ciphers", "status": "In Progress (50%)", "hours": 8}
                ]
            },
            {
                "course_code": "KOE-068",
                "course_title": "Embedded Systems",
                "credits": 3,
                "faculty": "Dr. Neha Gupta",
                "completion_percentage": 72,
                "total_lectures_planned": 38,
                "lectures_delivered": 27,
                "units": [
                    {"unit_no": 1, "unit_title": "Introduction to Embedded Systems", "topics": "Microcontrollers vs Microprocessors, ARM Cortex-M architecture", "status": "Completed", "hours": 7},
                    {"unit_no": 2, "unit_title": "Peripherals & Interfacing", "topics": "GPIO, Timers, PWM, ADC/DAC, I2C, SPI, UART communication", "status": "Completed", "hours": 8},
                    {"unit_no": 3, "unit_title": "RTOS & Task Scheduling", "topics": "FreeRTOS Kernel, Semaphores, Mutex, Priority Inversion", "status": "In Progress (70%)", "hours": 9},
                    {"unit_no": 4, "unit_title": "Embedded C & Optimization", "topics": "Memory footprint minimization, low power sleep modes", "status": "Pending", "hours": 7},
                    {"unit_no": 5, "unit_title": "IoT Edge Applications", "topics": "Sensor interfacing with MQTT & AWS IoT Core", "status": "Pending", "hours": 7}
                ]
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "overall_curriculum_progress": "79.3%",
            "courses_count": len(courses),
            "courses": courses,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_assignments(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """List of assignments with due dates, status, and marks."""
        assignments = [
            {
                "id": "ASG-602-01",
                "course_code": "KCS-602",
                "subject": "Compiler Design",
                "title": "Assignment 1: Construction of LALR(1) Parsing Table",
                "description": "Construct parsing tables and handle shift/reduce conflicts for arithmetic grammar.",
                "assigned_date": "2026-02-05",
                "due_date": "2026-02-20",
                "submitted_date": "2026-02-18",
                "status": "Evaluated",
                "max_marks": 20,
                "marks_obtained": 19,
                "feedback": "Flawless canonical collection representation. Exceptional clarity on lookahead propagation.",
                "graded_by": "Dr. Alok Ranjan"
            },
            {
                "id": "ASG-601-01",
                "course_code": "KCS-601",
                "subject": "Software Engineering",
                "title": "Assignment 2: IEEE 830 Standard SRS for Smart Healthcare ERP",
                "description": "Formulate functional requirements, UML use-case models, and traceability matrix.",
                "assigned_date": "2026-02-15",
                "due_date": "2026-03-05",
                "submitted_date": "2026-03-03",
                "status": "Evaluated",
                "max_marks": 20,
                "marks_obtained": 18,
                "feedback": "Comprehensive non-functional requirements. Security boundaries clearly specified.",
                "graded_by": "Prof. Priya Srivastava"
            },
            {
                "id": "ASG-603-01",
                "course_code": "KCS-603",
                "subject": "Computer Networks",
                "title": "Assignment 3: Subnet Planning & Dijkstra Shortest Path Script",
                "description": "Python implementation of Dijkstra link-state routing and VLSM subnet design for 500 hosts.",
                "assigned_date": "2026-03-08",
                "due_date": "2026-03-24",
                "submitted_date": "2026-03-22",
                "status": "Evaluated",
                "max_marks": 20,
                "marks_obtained": 20,
                "feedback": "Perfect script execution and unit test cases. Highest score in section.",
                "graded_by": "Prof. Rajesh Verma"
            },
            {
                "id": "ASG-602-02",
                "course_code": "KCS-602",
                "subject": "Compiler Design",
                "title": "Assignment 4: Code Optimization via DAG Representation",
                "description": "Construct Directed Acyclic Graphs for basic blocks and eliminate common subexpressions.",
                "assigned_date": "2026-04-02",
                "due_date": "2026-04-26",
                "submitted_date": "2026-04-20",
                "status": "Submitted - Under Review",
                "max_marks": 20,
                "marks_obtained": None,
                "feedback": "Pending faculty grading.",
                "graded_by": "Dr. Alok Ranjan"
            },
            {
                "id": "ASG-601-02",
                "course_code": "KCS-601",
                "subject": "Software Engineering",
                "title": "Assignment 5: Automated CI/CD Pipeline & GitHub Actions",
                "description": "Establish a GitHub Actions workflow with automated unit tests and code coverage reports.",
                "assigned_date": "2026-04-10",
                "due_date": "2026-05-02",
                "submitted_date": None,
                "status": "In Progress",
                "max_marks": 20,
                "marks_obtained": None,
                "feedback": "Awaiting submission.",
                "graded_by": "Prof. Priya Srivastava"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "total_assignments": len(assignments),
            "submitted_count": 4,
            "pending_count": 1,
            "average_score": "95.0%",
            "assignments": assignments,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_attendance(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Subject-wise attendance with percentage, held/attended count, and eligibility."""
        subjects = [
            {"subject_code": "KCS-601", "subject": "Software Engineering", "classes_held": 42, "classes_attended": 38, "percentage": 90.48, "status": "Eligible (Safe)", "shortage_warning": False},
            {"subject_code": "KCS-602", "subject": "Compiler Design", "classes_held": 40, "classes_attended": 34, "percentage": 85.00, "status": "Eligible (Safe)", "shortage_warning": False},
            {"subject_code": "KCS-603", "subject": "Computer Networks", "classes_held": 45, "classes_attended": 39, "percentage": 86.67, "status": "Eligible (Safe)", "shortage_warning": False},
            {"subject_code": "KOE-068", "subject": "Embedded Systems", "classes_held": 36, "classes_attended": 31, "percentage": 86.11, "status": "Eligible (Safe)", "shortage_warning": False},
            {"subject_code": "KCS-061", "subject": "Big Data Analytics", "classes_held": 38, "classes_attended": 33, "percentage": 86.84, "status": "Eligible (Safe)", "shortage_warning": False},
            {"subject_code": "KCS-651", "subject": "Compiler Design Lab", "classes_held": 14, "classes_attended": 13, "percentage": 92.86, "status": "Eligible (Safe)", "shortage_warning": False},
            {"subject_code": "KCS-652", "subject": "Software Engineering Lab", "classes_held": 14, "classes_attended": 12, "percentage": 85.71, "status": "Eligible (Safe)", "shortage_warning": False}
        ]
        total_held = sum(s["classes_held"] for s in subjects)
        total_attended = sum(s["classes_attended"] for s in subjects)
        aggregate_pct = round((total_attended / total_held) * 100, 2)

        return {
            "status": "success",
            "student_id": student_id,
            "overall_attendance_percentage": aggregate_pct,
            "total_classes_held": total_held,
            "total_classes_attended": total_attended,
            "minimum_required_percentage": 75.0,
            "university_detention_risk": "None - Cleared for Exams",
            "medical_leave_buffer_applied": "3 days (Approved)",
            "monthly_breakdown": [
                {"month": "January 2026", "held": 32, "attended": 30, "percentage": 93.75},
                {"month": "February 2026", "held": 64, "attended": 55, "percentage": 85.94},
                {"month": "March 2026", "held": 72, "attended": 62, "percentage": 86.11},
                {"month": "April 2026 (Till Date)", "held": 61, "attended": 53, "percentage": 86.88}
            ],
            "recent_absences": [
                {"date": "2026-04-12", "reason": "Severe Migraine", "medical_slip_verified": True},
                {"date": "2026-03-18", "reason": "Smart India Hackathon Zonal Participation", "duty_leave_approved": True},
                {"date": "2026-02-10", "reason": "Viral Fever", "medical_slip_verified": True}
            ],
            "subject_attendance": subjects,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_student_leaves(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Applied academic leaves with approval status and certificates."""
        leaves = [
            {
                "leave_id": "LV-2026-081",
                "leave_type": "Duty Leave (On-Duty)",
                "from_date": "2026-03-18",
                "to_date": "2026-03-19",
                "total_days": 2,
                "reason": "Smart India Hackathon 2026 Regional Round Representation at IIT Roorkee",
                "status": "Approved",
                "approved_by": "Dr. P.K. Sharma (Head of Department)",
                "attachment": "sih_2026_invitation_letter.pdf",
                "action_timestamp": "2026-03-16T11:20:00Z"
            },
            {
                "leave_id": "LV-2026-043",
                "leave_type": "Medical Leave",
                "from_date": "2026-02-10",
                "to_date": "2026-02-12",
                "total_days": 3,
                "reason": "Acute viral infection with high fever; physician advised rest",
                "status": "Approved",
                "approved_by": "Dr. Alok Ranjan (Faculty Mentor)",
                "attachment": "fortis_hospital_prescription.pdf",
                "action_timestamp": "2026-02-14T09:45:00Z"
            },
            {
                "leave_id": "LV-2026-112",
                "leave_type": "Academic Conference Leave",
                "from_date": "2026-04-28",
                "to_date": "2026-04-29",
                "total_days": 2,
                "reason": "Oral presentation of peer-reviewed paper at IEEE International Conference (ICSC)",
                "status": "Pending Verification",
                "approved_by": "Pending HOD Signoff",
                "attachment": "ieee_paper_acceptance_letter.pdf",
                "action_timestamp": "2026-04-18T14:10:00Z"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "total_leaves_applied": len(leaves),
            "approved_leaves": 2,
            "pending_leaves": 1,
            "rejected_leaves": 0,
            "leave_quota_remaining": {"casual": 4, "medical": 7, "duty": "Unlimited on Prior Permission"},
            "leaves": leaves,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_mentor_counselling(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Faculty mentor counselling sessions, mentor profile, and notes."""
        sessions = [
            {
                "session_no": 1,
                "date": "2026-01-22",
                "topic": "Semester VI Goal Setting & GATE / Placement Strategy",
                "discussion": "Discussed target CGPA retention above 8.5 for Super-Dream placement tier (>12 LPA). Reviewed GATE 2027 CS preparation schedule.",
                "action_items": "Solve 10 LeetCode Medium problems weekly; finish Software Eng prototype before Mid-Terms.",
                "mentor_rating": "5/5 (Outstanding Focus)"
            },
            {
                "session_no": 2,
                "date": "2026-03-10",
                "topic": "Hackathon Strategy & Mid-Term Sessional Performance",
                "discussion": "Assessed SIH project architecture using FastAPI & React. Validated attendance buffer to prevent academic shortage.",
                "action_items": "Submit duty leave with travel tickets; coordinate with lab assistants for makeup practicals.",
                "mentor_rating": "5/5 (Proactive)"
            },
            {
                "session_no": 3,
                "date": "2026-04-08",
                "topic": "Campus Recruitment Drive Mock Technical Review",
                "discussion": "Evaluated data structures & algorithms proficiency. Amit demonstrated strong dynamic programming and OS internals mastery.",
                "action_items": "Refine LinkedIn profile; update GitHub portfolio with live Dockerized demos.",
                "mentor_rating": "5/5 (Placement Ready)"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "mentor_details": {
                "name": "Dr. Alok Ranjan",
                "designation": "Associate Professor & Head of Distributed Systems Lab",
                "department": "Computer Science & Engineering",
                "qualification": "Ph.D. (IIT Delhi), M.Tech (CSE), B.Tech (CSE)",
                "cabin": "Room B-214, Academic Block B",
                "email": "alok.ranjan@glbitm.ac.in",
                "phone": "+91-9810234567",
                "office_hours": "Monday - Friday, 03:00 PM - 04:30 PM"
            },
            "total_counselling_sessions": len(sessions),
            "general_conduct": "Exemplary academic and ethical record. Demonstrates high leadership in coding forums.",
            "counselling_sessions": sessions,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_class_teacher_info(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Subject-teacher table, class coordinator details, and student mentorship council."""
        faculty_mapping = [
            {"subject_code": "KCS-601", "subject": "Software Engineering", "faculty_name": "Prof. Priya Srivastava", "designation": "Assistant Professor (Sr. Scale)", "email": "priya.srivastava@glbitm.ac.in", "cabin": "B-305", "experience": "9 Years"},
            {"subject_code": "KCS-602", "subject": "Compiler Design", "faculty_name": "Dr. Alok Ranjan", "designation": "Associate Professor", "email": "alok.ranjan@glbitm.ac.in", "cabin": "B-214", "experience": "14 Years"},
            {"subject_code": "KCS-603", "subject": "Computer Networks", "faculty_name": "Prof. Rajesh Verma", "designation": "Assistant Professor", "email": "rajesh.verma@glbitm.ac.in", "cabin": "B-308", "experience": "8 Years"},
            {"subject_code": "KOE-068", "subject": "Embedded Systems", "faculty_name": "Dr. Neha Gupta", "designation": "Associate Professor (ECE)", "email": "neha.gupta@glbitm.ac.in", "cabin": "A-112", "experience": "11 Years"},
            {"subject_code": "KCS-061", "subject": "Big Data Analytics", "faculty_name": "Dr. Manish Kumar", "designation": "Professor", "email": "manish.kumar@glbitm.ac.in", "cabin": "B-401", "experience": "16 Years"},
            {"subject_code": "KCS-651", "subject": "Compiler Design Lab", "faculty_name": "Dr. Alok Ranjan & Er. Vivek Kumar", "designation": "Lab Incharge", "email": "vivek.kumar@glbitm.ac.in", "cabin": "Lab Block 4", "experience": "5 Years"},
            {"subject_code": "KCS-652", "subject": "Software Engineering Lab", "faculty_name": "Prof. Priya Srivastava & Er. Sneha Singh", "designation": "Lab Incharge", "email": "sneha.singh@glbitm.ac.in", "cabin": "Lab Block 2", "experience": "4 Years"}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "class_teacher": {
                "name": "Prof. Priya Srivastava",
                "role": "Class Coordinator / Teacher In-Charge (CSE-A)",
                "department": "Computer Science & Engineering",
                "email": "priya.srivastava@glbitm.ac.in",
                "cabin": "Room B-305, Academic Block B",
                "contact_number": "+91-9871092837",
                "class_announcements": "Pre-University tests will strictly follow AKTU 70-mark question pattern."
            },
            "batch_details": {
                "batch_name": "B.Tech CSE Batch 2022-2026",
                "section": "CSE-A",
                "total_students": 64,
                "class_representatives": [
                    {"name": "Amit Sharma (Roll 04)", "type": "Academic Representative"},
                    {"name": "Megha Bansal (Roll 32)", "type": "Cultural Representative"}
                ]
            },
            "faculty_table": faculty_mapping,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    # =========================================================================
    # MODULE 2: EXAM
    # =========================================================================

    @classmethod
    def get_exam_results(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Semester-wise academic results with SGPA/CGPA, credits, and subject grades."""
        semester_history = [
            {"semester": "Semester I", "session": "Dec 2022", "sgpa": 8.42, "credits_earned": 22, "result": "PASS (First Div with Distinction)", "subjects_cleared": 9},
            {"semester": "Semester II", "session": "Jun 2023", "sgpa": 8.55, "credits_earned": 22, "result": "PASS (First Div with Distinction)", "subjects_cleared": 9},
            {"semester": "Semester III", "session": "Jan 2024", "sgpa": 8.70, "credits_earned": 23, "result": "PASS (First Div with Distinction)", "subjects_cleared": 8},
            {"semester": "Semester IV", "session": "Jun 2024", "sgpa": 8.85, "credits_earned": 23, "result": "PASS (First Div with Distinction)", "subjects_cleared": 8},
            {
                "semester": "Semester V",
                "session": "Jan 2025",
                "sgpa": 8.90,
                "credits_earned": 22,
                "result": "PASS (First Div with Distinction)",
                "subjects_cleared": 8,
                "grade_sheet": [
                    {"code": "KCS-501", "name": "Design & Analysis of Algorithms", "credits": 4, "grade": "A+", "points": 9, "internal": 46, "external": 48, "total": 94},
                    {"code": "KCS-502", "name": "Database Management Systems", "credits": 4, "grade": "A+", "points": 9, "internal": 47, "external": 47, "total": 94},
                    {"code": "KCS-503", "name": "Web Technologies", "credits": 4, "grade": "O (Outstanding)", "points": 10, "internal": 49, "external": 49, "total": 98},
                    {"code": "KCS-054", "name": "Microprocessor & Interfacing", "credits": 3, "grade": "A", "points": 8, "internal": 42, "external": 44, "total": 86},
                    {"code": "KNC-501", "name": "Constitution of India", "credits": 0, "grade": "Pass", "points": "Qualifying", "internal": 45, "external": "-", "total": 45},
                    {"code": "KCS-551", "name": "DAA Lab", "credits": 1, "grade": "O (Outstanding)", "points": 10, "internal": 48, "external": 49, "total": 97},
                    {"code": "KCS-552", "name": "DBMS Lab", "credits": 1, "grade": "O (Outstanding)", "points": 10, "internal": 49, "external": 48, "total": 97},
                    {"code": "KCS-553", "name": "Mini Project Lab", "credits": 2, "grade": "A+", "points": 9, "internal": 46, "external": 47, "total": 93}
                ]
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "roll_number": "2201920100045",
            "enrollment_number": "2201920084920",
            "student_name": "Amit Sharma",
            "degree": "Bachelor of Technology (B.Tech)",
            "branch": "Computer Science & Engineering",
            "cumulative_gpa": 8.68,
            "total_credits_earned": 112,
            "total_credits_required": 160,
            "active_backlogs": 0,
            "academic_standing": "Dean's Honor List | Rank 3 in CSE Department",
            "semester_history": semester_history,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_exam_datesheet(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Upcoming end-semester examination datesheet."""
        exam_papers = [
            {"date": "2026-05-25", "day": "Monday", "time": "09:30 AM - 12:30 PM", "course_code": "KCS-601", "subject": "Software Engineering", "center": "Hall-B (Center 192)", "reporting_time": "09:00 AM"},
            {"date": "2026-05-28", "day": "Thursday", "time": "09:30 AM - 12:30 PM", "course_code": "KCS-602", "subject": "Compiler Design", "center": "Hall-B (Center 192)", "reporting_time": "09:00 AM"},
            {"date": "2026-06-01", "day": "Monday", "time": "09:30 AM - 12:30 PM", "course_code": "KCS-603", "subject": "Computer Networks", "center": "Hall-B (Center 192)", "reporting_time": "09:00 AM"},
            {"date": "2026-06-04", "day": "Thursday", "time": "09:30 AM - 12:30 PM", "course_code": "KOE-068", "subject": "Embedded Systems (Open Elective)", "center": "Hall-A (Center 192)", "reporting_time": "09:00 AM"},
            {"date": "2026-06-08", "day": "Monday", "time": "09:30 AM - 12:30 PM", "course_code": "KCS-061", "subject": "Big Data Analytics (Dept Elective)", "center": "Hall-B (Center 192)", "reporting_time": "09:00 AM"}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "examination_name": "AKTU Even Semester Theory Examination (Session 2025-26)",
            "exam_center_code": "192 (GL Bajaj Institute of Tech & Mgmt)",
            "admit_card_ready": True,
            "instructions": [
                "Candidates must carry official Institute ID and printed AKTU Admit Card.",
                "Entry inside examination hall is barred 15 minutes post commencement.",
                "Smartwatches, Bluetooth peripherals, and programmable calculators are prohibited."
            ],
            "datesheet": exam_papers,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_exam_registration(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Registered university examinations, verification status, and fee clearance."""
        return {
            "status": "success",
            "student_id": student_id,
            "registration_id": "AKTU-EXAM-REG-2026-045",
            "academic_session": "2025-2026 (Even Semester)",
            "semester": "Semester VI",
            "exam_category": "Regular Examination",
            "registration_date": "2026-03-02",
            "form_submission_status": "Verified & Forwarded by Institute COE",
            "aktu_portal_sync": "Confirmed (AKTU Portal Ref: AKTU/ERP/2026/849201)",
            "exam_fee_amount": 7500.0,
            "payment_status": "Paid in Full",
            "transaction_reference": "TXN_AKTU_20260302_994812",
            "admit_card_number": "AC-2201920100045-EV26",
            "clearance": {
                "academic_clearance": "Approved",
                "attendance_eligibility": "Approved (87.4%)",
                "finance_no_dues": "Cleared",
                "library_no_dues": "Cleared"
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_subject_registration(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Registered semester subjects, credits, and course coordinators."""
        registered_courses = [
            {"code": "KCS-601", "name": "Software Engineering", "category": "Department Core (Theory)", "credits": 4, "type": "Compulsory"},
            {"code": "KCS-602", "name": "Compiler Design", "category": "Department Core (Theory)", "credits": 4, "type": "Compulsory"},
            {"code": "KCS-603", "name": "Computer Networks", "category": "Department Core (Theory)", "credits": 4, "type": "Compulsory"},
            {"code": "KOE-068", "name": "Embedded Systems", "category": "Open Elective - II", "credits": 3, "type": "Elective"},
            {"code": "KCS-061", "name": "Big Data Analytics", "category": "Departmental Elective - III", "credits": 3, "type": "Elective"},
            {"code": "KCS-651", "name": "Compiler Design Lab", "category": "Practical / Laboratory", "credits": 1, "type": "Compulsory"},
            {"code": "KCS-652", "name": "Software Engineering Lab", "category": "Practical / Laboratory", "credits": 1, "type": "Compulsory"},
            {"code": "KCS-653", "name": "Web Technology / Cloud Project Lab", "category": "Practical / Laboratory", "credits": 1, "type": "Compulsory"},
            {"code": "KNC-601", "name": "Constitution of India", "category": "Audit Course (Mandatory)", "credits": 0, "type": "Audit (Non-Credit)"}
        ]
        total_credits = sum(c["credits"] for c in registered_courses)
        return {
            "status": "success",
            "student_id": student_id,
            "semester": "6th Semester",
            "total_registered_subjects": len(registered_courses),
            "total_credits": total_credits,
            "registration_lock_status": "Locked & Approved by Dean Academics",
            "approval_date": "2026-01-20",
            "subjects": registered_courses,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    # =========================================================================
    # MODULE 3: FEES
    # =========================================================================

    @classmethod
    def get_fee_structure(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Comprehensive head-wise institutional fee structure."""
        breakup = [
            {"head": "Academic Tuition Fee", "annual_inr": 125000.0, "semester_inr": 62500.0, "category": "Academic", "mandatory": True},
            {"head": "University Examination & Enrolment Fee", "annual_inr": 15000.0, "semester_inr": 7500.0, "category": "University Dues", "mandatory": True},
            {"head": "Tagore Hostel Charges (Double Sharing AC)", "annual_inr": 65000.0, "semester_inr": 32500.0, "category": "Hostel", "mandatory": True},
            {"head": "Hostel Mess & Nutrition Charges", "annual_inr": 40000.0, "semester_inr": 20000.0, "category": "Hostel", "mandatory": True},
            {"head": "Institutional Caution Money (One-Time Refundable)", "annual_inr": 10000.0, "semester_inr": 0.0, "category": "Deposit", "mandatory": False},
            {"head": "Training & Placement Cell (CRPC) Assessment Fee", "annual_inr": 8500.0, "semester_inr": 4250.0, "category": "Professional Development", "mandatory": True},
            {"head": "Central Library & Book Bank Access Fee", "annual_inr": 4500.0, "semester_inr": 2250.0, "category": "Academic Resources", "mandatory": True},
            {"head": "Campus Wi-Fi & High Performance Computing Fee", "annual_inr": 3500.0, "semester_inr": 1750.0, "category": "IT Infrastructure", "mandatory": True},
            {"head": "Student Health Insurance & Sports Welfare", "annual_inr": 2500.0, "semester_inr": 1250.0, "category": "Welfare", "mandatory": True}
        ]
        total_annual = sum(item["annual_inr"] for item in breakup)
        total_sem = sum(item["semester_inr"] for item in breakup)

        return {
            "status": "success",
            "student_id": student_id,
            "academic_year": "2025-2026",
            "course": "B.Tech Computer Science & Engineering",
            "currency": "INR (₹)",
            "total_annual_fee": total_annual,
            "current_semester_payable": total_sem,
            "fee_breakup": breakup,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_fee_dues(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Outstanding student fee dues and arrears."""
        return {
            "status": "success",
            "student_id": student_id,
            "has_outstanding_dues": False,
            "total_outstanding_inr": 0.0,
            "late_fine_accrued": 0.0,
            "current_semester_status": "PAID_IN_FULL",
            "last_cleared_date": "2026-01-10",
            "next_billing_cycle": {
                "term": "Semester VII (Autumn 2026)",
                "estimated_due_date": "2026-07-20",
                "estimated_amount_inr": 132000.0
            },
            "dues_ledger": [],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_fee_payments(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Payment history with downloadable receipts and transaction codes."""
        transactions = [
            {
                "receipt_no": "REC/2026/04918",
                "date": "2026-01-10",
                "amount_inr": 132000.0,
                "term": "Semester VI",
                "payment_mode": "HDFC NetBanking / BillDesk",
                "bank_ref": "HDFCR520260110829104",
                "status": "SUCCESS",
                "receipt_url": "/api/fees/receipts/REC-2026-04918.pdf"
            },
            {
                "receipt_no": "REC/2025/11245",
                "date": "2025-07-18",
                "amount_inr": 132000.0,
                "term": "Semester V",
                "payment_mode": "UPI (Razorpay Gateway)",
                "bank_ref": "RZP_PAY_99182371",
                "status": "SUCCESS",
                "receipt_url": "/api/fees/receipts/REC-2025-11245.pdf"
            },
            {
                "receipt_no": "REC/2025/03411",
                "date": "2025-01-12",
                "amount_inr": 126000.0,
                "term": "Semester IV",
                "payment_mode": "NEFT Remittance",
                "bank_ref": "SBIN42025011299841",
                "status": "SUCCESS",
                "receipt_url": "/api/fees/receipts/REC-2025-03411.pdf"
            },
            {
                "receipt_no": "REC/2024/09812",
                "date": "2024-07-22",
                "amount_inr": 126000.0,
                "term": "Semester III",
                "payment_mode": "Debit Card (Campus POS)",
                "bank_ref": "POS_GLB_849201",
                "status": "SUCCESS",
                "receipt_url": "/api/fees/receipts/REC-2024-09812.pdf"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "total_transactions": len(transactions),
            "lifetime_paid_inr": sum(t["amount_inr"] for t in transactions),
            "payment_history": transactions,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_fee_balance(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Balance summary, advance credit, and caution deposit tracking."""
        return {
            "status": "success",
            "student_id": student_id,
            "total_invoiced_inr": 766000.0,
            "total_received_inr": 768500.0,
            "net_balance_inr": 0.0,
            "credit_surplus_inr": 2500.0,
            "caution_money_balance_inr": 10000.0,
            "caution_money_refundable": True,
            "standing_status": "CLEAR - NO ARREARS",
            "financial_hold": False,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_registration_fee(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Semester enrollment and registration fee verification."""
        return {
            "status": "success",
            "student_id": student_id,
            "registration_cycle": "Semester VI Enrolment",
            "fee_amount_inr": 2000.0,
            "payment_status": "PAID",
            "payment_date": "2026-01-10",
            "receipt_number": "REG-FEE-2026-6S-04",
            "authorization_hash": "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
            "enrolment_confirmed": True,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_fee_discount_waiver(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Discounts, merit fee waivers, and concession details."""
        waivers = [
            {
                "scheme": "Academic Merit Concession (CGPA > 8.5)",
                "discount_percentage": "10% on Tuition Fee",
                "annual_relief_inr": 12500.0,
                "sanction_order": "GLB/DIR/MERIT-CONC/2025/119",
                "awarded_by": "Director Academic Council",
                "status": "Active & Applied to Invoices"
            },
            {
                "scheme": "Sibling Concession Program",
                "discount_percentage": "5% on Institution Infrastructure",
                "annual_relief_inr": 3500.0,
                "sanction_order": "GLB/FEE/SIB-WAIV/2025/042",
                "awarded_by": "Finance & Accounts Bureau",
                "status": "Active"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "total_waiver_received_annual_inr": 16000.0,
            "concessions": waivers,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_scholarship_details(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """State/Central scholarships and institute fellowship awards."""
        scholarships = [
            {
                "scholarship_name": "UP State Post-Matric Scholarship & Fee Reimbursement Scheme",
                "application_id": "UP-SCH-2025-92184920",
                "portal": "scholarship.up.gov.in",
                "sanctioned_amount_inr": 50000.0,
                "disbursed_amount_inr": 50000.0,
                "disbursement_date": "2025-11-28",
                "credited_to_bank": "State Bank of India (A/C: *******4091)",
                "status": "Disbursed / Verified (PFMS Trace Ref: PFMS-UP-849201)"
            },
            {
                "scholarship_name": "GL Bajaj Meritorious Young Tech Leader Fellowship",
                "application_id": "GLB-FEL-2025-014",
                "portal": "glbitm.ac.in/scholarships",
                "sanctioned_amount_inr": 25000.0,
                "disbursed_amount_inr": 25000.0,
                "disbursement_date": "2026-01-05",
                "credited_to_bank": "Tuition Adjustment Offset",
                "status": "Adjusted in Sem VI Invoice"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "total_scholarship_amount_inr": 75000.0,
            "scholarships": scholarships,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_fee_adjustment(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Fee adjustments made across billing cycles."""
        adjustments = [
            {"date": "2025-08-01", "description": "Excess lab security deposit refunded to tuition head", "amount_inr": 2500.0, "type": "Credit", "ref_no": "ADJ-2025-08-04"},
            {"date": "2026-01-05", "description": "Institute Fellowship Credit Offset to Sem VI Tuition", "amount_inr": 25000.0, "type": "Credit Offset", "ref_no": "ADJ-2026-01-09"}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "total_adjustments_count": len(adjustments),
            "adjustments": adjustments,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_fee_relaxation(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Fee deadline relaxations and split installment grants."""
        return {
            "status": "success",
            "student_id": student_id,
            "installment_facility_allowed": True,
            "penalty_waiver_history": [
                {"term": "Semester IV", "penalty_amount_waived_inr": 1500.0, "reason": "Parent banking technical downtime", "approved_by": "Finance Officer"}
            ],
            "relaxation_remarks": "Student maintains exemplary standing. Split installment authorized upon parent request.",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_fee_refund(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Refund history and pending refundable balances."""
        refunds = [
            {"refund_id": "REF-2025-110", "item": "IEEE Conference Registration Sponsorship Reimbursement", "amount_inr": 4500.0, "mode": "IMPS Direct Credit", "utr": "IMPS25110482910", "processed_on": "2025-11-20", "status": "COMPLETED"}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "caution_money_refundable_post_graduation_inr": 10000.0,
            "refund_records": refunds,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_pocket_money(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Campus RFID Smart Card wallet balance and cafeteria spends."""
        transactions = [
            {"date": "2026-04-22 13:10", "vendor": "Campus Food Court - Green Cafe", "amount_inr": 140.0, "balance_after_inr": 1840.0, "type": "DEBIT"},
            {"date": "2026-04-21 16:30", "vendor": "Central Stationery & Binding Desk", "amount_inr": 120.0, "balance_after_inr": 1980.0, "type": "DEBIT"},
            {"date": "2026-04-20 08:45", "vendor": "Juice Bar & Healthy Counter", "amount_inr": 60.0, "balance_after_inr": 2100.0, "type": "DEBIT"},
            {"date": "2026-04-01 10:00", "vendor": "Parent Allowance Wallet Top-Up", "amount_inr": 3000.0, "balance_after_inr": 2160.0, "type": "CREDIT"}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "smart_card_id": "RFID-GLB-2022-045",
            "current_balance_inr": 1840.0,
            "monthly_spending_limit_inr": 6000.0,
            "recent_spends": transactions,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_cheque_bounce_info(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Cheque clearance history and bounced instrument penalties."""
        return {
            "status": "success",
            "student_id": student_id,
            "total_cheques_tendered": 4,
            "bounced_cheques_count": 0,
            "penalties_levied_inr": 0.0,
            "clean_standing": True,
            "records": [],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_fee_head_wise(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Itemized head-wise ledger with payment breakdown."""
        heads = [
            {"code": "F-01", "name": "Tuition Fee", "allocated_inr": 62500.0, "paid_inr": 62500.0, "due_inr": 0.0},
            {"code": "F-02", "name": "University Exam Fee", "allocated_inr": 7500.0, "paid_inr": 7500.0, "due_inr": 0.0},
            {"code": "F-03", "name": "Hostel Rent (AC Double)", "allocated_inr": 32500.0, "paid_inr": 32500.0, "due_inr": 0.0},
            {"code": "F-04", "name": "Hostel Mess Advance", "allocated_inr": 20000.0, "paid_inr": 20000.0, "due_inr": 0.0},
            {"code": "F-05", "name": "Lab & Computing Resources", "allocated_inr": 4250.0, "paid_inr": 4250.0, "due_inr": 0.0},
            {"code": "F-06", "name": "Placement & Career Training", "allocated_inr": 3500.0, "paid_inr": 3500.0, "due_inr": 0.0},
            {"code": "F-07", "name": "Library Book Bank", "allocated_inr": 1750.0, "paid_inr": 1750.0, "due_inr": 0.0}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "semester": "Semester VI",
            "currency": "INR",
            "heads": heads,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_bank_neft_rtgs(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """NEFT/RTGS wire remittances and institute beneficiary coordinates."""
        transfers = [
            {
                "utr_number": "HDFCR520260110829104",
                "remittance_date": "2026-01-10",
                "amount_inr": 132000.0,
                "remitter_bank": "HDFC Bank Ltd",
                "remitter_account": "*******8901",
                "beneficiary_account": "GL Bajaj Educational Trust (Kotak Mahindra Bank A/C: 9918273612)",
                "reconciliation_status": "RECONCILED_AUTOMATICALLY",
                "verified_by_accounts": True
            },
            {
                "utr_number": "SBIN4202507189102834",
                "remittance_date": "2025-07-18",
                "amount_inr": 132000.0,
                "remitter_bank": "State Bank of India",
                "remitter_account": "*******4091",
                "beneficiary_account": "GL Bajaj Educational Trust (Kotak Mahindra Bank A/C: 9918273612)",
                "reconciliation_status": "RECONCILED_AUTOMATICALLY",
                "verified_by_accounts": True
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "institute_banking_coordinates": {
                "account_name": "GL Bajaj Educational Trust",
                "bank_name": "Kotak Mahindra Bank Ltd",
                "account_number": "9918273612",
                "ifsc_code": "KKBK0000180",
                "branch": "Knowledge Park III, Greater Noida"
            },
            "transfers": transfers,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    # =========================================================================
    # MODULE 4: HOSTEL
    # =========================================================================

    @classmethod
    def get_my_room(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Allocated hostel room, roommate details, and amenities."""
        return {
            "status": "success",
            "student_id": student_id,
            "hostel_name": "Tagore Boys Residence (Block C)",
            "room_number": "C-314",
            "floor": "3rd Floor",
            "wing": "North Wing",
            "room_type": "Double Occupancy (Air-Conditioned)",
            "allotted_date": "2025-07-15",
            "valid_until": "2026-06-30",
            "roommate": {
                "name": "Rohan Mehta",
                "student_id": "CS-2022-09",
                "roll_number": "2201920100051",
                "branch": "Computer Science & Engineering (6th Sem)",
                "emergency_phone": "+91-9899112233"
            },
            "warden": {
                "name": "Mr. Surendra Singh",
                "office": "Ground Floor Warden Desk, Block C",
                "contact_number": "+91-9871122334",
                "email": "warden.blockc@glbitm.ac.in"
            },
            "amenities": [
                "Split Air Conditioner (2 Ton, 5 Star)",
                "2x Ergonomic Study Desks & Orthopedic Chairs",
                "High Speed Wi-Fi 6 AP (100 Mbps Unlimited)",
                "Attached Western Restroom with 24x7 Geyser",
                "Dedicated Steel Almirahs with Biometric Padlocks",
                "100% DG Generator Power Backup"
            ],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_room_status(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Hostel block capacity, occupancy stats, and maintenance logs."""
        return {
            "status": "success",
            "student_id": student_id,
            "hostel_block": "Block C (Senior Boys)",
            "total_rooms": 120,
            "total_capacity_beds": 240,
            "occupied_beds": 232,
            "occupancy_rate": "96.6%",
            "available_beds": 8,
            "hygiene_rating": "4.9 / 5.0 (Audited by FSSAI & Institutional Health Council)",
            "recent_maintenance": [
                {"ticket_id": "H-MNT-2026-091", "issue": "AC Filter Cleaning & Servicing", "logged_date": "2026-04-10", "status": "RESOLVED", "resolved_date": "2026-04-11"},
                {"ticket_id": "H-MNT-2026-042", "issue": "Washroom mixer tap replacement", "logged_date": "2026-03-05", "status": "RESOLVED", "resolved_date": "2026-03-05"}
            ],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_hostel_leave(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Hostel gate passes and overnight leave records."""
        leaves = [
            {
                "pass_id": "HPASS-2026-081",
                "type": "Weekend Home Visit",
                "destination": "Noida, Sector 62 (Family Residence)",
                "out_time": "2026-04-10 17:00",
                "expected_return": "2026-04-12 20:00",
                "actual_return": "2026-04-12 19:15",
                "parent_consent_verified": True,
                "parent_otp_phone": "+91-9811223344",
                "status": "COMPLETED_ON_TIME",
                "gate_entry_recorded": "Turnstile Gate 2"
            },
            {
                "pass_id": "HPASS-2026-059",
                "type": "Hackathon External Stay",
                "destination": "IIT Roorkee Campus",
                "out_time": "2026-03-17 18:00",
                "expected_return": "2026-03-20 09:00",
                "actual_return": "2026-03-20 08:30",
                "parent_consent_verified": True,
                "parent_otp_phone": "+91-9811223344",
                "status": "COMPLETED_ON_TIME",
                "gate_entry_recorded": "Main Gate 1"
            },
            {
                "pass_id": "HPASS-2026-102",
                "type": "Upcoming Outpass (Pre-University Study Break)",
                "destination": "Home Visit",
                "out_time": "2026-05-01 16:00",
                "expected_return": "2026-05-05 18:00",
                "actual_return": None,
                "parent_consent_verified": True,
                "parent_otp_phone": "+91-9811223344",
                "status": "APPROVED",
                "gate_entry_recorded": "Pending Out-Entry"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "curfew_rules": "Campus In-Time: 09:30 PM (Biometric turnstile check enforced)",
            "total_leaves_taken": len(leaves),
            "leaves": leaves,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_previous_registration(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Historical hostel room allocations across previous academic years."""
        history = [
            {"session": "2024-2025 (2nd Year)", "block": "Block B (Vivekananda Hostel)", "room": "B-208", "type": "Double Occupancy Non-AC", "conduct": "Exemplary (No Violations)"},
            {"session": "2023-2024 (1st Year)", "block": "Block A (Freshers Residence)", "room": "A-105", "type": "Triple Occupancy Non-AC", "conduct": "Exemplary (No Violations)"}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "registration_history": history,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_mess_menu(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Weekly 7-day nutritional mess dining menu."""
        menu = {
            "Monday": {
                "breakfast": "Poha with Roasted Peanuts, Boiled Sprouts, Banana, Chai & Coffee",
                "lunch": "Rajma Masala, Steamed Basmati Rice, Phulka, Boondi Raita, Green Salad",
                "evening_snacks": "Hot Veg Samosa, Green Mint Chutney, Masala Chai",
                "dinner": "Paneer Butter Masala, Dal Makhani, Tawa Roti, Jeera Pulao, Hot Gulab Jamun"
            },
            "Tuesday": {
                "breakfast": "Stuffed Aloo Paratha with Amul Butter, Fresh Curd, Mixed Pickle, Tea",
                "lunch": "Kadhi Pakoda, Zeera Rice, Mix Seasonal Sabzi, Tandoori Roti, Papad",
                "evening_snacks": "Sweet Corn Chaat & Tea / Coffee",
                "dinner": "Chana Dal Tadka, Bhindi Do Pyaza, Phulka, Steam Rice, Vermicelli Kheer"
            },
            "Wednesday": {
                "breakfast": "Steamed Idli, Medu Vada, Madras Sambar, Fresh Coconut Chutney",
                "lunch": "Kashmiri Dum Aloo, Arhar Dal Fry, Steamed Rice, Chapati, Beetroot Salad",
                "evening_snacks": "Vegetable Cutlet with Tomato Sauce, Chai",
                "dinner": "Special Night: Shahi Paneer / Butter Chicken (Non-Veg Counter), Dum Biryani, Burani Raita, Vanilla Ice Cream"
            },
            "Thursday": {
                "breakfast": "Rava Upma with Cashews, Boiled Eggs / Fresh Apples, Tea & Coffee",
                "lunch": "Amritsari Chole, Crispy Bhature / Steamed Rice, Onion Lemon Salad, Pickle",
                "evening_snacks": "Mix Veg Pakora, Masala Chai",
                "dinner": "Dal Palak, Aloo Gobhi Adraki, Chapati, Jeera Rice, Moong Dal Halwa"
            },
            "Friday": {
                "breakfast": "Mumbai Pav Bhaji with Butter, Multi-Grain Bread Toast, Tea & Milk",
                "lunch": "Yellow Moong Dal, Seasonal Gourd Masala, Steamed Rice, Phulka, Fresh Dahi",
                "evening_snacks": "Grilled Veg Cheese Sandwich, Lemon Tea / Coffee",
                "dinner": "Malai Kofta in Rich Cashew Gravy, Panchmel Dal, Butter Naan, Steamed Rice, Bengali Rasgulla"
            },
            "Saturday": {
                "breakfast": "Methi Thepla / Paratha with Curd, Pickle, Boiled Eggs / Papaya, Tea",
                "lunch": "Veg Pulao with Fried Onions, Dal Makhani, Mint Raita, Papad, Phulka",
                "evening_snacks": "Aloo Patties, Masala Chai",
                "dinner": "Sev Tamatar Sabzi, Arhar Dal, Phulka, Steamed Rice, Fruit Custard"
            },
            "Sunday": {
                "breakfast": "Crispy Mysore Masala Dosa, Sambar, Coconut & Tomato Chutney, Filter Coffee",
                "lunch": "Grand Feast: Hyderabadi Veg/Chicken Biryani, Mirchi Ka Salan, Raita, Paneer Tikka",
                "evening_snacks": "Bourbon Biscuits, Tea / Cold Coffee",
                "dinner": "Matar Mushroom Masala, Dal Tadka, Rumali Roti, Steamed Rice, Hot Jalebi with Rabri"
            }
        }
        return {
            "status": "success",
            "student_id": student_id,
            "mess_committee": "Joint Student-Warden Dining Committee (FSSAI Certified)",
            "timings": {
                "breakfast": "07:30 AM - 09:00 AM",
                "lunch": "12:30 PM - 02:15 PM",
                "evening_snacks": "05:00 PM - 06:15 PM",
                "dinner": "07:45 PM - 09:30 PM"
            },
            "weekly_menu": menu,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    # =========================================================================
    # MODULE 5: ADMINISTRATION
    # =========================================================================

    @classmethod
    def get_official_detail(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Student official master demographic and institutional profile."""
        return {
            "status": "success",
            "student_id": student_id,
            "personal_info": {
                "full_name": "Amit Sharma",
                "date_of_birth": "2004-10-14",
                "gender": "Male",
                "blood_group": "O+",
                "nationality": "Indian",
                "category": "General / Open",
                "domicile_state": "Uttar Pradesh",
                "aadhaar_masked": "XXXX-XXXX-9120",
                "apaar_id": "9182-3819-2049",
                "abc_id": "ABC-849-291-049"
            },
            "academic_profile": {
                "university_roll_no": "2201920100045",
                "registration_no": "2201920084920",
                "program": "Bachelor of Technology (B.Tech)",
                "discipline": "Computer Science & Engineering",
                "current_year": 3,
                "current_semester": 6,
                "section": "CSE-A",
                "mode": "Regular Full-Time",
                "admission_year": 2022,
                "graduating_year": 2026,
                "admission_quota": "UPTAC / JEE Main State Counseling (Rank: 14210)"
            },
            "contact_details": {
                "institutional_email": "amit.sharma@uni.edu",
                "personal_email": "amit.sharma.cse22@gmail.com",
                "phone": "+91-9876543210",
                "permanent_address": "B-42, Sector 62, Noida, Gautam Buddha Nagar, UP - 201309"
            },
            "parent_guardian": {
                "father_name": "Dr. Rajesh Sharma",
                "father_occupation": "Chief Medical Officer (UP Health Services)",
                "mother_name": "Smt. Sunita Sharma",
                "mother_occupation": "Principal, Kendriya Vidyalaya",
                "emergency_contact": "+91-9811223344"
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_document_status(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Verification and availability status of official academic certificates."""
        documents = [
            {"document_name": "Class 10th High School Marksheet & Certificate", "status": "VERIFIED_ORIGINAL_DEPOSITED", "verified_via": "DigiLocker / CBSE", "doc_ref": "DL-CBSE-10-849201"},
            {"document_name": "Class 12th Intermediate Marksheet & Certificate", "status": "VERIFIED_ORIGINAL_DEPOSITED", "verified_via": "DigiLocker / CBSE", "doc_ref": "DL-CBSE-12-992144"},
            {"document_name": "UPTAC Allotment Letter & Rank Card", "status": "VERIFIED_ON_RECORD", "verified_via": "AKTU Admission Cell", "doc_ref": "UPTAC-2022-14210"},
            {"document_name": "Character & Conduct Certificate", "status": "ACTIVE_ON_FILE", "verified_via": "GL Bajaj Institutional Registrar", "doc_ref": "CC-GLB-2022-045"},
            {"document_name": "Medical Fitness & Immunization Certificate", "status": "APPROVED", "verified_via": "District Hospital Noida", "doc_ref": "MED-2022-8104"}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "digilocker_integrated": True,
            "all_mandatory_documents_verified": True,
            "documents": documents,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_document_request(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Administrative certificate requests and dispatch status."""
        requests = [
            {
                "request_id": "REQ-DOC-2026-031",
                "certificate_type": "Recommendation Letter (LOR) for Summer Research Fellowship",
                "recipient_institution": "Carnegie Mellon University / IIT Delhi",
                "applied_date": "2026-04-05",
                "status": "APPROVED_READY_FOR_COLLECTION",
                "signing_authority": "Dean Academics & Head of Department (CSE)",
                "collection_point": "Registrar Office Counter 3 (Ready with Official Hologram)"
            },
            {
                "request_id": "REQ-DOC-2026-018",
                "certificate_type": "Bonafide & Fee Estimate Certificate for Education Loan",
                "recipient_institution": "State Bank of India (RACC Noida)",
                "applied_date": "2026-01-08",
                "status": "DISPATCHED_DIGITALLY",
                "signing_authority": "Assistant Registrar",
                "collection_point": "Sent to Registered Email (DigiSigned PDF)"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "available_types_for_request": [
                "Bonafide Student Certificate",
                "Medium of Instruction Certificate (English)",
                "Provisional Degree Certificate (Final Year)",
                "Official Transcript & Grade Conversion Table",
                "Fee Structure Quotation for Scholarship / Loan"
            ],
            "requests": requests,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_grievance(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Filed student grievances, internal complaints, and resolution trails."""
        grievances = [
            {
                "ticket_id": "GRV-2025-104",
                "category": "Campus IT & Infrastructure",
                "subject": "Intermittent Wi-Fi signal drop in Hostel Block C 3rd Floor study desks",
                "lodged_date": "2025-11-15",
                "status": "RESOLVED_CLOSED",
                "resolution": "Dedicated Ubiquiti UniFi AP-6 Pro access point installed and provisioned on 18-Nov-2025. Signal strength measured at -42 dBm across all rooms.",
                "resolved_by": "Senior IT Systems Engineer",
                "student_feedback_rating": "5 Stars (Delighted)"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "active_grievance_count": 0,
            "resolved_grievance_count": len(grievances),
            "anti_ragging_committee": {
                "head": "Prof. S. C. Sharma (Director)",
                "toll_free": "1800-180-5522",
                "status": "Ragging-Free Zero Tolerance Campus"
            },
            "grievances": grievances,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_helpdesk(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """IT and campus facility helpdesk tickets and service level agreements."""
        tickets = [
            {"ticket_id": "IT-8921", "service": "ERP & LMS Moodle", "subject": "Token sync for AI Copilot chat integration", "priority": "Medium", "status": "RESOLVED", "created_at": "2026-03-01", "closed_at": "2026-03-01"},
            {"ticket_id": "IT-9042", "service": "Smart RFID Card", "subject": "RFID Turnstile sync at Central Library gate", "priority": "High", "status": "RESOLVED", "created_at": "2026-02-14", "closed_at": "2026-02-14"},
            {"ticket_id": "IT-9188", "service": "AI / ML Lab Workstation", "subject": "CUDA Toolkit 12.4 update on Computing Node 8", "priority": "Low", "status": "RESOLVED", "created_at": "2026-04-02", "closed_at": "2026-04-03"}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "open_tickets": 0,
            "resolved_tickets": len(tickets),
            "institutional_sla_compliance": "99.4%",
            "tickets": tickets,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_feedback(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Feedback submissions on faculty teaching, campus amenities, and labs."""
        feedback_records = [
            {
                "cycle": "Even Semester 2025-26 Mid-Term Faculty Evaluation",
                "submitted_date": "2026-02-28",
                "status": "COMPLETED",
                "categories_rated": ["Subject Mastery", "Punctuality", "Interactive Teaching", "Fairness in Grading", "Lab Mentorship"],
                "acknowledgement_code": "FB-EV26-CSE-8491"
            },
            {
                "cycle": "Institutional Facilities & Mess Hygiene Audit Q1",
                "submitted_date": "2026-03-25",
                "status": "COMPLETED",
                "categories_rated": ["Hostel Cleanliness", "Cafeteria Nutrition", "Sports Facilities", "High Speed Internet"],
                "acknowledgement_code": "FB-FAC-2026-092"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "mandatory_surveys_pending": 0,
            "feedback_history": feedback_records,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    # =========================================================================
    # MODULE 6: LIBRARY
    # =========================================================================

    @classmethod
    def get_library_membership(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Central library smart card membership, book borrowing quotas, and digital access."""
        return {
            "status": "success",
            "student_id": student_id,
            "membership_card_no": "LIB-GLB-22-045",
            "rfid_barcode": "89012300458",
            "membership_tier": "Undergraduate B.Tech Scholar",
            "status_label": "ACTIVE_CLEAR",
            "issue_quota": 6,
            "currently_borrowed": 3,
            "available_quota": 3,
            "period_allowed_days": 30,
            "digital_library_privileges": [
                "IEEE Xplore Digital Library (Full-Text)",
                "ScienceDirect / Elsevier AI Journals",
                "SpringerLink & ACM Digital Library",
                "DELNET Inter-Library Loan Network",
                "NPTEL Local Guru Video Streaming Server (10 Gbps)"
            ],
            "valid_till": "2026-07-31",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_issued_books(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Currently checked-out books with issue dates, due dates, and renewal status."""
        books = [
            {
                "accession_no": "GLB-CS-18492",
                "isbn": "978-0321486813",
                "title": "Compilers: Principles, Techniques, and Tools (Dragon Book)",
                "author": "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman",
                "issue_date": "2026-03-10",
                "due_date": "2026-04-28",
                "renewal_count": 1,
                "fine_accrued_inr": 0.0,
                "days_remaining": 6,
                "status": "ACTIVE_BORROWED"
            },
            {
                "accession_no": "GLB-CS-22104",
                "isbn": "978-0132126953",
                "title": "Computer Networks (5th Edition)",
                "author": "Andrew S. Tanenbaum, David J. Wetherall",
                "issue_date": "2026-03-22",
                "due_date": "2026-05-02",
                "renewal_count": 0,
                "fine_accrued_inr": 0.0,
                "days_remaining": 10,
                "status": "ACTIVE_BORROWED"
            },
            {
                "accession_no": "GLB-CS-14920",
                "isbn": "978-0078022128",
                "title": "Software Engineering: A Practitioner's Approach",
                "author": "Roger S. Pressman, Bruce R. Maxim",
                "issue_date": "2026-04-02",
                "due_date": "2026-05-12",
                "renewal_count": 0,
                "fine_accrued_inr": 0.0,
                "days_remaining": 20,
                "status": "ACTIVE_BORROWED"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "issued_books_count": len(books),
            "overdue_books_count": 0,
            "issued_books": books,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_library_log(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Historical checkout, return, and renewal transaction log."""
        history = [
            {"accession_no": "GLB-CS-09102", "title": "Introduction to Algorithms (CLRS 3rd Ed)", "borrowed_date": "2025-08-15", "returned_date": "2025-12-10", "condition": "Pristine", "status": "RETURNED"},
            {"accession_no": "GLB-CS-11490", "title": "Database System Concepts (Silberschatz)", "borrowed_date": "2025-08-20", "returned_date": "2025-12-05", "condition": "Good", "status": "RETURNED"},
            {"accession_no": "GLB-CS-07821", "title": "Operating System Concepts (Galvin)", "borrowed_date": "2025-01-18", "returned_date": "2025-05-20", "condition": "Pristine", "status": "RETURNED"}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "total_lifetime_borrowed": len(history) + 3,
            "history": history,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_library_fine(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Outstanding library overdue charges and fine clearance history."""
        return {
            "status": "success",
            "student_id": student_id,
            "outstanding_fine_inr": 0.0,
            "fine_rate_per_day_inr": 5.0,
            "lifetime_fines_paid_inr": 20.0,
            "last_fine_settled_date": "2025-12-10",
            "standing": "NO_DUES_CLEARED",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_library_attendance(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Smart RFID gate entrance logs and digital reading hall study hours."""
        recent_visits = [
            {"date": "2026-04-21", "in_time": "16:15", "out_time": "18:45", "duration_minutes": 150, "section": "Central Reading Hall", "purpose": "Research & Self Study"},
            {"date": "2026-04-19", "in_time": "15:30", "out_time": "19:00", "duration_minutes": 210, "section": "Digital Library (Terminal 14)", "purpose": "IEEE Journal Browsing"},
            {"date": "2026-04-16", "in_time": "17:00", "out_time": "19:30", "duration_minutes": 150, "section": "Reference Section", "purpose": "Compiler Design Group Discussion"}
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "total_visits_current_term": 48,
            "total_hours_logged": 114.5,
            "average_weekly_hours": 7.2,
            "recent_visits": recent_visits,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    # =========================================================================
    # MODULE 7: OTHER SERVICES
    # =========================================================================

    @classmethod
    def get_transport(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Institutional bus fleet, campus shuttle passes, and routes."""
        return {
            "status": "success",
            "student_id": student_id,
            "residential_mode": "Hostel In-Campus Resident",
            "metro_shuttle_facility": {
                "opt_in_status": "Active",
                "shuttle_pass_id": "SHTL-2026-045",
                "route": "Campus Gate 2 <---> Knowledge Park II Metro Station (Aqua Line)",
                "frequency": "Every 15 minutes during peak hours (07:30-09:30 AM & 04:30-06:30 PM)",
                "validity": "Academic Year 2025-2026",
                "pass_status": "VALID"
            },
            "fleet_info": {
                "total_buses": 45,
                "coverage": "Noida, Greater Noida, Ghaziabad, East/South Delhi, Faridabad",
                "gps_tracking_enabled": True,
                "emergency_helpline": "+91-9810998877"
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_training_placement(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """CRPC training drives, placement registrations, and shortlist statuses."""
        drives = [
            {
                "company": "Google India",
                "role": "Software Engineering Intern / Early PPO",
                "ctc_lpa": 32.5,
                "category": "Super Dream (>12 LPA)",
                "drive_date": "2026-05-15",
                "eligibility_criteria": "CGPA >= 8.5 with no active backlogs",
                "status": "Eligible & Shortlisted for Online Assessment",
                "registration_status": "REGISTERED"
            },
            {
                "company": "Microsoft IDC",
                "role": "Software Development Engineer (SDE-1)",
                "ctc_lpa": 44.0,
                "category": "Super Dream (>12 LPA)",
                "drive_date": "2026-08-10",
                "eligibility_criteria": "CGPA >= 8.0, CSE/IT Only",
                "status": "Upcoming Autumn Drive",
                "registration_status": "PRE_REGISTERED"
            },
            {
                "company": "Zscaler",
                "role": "Cloud Security Systems Engineer",
                "ctc_lpa": 18.0,
                "category": "Dream (>10 LPA)",
                "drive_date": "2026-04-18",
                "eligibility_criteria": "CGPA >= 7.5",
                "status": "Technical Round 1 Cleared (Round 2 Scheduled)",
                "registration_status": "IN_PROGRESS"
            },
            {
                "company": "Tata Consultancy Services (TCS Digital)",
                "role": "Digital Innovator / Software Developer",
                "ctc_lpa": 7.5,
                "category": "Standard Placement",
                "drive_date": "2026-03-12",
                "eligibility_criteria": "CGPA >= 7.0",
                "status": "Cleared & Offer Secured",
                "registration_status": "OFFER_EXTENDED"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "crpc_status": "ACTIVE_REGISTERED",
            "aptitude_score": "92/100 (Tier 1 Gold Cohort)",
            "coding_profile": {
                "leetcode_problems_solved": 412,
                "codechef_rating": "1840 (4 Star)",
                "github_commits_last_year": 380
            },
            "internship_experience": [
                {
                    "organization": "Defence Research & Development Organisation (DRDO / INMAS)",
                    "title": "Summer Research Intern (AI & Computer Vision)",
                    "tenure": "June 2025 - July 2025 (8 Weeks)",
                    "certificate_verified": True
                }
            ],
            "campus_drives": drives,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_sibling_info(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Sibling records enrolled in the institution and fee concessions."""
        return {
            "status": "success",
            "student_id": student_id,
            "has_sibling_enrolled": True,
            "sibling_details": {
                "name": "Ananya Sharma",
                "relation": "Sister",
                "student_id": "EC-2024-118",
                "university_roll_no": "2401920310118",
                "program": "B.Tech Electronics & Communication Engineering",
                "semester": "Semester IV (2nd Year)",
                "hostel": "Mother Teresa Girls Hostel (Room MT-204)",
                "cgpa": 8.74
            },
            "concession_applied": {
                "scheme": "Institutional Sibling Welfare Concession",
                "benefit": "5% rebate on composite institutional fee",
                "status": "VERIFIED_ACTIVE"
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_gallery(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Institutional galleries, event coverage, and student participations."""
        galleries = [
            {
                "album_id": "GAL-2026-UTKARSH",
                "title": "Utkarsh 2026 - Annual Fest & Hackathon",
                "category": "Flagship Fest",
                "date": "March 2026",
                "photo_count": 180,
                "cover_image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                "student_tagged": True,
                "student_caption": "Amit Sharma presenting Smart India Hackathon edge model at Innovation Expo"
            },
            {
                "album_id": "GAL-2025-CONVOCATION",
                "title": "Annual Convocation Ceremony 2025",
                "category": "Academic Convocation",
                "date": "November 2025",
                "photo_count": 320,
                "cover_image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
                "student_tagged": False
            },
            {
                "album_id": "GAL-2025-IEEE-ICSC",
                "title": "IEEE International Conference on Smart Computing",
                "category": "Research Conference",
                "date": "October 2025",
                "photo_count": 95,
                "cover_image": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
                "student_tagged": True,
                "student_caption": "Amit Sharma receiving Best Student Research Paper Certificate"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "total_albums": len(galleries),
            "albums": galleries,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_notices(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Institutional circulars, university announcements, and notices."""
        notices = [
            {
                "notice_id": "GLB/ACAD/2026/142",
                "title": "Schedule for Pre-University Test (PUT) & Mock Examinations",
                "published_date": "2026-04-15",
                "category": "Academic / Examination",
                "priority": "HIGH",
                "content": "All 3rd Year B.Tech students are informed that Pre-University Tests commence from 20-Apr-2026. Attendance in PUT is mandatory for university internal marks submission.",
                "signatory": "Dean Academics & Controller of Examinations"
            },
            {
                "notice_id": "GLB/CRPC/2026/098",
                "title": "Campus Placement Registration Open for Google & Microsoft Super-Dream Cohort",
                "published_date": "2026-04-10",
                "category": "Training & Placement",
                "priority": "HIGH",
                "content": "Students with CGPA >= 8.5 can submit their updated CV and LeetCode credentials through the CRPC portal before 25-Apr-2026.",
                "signatory": "Head - Corporate Resource Centre"
            },
            {
                "notice_id": "GLB/HOSTEL/2026/045",
                "title": "Hostel Air-Conditioning Operating Guidelines for Summer Season",
                "published_date": "2026-04-01",
                "category": "Hostel & Residence",
                "priority": "NORMAL",
                "content": "Central AC power supply timings will operate from 09:00 PM to 06:00 AM on weekdays and full day on weekends.",
                "signatory": "Chief Warden Office"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "unread_notices": 1,
            "notices": notices,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_diary(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Daily academic lecture diary and classroom progression logs."""
        diary_entries = [
            {
                "date": "2026-04-22",
                "subject": "KCS-602 Compiler Design",
                "faculty": "Dr. Alok Ranjan",
                "period": "Period 2 (10:00 - 11:00 AM)",
                "topic_covered": "Three-Address Code Generation for Boolean Expressions & Short-Circuit Evaluation",
                "homework_assigned": "Draw Quadruple and Triple representation for: a = b * -c + b * -c",
                "student_notes": "Understood the backpatching algorithm. Lookups in symbol table clarified."
            },
            {
                "date": "2026-04-22",
                "subject": "KCS-601 Software Engineering",
                "faculty": "Prof. Priya Srivastava",
                "period": "Period 1 (09:00 - 10:00 AM)",
                "topic_covered": "White Box Testing: Cyclomatic Complexity & Basis Path Testing",
                "homework_assigned": "Compute McCabe's Cyclomatic Complexity for sample control flow graph",
                "student_notes": "Practiced predicate node counting and independent paths calculation."
            },
            {
                "date": "2026-04-21",
                "subject": "KCS-603 Computer Networks",
                "faculty": "Prof. Rajesh Verma",
                "period": "Period 1 (09:00 - 10:00 AM)",
                "topic_covered": "TCP Congestion Control Algorithms (Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery)",
                "homework_assigned": "Plot congestion window dynamics under Reno vs Tahoe",
                "student_notes": "Great practical demonstration using Wireshark packet capture."
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "diary_entries": diary_entries,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_homework(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Daily homework assignments, practice problems, and laboratory deliverables."""
        homework_list = [
            {
                "task_id": "HW-602-04",
                "subject": "Compiler Design (KCS-602)",
                "task_title": "Construct DAG & Eliminate Local Common Subexpressions",
                "given_date": "2026-04-22",
                "submission_deadline": "2026-04-25",
                "status": "IN_PROGRESS",
                "priority": "HIGH"
            },
            {
                "task_id": "HW-601-07",
                "subject": "Software Engineering (KCS-601)",
                "task_title": "Calculate Cyclomatic Complexity on Given C++ Function",
                "given_date": "2026-04-22",
                "submission_deadline": "2026-04-24",
                "status": "COMPLETED",
                "priority": "MEDIUM"
            },
            {
                "task_id": "HW-603-05",
                "subject": "Computer Networks (KCS-603)",
                "task_title": "Cisco Packet Tracer Enterprise 3-Subnet Router Configuration",
                "given_date": "2026-04-20",
                "submission_deadline": "2026-04-26",
                "status": "IN_PROGRESS",
                "priority": "HIGH"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "pending_homework_count": 2,
            "completed_homework_count": 1,
            "homework": homework_list,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_student_ptm(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Parent-Teacher Meeting logs, mentor feedbacks, and parental acknowledgements."""
        ptm_records = [
            {
                "meeting_id": "PTM-2026-01",
                "date": "2026-02-15",
                "mode": "Hybrid (Father attended via Google Meet)",
                "faculty_attendee": "Dr. Alok Ranjan (Faculty Mentor) & Prof. Priya Srivastava (Class Teacher)",
                "parent_attendee": "Dr. Rajesh Sharma (Father)",
                "agenda": "Review of Mid-Semester Academics, Career Readiness & Hostel Conduct",
                "discussion_points": "Parent was pleased with Amit's CGPA of 8.68 and SIH selection. Faculty affirmed student's top-tier technical acumen.",
                "mentor_remarks": "Amit is among the top 2% of candidates in the department. Encouraged him to apply for Super-Dream placement drives.",
                "parent_acknowledgement": "Acknowledged & Applauded"
            }
        ]
        return {
            "status": "success",
            "student_id": student_id,
            "next_scheduled_ptm": "2026-05-10 (Pre-University Performance Consultation)",
            "meetings": ptm_records,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_no_dues(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Multi-department institutional No-Dues clearance status."""
        departments = [
            {"department": "Department of Computer Science & Engineering", "incharge": "Dr. P.K. Sharma (HOD)", "status": "CLEARED", "remarks": "All department lab projects and equipment returned", "date": "2026-04-18"},
            {"department": "Central Library", "incharge": "Dr. M.K. Gupta (Librarian)", "status": "CLEARED", "remarks": "All active book loans within permissible quota and zero fine", "date": "2026-04-18"},
            {"department": "Finance & Accounts Section", "incharge": "Mr. S.K. Rastogi (CFO)", "status": "CLEARED", "remarks": "Semester VI fees fully cleared. Zero arrears.", "date": "2026-04-18"},
            {"department": "Tagore Hostel Administration", "incharge": "Mr. Surendra Singh (Chief Warden)", "status": "CLEARED", "remarks": "No property damage reported. All room furnishings verified.", "date": "2026-04-18"},
            {"department": "Sports & Gymnasium Complex", "incharge": "Coach R.S. Rawat", "status": "CLEARED", "remarks": "Sports kit and locker cleared.", "date": "2026-04-18"},
            {"department": "Corporate Resource & Placement Centre", "incharge": "Mr. D.K. Mishra", "status": "CLEARED", "remarks": "Resume & code credentials verified.", "date": "2026-04-18"}
        ]
        all_cleared = all(d["status"] == "CLEARED" for d in departments)
        return {
            "status": "success",
            "student_id": student_id,
            "certificate_status": "PROVISIONALLY_CLEARED_FOR_EXAMS",
            "all_departments_cleared": all_cleared,
            "clearance_matrix": departments,
            "official_digital_certificate_id": "NODUES-GLB-2026-EV-0045",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_seating_plan(cls, student_id: str = "CS-2022-04") -> Dict[str, Any]:
        """Final / sessional examination seating arrangement and room allocation."""
        return {
            "status": "success",
            "student_id": student_id,
            "examination": "AKTU Even Semester Theory Examination (May-June 2026)",
            "exam_hall": "Academic Block B - Central Exam Hall 302",
            "floor": "3rd Floor",
            "seat_identifier": "DESK-B302-14A",
            "row": "Row 2 (Left Aisle)",
            "desk_number": 14,
            "invigilators_assigned": [
                {"name": "Dr. R.S. Shukla", "department": "Department of Mechanical Engineering"},
                {"name": "Prof. Sunita Rao", "department": "Department of Information Technology"}
            ],
            "reporting_instructions": [
                "Candidates must occupy designated seats 20 minutes prior to exam commencement.",
                "Desk QR Tag must be scanned using Institute mobile app for automated biometric presence log.",
                "AKTU Hall Ticket & Student ID Card must remain displayed on the desk at all times."
            ],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }


# Global singleton instance for convenient import across routers
institutional_erp_service = InstitutionalERPService()
