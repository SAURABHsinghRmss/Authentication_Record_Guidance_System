import React, { useState } from 'react';

export const DevTemplateStudio: React.FC = () => {
  const [templateType, setTemplateType] = useState<'School' | 'College' | 'University' | 'Company' | 'Start-up'>('College');
  const [viewFormat, setViewFormat] = useState<'visual' | 'json'>('visual');
  const [savedNotice, setSavedNotice] = useState(false);

  const presets: Record<string, any> = {
    School: {
      template_name: 'CBSE / ICSE Senior Secondary School Template',
      badge: 'K-12 School Board Affiliated',
      program: 'Higher Secondary (Science Stream - Grade 11 & 12)',
      fee_label: 'Quarterly School Tuition & Bus Transit Fee',
      features: ['Diary & Homework Tracker', 'PTM Parent Meet Schedule', 'Weekly Unit Tests']
    },
    College: {
      template_name: 'Autonomous Engineering & Polytechnic College Template',
      badge: 'AICTE / AKTU Autonomous Engineering',
      program: 'Bachelor of Technology (B.Tech Computer Science)',
      fee_label: 'Semester Tuition & Laboratory Dues',
      features: ['SIF AICTE Compliance Form', 'Academic Bank of Credits (ABC)', 'Statutory FDR Escrow Reserve']
    },
    University: {
      template_name: 'State Central Research University Template',
      badge: 'UGC 12(B) State University',
      program: 'Postgraduate & Doctoral Research Colloquium',
      fee_label: 'Annual University Research Grant & Library Endowment',
      features: ['Doctoral Thesis AI Validation', 'Multi-Campus Credit Transfer', 'DigiLocker NAD Sync']
    },
    Company: {
      template_name: 'Corporate Apprenticeship & Skill Development Portal',
      badge: 'NAPS / Skill India Certified',
      program: 'Graduate Engineer Trainee (GET) Residency',
      fee_label: 'Monthly Professional Stipend Ledger',
      features: ['Production Deployment Access', 'Mentor Code Review', 'Corporate PFMS Escrow']
    },
    'Start-up': {
      template_name: 'Incubation & AI Venture Residency Template',
      badge: 'Startup India / T-Hub Recognized',
      program: 'DeepTech Founder & Research Fellow Program',
      fee_label: 'Venture Seed Equity & Cloud Credit Grant',
      features: ['Patent Filing Tracker', 'GPU Cluster Grant Allotment', 'Investor Cap Table Ledger']
    }
  };

  const currentPreset = presets[templateType];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-blue-950/60 border border-sky-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-sky-600/30">
              <i className="fa-solid fa-laptop-code"></i>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Institutional Developer Mode & Template Studio
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Custom Institutional Presets</h1>
              <p className="text-xs text-slate-400 font-mono">
                Rapidly adapt EduIdentityAI for Schools, Colleges, Universities, Companies, or Start-up Incubators
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Template Type Selector & View Toggle */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(['School', 'College', 'University', 'Company', 'Start-up'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTemplateType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  templateType === type ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewFormat('visual')}
              className={`px-3 py-1 rounded-lg font-bold transition ${viewFormat === 'visual' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Visual View
            </button>
            <button
              onClick={() => setViewFormat('json')}
              className={`px-3 py-1 rounded-lg font-bold transition ${viewFormat === 'json' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Raw Schema (JSON)
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            ✓ Preset "{templateType}" compiled and applied to institutional developer runtime.
          </div>
        )}

        {/* View Mode */}
        {viewFormat === 'visual' ? (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">{currentPreset.template_name}</h3>
              <span className="text-xs font-mono font-bold bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full border border-sky-500/30">
                {currentPreset.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Curriculum Program</span>
                <span className="text-white font-bold">{currentPreset.program}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Ledger Classification</span>
                <span className="text-white font-bold">{currentPreset.fee_label}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-300">Configured Module Workflows:</div>
              <div className="flex flex-wrap gap-2">
                {currentPreset.features.map((f: string, i: number) => (
                  <span key={i} className="text-xs bg-slate-900 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setSavedNotice(true);
                  setTimeout(() => setSavedNotice(false), 4000);
                }}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition"
              >
                Deploy This Template Schema
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <pre className="text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(currentPreset, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
