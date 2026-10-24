import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ATTENDANCE_BREAKDOWN } from '../../data/mockData';

export const ParentMonitor: React.FC = () => {
  const { payFee } = useAuth();
  const [feeAmount, setFeeAmount] = useState('12000');
  const [paid, setPaid] = useState(false);
  const [noteSent, setNoteSent] = useState(false);
  const [parentNote, setParentNote] = useState('');

  const handleParentPay = (e: React.FormEvent) => {
    e.preventDefault();
    payFee(parseInt(feeAmount), 'Parent-initiated Semester 6 Lab Escrow Payment');
    setPaid(true);
    setTimeout(() => setPaid(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Parent Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/60 border border-amber-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-amber-600/30">
              <i className="fa-solid fa-user-group"></i>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Parent & Guardian Portal · Role 03
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Mr. Rajesh Sharma</h1>
              <p className="text-xs text-slate-400 font-mono">
                Ward Linked: <strong className="text-amber-400">Amit Sharma (CS-2022-04)</strong> · 6th Sem B.Tech CSE
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <div>Ward APAAR: <strong className="text-slate-200">APAAR-9988-7766-5544</strong></div>
            <div>Academic Standing: <strong className="text-emerald-400">Exemplary (8.92 CGPA)</strong></div>
          </div>
        </div>
      </div>

      {/* Ward Status & Attendance Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="text-slate-400 text-xs font-mono">Ward Aggregate Attendance</div>
          <div className="text-3xl font-extrabold text-white">88.5%</div>
          <div className="text-xs text-emerald-400 font-mono">✓ Mandatory 75% threshold satisfied</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="text-slate-400 text-xs font-mono">Current Cumulative CGPA</div>
          <div className="text-3xl font-extrabold text-white">8.92 <span className="text-xs text-slate-400 font-normal">/ 10.0</span></div>
          <div className="text-xs text-blue-400 font-mono">✓ 0 Backlogs recorded</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="text-slate-400 text-xs font-mono">Outstanding Semester Dues</div>
          <div className="text-3xl font-extrabold text-amber-400">₹12,000</div>
          <div className="text-xs text-slate-400 font-mono">Due for AI Computing Lab usage</div>
        </div>
      </div>

      {/* 2-Column Split: Subject Attendance & Fee Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-extrabold text-white">Subject-Wise Daily Attendance</h3>
          <div className="space-y-3">
            {ATTENDANCE_BREAKDOWN.slice(0, 4).map(s => (
              <div key={s.code} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>{s.title}</span>
                  <span className="text-emerald-400 font-mono">{s.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${s.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Parent Fee Payment & Contact Mentor */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-credit-card text-amber-400"></i>
              <h3 className="text-base font-extrabold text-white">Direct Fee Settlement</h3>
            </div>

            {paid && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                ✓ Payment successful! SBIePay transaction TXN-PARENT-8921 logged.
              </div>
            )}

            <form onSubmit={handleParentPay} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount to Settle</label>
                <input
                  type="number"
                  value={feeAmount}
                  onChange={e => setFeeAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition"
              >
                Pay via SBIePay / UPI
              </button>
            </form>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-base font-extrabold text-white">Message Faculty Mentor (Dr. Priya Sen)</h3>
            {noteSent && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                ✓ Message delivered directly to Dr. Priya Sen's faculty inbox.
              </div>
            )}
            <textarea
              rows={2}
              placeholder="Inquire about capstone evaluation, attendance or hostel gate pass..."
              value={parentNote}
              onChange={e => setParentNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => {
                if (parentNote) setNoteSent(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            >
              Send Mentor Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
