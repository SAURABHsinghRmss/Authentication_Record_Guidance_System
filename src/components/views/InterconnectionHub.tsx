import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const InterconnectionHub: React.FC = () => {
  const { currentRole, switchRole } = useAuth();
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [pipelineRunning, setPipelineRunning] = useState(false);

  const runCrossRolePipeline = () => {
    setPipelineRunning(true);
    setSyncStatus('Dispatching cross-role data sync across 5 roles and 7 federated SQLite partitions...');
    setTimeout(() => {
      setPipelineRunning(false);
      setSyncStatus('✓ Synchronized! Faculty document verification updated Student transcript, logged parent alert, and committed audit hash to security_audit.db.');
    }, 1200);
  };

  const roles = [
    { id: 'student', title: 'Student', icon: 'fa-user-graduate', color: 'from-blue-600 to-cyan-500', port: '8001', db: 'academic_sis.db' },
    { id: 'faculty', title: 'Faculty', icon: 'fa-chalkboard-user', color: 'from-indigo-600 to-purple-500', port: '8002', db: 'auth_iam.db' },
    { id: 'parent', title: 'Parent', icon: 'fa-user-group', color: 'from-amber-600 to-orange-500', port: '8003', db: 'family_heritage.db' },
    { id: 'institute', title: 'Institute', icon: 'fa-building-columns', color: 'from-teal-600 to-emerald-500', port: '8004', db: 'institutions_governance.db' },
    { id: 'admin', title: 'Root Admin', icon: 'fa-shield-halved', color: 'from-rose-600 to-pink-500', port: '8005', db: 'security_audit.db' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 p-7 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-3 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            <i className="fa-solid fa-network-wired animate-pulse"></i>
            <span>FEDERATED ARCHITECTURE & INTER-ROLE CONNECTIVITY</span>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-bold">5/5 ROLES ONLINE</span>
            <span className="text-slate-600">·</span>
            <span className="text-blue-400 font-bold">7/7 DBs FEDERATED</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          System Interconnection Hub & Cross-Role Pipelines
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          EduIdentityAI links 5 sovereign personas together in a real-time interconnected ecosystem. Actions taken by a Faculty or Institute instantly propagate across the student ledger, parent ward monitoring, and AICTE compliance tracking.
        </p>

        <div className="pt-2">
          <button
            onClick={runCrossRolePipeline}
            disabled={pipelineRunning}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition flex items-center space-x-2"
          >
            <i className={`fa-solid fa-arrows-rotate ${pipelineRunning ? 'fa-spin' : ''}`}></i>
            <span>Trigger Cross-Role Data Pipeline Sync</span>
          </button>
        </div>

        {syncStatus && (
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            {syncStatus}
          </div>
        )}
      </div>

      {/* Role Topology Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {roles.map(r => {
          const isCurrent = currentRole === r.id;
          return (
            <div
              key={r.id}
              className={`p-5 rounded-3xl bg-slate-900 border transition space-y-3 flex flex-col justify-between ${
                isCurrent ? 'border-cyan-400 shadow-xl shadow-cyan-500/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                  <i className={`fa-solid ${r.icon}`}></i>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white">{r.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">Port {r.port}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    Partition: <span className="text-slate-300">{r.db}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => switchRole(r.id as any)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  isCurrent ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{isCurrent ? 'Active Persona' : `Switch to ${r.title}`}</span>
                {!isCurrent && <i className="fa-solid fa-arrow-right text-[10px]"></i>}
              </button>
            </div>
          );
        })}
      </div>

      {/* Interconnection Pipeline Flow Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-extrabold text-white">Live Interconnected Data Pipelines</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-blue-400 flex items-center space-x-2">
              <i className="fa-solid fa-graduation-cap"></i>
              <span>Pipeline 1: Academic Grading & ABC</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-mono text-[11px]">
              Faculty grades Capstone → Student transcript updated → ABC credit deposited in DigiLocker → Parent notified.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-amber-400 flex items-center space-x-2">
              <i className="fa-solid fa-indian-rupee-sign"></i>
              <span>Pipeline 2: Parent Fee Escrow</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-mono text-[11px]">
              Parent pays semester fee → Instant SBIePay receipt generated → Institute escrow ledger updated → AICTE clearance issued.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-rose-400 flex items-center space-x-2">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Pipeline 3: AICTE SIF & Complaints</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-mono text-[11px]">
              Student/Faculty submits grievance → Root Admin triages ticket → Institute compliance review opened → Action logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
