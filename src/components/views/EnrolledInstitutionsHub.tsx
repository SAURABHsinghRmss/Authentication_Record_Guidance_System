import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ENROLLED_INSTITUTIONS, TIMETABLE_DATA, ATTENDANCE_BREAKDOWN, EXAM_RESULTS_BREAKDOWN, FEE_LEDGER_ITEMS } from '../../data/mockData';

export const EnrolledInstitutionsHub: React.FC = () => {
  const { selectedInstitution, setSelectedInstitution, payFee } = useAuth();
  const [activeModule, setActiveModule] = useState<'academic' | 'exam' | 'fees' | 'hostel' | 'admin' | 'library' | 'services'>('academic');
  const [activeSubpage, setActiveSubpage] = useState<string>('time_table');
  const [timetableDay, setTimetableDay] = useState<string>('Monday');

  // Form states
  const [leaveType, setLeaveType] = useState('Medical Leave');
  const [leaveDays, setLeaveDays] = useState('2 Days (Nov 2 - Nov 4)');
  const [leaveReason, setLeaveReason] = useState('Viral fever and doctor consultation');
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  // Fee payment state
  const [payAmount, setPayAmount] = useState('12000');
  const [payMode, setPayMode] = useState('UPI');
  const [paymentDone, setPaymentDone] = useState(false);

  // Grievance state
  const [grievanceCategory, setGrievanceCategory] = useState('Academic Facility');
  const [grievanceText, setGrievanceText] = useState('High performance GPU cluster request for Capstone project');
  const [grievanceSuccess, setGrievanceSuccess] = useState(false);

  // Document request state
  const [docType, setDocType] = useState('Bonafide Certificate');
  const [docSuccess, setDocSuccess] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    payFee(parseInt(payAmount), 'Semester 6 Balance AI Lab Fee');
    setPaymentDone(true);
    setTimeout(() => setPaymentDone(false), 5000);
  };

  const modules = [
    { id: 'academic', label: 'Academic', icon: 'fa-graduation-cap', color: 'from-blue-600 to-cyan-600', sub: 'Timetable, Attendance, Leaves' },
    { id: 'exam', label: 'Exam', icon: 'fa-file-alt', color: 'from-emerald-600 to-teal-600', sub: 'Results, Datesheet, Hall Ticket' },
    { id: 'fees', label: 'Fees & Accounts', icon: 'fa-indian-rupee-sign', color: 'from-amber-600 to-orange-600', sub: 'Ledger, UPI Pay, Receipts' },
    { id: 'hostel', label: 'Hostel & Mess', icon: 'fa-bed', color: 'from-purple-600 to-indigo-600', sub: 'Room, Gate Pass, Menu' },
    { id: 'admin', label: 'Administration', icon: 'fa-building-columns', color: 'from-pink-600 to-rose-600', sub: 'DigiLocker, Bonafide, Grievance' },
    { id: 'library', label: 'Library', icon: 'fa-book-open', color: 'from-cyan-600 to-blue-600', sub: 'Issued Books, Fines, Access' },
    { id: 'services', label: 'Campus Services', icon: 'fa-bus', color: 'from-teal-600 to-emerald-600', sub: 'Transport, Placement, PTM' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Institution Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-600/30 shrink-0">
              <i className={`fa-solid ${selectedInstitution.icon}`}></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                  {selectedInstitution.badge}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {selectedInstitution.status}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white mt-1">
                {selectedInstitution.name}
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Roll: <strong className="text-slate-200">{selectedInstitution.rollNo}</strong></span>
                <span>APAAR: <strong className="text-slate-200">{selectedInstitution.apaarId}</strong></span>
                <span>Term: <strong className="text-slate-200">{selectedInstitution.currentTerm}</strong></span>
              </p>
            </div>
          </div>

          {/* Switch Institution Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedInstitution.id}
              onChange={e => {
                const found = ENROLLED_INSTITUTIONS.find(i => i.id === e.target.value);
                if (found) setSelectedInstitution(found);
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500"
            >
              {ENROLLED_INSTITUTIONS.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.name.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid (ERP Navigation Sidebar + Module View Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 7 Modules Menu */}
        <aside className="lg:col-span-3 space-y-2 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center justify-between">
            <span>ERP Modules</span>
            <span className="text-[10px] text-blue-400 font-mono">7 Active</span>
          </div>

          <div className="space-y-1.5 mt-1">
            {modules.map(mod => {
              const isSelected = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModule(mod.id as any);
                    if (mod.id === 'academic') setActiveSubpage('time_table');
                    else if (mod.id === 'exam') setActiveSubpage('results');
                    else if (mod.id === 'fees') setActiveSubpage('fee_structure');
                    else if (mod.id === 'hostel') setActiveSubpage('room');
                    else if (mod.id === 'admin') setActiveSubpage('doc_request');
                    else if (mod.id === 'library') setActiveSubpage('issued_books');
                    else if (mod.id === 'services') setActiveSubpage('transport');
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border-blue-400 font-bold'
                      : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-blue-400'}`}>
                      <i className={`fa-solid ${mod.icon}`}></i>
                    </div>
                    <div className="text-left">
                      <div className="leading-tight font-bold">{mod.label}</div>
                      <div className="text-[10px] opacity-75">{mod.sub}</div>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] opacity-60"></i>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right: Active Module Workspace */}
        <div className="lg:col-span-9 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl min-h-[500px]">
          
          {/* ========================================================= */}
          {/* 1. ACADEMIC MODULE                                        */}
          {/* ========================================================= */}
          {activeModule === 'academic' && (
            <div className="space-y-6">
              {/* Sub-tab pills */}
              <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
                {[
                  { id: 'time_table', label: 'Time Table', icon: 'fa-calendar-days' },
                  { id: 'attendance', label: 'Attendance Register', icon: 'fa-calendar-check' },
                  { id: 'leaves', label: 'Apply Leave / Outpass', icon: 'fa-person-walking-arrow-right' },
                  { id: 'assignments', label: 'Assignments & Lab', icon: 'fa-laptop-code' },
                  { id: 'mentor', label: 'Mentor Counseling', icon: 'fa-user-tie' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubpage(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                      activeSubpage === sub.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <i className={`fa-solid ${sub.icon} text-[11px]`}></i>
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>

              {/* Academic: Timetable */}
              {activeSubpage === 'time_table' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-white">Semester 6 Weekly Schedule</h3>
                      <p className="text-xs text-slate-400 font-mono">Lecture Hall LH-301 & Cloud Lab 4</p>
                    </div>

                    {/* Day selector */}
                    <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                        <button
                          key={day}
                          onClick={() => setTimetableDay(day)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                            timetableDay === day ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {(TIMETABLE_DATA[timetableDay] || []).map((slot, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/40 transition">
                        <div className="flex items-start sm:items-center space-x-3">
                          <div className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold shrink-0">
                            {slot.time}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              <span>{slot.title}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                                {slot.code}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                              Faculty: <strong className="text-slate-300">{slot.faculty}</strong> · Room: <strong className="text-slate-300">{slot.room}</strong>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono self-start sm:self-center ${
                          slot.type.includes('Lab') ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {slot.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Academic: Attendance */}
              {activeSubpage === 'attendance' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white">Subject-Wise Attendance Register</h3>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Overall: 88.5%
                    </span>
                  </div>

                  <div className="space-y-3">
                    {ATTENDANCE_BREAKDOWN.map(sub => (
                      <div key={sub.code} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-white text-sm">{sub.code}: {sub.title}</div>
                          <div className="text-emerald-400 font-mono font-bold text-sm">{sub.percentage}%</div>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${sub.percentage}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 font-mono">
                          <span>Classes Attended: {sub.attended} / {sub.held}</span>
                          <span className="text-emerald-400">Status: {sub.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Academic: Apply Leave */}
              {activeSubpage === 'leaves' && (
                <div className="space-y-4 max-w-xl">
                  <h3 className="text-base font-extrabold text-white">Digital Leave & Outpass Application</h3>
                  <p className="text-xs text-slate-400">Leave applications are routed directly to Dr. Priya Sen and Parent Rajesh Sharma for digital co-signature.</p>

                  {leaveSuccess && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Leave request submitted successfully. Co-approval notification dispatched to Parent & Mentor.</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-300 font-semibold block mb-1">Leave Category</label>
                      <select
                        value={leaveType}
                        onChange={e => setLeaveType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                      >
                        <option>Medical Leave</option>
                        <option>Academic Conference / Hackathon</option>
                        <option>Personal / Family Obligation</option>
                        <option>Hostel Weekend Gate Pass</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-semibold block mb-1">Duration</label>
                      <input
                        type="text"
                        value={leaveDays}
                        onChange={e => setLeaveDays(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-semibold block mb-1">Reason for Leave</label>
                      <textarea
                        rows={3}
                        value={leaveReason}
                        onChange={e => setLeaveReason(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <button
                      onClick={() => setLeaveSuccess(true)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
                    >
                      Submit Leave Request
                    </button>
                  </div>
                </div>
              )}

              {/* Academic: Mentor Counseling */}
              {activeSubpage === 'mentor' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl font-bold">
                      <i className="fa-solid fa-chalkboard-user"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Assigned Faculty Mentor: Dr. Priya Sen</h4>
                      <p className="text-xs text-slate-400 font-mono">Head of AI Research · Cabin 312 · faculty@uni.edu</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <strong className="text-indigo-400">Last Mentor Remark (Oct 18, 2026):</strong> Amit is performing at exceptional caliber in Distributed Systems and Cloud Computing. Capstone project meets AICTE sovereign standards. Advised to submit paper for IEEE Conference.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. EXAMINATION MODULE                                     */}
          {/* ========================================================= */}
          {activeModule === 'exam' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-white">Semester Academic Examination Ledger</h3>
                  <p className="text-xs text-slate-400 font-mono">Grading on 10-Point CGPA Scale · Autonomous AKTU AICTE</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Cumulative CGPA: 8.92
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Semester</th>
                      <th className="p-3">SGPA</th>
                      <th className="p-3">Credits Cleared</th>
                      <th className="p-3">Official Result Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {EXAM_RESULTS_BREAKDOWN.map((res, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/60 transition">
                        <td className="p-3 font-bold text-white">{res.semester}</td>
                        <td className="p-3 text-blue-400 font-bold">{res.sgpa}</td>
                        <td className="p-3 text-slate-300">{res.credits} Credits</td>
                        <td className="p-3 text-emerald-400 font-semibold">{res.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. FEES & ACCOUNTS MODULE                                 */}
          {/* ========================================================= */}
          {activeModule === 'fees' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-white">Fee Accounts & Payment Gateway</h3>
                  <p className="text-xs text-slate-400 font-mono">Direct Benefit Transfer (DBT) & SBIePay / PFMS Escrow Integrated</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-mono">Total Outstanding Dues</div>
                  <div className="text-xl font-extrabold text-amber-400 font-mono">₹12,000</div>
                </div>
              </div>

              {/* Fee Ledger Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300">Transaction & Receipt Ledger</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3">Term</th>
                        <th className="p-3">Fee Head</th>
                        <th className="p-3">Total (₹)</th>
                        <th className="p-3">Paid (₹)</th>
                        <th className="p-3">Due (₹)</th>
                        <th className="p-3">Receipt No</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {FEE_LEDGER_ITEMS.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-950/60 transition">
                          <td className="p-3 text-slate-300">{item.term}</td>
                          <td className="p-3 font-bold text-white">{item.head}</td>
                          <td className="p-3 text-slate-300">₹{item.total.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-emerald-400">₹{item.paid.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-amber-400 font-bold">₹{item.due.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-cyan-400">{item.receipt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Instant Fee Pay Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-credit-card text-amber-400"></i>
                    <h4 className="text-sm font-bold text-white">Instant Fee Settlement (UPI / NetBanking / PFMS)</h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Sovereign Escrow Locked
                  </span>
                </div>

                {paymentDone && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center space-x-2">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Payment of ₹{parseInt(payAmount).toLocaleString('en-IN')} successful! Receipt #REC-2026-UPI99 generated and synchronized.</span>
                  </div>
                )}

                <form onSubmit={handlePay} className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="w-full sm:w-1/3">
                    <label className="text-[11px] text-slate-400 font-mono block mb-1">Amount (INR)</label>
                    <input
                      type="number"
                      value={payAmount}
                      onChange={e => setPayAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label className="text-[11px] text-slate-400 font-mono block mb-1">Payment Mode</label>
                    <select
                      value={payMode}
                      onChange={e => setPayMode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option>UPI (GooglePay / PhonePe / BHIM)</option>
                      <option>SBIePay Corporate NetBanking</option>
                      <option>PFMS Direct Scholarship Offset</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition"
                  >
                    Pay ₹{parseInt(payAmount || '0').toLocaleString('en-IN')} Now
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. HOSTEL & MESS                                          */}
          {/* ========================================================= */}
          {activeModule === 'hostel' && (
            <div className="space-y-6">
              <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">Hostel & Mess Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full">Room Allocation</span>
                  <div className="text-xl font-extrabold text-white mt-1">Hostel Block B · Room 304</div>
                  <p className="text-xs text-slate-400 font-mono">Air-conditioned Double Occupancy · Warden: Er. K. Sharma</p>
                  <div className="text-xs text-emerald-400 font-mono pt-2">✓ Maintenance Clear: Wi-Fi 100Mbps Active</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full">Mess Menu (Today)</span>
                  <div className="text-xs text-slate-300 font-mono space-y-1 mt-1">
                    <div>🍳 Breakfast: Poha, Sprouts, Boiled Eggs / Milk</div>
                    <div>🍛 Lunch: Rajma Dal, Paneer Butter Masala, Roti, Rice, Curd</div>
                    <div>☕ Evening: Vegetable Cutlet, Green Tea</div>
                    <div>🍲 Dinner: Dal Tadka, Seasonal Veg, Jeera Rice, Gulab Jamun</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. ADMINISTRATION MODULE                                  */}
          {/* ========================================================= */}
          {activeModule === 'admin' && (
            <div className="space-y-6">
              <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">Administrative Services & Grievances</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Document Request */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-sm">Request Official Document</h4>
                  {docSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                      ✓ Document request placed. Processing through Registrar Office.
                    </div>
                  )}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Document Type</label>
                    <select
                      value={docType}
                      onChange={e => setDocType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option>Bonafide Certificate (Passport/Visa)</option>
                      <option>Official Academic Transcript</option>
                      <option>Medium of Instruction Certificate (English)</option>
                      <option>Character & Conduct Certificate</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setDocSuccess(true)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
                  >
                    Submit Document Request
                  </button>
                </div>

                {/* Grievance Cell */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-sm">Lodge Grievance to AICTE Cell</h4>
                  {grievanceSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                      ✓ Grievance logged with AICTE Grievance ID #AIC-GRV-2026-904.
                    </div>
                  )}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                    <select
                      value={grievanceCategory}
                      onChange={e => setGrievanceCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option>Academic Facility & Lab Equipment</option>
                      <option>Hostel / Mess Maintenance</option>
                      <option>Fee / Scholarship Discrepancy</option>
                      <option>Anti-Ragging / Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Details</label>
                    <textarea
                      rows={2}
                      value={grievanceText}
                      onChange={e => setGrievanceText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <button
                    onClick={() => setGrievanceSuccess(true)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
                  >
                    Lodge Grievance
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. LIBRARY & LEARNING                                     */}
          {/* ========================================================= */}
          {activeModule === 'library' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white">Central Digital Library & RFID Circulation</h3>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  Card: LIB-CS-2022-04
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', due: '2026-11-15', status: 'Issued (Good)' },
                  { title: 'Distributed Systems: Principles and Paradigms', author: 'Andrew S. Tanenbaum', due: '2026-11-20', status: 'Issued (Good)' },
                  { title: 'Deep Learning with Python', author: 'François Chollet', due: '2026-10-30', status: 'Due Soon' }
                ].map((book, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{book.title}</div>
                      <div className="text-xs text-slate-400 font-mono">Author: {book.author} · Due: {book.due}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {book.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. CAMPUS SERVICES                                        */}
          {/* ========================================================= */}
          {activeModule === 'services' && (
            <div className="space-y-6">
              <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">Campus Transport & Training & Placement</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Transport Route #14</span>
                    <span className="text-emerald-400 font-mono text-xs">GPS Live: On Time</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Noida City Center Metro → Pari Chowk → GLBITM Campus</p>
                  <div className="text-[11px] text-blue-400 font-mono">Driver: Harish Singh (+91 98101 23456)</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Training & Placement (T&P)</span>
                    <span className="text-purple-400 font-mono text-xs">Tier-1 Eligible</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Upcoming Campus Drive: Microsoft Research, Google India, TCS Innovator</p>
                  <div className="text-[11px] text-emerald-400 font-mono">Resume Verification: Verified by Faculty Desk</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
