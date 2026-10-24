import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { InstituteGovernance } from '../../views/InstituteGovernance';
import { GuidedTour } from '../../common/GuidedTour';

export const InstitutePortal: React.FC = () => {
  const { currentUser, logout, fdrEscrow, addChatMessage } = useAuth();
  const [activeTab, setActiveTab] = useState<'sif_governance' | 'departments' | 'broadcaster' | 'accreditation' | 'escrow'>('sif_governance');
  const [showTour, setShowTour] = useState<boolean>(() => {
    return localStorage.getItem('edu_tour_seen_institute') !== 'true';
  });

  // Broadcast state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [targetCategory, setTargetCategory] = useState<'GLOBAL_CAMPUS' | 'ACADEMIC_BULLETIN'>('ACADEMIC_BULLETIN');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const departments = [
    {
      code: 'CSE',
      name: 'Computer Science & Engineering',
      hod: 'Dr. Amitabh Verma',
      sanctionedIntake: 240,
      enrolled: 238,
      facultyCount: 16,
      fsrRatio: '1:14.8 (Compliant)',
      labReadiness: '100% (4 AI/GPU Labs)'
    },
    {
      code: 'ECE',
      name: 'Electronics & Communication',
      hod: 'Dr. Shalini Saxena',
      sanctionedIntake: 180,
      enrolled: 172,
      facultyCount: 12,
      fsrRatio: '1:14.3 (Compliant)',
      labReadiness: '95% (VLSI & Embedded)'
    },
    {
      code: 'IT',
      name: 'Information Technology',
      hod: 'Dr. Rajesh Tripathi',
      sanctionedIntake: 120,
      enrolled: 119,
      facultyCount: 8,
      fsrRatio: '1:14.9 (Compliant)',
      labReadiness: '100% (Cloud & DevOps)'
    },
    {
      code: 'ME',
      name: 'Mechanical Engineering',
      hod: 'Dr. V. K. Singh',
      sanctionedIntake: 60,
      enrolled: 54,
      facultyCount: 5,
      fsrRatio: '1:10.8 (Compliant)',
      labReadiness: '92% (Robotics & CAD)'
    }
  ];

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    addChatMessage({
      sender: 'user',
      senderName: currentUser.name || 'GLBITM Director',
      senderRole: 'Institute Administration',
      text: `[OFFICIAL ${targetCategory}] ${noticeTitle.toUpperCase()}: ${noticeContent}`,
      channel: 'GLOBAL'
    });

    setBroadcastSent(true);
    setNoticeTitle('');
    setNoticeContent('');
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  interface NavItem {
    id: 'sif_governance' | 'departments' | 'broadcaster' | 'accreditation' | 'escrow';
    label: string;
    icon: string;
    description: string;
    badge?: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'sif_governance',
      label: 'AICTE SIF Governance',
      icon: 'fa-building-columns',
      description: 'Standard Inspection Format compliance & land norms'
    },
    {
      id: 'departments',
      label: 'Departments & Faculty Load',
      icon: 'fa-users-gear',
      badge: '4 Depts',
      description: 'Sanctioned intake, HOD rosters & FSR ratios'
    },
    {
      id: 'broadcaster',
      label: 'Statutory Bulletin Broadcaster',
      icon: 'fa-bullhorn',
      description: 'Publish official circulars to #campus_global & bulletin'
    },
    {
      id: 'accreditation',
      label: 'Accreditation Vault',
      icon: 'fa-certificate',
      badge: 'NAAC A++',
      description: 'NBA tier-1 status, Autonomous gazette & validity'
    },
    {
      id: 'escrow',
      label: 'Statutory FDR Escrow',
      icon: 'fa-vault',
      badge: '₹1.85 Cr',
      description: 'AICTE mandatory joint security deposit balances'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans theme-institute">
      {/* Dedicated Institute Header */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-8 backdrop-blur-xl">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm">
            <i className="fa-solid fa-building-columns"></i>
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>EduIdentityAI</span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-mono font-bold">
                Institute
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              GL Bajaj Institute of Technology & Management (AICTE: 1-1092834)
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Authority:</span>
            <span className="text-white font-bold">{currentUser.name || 'Director GLBITM'}</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Accreditation:</span>
            <span className="text-teal-400 font-bold">NAAC A++ · Autonomous</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">FSR Compliance:</span>
            <span className="text-emerald-400 font-bold">1:14.6 (&lt; 1:15 Norm)</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowTour(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 text-teal-300 text-xs font-mono transition"
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
        {/* Dedicated Institute Sidebar */}
        <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
          <div className="space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-bold">
              Institute Governance
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
                        ? 'bg-teal-600 text-white font-bold shadow-lg shadow-teal-600/30'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <i className={`fa-solid ${item.icon} w-4 text-sm ${isActive ? 'text-white' : 'text-teal-400'}`}></i>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] pl-7 truncate ${isActive ? 'text-teal-100' : 'text-slate-500'}`}>
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-2 mt-6">
            <div className="flex items-center justify-between text-slate-400">
              <span>AISHE Code</span>
              <span className="text-teal-400 font-bold">C-46132</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>SIF Status</span>
              <span className="text-emerald-400 font-bold">Approved 2026-27</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>FDR Escrow</span>
              <span className="text-emerald-400 font-bold">₹1.85 Cr Locked</span>
            </div>
          </div>
        </aside>

        {/* Viewport Content */}
        <main className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Institutional Governance Council Chamber Banner for SIF tab */}
          {activeTab === 'sif_governance' && (
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl max-w-7xl mx-auto">
              <div className="h-36 sm:h-44 w-full relative">
                <img
                  src="/src/assets/images/governance_institutional_hall_1792870360229.jpg"
                  alt="University Governance Council Chamber"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-35 filter saturate-125"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
                      AICTE Statutory Standard Inspection Format (SIF)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Accredited Autonomous Institution</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      Institutional Governance &amp; Regulatory Compliance
                    </h2>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      AISHE C-46132 · NAAC Grade A++ · Faculty-Student Cadre Ratio 1:14.6 Compliant
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'sif_governance' && <InstituteGovernance />}

          {activeTab === 'departments' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-users-gear text-teal-400"></i>
                    <span>Department Capacities & Faculty-Student Cadre Ratios (FSR)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    AICTE statutory compliance requires minimum 1:15 FSR across undergraduate engineering divisions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments.map(dept => (
                    <div key={dept.code} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-mono font-bold">
                            {dept.code}
                          </span>
                          <span className="font-bold text-white text-sm">{dept.name}</span>
                        </div>
                        <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded">
                          {dept.fsrRatio}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px]">
                        <div>HOD: <span className="text-white font-sans font-semibold">{dept.hod}</span></div>
                        <div>Sanctioned: <span className="text-teal-400 font-bold">{dept.sanctionedIntake} Seats</span></div>
                        <div>Enrolled: <span className="text-slate-200">{dept.enrolled} Students</span></div>
                        <div>Faculty: <span className="text-slate-200">{dept.facultyCount} Members</span></div>
                      </div>

                      <div className="pt-1 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Laboratory Readiness:</span>
                        <span className="text-emerald-400 font-bold">{dept.labReadiness}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'broadcaster' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-bullhorn text-teal-400"></i>
                    <span>Campus Statutory Notice & Circular Broadcaster</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Broadcast official circulars, examination deadlines, and holiday notices across all student and faculty streams.
                  </p>
                </div>

                {broadcastSent && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                    <i className="fa-solid fa-circle-check shrink-0"></i>
                    <span>Notice published to all student and faculty terminals in #campus_global Agora.</span>
                  </div>
                )}

                <form onSubmit={handlePublishNotice} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-mono text-[11px]">Notice Category</label>
                      <select
                        value={targetCategory}
                        onChange={e => setTargetCategory(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                      >
                        <option value="ACADEMIC_BULLETIN">Statutory Academic Bulletin</option>
                        <option value="GLOBAL_CAMPUS">Campus-Wide General Circular</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-mono text-[11px]">Notice Title / Reference</label>
                      <input
                        type="text"
                        value={noticeTitle}
                        onChange={e => setNoticeTitle(e.target.value)}
                        placeholder="e.g. End-Term Examination Admit Card Release 2026-27"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-teal-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-mono text-[11px]">Circular Body Text</label>
                    <textarea
                      value={noticeContent}
                      onChange={e => setNoticeContent(e.target.value)}
                      placeholder="Enter official circular details, required student action, and institutional deadlines..."
                      rows={5}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-sans"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition flex items-center space-x-2"
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>Publish Statutory Circular</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'accreditation' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-certificate text-teal-400"></i>
                    <span>Institutional Accreditation Vault & Statutory Approvals</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Certified repository of national regulatory recognitions, autonomy gazettes, and compliance certificates.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-slate-950 border border-teal-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-white text-sm">NAAC Accreditation Cycle 2</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">GRADE A++ (CGPA 3.68)</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">Valid through November 2029 · Institutional score in top 2% of private institutions.</p>
                    </div>
                    <button
                      onClick={() => alert('NAAC Grade A++ Certificate verification digest: SHA256-NAAC-GLB-2024-VALID')}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-800 font-bold text-xs transition shrink-0"
                    >
                      View Certificate
                    </button>
                  </div>

                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-white text-sm">NBA Tier-1 Accreditation</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px]">CSE, ECE, ME (Washington Accord)</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">Valid through June 2028 · Certified for international engineering mobility.</p>
                    </div>
                    <button
                      onClick={() => alert('NBA Tier-1 approval letter SHA256 verified.')}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs transition shrink-0"
                    >
                      View Certificate
                    </button>
                  </div>

                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-white text-sm">UGC Autonomous Institution Status</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold text-[10px]">Gazette Ref: UGC/F.22-1/2022</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">Confers curriculum design autonomy, internal examination scheduling, and grading discretion.</p>
                    </div>
                    <button
                      onClick={() => alert('UGC Autonomy Gazette order validated.')}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs transition shrink-0"
                    >
                      View Gazette
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'escrow' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-vault text-teal-400"></i>
                    <span>AICTE Statutory FDR Escrow Reserves</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Mandatory fixed deposit receipts maintained in joint account with AICTE as financial security for technical programs.
                  </p>
                </div>

                <div className="space-y-4">
                  {fdrEscrow.map(rec => (
                    <div key={rec.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <span className="font-bold text-white text-sm">{rec.institution_name}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px]">
                          {rec.status} · Tier: {rec.compliance_tier}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                        <div>
                          <div className="text-slate-500 text-[10px]">FDR Number</div>
                          <div className="text-white font-bold">{rec.fdr_number}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px]">Principal Amount</div>
                          <div className="text-teal-400 font-bold">₹{(rec.principal_amount / 10000000).toFixed(2)} Crores</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px]">Bank Institution</div>
                          <div className="text-white">{rec.bank_name}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px]">Maturity Date</div>
                          <div className="text-slate-300">{rec.maturity_date}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <GuidedTour
        role="institute"
        isOpen={showTour}
        onClose={() => setShowTour(false)}
      />
    </div>
  );
};
