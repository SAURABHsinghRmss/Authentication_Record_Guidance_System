import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Loader2, 
  Usb, 
  Sparkles,
  Lock
} from 'lucide-react';
import { UserRole } from '../../types';
import { 
  isWebAuthnSupported, 
  isPlatformAuthenticatorAvailable, 
  authenticateWithWebAuthn,
  getRegisteredPasskeys
} from '../../lib/webauthn';
import { useAuth } from '../../context/AuthContext';

interface WebAuthnModalProps {
  isOpen: boolean;
  role: UserRole;
  username: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const WebAuthnModal: React.FC<WebAuthnModalProps> = ({
  isOpen,
  role,
  username,
  onSuccess,
  onCancel
}) => {
  const { addAuditLog } = useAuth();
  const [checkingHardware, setCheckingHardware] = useState<boolean>(true);
  const [hardwareAvailable, setHardwareAvailable] = useState<boolean>(false);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Detecting biometric security modules...');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const registeredPasskeys = getRegisteredPasskeys(role);

  // Check hardware on modal open
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setError(null);
    setIsSuccess(false);
    setCheckingHardware(true);

    const check = async () => {
      const supported = isWebAuthnSupported();
      if (!supported) {
        if (mounted) {
          setHardwareAvailable(false);
          setCheckingHardware(false);
          setError('WebAuthn API is not supported by your current browser environment.');
          addAuditLog(`WEBAUTHN: Biometric authentication [FAILED] for user ${username} [Role: ${role.toUpperCase()}] - API unsupported`);
        }
        return;
      }

      const available = await isPlatformAuthenticatorAvailable();
      if (mounted) {
        setHardwareAvailable(available);
        setCheckingHardware(false);
        if (!available) {
          setError('Hardware Biometric Authenticator / FIDO2 security key not detected on this machine.');
          addAuditLog(`WEBAUTHN: Biometric authentication [FAILED] for user ${username} [Role: ${role.toUpperCase()}] - No biometric hardware`);
        } else {
          setStatusMessage('Platform biometric hardware (Windows Hello / Touch ID / FIDO2) detected.');
        }
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, [isOpen, role, username]);

  const handleVerify = async () => {
    setError(null);
    setAuthenticating(true);
    setStatusMessage('Please touch your fingerprint sensor or insert your FIDO2 security key...');

    const result = await authenticateWithWebAuthn(role, username);

    setAuthenticating(false);
    if (result.success) {
      setIsSuccess(true);
      setStatusMessage('Biometric identity confirmed. Sovereign clearance granted.');
      addAuditLog(`WEBAUTHN: Biometric authentication [SUCCESS] for user ${username} [Role: ${role.toUpperCase()}]`);
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      setError(result.error || 'Biometric authentication was declined or failed.');
      addAuditLog(`WEBAUTHN: Biometric authentication [FAILED] for user ${username} [Role: ${role.toUpperCase()}]`);
    }
  };

  if (!isOpen) return null;

  const roleTitle = role === 'admin' ? 'Super Administrator' : 'Institute Governance Head';
  const roleBadgeColor = role === 'admin' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-purple-500/20 text-purple-300 border-purple-500/40';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />

        <div className="p-6">
          {/* Top Bar with Cancel */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Fingerprint className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  FIDO2 Biometric Challenge
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono uppercase tracking-wider">
                    Tier-1 Mandatory
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Hardware token verification via WebAuthn API</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Cancel Authentication"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User & Role Badge */}
          <div className="mt-4 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Target Credential</div>
              <div className="text-sm font-semibold text-white font-mono">{username}</div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${roleBadgeColor}`}>
              {roleTitle}
            </span>
          </div>

          {/* Sensor Visualizer Box */}
          <div className="my-6 p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Radar Rings Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-48 h-48 border border-cyan-500/40 rounded-full animate-ping" />
              <div className="absolute w-32 h-32 border border-indigo-500/50 rounded-full" />
            </div>

            {/* Status Icon */}
            <div className="relative mb-3">
              {isSuccess ? (
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 animate-in zoom-in-75 duration-300">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              ) : error ? (
                <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-10 h-10" />
                </div>
              ) : authenticating ? (
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 animate-pulse">
                  <Fingerprint className="w-10 h-10 animate-bounce" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-cyan-400 hover:border-cyan-500 transition-colors">
                  <Fingerprint className="w-10 h-10" />
                </div>
              )}
            </div>

            {/* Dynamic Status Text */}
            <p className="text-sm font-medium text-center text-slate-200">
              {isSuccess ? 'Verification Completed' : authenticating ? 'Awaiting Sensor Touch...' : 'Biometric Security Required'}
            </p>
            <p className="text-xs text-slate-400 text-center max-w-sm mt-1">
              {statusMessage}
            </p>

            {/* Hardware Status Indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs">
              {checkingHardware ? (
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  Checking platform biometric TPM / Secure Enclave...
                </span>
              ) : hardwareAvailable ? (
                <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Hardware Authenticator Ready ({registeredPasskeys.length} Registered Passkey{registeredPasskeys.length > 1 ? 's' : ''})
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  No Platform Authenticator Available
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Authentication Blocked</p>
                <p className="mt-0.5 text-rose-300/90">{error}</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  High-security roles require FIDO2 biometric confirmation. Passwords alone cannot grant portal access.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              Cancel Login
            </button>

            <button
              onClick={handleVerify}
              disabled={checkingHardware || authenticating || isSuccess}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition duration-200 ${
                isSuccess
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white hover:shadow-cyan-500/25'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {authenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning Sensor...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Authenticated
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  Trigger WebAuthn
                </>
              )}
            </button>
          </div>

          {/* Footnote */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              W3C WebAuthn / FIDO2 Level 2 Compliant
            </span>
            <span className="font-mono text-slate-400">Sovereign APAAR Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
};
