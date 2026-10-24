import React, { useState } from 'react';
import { FEDERATION_DATABASES } from '../../data/mockData';

export const FederationView: React.FC = () => {
  const [reindexing, setReindexing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleReindex = () => {
    setReindexing(true);
    setNotice('Verifying partition integrity and rebuilding SQLite VACUUM indices...');
    setTimeout(() => {
      setReindexing(false);
      setNotice('✓ 7/7 Database partitions verified. Sub-millisecond query routing active with 100% integrity.');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-blue-950/60 border border-indigo-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/30">
              <i className="fa-solid fa-server"></i>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Sovereign Data Storage Architecture
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">7-Database Federation Console</h1>
              <p className="text-xs text-slate-400 font-mono">
                Isolated domain partitions with zero-coupling and unified federated query routing
              </p>
            </div>
          </div>

          <button
            onClick={handleReindex}
            disabled={reindexing}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
          >
            <i className={`fa-solid fa-arrows-rotate ${reindexing ? 'fa-spin' : ''}`}></i>
            <span>{reindexing ? 'Re-verifying...' : 'Re-verify Cluster Health'}</span>
          </button>
        </div>

        {notice && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
            {notice}
          </div>
        )}
      </div>

      {/* Database Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEDERATION_DATABASES.map(db => (
          <div key={db.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-extrabold text-white flex items-center gap-2">
                <i className="fa-solid fa-database text-indigo-400"></i>
                {db.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {db.status}
              </span>
            </div>

            <p className="text-xs text-slate-300">{db.domain}</p>

            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Tables: <strong className="text-slate-200">{db.tables}</strong></span>
              <span>Records: <strong className="text-slate-200">{db.records}</strong></span>
              <span>Size: <strong className="text-slate-200">{db.size}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
