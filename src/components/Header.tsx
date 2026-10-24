import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Header: React.FC<{ onOpenLogs: () => void; onOpenBiometrics: () => void }> = ({ onOpenLogs, onOpenBiometrics }) => {
  const { currentUser, currentRole, switchRole, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const rolesConfig: { id: UserRole; label: string; name: string; color: string; badgeColor: string; icon: string }[] = [
    { id: 'student', label: 'Student Portal', name: 'Amit Sharma', color: 'from-blue-600 to-cyan-500', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: 'fa-user-graduate' },
    { id: 'faculty', label: 'Faculty Desk', name: 'Dr. Priya Sen', color: 'from-indigo-600 to-purple-500', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', icon: 'fa-chalkboard-user' },
    { id: 'parent', label: 'Parent & Guardian', name: 'Rajesh Sharma', color: 'from-amber-600 to-orange-500', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: 'fa-user-group' },
    { id: 'institute', label: 'Institute Governance', name: 'Director GLBITM', color: 'from-teal-600 to-emerald-500', badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40', icon: 'fa-building-columns' },
    { id: 'admin', label: 'Admin Control Center', name: 'Master Admin (msrch)', color: 'from-rose-600 to-pink-500', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: 'fa-shield-halved' }
  ];

  const currentRoleObj = rolesConfig.find(r => r.id === currentRole) || rolesConfig[0];

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & DPI Badge */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-shield-halved text-base"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-white text-base">EduIdentityAI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden md:inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                DPI India Live
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
              {currentUser.institution}
            </div>
          </div>
        </div>
      </div>

      {/* Center/Right Action Bar */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Biometrics Scan Quick Access */}
        <button
          onClick={onOpenBiometrics}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs text-slate-300 flex items-center space-x-1.5 transition"
          title="Verify Multi-Modal Biometrics"
        >
          <i className="fa-solid fa-fingerprint text-teal-400"></i>
          <span className="hidden md:inline font-mono">Biometrics</span>
        </button>

        {/* Live Audit Log Stream */}
        <button
          onClick={onOpenLogs}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs text-slate-300 flex items-center space-x-1.5 transition"
          title="View Sovereign Audit Stream"
        >
          <i className="fa-solid fa-terminal text-blue-400"></i>
          <span className="hidden md:inline font-mono">Audit Logs</span>
        </button>

        {/* Instant Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${currentRoleObj.badgeColor}`}
          >
            <i className={`fa-solid ${currentRoleObj.icon}`}></i>
            <span className="hidden sm:inline capitalize">{currentRole}</span>
            <i className="fa-solid fa-chevron-down text-[10px] ml-1"></i>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-800/80 text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Switch Live Persona</span>
                <span className="text-cyan-400">Instant Sync</span>
              </div>
              <div className="space-y-1 mt-1">
                {rolesConfig.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchRole(r.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      currentRole === r.id ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${r.color} flex items-center justify-center text-white text-[11px]`}>
                        <i className={`fa-solid ${r.icon}`}></i>
                      </div>
                      <div>
                        <div className="capitalize font-semibold">{r.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{r.name}</div>
                      </div>
                    </div>
                    {currentRole === r.id && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center pl-2 border-l border-slate-800">
          <div className="flex items-center space-x-2 mr-2 hidden lg:flex text-right">
            <div>
              <div className="text-xs font-bold text-white">{currentUser.name}</div>
              <div className="text-[10px] font-mono text-slate-400">{currentUser.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-700/80 text-slate-300 transition text-xs"
            title="Sign Out"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </header>
  );
};
