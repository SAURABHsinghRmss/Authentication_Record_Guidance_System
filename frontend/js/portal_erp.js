/**
 * Institutional Academic ERP Portal - Frontend State & Logic
 * ==========================================================
 * Manages state and API operations for all 7 institutional ERP modules:
 * 1. Academic (Timetable, Calendar, Course Plan, Assignments, Attendance, Leaves, Mentor, Class Teacher)
 * 2. Examination (Results, Datesheet, Registration, Subject Registration)
 * 3. Fees & Accounts (Structure, Dues, Payments, Balance, Waivers, Scholarships, Ledgers, NEFT/RTGS)
 * 4. Hostel & Mess (Room Allocation, Status, Gate Pass / Leaves, Previous Records, Mess Menu)
 * 5. Administration (Official Profile, DigiLocker Status, Doc Requests, Grievances, Helpdesk, Feedback)
 * 6. Library & Learning (Membership, Issued Books, Circulation History, Overdue Fines, Footfall)
 * 7. Campus Services (Transport, Training & Placement, Siblings, Gallery, Notices, Diary, PTM, No Dues, Seating)
 */

// ============================================================================
// 1. API Endpoint Routing Map
// ============================================================================
const PORTAL_ERP_ENDPOINT_MAP = {
  // Academic Module (8 Sub-pages)
  'academic/time_table': '/api/institutional-erp/academic/timetable',
  'academic/calendar': '/api/institutional-erp/academic/calendar',
  'academic/course_plan': '/api/institutional-erp/academic/course-plan',
  'academic/assignment': '/api/institutional-erp/academic/assignments',
  'academic/attendance': '/api/institutional-erp/academic/attendance',
  'academic/student_leaves': '/api/institutional-erp/academic/student-leaves',
  'academic/mentor_counselling': '/api/institutional-erp/academic/mentor-counselling',
  'academic/class_teacher': '/api/institutional-erp/academic/class-teacher',

  // Examination Module (4 Sub-pages)
  'exam/exam_result': '/api/institutional-erp/exam/results',
  'exam/exam_datesheet': '/api/institutional-erp/exam/datesheet',
  'exam/exam_registration': '/api/institutional-erp/exam/registration',
  'exam/subject_registration': '/api/institutional-erp/exam/subject-registration',

  // Fees & Accounts Module (12 Sub-pages)
  'fees/fee_structure': '/api/institutional-erp/fees/structure',
  'fees/dues': '/api/institutional-erp/fees/dues',
  'fees/payments': '/api/institutional-erp/fees/payments',
  'fees/balance': '/api/institutional-erp/fees/balance',
  'fees/registration_fee': '/api/institutional-erp/fees/registration-fee',
  'fees/discount_waived': '/api/institutional-erp/fees/discount-waiver',
  'fees/scholarship': '/api/institutional-erp/fees/scholarship',
  'fees/adjustment': '/api/institutional-erp/fees/adjustment',
  'fees/fee_relaxation': '/api/institutional-erp/fees/relaxation',
  'fees/refund': '/api/institutional-erp/fees/refund',
  'fees/pocket_money': '/api/institutional-erp/fees/pocket-money',
  'fees/cheque_bounce': '/api/institutional-erp/fees/cheque-bounce',
  'fees/head_wise': '/api/institutional-erp/fees/head-wise',
  'fees/bank_neft_rtgs': '/api/institutional-erp/fees/bank-neft-rtgs',

  // Hostel & Mess Module (5 Sub-pages)
  'hostel/my_room': '/api/institutional-erp/hostel/my-room',
  'hostel/room_status': '/api/institutional-erp/hostel/room-status',
  'hostel/hostel_leave': '/api/institutional-erp/hostel/leave',
  'hostel/previous_registration': '/api/institutional-erp/hostel/previous-registration',
  'hostel/mess_menu': '/api/institutional-erp/hostel/mess-menu',

  // Administration Module (6 Sub-pages)
  'administration/official_detail': '/api/institutional-erp/admin/official-detail',
  'administration/document_status': '/api/institutional-erp/admin/document-status',
  'administration/document_request': '/api/institutional-erp/admin/document-request',
  'administration/grievance': '/api/institutional-erp/admin/grievance',
  'administration/helpdesk': '/api/institutional-erp/admin/helpdesk',
  'administration/feedback': '/api/institutional-erp/admin/feedback',

  // Library Module (5 Sub-pages)
  'library/membership': '/api/institutional-erp/library/membership',
  'library/issued_book': '/api/institutional-erp/library/issued-books',
  'library/previous_log': '/api/institutional-erp/library/log',
  'library/fine': '/api/institutional-erp/library/fine',
  'library/library_attendance': '/api/institutional-erp/library/attendance',

  // Other Services Module (10 Sub-pages)
  'other_services/transport': '/api/institutional-erp/services/transport',
  'other_services/training_placement': '/api/institutional-erp/services/training-placement',
  'other_services/sibling': '/api/institutional-erp/services/sibling',
  'other_services/gallery': '/api/institutional-erp/services/gallery',
  'other_services/notice': '/api/institutional-erp/services/notices',
  'other_services/diary': '/api/institutional-erp/services/diary',
  'other_services/homework': '/api/institutional-erp/services/homework',
  'other_services/student_ptm': '/api/institutional-erp/services/student-ptm',
  'other_services/no_dues': '/api/institutional-erp/services/no-dues',
  'other_services/seating_plan': '/api/institutional-erp/services/seating-plan'
};

// ============================================================================
// 2. Realistic Simulated ERP Fallback Data Provider
// Ensures seamless offline UX & demo capabilities when backend routes spin up
// ============================================================================
function getPortalERPRealisticData(module, subpage, studentId = 'CS-2022-04') {
  const dataset = {
    // ------------------------------------------------------------------------
    // Academic
    // ------------------------------------------------------------------------
    'academic/time_table': {
      status: 'success',
      module: 'academic',
      subpage: 'time_table',
      student_id: studentId,
      student_name: 'Amit Sharma',
      semester: 'Semester 6 (Spring 2026)',
      branch: 'Computer Science & Engineering',
      section: 'CSE-6A',
      classroom: 'Academic Block C - Room 301',
      schedule: [
        {
          day: 'Monday',
          slots: [
            { time: '09:00 - 10:00', code: 'CS601', title: 'Distributed Systems & Cloud Computing', room: 'LH-301', faculty: 'Dr. Priya Sen', type: 'Lecture' },
            { time: '10:00 - 11:00', code: 'CS602', title: 'Compiler Design & Automata', room: 'LH-301', faculty: 'Prof. Rajesh Nair', type: 'Lecture' },
            { time: '11:15 - 01:15', code: 'CS605P', title: 'AI & Neural Networks Laboratory', room: 'Lab-4 (Block B)', faculty: 'Dr. Ananya Roy', type: 'Practical Lab' },
            { time: '02:00 - 03:00', code: 'CS603', title: 'Cyber Security & Cryptography', room: 'LH-302', faculty: 'Dr. Vikram Malhotra', type: 'Lecture' },
            { time: '03:00 - 04:00', code: 'LIB01', title: 'Library & Research Colloquium', room: 'Central Library', faculty: 'Dept. Mentors', type: 'Self Study' }
          ]
        },
        {
          day: 'Tuesday',
          slots: [
            { time: '09:00 - 10:00', code: 'CS602', title: 'Compiler Design & Automata', room: 'LH-301', faculty: 'Prof. Rajesh Nair', type: 'Lecture' },
            { time: '10:00 - 11:00', code: 'CS604', title: 'Software Engineering & DevOps CI/CD', room: 'LH-301', faculty: 'Dr. Sunita Varma', type: 'Lecture' },
            { time: '11:15 - 12:15', code: 'CS603', title: 'Cyber Security & Cryptography', room: 'LH-302', faculty: 'Dr. Vikram Malhotra', type: 'Lecture' },
            { time: '01:15 - 03:15', code: 'CS606P', title: 'Distributed Systems & Docker Lab', room: 'Cloud Computing Lab', faculty: 'Dr. Priya Sen', type: 'Practical Lab' }
          ]
        },
        {
          day: 'Wednesday',
          slots: [
            { time: '09:00 - 10:00', code: 'CS601', title: 'Distributed Systems & Cloud Computing', room: 'LH-301', faculty: 'Dr. Priya Sen', type: 'Lecture' },
            { time: '10:00 - 11:00', code: 'OE601', title: 'AICTE Open Elective: Renewable Energy', room: 'Audi-2', faculty: 'Prof. K. K. Mishra', type: 'Elective' },
            { time: '11:15 - 01:15', code: 'PRJ601', title: 'Capstone Project Studio (Raft AI)', room: 'Project Lab 3', faculty: 'Dr. Priya Sen', type: 'Project' },
            { time: '02:00 - 03:00', code: 'CS604', title: 'Software Engineering & DevOps CI/CD', room: 'LH-301', faculty: 'Dr. Sunita Varma', type: 'Lecture' }
          ]
        },
        {
          day: 'Thursday',
          slots: [
            { time: '09:00 - 10:00', code: 'CS603', title: 'Cyber Security & Cryptography', room: 'LH-302', faculty: 'Dr. Vikram Malhotra', type: 'Lecture' },
            { time: '10:00 - 11:00', code: 'CS601', title: 'Distributed Systems & Cloud Computing', room: 'LH-301', faculty: 'Dr. Priya Sen', type: 'Lecture' },
            { time: '11:15 - 12:15', code: 'CS602', title: 'Compiler Design & Automata', room: 'LH-301', faculty: 'Prof. Rajesh Nair', type: 'Lecture' },
            { time: '02:00 - 04:00', code: 'MEN01', title: 'Faculty 1-on-1 Mentor Guidance Hour', room: 'Cabin 312', faculty: 'Dr. Priya Sen', type: 'Mentoring' }
          ]
        },
        {
          day: 'Friday',
          slots: [
            { time: '09:00 - 10:00', code: 'CS604', title: 'Software Engineering & DevOps CI/CD', room: 'LH-301', faculty: 'Dr. Sunita Varma', type: 'Lecture' },
            { time: '10:00 - 11:00', code: 'OE601', title: 'AICTE Open Elective: Renewable Energy', room: 'Audi-2', faculty: 'Prof. K. K. Mishra', type: 'Elective' },
            { time: '11:15 - 01:15', code: 'CS607P', title: 'Full-Stack Web & Microservices Lab', room: 'Software Lab 1', faculty: 'Er. Naveen Jain', type: 'Practical Lab' },
            { time: '02:00 - 04:00', code: 'AGR01', title: 'Innovation Club & Coding Agora', room: 'Incubation Center', faculty: 'Campus AI Leads', type: 'Agora' }
          ]
        }
      ]
    },

    'academic/calendar': {
      status: 'success',
      module: 'academic',
      subpage: 'calendar',
      academic_year: '2025-2026',
      semester_term: 'Even Semester (Jan - June 2026)',
      notices: 'All students are advised to maintain a minimum of 75% biometric attendance per AICTE norms.',
      events: [
        { date: '2026-01-12', title: 'Commencement of Classes & Academic Registration', category: 'Academic', status: 'Completed' },
        { date: '2026-01-26', title: 'Republic Day Celebration & Flag Hoisting', category: 'Holiday', status: 'Completed' },
        { date: '2026-02-23', title: 'Mid-Semester Exam 1 (Class Assessment Test)', category: 'Exam', status: 'Completed' },
        { date: '2026-03-20', title: 'Annual Cultural & Tech Festival — Innovista 2026', category: 'Campus Fest', status: 'Completed' },
        { date: '2026-04-14', title: 'Dr. B.R. Ambedkar Jayanti (Institutional Holiday)', category: 'Holiday', status: 'Upcoming' },
        { date: '2026-04-20', title: 'Pre-University Examinations (PUE) & Practical Vivas', category: 'Exam', status: 'Upcoming' },
        { date: '2026-05-02', title: 'End-Term Teaching Lock & Attendance Submission', category: 'Academic', status: 'Upcoming' },
        { date: '2026-05-18', title: 'AKTU / Autonomous University Theory Examinations', category: 'Exam', status: 'Upcoming' },
        { date: '2026-06-15', title: 'Summer Industrial Internship & Research Fellowship', category: 'Placement', status: 'Upcoming' }
      ]
    },

    'academic/course_plan': {
      status: 'success',
      module: 'academic',
      subpage: 'course_plan',
      degree: 'B.Tech in Computer Science & Engineering',
      curriculum_year: '2022-2026 (Autonomous R22 Scheme)',
      courses: [
        {
          code: 'CS601',
          name: 'Distributed Systems & Cloud Computing',
          credits: 4,
          instructor: 'Dr. Priya Sen',
          hours_allocated: 45,
          hours_completed: 34,
          units: [
            { unit: 'Unit 1', name: 'Distributed System Models & Characterization', progress: 100, status: 'Done' },
            { unit: 'Unit 2', name: 'Interprocess Communication & RPC/gRPC Protocols', progress: 100, status: 'Done' },
            { unit: 'Unit 3', name: 'Distributed Consensus: Raft, Paxos, Vector Clocks', progress: 90, status: 'Ongoing' },
            { unit: 'Unit 4', name: 'Cloud Native Microservices, Docker & Kubernetes', progress: 60, status: 'Ongoing' },
            { unit: 'Unit 5', name: 'Distributed Key-Value Stores & Byzantine Faults', progress: 0, status: 'Upcoming' }
          ]
        },
        {
          code: 'CS602',
          name: 'Compiler Design & Automata',
          credits: 4,
          instructor: 'Prof. Rajesh Nair',
          hours_allocated: 42,
          hours_completed: 30,
          units: [
            { unit: 'Unit 1', name: 'Lexical Analysis & DFA Minimization', progress: 100, status: 'Done' },
            { unit: 'Unit 2', name: 'Syntax Parsing (LL(1), LR(0), LALR)', progress: 100, status: 'Done' },
            { unit: 'Unit 3', name: 'Syntax-Directed Translation & AST Construction', progress: 85, status: 'Ongoing' },
            { unit: 'Unit 4', name: 'Intermediate Code Generation (Three-Address Code)', progress: 20, status: 'Upcoming' },
            { unit: 'Unit 5', name: 'Code Optimization & Register Allocation', progress: 0, status: 'Upcoming' }
          ]
        },
        {
          code: 'CS603',
          name: 'Cyber Security & Cryptography',
          credits: 3,
          instructor: 'Dr. Vikram Malhotra',
          hours_allocated: 38,
          hours_completed: 28,
          units: [
            { unit: 'Unit 1', name: 'Classical Ciphers & Number Theory', progress: 100, status: 'Done' },
            { unit: 'Unit 2', name: 'Symmetric Encryption: AES, DES & Block Modes', progress: 100, status: 'Done' },
            { unit: 'Unit 3', name: 'Asymmetric Ciphers: RSA, ECC & Diffie-Hellman', progress: 95, status: 'Ongoing' },
            { unit: 'Unit 4', name: 'Zero-Knowledge Proofs & Blockchain Authentication', progress: 30, status: 'Upcoming' }
          ]
        }
      ]
    },

    'academic/assignment': {
      status: 'success',
      module: 'academic',
      subpage: 'assignment',
      student_id: studentId,
      total_assignments: 6,
      submitted: 5,
      graded: 4,
      assignments: [
        { id: 'ASG-CS601-01', subject: 'Distributed Systems', title: 'Raft Consensus State Machine Simulation', due_date: '2026-03-10', score: '24 / 25', status: 'Graded', remarks: 'Exceptional test suite covering split-vote elections.' },
        { id: 'ASG-CS602-01', subject: 'Compiler Design', title: 'Lex & Yacc Parser for Boolean Expressions', due_date: '2026-03-24', score: '19 / 20', status: 'Graded', remarks: 'Clean grammatical grammar grammar rules.' },
        { id: 'ASG-CS603-01', subject: 'Cyber Security', title: 'Elliptic Curve Digital Signature (ECDSA) in Python', due_date: '2026-04-05', score: '20 / 20', status: 'Graded', remarks: 'Flawless verification test vectors.' },
        { id: 'ASG-CS604-01', subject: 'Software Engineering', title: 'Automated CI/CD Pipeline with GitHub Actions', due_date: '2026-04-18', score: 'Pending', status: 'Submitted', remarks: 'Submitted on 2026-04-16. Under review.' },
        { id: 'ASG-CS601-02', subject: 'Distributed Systems', title: 'Polyglot SQLite Federation Query Benchmark', due_date: '2026-04-28', score: 'Pending', status: 'Drafting', remarks: 'Due in 6 days. Code committed to Git repository.' }
      ]
    },

    'academic/attendance': {
      status: 'success',
      module: 'academic',
      subpage: 'attendance',
      student_id: studentId,
      student_name: 'Amit Sharma',
      overall_percentage: 88.5,
      total_lectures_conducted: 240,
      total_lectures_attended: 212,
      statutory_threshold: 75.0,
      admit_card_eligibility: 'CLEARED & ELIGIBLE',
      subject_summary: [
        { code: 'CS601', subject: 'Distributed Systems & Cloud Computing', attended: 32, total: 34, percentage: 94.1, color: 'emerald' },
        { code: 'CS602', subject: 'Compiler Design & Automata', attended: 26, total: 30, percentage: 86.7, color: 'emerald' },
        { code: 'CS603', subject: 'Cyber Security & Cryptography', attended: 25, total: 28, percentage: 89.3, color: 'emerald' },
        { code: 'CS604', subject: 'Software Engineering & DevOps', attended: 27, total: 32, percentage: 84.4, color: 'emerald' },
        { code: 'OE601', subject: 'Renewable Energy Systems', attended: 23, total: 26, percentage: 88.5, color: 'emerald' },
        { code: 'CS605P', subject: 'AI & Neural Networks Lab', attended: 14, total: 15, percentage: 93.3, color: 'emerald' },
        { code: 'CS606P', subject: 'Cloud & Distributed Systems Lab', attended: 15, total: 15, percentage: 100.0, color: 'emerald' }
      ]
    },

    'academic/student_leaves': {
      status: 'success',
      module: 'academic',
      subpage: 'student_leaves',
      student_id: studentId,
      allowance: { medical: 10, casual: 6, duty_academic: 8 },
      availed: { medical: 3, casual: 1, duty_academic: 3 },
      leaves: [
        { id: 'LV-2026-041', type: 'Medical Leave', dates: '2026-02-14 to 2026-02-16', days: 3, reason: 'Viral influenza medical recuperation', status: 'Approved', approved_by: 'Dr. Priya Sen (HOD / Mentor)', certificate_attached: 'yes' },
        { id: 'LV-2026-088', type: 'Duty Leave', dates: '2026-03-05 to 2026-03-07', days: 3, reason: 'Smart India Hackathon 2026 Zonal Round', status: 'Approved', approved_by: 'Dean Student Welfare (DSW)', certificate_attached: 'yes' },
        { id: 'LV-2026-112', type: 'Casual Leave', dates: '2026-04-02', days: 1, reason: 'Family engagement outstation travel', status: 'Approved', approved_by: 'Class Coordinator', certificate_attached: 'no' }
      ]
    },

    'academic/mentor_counselling': {
      status: 'success',
      module: 'academic',
      subpage: 'mentor_counselling',
      mentor_info: {
        name: 'Dr. Priya Sen',
        role: 'Faculty Mentor & Associate Professor',
        department: 'Computer Science & Engineering',
        cabin: 'Room 312, Academic Block C',
        email: 'priya.sen@glbitm.ac.in',
        phone: '+91 98765 43210',
        mentoring_slots: 'Mon, Wed, Thu (2:00 PM - 4:00 PM)'
      },
      counselling_records: [
        { date: '2026-02-10', focus: 'Semester 6 Elective & Career Roadmapping', notes: 'Advised on selecting Cloud Architecture and preparing for GATE 2027 and sovereign AI research fellowships.', status: 'Completed' },
        { date: '2026-03-18', focus: 'Capstone Project Architecture Review', notes: 'Reviewed 7-DB Polyglot SQLite ledger federation design and approved prototype demonstration for internal jury.', status: 'Completed' },
        { date: '2026-04-12', focus: 'Pre-Placement Preparation & Resume Audit', notes: 'Verified GitHub portfolio and advised on distributed algorithms mock coding rounds.', status: 'Completed' }
      ]
    },

    'academic/class_teacher': {
      status: 'success',
      module: 'academic',
      subpage: 'class_teacher',
      class_teacher: {
        name: 'Dr. Priya Sen',
        designation: 'Senior Faculty & Section 6A Coordinator',
        qualification: 'Ph.D. in Computer Science (IIT Delhi)',
        cabin_location: 'Academic Block C, Floor 3, Room 312',
        email: 'priya.sen@glbitm.ac.in',
        contact_phone: '+91 98765 43210',
        office_hours: 'Daily 01:15 PM - 02:00 PM & 04:00 PM - 05:00 PM',
        specialization: 'Distributed Systems, Sovereign AI & Consensus Protocols',
        recent_broadcast: 'Please review your internal assessment marks and ensure DigiLocker APAAR IDs are synchronized.'
      }
    },

    // ------------------------------------------------------------------------
    // Examination
    // ------------------------------------------------------------------------
    'exam/exam_result': {
      status: 'success',
      module: 'exam',
      subpage: 'exam_result',
      student_id: studentId,
      student_name: 'Amit Sharma',
      cgpa: '8.65',
      total_credits_earned: 132,
      standing: 'Dean\'s Honor List (First Class with Distinction)',
      semesters: [
        {
          semester: 'Semester 5 (Autumn 2025)',
          sgpa: '8.80',
          credits: 24,
          result: 'PASSED',
          subjects: [
            { code: 'CS501', title: 'Database Management Systems', credits: 4, grade: 'A+', points: 10 },
            { code: 'CS502', title: 'Design & Analysis of Algorithms', credits: 4, grade: 'A', points: 9 },
            { code: 'CS503', title: 'Theory of Computation', credits: 4, grade: 'A', points: 9 },
            { code: 'CS504', title: 'Computer Networks', credits: 4, grade: 'A+', points: 10 },
            { code: 'CS505P', title: 'DBMS Laboratory', credits: 2, grade: 'O (Outstanding)', points: 10 },
            { code: 'CS506P', title: 'Algorithms Coding Studio', credits: 2, grade: 'A+', points: 10 }
          ]
        },
        {
          semester: 'Semester 4 (Spring 2025)',
          sgpa: '8.50',
          credits: 24,
          result: 'PASSED'
        },
        {
          semester: 'Semester 3 (Autumn 2024)',
          sgpa: '8.60',
          credits: 24,
          result: 'PASSED'
        }
      ]
    },

    'exam/exam_datesheet': {
      status: 'success',
      module: 'exam',
      subpage: 'exam_datesheet',
      examination: 'Even Semester University Final Theory Examinations 2026',
      center_name: 'GL Bajaj Examination Center — Block A & B',
      reporting_time: '30 minutes before commencement',
      schedule: [
        { date: '2026-05-18', time: '09:30 AM - 12:30 PM', code: 'CS601', subject: 'Distributed Systems & Cloud Computing', center: 'Hall A-101' },
        { date: '2026-05-21', time: '09:30 AM - 12:30 PM', code: 'CS602', subject: 'Compiler Design & Automata', center: 'Hall A-101' },
        { date: '2026-05-24', time: '09:30 AM - 12:30 PM', code: 'CS603', subject: 'Cyber Security & Cryptography', center: 'Hall B-204' },
        { date: '2026-05-27', time: '09:30 AM - 12:30 PM', code: 'CS604', subject: 'Software Engineering & DevOps', center: 'Hall B-204' },
        { date: '2026-05-30', time: '09:30 AM - 12:30 PM', code: 'OE601', subject: 'AICTE Open Elective: Renewable Energy', center: 'Auditorium' }
      ]
    },

    'exam/exam_registration': {
      status: 'success',
      module: 'exam',
      subpage: 'exam_registration',
      admit_card_no: 'AKTU-2026-CS-0941',
      roll_no: '2201920100042',
      hall_ticket_status: 'CONFIRMED & ISSUED',
      biometrics_matched: true,
      exam_fee_cleared: true,
      qr_code_token: 'QR-AKTU-2026-CS-AMIT-VERIFIED',
      instructions: 'Carrying cell phones or smart watches into examination halls is strictly prohibited under statutory regulations.'
    },

    'exam/subject_registration': {
      status: 'success',
      module: 'exam',
      subpage: 'subject_registration',
      student_id: studentId,
      session: 'Spring 2026 (6th Semester)',
      registration_timestamp: '2026-01-14T11:20:00Z',
      approved_by_dean: true,
      registered_courses: [
        { code: 'CS601', title: 'Distributed Systems & Cloud Computing', type: 'Core Theory', credits: 4 },
        { code: 'CS602', title: 'Compiler Design & Automata', type: 'Core Theory', credits: 4 },
        { code: 'CS603', title: 'Cyber Security & Cryptography', type: 'Core Theory', credits: 3 },
        { code: 'CS604', title: 'Software Engineering & DevOps', type: 'Core Theory', credits: 3 },
        { code: 'OE601', title: 'Renewable Energy Systems', type: 'Open Elective', credits: 3 },
        { code: 'CS605P', title: 'AI & Neural Networks Lab', type: 'Practical Lab', credits: 2 },
        { code: 'CS606P', title: 'Cloud & Distributed Systems Lab', type: 'Practical Lab', credits: 2 }
      ]
    },

    // ------------------------------------------------------------------------
    // Fees & Accounts
    // ------------------------------------------------------------------------
    'fees/fee_structure': {
      status: 'success',
      module: 'fees',
      subpage: 'fee_structure',
      academic_year: '2025-2026',
      total_annual_fee_inr: 145000,
      breakdown: [
        { head: 'Tuition Fee (Statutory AICTE Approved)', semester_1: 55000, semester_2: 55000, total: 110000 },
        { head: 'Development & Infrastructure Fee', semester_1: 10000, semester_2: 10000, total: 20000 },
        { head: 'Laboratory & Digital Cloud Lab Charges', semester_1: 4500, semester_2: 4500, total: 9000 },
        { head: 'Central Library & Digital Database Access', semester_1: 2000, semester_2: 2000, total: 4000 },
        { head: 'Student Welfare & Sports Fund', semester_1: 1000, semester_2: 1000, total: 2000 }
      ]
    },

    'fees/dues': {
      status: 'success',
      module: 'fees',
      subpage: 'dues',
      student_id: studentId,
      net_pending_dues_inr: 0.0,
      dues_status: 'NO OUTSTANDING DUES (ALL CLEARED)',
      next_due_date: '2026-07-15 (Semester 7 Advance)',
      upcoming_schedule: [
        { item: 'Semester 7 Tuition Installment', due_date: '2026-07-15', amount_inr: 65000, status: 'Upcoming' },
        { item: 'Annual Hostel & Mess Renewal (Optional)', due_date: '2026-07-20', amount_inr: 85000, status: 'Upcoming' }
      ]
    },

    'fees/payments': {
      status: 'success',
      module: 'fees',
      subpage: 'payments',
      student_id: studentId,
      transactions: [
        { receipt_no: 'REC-2026-0941', date: '2026-01-10', amount_inr: 72500, mode: 'SBIePay UPI Gateway', utr: 'UTR-SBI-9988221100', head: 'Semester 6 Tuition & Lab', status: 'CONFIRMED' },
        { receipt_no: 'REC-2025-4421', date: '2025-07-18', amount_inr: 72500, mode: 'HDFC NetBanking', utr: 'UTR-HDFC-3322114455', head: 'Semester 5 Tuition & Lab', status: 'CONFIRMED' },
        { receipt_no: 'REC-2025-1109', date: '2025-01-12', amount_inr: 70000, mode: 'SBI NEFT Transfer', utr: 'UTR-NEFT-5566778899', head: 'Semester 4 Tuition', status: 'CONFIRMED' }
      ]
    },

    'fees/balance': {
      status: 'success',
      module: 'fees',
      subpage: 'balance',
      student_id: studentId,
      caution_money_held_inr: 10000,
      refundable_security_deposit_inr: 5000,
      student_wallet_imprest_inr: 3250,
      total_balance_credit_inr: 18250,
      account_health: 'EXEMPLARY / HEALTHY'
    },

    'fees/registration_fee': {
      status: 'success',
      module: 'fees',
      subpage: 'registration_fee',
      academic_session: '2025-2026',
      registration_fee_inr: 2500,
      payment_date: '2025-07-10',
      challan_number: 'CHL-REG-2025-6677',
      status: 'PAID & VERIFIED BY ACCOUNTS DEPT'
    },

    'fees/discount_waived': {
      status: 'success',
      module: 'fees',
      subpage: 'discount_waived',
      waivers: [
        { scheme: 'Merit Academic Excellence Concession (Top 5% CGPA)', percentage: 15, amount_waived_inr: 16500, approved_by: 'Board of Governors', session: '2025-2026' },
        { scheme: 'SIH Hackathon Winner Tuition Relaxation', percentage: 5, amount_waived_inr: 5500, approved_by: 'Directorate of Academics', session: '2025-2026' }
      ],
      total_waiver_received_inr: 22000
    },

    'fees/scholarship': {
      status: 'success',
      module: 'fees',
      subpage: 'scholarship',
      active_scholarships: [
        {
          name: 'National Scholarship Portal (NSP) — AICTE Pragati & Saksham Scheme',
          application_id: 'NSP-UP-2025-992211',
          disbursed_amount_inr: 50000,
          disbursal_date: '2025-11-20',
          direct_benefit_transfer_account: 'SBI A/C ****4092 (Aadhaar Seeded)',
          status: 'DISBURSED'
        }
      ]
    },

    'fees/adjustment': {
      status: 'success',
      module: 'fees',
      subpage: 'adjustment',
      adjustments: [
        { date: '2026-01-11', type: 'Credit Adjustment', original_receipt: 'REC-2026-0941', amount_inr: 1200, reason: 'Excess laboratory consumables refund credited to next semester ledger', authorized_by: 'Chief Accounts Officer' }
      ]
    },

    'fees/fee_relaxation': {
      status: 'success',
      module: 'fees',
      subpage: 'fee_relaxation',
      requests: [
        { id: 'RLX-2025-01', request_date: '2025-07-05', installment_plan: 'Split into 2 Equal Tranches (50% July, 50% August)', reason: 'Agricultural seasonal harvest cash flow timing', status: 'Approved & Completed', cleared_on: '2025-08-25' }
      ]
    },

    'fees/refund': {
      status: 'success',
      module: 'fees',
      subpage: 'refund',
      policy: 'Statutory AICTE Guidelines on Institutional Fee Refunds',
      requests: [
        { request_id: 'REF-2024-002', type: 'Hostel Maintenance Security Clearance', amount_inr: 5000, status: 'Processed & Credited', credited_date: '2024-08-15' }
      ]
    },

    'fees/pocket_money': {
      status: 'success',
      module: 'fees',
      subpage: 'pocket_money',
      current_balance_inr: 3250.0,
      monthly_spending_limit_inr: 10000.0,
      ledger: [
        { date: '2026-04-10', description: 'Central Cafeteria Smart Card Tap', amount_inr: -120, balance_inr: 3250 },
        { date: '2026-04-05', description: 'Campus Stationary & Print Studio', amount_inr: -80, balance_inr: 3370 },
        { date: '2026-04-01', description: 'Parent Imprest Top-Up (SBI UPI)', amount_inr: +2500, balance_inr: 3450 }
      ]
    },

    'fees/cheque_bounce': {
      status: 'success',
      module: 'fees',
      subpage: 'cheque_bounce',
      student_id: studentId,
      dishonored_records: [],
      status_note: 'Clean Record — 0 Cheque Bounces or Penalties Recorded.'
    },

    'fees/head_wise': {
      status: 'success',
      module: 'fees',
      subpage: 'head_wise',
      financial_year: '2025-2026',
      heads: [
        { code: 'H01', name: 'Tuition Fee', debited_inr: 110000, credited_inr: 110000, pending_inr: 0 },
        { code: 'H02', name: 'Laboratory & Scientific Consumables', debited_inr: 9000, credited_inr: 9000, pending_inr: 0 },
        { code: 'H03', name: 'University Examination Registration', debited_inr: 5000, credited_inr: 5000, pending_inr: 0 },
        { code: 'H04', name: 'Institutional Development Fund', debited_inr: 20000, credited_inr: 20000, pending_inr: 0 },
        { code: 'H05', name: 'Digital Library & E-Journals', debited_inr: 4000, credited_inr: 4000, pending_inr: 0 }
      ]
    },

    'fees/bank_neft_rtgs': {
      status: 'success',
      module: 'fees',
      subpage: 'bank_neft_rtgs',
      bank_account_info: {
        beneficiary_name: 'GL Bajaj Institute of Technology & Management',
        bank: 'State Bank of India',
        branch: 'Knowledge Park II, Greater Noida',
        ifsc_code: 'SBIN0013241',
        virtual_account_no: 'GLBACS202204'
      },
      verified_challans: [
        { challan_no: 'CH-NEFT-9911', amount_inr: 72500, utr: 'UTR-SBI-9988221100', bank_name: 'State Bank of India', verification: 'Automated Real-Time PFMS Match' }
      ]
    },

    // ------------------------------------------------------------------------
    // Hostel & Mess
    // ------------------------------------------------------------------------
    'hostel/my_room': {
      status: 'success',
      module: 'hostel',
      subpage: 'my_room',
      student_id: studentId,
      hostel_block: 'Block C — Senior Boys Wing',
      room_number: 'C-314',
      occupancy_type: 'Double Sharing (AC Deluxe)',
      bed_allotment: 'Bed A',
      roommate: {
        name: 'Rahul Verma',
        roll_no: '2201920100065',
        department: 'Information Technology',
        contact: '+91 98112 34567'
      },
      amenities: ['High-Speed Campus Wi-Fi 6', 'Dedicated Study Table & Bookshelf', '24x7 Solar Geyser Hot Water', 'Biometric Turnstile Security Gate']
    },

    'hostel/room_status': {
      status: 'success',
      module: 'hostel',
      subpage: 'room_status',
      inspection_status: 'PASS / VERIFIED',
      cleanliness_rating: '5 / 5',
      furniture_condition: 'All fittings in intact condition (Inspection date: 2026-03-30)',
      maintenance_requests: [
        { id: 'MNT-109', type: 'AC Filter Cleaning', date: '2026-03-12', status: 'Resolved within 24h' }
      ]
    },

    'hostel/hostel_leave': {
      status: 'success',
      module: 'hostel',
      subpage: 'hostel_leave',
      leaves: [
        { id: 'HL-2026-08', destination: 'New Delhi (Home Visit)', departure: '2026-03-28 17:00', return: '2026-03-30 21:00', warden_status: 'Approved', parent_consent_verified: true, gate_pass_qr: 'GP-QR-2026-HL08' },
        { id: 'HL-2026-14', destination: 'Greater Noida Metro City Center', departure: '2026-04-12 14:00', return: '2026-04-12 20:00', warden_status: 'Approved', parent_consent_verified: true, gate_pass_qr: 'GP-QR-2026-HL14' }
      ]
    },

    'hostel/previous_registration': {
      status: 'success',
      module: 'hostel',
      subpage: 'previous_registration',
      history: [
        { session: '2024-2025 (Year 3)', block: 'Block C', room: 'C-314', clearance: 'Full No-Dues Cleared' },
        { session: '2023-2024 (Year 2)', block: 'Block B', room: 'B-205', clearance: 'Full No-Dues Cleared' },
        { session: '2022-2023 (Year 1)', block: 'Block A', room: 'A-108', clearance: 'Full No-Dues Cleared' }
      ]
    },

    'hostel/mess_menu': {
      status: 'success',
      module: 'hostel',
      subpage: 'mess_menu',
      caterer: 'Annapurna Institutional Hospitality Services',
      diet_type: 'Nutritious Multi-Cuisine Vegetarian (FSSAI Certified)',
      today_menu: {
        breakfast: 'Aloo Paratha with Curd, Boiled Eggs / Sprouted Moong, Tea & Fresh Milk (07:30 - 09:15 AM)',
        lunch: 'Paneer Butter Masala, Yellow Dal Tadka, Jeera Rice, Tandoori Roti, Salad & Boondi Raita (12:30 - 02:15 PM)',
        snacks: 'Vegetable Samosa with Mint Chutney, Masala Chai & Marie Biscuits (05:00 - 06:00 PM)',
        dinner: 'Kadhai Paneer, Mix Veg, Chana Dal, Steamed Basmati Rice, Phulkas & Gulab Jamun (08:00 - 09:45 PM)'
      }
    },

    // ------------------------------------------------------------------------
    // Administration
    // ------------------------------------------------------------------------
    'administration/official_detail': {
      status: 'success',
      module: 'administration',
      subpage: 'official_detail',
      student_id: studentId,
      full_name: 'Amit Sharma',
      gender: 'Male',
      dob: '2004-08-16',
      blood_group: 'B+',
      permanent_address: 'Flat 402, Royal Residency, Sector 62, Noida, UP, India',
      enrollment_number: '2201920100042',
      apaar_id: 'APAAR-9988-7766-5544',
      national_id_type: 'Aadhaar Card (UIDAI Verified)',
      father_name: 'Mr. Rajesh Sharma',
      mother_name: 'Mrs. Sunita Sharma',
      emergency_contact: '+91 98101 23456',
      institutional_affiliation: 'GL Bajaj Institute of Technology & Management (AICTE Approved)'
    },

    'administration/document_status': {
      status: 'success',
      module: 'administration',
      subpage: 'document_status',
      documents: [
        { doc_name: 'Class 10th High School Marksheet', authority: 'CBSE Delhi', status: 'DigiLocker Verified', verified_on: '2022-08-10' },
        { doc_name: 'Class 12th Intermediate Marksheet', authority: 'CBSE Delhi', status: 'DigiLocker Verified', verified_on: '2022-08-10' },
        { doc_name: 'Aadhaar Identity Card', authority: 'UIDAI', status: 'DigiLocker Verified', verified_on: '2022-08-10' },
        { doc_name: 'JEE Main Entrance Scorecard', authority: 'NTA', status: 'Verified', verified_on: '2022-08-12' },
        { doc_name: 'Permanent Domicile Certificate', authority: 'Govt. of Uttar Pradesh', status: 'Verified', verified_on: '2022-08-12' },
        { doc_name: 'Medical Fitness Certificate', authority: 'Chief Medical Officer', status: 'Verified', verified_on: '2022-08-15' }
      ]
    },

    'administration/document_request': {
      status: 'success',
      module: 'administration',
      subpage: 'document_request',
      requests: [
        { id: 'REQ-DOC-2026-09', type: 'Bonafide Certificate', purpose: 'Passport Renewal & Education Loan Verification', requested_on: '2026-04-01', status: 'APPROVED & DIGITALLY SIGNED', download_ready: true },
        { id: 'REQ-DOC-2026-15', type: 'Medium of Instruction Certificate', purpose: 'International Conference Travel Grant', requested_on: '2026-04-14', status: 'In Processing (Registrar Office)', download_ready: false }
      ]
    },

    'administration/grievance': {
      status: 'success',
      module: 'administration',
      subpage: 'grievance',
      cell: 'AICTE Institutional Grievance Redressal Committee (GRC)',
      active_grievances: [
        { id: 'GRV-2026-003', category: 'Academic & Lab Infrastructure', subject: 'Cloud Computing Lab switch port configuration for distributed nodes', filed_on: '2026-03-02', resolution: 'Network switches upgraded to Gigabit Full Duplex on 2026-03-04.', status: 'RESOLVED & CLOSED' }
      ]
    },

    'administration/helpdesk': {
      status: 'success',
      module: 'administration',
      subpage: 'helpdesk',
      desk_categories: ['IT & Campus Wi-Fi', 'ERP & Academic Portal', 'Hostel Facility Management', 'Transportation & Parking', 'Examination Cell'],
      active_tickets: [
        { ticket_id: 'IT-TICK-8841', subject: 'Campus Wi-Fi 802.1x Certificate renewal on Linux laptop', priority: 'Medium', status: 'Resolved by Network Admin', time: '2026-04-10' }
      ]
    },

    'administration/feedback': {
      status: 'success',
      module: 'administration',
      subpage: 'feedback',
      recent_evaluations: [
        { session: 'Semester 5 Exit Survey', faculty: 'Dr. Priya Sen', course: 'DBMS', rating: '5 / 5 (Excellent)', comments: 'Remarkable teaching on transactions, indexing, and polyglot databases.' },
        { session: 'Semester 5 Exit Survey', faculty: 'Dr. Vikram Malhotra', course: 'Computer Networks', rating: '4.8 / 5 (Excellent)', comments: 'Great hands-on Wireshark packet analysis sessions.' }
      ]
    },

    // ------------------------------------------------------------------------
    // Library
    // ------------------------------------------------------------------------
    'library/membership': {
      status: 'success',
      module: 'library',
      subpage: 'membership',
      student_id: studentId,
      card_number: 'LIB-GLB-2022-0941',
      membership_category: 'Undergraduate Engineering (B.Tech CSE)',
      book_borrowing_limit: 6,
      current_books_borrowed: 3,
      valid_till: '2026-06-30',
      status: 'ACTIVE & IN GOOD STANDING'
    },

    'library/issued_book': {
      status: 'success',
      module: 'library',
      subpage: 'issued_book',
      books: [
        { accession_no: 'ACC-88219', title: 'Distributed Systems: Concepts and Design (5th Ed.)', author: 'George Coulouris, Jean Dollimore', issued_on: '2026-04-01', due_date: '2026-04-29', days_remaining: 7, renewal_count: 1 },
        { accession_no: 'ACC-90412', title: 'Compilers: Principles, Techniques, and Tools (Dragon Book)', author: 'Alfred Aho, Jeffrey Ullman', issued_on: '2026-04-03', due_date: '2026-05-01', days_remaining: 9, renewal_count: 0 },
        { accession_no: 'ACC-77651', title: 'Cryptography and Network Security', author: 'William Stallings', issued_on: '2026-04-08', due_date: '2026-05-06', days_remaining: 14, renewal_count: 0 }
      ]
    },

    'library/previous_log': {
      status: 'success',
      module: 'library',
      subpage: 'previous_log',
      circulation_history: [
        { accession_no: 'ACC-66102', title: 'Database System Concepts (Silberschatz)', returned_on: '2025-12-14', condition: 'Good', fine_charged: 0 },
        { accession_no: 'ACC-55219', title: 'Introduction to Algorithms (CLRS 3rd Ed.)', returned_on: '2025-12-10', condition: 'Good', fine_charged: 0 },
        { accession_no: 'ACC-44180', title: 'Computer Networks (Tanenbaum)', returned_on: '2025-06-20', condition: 'Good', fine_charged: 0 }
      ]
    },

    'library/fine': {
      status: 'success',
      module: 'library',
      subpage: 'fine',
      student_id: studentId,
      outstanding_fine_inr: 0.0,
      fine_history: [
        { date: '2025-05-10', reason: 'Delayed return by 2 days for Artificial Intelligence (Russell & Norvig)', amount_inr: 20, status: 'Paid via Smart Card' }
      ]
    },

    'library/library_attendance': {
      status: 'success',
      module: 'library',
      subpage: 'library_attendance',
      monthly_reading_hours: 38.5,
      total_visits_this_semester: 46,
      rfid_recent_taps: [
        { date: '2026-04-21', time_in: '15:10', time_out: '17:45', duration: '2h 35m', zone: 'Silent Study Wing B' },
        { date: '2026-04-19', time_in: '16:00', time_out: '18:30', duration: '2h 30m', zone: 'Digital Reference Lab' },
        { date: '2026-04-16', time_in: '14:30', time_out: '16:45', duration: '2h 15m', zone: 'Periodicals & AICTE E-Journals' }
      ]
    },

    // ------------------------------------------------------------------------
    // Other Campus Services
    // ------------------------------------------------------------------------
    'other_services/transport': {
      status: 'success',
      module: 'other_services',
      subpage: 'transport',
      bus_route: 'Route 14 (Noida Sector 62 -> Knowledge Park II)',
      bus_number: 'UP-16-BT-4412',
      driver_name: 'Mr. Rakesh Singh',
      driver_mobile: '+91 98711 00998',
      pickup_point: 'Sector 62 Fortis Metro Gate',
      morning_pickup_time: '07:45 AM',
      evening_drop_time: '05:30 PM',
      pass_validity: 'Annual Pass Valid till 2026-06-30'
    },

    'other_services/training_placement': {
      status: 'success',
      module: 'other_services',
      subpage: 'training_placement',
      placement_registration: 'EL-TNP-2026-CS-0941',
      eligibility_tier: 'Super Dream & Tier-1 IT Corporations (No active backlogs, CGPA > 8.0)',
      upcoming_drives: [
        { company: 'Google Cloud India', role: 'Software Engineer - Cloud Systems', package_ctc: '₹ 28.5 LPA', drive_date: '2026-08-15', status: 'Eligible & Registered' },
        { company: 'Microsoft India R&D', role: 'Software Engineer (Distributed AI)', package_ctc: '₹ 26.0 LPA', drive_date: '2026-08-22', status: 'Eligible & Registered' },
        { company: 'Amazon AWS', role: 'Solutions Architect Trainee', package_ctc: '₹ 22.0 LPA', drive_date: '2026-09-02', status: 'Eligible & Registered' }
      ]
    },

    'other_services/sibling': {
      status: 'success',
      module: 'other_services',
      subpage: 'sibling',
      has_registered_sibling: false,
      concession_policy: 'GL Bajaj offers a 10% statutory institutional tuition fee concession for concurrent sibling enrollment across undergraduate engineering and management programs.'
    },

    'other_services/gallery': {
      status: 'success',
      module: 'other_services',
      subpage: 'gallery',
      albums: [
        { title: 'Annual Tech Fest — Innovista 2026', count: 48, cover_tag: 'Hackathon & Robotic Arenas', date: 'March 2026' },
        { title: 'National AICTE Autonomous Convocation 2025', count: 120, cover_tag: 'Degree Conferment Ceremony', date: 'December 2025' },
        { title: 'Inter-College Sports Olympiad', count: 35, cover_tag: 'Cricket, Basketball & Athletics', date: 'November 2025' }
      ]
    },

    'other_services/notice': {
      status: 'success',
      module: 'other_services',
      subpage: 'notice',
      notices: [
        { id: 'NTC-2026-118', title: 'Submission of Capstone Project Phase-II Final Documentation', date: '2026-04-18', issued_by: 'Office of the Dean Academics', priority: 'HIGH', category: 'Academic' },
        { id: 'NTC-2026-115', title: 'Mandatory DigiLocker APAAR ID Seeding for 2026 Degree Parchment', date: '2026-04-10', issued_by: 'Controller of Examinations', priority: 'HIGH', category: 'Compliance' },
        { id: 'NTC-2026-112', title: 'Summer Research Internship Fellowship Applications Open', date: '2026-04-05', issued_by: 'R&D Innovation Cell', priority: 'NORMAL', category: 'Internship' }
      ]
    },

    'other_services/diary': {
      status: 'success',
      module: 'other_services',
      subpage: 'diary',
      student_id: studentId,
      daily_entries: [
        { date: '2026-04-21', subject: 'Distributed Systems (CS601)', topic: 'Paxos 2-Phase Commit vs Raft Log Replication tradeoffs', mentor_note: 'Amit asked pertinent questions on network partition recovery.' },
        { date: '2026-04-20', subject: 'Cyber Security (CS603)', topic: 'Zero-Knowledge Proofs in Decentralized Identity Verification', mentor_note: 'Good conceptual comprehension demonstrated during discussion.' }
      ]
    },

    'other_services/homework': {
      status: 'success',
      module: 'other_services',
      subpage: 'homework',
      homework_tasks: [
        { id: 'HW-601-3', subject: 'Distributed Systems', task: 'Implement Docker Compose cluster with 3 Raft replica nodes and chaos test leader shutdown', deadline: '2026-04-26', status: 'Pending Review' },
        { id: 'HW-602-2', subject: 'Compiler Design', task: 'Construct LALR(1) Parsing Table for arithmetic expression language with shift-reduce resolution', deadline: '2026-04-27', status: 'Completed' }
      ]
    },

    'other_services/student_ptm': {
      status: 'success',
      module: 'other_services',
      subpage: 'student_ptm',
      parent_name: 'Mr. Rajesh Sharma',
      meetings: [
        { date: '2026-02-28', session: 'Mid-Term Parent-Teacher Conference', faculty_mentor: 'Dr. Priya Sen', summary: 'Parent briefed on Amit\'s outstanding academic standing (8.65 CGPA) and Dean\'s List recognition.', outcome: 'Commended academic discipline and encouraged Tier-1 placement track.' }
      ]
    },

    'other_services/no_dues': {
      status: 'success',
      module: 'other_services',
      subpage: 'no_dues',
      student_id: studentId,
      overall_clearance_status: 'CLEARED & READY FOR FINAL PROVISIONAL DEGREE',
      checkpoints: [
        { department: 'Accounts & Finance Cell', status: 'CLEARED', signed_by: 'Chief Accounts Officer', date: '2026-04-10' },
        { department: 'Central Library', status: 'CLEARED', signed_by: 'Chief Librarian', date: '2026-04-11' },
        { department: 'Hostel & Mess Directorate', status: 'CLEARED', signed_by: 'Chief Warden', date: '2026-04-12' },
        { department: 'Computer Science Department Labs', status: 'CLEARED', signed_by: 'Lab Superintendent', date: '2026-04-14' },
        { department: 'Sports & Student Welfare Council', status: 'CLEARED', signed_by: 'Director of Sports', date: '2026-04-15' },
        { department: 'Training & Placement Office', status: 'CLEARED', signed_by: 'T&P Head', date: '2026-04-16' }
      ]
    },

    'other_services/seating_plan': {
      status: 'success',
      module: 'other_services',
      subpage: 'seating_plan',
      examination: 'Even Semester End-Term Examinations 2026',
      hall_ticket_no: 'AKTU-2026-CS-0941',
      allocated_center: 'Block A, Academic Complex',
      exam_room: 'Room A-101 (Air-Conditioned Examination Hall)',
      desk_number: 'Desk 14-B',
      row: 'Row 3 (Center Column)',
      invigilator_station: 'Station Alpha-1'
    }
  };

  const lookupKey = `${module}/${subpage}`;
  return dataset[lookupKey] || {
    status: 'success',
    module: module,
    subpage: subpage,
    student_id: studentId,
    timestamp: new Date().toISOString(),
    message: `Institutional ERP record for ${module} / ${subpage} retrieved successfully.`
  };
}

// ============================================================================
// 3. Portal ERP State & Methods Factory
// ============================================================================
function getPortalERPState() {
  return {
    // ------------------------------------------------------------------------
    // State Properties
    // ------------------------------------------------------------------------
    portalModule: 'academic',
    portalSubPage: 'time_table',
    portalLoading: false,
    portalData: {},
    mentorChatMessages: [
      {
        id: 'msg-init-1',
        sender: 'mentor',
        sender_role: 'faculty',
        sender_name: 'Dr. Priya Sen (Faculty Mentor)',
        text: 'Welcome Amit! How are your Semester 6 preparations and capstone project progressing? Feel free to ask any academic, examination, or institutional guidance queries here.',
        message: 'Welcome Amit! How are your Semester 6 preparations and capstone project progressing? Feel free to ask any academic, examination, or institutional guidance queries here.',
        timestamp: '09:00 AM',
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    mentorChatInput: '',

    // ------------------------------------------------------------------------
    // Method 1: loadPortalData(module, subpage)
    // ------------------------------------------------------------------------
    /**
     * Loads institutional ERP data from the backend API.
     * Makes GET request to /api/institutional-erp/{module}/{subpage}?student_id={id}
     * with Authorization: Bearer {authToken}.
     * Falls back smoothly to structured simulation data if API endpoint is offline.
     */
    async loadPortalData(module, subpage) {
      const activeMod = module || this.portalModule || 'academic';
      const activeSub = subpage || this.portalSubPage || 'time_table';

      this.portalModule = activeMod;
      this.portalSubPage = activeSub;
      this.portalLoading = true;

      const routeKey = `${activeMod}/${activeSub}`;
      const mappedEndpoint = PORTAL_ERP_ENDPOINT_MAP[routeKey] || `/api/institutional-erp/${activeMod}/${activeSub.replace(/_/g, '-')}`;
      const studentId = (this.currentStudent && (this.currentStudent.roll_no || this.currentStudent.student_id)) || 'CS-2022-04';
      const fullUrl = `${mappedEndpoint}?student_id=${encodeURIComponent(studentId)}`;

      try {
        const headers = {
          'Accept': 'application/json'
        };
        if (this.authToken) {
          headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        const res = await fetch(fullUrl, { headers });
        if (res.ok) {
          const json = await res.json();
          this.portalData = json;
        } else {
          console.warn(`[PortalERP] API ${mappedEndpoint} responded with ${res.status}. Rendering rich fallback data.`);
          this.portalData = getPortalERPRealisticData(activeMod, activeSub, studentId);
        }
      } catch (err) {
        console.warn(`[PortalERP] Network error for ${mappedEndpoint} (${err.message}). Rendering rich fallback data.`);
        this.portalData = getPortalERPRealisticData(activeMod, activeSub, studentId);
      } finally {
        this.portalLoading = false;
      }
    },

    // ------------------------------------------------------------------------
    // Method 2: sendMentorChat()
    // ------------------------------------------------------------------------
    /**
     * Sends a mentor chat message from the student to the assigned faculty mentor.
     * Appends to local mentorChatMessages array with current timestamp,
     * resets input, attempts backend persistence, and simulates mentor reply.
     */
    sendMentorChat() {
      const text = (this.mentorChatInput || '').trim();
      if (!text) return;

      const studentName = (this.currentStudent && this.currentStudent.name) || (this.currentUsername === 'amit' ? 'Amit Sharma' : this.currentUsername) || 'Amit Sharma';
      const studentId = (this.currentStudent && (this.currentStudent.roll_no || this.currentStudent.student_id)) || 'CS-2022-04';
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newMsg = {
        id: 'msg-' + Date.now(),
        sender: 'student',
        sender_role: 'student',
        sender_name: studentName,
        text: text,
        message: text,
        timestamp: timeStr,
        created_at: new Date().toISOString()
      };

      if (!Array.isArray(this.mentorChatMessages)) {
        this.mentorChatMessages = [];
      }
      this.mentorChatMessages.push(newMsg);
      this.mentorChatInput = '';

      // Attempt backend persistence if available
      if (this.authToken) {
        fetch('/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify({
            student_id: studentId,
            mentor_username: 'faculty',
            sender_role: 'student',
            sender_name: studentName,
            message: text
          })
        }).catch(() => {
          // Silent fallback in simulated/offline demo mode
        });
      }

      // Simulated mentor reply from Dr. Priya Sen
      setTimeout(() => {
        const responses = [
          `Hello ${studentName}, I have reviewed your academic query. Your attendance standing (88.5%) and coursework are looking great. Let's touch base during Wednesday counselling hour.`,
          `Acknowledged. Please ensure all assignment submissions and lab logbooks are signed before the pre-university exams commence.`,
          `Good progress! Your distributed systems project architecture aligns properly with the autonomous curriculum guidelines.`,
          `I will be available in Room 312, Academic Block C today between 2:00 PM and 4:00 PM if you need to discuss this in person.`,
          `Noted! I have updated your academic progress log in the institutional portal.`
        ];
        const randomReply = responses[Math.floor(Math.random() * responses.length)];
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        this.mentorChatMessages.push({
          id: 'msg-' + Date.now(),
          sender: 'mentor',
          sender_role: 'faculty',
          sender_name: 'Dr. Priya Sen (Faculty Mentor)',
          text: randomReply,
          message: randomReply,
          timestamp: replyTime,
          created_at: new Date().toISOString()
        });
      }, 750);
    },

    // ------------------------------------------------------------------------
    // Method 3: switchPortalModule(module)
    // ------------------------------------------------------------------------
    /**
     * Switches the active portal module (e.g. 'academic', 'exam', 'fees', etc.),
     * selects its first sub-page by default, and triggers loadPortalData.
     */
    async switchPortalModule(module) {
      this.portalModule = module;
      const modules = this.getPortalModules();
      const targetMod = modules.find(m => m.key === module);
      const defaultSub = (targetMod && targetMod.subpages && targetMod.subpages.length > 0)
        ? targetMod.subpages[0].key
        : 'time_table';
      
      this.portalSubPage = defaultSub;
      await this.loadPortalData(module, defaultSub);
    },

    // ------------------------------------------------------------------------
    // Method 4: initPortal()
    // ------------------------------------------------------------------------
    /**
     * Initializes the institutional portal state with academic timetable data.
     */
    async initPortal() {
      this.portalModule = 'academic';
      this.portalSubPage = 'time_table';
      await this.loadPortalData('academic', 'time_table');
    },

    // ------------------------------------------------------------------------
    // Method 5: getPortalModules()
    // ------------------------------------------------------------------------
    /**
     * Returns definition list of all 7 ERP modules with icons, colors, and subpages.
     */
    getPortalModules() {
      return [
        {
          key: 'academic',
          label: 'Academic',
          icon: 'fa-graduation-cap',
          color: 'blue',
          description: 'Timetables, course plans, assignments, attendance & mentoring',
          subpages: [
            { key: 'time_table', label: 'Time Table', icon: 'fa-clock' },
            { key: 'calendar', label: 'Calendar', icon: 'fa-calendar' },
            { key: 'course_plan', label: 'Course Plan', icon: 'fa-book-open' },
            { key: 'assignment', label: 'Assignments', icon: 'fa-tasks' },
            { key: 'attendance', label: 'Attendance', icon: 'fa-user-check' },
            { key: 'student_leaves', label: 'Student Leaves', icon: 'fa-person-walking-arrow-right' },
            { key: 'mentor_counselling', label: 'Mentor Counselling', icon: 'fa-comments' },
            { key: 'class_teacher', label: 'Class Teacher', icon: 'fa-user-tie' }
          ]
        },
        {
          key: 'exam',
          label: 'Examination',
          icon: 'fa-award',
          color: 'purple',
          description: 'University results, exam schedules, registration & hall tickets',
          subpages: [
            { key: 'exam_result', label: 'Exam Results', icon: 'fa-square-poll-vertical' },
            { key: 'exam_datesheet', label: 'Exam Datesheet', icon: 'fa-calendar-check' },
            { key: 'exam_registration', label: 'Exam Registration', icon: 'fa-file-signature' },
            { key: 'subject_registration', label: 'Subject Registration', icon: 'fa-book-bookmark' }
          ]
        },
        {
          key: 'fees',
          label: 'Fees & Accounts',
          icon: 'fa-receipt',
          color: 'emerald',
          description: 'Fee structures, payments, scholarships, balance ledgers & NEFT',
          subpages: [
            { key: 'fee_structure', label: 'Fee Structure', icon: 'fa-file-invoice' },
            { key: 'dues', label: 'Fee Dues', icon: 'fa-circle-exclamation' },
            { key: 'payments', label: 'Payment History', icon: 'fa-credit-card' },
            { key: 'balance', label: 'Balance Ledger', icon: 'fa-scale-balanced' },
            { key: 'registration_fee', label: 'Registration Fee', icon: 'fa-file-invoice-dollar' },
            { key: 'discount_waived', label: 'Discount & Waiver', icon: 'fa-tag' },
            { key: 'scholarship', label: 'Scholarships', icon: 'fa-award' },
            { key: 'adjustment', label: 'Fee Adjustments', icon: 'fa-sliders' },
            { key: 'fee_relaxation', label: 'Fee Relaxation', icon: 'fa-hand-holding-dollar' },
            { key: 'refund', label: 'Refund Requests', icon: 'fa-arrow-rotate-left' },
            { key: 'pocket_money', label: 'Pocket Money', icon: 'fa-coins' },
            { key: 'cheque_bounce', label: 'Cheque Bounce Log', icon: 'fa-ban' },
            { key: 'head_wise', label: 'Head-Wise Ledger', icon: 'fa-list-ol' },
            { key: 'bank_neft_rtgs', label: 'Bank NEFT/RTGS', icon: 'fa-building-columns' }
          ]
        },
        {
          key: 'hostel',
          label: 'Hostel & Mess',
          icon: 'fa-hotel',
          color: 'amber',
          description: 'Room allocation, occupancy, gate pass leaves & daily mess menu',
          subpages: [
            { key: 'my_room', label: 'My Room', icon: 'fa-bed' },
            { key: 'room_status', label: 'Room Status', icon: 'fa-door-open' },
            { key: 'hostel_leave', label: 'Hostel Gate Pass', icon: 'fa-person-walking-luggage' },
            { key: 'previous_registration', label: 'Previous Registrations', icon: 'fa-clock-rotate-left' },
            { key: 'mess_menu', label: 'Mess Food Menu', icon: 'fa-utensils' }
          ]
        },
        {
          key: 'administration',
          label: 'Administration',
          icon: 'fa-landmark',
          color: 'cyan',
          description: 'Official student details, DigiLocker docs, grievances & helpdesk',
          subpages: [
            { key: 'official_detail', label: 'Official Details', icon: 'fa-id-card' },
            { key: 'document_status', label: 'Document Status', icon: 'fa-folder-open' },
            { key: 'document_request', label: 'Request Documents', icon: 'fa-file-circle-plus' },
            { key: 'grievance', label: 'Grievance Redressal', icon: 'fa-bullhorn' },
            { key: 'helpdesk', label: 'Campus Helpdesk', icon: 'fa-headset' },
            { key: 'feedback', label: 'Institutional Feedback', icon: 'fa-comment-dots' }
          ]
        },
        {
          key: 'library',
          label: 'Library & Learning',
          icon: 'fa-book',
          color: 'indigo',
          description: 'Library card, issued books, circulation history, fines & footfall',
          subpages: [
            { key: 'membership', label: 'Membership Card', icon: 'fa-address-card' },
            { key: 'issued_book', label: 'Issued Books', icon: 'fa-book' },
            { key: 'previous_log', label: 'Circulation History', icon: 'fa-clock-rotate-left' },
            { key: 'fine', label: 'Library Fines', icon: 'fa-coins' },
            { key: 'library_attendance', label: 'Reading Room Footfall', icon: 'fa-chart-simple' }
          ]
        },
        {
          key: 'other_services',
          label: 'Other Services',
          icon: 'fa-cubes',
          color: 'rose',
          description: 'Transport, placements, notices, homework, diary & no dues',
          subpages: [
            { key: 'transport', label: 'Transport & Routes', icon: 'fa-bus' },
            { key: 'training_placement', label: 'Training & Placement', icon: 'fa-briefcase' },
            { key: 'sibling', label: 'Sibling Record', icon: 'fa-people-roof' },
            { key: 'gallery', label: 'Campus Gallery', icon: 'fa-images' },
            { key: 'notice', label: 'Official Notices', icon: 'fa-bullhorn' },
            { key: 'diary', label: 'Academic Diary', icon: 'fa-book-journal-whills' },
            { key: 'homework', label: 'Homework & Labs', icon: 'fa-pencil' },
            { key: 'student_ptm', label: 'PTM Schedule', icon: 'fa-handshake' },
            { key: 'no_dues', label: 'No Dues Clearance', icon: 'fa-stamp' },
            { key: 'seating_plan', label: 'Seating Plan', icon: 'fa-chair' }
          ]
        }
      ];
    }
  };
}

// ============================================================================
// 4. Global Window Export for portalApp() in app.js
// ============================================================================
if (typeof window !== 'undefined') {
  window.getPortalERPState = getPortalERPState;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getPortalERPState, PORTAL_ERP_ENDPOINT_MAP, getPortalERPRealisticData };
}
