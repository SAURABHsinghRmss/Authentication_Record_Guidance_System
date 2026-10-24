import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ATTENDANCE_BREAKDOWN } from '../../data/mockData';

export const StudentDashboard: React.FC = () => {
  const { currentUser, setActiveTab } = useAuth();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Student Profile Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-blue-500/20 shrink-0">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  APAAR ID: {currentUser.apaarId || 'APAAR-9988-7766-5544'}
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  DigiLocker Verified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {currentUser.name}
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Roll No: <span className="text-slate-200 font-bold">{currentUser.rollNo || 'CS-2022-04'}</span> · B.Tech Computer Science (6th Semester) · {currentUser.institution}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('enrolled_institutions')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center space-x-2"
            >
              <i className="fa-solid fa-building-columns"></i>
              <span>Launch 7-Module ERP</span>
            </button>
            <button
              onClick={() => setActiveTab('unified_chat')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center space-x-2"
            >
              <i className="fa-solid fa-robot text-purple-400"></i>
              <span>EduMentor AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative CGPA */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cumulative CGPA</span>
            <span className="text-blue-400 text-sm"><i className="fa-solid fa-award"></i></span>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">8.92 <span className="text-xs font-normal text-slate-400 font-mono">/ 10.0</span></div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">✓ Top 5% in CSE Dept.</div>
        </div>

        {/* Overall Attendance */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Aggregate Attendance</span>
            <span className="text-emerald-400 text-sm"><i className="fa-solid fa-calendar-check"></i></span>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">88.5%</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">✓ AICTE 75% Mandate Met</div>
        </div>

        {/* Academic Bank of Credits */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>ABC Credits Earned</span>
            <span className="text-purple-400 text-sm"><i className="fa-solid fa-database"></i></span>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">124 <span className="text-xs font-normal text-slate-400 font-mono">/ 160</span></div>
          <div className="text-[11px] text-purple-400 mt-1 font-mono">✓ MoE ABC ID Verified</div>
        </div>

        {/* Active Backlogs */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Backlogs</span>
            <span className="text-emerald-400 text-sm"><i className="fa-solid fa-circle-check"></i></span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">0</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">All Courses Cleared</div>
        </div>
      </div>

      {/* Main 2-Column Split: Notice Board & Live Attendance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Official Campus Notices */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-bullhorn text-amber-400"></i>
              <h3 className="text-base font-extrabold text-white">Official Notices & Circulars</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">AY 2025-26</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-1.5 hover:border-blue-400 transition">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">Academic</span>
                <span className="text-slate-400 font-mono">Today, 09:30 AM</span>
              </div>
              <h4 className="text-sm font-bold text-white">Capstone Project Evaluation Schedule & AICTE Compliance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All 6th semester students must submit their sovereign project verification reports under their departmental mentor before November 10, 2026.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">Research</span>
                <span className="text-slate-400 font-mono">Yesterday</span>
              </div>
              <h4 className="text-sm font-bold text-white">National Smart India Hackathon & AI Innovation Grants</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                MoE Innovation Cell announces direct grants for teams developing sovereign foundational tools on the India Stack.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">DBT Scholarship</span>
                <span className="text-slate-400 font-mono">Oct 20, 2026</span>
              </div>
              <h4 className="text-sm font-bold text-white">NSP Scholarship Disbursement & Aadhaar Mandate Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                National Scholarship Portal (NSP) verification has been processed for eligible students with seeded Bank accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Course Attendance Breakdown */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-chart-pie text-emerald-400"></i>
              <h3 className="text-base font-extrabold text-white">Subject Attendance</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">All Above 75%</span>
          </div>

          <div className="space-y-3">
            {ATTENDANCE_BREAKDOWN.slice(0, 4).map(sub => (
              <div key={sub.code} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate pr-2">{sub.code}: {sub.title}</span>
                  <span className="font-mono font-bold text-emerald-400">{sub.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${sub.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Attended: {sub.attended} / {sub.held} lectures</span>
                  <span className="text-emerald-400 font-semibold">Eligible for Exams</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('enrolled_institutions')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition border border-slate-700"
          >
            View Full Timetable & Course Plan in ERP →
          </button>
        </div>
      </div>
    </div>
  );
};
