import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { currentRole, activeTab, setActiveTab } = useAuth();

  const getPrimaryRoleItem = (): { id: string; label: string; icon: string; color: string; badge?: string } => {
    switch (currentRole) {
      case 'faculty':
        return {
          id: 'faculty_roster',
          label: 'Faculty Mentorship Desk',
          icon: 'fa-chalkboard-user',
          color: 'text-indigo-400',
          badge: 'Roster'
        };
      case 'parent':
        return {
          id: 'parent_overview',
          label: 'Ward Academic Monitor',
          icon: 'fa-user-group',
          color: 'text-amber-400',
          badge: 'Ward'
        };
      case 'institute':
        return {
          id: 'institute_overview',
          label: 'Institute AICTE Governance',
          icon: 'fa-building-columns',
          color: 'text-teal-400',
          badge: 'SIF'
        };
      case 'admin':
        return {
          id: 'admin_crud',
          label: 'AICTE Complaints & Workflow',
          icon: 'fa-scale-balanced',
          color: 'text-rose-400',
          badge: 'Queue'
        };
      case 'student':
      default:
        return {
          id: 'student_dashboard',
          label: 'Student Dashboard',
          icon: 'fa-gauge-high',
          color: 'text-blue-400',
          badge: 'Overview'
        };
    }
  };

  const primaryRoleItem = getPrimaryRoleItem();

  const navItems = [
    {
      id: 'interconnection',
      label: 'Interconnection Hub',
      icon: 'fa-network-wired',
      color: 'text-cyan-400',
      badge: 'Topology'
    },
    primaryRoleItem,
    {
      id: 'enrolled_institutions',
      label: 'Enrolled Institutions Hub',
      icon: 'fa-building-columns',
      color: 'text-emerald-400',
      badge: '7 ERP Modules'
    },
    {
      id: 'unified_chat',
      label: 'Unified Agora & Chat',
      icon: 'fa-comments',
      color: 'text-purple-400',
      badge: 'Meta AI'
    },
    {
      id: 'guidance',
      label: 'Academic Guidance & RAG',
      icon: 'fa-graduation-cap',
      color: 'text-blue-400'
    },
    {
      id: 'biometrics',
      label: 'Multimodal Biometrics',
      icon: 'fa-fingerprint',
      color: 'text-teal-400'
    },
    {
      id: 'scam_shield',
      label: 'Opportunity Scam Shield',
      icon: 'fa-shield-halved',
      color: 'text-rose-400'
    },
    {
      id: 'career',
      label: 'Career Pathways',
      icon: 'fa-briefcase',
      color: 'text-amber-400'
    },
    {
      id: 'admin_federation',
      label: '7-DB Federation Console',
      icon: 'fa-server',
      color: 'text-indigo-400',
      badge: 'Cluster'
    },
    {
      id: 'dev_templates',
      label: 'Institution Dev Studio',
      icon: 'fa-laptop-code',
      color: 'text-sky-400',
      badge: 'Templates'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
      <div className="space-y-4">
        {/* Navigation Section */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-bold">
            Portal Navigation
          </div>
          <nav className="space-y-1.5 mt-2">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl transition flex items-center space-x-3 text-xs ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white font-medium'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} w-5 text-sm ${isActive ? 'text-white' : item.color}`}></i>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-auto text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer Security Status */}
      <div className="pt-4 mt-6 border-t border-slate-800/80 space-y-2">
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span>Storage Partition</span>
            <span className="text-emerald-400 font-bold">Encrypted</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Cloud Sync Lake</span>
            <span className="text-blue-400 font-bold">Active</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Sovereign Sarvam-AI</span>
            <span className="text-purple-400 font-bold">v105B</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
