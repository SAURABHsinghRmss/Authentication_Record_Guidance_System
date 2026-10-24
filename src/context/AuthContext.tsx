import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, StudentRecord, EnrolledInstitution, ComplaintTicket, FdrEscrowRecord, ChatMessage, BiometricLogEntry, BiometricModality, BiometricStatus } from '../types';
import { DEMO_PROFILES, INITIAL_STUDENTS, ENROLLED_INSTITUTIONS, INITIAL_COMPLAINTS, INITIAL_FDR_ESCROW, INITIAL_CHAT_MESSAGES, INITIAL_BIOMETRIC_LOGS } from '../data/mockData';
import { auth, db, googleProvider, signInWithPopup, fbSignOut, onAuthStateChanged, FirebaseUser, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, limit, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: UserProfile;
  currentRole: UserRole;
  firebaseUser: FirebaseUser | null;
  isFirebaseConnected: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedInstitution: EnrolledInstitution;
  setSelectedInstitution: (inst: EnrolledInstitution) => void;
  students: StudentRecord[];
  complaints: ComplaintTicket[];
  fdrEscrow: FdrEscrowRecord[];
  chatMessages: ChatMessage[];
  biometricLogs: BiometricLogEntry[];
  recordBiometricAttempt: (modality: BiometricModality, status: BiometricStatus, confidence: string, notes: string) => Promise<void>;
  toggleFlagBiometricLog: (logId: string, reason?: string) => Promise<void>;
  login: (role: UserRole, username: string) => void;
  instantLogin: (role: UserRole) => void;
  loginWithGoogle: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  logout: () => Promise<void>;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addComplaint: (c: Omit<ComplaintTicket, 'id' | 'ticket_no' | 'created_at'>) => Promise<void>;
  payFee: (amount: number, remarks: string) => void;
  auditLogs: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

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
    `[${new Date().toISOString().slice(0, 19)}] FIREBASE SECURE CONNECTIVITY: Cloud Firestore & Firebase Auth initialized.`,
    `[${new Date().toISOString().slice(0, 19)}] SYSTEM ONLINE: Sovereign React Core mounted with DPI Integration.`,
    `[${new Date().toISOString().slice(0, 19)}] FEDERATION: 7 partitioned databases connected and verified.`
  ]);

  const addAuditLog = (msg: string) => {
    const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setAuditLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setIsFirebaseConnected(true);
        const isAdminUser = fbUser.email === 'ssrmsr06@gmail.com';
        const assignedRole: UserRole = isAdminUser ? 'admin' : ((localStorage.getItem('edu_role') as UserRole) || 'student');

        const userDocRef = doc(db, 'users', fbUser.uid);
        try {
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            const profile: UserProfile = {
              username: fbUser.email?.split('@')[0] || 'user',
              name: data.displayName || fbUser.displayName || 'Authorized User',
              role: data.role || assignedRole,
              email: fbUser.email || '',
              mobile: data.mobile || '+91 98765 00000',
              institution: data.institution || 'GL Bajaj Institute of Technology and Management',
              avatar: fbUser.photoURL || undefined,
              apaarId: data.apaarId || '91-4458-9921-3412',
              rollNo: data.rollNo || 'CS-2022-04'
            };
            setCurrentUser(profile);
            setCurrentRole(profile.role);
          } else {
            const profile: UserProfile = {
              username: fbUser.email?.split('@')[0] || 'user',
              name: fbUser.displayName || 'Authorized User',
              role: assignedRole,
              email: fbUser.email || '',
              mobile: '+91 98765 00000',
              institution: 'GL Bajaj Institute of Technology and Management',
              avatar: fbUser.photoURL || undefined,
              apaarId: '91-4458-9921-3412',
              rollNo: 'CS-2022-04'
            };
            await setDoc(userDocRef, {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: profile.name,
              role: profile.role,
              institution: profile.institution,
              mobile: profile.mobile,
              rollNo: profile.rollNo,
              apaarId: profile.apaarId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            setCurrentUser(profile);
            setCurrentRole(profile.role);
          }
          setIsLoggedIn(true);
          localStorage.setItem('edu_is_logged_in', 'true');
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time synchronization of Biometric Logs from Firestore
  useEffect(() => {
    if (!firebaseUser) return;

    const isAdminUser = firebaseUser.email === 'ssrmsr06@gmail.com' || currentRole === 'admin';
    const logsCol = collection(db, 'biometric_logs');
    const logsQuery = isAdminUser
      ? query(logsCol, limit(50))
      : query(logsCol, where('userId', '==', firebaseUser.uid), limit(50));

    const unsubscribe = onSnapshot(
      logsQuery,
      (snapshot) => {
        const fetched: BiometricLogEntry[] = [];
        snapshot.forEach((d) => {
          fetched.push(d.data() as BiometricLogEntry);
        });
        if (fetched.length > 0) {
          setBiometricLogs(prev => {
            // Merge with local logs, prioritizing server entries
            const serverIds = new Set(fetched.map(f => f.id));
            const remainingLocal = prev.filter(p => !serverIds.has(p.id));
            return [...fetched, ...remainingLocal];
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'biometric_logs');
      }
    );

    return () => unsubscribe();
  }, [firebaseUser, currentRole]);

  // Real-time synchronization of Complaints from Firestore
  useEffect(() => {
    if (!firebaseUser) return;

    const isAdminUser = firebaseUser.email === 'ssrmsr06@gmail.com' || currentRole === 'admin';
    const complaintsCol = collection(db, 'complaints');
    const compQuery = isAdminUser
      ? query(complaintsCol, limit(50))
      : query(complaintsCol, where('userId', '==', firebaseUser.uid), limit(50));

    const unsubscribe = onSnapshot(
      compQuery,
      (snapshot) => {
        const fetched: ComplaintTicket[] = [];
        snapshot.forEach((d) => {
          fetched.push(d.data() as ComplaintTicket);
        });
        if (fetched.length > 0) {
          setComplaints(prev => {
            const serverIds = new Set(fetched.map(f => f.id));
            const remainingLocal = prev.filter(p => !serverIds.has(p.id));
            return [...fetched, ...remainingLocal];
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'complaints');
      }
    );

    return () => unsubscribe();
  }, [firebaseUser, currentRole]);

  const recordBiometricAttempt = async (
    modality: BiometricModality,
    status: BiometricStatus,
    confidence: string,
    notes: string
  ) => {
    const labelMap: Record<BiometricModality, string> = {
      FACE_3D: '3D Facial Liveness & Depth Mesh',
      OCR_ID: 'Physical Student ID Card OCR',
      VOICE_SPECTROGRAM: 'Acoustic Voiceprint Spectrogram'
    };
    const now = new Date();
    const formattedTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');
    const randomHex = Math.random().toString(16).substring(2, 14);
    const logId = `bio-${Date.now()}`;

    const newEntry: BiometricLogEntry = {
      id: logId,
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

    // If authenticated with Firebase, write audit entry directly to Firestore with error handling
    if (auth.currentUser) {
      try {
        const logDocRef = doc(db, 'biometric_logs', logId);
        await setDoc(logDocRef, {
          id: logId,
          userId: auth.currentUser.uid,
          modality,
          modalityLabel: labelMap[modality],
          status,
          timestamp: formattedTimestamp,
          relativeTime: 'Just now',
          subjectRollNo: newEntry.subjectRollNo,
          subjectName: newEntry.subjectName,
          confidenceScore: confidence,
          hash: newEntry.hash,
          notes,
          createdAt: now.toISOString()
        });
        addAuditLog(`FIRESTORE SYNC: Biometric record [${logId}] securely written to cloud database.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `biometric_logs/${logId}`);
      }
    }

    if (status === 'REJECTED') {
      const emailEnabled = localStorage.getItem('edu_notify_email_failed_scans') !== 'false';
      const systemEnabled = localStorage.getItem('edu_notify_system_failed_scans') !== 'false';
      const targetEmail = localStorage.getItem('edu_notify_alert_email') || 'ssrmsr06@gmail.com';
      if (emailEnabled || systemEnabled) {
        addAuditLog(`SECURITY ALERT [HIGH-PRIORITY]: High-priority failed biometric scan for ${newEntry.subjectName}. Dispatched incident notice via ${[emailEnabled ? `Email (${targetEmail})` : '', systemEnabled ? 'System Notification Engine' : ''].filter(Boolean).join(' & ')}.`);
      }
    }
  };

  const toggleFlagBiometricLog = async (logId: string, reason?: string) => {
    const existingEntry = biometricLogs.find(b => b.id === logId);
    if (!existingEntry) return;

    const willBeFlagged = !existingEntry.isFlagged;
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const flaggerName = currentUser.name ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : 'Sovereign Administrator';
    const finalReason = willBeFlagged
      ? (reason || (existingEntry.status === 'REJECTED' ? 'Critical spoof or anomaly detected; flagged for forensic examination.' : 'Administrative inspection requested by compliance desk.'))
      : undefined;

    const updatedEntry: BiometricLogEntry = {
      ...existingEntry,
      isFlagged: willBeFlagged,
      flagReason: willBeFlagged ? finalReason : undefined,
      flaggedAt: willBeFlagged ? nowStr : undefined,
      flaggedBy: willBeFlagged ? flaggerName : undefined
    };

    setBiometricLogs(prev => prev.map(item => item.id === logId ? updatedEntry : item));

    addAuditLog(
      `BIOMETRICS AUDIT: Verification log [${logId}] was ${
        willBeFlagged ? 'FLAGGED FOR MANUAL REVIEW' : 'UNFLAGGED / RESOLVED'
      } by ${currentUser.name} [Role: ${currentUser.role}]. ${willBeFlagged && finalReason ? `Reason: "${finalReason}"` : ''}`
    );

    // If connected to Firebase and auth active, sync flag update with Firestore
    if (auth.currentUser) {
      try {
        const logDocRef = doc(db, 'biometric_logs', logId);
        await updateDoc(logDocRef, {
          isFlagged: willBeFlagged,
          flagReason: willBeFlagged ? (finalReason || '') : '',
          flaggedAt: willBeFlagged ? nowStr : '',
          flaggedBy: willBeFlagged ? flaggerName : ''
        });
        addAuditLog(`FIRESTORE SYNC: Biometric review flag on [${logId}] written to cloud ledger.`);
      } catch (err: any) {
        // Document may be pre-seeded mock or Firestore permission checked
        console.warn('Firestore flag update sync note:', err?.message || err);
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isAdminUser = fbUser.email === 'ssrmsr06@gmail.com';
      const assignedRole: UserRole = isAdminUser ? 'admin' : 'student';

      const userDocRef = doc(db, 'users', fbUser.uid);
      let existingData: any = null;
      try {
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          existingData = snap.data();
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, `users/${fbUser.uid}`);
      }

      const profile: UserProfile = {
        username: fbUser.email?.split('@')[0] || 'user',
        name: fbUser.displayName || 'Google Authenticated User',
        role: existingData?.role || assignedRole,
        email: fbUser.email || '',
        mobile: existingData?.mobile || '+91 98765 00000',
        institution: existingData?.institution || 'GL Bajaj Institute of Technology and Management',
        avatar: fbUser.photoURL || undefined,
        apaarId: existingData?.apaarId || '91-4458-9921-3412',
        rollNo: existingData?.rollNo || 'CS-2022-04'
      };

      if (!existingData) {
        try {
          await setDoc(userDocRef, {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: profile.name,
            role: profile.role,
            institution: profile.institution,
            mobile: profile.mobile,
            rollNo: profile.rollNo,
            apaarId: profile.apaarId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (e) {
          handleFirestoreError(e, OperationType.CREATE, `users/${fbUser.uid}`);
        }
      }

      setCurrentRole(profile.role);
      setCurrentUser(profile);
      setIsLoggedIn(true);
      localStorage.setItem('edu_is_logged_in', 'true');
      localStorage.setItem('edu_role', profile.role);
      localStorage.setItem('edu_username', profile.username);

      if (profile.role === 'admin') setActiveTab('admin_crud');
      else if (profile.role === 'faculty') setActiveTab('faculty_roster');
      else if (profile.role === 'institute') setActiveTab('institute_overview');
      else if (profile.role === 'parent') setActiveTab('parent_overview');
      else setActiveTab('student_dashboard');

      addAuditLog(`AUTH (FIREBASE): Successfully logged in via Google Sign-In as ${profile.name} (${profile.email}) [Role: ${profile.role.toUpperCase()}].`);
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      addAuditLog(`AUTH ERROR: Google Sign-In encountered error: ${error?.message || String(error)}`);
      throw error;
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

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    }
    setFirebaseUser(null);
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

  const addComplaint = async (c: Omit<ComplaintTicket, 'id' | 'ticket_no' | 'created_at'>) => {
    const ticketId = `cmp-${Date.now()}`;
    const newTicket: ComplaintTicket = {
      ...c,
      id: ticketId,
      ticket_no: `AIC-GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString().slice(0, 10)
    };
    setComplaints(prev => [newTicket, ...prev]);
    addAuditLog(`AICTE WORKFLOW: Complaint ticket #${newTicket.ticket_no} lodged and forwarded to ${newTicket.assigned_bureau}.`);

    if (auth.currentUser) {
      try {
        const docRef = doc(db, 'complaints', ticketId);
        await setDoc(docRef, {
          id: ticketId,
          ticket_no: newTicket.ticket_no,
          userId: auth.currentUser.uid,
          complainant: newTicket.complainant,
          complainant_role: newTicket.complainant_role,
          institution: newTicket.institution,
          category: newTicket.category,
          subject: newTicket.subject,
          description: newTicket.description,
          severity: newTicket.severity,
          status: newTicket.status,
          assigned_bureau: newTicket.assigned_bureau,
          created_at: newTicket.created_at
        });
        addAuditLog(`FIRESTORE SYNC: Complaint #${newTicket.ticket_no} saved to cloud database.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `complaints/${ticketId}`);
      }
    }
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
        firebaseUser,
        isFirebaseConnected,
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
        loginWithGoogle,
        switchRole,
        logout,
        addChatMessage,
        addComplaint,
        payFee,
        auditLogs,
        biometricLogs,
        recordBiometricAttempt,
        toggleFlagBiometricLog
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
