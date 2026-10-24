import React from 'react';

export const CareerPathways: React.FC = () => {
  const milestones = [
    { title: 'Core Foundational Algorithms & Data Structures', sem: 'Semester 1 - 2', status: 'Completed (Grade: A+)', done: true },
    { title: 'Full-Stack Distributed Systems & Microservices', sem: 'Semester 3 - 4', status: 'Completed (Grade: O)', done: true },
    { title: 'Sovereign AI Systems & Neural Networks Lab', sem: 'Semester 5 - 6', status: 'In Progress (Capstone Active)', done: true, current: true },
    { title: 'Industry Internship & AICTE Degree Verification', sem: 'Semester 7 - 8', status: 'Upcoming (AY 2026-27)', done: false }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-yellow-950/60 border border-amber-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-amber-600/30">
              <i className="fa-solid fa-briefcase"></i>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                National NEP 2020 Multi-Disciplinary Framework
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Career Pathways & Trust Tier</h1>
              <p className="text-xs text-slate-400 font-mono">
                AI Engineer & Distributed Systems Architect Roadmap
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <div>Sovereign Trust Tier: <strong className="text-emerald-400">TIER-1 (VERIFIED CREDENTIALS)</strong></div>
            <div>Academic Credit Mobility: <strong className="text-amber-400">Unrestricted</strong></div>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
        <h3 className="text-base font-extrabold text-white">Academic & Industry Milestone Trajectory</h3>
        
        <div className="space-y-4">
          {milestones.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 mt-0.5 ${
                m.current
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                  : m.done
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                <i className={`fa-solid ${m.done ? 'fa-check' : 'fa-hourglass'}`}></i>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-bold text-white">{m.title}</h4>
                  <span className="text-xs font-mono text-slate-400">{m.sem}</span>
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1 flex items-center space-x-2">
                  <span className={m.current ? 'text-amber-400 font-bold' : m.done ? 'text-emerald-400' : 'text-slate-500'}>
                    {m.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
