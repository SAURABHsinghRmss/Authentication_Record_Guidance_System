import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BiometricModality, BiometricStatus, BiometricLogEntry } from '../../types';

export const AuditLogsModal: React.FC<{ isOpen: boolean; onClose: () => void; onOpenBiometrics?: () => void }> = ({
  isOpen,
  onClose,
  onOpenBiometrics
}) => {
  const { auditLogs, biometricLogs, recordBiometricAttempt, toggleFlagBiometricLog, currentRole, currentUser, firebaseUser } = useAuth();
  const isAdmin = currentRole === 'admin' || currentUser?.role === 'admin' || currentUser?.email === 'ssrmsr06@gmail.com' || firebaseUser?.email === 'ssrmsr06@gmail.com';

  const [activeTab, setActiveTab] = useState<'biometrics' | 'flagged' | 'system'>('biometrics');
  const [modalityFilter, setModalityFilter] = useState<'ALL' | BiometricModality>('ALL');
  const [statusCategoryFilter, setStatusCategoryFilter] = useState<'ALL' | 'SUCCESS' | 'FAILURE' | 'PENDING'>('ALL');
  const [searchDateOrKeyword, setSearchDateOrKeyword] = useState('');
  const [simulatingScan, setSimulatingScan] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);

  // Flagging Feature State
  const [flagModalTarget, setFlagModalTarget] = useState<BiometricLogEntry | null>(null);
  const [flagReasonInput, setFlagReasonInput] = useState('');
  const [flagPresetSelected, setFlagPresetSelected] = useState<string>('');
  const [flagFeedbackToast, setFlagFeedbackToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [flagSearchQuery, setFlagSearchQuery] = useState('');
  const [flagModalityFilter, setFlagModalityFilter] = useState<'ALL' | BiometricModality>('ALL');
  const [flaggedDownloadFeedback, setFlaggedDownloadFeedback] = useState(false);

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

  const FLAG_PRESET_REASONS = [
    'Critical Spoof Artifact (Non-liveness/IR signature failed)',
    'Sub-Threshold Illumination & Optical Lux Discrepancy',
    'Identity Verification Mismatch / Proxy Examination Attempt',
    'Acoustic Spectrogram Harmonic Anomaly',
    'Manual Administrative & Statutory Compliance Escalation'
  ];

  const handleOpenFlagModal = (entry: BiometricLogEntry) => {
    setFlagModalTarget(entry);
    setFlagPresetSelected('');
    setFlagReasonInput(entry.flagReason || '');
  };

  const handleConfirmFlagModal = async () => {
    if (!flagModalTarget) return;
    const finalReason = flagReasonInput.trim() || flagPresetSelected || 'Administrative manual audit required.';
    await toggleFlagBiometricLog(flagModalTarget.id, finalReason);
    setFlagModalTarget(null);
    setFlagReasonInput('');
    setFlagPresetSelected('');
    setFlagFeedbackToast({
      message: `Verification entry [${flagModalTarget.id}] flagged for manual review.`,
      type: 'success'
    });
    setTimeout(() => setFlagFeedbackToast(null), 3500);
  };

  const handleQuickUnflag = async (entry: BiometricLogEntry) => {
    await toggleFlagBiometricLog(entry.id);
    setFlagFeedbackToast({
      message: `Flag on verification [${entry.id}] resolved and removed.`,
      type: 'info'
    });
    setTimeout(() => setFlagFeedbackToast(null), 3500);
  };

  const downloadFlaggedReportCSV = () => {
    const headers = [
      'Event ID',
      'Timestamp (UTC+5:30)',
      'Modality Code',
      'Modality Description',
      'Subject Roll Number',
      'Subject Full Name',
      'Verification Status',
      'Confidence Score',
      'Flagged Status',
      'Flagged Reason',
      'Flagged By Reviewer',
      'Flagged Timestamp',
      'Audit SHA-256 Hash'
    ];

    const escapeCsvField = (field: string) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const flaggedList = biometricLogs.filter(b => b.isFlagged);
    const rows = flaggedList.map(entry => [
      entry.id,
      entry.timestamp,
      entry.modality,
      entry.modalityLabel,
      entry.subjectRollNo,
      entry.subjectName,
      entry.status,
      entry.confidenceScore,
      'FLAGGED_FOR_MANUAL_REVIEW',
      entry.flagReason || 'N/A',
      entry.flaggedBy || 'Sovereign Admin',
      entry.flaggedAt || 'N/A',
      entry.hash
    ].map(val => escapeCsvField(String(val || ''))).join(','));

    const csvContent = [
      `# EduIdentityAI Flagged Biometrics Compliance Docket`,
      `# Generated: ${new Date().toISOString()}`,
      `# Authority: AICTE Grievance & Sovereign Security Bureau`,
      `# Total Flagged Records: ${flaggedList.length}`,
      headers.join(','),
      ...rows
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `EduIdentityAI_Flagged_Biometric_Incidents_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setFlaggedDownloadFeedback(true);
    setTimeout(() => setFlaggedDownloadFeedback(false), 4000);
  };

  const flaggedLogs = biometricLogs.filter(b => b.isFlagged);
  const filteredFlaggedLogs = flaggedLogs.filter(entry => {
    if (flagModalityFilter !== 'ALL' && entry.modality !== flagModalityFilter) return false;
    if (flagSearchQuery.trim()) {
      const q = flagSearchQuery.toLowerCase();
      const matchSubject = entry.subjectName.toLowerCase().includes(q) || entry.subjectRollNo.toLowerCase().includes(q);
      const matchReason = (entry.flagReason || '').toLowerCase().includes(q);
      const matchFlagger = (entry.flaggedBy || '').toLowerCase().includes(q);
      const matchModality = entry.modalityLabel.toLowerCase().includes(q);
      const matchHash = entry.hash.toLowerCase().includes(q);
      if (!matchSubject && !matchReason && !matchFlagger && !matchModality && !matchHash) return false;
    }
    return true;
  });


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

        {/* Flag Action Feedback Toast */}
        {flagFeedbackToast && (
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-lg shadow-emerald-950/30 animate-in fade-in">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-circle-check text-emerald-400"></i>
              <span>{flagFeedbackToast.message}</span>
            </div>
            <button onClick={() => setFlagFeedbackToast(null)} className="text-emerald-400 hover:text-white p-1">
              <i className="fa-solid fa-xmark text-xs"></i>
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
              onClick={() => setActiveTab('flagged')}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 ${
                activeTab === 'flagged'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <i className={`fa-solid fa-flag ${flaggedLogs.length > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}></i>
              <span>Flagged Items</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'flagged'
                  ? 'bg-white/20 text-white'
                  : flaggedLogs.length > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {flaggedLogs.length}
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
                    className={`p-3.5 rounded-2xl bg-slate-900 border transition space-y-2.5 ${
                      entry.isFlagged
                        ? 'border-amber-500/70 bg-gradient-to-r from-amber-950/25 via-slate-900 to-slate-900 shadow-md shadow-amber-950/30'
                        : entry.status === 'REJECTED'
                        ? 'border-rose-500/50 hover:border-rose-400'
                        : 'border-slate-800 hover:border-teal-500/40'
                    }`}
                  >
                    {/* Header line: Modality, Status, Timestamp */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-xl bg-slate-950 border flex items-center justify-center text-sm shrink-0 ${
                          entry.isFlagged ? 'border-amber-500/50 text-amber-400' : 'border-slate-800'
                        }`}>
                          <i className={`fa-solid ${getModalityIcon(entry.modality)}`}></i>
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-2">
                            <span>{entry.modalityLabel}</span>
                            <span className="text-[10px] font-mono text-slate-400">({entry.subjectRollNo})</span>
                            {entry.isFlagged && (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                                <i className="fa-solid fa-flag text-[8px]"></i>
                                <span>FLAGGED</span>
                              </span>
                            )}
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

                        {/* Admin Flag Action Button */}
                        {entry.isFlagged ? (
                          <button
                            type="button"
                            onClick={() => handleQuickUnflag(entry)}
                            disabled={!isAdmin}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition flex items-center space-x-1 border ${
                              isAdmin
                                ? 'bg-amber-500/20 hover:bg-emerald-500/20 text-amber-300 hover:text-emerald-300 border-amber-500/40 hover:border-emerald-500/40 cursor-pointer shadow-sm'
                                : 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed'
                            }`}
                            title={isAdmin ? "Resolve investigation and clear flag" : "Admin credentials required to clear flags"}
                          >
                            <i className="fa-solid fa-flag text-amber-400 text-[9px]"></i>
                            <span>{isAdmin ? 'Resolve Flag' : 'Flagged'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenFlagModal(entry)}
                            disabled={!isAdmin}
                            className={`px-2 py-1 rounded-xl text-[10px] font-mono transition flex items-center space-x-1 border ${
                              isAdmin
                                ? 'bg-slate-950 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border-slate-800 hover:border-amber-500/40 cursor-pointer'
                                : 'bg-slate-950 text-slate-600 border-slate-800/60 cursor-not-allowed opacity-60'
                            }`}
                            title={isAdmin ? "Flag this biometric log for manual administrative review" : "Admin credentials required to flag records"}
                          >
                            <i className="fa-regular fa-flag text-[9px]"></i>
                            <span>Flag</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Flagged Visual Indicator Dossier Banner */}
                    {entry.isFlagged && (
                      <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono text-amber-400 border-b border-amber-500/20 pb-1">
                          <span className="flex items-center space-x-1 font-bold">
                            <i className="fa-solid fa-triangle-exclamation text-amber-400"></i>
                            <span>UNDER ADMINISTRATIVE AUDIT REVIEW</span>
                          </span>
                          <span className="text-slate-400">
                            Flagged by: <strong className="text-amber-300">{entry.flaggedBy || 'Sovereign Admin'}</strong> {entry.flaggedAt ? `(${entry.flaggedAt})` : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 font-sans leading-relaxed">
                          <strong className="text-amber-300 font-mono text-[10px]">Review Note: </strong>
                          {entry.flagReason || 'Requires physical sensor corroboration and registrar authorization.'}
                        </p>
                      </div>
                    )}

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
        {/* TAB 2: FLAGGED ITEMS FOR MANUAL REVIEW (ADMIN WORKSPACE)   */}
        {/* ========================================================= */}
        {activeTab === 'flagged' && (
          <div className="flex-1 flex flex-col space-y-3 min-h-0">
            {/* Regulatory Queue Notice & Admin Access Info */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-950 to-slate-950 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-amber-950/20">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <i className="fa-solid fa-flag text-base animate-pulse"></i>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider">
                      AICTE Sovereign Biometric Review Queue
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Level-2 Human Audit
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans mt-0.5">
                    Flagged attempts hold student attendance and credential issuance until an authorized admin audits physical sensor logs and clears or escalates the discrepancy.
                  </p>
                </div>
              </div>

              {/* Download Flagged CSV */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={downloadFlaggedReportCSV}
                  disabled={flaggedLogs.length === 0}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 shadow-md ${
                    flaggedLogs.length > 0
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                  title="Export flagged incident records for regulatory AICTE compliance"
                >
                  <i className={`fa-solid ${flaggedDownloadFeedback ? 'fa-check text-white' : 'fa-file-csv'}`}></i>
                  <span>{flaggedDownloadFeedback ? 'Docket Exported!' : 'Export Flagged Docket'}</span>
                </button>
              </div>
            </div>

            {/* KPI Summary for Flagged Items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/40">
                <span className="text-[10px] text-amber-400 font-mono block">Active Review Queue</span>
                <span className="text-xl font-extrabold text-amber-300 font-mono mt-0.5 block">{flaggedLogs.length}</span>
                <span className="text-[10px] text-slate-400 font-mono">Requires decision</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-rose-400 font-mono block">Critical Spoofs</span>
                <span className="text-xl font-extrabold text-rose-400 font-mono mt-0.5 block">
                  {flaggedLogs.filter(f => f.status === 'REJECTED').length}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">IR / Non-liveness failure</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-amber-400 font-mono block">2FA Challenges</span>
                <span className="text-xl font-extrabold text-amber-400 font-mono mt-0.5 block">
                  {flaggedLogs.filter(f => f.status === 'CHALLENGE_REQUIRED').length}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Lux/sensor discrepancy</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-sky-400 font-mono block">Pending Dual-Corroboration</span>
                <span className="text-xl font-extrabold text-sky-400 font-mono mt-0.5 block">
                  {flaggedLogs.filter(f => f.status === 'PENDING').length}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Awaiting second factor</span>
              </div>
            </div>

            {/* Flagged Items Search & Modality Filter */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs font-mono">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-500 text-xs"></i>
                <input
                  type="text"
                  value={flagSearchQuery}
                  onChange={e => setFlagSearchQuery(e.target.value)}
                  placeholder="Filter flagged queue by subject, roll no, reviewer, or reason..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
                {flagSearchQuery && (
                  <button
                    onClick={() => setFlagSearchQuery('')}
                    className="absolute right-3 top-2 text-slate-400 hover:text-white"
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                )}
              </div>

              {/* Modality Chips */}
              <div className="flex items-center space-x-1.5 shrink-0 overflow-x-auto">
                <span className="text-slate-500 text-[10px]">Modality:</span>
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'FACE_3D', label: 'Face' },
                  { id: 'OCR_ID', label: 'OCR' },
                  { id: 'VOICE_SPECTROGRAM', label: 'Voice' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setFlagModalityFilter(m.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] transition ${
                      flagModalityFilter === m.id
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flagged Items Scrollable List */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 overflow-y-auto space-y-3 min-h-0">
              {filteredFlaggedLogs.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white text-sm font-bold font-mono">Review Queue Clear</h4>
                    <p className="text-slate-400 text-xs font-mono max-w-md mx-auto">
                      {flagSearchQuery || flagModalityFilter !== 'ALL'
                        ? 'No flagged records match your current search query or modality filter.'
                        : 'No biometric verification logs are currently flagged for review. You can flag suspicious or challenged scans from the Biometric Scan History tab.'}
                    </p>
                  </div>
                  {(flagSearchQuery || flagModalityFilter !== 'ALL') ? (
                    <button
                      onClick={() => { setFlagSearchQuery(''); setFlagModalityFilter('ALL'); }}
                      className="text-amber-400 hover:underline text-xs font-mono font-bold"
                    >
                      Clear search filters
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('biometrics')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-400 border border-slate-800 text-xs font-mono font-bold transition inline-flex items-center space-x-1.5"
                    >
                      <i className="fa-solid fa-fingerprint"></i>
                      <span>Inspect Biometric Ledger</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredFlaggedLogs.map(entry => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-slate-900 border-2 border-amber-500/50 hover:border-amber-400/80 transition space-y-3 shadow-lg shadow-amber-950/20"
                  >
                    {/* Top Row: Modality, Status, RollNo, Confidence */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-950 border border-amber-500/40 flex items-center justify-center text-amber-400 text-sm shrink-0">
                          <i className={`fa-solid ${getModalityIcon(entry.modality)}`}></i>
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-2">
                            <span>{entry.modalityLabel}</span>
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {entry.subjectRollNo}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-300">
                            Student: <strong className="text-white">{entry.subjectName}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-center">
                        {getStatusBadge(entry.status)}
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                          entry.status === 'REJECTED'
                            ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        }`}>
                          Score: {entry.confidenceScore}
                        </span>
                      </div>
                    </div>

                    {/* Prominent Flag Review Callout Box */}
                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold border-b border-amber-500/20 pb-1">
                        <span className="flex items-center space-x-1.5">
                          <i className="fa-solid fa-triangle-exclamation text-amber-400"></i>
                          <span>ADMINISTRATIVE REVIEW DOSSIER</span>
                        </span>
                        <span>Flagged: {entry.flaggedAt || 'Recently'}</span>
                      </div>
                      <p className="text-xs text-slate-100 font-sans leading-relaxed">
                        <strong className="text-amber-300 font-mono text-[11px]">Reason: </strong>
                        {entry.flagReason || 'Requires manual biometric sensor corroboration and registry sign-off.'}
                      </p>
                      <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-0.5">
                        <span>Reviewer Authority: <strong className="text-amber-300">{entry.flaggedBy || 'System Administrator'}</strong></span>
                        <span className="text-slate-500">Action: Holds Attendance &amp; ABC Credit Token</span>
                      </div>
                    </div>

                    {/* Sensor / Raw Log Notes */}
                    <div className="text-xs text-slate-400 font-mono bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Original Device Telemetry Note:</div>
                      <div className="text-slate-300 font-sans">{entry.notes}</div>
                    </div>

                    {/* Card Footer: Metadata and Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                      <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-clock text-slate-500"></i>
                        <span className="text-slate-300 font-bold">{entry.timestamp}</span>
                        <span className="text-slate-600">·</span>
                        <span>{entry.relativeTime}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {entry.hash}
                        </span>
                      </div>

                      {/* Admin Resolution Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenFlagModal(entry)}
                          disabled={!isAdmin}
                          className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1 ${
                            isAdmin
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                              : 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed'
                          }`}
                          title={isAdmin ? "Edit review reason note" : "Admin privileges required"}
                        >
                          <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                          <span>Edit Note</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickUnflag(entry)}
                          disabled={!isAdmin}
                          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 shadow-md ${
                            isAdmin
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 cursor-pointer'
                              : 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed'
                          }`}
                          title={isAdmin ? "Mark manual review resolved and release token" : "Admin credentials required to clear flags"}
                        >
                          <i className="fa-solid fa-check text-[11px]"></i>
                          <span>Resolve &amp; Clear Flag</span>
                        </button>
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

      {/* ========================================================= */}
      {/* ADMIN FLAG DIALOG MODAL (Reason & Category Picker)        */}
      {/* ========================================================= */}
      {flagModalTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <i className="fa-solid fa-flag text-sm"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    {flagModalTarget.isFlagged ? 'Update Biometric Review Dossier' : 'Flag Biometric Log for Manual Review'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Log ID: {flagModalTarget.id} · {flagModalTarget.subjectName} ({flagModalTarget.subjectRollNo})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFlagModalTarget(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Target Summary Snapshot */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <i className={`fa-solid ${getModalityIcon(flagModalTarget.modality)} text-sm`}></i>
                <div>
                  <div className="font-bold text-white">{flagModalTarget.modalityLabel}</div>
                  <div className="text-[10px] text-slate-400">{flagModalTarget.timestamp}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-amber-400">{flagModalTarget.status}</div>
                <div className="text-[10px] text-slate-400">Score: {flagModalTarget.confidenceScore}</div>
              </div>
            </div>

            {/* Preset Reason Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-amber-400 block">
                Select Quick Compliance Finding:
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {FLAG_PRESET_REASONS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFlagPresetSelected(preset);
                      setFlagReasonInput(preset);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs font-sans transition flex items-center space-x-2 border ${
                      flagReasonInput === preset || flagPresetSelected === preset
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 font-medium'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <i className={`fa-solid ${flagReasonInput === preset ? 'fa-circle-check text-amber-400' : 'fa-circle text-slate-600'} text-[10px]`}></i>
                    <span className="truncate">{preset}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Reason Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 block">
                Administrative Review Note &amp; Audit Instructions:
              </label>
              <textarea
                value={flagReasonInput}
                onChange={e => setFlagReasonInput(e.target.value)}
                placeholder="Specify forensic observations, sensor calibration flags, or student interview directives..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setFlagModalTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmFlagModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-mono font-bold shadow-lg shadow-amber-600/30 transition flex items-center space-x-1.5"
              >
                <i className="fa-solid fa-flag"></i>
                <span>{flagModalTarget.isFlagged ? 'Update Flag Dossier' : 'Confirm & Flag Record'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
