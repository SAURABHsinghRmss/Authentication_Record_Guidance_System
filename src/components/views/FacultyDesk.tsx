import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const FacultyDesk: React.FC = () => {
  const { students } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [docText, setDocText] = useState(
    'Official Capstone Project submission by Amit Sharma (CS-2022-04) under Dr. Priya Sen. Implements sovereign Indian AI validation, APAAR ID synchronization, and 7-domain polyglot SQLite federation with sub-millisecond query routing.'
  );
  const [checkingAi, setCheckingAi] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const runAiCheck = () => {
    setCheckingAi(true);
    setAiResult(null);
    setTimeout(() => {
      setCheckingAi(false);
      setAiResult({
        sovereigntyScore: 98,
        aiGeneratedProbability: '12% (Human Authored with Original Research)',
        aicteCriteriaCompliance: '100% (Meets NBA Tier-1 Capstone Rubric)',
        plagiarismSimilarity: '3.4% (Direct Citations Only)',
        verdict: 'APPROVED FOR DEGREE ACCREDITATION'
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Faculty Desk Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/30">
              <i className="fa-solid fa-chalkboard-user"></i>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Faculty Mentorship Desk · Role 02
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Dr. Priya Sen</h1>
              <p className="text-xs text-slate-400 font-mono">
                Professor & Head of Distributed Systems · GLBITM · 42 Mentees Assigned
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <div>Active Evaluations: <strong className="text-emerald-400">3 Pending</strong></div>
            <div>Department Average CGPA: <strong className="text-indigo-400">8.65</strong></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Assigned Mentees Roster */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-extrabold text-white">Assigned Mentees</h3>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
              {students.length} Students
            </span>
          </div>

          <div className="space-y-2">
            {students.map(st => {
              const isSel = selectedStudent.id === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className={`w-full text-left p-3 rounded-2xl border transition ${
                    isSel ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{st.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">CGPA: {st.cgpa}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {st.roll_no} · {st.attendance_percentage}% Attd.
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: AI Document Authentication Suite */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white">Document Authentication & AI Criteria Check</h3>
              <p className="text-xs text-slate-400 font-mono">
                Evaluating submission for: <strong className="text-indigo-400">{selectedStudent.name} ({selectedStudent.roll_no})</strong>
              </p>
            </div>
            <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
              Sarvam-105B Engine
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-slate-300 font-semibold block">
              Capstone Report / Academic Document Abstract
            </label>
            <textarea
              rows={4}
              value={docText}
              onChange={e => setDocText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={runAiCheck}
              disabled={checkingAi}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
            >
              <i className={`fa-solid fa-microchip ${checkingAi ? 'fa-spin' : ''}`}></i>
              <span>{checkingAi ? 'Running Sarvam-105b Validation...' : 'Run Sovereign AI Validation'}</span>
            </button>
          </div>

          {/* AI Criteria Check Results */}
          {aiResult && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {aiResult.verdict}
                </span>
                <span className="text-xs font-mono text-slate-400">Hash: SHA256-4b89fa</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">AI Originality & Authorship</span>
                  <span className="text-white font-bold text-sm">{aiResult.aiGeneratedProbability}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">AICTE Tier-1 Rubric Compliance</span>
                  <span className="text-emerald-400 font-bold text-sm">{aiResult.aicteCriteriaCompliance}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Plagiarism Index</span>
                  <span className="text-blue-400 font-bold text-sm">{aiResult.plagiarismSimilarity}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Sovereign Knowledge Score</span>
                  <span className="text-purple-400 font-bold text-sm">{aiResult.sovereigntyScore} / 100</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
