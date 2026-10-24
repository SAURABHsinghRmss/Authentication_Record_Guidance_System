import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const InstituteGovernance: React.FC = () => {
  const { fdrEscrow } = useAuth();
  const [expansionSubmitted, setExpansionSubmitted] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Institute Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-emerald-950/60 border border-teal-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-600/30">
              <i className="fa-solid fa-building-columns"></i>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Institute AICTE Governance · Role 04
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">GL Bajaj Institute of Technology & Management</h1>
              <p className="text-xs text-slate-400 font-mono">
                AISHE Code: <strong className="text-teal-300">C-46141</strong> · AICTE Permanent Institute ID: 1-4198211
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <div>Accreditation: <strong className="text-emerald-400">NBA Accredited & NAAC A+</strong></div>
            <div>Statutory Reserve Status: <strong className="text-teal-400">₹1.75 Cr Locked</strong></div>
          </div>
        </div>
      </div>

      {/* AICTE Statutory Reserve FDR Escrow Verification */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-vault text-teal-400"></i>
            <h3 className="text-base font-extrabold text-white">AICTE Statutory Reserve FDR Escrow Register</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Joint Account with AICTE RO
          </span>
        </div>

        <div className="space-y-3">
          {fdrEscrow.map(fdr => (
            <div key={fdr.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-white text-sm">{fdr.bank_name}</span>
                <span className="text-sm font-extrabold text-emerald-400 font-mono">
                  Principal: ₹{(fdr.principal_amount / 10000000).toFixed(2)} Crore
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-400 pt-1">
                <div>FDR No: <span className="text-slate-200">{fdr.fdr_number}</span></div>
                <div>Maturity: <span className="text-slate-200">{fdr.maturity_date}</span></div>
                <div className="text-emerald-400 font-bold">{fdr.compliance_tier}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SIF Compliance Checklist & Expansion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SIF Checklist */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h3 className="text-base font-extrabold text-white">SIF (Standard Inspection Form) Compliance</h3>
          <div className="space-y-2 text-xs font-mono">
            {[
              { label: 'Faculty Cadre Ratio (Prof : Asso : Asst)', val: '1 : 2 : 6 (Meets AICTE)', ok: true },
              { label: 'Student to Faculty Ratio (SFR)', val: '13.8 : 1 (Permissible <= 15:1)', ok: true },
              { label: 'Built-up Instructional Area', val: '42,500 sq.m (Exceeds Norms)', ok: true },
              { label: 'High-Speed Broadband Internet', val: '1 Gbps Leased Line Active', ok: true },
              { label: 'Barrier-Free Divyangjan Access', val: 'Lifts, Ramps & Auditory Cues', ok: true }
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <i className="fa-solid fa-check"></i>
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Intake Expansion Proposal */}
        <div className="bg-slate-900/90 border border-teal-500/30 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-extrabold text-white">Annual Intake Expansion (AY 2026-27)</h3>
          <p className="text-xs text-slate-400">
            Submit request for additional 120 seats in B.Tech Artificial Intelligence and Data Science.
          </p>

          {expansionSubmitted ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              ✓ Application submitted to AICTE Approval Bureau (AB). SIF Verification Token: #SIF-EXP-2026-894.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div>Department: Computer Science / AI & ML</div>
                <div>Proposed Intake: 120 Seats</div>
                <div>Statutory Escrow Bond: Verified & Linked</div>
              </div>
              <button
                onClick={() => setExpansionSubmitted(true)}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-lg shadow-teal-600/30"
              >
                Submit Expansion to AICTE Approval Bureau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
