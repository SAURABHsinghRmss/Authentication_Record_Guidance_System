import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ParentMonitor } from '../../views/ParentMonitor';
import { GuidedTour } from '../../common/GuidedTour';

export const ParentPortal: React.FC = () => {
  const { currentUser, logout, students, addChatMessage, chatMessages, payFee } = useAuth();
  const [activeTab, setActiveTab] = useState<'ward_overview' | 'admit_clearance' | 'mentor_hotline' | 'fee_receipts' | 'policy_faq'>('ward_overview');
  const [showTour, setShowTour] = useState<boolean>(() => {
    return localStorage.getItem('edu_tour_seen_parent') !== 'true';
  });

  // Linked ward record (Amit Sharma)
  const ward = students[0] || {
    name: 'Amit Sharma',
    roll_no: 'CS-2022-04',
    department: 'Computer Science & Engineering',
    semester: 'Semester 6',
    cgpa: 8.74,
    attendance_percentage: 88.5,
    credits_earned: 124,
    max_credits: 160,
    backlogs: 0,
    apaar_id: '91-4458-9921-3412',
    digilocker_status: 'VERIFIED'
  };

  const [messageInput, setMessageInput] = useState('');
  const [feePaidState, setFeePaidState] = useState(false);

  // Messages between parent and faculty mentor
  const parentMessages = chatMessages.filter(
    m => m.channel === 'FACULTY_MENTOR' || m.senderRole === 'Faculty Mentor' || m.senderRole === 'Parent Guardian'
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    addChatMessage({
      sender: 'user',
      senderName: currentUser.name || 'Rajesh Sharma',
      senderRole: 'Parent Guardian',
      text: messageInput,
      channel: 'FACULTY_MENTOR',
      recipient: 'faculty'
    });
    setMessageInput('');
  };

  const handlePayTuition = () => {
    payFee(45000, 'Semester 6 Academic Tuition & Lab Escrow Fee');
    setFeePaidState(true);
  };

  interface NavItem {
    id: 'ward_overview' | 'admit_clearance' | 'mentor_hotline' | 'fee_receipts' | 'policy_faq';
    label: string;
    icon: string;
    description: string;
    badge?: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'ward_overview',
      label: 'Ward Academic Monitor',
      icon: 'fa-user-graduate',
      description: 'Attendance compliance & semester CGPA standing'
    },
    {
      id: 'admit_clearance',
      label: 'Admit Card & Clearance',
      icon: 'fa-id-card-clip',
      description: 'Hall ticket issuance & mandatory 75% attendance audit'
    },
    {
      id: 'mentor_hotline',
      label: 'Faculty Mentor Hotline',
      icon: 'fa-headset',
      badge: 'Dr. Priya Sen',
      description: 'Direct confidential consultation with assigned mentor'
    },
    {
      id: 'fee_receipts',
      label: 'Fees & Payment Ledger',
      icon: 'fa-receipt',
      description: 'Tuition breakdown, statutory escrow & GST receipts'
    },
    {
      id: 'policy_faq',
      label: 'Academic Policies in Plain English',
      icon: 'fa-circle-question',
      description: 'Jargon-free AI explanations of university rules'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans theme-parent">
      {/* Dedicated Parent Header */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-8 backdrop-blur-xl">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
            <i className="fa-solid fa-user-group"></i>
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>EduIdentityAI</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                Parent Guardian
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Ward Academic Oversight & Family Gateway
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Guardian:</span>
            <span className="text-white font-bold">{currentUser.name || 'Rajesh Sharma'}</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Ward:</span>
            <span className="text-amber-400 font-bold">{ward.name}</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Attendance:</span>
            <span className={`font-bold ${ward.attendance_percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {ward.attendance_percentage}% (Safe)
            </span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Hall Ticket:</span>
            <span className="text-emerald-400 font-bold">Eligible</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowTour(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-mono transition"
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
        {/* Dedicated Parent Sidebar */}
        <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
          <div className="space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-bold">
              Parent Guardian Desk
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
                        ? 'bg-amber-600 text-white font-bold shadow-lg shadow-amber-600/30'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <i className={`fa-solid ${item.icon} w-4 text-sm ${isActive ? 'text-white' : 'text-amber-400'}`}></i>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] pl-7 truncate ${isActive ? 'text-amber-100' : 'text-slate-500'}`}>
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-2 mt-6">
            <div className="flex items-center justify-between text-slate-400">
              <span>Ward Roll No</span>
              <span className="text-amber-400 font-bold">{ward.roll_no}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Faculty Mentor</span>
              <span className="text-white font-bold">Dr. Priya Sen</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Semester Fees</span>
              <span className="text-emerald-400 font-bold">{feePaidState ? 'Paid in Full' : 'Due: ₹45,000'}</span>
            </div>
          </div>
        </aside>

        {/* Viewport Content */}
        <main className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'ward_overview' && <ParentMonitor />}

          {activeTab === 'admit_clearance' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-id-card-clip text-amber-400"></i>
                    <span>Semester Examination Admit Card & Statutory Clearance</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct validation of mandatory 75% attendance threshold, tuition dues clearance, and digital hall ticket issuance.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[11px]">Attendance Clearance</div>
                    <div className="text-emerald-400 font-bold text-sm">
                      {ward.attendance_percentage}% (Eligible)
                    </div>
                    <div className="text-slate-500 text-[10px]">Above 75.0% threshold</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[11px]">Academic Dues</div>
                    <div className="text-emerald-400 font-bold text-sm">
                      {feePaidState ? 'No Pending Dues' : 'Cleared for Exam'}
                    </div>
                    <div className="text-slate-500 text-[10px]">Accounts office approved</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[11px]">Disciplinary Record</div>
                    <div className="text-emerald-400 font-bold text-sm">Good Standing</div>
                    <div className="text-slate-500 text-[10px]">Zero proctorial notices</div>
                  </div>
                </div>

                {/* Digital Hall Ticket Preview */}
                <div className="p-6 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                        <i className="fa-solid fa-stamp"></i>
                      </div>
                      <div>
                        <div className="font-extrabold text-white text-sm">End-Term Examination Hall Ticket 2026-27</div>
                        <div className="text-[11px] text-slate-400 font-mono">Affiliated to APJ Abdul Kalam Technical University</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-mono text-xs font-bold">
                      VERIFIED & SEALED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <div className="text-slate-500 text-[10px]">Candidate</div>
                      <div className="text-white font-bold">{ward.name}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Roll Number</div>
                      <div className="text-amber-400 font-bold">{ward.roll_no}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Examination Center</div>
                      <div className="text-white font-bold">Block C, Hall 4</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Biometric Auth</div>
                      <div className="text-emerald-400 font-bold">Pre-Authenticated</div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => alert(`Digital Admit Card PDF generated for ${ward.name} (${ward.roll_no}) with cryptographic QR code.`)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition flex items-center space-x-2"
                    >
                      <i className="fa-solid fa-download"></i>
                      <span>Download Certified PDF Admit Card</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mentor_hotline' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xl border border-indigo-500/30">
                      <i className="fa-solid fa-chalkboard-user"></i>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Direct Consultation with Dr. Priya Sen</h2>
                      <p className="text-xs text-slate-400">Assigned Faculty Mentor · Department of Computer Science</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                    Direct Line Active
                  </span>
                </div>

                {/* Chat Stream */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 h-96 overflow-y-auto space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                    <div className="font-bold text-indigo-400 flex items-center justify-between mb-1">
                      <span>Dr. Priya Sen (Faculty Mentor)</span>
                      <span className="text-[10px] text-slate-500 font-mono">Yesterday 04:30 PM</span>
                    </div>
                    <p>
                      Hello Mr. Sharma. Amit has maintained an excellent attendance record of 88.5% this semester. His capstone project on AI-driven identity verification is progressing on schedule. Please let me know if you have any questions regarding the upcoming final examination schedule.
                    </p>
                  </div>

                  {parentMessages.map(m => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl text-xs max-w-lg ${
                        m.senderRole === 'Parent Guardian'
                          ? 'bg-amber-950/40 border border-amber-500/30 ml-auto text-amber-100'
                          : 'bg-slate-900 border border-slate-800 mr-auto text-slate-200'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between mb-1 text-[11px]">
                        <span>{m.senderName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{m.timestamp}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>

                {/* Send Box */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    placeholder="Type your message or inquiry for Dr. Priya Sen..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition flex items-center space-x-1.5 shrink-0"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Send Inquiry</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'fee_receipts' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-receipt text-amber-400"></i>
                    <span>Institutional Fee & Statutory Escrow Ledger</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Statutory tuition, laboratory development, and examination fees linked with sovereign PFMS payment ledger.
                  </p>
                </div>

                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="text-xs font-bold text-white">Semester 6 Academic Dues Breakdown</div>
                      <div className="text-[11px] text-slate-500 font-mono">Invoice Reference: AIC-INV-2026-9941</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${feePaidState ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {feePaidState ? 'SETTLED' : 'DUE FOR SETTLEMENT'}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800/80 text-xs">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-300">Tuition & Faculty Mentorship Fee</span>
                      <span className="font-mono text-white">₹32,000</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-300">Advanced Computing Lab & GPU Cluster Escrow</span>
                      <span className="font-mono text-white">₹8,500</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-300">University Examination & Hall Ticket Fee</span>
                      <span className="font-mono text-white">₹4,500</span>
                    </div>
                    <div className="py-3 flex justify-between text-sm font-bold border-t-2 border-slate-800">
                      <span className="text-white">Total Amount</span>
                      <span className="text-amber-400 font-mono">₹45,000</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handlePayTuition}
                      disabled={feePaidState}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 ${
                        feePaidState
                          ? 'bg-emerald-600/40 text-emerald-300 cursor-default'
                          : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30'
                      }`}
                    >
                      <i className={`fa-solid ${feePaidState ? 'fa-check' : 'fa-credit-card'}`}></i>
                      <span>{feePaidState ? 'Fee Paid (TXN-994182 Confirmed)' : 'Pay ₹45,000 via UPI / NetBanking'}</span>
                    </button>
                    {feePaidState && (
                      <button
                        onClick={() => alert('Official GST-compliant receipt downloaded.')}
                        className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition flex items-center justify-center space-x-2 font-mono"
                      >
                        <i className="fa-solid fa-file-invoice"></i>
                        <span>Download Tax Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'policy_faq' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-circle-question text-amber-400"></i>
                    <span>University Academic Regulations in Plain English</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Plain-language breakdowns of statutory AICTE guidelines, credit transfer rules, and examination eligibility.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <h3 className="font-bold text-white text-sm">What happens if attendance drops below 75%?</h3>
                    <p className="text-slate-300 leading-relaxed">
                      AICTE regulations strictly mandate a minimum 75% physical attendance to be eligible for end-semester university examinations. If attendance falls between 60% and 75% due to medical conditions, a certified medical certificate along with an official application must be submitted within 7 working days to the dean for condonation. Students below 60% cannot appear for examinations and must repeat the semester course.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <h3 className="font-bold text-white text-sm">What is the Academic Bank of Credits (ABC) and APAAR ID?</h3>
                    <p className="text-slate-300 leading-relaxed">
                      APAAR (Automated Permanent Academic Account Registry) is a permanent 12-digit digital identity created by the Ministry of Education. It securely archives all earned college credits in the National Academic Depository. If your child transfers universities or completes certified online courses (SWAYAM/NPTEL), up to 20% of their degree credits can be transferred seamlessly.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <h3 className="font-bold text-white text-sm">How are campus placement opportunities scheduled?</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Campus placement drives commence at the start of Semester 7. Students with zero active backlogs and a CGPA above 7.0 qualify for tier-1 product and consulting recruitment cohorts. The faculty mentor conducts mock technical reviews during Semester 6 to prepare students for campus interviews.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <GuidedTour
        role="parent"
        isOpen={showTour}
        onClose={() => setShowTour(false)}
      />
    </div>
  );
};
