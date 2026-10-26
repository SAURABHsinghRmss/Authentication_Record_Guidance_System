import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { StudentDashboard } from '../../views/StudentDashboard';
import { AcademicGuidance } from '../../views/AcademicGuidance';
import { ScamShield } from '../../views/ScamShield';
import { CareerPathways } from '../../views/CareerPathways';
import { BiometricsModal } from '../../views/BiometricsModal';
import { EnrolledInstitutionsHub } from '../../views/EnrolledInstitutionsHub';
import { UnifiedChat } from '../../views/UnifiedChat';
import { VideoEditStudio } from '../../views/VideoEditStudio';
import { GuidedTour } from '../../common/GuidedTour';

export const StudentPortal: React.FC = () => {
  const { currentUser, logout, biometricLogs, students } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'erp' | 'guidance' | 'biometrics' | 'scam_shield' | 'career' | 'unified_chat' | 'video_edit'>('overview');
  const [showBiometricsModal, setShowBiometricsModal] = useState(false);
  const [showTour, setShowTour] = useState<boolean>(() => {
    return localStorage.getItem('edu_tour_seen_student') !== 'true';
  });

  // Student specific record
  const student = students[0] || {
    name: currentUser.name || 'Amit Sharma',
    roll_no: currentUser.rollNo || 'CS-2022-04',
    department: 'Computer Science & Engineering',
    semester: 'Semester 6',
    cgpa: 8.74,
    attendance_percentage: 88.5,
    credits_earned: 124,
    max_credits: 160,
    backlogs: 0,
    apaar_id: currentUser.apaarId || '91-4458-9921-3412',
    digilocker_status: 'VERIFIED',
    dbt_status: 'ACTIVE'
  };

  const navItems = [
    {
      id: 'overview',
      label: 'Academic Overview',
      icon: 'fa-gauge-high',
      description: 'Transcript metrics, APAAR ID & attendance compliance'
    },
    {
      id: 'erp',
      label: 'Campus ERP & Courses',
      icon: 'fa-book-open',
      description: 'Course registration, timetable & university credentials'
    },
    {
      id: 'guidance',
      label: 'EduMentor AI & Guidance',
      icon: 'fa-graduation-cap',
      description: '24/7 Academic RAG advisor & 8 educational criteria'
    },
    {
      id: 'biometrics',
      label: 'Biometric Pass & OCR',
      icon: 'fa-fingerprint',
      description: '3D facial depth, student ID OCR & acoustic voice check'
    },
    {
      id: 'scam_shield',
      label: 'Opportunity Scam Shield',
      icon: 'fa-shield-halved',
      description: 'URL trust scoring for scholarships & internships'
    },
    {
      id: 'career',
      label: 'Career Pathways',
      icon: 'fa-briefcase',
      description: 'Placement drives, tech roadmap & skill milestones'
    },
    {
      id: 'unified_chat',
      label: 'Unified Agora & Chat',
      icon: 'fa-comments',
      description: 'Sovereign campus agora, AI mentor & direct messaging'
    },
    {
      id: 'video_edit',
      label: 'Sovereign Video Edit Studio',
      icon: 'fa-video',
      description: 'AI lecture cutting, subtitles & 4K media rendering'
    }
  ] as const;

  const renderActiveView = () => {
    switch (activeTab) {
      case 'erp':
        return <EnrolledInstitutionsHub />;
      case 'guidance':
        return <AcademicGuidance />;
      case 'biometrics':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-2xl font-bold border border-blue-500/30">
                    <i className="fa-solid fa-fingerprint"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Student Biometric Pass & Identity Liveness</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Sovereign 3-factor biometric verification for examination entry & hall ticket clearance.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBiometricsModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center space-x-2 shrink-0"
                >
                  <i className="fa-solid fa-camera"></i>
                  <span>Launch Biometric Terminal</span>
                </button>
              </div>

              {/* Status Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">3D Facial Liveness</div>
                  <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                    <span>Verified Active</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-slate-500 text-[10px]">Depth mesh: 98.4% confidence</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Physical ID OCR</div>
                  <div className="text-blue-400 font-bold text-sm flex items-center gap-1.5">
                    <span>Card Authenticated</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  </div>
                  <div className="text-slate-500 text-[10px]">Checksum: SHA256 Match</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Acoustic Voiceprint</div>
                  <div className="text-purple-400 font-bold text-sm flex items-center gap-1.5">
                    <span>Enrolled</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  </div>
                  <div className="text-slate-500 text-[10px]">Spectrogram: 96.2% pitch lock</div>
                </div>
              </div>

              {/* Personal Verification History */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-200">Personal Biometric Verification History</h3>
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="divide-y divide-slate-800/80">
                    {biometricLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center space-x-3">
                          <span className={`w-2 h-2 rounded-full ${log.status === 'VERIFIED_SUCCESS' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                          <div>
                            <span className="font-semibold text-white">{log.modalityLabel}</span>
                            <span className="text-slate-500 ml-2 font-mono text-[11px]">{log.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                          <span>Score: {log.confidenceScore}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-500">{log.hash.slice(0, 16)}...</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'scam_shield':
        return <ScamShield />;
      case 'career':
        return <CareerPathways />;
      case 'overview':
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans theme-student">
      {/* Dedicated Student Header */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-8 backdrop-blur-xl">
        {/* Zone 1: Wordmark & Role Subtitle */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>EduIdentityAI</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono font-bold">
                Student
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Academic Identity & Learning Portal
            </div>
          </div>
        </div>

        {/* Zone 2: Student Identity Badges */}
        <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Learner:</span>
            <span className="text-white font-bold">{student.name}</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Roll No:</span>
            <span className="text-blue-400 font-bold">{student.roll_no}</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">APAAR ID:</span>
            <span className="text-slate-300 font-bold">{student.apaar_id}</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Attendance:</span>
            <span className={`font-bold ${student.attendance_percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {student.attendance_percentage}%
            </span>
          </div>
        </div>

        {/* Zone 3: Actions & Logout */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowTour(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 text-xs font-mono transition"
            title="Start Interactive Guided Tour"
          >
            <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
            <span className="hidden sm:inline">Guided Tour</span>
          </button>
          <button
            onClick={() => setShowBiometricsModal(true)}
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-slate-300 text-xs font-mono transition"
            title="Multimodal Biometrics Terminal"
          >
            <i className="fa-solid fa-fingerprint text-blue-400"></i>
            <span>Scan ID</span>
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
        {/* Dedicated Student Sidebar */}
        <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
          <div className="space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-bold">
              Student Workspace
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
                        ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-xs">
                      <i className={`fa-solid ${item.icon} w-4 text-sm ${isActive ? 'text-white' : 'text-blue-400'}`}></i>
                      <span>{item.label}</span>
                    </div>
                    <span className={`text-[10px] pl-7 truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Student Status Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-2 mt-6">
            <div className="flex items-center justify-between text-slate-400">
              <span>DigiLocker Sync</span>
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>ABC Credits</span>
              <span className="text-blue-400 font-bold">{student.credits_earned}/{student.max_credits}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Exam Clearance</span>
              <span className="text-emerald-400 font-bold">Cleared (0 Backlogs)</span>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Subtle Student Study Lab Hero Banner for Overview tab */}
          {activeTab === 'overview' && (
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl max-w-7xl mx-auto">
              <div className="h-36 sm:h-44 w-full relative">
                <img
                  src="/src/assets/images/student_learning_workspace_1792870359560.jpg"
                  alt="Student Academic Workspace"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-40 filter saturate-125"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                      Academic Term 2026-27
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Computer Science & Engineering</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      Welcome back, {student.name}
                    </h2>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      Roll No: {student.roll_no} · APAAR: {student.apaar_id} · All pre-requisite benchmarks fulfilled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {renderActiveView()}
        </main>
      </div>

      <BiometricsModal
        isOpen={showBiometricsModal}
        onClose={() => setShowBiometricsModal(false)}
      />

      <GuidedTour
        role="student"
        isOpen={showTour}
        onClose={() => setShowTour(false)}
      />
    </div>
  );
};
