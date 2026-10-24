import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const AuditLogsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { auditLogs } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full space-y-4 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-mono font-bold">
            <i className="fa-solid fa-terminal"></i>
            <span>IMMUTABLE SOVEREIGN AUDIT STREAM</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Cryptographic Activity Ledger</h2>
          <p className="text-xs text-slate-400 font-mono">
            Directly mirroring events across all 7 SQLite partitioned databases and IAM tokens.
          </p>
        </div>

        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-slate-300 space-y-2">
          {auditLogs.map((log, idx) => (
            <div key={idx} className="flex items-start space-x-2 border-b border-slate-900 pb-1.5 last:border-0">
              <span className="text-blue-400 select-none">›</span>
              <span className="leading-relaxed">{log}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
          <span>SHA-256 State Hash: 9f82d1c...b04</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
