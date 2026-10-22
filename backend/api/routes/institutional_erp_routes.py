"""
INSTITUTIONAL ERP API ROUTES
============================
FastAPI routes exposing 7 comprehensive ERP modules for the Institutional Academic Portal:
1. Academic: Timetable, Calendar, Course Plan, Assignments, Attendance, Leaves, Mentor Counselling, Class Teacher
2. Exam: Results, Datesheet, Registration, Subject Registration
3. Fees: Structure, Dues, Payments, Balance, Registration Fee, Waivers, Scholarships, Adjustments, Relaxations, Refunds, Pocket Money, Cheque Bounce, Head-wise, NEFT/RTGS
4. Hostel: My Room, Room Status, Leaves, Previous Registration, Mess Menu
5. Administration: Official Detail, Document Status, Document Request, Grievance, Helpdesk, Feedback
6. Library: Membership, Issued Books, Log, Fines, Gate Attendance
7. Other Services: Transport, Training & Placement, Sibling Info, Gallery, Notices, Diary, Homework, PTM, No-Dues, Seating Plan
"""

from fastapi import APIRouter, Depends, Query
from typing import Dict, Any

from backend.api.dependencies import get_current_user
from backend.services.institutional_erp_service import institutional_erp_service

router = APIRouter(prefix="/institutional-erp", tags=["Institutional ERP Portal"])


# =============================================================================
# MODULE 1: ACADEMIC ENDPOINTS
# =============================================================================

@router.get("/academic/timetable")
def get_timetable(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve weekly class timetable with periods, classrooms, and faculty."""
    return institutional_erp_service.get_timetable(student_id)


@router.get("/academic/calendar")
def get_calendar(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve institutional academic calendar, examination schedules, and holidays."""
    return institutional_erp_service.get_calendar(student_id)


@router.get("/academic/course-plan")
def get_course_plan(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve unit-wise course plans, syllabi progression, and delivery metrics."""
    return institutional_erp_service.get_course_plan(student_id)


@router.get("/academic/assignments")
def get_assignments(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve subject assignments, deadlines, submission status, and evaluated grades."""
    return institutional_erp_service.get_assignments(student_id)


@router.get("/academic/attendance")
def get_attendance(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve subject-wise attendance percentages, held/attended classes, and warnings."""
    return institutional_erp_service.get_attendance(student_id)


@router.get("/academic/leaves")
@router.get("/academic/student-leaves")
def get_student_leaves(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve academic leave requests, duty leaves, medical buffers, and approvals."""
    return institutional_erp_service.get_student_leaves(student_id)


@router.get("/academic/mentor-counselling")
def get_mentor_counselling(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve faculty mentor profile, 1-on-1 counselling logs, and action items."""
    return institutional_erp_service.get_mentor_counselling(student_id)


@router.get("/academic/class-teacher")
def get_class_teacher_info(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve class coordinator information and complete subject-to-faculty matrix."""
    return institutional_erp_service.get_class_teacher_info(student_id)


# =============================================================================
# MODULE 2: EXAM ENDPOINTS
# =============================================================================

@router.get("/exam/results")
def get_exam_results(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve semester-wise SGPA, CGPA transcript, and individual subject letter grades."""
    return institutional_erp_service.get_exam_results(student_id)


@router.get("/exam/datesheet")
def get_exam_datesheet(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve upcoming university and sessional examination dates, halls, and slots."""
    return institutional_erp_service.get_exam_datesheet(student_id)


@router.get("/exam/registration")
def get_exam_registration(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve university examination registration forms, hall ticket number, and clearances."""
    return institutional_erp_service.get_exam_registration(student_id)


@router.get("/exam/subject-registration")
def get_subject_registration(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve registered semester credit subjects, electives, and curriculum locks."""
    return institutional_erp_service.get_subject_registration(student_id)


# =============================================================================
# MODULE 3: FEES ENDPOINTS
# =============================================================================

@router.get("/fees/structure")
def get_fee_structure(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve institutional head-wise fee structure and annual tuition liabilities."""
    return institutional_erp_service.get_fee_structure(student_id)


@router.get("/fees/dues")
def get_fee_dues(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve outstanding semester balances, due dates, and late payment liabilities."""
    return institutional_erp_service.get_fee_dues(student_id)


@router.get("/fees/payments")
def get_fee_payments(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve chronological fee payment transactions and printable receipt vouchers."""
    return institutional_erp_service.get_fee_payments(student_id)


@router.get("/fees/balance")
def get_fee_balance(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve consolidated account balance, caution deposit reserves, and standing."""
    return institutional_erp_service.get_fee_balance(student_id)


@router.get("/fees/registration-fee")
def get_registration_fee(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve semester enrollment and registration fee verification status."""
    return institutional_erp_service.get_registration_fee(student_id)


@router.get("/fees/discount-waiver")
def get_fee_discount_waiver(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve merit waivers, sibling concessions, and authorized tuition discounts."""
    return institutional_erp_service.get_fee_discount_waiver(student_id)


@router.get("/fees/scholarship")
def get_scholarship_details(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve government post-matric scholarships and institutional merit fellowships."""
    return institutional_erp_service.get_scholarship_details(student_id)


@router.get("/fees/adjustment")
def get_fee_adjustment(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve accounting adjustments, credit offsets, and head adjustments."""
    return institutional_erp_service.get_fee_adjustment(student_id)


@router.get("/fees/relaxation")
def get_fee_relaxation(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve installment grant approvals and payment deadline extensions."""
    return institutional_erp_service.get_fee_relaxation(student_id)


@router.get("/fees/refund")
def get_fee_refund(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve processed student fee refunds and post-graduation refundable caution balances."""
    return institutional_erp_service.get_fee_refund(student_id)


@router.get("/fees/pocket-money")
def get_pocket_money(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve campus RFID wallet balance, dining debits, and stationery spends."""
    return institutional_erp_service.get_pocket_money(student_id)


@router.get("/fees/cheque-bounce")
def get_cheque_bounce_info(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve dishonored cheque records and institutional penalty clearance."""
    return institutional_erp_service.get_cheque_bounce_info(student_id)


@router.get("/fees/head-wise")
def get_fee_head_wise(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve detailed ledger breakdown by institutional billing head."""
    return institutional_erp_service.get_fee_head_wise(student_id)


@router.get("/fees/bank-neft-rtgs")
def get_bank_neft_rtgs(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve electronic bank remittance UTR logs and institute beneficiary coordinates."""
    return institutional_erp_service.get_bank_neft_rtgs(student_id)


# =============================================================================
# MODULE 4: HOSTEL ENDPOINTS
# =============================================================================

@router.get("/hostel/my-room")
def get_my_room(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve allocated hostel room, roommate profile, block coordinates, and amenities."""
    return institutional_erp_service.get_my_room(student_id)


@router.get("/hostel/room-status")
def get_room_status(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve hostel block occupancy statistics, hygiene audit, and maintenance tickets."""
    return institutional_erp_service.get_room_status(student_id)


@router.get("/hostel/leave")
def get_hostel_leave(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve overnight residential gate passes, parent OTP verifications, and turnstile logs."""
    return institutional_erp_service.get_hostel_leave(student_id)


@router.get("/hostel/previous-registration")
def get_previous_registration(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve prior academic year hostel room allocations and disciplinary standing."""
    return institutional_erp_service.get_previous_registration(student_id)


@router.get("/hostel/mess-menu")
def get_mess_menu(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve 7-day nutritional breakfast, lunch, snacks, and dinner dining schedule."""
    return institutional_erp_service.get_mess_menu(student_id)


# =============================================================================
# MODULE 5: ADMINISTRATION ENDPOINTS
# =============================================================================

@router.get("/admin/official-detail")
def get_official_detail(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve official student demographic profile, APAAR/ABC ID, and parent contacts."""
    return institutional_erp_service.get_official_detail(student_id)


@router.get("/admin/document-status")
def get_document_status(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve verification status of deposited CBSE, DigiLocker, and state rank records."""
    return institutional_erp_service.get_document_status(student_id)


@router.get("/admin/document-request")
def get_document_request(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve bonafide, transcript, and recommendation letter administrative requests."""
    return institutional_erp_service.get_document_request(student_id)


@router.get("/admin/grievance")
def get_grievance(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve filed student grievances, Anti-Ragging cell status, and resolution trails."""
    return institutional_erp_service.get_grievance(student_id)


@router.get("/admin/helpdesk")
def get_helpdesk(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve campus IT, ERP, and computing helpdesk tickets and SLA timers."""
    return institutional_erp_service.get_helpdesk(student_id)


@router.get("/admin/feedback")
def get_feedback(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve completed academic faculty evaluations and institutional facility surveys."""
    return institutional_erp_service.get_feedback(student_id)


# =============================================================================
# MODULE 6: LIBRARY ENDPOINTS
# =============================================================================

@router.get("/library/membership")
def get_library_membership(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve central library smart card membership, book borrowing quotas, and digital access."""
    return institutional_erp_service.get_library_membership(student_id)


@router.get("/library/issued-books")
def get_issued_books(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve currently checked-out textbooks, return due dates, and renewal counter."""
    return institutional_erp_service.get_issued_books(student_id)


@router.get("/library/log")
def get_library_log(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve historical book borrowing, return receipts, and archival log."""
    return institutional_erp_service.get_library_log(student_id)


@router.get("/library/fine")
def get_library_fine(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve overdue textbook charges and library financial standing."""
    return institutional_erp_service.get_library_fine(student_id)


@router.get("/library/attendance")
def get_library_attendance(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve library turnstile attendance records, visit frequency, and study hours."""
    return institutional_erp_service.get_library_attendance(student_id)


# =============================================================================
# MODULE 7: OTHER SERVICES ENDPOINTS
# =============================================================================

@router.get("/services/transport")
def get_transport(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve campus shuttle passes, metro feeder connectivity, and regional bus routes."""
    return institutional_erp_service.get_transport(student_id)


@router.get("/services/training-placement")
def get_training_placement(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve CRPC placement drives, Google/Microsoft shortlists, and coding credentials."""
    return institutional_erp_service.get_training_placement(student_id)


@router.get("/services/sibling-info")
@router.get("/services/sibling")
def get_sibling_info(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve sibling academic enrolment details and institutional fee concessions."""
    return institutional_erp_service.get_sibling_info(student_id)


@router.get("/services/gallery")
def get_gallery(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve institutional event photo albums, fest highlights, and student tags."""
    return institutional_erp_service.get_gallery(student_id)


@router.get("/services/notices")
def get_notices(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve official circulars, exam notifications, and placement bulletins."""
    return institutional_erp_service.get_notices(student_id)


@router.get("/services/diary")
def get_diary(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve daily academic lecture diary entries, topics taught, and class notes."""
    return institutional_erp_service.get_diary(student_id)


@router.get("/services/homework")
def get_homework(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve daily homework exercises, mini project tasks, and lab deliverables."""
    return institutional_erp_service.get_homework(student_id)


@router.get("/services/ptm")
@router.get("/services/student-ptm")
def get_student_ptm(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve Parent-Teacher Meeting minutes, mentor remarks, and guardian reviews."""
    return institutional_erp_service.get_student_ptm(student_id)


@router.get("/services/no-dues")
def get_no_dues(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve multi-departmental institutional No-Dues clearance matrix."""
    return institutional_erp_service.get_no_dues(student_id)


@router.get("/services/seating-plan")
def get_seating_plan(
    student_id: str = Query("CS-2022-04", description="Unique student registration ID"),
    current_user=Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve exam hall allocation, desk numbers, and invigilator details."""
    return institutional_erp_service.get_seating_plan(student_id)
