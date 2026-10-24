import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  Key, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  RefreshCw, 
  Smartphone,
  Laptop,
  Usb,
  Lock
} from 'lucide-react';
import { UserRole } from '../../types';
import { 
  RegisteredPasskey,
  getRegisteredPasskeys, 
  deleteRegisteredPasskey, 
  registerWebAuthnCredential, 
  authenticateWithWebAuthn,
  isPlatformAuthenticatorAvailable,
  isWebAuthnSupported
} from '../../lib/webauthn';
import { useAuth } from '../../context/AuthContext';

interface PasskeyManagementViewProps {
  role: UserRole;
  accentColor?: 'teal' | 'rose' | 'blue';
}

export const PasskeyManagementView: React.FC<PasskeyManagementViewProps> = ({
  role,
  accentColor = 'teal'
}) => {
  const { currentUser, addAuditLog } = useAuth();
  const [passkeys, setPasskeys] = useState<RegisteredPasskey[]>([]);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isPlatformAvailable, setIsPlatformAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Enrollment form state
  const [showEnrollModal, setShowEnrollModal] = useState<boolean>(false);
  const [passkeyName, setPasskeyName] = useState<string>('');
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null);

  // Test state
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  const reloadPasskeys = () => {
    const list = getRegisteredPasskeys(role);
    setPasskeys(list);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const supported = isWebAuthnSupported();
      setIsSupported(supported);
      if (supported) {
        const available = await isPlatformAuthenticatorAvailable();
        setIsPlatformAvailable(available);
      }
      reloadPasskeys();
      setLoading(false);
    };
    init();
  }, [role]);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyName.trim()) {
      setEnrollError('Please provide a label for this security credential');
      return;
    }

    setEnrollError(null);
    setEnrollSuccess(null);
    setIsEnrolling(true);

    const username = currentUser.username || `${role}_user`;
    const displayName = currentUser.name || `${role.toUpperCase()} Authority`;

    const result = await registerWebAuthnCredential(username, displayName, role, passkeyName.trim());
    setIsEnrolling(false);

    if (result.success && result.passkey) {
      setEnrollSuccess(`Passkey "${passkeyName}" successfully registered to device TPM / Secure Enclave.`);
      addAuditLog(`WEBAUTHN: New biometric passkey [${passkeyName}] registered for user ${username} [Role: ${role.toUpperCase()}].`);
      reloadPasskeys();
      setPasskeyName('');
      setTimeout(() => {
        setShowEnrollModal(false);
        setEnrollSuccess(null);
      }, 1500);
    } else {
      setEnrollError(result.error || 'Failed to enroll biometric passkey.');
      addAuditLog(`WEBAUTHN: Biometric enrollment failed for user ${username} [Role: ${role.toUpperCase()}].`);
    }
  };

  const handleDelete = (pk: RegisteredPasskey) => {
    if (passkeys.length <= 1) {
      if (!confirm(`Warning: This is the only registered passkey for this role. If deleted, you must enroll a new one before logging in again. Continue?`)) {
        return;
      }
    } else {
      if (!confirm(`Revoke and remove passkey "${pk.name}"?`)) {
        return;
      }
    }

    deleteRegisteredPasskey(pk.id);
    addAuditLog(`WEBAUTHN: Passkey [${pk.name}] revoked for user ${currentUser.username} [Role: ${role.toUpperCase()}].`);
    reloadPasskeys();
  };

  const handleTestPasskey = async (pk: RegisteredPasskey) => {
    setTestingId(pk.id);
    setTestResult(null);

    const result = await authenticateWithWebAuthn(role, currentUser.username);
    setTestingId(null);

    if (result.success) {
      setTestResult({
        id: pk.id,
        success: true,
        message: 'Biometric challenge succeeded. Hardware token confirmed valid.'
      });
      addAuditLog(`WEBAUTHN: Biometric test verification [SUCCESS] for passkey ${pk.name}`);
      reloadPasskeys();
    } else {
      setTestResult({
        id: pk.id,
        success: false,
        message: result.error || 'Hardware verification failed.'
      });
      addAuditLog(`WEBAUTHN: Biometric test verification [FAILED] for passkey ${pk.name}`);
    }

    setTimeout(() => {
      setTestResult(null);
    }, 4500);
  };

  const colorStyles = {
    teal: {
      accent: 'text-teal-400',
      badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      btn: 'bg-teal-600 hover:bg-teal-500 text-white',
      border: 'border-teal-500/30'
    },
    rose: {
      accent: 'text-rose-400',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      btn: 'bg-rose-600 hover:bg-rose-500 text-white',
      border: 'border-rose-500/30'
    },
    blue: {
      accent: 'text-blue-400',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      btn: 'bg-blue-600 hover:bg-blue-500 text-white',
      border: 'border-blue-500/30'
    }
  }[accentColor];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl bg-slate-950 border ${colorStyles.border} flex items-center justify-center ${colorStyles.accent}`}>
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">
                  FIDO2 / WebAuthn Hardware Passkey Vault
                </h2>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-mono font-bold ${colorStyles.badge}`}>
                  Mandatory Enforced
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Zero-Trust cryptographic authentication backed by Windows Hello, Apple Touch ID/Face ID, or FIDO2 YubiKeys.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEnrollModal(true)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg transition ${colorStyles.btn} shrink-0`}
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Passkey</span>
          </button>
        </div>

        {/* Hardware Status Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSupported ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">WebAuthn API Support</div>
              <div className="font-semibold text-white">
                {isSupported ? 'Supported (W3C Level 2)' : 'Unsupported in Browser'}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPlatformAvailable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">Platform TPM / Sensor</div>
              <div className="font-semibold text-white">
                {isPlatformAvailable ? 'Hardware Sensor Active' : 'No Platform TPM Detected'}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">Registered Credentials</div>
              <div className="font-semibold text-white font-mono">
                {passkeys.length} Active Key{passkeys.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Passkeys List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>Enrolled Cryptographic Authenticators</span>
            <span className="text-xs font-mono text-slate-500">({passkeys.length})</span>
          </div>
          <button
            onClick={reloadPasskeys}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {passkeys.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">No Passkeys Enrolled</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              High-security roles require at least one registered biometric passkey to log in. Click &quot;Enroll New Passkey&quot; to register your fingerprint or security token.
            </p>
            <button
              onClick={() => setShowEnrollModal(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${colorStyles.btn}`}
            >
              Enroll Passkey Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passkeys.map(pk => {
              const isTesting = testingId === pk.id;
              const testInfo = testResult?.id === pk.id ? testResult : null;

              return (
                <div 
                  key={pk.id} 
                  className="p-5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-3 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${colorStyles.accent}`}>
                          <Fingerprint className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{pk.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Modality: <span className="text-slate-300 font-semibold">{pk.modality}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                        ACTIVE
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 font-mono text-[10px] text-slate-400">
                      <div>
                        <span className="text-slate-500 block">Credential ID:</span>
                        <span className="text-slate-300 truncate block font-mono" title={pk.id}>
                          {pk.id.slice(0, 16)}...
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Enrolled Date:</span>
                        <span className="text-slate-300 block">
                          {new Date(pk.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Algorithm:</span>
                        <span className="text-cyan-400 block">{pk.algorithm}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Sign Counter:</span>
                        <span className="text-amber-400 font-bold block">{pk.counter} authentications</span>
                      </div>
                    </div>
                  </div>

                  {/* Test Feedback */}
                  {testInfo && (
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      testInfo.success 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}>
                      {testInfo.success ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      )}
                      <span className="text-[11px] leading-tight">{testInfo.message}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-900">
                    <button
                      onClick={() => handleTestPasskey(pk)}
                      disabled={isTesting}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                          <span>Waiting for sensor...</span>
                        </>
                      ) : (
                        <>
                          <Fingerprint className="w-3.5 h-3.5" />
                          <span>Test Sensor</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(pk)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800/60 transition"
                      title="Revoke passkey"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Security Invariants Box */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2 text-slate-200 font-bold font-sans">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>FIDO2 WebAuthn Architecture &amp; Cryptographic Specifications</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-[11px]">
          <div>
            <span className="text-slate-500 block">Relying Party:</span>
            <span className="text-white">EduIdentityAI Sovereign Core</span>
          </div>
          <div>
            <span className="text-slate-500 block">User Verification:</span>
            <span className="text-amber-400 font-bold">Strictly Required</span>
          </div>
          <div>
            <span className="text-slate-500 block">Authenticator Attachment:</span>
            <span className="text-teal-400">Platform / Cross-Platform</span>
          </div>
          <div>
            <span className="text-slate-500 block">Private Key Storage:</span>
            <span className="text-white">Device Secure Enclave / TPM</span>
          </div>
        </div>
      </div>

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-xl bg-slate-950 border ${colorStyles.border} flex items-center justify-center ${colorStyles.accent}`}>
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Enroll New Passkey</h3>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnroll} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Passkey Friendly Name
                </label>
                <input
                  type="text"
                  value={passkeyName}
                  onChange={e => setPasskeyName(e.target.value)}
                  placeholder="e.g. MacBook Pro TouchID, Office YubiKey, Pixel 8"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Choose a memorable name to identify this physical authenticator.
                </p>
              </div>

              {enrollError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{enrollError}</span>
                </div>
              )}

              {enrollSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{enrollSuccess}</span>
                </div>
              )}

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">What happens next:</div>
                <p>
                  Your browser will open a system prompt asking to verify your fingerprint, face, or security key. A public key will be created on this device.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEnrolling}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${colorStyles.btn} disabled:opacity-50`}
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Waiting for Sensor...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      <span>Trigger Sensor Enrollment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
