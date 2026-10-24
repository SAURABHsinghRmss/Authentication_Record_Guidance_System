import {
  UserProfile,
  StudentRecord,
  EnrolledInstitution,
  ComplaintTicket,
  FdrEscrowRecord,
  ChatMessage,
  BiometricLogEntry
} from '../types';

export const DEMO_PROFILES: Record<string, UserProfile> = {
  student: {
    username: 'amit',
    name: 'Amit Sharma',
    role: 'student',
    email: 'amit@uni.edu',
    mobile: '+91 98765 43210',
    institution: 'GL Bajaj Institute of Technology and Management',
    apaarId: 'APAAR-9988-7766-5544',
    rollNo: 'CS-2022-04'
  },
  faculty: {
    username: 'faculty',
    name: 'Dr. Priya Sen',
    role: 'faculty',
    email: 'faculty@uni.edu',
    mobile: '+91 98111 22334',
    institution: 'GL Bajaj Institute of Technology and Management',
    rollNo: 'FAC-CSE-102'
  },
  parent: {
    username: 'parent_alex',
    name: 'Mr. Rajesh Sharma',
    role: 'parent',
    email: 'rajesh.sharma@gmail.com',
    mobile: '+91 94555 66778',
    institution: 'GL Bajaj Institute of Technology and Management'
  },
  institute: {
    username: 'institute_admin',
    name: 'GLBITM Director Office',
    role: 'institute',
    email: 'director@glbitm.ac.in',
    mobile: '+91 120 2323888',
    institution: 'GL Bajaj Institute of Technology and Management'
  },
  admin: {
    username: 'msrch',
    name: 'Master Admin (msrch)',
    role: 'admin',
    email: 'msrch.dev@uni.edu',
    mobile: '+91 99999 00001',
    institution: 'National AICTE / MoE Sovereign Control'
  }
};

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 's1',
    roll_no: 'CS-2022-04',
    name: 'Amit Sharma',
    email: 'amit@uni.edu',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    cgpa: 8.92,
    attendance_percentage: 88.5,
    credits_earned: 124,
    max_credits: 160,
    backlogs: 0,
    apaar_id: 'APAAR-9988-7766-5544',
    digilocker_status: 'VERIFIED',
    dbt_status: 'ACTIVE',
    status: 'VERIFIED'
  },
  {
    id: 's2',
    roll_no: 'CS-2022-12',
    name: 'Sneha Patel',
    email: 'sneha.p@uni.edu',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    cgpa: 9.35,
    attendance_percentage: 94.0,
    credits_earned: 128,
    max_credits: 160,
    backlogs: 0,
    apaar_id: 'APAAR-9988-7766-5589',
    digilocker_status: 'VERIFIED',
    dbt_status: 'ACTIVE',
    status: 'VERIFIED'
  },
  {
    id: 's3',
    roll_no: 'AI-2022-09',
    name: 'Rohan Verma',
    email: 'rohan.v@uni.edu',
    department: 'Artificial Intelligence & Data Science',
    semester: '6th Semester',
    cgpa: 7.85,
    attendance_percentage: 73.2,
    credits_earned: 116,
    max_credits: 160,
    backlogs: 1,
    apaar_id: 'APAAR-9988-7766-5512',
    digilocker_status: 'VERIFIED',
    dbt_status: 'PROCESSING',
    status: 'PROVISIONAL'
  },
  {
    id: 's4',
    roll_no: 'IT-2022-44',
    name: 'Ananya Gupta',
    email: 'ananya.g@uni.edu',
    department: 'Information Technology',
    semester: '6th Semester',
    cgpa: 8.42,
    attendance_percentage: 86.8,
    credits_earned: 120,
    max_credits: 160,
    backlogs: 0,
    apaar_id: 'APAAR-9988-7766-5573',
    digilocker_status: 'VERIFIED',
    dbt_status: 'ACTIVE',
    status: 'VERIFIED'
  }
];

export const ENROLLED_INSTITUTIONS: EnrolledInstitution[] = [
  {
    id: 'inst-glbitm',
    name: 'GL Bajaj Institute of Technology and Management',
    type: 'Autonomous College (AICTE / AKTU)',
    badge: 'NAAC A+ Accredited',
    accreditation: 'NBA & NAAC A+ Grade',
    role: 'Primary Degree Enrollment',
    rollNo: 'CS-2022-04',
    apaarId: 'APAAR-9988-7766-5544',
    status: 'Active Full-Time',
    currentTerm: '6th Semester (Even 2026)',
    cgpa: 8.92,
    attendance: 88.5,
    icon: 'fa-building-columns'
  },
  {
    id: 'inst-nptel',
    name: 'IIT Delhi / SWAYAM NPTEL Sovereign Portal',
    type: 'National MOOCs Platform',
    badge: 'MoE India Certified',
    accreditation: 'Academic Bank of Credits (ABC) Recognized',
    role: 'Minor Specialization in Deep Learning',
    rollNo: 'NPTEL26CS921',
    apaarId: 'APAAR-9988-7766-5544',
    status: 'Active Online',
    currentTerm: '12-Week Specialization',
    cgpa: 9.5,
    attendance: 100,
    icon: 'fa-graduation-cap'
  },
  {
    id: 'inst-stanford',
    name: 'Stanford Online Global Exchange',
    type: 'International Partner Program',
    badge: 'Global Credit Transfer',
    accreditation: 'WASC Senior College and University Commission',
    role: 'Elective: Advanced Distributed Systems',
    rollNo: 'SU-XFER-2026-88',
    apaarId: 'APAAR-9988-7766-5544',
    status: 'Verified Co-Enrolled',
    currentTerm: 'Spring Quarter',
    cgpa: 4.0,
    attendance: 95.0,
    icon: 'fa-globe'
  }
];

export const TIMETABLE_DATA: Record<string, any[]> = {
  Monday: [
    { time: '09:00 - 10:00', code: 'CS601', title: 'Distributed Systems & Cloud Computing', room: 'LH-301', faculty: 'Dr. Priya Sen', type: 'Lecture' },
    { time: '10:00 - 11:00', code: 'CS602', title: 'Compiler Design & Automata', room: 'LH-301', faculty: 'Prof. Rajesh Nair', type: 'Lecture' },
    { time: '11:15 - 01:15', code: 'CS605P', title: 'AI & Neural Networks Laboratory', room: 'Lab-4 (Block B)', faculty: 'Dr. Ananya Roy', type: 'Practical Lab' },
    { time: '02:00 - 03:00', code: 'CS603', title: 'Cyber Security & Cryptography', room: 'LH-302', faculty: 'Dr. Vikram Malhotra', type: 'Lecture' },
    { time: '03:00 - 04:00', code: 'LIB01', title: 'Library & Research Colloquium', room: 'Central Library', faculty: 'Dept. Mentors', type: 'Self Study' }
  ],
  Tuesday: [
    { time: '09:00 - 10:00', code: 'CS602', title: 'Compiler Design & Automata', room: 'LH-301', faculty: 'Prof. Rajesh Nair', type: 'Lecture' },
    { time: '10:00 - 11:00', code: 'CS604', title: 'Software Engineering & DevOps CI/CD', room: 'LH-301', faculty: 'Dr. Sunita Varma', type: 'Lecture' },
    { time: '11:15 - 12:15', code: 'CS603', title: 'Cyber Security & Cryptography', room: 'LH-302', faculty: 'Dr. Vikram Malhotra', type: 'Lecture' },
    { time: '01:15 - 03:15', code: 'CS606P', title: 'Distributed Systems & Docker Lab', room: 'Cloud Computing Lab', faculty: 'Dr. Priya Sen', type: 'Practical Lab' }
  ],
  Wednesday: [
    { time: '09:00 - 10:00', code: 'CS601', title: 'Distributed Systems & Cloud Computing', room: 'LH-301', faculty: 'Dr. Priya Sen', type: 'Lecture' },
    { time: '10:00 - 11:00', code: 'OE601', title: 'AICTE Open Elective: Renewable Energy', room: 'Audi-2', faculty: 'Prof. K. K. Mishra', type: 'Elective' },
    { time: '11:15 - 01:15', code: 'PRJ601', title: 'Capstone Project Studio (Raft AI)', room: 'Project Lab 3', faculty: 'Dr. Priya Sen', type: 'Project' },
    { time: '02:00 - 03:00', code: 'CS604', title: 'Software Engineering & DevOps CI/CD', room: 'LH-301', faculty: 'Dr. Sunita Varma', type: 'Lecture' }
  ],
  Thursday: [
    { time: '09:00 - 10:00', code: 'CS603', title: 'Cyber Security & Cryptography', room: 'LH-302', faculty: 'Dr. Vikram Malhotra', type: 'Lecture' },
    { time: '10:00 - 11:00', code: 'CS601', title: 'Distributed Systems & Cloud Computing', room: 'LH-301', faculty: 'Dr. Priya Sen', type: 'Lecture' },
    { time: '11:15 - 12:15', code: 'CS602', title: 'Compiler Design & Automata', room: 'LH-301', faculty: 'Prof. Rajesh Nair', type: 'Lecture' },
    { time: '02:00 - 04:00', code: 'MEN01', title: 'Faculty 1-on-1 Mentor Guidance Hour', room: 'Cabin 312', faculty: 'Dr. Priya Sen', type: 'Mentoring' }
  ],
  Friday: [
    { time: '09:00 - 10:00', code: 'CS604', title: 'Software Engineering & DevOps CI/CD', room: 'LH-301', faculty: 'Dr. Sunita Varma', type: 'Lecture' },
    { time: '10:00 - 11:00', code: 'OE601', title: 'AICTE Open Elective: Renewable Energy', room: 'Audi-2', faculty: 'Prof. K. K. Mishra', type: 'Elective' },
    { time: '11:15 - 01:15', code: 'CS607P', title: 'Full-Stack Web & Microservices Lab', room: 'Software Lab 1', faculty: 'Er. Naveen Jain', type: 'Practical Lab' },
    { time: '02:00 - 04:00', code: 'AGR01', title: 'Innovation Club & Coding Agora', room: 'Incubation Center', faculty: 'Campus AI Leads', type: 'Agora' }
  ]
};

export const ATTENDANCE_BREAKDOWN = [
  { code: 'CS601', title: 'Distributed Systems & Cloud Computing', held: 34, attended: 31, percentage: 91.2, status: 'Good' },
  { code: 'CS602', title: 'Compiler Design & Automata', held: 32, attended: 28, percentage: 87.5, status: 'Good' },
  { code: 'CS603', title: 'Cyber Security & Cryptography', held: 30, attended: 26, percentage: 86.6, status: 'Good' },
  { code: 'CS604', title: 'Software Engineering & DevOps CI/CD', held: 28, attended: 25, percentage: 89.3, status: 'Good' },
  { code: 'CS605P', title: 'AI & Neural Networks Laboratory', held: 16, attended: 15, percentage: 93.8, status: 'Good' },
  { code: 'OE601', title: 'AICTE Open Elective: Renewable Energy', held: 24, attended: 20, percentage: 83.3, status: 'Good' }
];

export const EXAM_RESULTS_BREAKDOWN = [
  { semester: 'Semester 1', sgpa: 8.75, credits: 20, status: 'PASSED (First Class with Dist.)' },
  { semester: 'Semester 2', sgpa: 8.85, credits: 20, status: 'PASSED (First Class with Dist.)' },
  { semester: 'Semester 3', sgpa: 9.10, credits: 21, status: 'PASSED (First Class with Dist.)' },
  { semester: 'Semester 4', sgpa: 8.95, credits: 21, status: 'PASSED (First Class with Dist.)' },
  { semester: 'Semester 5', sgpa: 9.02, credits: 22, status: 'PASSED (First Class with Dist.)' },
  { semester: 'Semester 6', sgpa: 8.92, credits: 20, status: 'CURRENT SEMESTER (Mid-Term In Progress)' }
];

export const FEE_LEDGER_ITEMS = [
  { term: '2025-26 (Sem 6)', head: 'Tuition Fee', total: 65000, paid: 65000, due: 0, date: '2026-01-10', receipt: 'REC-2026-9812' },
  { term: '2025-26 (Sem 6)', head: 'Development & Exam Fee', total: 15000, paid: 15000, due: 0, date: '2026-01-10', receipt: 'REC-2026-9813' },
  { term: '2025-26 (Sem 6)', head: 'AI Computing & Lab Usage Fee', total: 12000, paid: 0, due: 12000, date: '-', receipt: 'PENDING' },
  { term: '2025-26 (Sem 6)', head: 'Hostel & Mess Installment 2', total: 42000, paid: 42000, due: 0, date: '2026-02-05', receipt: 'REC-2026-9904' }
];

export const INITIAL_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'cmp-1',
    ticket_no: 'AIC-GRV-2026-0412',
    complainant: 'Amit Sharma',
    complainant_role: 'Student',
    institution: 'GL Bajaj Institute of Technology and Management',
    category: 'Academic Facility',
    subject: 'High-Performance GPU Cluster Access for AI Research Project',
    description: 'B.Tech final year capstone requires NVIDIA Tensor core cluster allocation for model training with sovereign Sarvam weights.',
    severity: 'MEDIUM',
    status: 'UNDER_INVESTIGATION',
    created_at: '2026-10-18',
    assigned_bureau: 'AICTE Research & Institutional Development Bureau'
  },
  {
    id: 'cmp-2',
    ticket_no: 'AIC-GRV-2026-0390',
    complainant: 'Rajesh Sharma',
    complainant_role: 'Parent',
    institution: 'GL Bajaj Institute of Technology and Management',
    category: 'Fee Transparency & DBT',
    subject: 'Verification of State DBT Fee Reimbursement Credit',
    description: 'Direct Benefit Transfer scholarship receipt acknowledgment in institutional ledger for Odd Semester 2025.',
    severity: 'LOW',
    status: 'RESOLVED',
    created_at: '2026-10-12',
    assigned_bureau: 'AICTE Finance & Regulatory Bureau'
  },
  {
    id: 'cmp-3',
    ticket_no: 'AIC-GRV-2026-0428',
    complainant: 'Dr. Priya Sen',
    complainant_role: 'Faculty',
    institution: 'GL Bajaj Institute of Technology and Management',
    category: 'Research Grant / FDR Escrow',
    subject: 'AICTE Statutory Reserve Escrow Bond Renewal for AI Intake',
    description: 'Submission of Joint FDR Escrow deposit verification document for additional 120 B.Tech AI & Data Science intake expansion.',
    severity: 'HIGH',
    status: 'PENDING',
    created_at: '2026-10-22',
    assigned_bureau: 'AICTE Approval Bureau (AB)'
  }
];

export const INITIAL_FDR_ESCROW: FdrEscrowRecord[] = [
  {
    id: 'fdr-1',
    institution_name: 'GL Bajaj Institute of Technology and Management',
    aishe_code: 'C-46141',
    fdr_number: 'SBIN-FDR-2026-904128',
    bank_name: 'State Bank of India (Commercial Branch, Greater Noida)',
    principal_amount: 12500000, // 1.25 Crore
    joint_account_with: 'Regional Officer, AICTE Northern Regional Office (NRO Kanpur)',
    creation_date: '2024-06-15',
    maturity_date: '2034-06-15',
    status: 'ACTIVE_LOCKED',
    compliance_tier: 'TIER-1 (Statutory Compliance Satisfied)'
  },
  {
    id: 'fdr-2',
    institution_name: 'GL Bajaj Institute of Technology and Management',
    aishe_code: 'C-46141',
    fdr_number: 'PNB-FDR-2025-410923',
    bank_name: 'Punjab National Bank (Institutional Area Branch)',
    principal_amount: 5000000, // 50 Lakh
    joint_account_with: 'Member Secretary, AICTE New Delhi',
    creation_date: '2025-07-01',
    maturity_date: '2035-07-01',
    status: 'ACTIVE_LOCKED',
    compliance_tier: 'TIER-1 (Security Reserve Intact)'
  }
];

export const FEDERATION_DATABASES = [
  { id: 'db1', name: 'academic_sis.db', tables: 18, records: '48,290', status: 'Healthy', size: '14.2 MB', domain: 'Academic Records & Enrolled SIS' },
  { id: 'db2', name: 'auth_iam.db', tables: 12, records: '12,410', status: 'Healthy', size: '4.8 MB', domain: 'Sovereign IAM & Identity Partitions' },
  { id: 'db3', name: 'career_pathways.db', tables: 8, records: '8,950', status: 'Healthy', size: '3.1 MB', domain: 'Career Roadmap & Skill Graphs' },
  { id: 'db4', name: 'family_heritage.db', tables: 6, records: '6,120', status: 'Healthy', size: '2.5 MB', domain: 'Parent-Ward Relational Kinship' },
  { id: 'db5', name: 'institutions_governance.db', tables: 22, records: '34,800', status: 'Healthy', size: '19.8 MB', domain: 'AICTE SIF & FDR Escrow Registers' },
  { id: 'db6', name: 'notifications_events.db', tables: 9, records: '112,040', status: 'Healthy', size: '28.4 MB', domain: 'Cross-Role Real-Time Event Stream' },
  { id: 'db7', name: 'security_audit.db', tables: 14, records: '241,890', status: 'Healthy', size: '42.1 MB', domain: 'Immutable Audit Trail & Biometrics' }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'bot',
    senderName: 'EduMentor AI (Meta AI)',
    senderRole: 'AI Campus Advisor',
    text: 'Namaste Amit! I am EduMentor AI, powered by sovereign Indian academic intelligence (sarvam-105b). I have verified your APAAR ID (APAAR-9988-7766-5544) and 6th semester enrollment. You have 124 credits logged in ABC with 0 backlogs. How can I guide you today?',
    timestamp: '10:00 AM',
    channel: 'campus_global',
    isAi: true,
    citations: ['AICTE Approval Process Handbook 2026-27', 'National Education Policy (NEP 2020) ABC Guidelines', 'GLBITM Autonomous Academic Regulations']
  },
  {
    id: 'm2',
    sender: 'peer',
    senderName: 'Dr. Priya Sen',
    senderRole: 'Faculty Mentor',
    text: 'Hi Amit, your Capstone report on Distributed Ledger & Federated SIS has been reviewed. The sovereign Indian AI validation module meets all AICTE criteria. Excellent work!',
    timestamp: '10:15 AM',
    recipient: 'faculty'
  },
  {
    id: 'm3',
    sender: 'peer',
    senderName: 'Mr. Rajesh Sharma',
    senderRole: 'Parent Guardian',
    text: 'Amit, I received the notification for the Semester 6 AI Lab fee. Let me know once you submit the elective form.',
    timestamp: '10:20 AM',
    recipient: 'parent_alex'
  }
];

export const INITIAL_BIOMETRIC_LOGS: BiometricLogEntry[] = [
  {
    id: 'bio-001',
    modality: 'FACE_3D',
    modalityLabel: '3D Facial Liveness & Depth Mesh',
    status: 'VERIFIED_SUCCESS',
    timestamp: '2026-10-24 09:14:22',
    relativeTime: '1 hr ago',
    subjectRollNo: 'CS-2022-04',
    subjectName: 'Amit Sharma',
    confidenceScore: '99.85%',
    hash: 'SHA256-a9f82d1c7e90',
    notes: 'Blink rate & depth geometry authenticated against sovereign APAAR bio-template.'
  },
  {
    id: 'bio-002',
    modality: 'OCR_ID',
    modalityLabel: 'Physical Student ID Card OCR',
    status: 'VERIFIED_SUCCESS',
    timestamp: '2026-10-24 09:14:48',
    relativeTime: '1 hr ago',
    subjectRollNo: 'CS-2022-04',
    subjectName: 'Amit Sharma',
    confidenceScore: '98.90%',
    hash: 'SHA256-4b89fa01ef43',
    notes: 'Optical MRZ checksum and barcode validated against GLBITM Registrar SIS.'
  },
  {
    id: 'bio-003',
    modality: 'VOICE_SPECTROGRAM',
    modalityLabel: 'Acoustic Voiceprint Spectrogram',
    status: 'VERIFIED_SUCCESS',
    timestamp: '2026-10-24 09:15:10',
    relativeTime: '1 hr ago',
    subjectRollNo: 'CS-2022-04',
    subjectName: 'Amit Sharma',
    confidenceScore: '97.20%',
    hash: 'SHA256-8c11de34bc98',
    notes: 'Harmonic formant ratio validated for phrase "EduIdentityAI 2026".'
  },
  {
    id: 'bio-004',
    modality: 'FACE_3D',
    modalityLabel: '3D Facial Liveness & Depth Mesh',
    status: 'CHALLENGE_REQUIRED',
    timestamp: '2026-10-23 16:42:05',
    relativeTime: 'Yesterday',
    subjectRollNo: 'CS-2022-04',
    subjectName: 'Amit Sharma',
    confidenceScore: '84.10%',
    hash: 'SHA256-3d77aa19c802',
    notes: 'Low ambient lux illumination detected; secondary 2FA token issued.',
    isFlagged: true,
    flagReason: 'Low ambient lux reading triggering anomaly threshold - requires manual lighting audit.',
    flaggedAt: '2026-10-23 17:05:00',
    flaggedBy: 'Dr. M. S. Rao (AICTE Sovereign Admin)'
  },
  {
    id: 'bio-005',
    modality: 'OCR_ID',
    modalityLabel: 'Physical Student ID Card OCR',
    status: 'VERIFIED_SUCCESS',
    timestamp: '2026-10-22 11:30:15',
    relativeTime: '2 days ago',
    subjectRollNo: 'CS-2022-04',
    subjectName: 'Amit Sharma',
    confidenceScore: '99.10%',
    hash: 'SHA256-91fa87ee2300',
    notes: 'Campus Gate access terminal verification passed.'
  },
  {
    id: 'bio-006',
    modality: 'VOICE_SPECTROGRAM',
    modalityLabel: 'Acoustic Voiceprint Spectrogram',
    status: 'PENDING',
    timestamp: '2026-10-24 10:20:00',
    relativeTime: '20 mins ago',
    subjectRollNo: 'CS-2022-04',
    subjectName: 'Amit Sharma',
    confidenceScore: 'Queued (In-Progress)',
    hash: 'SHA256-pending-audit-77b',
    notes: 'Audio segment submitted for dual-channel noise cancellation and registrar corroboration.'
  },
  {
    id: 'bio-007',
    modality: 'FACE_3D',
    modalityLabel: '3D Facial Liveness & Depth Mesh',
    status: 'REJECTED',
    timestamp: '2026-10-21 14:12:33',
    relativeTime: '3 days ago',
    subjectRollNo: 'CS-2022-04',
    subjectName: 'Amit Sharma',
    confidenceScore: '41.20%',
    hash: 'SHA256-f002cb76d881',
    notes: 'Static photo spoof detected by passive IR sensor. Verification rejected.',
    isFlagged: true,
    flagReason: 'Static photo spoof attempt detected on passive IR sensor - marked for urgent disciplinary verification.',
    flaggedAt: '2026-10-21 14:30:10',
    flaggedBy: 'Campus Security Bureau'
  }
];

