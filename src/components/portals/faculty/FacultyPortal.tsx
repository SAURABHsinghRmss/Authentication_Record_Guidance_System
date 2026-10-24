import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { FacultyDesk } from '../../views/FacultyDesk';
import { GuidedTour } from '../../common/GuidedTour';

export const FacultyPortal: React.FC = () => {
  const { currentUser, logout, students, addChatMessage } = useAuth();
  const [activeTab, setActiveTab] = useState<'roster' | 'at_risk' | 'counseling' | 'pedagogy_ai' | 'research_verifier'>('roster');
  const [showTour, setShowTour] = useState<boolean>(() => {
    return localStorage.getItem('edu_tour_seen_faculty') !== 'true';
  });

  // Filter at-risk students (< 75% attendance or > 0 backlogs)
  const atRiskStudents = students.filter(
    s => s.attendance_percentage < 75 || s.backlogs > 0
  );

  // Longitudinal counseling notes state
  const [counselingNotes, setCounselingNotes] = useState([
    {
      id: 'cn-1',
      studentRollNo: 'CS-2022-04',
      studentName: 'Amit Sharma',
      semester: 'Semester 6',
      date: '2026-10-18',
      category: 'Career & SWAYAM Credits',
      notes: 'Advised student to register for 4 SWAYAM credits in Advanced Algorithms to satisfy prerequisite benchmarks. Good academic consistency.',
      mentorName: 'Dr. Priya Sen',
      actionTaken: 'Credit transfer pathway approved'
    },
    {
      id: 'cn-2',
      studentRollNo: 'CS-2022-12',
      studentName: 'Rahul Verma',
      semester: 'Semester 5',
      date: '2026-10-14',
      category: 'Attendance Remediation',
      notes: 'Attendance at 68.5%. Discussed medical leave documentation requirement and assigned peer study buddy for operating systems lab.',
      mentorName: 'Dr. Priya Sen',
      actionTaken: 'Dispatched parent remediation alert'
    }
  ]);

  const [newNote, setNewNote] = useState({
    rollNo: 'CS-2022-04',
    category: 'Academic Performance',
    notes: ''
  });

  const [noticeSentRollNos, setNoticeSentRollNos] = useState<Record<string, boolean>>({});

  // Journal/Conference URL Verifier state
  const [journalUrl, setJournalUrl] = useState('');
  const [journalResult, setJournalResult] = useState<{
    tested: boolean;
    trustScore?: number;
    status?: 'INDEXED_VALID' | 'SUSPICIOUS_UNLISTED';
    indexers?: string[];
    remarks?: string;
  }>({ tested: false });

  const handleDispatchNotice = (studentRollNo: string, studentName: string) => {
    setNoticeSentRollNos(prev => ({ ...prev, [studentRollNo]: true }));
    addChatMessage({
      sender: 'user',
      senderName: currentUser.name || 'Dr. Priya Sen',
      senderRole: 'Faculty Mentor',
      text: `[OFFICIAL NOTICE] Academic remediation notice dispatched to ${studentName} (${studentRollNo}). Mandatory meeting scheduled with faculty mentor.`,
      channel: 'FACULTY_MENTOR',
      recipient: studentRollNo
    });
  };

  const handleAddCounselingNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.notes.trim()) return;
    const targetStudent = students.find(s => s.roll_no === newNote.rollNo);
    const entry = {
      id: `cn-${Date.now()}`,
      studentRollNo: newNote.rollNo,
      studentName: targetStudent?.name || 'Selected Student',
      semester: targetStudent?.semester || 'Semester 6',
      date: new Date().toISOString().slice(0, 10),
      category: newNote.category,
      notes: newNote.notes,
      mentorName: currentUser.name || 'Dr. Priya Sen',
      actionTaken: 'Logged to longitudinal student archive'
    };
    setCounselingNotes(prev => [entry, ...prev]);
    setNewNote(p => ({ ...p, notes: '' }));
  };

  const verifyJournalUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalUrl) return;
    const isEduOrOrg = journalUrl.includes('ieee.org') || journalUrl.includes('acm.org') || journalUrl.includes('springer.com');
    setJournalResult({
      tested: true,
      trustScore: isEduOrOrg ? 96 : 42,
      status: isEduOrOrg ? 'INDEXED_VALID' : 'SUSPICIOUS_UNLISTED',
      indexers: isEduOrOrg ? ['SCOPUS Indexed', 'UGC-CARE List Group I', 'Web of Science'] : ['Unverified Domain Registrar', 'Missing ISSN verification'],
      remarks: isEduOrOrg ? 'Verified high-impact peer-reviewed publication venue.' : 'Potential predatory conference or unaccredited symposium. Proceed with caution.'
    });
  };

  interface NavItem {
    id: 'roster' | 'at_risk' | 'counseling' | 'pedagogy_ai' | 'research_verifier';
    label: string;
    icon: string;
    description: string;
    badge?: string;
    badgeColor?: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'roster',
      label: 'Mentorship Roster',
      icon: 'fa-chalkboard-user',
      badge: `${students.length} Mentees`,
      description: 'Student academic metrics, CGPA & attendance rosters'
    },
    {
      id: 'at_risk',
      label: 'At-Risk Warning Desk',
      icon: 'fa-triangle-exclamation',
      badge: `${atRiskStudents.length} Flagged`,
      badgeColor: 'bg-rose-500/20 text-rose-300',
      description: 'Attendance < 75% alerts & one-click counseling dispatch'
    },
    {
      id: 'counseling',
      label: 'Longitudinal Ledger',
      icon: 'fa-book-bookmark',
      description: 'Multi-semester student counseling notes & progress logs'
    },
    {
      id: 'pedagogy_ai',
      label: 'Pedagogy AI Assistant',
      icon: 'fa-brain',
      description: 'Quiz generation, syllabus rubrics & thread summarizer'
    },
    {
      id: 'research_verifier',
      label: 'Research & Journal Verifier',
      icon: 'fa-newspaper',
      description: 'Check CFP legitimacy & UGC-CARE journal indexing'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans theme-faculty">
      {/* Dedicated Faculty Header */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-8 backdrop-blur-xl">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
            <i className="fa-solid fa-chalkboard-user"></i>
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>EduIdentityAI</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono font-bold">
                Faculty
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Academic Mentorship & Roster Governance Desk
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Mentor:</span>
            <span className="text-white font-bold">{currentUser.name || 'Dr. Priya Sen'}</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Department:</span>
            <span className="text-indigo-400 font-bold">Computer Science & Engineering</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Mentees:</span>
            <span className="text-slate-200 font-bold">{students.length} Total</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">At-Risk Count:</span>
            <span className="text-rose-400 font-bold">{atRiskStudents.length} Critical</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowTour(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 text-xs font-mono transition"
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
        {/* Dedicated Faculty Sidebar */}
        <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
          <div className="space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-bold">
              Faculty Workspace
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
                        ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <i className={`fa-solid ${item.icon} w-4 text-sm ${isActive ? 'text-white' : 'text-indigo-400'}`}></i>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300')}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] pl-7 truncate ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-2 mt-6">
            <div className="flex items-center justify-between text-slate-400">
              <span>Threshold Standard</span>
              <span className="text-amber-400 font-bold">75.0% Mandatory</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Counseling Queue</span>
              <span className="text-emerald-400 font-bold">{counselingNotes.length} Archived</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Pedagogy Engine</span>
              <span className="text-indigo-400 font-bold">Sarvam AI Active</span>
            </div>
          </div>
        </aside>

        {/* Viewport Content */}
        <main className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Faculty Mentorship Hero Banner for Roster View */}
          {activeTab === 'roster' && (
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl max-w-7xl mx-auto">
              <div className="h-36 sm:h-44 w-full relative">
                <img
                  src="/src/assets/images/faculty_academic_counseling_1792870360404.jpg"
                  alt="Faculty Mentorship & Academic Counseling"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-35 filter saturate-120"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                      Department of Computer Science &amp; Engineering
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Academic Advising Council</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      Faculty Mentorship &amp; Counseling Desk
                    </h2>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      Overseeing {students.length} assigned mentees · {atRiskStudents.length} requiring attendance or backlog interventions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'roster' && <FacultyDesk />}

          {activeTab === 'at_risk' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <i className="fa-solid fa-triangle-exclamation text-rose-400"></i>
                      <span>At-Risk Student Early Warning & Counseling Desk</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Identifies students falling below the statutory 75% attendance threshold or carrying active backlog deficits.
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold shrink-0">
                    {atRiskStudents.length} Students Require Intervention
                  </div>
                </div>

                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="p-4">Student</th>
                          <th className="p-4">Roll No</th>
                          <th className="p-4">Semester</th>
                          <th className="p-4">Attendance</th>
                          <th className="p-4">Backlogs</th>
                          <th className="p-4 text-right">Intervention Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {atRiskStudents.map(s => {
                          const isSent = noticeSentRollNos[s.roll_no];
                          return (
                            <tr key={s.id} className="hover:bg-slate-900/50 transition">
                              <td className="p-4 font-bold text-white">{s.name}</td>
                              <td className="p-4 font-mono text-slate-400">{s.roll_no}</td>
                              <td className="p-4 text-slate-300">{s.semester}</td>
                              <td className="p-4 font-mono font-bold text-rose-400">
                                {s.attendance_percentage}%
                              </td>
                              <td className="p-4 font-mono">
                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold">
                                  {s.backlogs} Backlog{s.backlogs > 1 ? 's' : ''}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDispatchNotice(s.roll_no, s.name)}
                                  disabled={isSent}
                                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center space-x-1.5 ml-auto ${
                                    isSent
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                                  }`}
                                >
                                  <i className={`fa-solid ${isSent ? 'fa-check' : 'fa-paper-plane'}`}></i>
                                  <span>{isSent ? 'Notice Dispatched' : 'Send Counseling Notice'}</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'counseling' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Longitudinal Student Counseling Ledger</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-semester archival records of faculty interventions, academic coaching discussions, and parental notifications.
                  </p>
                </div>

                {/* Form to log new counseling entry */}
                <form onSubmit={handleAddCounselingNote} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="text-xs font-bold text-slate-200">Record New Mentoring Consultation Note</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-mono text-[11px]">Select Mentee</label>
                      <select
                        value={newNote.rollNo}
                        onChange={e => setNewNote(p => ({ ...p, rollNo: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      >
                        {students.map(s => (
                          <option key={s.id} value={s.roll_no}>
                            {s.name} ({s.roll_no}) — {s.semester}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-mono text-[11px]">Counseling Category</label>
                      <select
                        value={newNote.category}
                        onChange={e => setNewNote(p => ({ ...p, category: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="Academic Performance">Academic Performance & CGPA Recovery</option>
                        <option value="Attendance Remediation">Mandatory 75% Attendance Remediation</option>
                        <option value="Career & SWAYAM Credits">SWAYAM / NPTEL MOOC Credit Transfer</option>
                        <option value="Capstone & Lab Progress">Capstone Project & Laboratory Ethics</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono text-[11px]">Observation & Action Plan</label>
                    <textarea
                      value={newNote.notes}
                      onChange={e => setNewNote(p => ({ ...p, notes: e.target.value }))}
                      placeholder="Enter counseling summary, student response, and agreed timeline..."
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
                    >
                      <i className="fa-solid fa-floppy-disk"></i>
                      <span>Save to Permanent Student Record</span>
                    </button>
                  </div>
                </form>

                {/* Ledger Listing */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-200">Historical Mentorship Ledger Entries</h3>
                  <div className="space-y-3">
                    {counselingNotes.map(n => (
                      <div key={n.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{n.studentName}</span>
                            <span className="font-mono text-slate-400">({n.studentRollNo})</span>
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">{n.semester}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                            <span>Logged by {n.mentorName}</span>
                            <span>·</span>
                            <span>{n.date}</span>
                          </div>
                        </div>
                        <div className="text-indigo-300 font-semibold text-[11px] font-mono">{n.category}</div>
                        <p className="text-slate-300 leading-relaxed">{n.notes}</p>
                        <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 pt-1">
                          <i className="fa-solid fa-check"></i>
                          <span>Action status: {n.actionTaken}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pedagogy_ai' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-brain text-indigo-400"></i>
                    <span>EduMentor AI Pedagogical Assistant for Faculty</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Generate syllabus-aligned 4-option check-in quizzes, lecture discussion summaries, and IEEE/APA citation models.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      <i className="fa-solid fa-clipboard-question"></i>
                    </div>
                    <h3 className="font-bold text-white">Quiz Generation (MCQ)</h3>
                    <p className="text-slate-400 text-[11px]">
                      Instantly synthesizes 4-option multiple-choice check-in questions with hints and detailed explanations.
                    </p>
                    <button
                      onClick={() => {
                        addChatMessage({
                          sender: 'user',
                          senderName: currentUser.name || 'Dr. Priya Sen',
                          senderRole: 'Faculty Mentor',
                          text: '@ai generate 4-option quiz on B-Trees and Disk I/O complexity',
                          channel: 'FACULTY_MENTOR'
                        });
                        alert('Sample quiz generated into faculty pedagogical stream.');
                      }}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 font-mono text-[11px] font-bold border border-slate-800 transition"
                    >
                      Generate B-Tree Quiz
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      <i className="fa-solid fa-align-left"></i>
                    </div>
                    <h3 className="font-bold text-white">Thread Summarization</h3>
                    <p className="text-slate-400 text-[11px]">
                      Distills student project team discussions into structured key takeaways and action items.
                    </p>
                    <button
                      onClick={() => {
                        addChatMessage({
                          sender: 'user',
                          senderName: currentUser.name || 'Dr. Priya Sen',
                          senderRole: 'Faculty Mentor',
                          text: '@ai summarize student lab questions for Operating Systems week 6',
                          channel: 'FACULTY_MENTOR'
                        });
                        alert('Thread summary synthesized into faculty advisory stream.');
                      }}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 font-mono text-[11px] font-bold border border-slate-800 transition"
                    >
                      Summarize Lab Inquiries
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <i className="fa-solid fa-scale-balanced"></i>
                    </div>
                    <h3 className="font-bold text-white">Academic Integrity Validator</h3>
                    <p className="text-slate-400 text-[11px]">
                      Generates standard IEEE and APA 7th edition citation blueprints for student capstone literature reviews.
                    </p>
                    <button
                      onClick={() => {
                        addChatMessage({
                          sender: 'user',
                          senderName: currentUser.name || 'Dr. Priya Sen',
                          senderRole: 'Faculty Mentor',
                          text: '@ai provide IEEE citation formatting guide for transformer attention papers',
                          channel: 'FACULTY_MENTOR'
                        });
                        alert('Citation guide prepared in faculty advisory feed.');
                      }}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 font-mono text-[11px] font-bold border border-slate-800 transition"
                    >
                      Format IEEE Citation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'research_verifier' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-newspaper text-indigo-400"></i>
                    <span>Academic Journal & Conference CFP Verifier</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Heuristic trust scoring to safeguard student researchers and faculty from predatory publishers and fake conferences.
                  </p>
                </div>

                <form onSubmit={verifyJournalUrl} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <label className="block text-xs font-bold text-slate-200">Enter Conference / Journal URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={journalUrl}
                      onChange={e => setJournalUrl(e.target.value)}
                      placeholder="e.g. https://www.computer.org/conferences/ieee-icse or https://predatory-journal.org"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shrink-0"
                    >
                      Audit Venue
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono">
                    <span>Quick checks:</span>
                    <button
                      type="button"
                      onClick={() => setJournalUrl('https://ieee.org/conferences/iccv2026')}
                      className="text-indigo-400 hover:underline"
                    >
                      IEEE ICCV (Valid)
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => setJournalUrl('https://fast-track-phd-conference.xyz')}
                      className="text-rose-400 hover:underline"
                    >
                      Fast-Track Conference (Predatory)
                    </button>
                  </div>
                </form>

                {journalResult.tested && (
                  <div className={`p-5 rounded-2xl border ${journalResult.status === 'INDEXED_VALID' ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'} space-y-3 text-xs`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Audit Verdict</span>
                      <span className={`font-mono font-bold px-2.5 py-0.5 rounded-full text-[11px] ${journalResult.status === 'INDEXED_VALID' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {journalResult.status} · Trust Score: {journalResult.trustScore}/100
                      </span>
                    </div>
                    <p className="text-slate-300">{journalResult.remarks}</p>
                    <div className="space-y-1 font-mono text-[11px] text-slate-400">
                      {journalResult.indexers?.map((idx, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <i className={`fa-solid ${journalResult.status === 'INDEXED_VALID' ? 'fa-check text-emerald-400' : 'fa-xmark text-rose-400'}`}></i>
                          <span>{idx}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <GuidedTour
        role="faculty"
        isOpen={showTour}
        onClose={() => setShowTour(false)}
      />
    </div>
  );
};
