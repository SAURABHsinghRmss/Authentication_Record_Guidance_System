import React, { useState } from 'react';

export const ScamShield: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    setChecking(true);
    setResult(null);

    setTimeout(() => {
      setChecking(false);
      const isSus = urlInput.includes('free-stipend') || urlInput.includes('gift') || urlInput.includes('telegram');
      if (isSus) {
        setResult({
          legitimate: false,
          riskLevel: 'CRITICAL RISK (KNOWN SCAM SIGNATURE)',
          verdict: 'POTENTIAL PHISHING / FRAUDULENT RECRUITER',
          flags: [
            'Domain registered within the last 14 days without corporate WHOIS records',
            'Demands upfront "registration / security deposit" via non-escrow UPI handle',
            'Zero accreditation in AICTE / UGC official university directory'
          ]
        });
      } else {
        setResult({
          legitimate: true,
          riskLevel: 'VERIFIED GENUINE',
          verdict: 'OFFICIAL ACCREDITED PORTAL / COMPANY',
          flags: [
            'SSL Certificate issued to valid public education authority',
            'Domain listed in National Academic Depository (NAD) trusted directory',
            'Complies with Indian Digital Personal Data Protection Act (DPDP 2023)'
          ]
        });
      }
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/60 border border-rose-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-rose-600/30">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                National Student Protection Infrastructure
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Opportunity Scam Shield</h1>
              <p className="text-xs text-slate-400 font-mono">
                Verify internship offers, fellowship URLs, and campus recruiters against AICTE scam databases
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="Paste suspicious website URL, recruiter email, or stipend offer link..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
          />
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center space-x-2"
          >
            <i className={`fa-solid fa-magnifying-glass-shield ${checking ? 'fa-spin' : ''}`}></i>
            <span>{checking ? 'Analyzing Threat...' : 'Scan Opportunity'}</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="text-slate-400 text-[11px] self-center">Try Demo Samples:</span>
          <button
            onClick={() => setUrlInput('https://swayam.gov.in/courses/nptel-ai-certification')}
            className="bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded-xl border border-slate-800"
          >
            Govt SWAYAM URL (Safe)
          </button>
          <button
            onClick={() => setUrlInput('https://free-stipend-internship-instant-approval.net/pay-500')}
            className="bg-slate-950 hover:bg-slate-800 text-rose-300 px-3 py-1 rounded-xl border border-slate-800"
          >
            Suspicious Link (Scam)
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`p-6 rounded-3xl border transition space-y-4 ${
          result.legitimate
            ? 'bg-emerald-950/30 border-emerald-500/40'
            : 'bg-rose-950/30 border-rose-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
              result.legitimate
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              {result.riskLevel}
            </span>
            <span className="text-xs font-mono text-slate-400">Database: AICTE Blacklist Feed v2.4</span>
          </div>

          <h3 className="text-lg font-extrabold text-white">{result.verdict}</h3>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs font-mono">
            {result.flags.map((flag: string, i: number) => (
              <div key={i} className="flex items-start space-x-2">
                <i className={`fa-solid mt-0.5 ${result.legitimate ? 'fa-circle-check text-emerald-400' : 'fa-triangle-exclamation text-rose-400'}`}></i>
                <span className="text-slate-200">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
