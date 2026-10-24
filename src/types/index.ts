export type UserRole = 'student' | 'faculty' | 'parent' | 'institute' | 'admin';

export interface UserProfile {
  username: string;
  name: string;
  role: UserRole;
  email: string;
  mobile: string;
  institution: string;
  avatar?: string;
  apaarId?: string;
  rollNo?: string;
}

export interface StudentRecord {
  id: string;
  roll_no: string;
  name: string;
  email: string;
  department: string;
  semester: string;
  cgpa: number;
  attendance_percentage: number;
  credits_earned: number;
  max_credits: number;
  backlogs: number;
  apaar_id: string;
  digilocker_status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  dbt_status: 'ACTIVE' | 'PROCESSING' | 'NONE';
  status: 'VERIFIED' | 'PROVISIONAL' | 'RESTRICTED';
}

export interface EnrolledInstitution {
  id: string;
  name: string;
  type: string;
  badge: string;
  accreditation: string;
  role: string;
  rollNo: string;
  apaarId: string;
  status: string;
  currentTerm: string;
  cgpa: number;
  attendance: number;
  icon: string;
}

export interface ERPTimeTableSlot {
  time: string;
  code: string;
  title: string;
  room: string;
  faculty: string;
  type: string;
}

export interface ERPAttendanceSubject {
  code: string;
  title: string;
  held: number;
  attended: number;
  percentage: number;
  status: 'Good' | 'Low' | 'Critical';
}

export interface ERPAssignment {
  id: string;
  course: string;
  title: string;
  dueDate: string;
  maxMarks: number;
  submitted: boolean;
  score?: number;
  grade?: string;
}

export interface ERPFeeHead {
  name: string;
  amount: number;
  paid: number;
  due: number;
  status: 'Paid' | 'Partial' | 'Pending';
}

export interface ERPLibraryBook {
  id: string;
  accessionNo: string;
  title: string;
  author: string;
  issueDate: string;
  dueDate: string;
  fine: number;
  status: 'Issued' | 'Returned' | 'Overdue';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'peer';
  senderName: string;
  senderRole?: string;
  text: string;
  timestamp: string;
  channel?: string;
  recipient?: string;
  citations?: string[];
  isAi?: boolean;
}

export interface ComplaintTicket {
  id: string;
  ticket_no: string;
  complainant: string;
  complainant_role: string;
  institution: string;
  category: string;
  subject: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'UNDER_INVESTIGATION' | 'PENDING' | 'RESOLVED' | 'ESCALATED';
  created_at: string;
  assigned_bureau: string;
}

export interface FdrEscrowRecord {
  id: string;
  institution_name: string;
  aishe_code: string;
  fdr_number: string;
  bank_name: string;
  principal_amount: number;
  joint_account_with: string;
  creation_date: string;
  maturity_date: string;
  status: 'ACTIVE_LOCKED' | 'PENDING_AUDIT' | 'RELEASED';
  compliance_tier: string;
}
