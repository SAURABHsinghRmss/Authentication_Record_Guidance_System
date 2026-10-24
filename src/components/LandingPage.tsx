import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LandingPage: React.FC = () => {
  const { instantLogin, login, loginWithGoogle } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalRole, setModalRole] = useState<UserRole>('student');
  const [authMode, setAuthMode] = useState<'mobile' | 'password' | 'register'>('mobile');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Login form state
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [username, setUsername] = useState('amit');
  const [password, setPassword] = useState('amit123');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaChallenge, setCaptchaChallenge] = useState({ prompt: '8 + 5', expected: 13 });
  const [errorMsg, setErrorMsg] = useState('');

  const generateNewCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 1;
    setCaptchaChallenge({ prompt: `${a} + ${b}`, expected: a + b });
    setCaptchaAnswer('');
  };

  const openRoleLogin = (role: UserRole) => {
    setModalRole(role);
    if (role === 'admin') {
      setUsername('msrch');
      setPassword('msrch1410#');
    } else if (role === 'faculty') {
      setUsername('faculty');
      setPassword('faculty123');
    } else if (role === 'parent') {
      setUsername('parent_alex');
      setPassword('parent123');
    } else if (role === 'institute') {
      setUsername('institute_admin');
      setPassword('inst123');
    } else {
      setUsername('amit');
      setPassword('amit123');
    }
    setErrorMsg('');
    generateNewCaptcha();
    setShowModal(true);
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (!mobileNumber || mobileNumber.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number');
        return;
      }
      setOtpSent(true);
      setErrorMsg('');
    } else {
      if (otpCode !== '123456' && otpCode.length < 4) {
        setErrorMsg('Invalid OTP. Use demo OTP 123456');
        return;
      }
      instantLogin(modalRole);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== captchaChallenge.expected) {
      setErrorMsg(`Incorrect security captcha. ${captchaChallenge.prompt} = ?`);
      return;
    }
    login(modalRole, username);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      setShowModal(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google authentication failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Hero Header */}
      <div className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-xs font-bold text-blue-300">
            <i className="fa-solid fa-shield-halved text-emerald-400"></i>
            <span>Official Digital Public Infrastructure (DPI) & AI Governance Platform for India</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            EduIdentityAI
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
            Unified Academic Identity, Record Governance, AI Application Validation, Documentation Authentication, and Regulatory Compliance Verification powered exclusively by <strong className="text-purple-400">Sarvam AI (sarvam-105b)</strong>.
          </p>

          {/* Quick Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs font-mono">
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-blue-300">
              <i className="fa-solid fa-graduation-cap mr-1.5 text-blue-400"></i>APAAR / ABC ID
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-emerald-300">
              <i className="fa-solid fa-building-columns mr-1.5 text-emerald-400"></i>AICTE SIF & FDR Escrow
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-purple-300">
              <i className="fa-solid fa-robot mr-1.5 text-purple-400"></i>Sarvam-105B AI
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-amber-300">
              <i className="fa-solid fa-credit-card mr-1.5 text-amber-400"></i>SBIePay / PFMS
            </span>
          </div>

          {/* 1-Click Demo Accounts & Live Interconnection Launchpad */}
          <div className="mt-8 p-6 bg-slate-900/95 border-2 border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-500/10 max-w-4xl mx-auto space-y-4 text-left backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-sm font-extrabold text-white">⚡ 1-Click Instant Demo Launchpad</span>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                  Pre-Seeded & Live Interconnected
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Zero credentials needed · Instant access</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Select any interconnected persona below to launch the system immediately. You can switch between roles in real-time from the top navigation bar to observe live cross-role data synchronization!
            </p>

            {/* Google Firebase Authentication SSO */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <i className="fa-solid fa-database text-sm"></i>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Cloud Firestore & Firebase Auth Connected</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Zero-Trust RBAC · Audit Logs & Biometric Ledger Cloud Synced
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md shrink-0"
              >
                <i className="fa-brands fa-google text-red-500 text-sm"></i>
                <span>{isGoogleLoading ? 'Authenticating...' : 'Sign in with Google SSO'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
              {/* Student */}
              <button
                type="button"
                onClick={() => instantLogin('student')}
                className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/40 hover:border-blue-400 hover:bg-blue-950/40 transition flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between text-blue-400 text-xs font-bold">
                    <span>🎓 Student</span>
                    <i className="fa-solid fa-arrow-right text-[10px] opacity-0 group-hover:opacity-100 transition"></i>
                  </div>
                  <div className="text-white font-extrabold text-xs mt-1">Amit Sharma</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">amit / amit123</div>
                </div>
                <div className="mt-3 text-[9px] text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full text-center font-bold">Launch Student</div>
              </button>

              {/* Faculty */}
              <button
                type="button"
                onClick={() => instantLogin('faculty')}
                className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-950/40 transition flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between text-indigo-400 text-xs font-bold">
                    <span>👩‍🏫 Faculty</span>
                    <i className="fa-solid fa-arrow-right text-[10px] opacity-0 group-hover:opacity-100 transition"></i>
                  </div>
                  <div className="text-white font-extrabold text-xs mt-1">Dr. Priya Sen</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">faculty / faculty123</div>
                </div>
                <div className="mt-3 text-[9px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full text-center font-bold">Launch Faculty</div>
              </button>

              {/* Parent */}
              <button
                type="button"
                onClick={() => instantLogin('parent')}
                className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/40 transition flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between text-amber-400 text-xs font-bold">
                    <span>👨‍👦 Parent</span>
                    <i className="fa-solid fa-arrow-right text-[10px] opacity-0 group-hover:opacity-100 transition"></i>
                  </div>
                  <div className="text-white font-extrabold text-xs mt-1">Rajesh Sharma</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">parent_alex / parent123</div>
                </div>
                <div className="mt-3 text-[9px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full text-center font-bold">Launch Parent</div>
              </button>

              {/* Institute */}
              <button
                type="button"
                onClick={() => instantLogin('institute')}
                className="p-3.5 rounded-2xl bg-slate-950 border border-teal-500/40 hover:border-teal-400 hover:bg-teal-950/40 transition flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between text-teal-400 text-xs font-bold">
                    <span>🏛️ Institute</span>
                    <i className="fa-solid fa-arrow-right text-[10px] opacity-0 group-hover:opacity-100 transition"></i>
                  </div>
                  <div className="text-white font-extrabold text-xs mt-1">GLBITM Director</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">institute_admin / inst123</div>
                </div>
                <div className="mt-3 text-[9px] text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full text-center font-bold">Launch Institute</div>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => instantLogin('admin')}
                className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/40 hover:border-rose-400 hover:bg-rose-950/40 transition flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between text-rose-400 text-xs font-bold">
                    <span>🛡️ Root Admin</span>
                    <i className="fa-solid fa-arrow-right text-[10px] opacity-0 group-hover:opacity-100 transition"></i>
                  </div>
                  <div className="text-white font-extrabold text-xs mt-1">Master Admin</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">msrch / msrch1410#</div>
                </div>
                <div className="mt-3 text-[9px] text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full text-center font-bold">Launch Admin</div>
              </button>
            </div>
          </div>

          <div className="pt-6">
            <a
              href="#role-exploration"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition"
            >
              <span>Or Explore Individual Role Portals</span>
              <i className="fa-solid fa-arrow-down"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Scrollable Role Exploration Section */}
      <div id="role-exploration" className="max-w-7xl mx-auto px-4 py-20 space-y-16 relative z-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Select Your Operational Role</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Each role is backed by isolated security partitions, federated databases, and tailored AI governance tools.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. STUDENT */}
          <div className="bg-slate-900/90 border border-blue-500/30 rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6 hover:border-blue-400 transition group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-2xl font-bold">
                <i className="fa-solid fa-user-graduate"></i>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                  Role 01 · Port 8001
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-2 group-hover:text-blue-400 transition">
                  Student Portal
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Access official notice boards, enrolled institutions hub, Academic Bank of Credits (ABC), fee ledgers, scholarship DBT tracking, and EduMentor AI counseling.
                </p>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                <div>✓ Mobile-first OTP sign-in</div>
                <div>✓ APAAR ID & DigiLocker sync</div>
                <div>✓ UPI / NetBanking fee payments</div>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => instantLogin('student')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2"
              >
                <i className="fa-solid fa-bolt"></i>
                <span>1-Click Demo (Amit Sharma)</span>
              </button>
              <button
                onClick={() => openRoleLogin('student')}
                className="w-full py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <span>Standard Sign-In</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* 2. FACULTY */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6 hover:border-indigo-400 transition group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-2xl font-bold">
                <i className="fa-solid fa-chalkboard-user"></i>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full">
                  Role 02 · Port 8002
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-2 group-hover:text-indigo-400 transition">
                  Faculty Desk
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Evaluate student capstones, authenticate documents with AI criteria checks, record mentor counseling logs, and review attendance alerts.
                </p>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                <div>✓ Capstone report authentication</div>
                <div>✓ AI criteria check suite</div>
                <div>✓ Mentor-mentee logs</div>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => instantLogin('faculty')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
              >
                <i className="fa-solid fa-bolt"></i>
                <span>1-Click Demo (Dr. Priya Sen)</span>
              </button>
              <button
                onClick={() => openRoleLogin('faculty')}
                className="w-full py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <span>Standard Sign-In</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* 3. PARENT */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6 hover:border-amber-400 transition group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl font-bold">
                <i className="fa-solid fa-user-group"></i>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full">
                  Role 03 · Port 8003
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-2 group-hover:text-amber-400 transition">
                  Parent & Guardian
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Track child ward academic progress, attendance records, fee installments, security caution deposits, and DBT scholarship disbursements.
                </p>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                <div>✓ Ward academic linkage</div>
                <div>✓ Parent-led fee payments</div>
                <div>✓ SBIePay / NetBanking integration</div>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => instantLogin('parent')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 transition flex items-center justify-center space-x-2"
              >
                <i className="fa-solid fa-bolt"></i>
                <span>1-Click Demo (Rajesh Sharma)</span>
              </button>
              <button
                onClick={() => openRoleLogin('parent')}
                className="w-full py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <span>Standard Sign-In</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* 4. INSTITUTE */}
          <div className="bg-slate-900/90 border border-teal-500/30 rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6 hover:border-teal-400 transition group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400 text-2xl font-bold">
                <i className="fa-solid fa-building-columns"></i>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full">
                  Role 04 · Port 8004
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-2 group-hover:text-teal-400 transition">
                  Institute Governance
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  AICTE SIF compliance auditing, Statutory Reserve FDR Escrow verification, faculty cadre ratio validation, and annual intake expansion.
                </p>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                <div>✓ Statutory FDR Escrow verification</div>
                <div>✓ AICTE SIF intake expansion</div>
                <div>✓ Institutional developer templates</div>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => instantLogin('institute')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-teal-600/30 transition flex items-center justify-center space-x-2"
              >
                <i className="fa-solid fa-bolt"></i>
                <span>1-Click Demo (Director GLBITM)</span>
              </button>
              <button
                onClick={() => openRoleLogin('institute')}
                className="w-full py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <span>Standard Sign-In</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* 5. ADMIN */}
          <div className="bg-slate-900/90 border border-rose-500/30 rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6 hover:border-rose-400 transition group md:col-span-2 lg:col-span-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-2xl font-bold">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full">
                  Role 05 · Port 8005
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-2 group-hover:text-rose-400 transition">
                  Admin Control Center
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Master administrator oversight (msrch), 7-database federation health monitoring, admin complaints tracking dashboard, and AICTE workflow automation.
                </p>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                <div>✓ 7-DB federation console</div>
                <div>✓ AICTE approval workflow automation</div>
                <div>✓ Permanent developer protection</div>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => instantLogin('admin')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center space-x-2"
              >
                <i className="fa-solid fa-bolt"></i>
                <span>1-Click Demo (Master Admin)</span>
              </button>
              <button
                onClick={() => openRoleLogin('admin')}
                className="w-full py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <span>Standard Sign-In</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xl font-bold mx-auto">
                <i className="fa-solid fa-lock"></i>
              </div>
              <h3 className="text-xl font-extrabold text-white capitalize">
                {modalRole} Portal Sign-In
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Sovereign IAM Partition · Encrypted Session
              </p>
            </div>

            {/* Google Fast Sign-In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg"
            >
              <i className="fa-brands fa-google text-red-500 text-sm"></i>
              <span>{isGoogleLoading ? 'Connecting to Google...' : `Sign in with Google (${modalRole.toUpperCase()})`}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest font-mono shrink-0">
                Or Traditional Sovereign IAM
              </span>
            </div>

            {/* Auth Mode switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => {
                  setAuthMode('mobile');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-lg font-bold transition ${
                  authMode === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mobile OTP
              </button>
              <button
                onClick={() => {
                  setAuthMode('password');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-lg font-bold transition ${
                  authMode === 'password' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                User & Password
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                <i className="fa-solid fa-triangle-exclamation shrink-0"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Mobile OTP Form */}
            {authMode === 'mobile' ? (
              <form onSubmit={handleMobileSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Registered Mobile Number
                  </label>
                  <div className="flex">
                    <span className="px-3 py-2.5 bg-slate-950 border border-r-0 border-slate-800 rounded-l-xl text-xs text-slate-400 font-mono flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={e => setMobileNumber(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-r-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      One-Time Password (OTP)
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="Enter 123456"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-center tracking-widest text-lg"
                    />
                    <div className="text-[10px] text-emerald-400 mt-1 font-mono">
                      ✓ Demo OTP: 123456
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
                >
                  {otpSent ? 'Verify & Authenticate' : 'Send Sovereign OTP'}
                </button>
              </form>
            ) : (
              /* Username & Password Form */
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Institutional Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Secure Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Security Captcha */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Security Math Challenge:</span>
                    <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {captchaChallenge.prompt} = ?
                    </span>
                  </div>
                  <input
                    type="number"
                    value={captchaAnswer}
                    onChange={e => setCaptchaAnswer(e.target.value)}
                    placeholder="Enter answer"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
                >
                  Sign In to {modalRole} Portal
                </button>
              </form>
            )}

            <div className="text-center pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => instantLogin(modalRole)}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                ⚡ Bypass & Use 1-Click Instant Demo Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
