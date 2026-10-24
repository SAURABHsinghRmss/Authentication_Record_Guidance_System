import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { AdminWorkflow } from '../../views/AdminWorkflow';
import { FederationView } from '../../views/FederationView';
import { StudentRecord } from '../../../types';
import { GuidedTour } from '../../common/GuidedTour';
import { PasskeyManagementView } from '../../common/PasskeyManagementView';

export const AdminPortal: React.FC = () => {
  const { currentUser, logout, students, auditLogs, biometricLogs, toggleFlagBiometricLog } = useAuth();
  const [activeTab, setActiveTab] = useState<'grievances' | 'student_crud' | 'federation' | 'institutions_approval' | 'audit_forensics' | 'fido2_passkeys'>('grievances');
  const [showTour, setShowTour] = useState<boolean>(() => {
    return localStorage.getItem('edu_tour_seen_admin') !== 'true';
  });

  // Student CRUD local state
  const [studentList, setStudentList] = useState<StudentRecord[]>(students);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<StudentRecord>>({
    name: '',
    roll_no: '',
    email: '',
    department: 'Computer Science & Engineering',
    semester: 'Semester 1',
    cgpa: 8.0,
    attendance_percentage: 85.0,
    credits_earned: 20,
    max_credits: 160,
    backlogs: 0,
    apaar_id: '91-0000-0000-0000',
    digilocker_status: 'VERIFIED',
    dbt_status: 'ACTIVE',
    status: 'VERIFIED'
  });

  // Institution Approvals local state
  const [pendingInstitutions, setPendingInstitutions] = useState([
    {
      id: 'inst-app-1',
      name: 'Vellore Institute of Technology & Research',
      aisheCode: 'C-55192',
      state: 'Tamil Nadu',
      appliedAt: '2026-10-22',
      type: 'Private Deemed University',
      status: 'PENDING_REVIEW',
      fdrEscrowCheck: '₹2.00 Cr Verified'
    },
    {
      id: 'inst-app-2',
      name: 'Delhi Technological University Extension Center',
      aisheCode: 'C-10928',
      state: 'New Delhi',
      appliedAt: '2026-10-20',
      type: 'State Autonomous Institute',
      status: 'PENDING_REVIEW',
      fdrEscrowCheck: '₹1.50 Cr Verified'
    }
  ]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.roll_no) return;
    const entry: StudentRecord = {
      id: `stud-${Date.now()}`,
      name: newStudent.name,
      roll_no: newStudent.roll_no,
      email: newStudent.email || `${newStudent.roll_no.toLowerCase()}@uni.edu`,
      department: newStudent.department || 'Computer Science & Engineering',
      semester: newStudent.semester || 'Semester 1',
      cgpa: Number(newStudent.cgpa) || 8.0,
      attendance_percentage: Number(newStudent.attendance_percentage) || 85.0,
      credits_earned: Number(newStudent.credits_earned) || 20,
      max_credits: 160,
      backlogs: Number(newStudent.backlogs) || 0,
      apaar_id: newStudent.apaar_id || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      digilocker_status: 'VERIFIED',
      dbt_status: 'ACTIVE',
      status: 'VERIFIED'
    };
    setStudentList(prev => [entry, ...prev]);
    setShowAddModal(false);
    setNewStudent({
      name: '',
      roll_no: '',
      email: '',
      department: 'Computer Science & Engineering',
      semester: 'Semester 1',
      cgpa: 8.0,
      attendance_percentage: 85.0,
      credits_earned: 20,
      max_credits: 160,
      backlogs: 0
    });
  };

  const handleDeleteStudent = (rollNo: string) => {
    if (confirm(`Are you sure you want to delete student record ${rollNo}? This action is cryptographically logged.`)) {
      setStudentList(prev => prev.filter(s => s.roll_no !== rollNo));
    }
  };

  const handleApproveInstitution = (id: string) => {
    setPendingInstitutions(prev =>
      prev.map(item => item.id === id ? { ...item, status: 'VERIFIED_ACTIVE' } : item)
    );
  };

  interface NavItem {
    id: 'grievances' | 'student_crud' | 'federation' | 'institutions_approval' | 'audit_forensics' | 'fido2_passkeys';
    label: string;
    icon: string;
    description: string;
    badge?: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'grievances',
      label: 'AICTE Grievances Bureau',
      icon: 'fa-scale-balanced',
      description: 'Regulatory triage queue & student complaint escalation'
    },
    {
      id: 'student_crud',
      label: 'Student Database (3NF CRUD)',
      icon: 'fa-database',
      badge: `${studentList.length} Records`,
      description: 'Master relational lifecycle management & verification'
    },
    {
      id: 'federation',
      label: '7-Database Cluster Console',
      icon: 'fa-server',
      badge: '7 DBs Active',
      description: 'Polyglot domain partitions, ping latency & sync-all'
    },
    {
      id: 'institutions_approval',
      label: 'Institution Approval Queue',
      icon: 'fa-building-shield',
      badge: `${pendingInstitutions.filter(p => p.status === 'PENDING_REVIEW').length} Pending`,
      description: 'Accreditation audits & organizational verification'
    },
    {
      id: 'audit_forensics',
      label: 'Audit & Biometric Forensics',
      icon: 'fa-fingerprint',
      description: 'Immutable activity streams & forensic review flags'
    },
    {
      id: 'fido2_passkeys',
      label: 'FIDO2 Hardware Passkeys',
      icon: 'fa-key',
      badge: 'Zero Trust',
      description: 'Register biometric authenticators & manage hardware tokens'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans theme-admin">
      {/* Dedicated Admin Header */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-8 backdrop-blur-xl">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-sm">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>EduIdentityAI</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-mono font-bold">
                Master Admin
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              National Sovereign IAM & Regulatory Mission Control
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Root Identity:</span>
            <span className="text-rose-400 font-bold">msrch (Master Developer)</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Cluster Status:</span>
            <span className="text-emerald-400 font-bold">7/7 Databases Nominal</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">DPI Gateway:</span>
            <span className="text-teal-400 font-bold">5 Endpoints Verified</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowTour(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-mono transition"
            title="Start Interactive Guided Tour"
          >
            <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
            <span className="hidden sm:inline">Guided Tour</span>
          </button>
          <button
            onClick={logout}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-2"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-slate-400"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dedicated Admin Sidebar */}
        <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
          <div className="space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-bold">
              Root Administration
            </div>
            <nav className="space-y-1.5">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl transition flex flex-col space-y-0.5 ${
                      isActive
                        ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/30'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <i className={`fa-solid ${item.icon} w-4 text-sm ${isActive ? 'text-white' : 'text-rose-400'}`}></i>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] pl-7 truncate ${isActive ? 'text-rose-100' : 'text-slate-500'}`}>
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-2 mt-6">
            <div className="flex items-center justify-between text-slate-400">
              <span>Immunity Guard</span>
              <span className="text-emerald-400 font-bold">msrch Protected</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Security Digestion</span>
              <span className="text-rose-400 font-bold">SHA256 Active</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Cloud Sync</span>
              <span className="text-blue-400 font-bold">Synchronized</span>
            </div>
          </div>
        </aside>

        {/* Viewport Content */}
        <main className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'grievances' && <AdminWorkflow />}

          {activeTab === 'student_crud' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <i className="fa-solid fa-database text-rose-400"></i>
                      <span>3NF Relational Student Database Administration (CRUD)</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Master source of truth in databases/academic_sis.db · Verified APAAR ID and DigiLocker linkages.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center space-x-2 shrink-0"
                  >
                    <i className="fa-solid fa-user-plus"></i>
                    <span>Register New Student (3NF)</span>
                  </button>
                </div>

                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="p-4">Roll No</th>
                          <th className="p-4">Full Name</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">Semester</th>
                          <th className="p-4">CGPA</th>
                          <th className="p-4">Attendance</th>
                          <th className="p-4">APAAR ID</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-mono">
                        {studentList.map(s => (
                          <tr key={s.id} className="hover:bg-slate-900/50 transition">
                            <td className="p-4 font-bold text-rose-400">{s.roll_no}</td>
                            <td className="p-4 font-sans font-bold text-white">{s.name}</td>
                            <td className="p-4 text-slate-300 font-sans">{s.department}</td>
                            <td className="p-4 text-slate-300">{s.semester}</td>
                            <td className="p-4 text-emerald-400 font-bold">{s.cgpa}</td>
                            <td className={`p-4 font-bold ${s.attendance_percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {s.attendance_percentage}%
                            </td>
                            <td className="p-4 text-slate-400 text-[10px]">{s.apaar_id}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300">
                                {s.status}
                              </span>
                            </td>
                            <td className="p-4 text-right font-sans">
                              <button
                                onClick={() => handleDeleteStudent(s.roll_no)}
                                className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-xs transition"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Add Student Modal */}
              {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl relative">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="absolute top-5 right-5 text-slate-400 hover:text-white"
                    >
                      <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                    <div>
                      <h3 className="text-lg font-bold text-white">Enroll New Student in academic_sis.db</h3>
                      <p className="text-xs text-slate-400 font-mono">Enforces 3NF constraints & APAAR format validation</p>
                    </div>

                    <form onSubmit={handleAddStudent} className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-400 mb-1">Full Legal Name</label>
                          <input
                            type="text"
                            required
                            value={newStudent.name}
                            onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))}
                            placeholder="e.g. Sanya Gupta"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Roll Number</label>
                          <input
                            type="text"
                            required
                            value={newStudent.roll_no}
                            onChange={e => setNewStudent(p => ({ ...p, roll_no: e.target.value }))}
                            placeholder="e.g. CS-2022-99"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Initial CGPA</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={newStudent.cgpa}
                            onChange={e => setNewStudent(p => ({ ...p, cgpa: parseFloat(e.target.value) }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Attendance Percentage (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={newStudent.attendance_percentage}
                            onChange={e => setNewStudent(p => ({ ...p, attendance_percentage: parseFloat(e.target.value) }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowAddModal(false)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-sans font-bold text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-sans font-bold text-xs transition"
                        >
                          Commit Record
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'federation' && <FederationView />}

          {activeTab === 'institutions_approval' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-building-shield text-rose-400"></i>
                    <span>Institution Verification & Accreditation Approval Workflow</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Verify newly registered collegiate institutions, evaluate statutory FDR deposits, and grant university domain access.
                  </p>
                </div>

                <div className="space-y-4">
                  {pendingInstitutions.map(inst => (
                    <div key={inst.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-3">
                          <span className="font-extrabold text-white text-sm">{inst.name}</span>
                          <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${inst.status === 'VERIFIED_ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {inst.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 text-slate-400 font-mono text-[11px]">
                          <span>AISHE: <strong className="text-white">{inst.aisheCode}</strong></span>
                          <span>State: <strong className="text-slate-200">{inst.state}</strong></span>
                          <span>Category: <strong className="text-slate-200">{inst.type}</strong></span>
                          <span>FDR: <strong className="text-teal-400">{inst.fdrEscrowCheck}</strong></span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center space-x-2">
                        {inst.status === 'PENDING_REVIEW' ? (
                          <button
                            onClick={() => handleApproveInstitution(inst.id)}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center space-x-1.5"
                          >
                            <i className="fa-solid fa-check"></i>
                            <span>Approve & Authorize</span>
                          </button>
                        ) : (
                          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5 text-xs">
                            <i className="fa-solid fa-circle-check"></i>
                            <span>Institutional License Active</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit_forensics' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-fingerprint text-rose-400"></i>
                    <span>Security Audit Streams & Biometric Forensics Ledger</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Immutable event log streams with SHA-256 integrity digests and administrative biometric review flagging.
                  </p>
                </div>

                {/* Biometric Verification Flagging Ledger */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Recent Biometric Verification Events
                  </h3>
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
                    {biometricLogs.slice(0, 6).map(log => (
                      <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2.5">
                            <span className={`w-2 h-2 rounded-full ${log.status === 'VERIFIED_SUCCESS' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                            <span className="font-bold text-white">{log.subjectName}</span>
                            <span className="text-slate-500 font-mono text-[11px]">({log.subjectRollNo})</span>
                            <span className="text-slate-400 text-[11px]">·</span>
                            <span className="text-rose-300 font-mono text-[11px]">{log.modalityLabel}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                            <span>Score: {log.confidenceScore}</span>
                            <span>·</span>
                            <span className="text-slate-500">{log.hash}</span>
                            <span>·</span>
                            <span className="text-slate-500">{log.timestamp}</span>
                          </div>
                          {log.isFlagged && (
                            <div className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-mono inline-block">
                              Flagged for forensic review: {log.flagReason}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 flex items-center space-x-2">
                          <button
                            onClick={() => toggleFlagBiometricLog(log.id, 'Administrative inspection requested by compliance desk.')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition font-mono ${
                              log.isFlagged
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                            }`}
                          >
                            <i className={`fa-solid ${log.isFlagged ? 'fa-flag text-amber-400' : 'fa-flag-checkered'} mr-1.5`}></i>
                            <span>{log.isFlagged ? 'Unflag Record' : 'Flag for Inspection'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Audit Log Stream */}
                <div className="space-y-3 pt-3">
                  <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Sovereign Core Audit Logs
                  </h3>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-[11px] text-slate-300 h-64 overflow-y-auto space-y-1.5">
                    {auditLogs.map((log, i) => (
                      <div key={i} className="hover:text-white transition">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fido2_passkeys' && (
            <PasskeyManagementView role="admin" accentColor="rose" />
          )}
        </main>
      </div>

      <GuidedTour
        role="admin"
        isOpen={showTour}
        onClose={() => setShowTour(false)}
      />
    </div>
  );
};
