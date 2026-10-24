import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, StudentRecord, EnrolledInstitution, ComplaintTicket, FdrEscrowRecord, ChatMessage, BiometricLogEntry, BiometricModality, BiometricStatus } from '../types';
import { DEMO_PROFILES, INITIAL_STUDENTS, ENROLLED_INSTITUTIONS, INITIAL_COMPLAINTS, INITIAL_FDR_ESCROW, INITIAL_CHAT_MESSAGES, INITIAL_BIOMETRIC_LOGS } from '../data/mockData';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: UserProfile;
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedInstitution: EnrolledInstitution;
  setSelectedInstitution: (inst: EnrolledInstitution) => void;
  students: StudentRecord[];
  complaints: ComplaintTicket[];
  fdrEscrow: FdrEscrowRecord[];
  chatMessages: ChatMessage[];
  biometricLogs: BiometricLogEntry[];
  recordBiometricAttempt: (modality: BiometricModality, status: BiometricStatus, confidence: string, notes: string) => void;
  login: (role: UserRole, username: string) => void;
  instantLogin: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addComplaint: (c: Omit<ComplaintTicket, 'id' | 'ticket_no' | 'created_at'>) => void;
  payFee: (amount: number, remarks: string) => void;
  auditLogs: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('edu_is_logged_in') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('edu_role') as UserRole) || 'student';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedRole = (localStorage.getItem('edu_role') as UserRole) || 'student';
    return DEMO_PROFILES[savedRole] || DEMO_PROFILES.student;
  });

  const [activeTab, setActiveTab] = useState<string>('student_dashboard');
  const [selectedInstitution, setSelectedInstitution] = useState<EnrolledInstitution>(ENROLLED_INSTITUTIONS[0]);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(INITIAL_COMPLAINTS);
  const [fdrEscrow, setFdrEscrow] = useState<FdrEscrowRecord[]>(INITIAL_FDR_ESCROW);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [biometricLogs, setBiometricLogs] = useState<BiometricLogEntry[]>(INITIAL_BIOMETRIC_LOGS);

  const [auditLogs, setAuditLogs] = useState<string[]>([
    `[${new Date().toISOString().slice(0, 19)}] SYSTEM ONLINE: Sovereign React Core mounted with DPI Integration.`,
    `[${new Date().toISOString().slice(0, 19)}] FEDERATION: 7 partitioned databases connected and verified.`,
    `[${new Date().toISOString().slice(0, 19)}] APAAR ENGINE: National Academic Depository (NAD) synced.`
  ]);

  const addAuditLog = (msg: string) => {
    const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setAuditLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const recordBiometricAttempt = (modality: BiometricModality, status: BiometricStatus, confidence: string, notes: string) => {
    const labelMap: Record<BiometricModality, string> = {
      FACE_3D: '3D Facial Liveness & Depth Mesh',
      OCR_ID: 'Physical Student ID Card OCR',
      VOICE_SPECTROGRAM: 'Acoustic Voiceprint Spectrogram'
    };
    const now = new Date();
    const formattedTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');
    const randomHex = Math.random().toString(16).substring(2, 14);

    const newEntry: BiometricLogEntry = {
      id: `bio-${Date.now()}`,
      modality,
      modalityLabel: labelMap[modality],
      status,
      timestamp: formattedTimestamp,
      relativeTime: 'Just now',
      subjectRollNo: currentUser.rollNo || 'CS-2022-04',
      subjectName: currentUser.name || 'Amit Sharma',
      confidenceScore: confidence,
      hash: `SHA256-${randomHex}`,
      notes
    };

    setBiometricLogs(prev => [newEntry, ...prev]);
    addAuditLog(`BIOMETRICS: ${labelMap[modality]} verification [${status}] recorded for ${newEntry.subjectName} (${newEntry.subjectRollNo}) with score ${confidence}. Hash: ${newEntry.hash}`);

    if (status === 'REJECTED') {
      const emailEnabled = localStorage.getItem('edu_notify_email_failed_scans') !== 'false';
      const systemEnabled = localStorage.getItem('edu_notify_system_failed_scans') !== 'false';
      const targetEmail = localStorage.getItem('edu_notify_alert_email') || 'ssrmsr06@gmail.com';
      if (emailEnabled || systemEnabled) {
        addAuditLog(`SECURITY ALERT [HIGH-PRIORITY]: High-priority failed biometric scan for ${newEntry.subjectName}. Dispatched incident notice via ${[emailEnabled ? `Email (${targetEmail})` : '', systemEnabled ? 'System Notification Engine' : ''].filter(Boolean).join(' & ')}.`);
      }
    }
  };

  const instantLogin = (role: UserRole) => {
    const profile = DEMO_PROFILES[role] || DEMO_PROFILES.student;
    setCurrentRole(role);
    setCurrentUser(profile);
    setIsLoggedIn(true);
    localStorage.setItem('edu_is_logged_in', 'true');
    localStorage.setItem('edu_role', role);
    localStorage.setItem('edu_username', profile.username);

    // Set default active tab based on role
    if (role === 'admin') setActiveTab('admin_crud');
    else if (role === 'faculty') setActiveTab('faculty_roster');
    else if (role === 'institute') setActiveTab('institute_overview');
    else if (role === 'parent') setActiveTab('parent_overview');
    else setActiveTab('student_dashboard');

    addAuditLog(`AUTH: 1-Click Instant Demo Login as ${profile.name} [Role: ${role.toUpperCase()}].`);
  };

  const login = (role: UserRole, username: string) => {
    const profile = DEMO_PROFILES[role] || {
      username: username || 'user',
      name: username || 'Authenticated User',
      role,
      email: `${username}@uni.edu`,
      mobile: '+91 98765 00000',
      institution: 'GL Bajaj Institute of Technology and Management'
    };
    setCurrentRole(role);
    setCurrentUser(profile);
    setIsLoggedIn(true);
    localStorage.setItem('edu_is_logged_in', 'true');
    localStorage.setItem('edu_role', role);
    localStorage.setItem('edu_username', profile.username);

    if (role === 'admin') setActiveTab('admin_crud');
    else if (role === 'faculty') setActiveTab('faculty_roster');
    else if (role === 'institute') setActiveTab('institute_overview');
    else if (role === 'parent') setActiveTab('parent_overview');
    else setActiveTab('student_dashboard');

    addAuditLog(`AUTH: User '${username}' authenticated successfully via Sovereign IAM.`);
  };

  const switchRole = (role: UserRole) => {
    instantLogin(role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('edu_is_logged_in');
    localStorage.removeItem('edu_role');
    localStorage.removeItem('edu_username');
    setActiveTab('student_dashboard');
    addAuditLog(`AUTH: Session logged out cleanly.`);
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);

    // If it's sent to EduMentor AI or campus global, simulate an intelligent response
    if (msg.recipient === 'edumentor_ai' || msg.text.toLowerCase().includes('help') || msg.text.toLowerCase().includes('apaar') || msg.text.toLowerCase().includes('credit')) {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          sender: 'bot',
          senderName: 'EduMentor AI (Meta AI)',
          senderRole: 'AI Campus Advisor',
          text: `[Sarvam-105b Response] I have analyzed your query regarding "${msg.text}". Based on AICTE regulations and the Academic Bank of Credits (ABC) guideline v4.2, your current transferrable credits (124) satisfy all prerequisite benchmarks. No backlogs are recorded.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: true,
          channel: msg.channel,
          recipient: msg.sender === 'user' ? 'student' : undefined,
          citations: ['AICTE Approval Handbook 2026-27 Section 4', 'ABC Framework Notification MoE/2023/11']
        };
        setChatMessages(p => [...p, reply]);
        addAuditLog(`AI ENGINE: Sarvam-105b RAG inference served for user query.`);
      }, 700);
    }
  };

  const addComplaint = (c: Omit<ComplaintTicket, 'id' | 'ticket_no' | 'created_at'>) => {
    const newTicket: ComplaintTicket = {
      ...c,
      id: `cmp-${Date.now()}`,
      ticket_no: `AIC-GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString().slice(0, 10)
    };
    setComplaints(prev => [newTicket, ...prev]);
    addAuditLog(`AICTE WORKFLOW: Complaint ticket #${newTicket.ticket_no} lodged and forwarded to ${newTicket.assigned_bureau}.`);
  };

  const payFee = (amount: number, remarks: string) => {
    addAuditLog(`PFMS / UPI ESCROW: Fee payment of ₹${amount.toLocaleString('en-IN')} confirmed for [${remarks}]. Transaction ID: TXN-${Date.now().toString().slice(-8)}.`);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        currentRole,
        activeTab,
        setActiveTab,
        selectedInstitution,
        setSelectedInstitution,
        students,
        complaints,
        fdrEscrow,
        chatMessages,
        login,
        instantLogin,
        switchRole,
        logout,
        addChatMessage,
        addComplaint,
        payFee,
        auditLogs,
        biometricLogs,
        recordBiometricAttempt
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
