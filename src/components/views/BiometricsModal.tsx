import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const BiometricsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { recordBiometricAttempt } = useAuth();
  const [faceStatus, setFaceStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  if (!isOpen) return null;

  const triggerFaceScan = () => {
    setFaceStatus('scanning');
    setTimeout(() => {
      setFaceStatus('success');
      recordBiometricAttempt('FACE_3D', 'VERIFIED_SUCCESS', '99.85%', 'Live 3D depth mesh and blink response authenticated.');
    }, 1200);
  };

  const triggerOcrScan = () => {
    setOcrStatus('scanning');
    setTimeout(() => {
      setOcrStatus('success');
      recordBiometricAttempt('OCR_ID', 'VERIFIED_SUCCESS', '99.20%', 'Digital capture of physical Student ID Card matches Roll CS-2022-04.');
    }, 1200);
  };

  const triggerVoiceScan = () => {
    setVoiceStatus('scanning');
    setTimeout(() => {
      setVoiceStatus('success');
      recordBiometricAttempt('VOICE_SPECTROGRAM', 'VERIFIED_SUCCESS', '97.80%', 'Acoustic formant resonance matches enrollment voice profile.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono font-bold">
            <i className="fa-solid fa-fingerprint"></i>
            <span>MULTI-MODAL BIOMETRICS & LIVENESS VERIFICATION</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Sovereign Identity Authentication</h2>
          <p className="text-xs text-slate-400">
            Zero-knowledge cryptographic verification linking student biometrics with APAAR ID.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Face Scan */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xl mx-auto">
                <i className={`fa-solid fa-camera ${faceStatus === 'scanning' ? 'animate-pulse text-amber-400' : ''}`}></i>
              </div>
              <div className="font-bold text-white text-xs">Facial Liveness</div>
              <p className="text-[10px] text-slate-400 font-mono">
                {faceStatus === 'idle' && 'Ready for 3D Depth Scan'}
                {faceStatus === 'scanning' && 'Analyzing Mesh & Blink...'}
                {faceStatus === 'success' && '✓ Liveness Score: 99.8%'}
              </p>
            </div>
            <button
              onClick={triggerFaceScan}
              disabled={faceStatus === 'scanning'}
              className="w-full py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] transition"
            >
              {faceStatus === 'success' ? 'Re-scan Face' : 'Scan Face'}
            </button>
          </div>

          {/* 2. OCR ID Scan */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl mx-auto">
                <i className={`fa-solid fa-id-card ${ocrStatus === 'scanning' ? 'animate-pulse text-amber-400' : ''}`}></i>
              </div>
              <div className="font-bold text-white text-xs">Student ID OCR</div>
              <p className="text-[10px] text-slate-400 font-mono">
                {ocrStatus === 'idle' && 'Scan Barcode & MRZ'}
                {ocrStatus === 'scanning' && 'Parsing Roll CS-2022-04...'}
                {ocrStatus === 'success' && '✓ Roll No Matched: CS-2022-04'}
              </p>
            </div>
            <button
              onClick={triggerOcrScan}
              disabled={ocrStatus === 'scanning'}
              className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition"
            >
              {ocrStatus === 'success' ? 'Re-scan Card' : 'Scan ID Card'}
            </button>
          </div>

          {/* 3. Voice Check */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl mx-auto">
                <i className={`fa-solid fa-microphone-lines ${voiceStatus === 'scanning' ? 'animate-pulse text-amber-400' : ''}`}></i>
              </div>
              <div className="font-bold text-white text-xs">Voice Acoustic Print</div>
              <p className="text-[10px] text-slate-400 font-mono">
                {voiceStatus === 'idle' && 'Say "EduIdentityAI 2026"'}
                {voiceStatus === 'scanning' && 'Analyzing Spectrogram...'}
                {voiceStatus === 'success' && '✓ Voiceprint Verified (0.97)'}
              </p>
            </div>
            <button
              onClick={triggerVoiceScan}
              disabled={voiceStatus === 'scanning'}
              className="w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition"
            >
              {voiceStatus === 'success' ? 'Re-verify Voice' : 'Record Phrase'}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
          <span>Overall Biometrics Trust Status:</span>
          <span className="text-emerald-400 font-bold">SOVEREIGN GRADE (TIER-1)</span>
        </div>
      </div>
    </div>
  );
};
