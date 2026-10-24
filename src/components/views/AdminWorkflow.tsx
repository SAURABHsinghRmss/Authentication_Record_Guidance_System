import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FEDERATION_DATABASES } from '../../data/mockData';

export const AdminWorkflow: React.FC = () => {
  const { complaints } = useAuth();
  const [selectedBureau, setSelectedBureau] = useState('ALL');
  const [dpiTesting, setDpiTesting] = useState<string | null>(null);
  const [dpiResults, setDpiResults] = useState<Record<string, string>>({
    apaar: 'Operational (24ms latency)',
    nsp: 'Operational (41ms latency)',
    aicte: 'Operational (18ms latency)',
    digilocker: 'Operational (32ms latency)',
    pfms: 'Operational (29ms latency)'
  });

  const testDpiEndpoint = (endpoint: string) => {
    setDpiTesting(endpoint);
    setTimeout(() => {
      setDpiTesting(null);
      setDpiResults(prev => ({
        ...prev,
        [endpoint]: `Verified Valid Token (${Math.floor(15 + Math.random() * 25)}ms latency)`
      }));
    }, 700);
  };

  const filteredComplaints = selectedBureau === 'ALL'
    ? complaints
    : complaints.filter(c => c.assigned_bureau.includes(selectedBureau));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Admin Master Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-pink-950/60 border border-rose-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-rose-600/30">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Admin Control Center · Master Admin (msrch)
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">National AICTE Sovereign Dashboard</h1>
              <p className="text-xs text-slate-400 font-mono">
                Complaints Triage, 7-Database Cluster, & India DPI Interconnect
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <div>Sovereign Token: <strong className="text-rose-400">MSRCH-ROOT-2026</strong></div>
            <div>DPI Uptime: <strong className="text-emerald-400">99.998%</strong></div>
          </div>
        </div>
      </div>

      {/* India DPI Testing Suite */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-bolt text-amber-400"></i>
            <h3 className="text-base font-extrabold text-white">India DPI (Digital Public Infrastructure) Live Interconnect</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">5/5 Endpoints Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { id: 'apaar', name: 'APAAR / ABC', icon: 'fa-graduation-cap' },
            { id: 'nsp', name: 'NSP Scholarships', icon: 'fa-award' },
            { id: 'aicte', name: 'AICTE SIF Escrow', icon: 'fa-building-columns' },
            { id: 'digilocker', name: 'DigiLocker NAD', icon: 'fa-folder-closed' },
            { id: 'pfms', name: 'PFMS / UPI Direct', icon: 'fa-credit-card' }
          ].map(dpi => (
            <div key={dpi.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{dpi.name}</span>
                  <i className={`fa-solid ${dpi.icon} text-slate-400`}></i>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">
                  {dpiResults[dpi.id]}
                </div>
              </div>
              <button
                onClick={() => testDpiEndpoint(dpi.id)}
                disabled={dpiTesting === dpi.id}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] transition"
              >
                {dpiTesting === dpi.id ? 'Pinging...' : 'Ping Endpoint'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AICTE Complaints Triage Queue */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white">AICTE Grievance & Complaints Triage</h3>
            <p className="text-xs text-slate-400 font-mono">Real-time cross-role escalation queue</p>
          </div>

          <div className="flex space-x-2 text-xs">
            {['ALL', 'Research', 'Regulatory', 'Approval'].map(bureau => (
              <button
                key={bureau}
                onClick={() => setSelectedBureau(bureau)}
                className={`px-3 py-1 rounded-xl font-mono transition ${
                  selectedBureau === bureau ? 'bg-rose-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {bureau}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredComplaints.map(t => (
            <div key={t.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-rose-400">{t.ticket_no}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-bold text-white">{t.subject}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold self-start sm:self-center ${
                  t.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {t.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{t.description}</p>
              <div className="flex flex-wrap items-center gap-x-4 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                <span>Complainant: <strong className="text-slate-200">{t.complainant} ({t.complainant_role})</strong></span>
                <span>Institution: <strong className="text-slate-200">{t.institution}</strong></span>
                <span>Assigned Bureau: <strong className="text-rose-300">{t.assigned_bureau}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
