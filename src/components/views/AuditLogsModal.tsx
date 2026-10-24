import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BiometricModality, BiometricStatus } from '../../types';

export const AuditLogsModal: React.FC<{ isOpen: boolean; onClose: () => void; onOpenBiometrics?: () => void }> = ({
  isOpen,
  onClose,
  onOpenBiometrics
}) => {
  const { auditLogs, biometricLogs, recordBiometricAttempt } = useAuth();
  const [activeTab, setActiveTab] = useState<'biometrics' | 'system'>('biometrics');
  const [modalityFilter, setModalityFilter] = useState<'ALL' | BiometricModality>('ALL');
  const [statusCategoryFilter, setStatusCategoryFilter] = useState<'ALL' | 'SUCCESS' | 'FAILURE' | 'PENDING'>('ALL');
  const [searchDateOrKeyword, setSearchDateOrKeyword] = useState('');
  const [simulatingScan, setSimulatingScan] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);

  // High-Priority Alert Configuration State
  const [notifySystemAlerts, setNotifySystemAlerts] = useState<boolean>(() => {
    return localStorage.getItem('edu_notify_system_failed_scans') !== 'false';
  });
  const [notifyEmailAlerts, setNotifyEmailAlerts] = useState<boolean>(() => {
    return localStorage.getItem('edu_notify_email_failed_scans') !== 'false';
  });
  const [notifyEmailRecipient, setNotifyEmailRecipient] = useState<string>(() => {
    return localStorage.getItem('edu_notify_alert_email') || 'ssrmsr06@gmail.com';
  });
  const [notifyPriorityThreshold, setNotifyPriorityThreshold] = useState<'CRITICAL_ONLY' | 'ALL_FAILURES'>('CRITICAL_ONLY');
  const [showAlertConfig, setShowAlertConfig] = useState(false);
  const [activeAlertBanner, setActiveAlertBanner] = useState<{ title: string; message: string; timestamp: string } | null>(null);
  const [testAlertFeedback, setTestAlertFeedback] = useState(false);

  // Sync settings with localStorage
  useEffect(() => {
    localStorage.setItem('edu_notify_system_failed_scans', String(notifySystemAlerts));
  }, [notifySystemAlerts]);

  useEffect(() => {
    localStorage.setItem('edu_notify_email_failed_scans', String(notifyEmailAlerts));
  }, [notifyEmailAlerts]);

  useEffect(() => {
    localStorage.setItem('edu_notify_alert_email', notifyEmailRecipient);
  }, [notifyEmailRecipient]);

  if (!isOpen) return null;

  const downloadBiometricReportCSV = () => {
    const headers = [
      'Event ID',
      'Timestamp (UTC+5:30)',
      'Modality Code',
      'Modality Description',
      'Subject Roll Number',
      'Subject Full Name',
      'Verification Status',
      'Confidence Score',
      'Audit SHA-256 Hash',
      'Compliance Notes'
    ];

    const escapeCsvField = (field: string) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const rows = biometricLogs.map(entry => [
      entry.id,
      entry.timestamp,
      entry.modality,
      entry.modalityLabel,
      entry.subjectRollNo,
      entry.subjectName,
      entry.status,
      entry.confidenceScore,
      entry.hash,
      entry.notes
    ].map(val => escapeCsvField(String(val || ''))).join(','));

    const csvContent = [
      `# EduIdentityAI Sovereign Biometric Compliance Ledger`,
      `# Generated: ${new Date().toISOString()}`,
      `# Authority: National Academic Depository (NAD) / AICTE DPI Core`,
      `# Total Records: ${biometricLogs.length}`,
      headers.join(','),
      ...rows
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `EduIdentityAI_Biometric_Audit_Report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadFeedback(true);
    setTimeout(() => setDownloadFeedback(false), 4000);
  };

  // Filtered biometric entries
  const filteredBiometrics = biometricLogs.filter(entry => {
    // 1. Modality filter
    if (modalityFilter !== 'ALL' && entry.modality !== modalityFilter) return false;

    // 2. Status category dropdown filter
    if (statusCategoryFilter === 'SUCCESS' && entry.status !== 'VERIFIED_SUCCESS') return false;
    if (statusCategoryFilter === 'FAILURE' && entry.status !== 'REJECTED' && entry.status !== 'CHALLENGE_REQUIRED') return false;
    if (statusCategoryFilter === 'PENDING' && entry.status !== 'PENDING') return false;

    // 3. Search query: date, timestamp, subject, notes, or hash
    if (searchDateOrKeyword.trim()) {
      const q = searchDateOrKeyword.trim().toLowerCase();
      const matchTimestamp = entry.timestamp.toLowerCase().includes(q);
      const matchRelative = entry.relativeTime.toLowerCase().includes(q);
      const matchSubject = entry.subjectName.toLowerCase().includes(q) || entry.subjectRollNo.toLowerCase().includes(q);
      const matchModality = entry.modalityLabel.toLowerCase().includes(q) || entry.modality.toLowerCase().includes(q);
      const matchNotes = entry.notes.toLowerCase().includes(q);
      const matchHash = entry.hash.toLowerCase().includes(q);
      const matchStatus = entry.status.toLowerCase().includes(q);

      if (!matchTimestamp && !matchRelative && !matchSubject && !matchModality && !matchNotes && !matchHash && !matchStatus) {
        return false;
      }
    }

    return true;
  });

  // KPI Calculations
  const totalScans = biometricLogs.length;
  const successScans = biometricLogs.filter(b => b.status === 'VERIFIED_SUCCESS').length;
  const failedScans = biometricLogs.filter(b => b.status === 'REJECTED' || b.status === 'CHALLENGE_REQUIRED').length;
  const successRate = totalScans > 0 ? Math.round((successScans / totalScans) * 100) : 100;
  const latestAttempt = biometricLogs[0];

  const handleSimulateQuickScan = (modality: BiometricModality, customStatus?: BiometricStatus) => {
    setSimulatingScan(true);
    setTimeout(() => {
      setSimulatingScan(false);
      if (customStatus === 'PENDING') {
        recordBiometricAttempt(modality, 'PENDING', 'Queued (In-Progress)', 'Manual liveness corroboration pending from AICTE Registrar audit.');
      } else if (customStatus === 'REJECTED') {
        recordBiometricAttempt(modality, 'REJECTED', '32.10%', 'Critical security violation: Non-liveness IR signature detected.');
        if (notifySystemAlerts || notifyEmailAlerts) {
          setActiveAlertBanner({
            title: 'CRITICAL: HIGH-PRIORITY BIOMETRIC FAILURE',
            message: `Infrared liveness failure recorded for Amit Sharma (CS-2022-04). ${
              notifyEmailAlerts ? `Dispatched security email notice to ${notifyEmailRecipient}.` : ''
            } ${notifySystemAlerts ? 'System lock audit record committed.' : ''}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          });
        }
      } else if (modality === 'FACE_3D') {
        recordBiometricAttempt('FACE_3D', 'VERIFIED_SUCCESS', '99.92%', 'Instant audit verification scan via Audit Terminal.');
      } else if (modality === 'OCR_ID') {
        recordBiometricAttempt('OCR_ID', 'VERIFIED_SUCCESS', '99.40%', 'Barcode reader scan captured at institutional checkpoint.');
      } else {
        recordBiometricAttempt('VOICE_SPECTROGRAM', 'VERIFIED_SUCCESS', '98.15%', 'Acoustic waveform spectrogram validated.');
      }
    }, 600);
  };

  const triggerTestSecurityAlert = () => {
    handleSimulateQuickScan('FACE_3D', 'REJECTED');
    setTestAlertFeedback(true);
    setTimeout(() => setTestAlertFeedback(false), 3000);
  };

  const getModalityIcon = (modality: BiometricModality) => {
    switch (modality) {
      case 'FACE_3D':
        return 'fa-camera text-teal-400';
      case 'OCR_ID':
        return 'fa-id-card text-blue-400';
      case 'VOICE_SPECTROGRAM':
        return 'fa-microphone-lines text-purple-400';
      default:
        return 'fa-fingerprint text-slate-400';
    }
  };

  const getStatusBadge = (status: BiometricStatus) => {
    switch (status) {
      case 'VERIFIED_SUCCESS':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <i className="fa-solid fa-circle-check text-[9px]"></i>
            <span>SUCCESS</span>
          </span>
        );
      case 'CHALLENGE_REQUIRED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <i className="fa-solid fa-triangle-exclamation text-[9px]"></i>
            <span>CHALLENGE</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <i className="fa-solid fa-spinner fa-spin text-[9px]"></i>
            <span>PENDING</span>
          </span>
        );
      case 'REJECTED':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
            <i className="fa-solid fa-triangle-exclamation text-[9px]"></i>
            <span>FAILURE</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 max-w-4xl w-full shadow-2xl relative max-h-[92vh] flex flex-col space-y-3.5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800"
          title="Close Modal"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-10">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono font-bold">
            <i className="fa-solid fa-shield-halved"></i>
            <span>SOVEREIGN CRYPTOGRAPHIC AUDIT STATION</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Ledger Synced
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Security & Biometric Verification History
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Immutable audit records mirroring student authentication attempts and system database events.
          </p>
        </div>

        {/* Active Alert Warning Banner */}
        {activeAlertBanner && (
          <div className="p-3.5 rounded-2xl bg-rose-950/70 border-2 border-rose-500/60 text-white flex items-start justify-between gap-3 shadow-xl shadow-rose-950/30 animate-in slide-in-from-top-2">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                <i className="fa-solid fa-bell animate-bounce text-sm"></i>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-rose-300">
                  <span>{activeAlertBanner.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">({activeAlertBanner.timestamp})</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-mono text-[11px]">
                  {activeAlertBanner.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveAlertBanner(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg text-xs"
              title="Dismiss alert"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* Tab & Notification Toggle Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Tab Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('biometrics')}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 ${
                activeTab === 'biometrics'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-fingerprint"></i>
              <span>Biometric Scan History</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === 'biometrics' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {biometricLogs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 ${
                activeTab === 'system'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-terminal"></i>
              <span>System Activity Stream</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === 'system' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {auditLogs.length}
              </span>
            </button>
          </div>

          {/* Notification Config Toggle Button */}
          <button
            onClick={() => setShowAlertConfig(!showAlertConfig)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition flex items-center space-x-2 ${
              showAlertConfig
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                : notifyEmailAlerts || notifySystemAlerts
                ? 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
            title="Configure Email and System notifications for failed biometric events"
          >
            <i className={`fa-solid ${notifyEmailAlerts || notifySystemAlerts ? 'fa-bell text-amber-400' : 'fa-bell-slash text-slate-500'}`}></i>
            <span>Failure Alert Config</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              notifyEmailAlerts || notifySystemAlerts ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {notifyEmailAlerts && notifySystemAlerts ? 'Email + Sys' : notifyEmailAlerts ? 'Email' : notifySystemAlerts ? 'Sys' : 'OFF'}
            </span>
            <i className={`fa-solid fa-chevron-${showAlertConfig ? 'up' : 'down'} text-[10px]`}></i>
          </button>
        </div>

        {/* ========================================================= */}
        {/* EXPANDABLE ALERT CONFIGURATION PANEL                      */}
        {/* ========================================================= */}
        {showAlertConfig && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-3.5 animate-in fade-in slide-in-from-top-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold">
                <i className="fa-solid fa-shield-virus"></i>
                <span>High-Priority Biometric Incident Notification Engine</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                AICTE / MoE Sovereign Threat Protocol
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Toggle 1: System In-App Notification */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between space-x-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-white">
                    <i className="fa-solid fa-desktop text-blue-400"></i>
                    <span>System In-App Alert Banners</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    Trigger urgent in-app security alert banners whenever a failed biometric event is logged.
                  </p>
                </div>
                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => setNotifySystemAlerts(!notifySystemAlerts)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition shrink-0 ${
                    notifySystemAlerts ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                  aria-pressed={notifySystemAlerts}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                      notifySystemAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Toggle 2: Email Security Dispatch */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between space-x-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-white">
                    <i className="fa-solid fa-envelope text-amber-400"></i>
                    <span>Email Security Incident Dispatch</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    Dispatch cryptographic email notifications to administrative staff upon spoof/failure detection.
                  </p>
                </div>
                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => setNotifyEmailAlerts(!notifyEmailAlerts)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition shrink-0 ${
                    notifyEmailAlerts ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                  aria-pressed={notifyEmailAlerts}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                      notifyEmailAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            {/* Recipient Email & Priority Rule Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 text-xs font-mono">
              <div className="sm:col-span-6 space-y-1">
                <label className="text-slate-400 text-[10px] block">
                  Alert Recipient Email (SMTP Gateway Target):
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={notifyEmailRecipient}
                    onChange={e => setNotifyEmailRecipient(e.target.value)}
                    placeholder="security@uni.edu"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <span className="absolute right-2.5 top-2 text-[10px] text-emerald-400">
                    <i className="fa-solid fa-check mr-1"></i>Saved
                  </span>
                </div>
              </div>

              <div className="sm:col-span-6 space-y-1">
                <label className="text-slate-400 text-[10px] block">
                  Priority Trigger Rule:
                </label>
                <select
                  value={notifyPriorityThreshold}
                  onChange={e => setNotifyPriorityThreshold(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="CRITICAL_ONLY">Critical Spoofs & Severe Failures (Score &lt; 50%)</option>
                  <option value="ALL_FAILURES">All Failures & 2FA Challenge Events</option>
                </select>
              </div>
            </div>

            {/* Test Trigger Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-mono">
                Preferences are persisted locally and applied to all real-time scan validations.
              </span>
              <button
                type="button"
                onClick={triggerTestSecurityAlert}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40 text-xs transition flex items-center space-x-1.5"
              >
                <i className={`fa-solid ${testAlertFeedback ? 'fa-check text-emerald-400' : 'fa-triangle-exclamation'}`}></i>
                <span>{testAlertFeedback ? 'Security Alert Dispatched!' : 'Simulate Failed Scan & Test Alert'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: BIOMETRIC SCAN VERIFICATION LEDGER                 */}
        {/* ========================================================= */}
        {activeTab === 'biometrics' && (
          <div className="flex-1 flex flex-col space-y-3 min-h-0">
            {/* KPI Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono block">Total Scan Attempts</span>
                <span className="text-xl font-extrabold text-white font-mono mt-0.5 block">{totalScans}</span>
                <span className="text-[10px] text-slate-500 font-mono">Logged across sessions</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono block">Success Rate</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5 block">{successRate}%</span>
                <span className="text-[10px] text-emerald-500/80 font-mono">{successScans} of {totalScans} passed</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono block">Failed Incidents</span>
                <span className="text-xl font-extrabold text-rose-400 font-mono mt-0.5 block">{failedScans}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {notifyEmailAlerts || notifySystemAlerts ? 'Alert monitoring ON' : 'Alert monitoring OFF'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono block">Last Verification</span>
                <span className="text-sm font-extrabold text-blue-400 font-mono mt-1 block truncate">
                  {latestAttempt ? latestAttempt.relativeTime : 'N/A'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono truncate block">
                  {latestAttempt ? latestAttempt.timestamp.slice(11) : '-'}
                </span>
              </div>
            </div>

            {/* Search Bar & Status Dropdown Filter */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* Search Input (by Date or Keyword) */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                    <i className="fa-solid fa-magnifying-glass text-teal-400"></i>
                  </div>
                  <input
                    type="text"
                    value={searchDateOrKeyword}
                    onChange={e => setSearchDateOrKeyword(e.target.value)}
                    placeholder="Search by date (e.g. 2026-10-24, Yesterday), roll no, or note..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono transition"
                  />
                  {searchDateOrKeyword && (
                    <button
                      onClick={() => setSearchDateOrKeyword('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs"
                      title="Clear search"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}
                </div>

                {/* Status Dropdown Filter */}
                <div className="flex items-center space-x-2 shrink-0">
                  <label className="text-slate-400 text-xs font-mono flex items-center space-x-1 shrink-0">
                    <i className="fa-solid fa-filter text-teal-400 text-[11px]"></i>
                    <span className="hidden sm:inline">Status:</span>
                  </label>
                  <select
                    value={statusCategoryFilter}
                    onChange={e => setStatusCategoryFilter(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-teal-500 transition cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="SUCCESS">Success (Verified)</option>
                    <option value="FAILURE">Failure (Rejected / Challenged)</option>
                    <option value="PENDING">Pending (Audit In-Progress)</option>
                  </select>
                </div>
              </div>

              {/* Quick Date Shortcuts & Filter Counts */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <span className="text-slate-500 text-[10px]">Date Presets:</span>
                  <button
                    onClick={() => setSearchDateOrKeyword('2026-10-24')}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] transition ${
                      searchDateOrKeyword === '2026-10-24'
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setSearchDateOrKeyword('2026-10-23')}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] transition ${
                      searchDateOrKeyword === '2026-10-23'
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Yesterday
                  </button>
                  <button
                    onClick={() => setSearchDateOrKeyword('2026-10-22')}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] transition ${
                      searchDateOrKeyword === '2026-10-22'
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Oct 22
                  </button>
                  <button
                    onClick={() => setSearchDateOrKeyword('2026-10-21')}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] transition ${
                      searchDateOrKeyword === '2026-10-21'
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Oct 21
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <span>Showing <strong className="text-white">{filteredBiometrics.length}</strong> of {biometricLogs.length} attempts</span>
                  {(searchDateOrKeyword || statusCategoryFilter !== 'ALL' || modalityFilter !== 'ALL') && (
                    <button
                      onClick={() => {
                        setSearchDateOrKeyword('');
                        setStatusCategoryFilter('ALL');
                        setModalityFilter('ALL');
                      }}
                      className="text-cyan-400 hover:underline font-bold text-[10px]"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modality Chips & Export Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              {/* Modality Chips */}
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                <span className="text-slate-400 text-[11px] self-center mr-1">Modality:</span>
                {[
                  { id: 'ALL', label: 'All Modalities' },
                  { id: 'FACE_3D', label: 'Facial 3D' },
                  { id: 'OCR_ID', label: 'ID Card OCR' },
                  { id: 'VOICE_SPECTROGRAM', label: 'Voiceprint' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setModalityFilter(m.id as any)}
                    className={`px-2.5 py-1 rounded-xl text-xs transition ${
                      modalityFilter === m.id
                        ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Action and Simulation buttons */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Download Report Button */}
                <button
                  onClick={downloadBiometricReportCSV}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center space-x-1.5"
                  title="Export full biometric history ledger as a CSV file for regulatory compliance"
                >
                  <i className={`fa-solid ${downloadFeedback ? 'fa-check text-white' : 'fa-file-arrow-down'}`}></i>
                  <span>{downloadFeedback ? 'CSV Exported!' : 'Download Report'}</span>
                </button>

                <div className="flex items-center space-x-1">
                  <span className="text-slate-400 text-[10px] font-mono hidden lg:inline">Simulate:</span>
                  <button
                    onClick={() => handleSimulateQuickScan('FACE_3D')}
                    disabled={simulatingScan}
                    className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-teal-400 border border-slate-800 text-[10px] font-mono transition flex items-center space-x-1"
                    title="Simulate quick face scan attempt"
                  >
                    <i className="fa-solid fa-camera"></i>
                    <span>Face</span>
                  </button>
                  <button
                    onClick={() => handleSimulateQuickScan('OCR_ID')}
                    disabled={simulatingScan}
                    className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-blue-400 border border-slate-800 text-[10px] font-mono transition flex items-center space-x-1"
                    title="Simulate quick ID scan attempt"
                  >
                    <i className="fa-solid fa-id-card"></i>
                    <span>OCR</span>
                  </button>
                  <button
                    onClick={() => handleSimulateQuickScan('VOICE_SPECTROGRAM')}
                    disabled={simulatingScan}
                    className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-purple-400 border border-slate-800 text-[10px] font-mono transition flex items-center space-x-1"
                    title="Simulate quick voice scan attempt"
                  >
                    <i className="fa-solid fa-microphone"></i>
                    <span>Voice</span>
                  </button>
                  <button
                    onClick={() => handleSimulateQuickScan('VOICE_SPECTROGRAM', 'PENDING')}
                    disabled={simulatingScan}
                    className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-sky-400 border border-slate-800 text-[10px] font-mono transition flex items-center space-x-1"
                    title="Simulate queued pending audit event"
                  >
                    <i className="fa-solid fa-hourglass-start"></i>
                    <span>Pending</span>
                  </button>
                  <button
                    onClick={() => handleSimulateQuickScan('FACE_3D', 'REJECTED')}
                    disabled={simulatingScan}
                    className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-rose-400 border border-slate-800 text-[10px] font-mono transition flex items-center space-x-1"
                    title="Simulate failed security breach attempt"
                  >
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>Fail</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable List of Historical Verification Events */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 overflow-y-auto space-y-2.5 min-h-0">
              {filteredBiometrics.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono text-xs space-y-2">
                  <i className="fa-solid fa-filter-circle-xmark text-2xl text-slate-600 block"></i>
                  <div>No biometric verification attempts match your active filters or search date.</div>
                  <button
                    onClick={() => {
                      setSearchDateOrKeyword('');
                      setStatusCategoryFilter('ALL');
                      setModalityFilter('ALL');
                    }}
                    className="text-teal-400 hover:underline font-bold text-xs"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredBiometrics.map(entry => (
                  <div
                    key={entry.id}
                    className={`p-3.5 rounded-2xl bg-slate-900 border transition space-y-2 ${
                      entry.status === 'REJECTED'
                        ? 'border-rose-500/50 hover:border-rose-400'
                        : 'border-slate-800 hover:border-teal-500/40'
                    }`}
                  >
                    {/* Header line: Modality, Status, Timestamp */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sm shrink-0">
                          <i className={`fa-solid ${getModalityIcon(entry.modality)}`}></i>
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-2">
                            <span>{entry.modalityLabel}</span>
                            <span className="text-[10px] font-mono text-slate-400">({entry.subjectRollNo})</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            Subject: <strong className="text-slate-200">{entry.subjectName}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-center">
                        {getStatusBadge(entry.status)}
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                          entry.status === 'REJECTED'
                            ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                            : 'text-teal-400 bg-teal-500/10 border-teal-500/20'
                        }`}>
                          Score: {entry.confidenceScore}
                        </span>
                      </div>
                    </div>

                    {/* Notes line */}
                    <p className="text-xs text-slate-300 leading-relaxed font-sans pl-10">
                      {entry.notes}
                    </p>

                    {/* Metadata line: Timestamp & Cryptographic Hash */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 pl-10">
                      <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-clock text-slate-500"></i>
                        <span className="text-slate-300 font-bold">{entry.timestamp}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400">{entry.relativeTime}</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <i className="fa-solid fa-fingerprint text-slate-500"></i>
                        <span>Audit Hash:</span>
                        <span className="text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {entry.hash}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SYSTEM ACTIVITY STREAM (GLOBAL AUDIT TRAIL)        */}
        {/* ========================================================= */}
        {activeTab === 'system' && (
          <div className="flex-1 flex flex-col space-y-3 min-h-0">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1">
              <span>Streaming directly from <strong className="text-blue-400">security_audit.db</strong></span>
              <span className="text-emerald-400">Partition Health: 100% Intact</span>
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-slate-300 space-y-2 min-h-0">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-2 border-b border-slate-900 pb-1.5 last:border-0 hover:bg-slate-900/40 transition px-1 rounded">
                  <span className="text-blue-400 select-none font-bold">›</span>
                  <span className="leading-relaxed">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-[11px]">
            <span>SHA-256 Ledger Head:</span>
            <span className="text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-bold">
              9f82d1c...b04e2
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={downloadBiometricReportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
              title="Download Biometrics History CSV"
            >
              <i className={`fa-solid ${downloadFeedback ? 'fa-check text-white' : 'fa-file-arrow-down'}`}></i>
              <span>{downloadFeedback ? 'CSV Exported!' : 'Download Report'}</span>
            </button>

            {onOpenBiometrics && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBiometrics();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 font-bold border border-teal-500/30 transition text-xs flex items-center space-x-1.5"
              >
                <i className="fa-solid fa-fingerprint"></i>
                <span>Open Biometrics Scanner</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-bold"
            >
              Close Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
