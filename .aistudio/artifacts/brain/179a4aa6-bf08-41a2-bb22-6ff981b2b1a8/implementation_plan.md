# Biometric Scan Event Tracking & AuditLogsModal Enhancement

Enhance the `AuditLogsModal` component with a dedicated biometric audit verification ledger that tracks and lists historical and live multimodal biometric verification attempts (Face Liveness, OCR Student ID, and Acoustic Voiceprint), complete with timestamps, verification status, confidence scores, and real-time state synchronization with the Biometrics scanning tool.

## User Review & Critical Decisions

> [!IMPORTANT]
> The biometric audit ledger will feature a segmented tabbed interface inside `AuditLogsModal` ("Biometric Verification Ledger" and "System Security Stream"). Live scans executed in the Biometrics Modal will automatically dispatch new immutable audit records to `AuthContext`, immediately updating the audit view with verified timestamps, status badges, and SHA-256 cryptographic hashes.

- **Confirmed Decision 1**: Provide a dedicated segmented tab inside `AuditLogsModal` so users can switch seamlessly between the granular Biometric Scan Events Ledger and the overall System Security Activity Stream.
- **Confirmed Decision 2**: Display timestamps, modality type (Face, OCR, Voice), verification status (`VERIFIED_SUCCESS` / `CHALLENGE_REQUIRED`), student identity reference (`CS-2022-04 / Amit Sharma`), and algorithmic confidence ratings for each attempt.
- **Confirmed Decision 3**: Synchronize `BiometricsModal` events directly with `AuthContext` so running any scan in the biometrics scanner immediately creates a new historical event entry.

---

## 1. Overview & Core Concept

- **What It Does**: Upgrades the sovereign cryptographic audit log modal into an interactive audit station. Users and auditors can inspect past and recent biometric verification events, filter by biometric modality (Face, OCR, Voice), observe verification pass/fail status, view accuracy confidence percentages, and inspect cryptographic event hashes.
- **Target Audience / Persona**: System Administrators (`msrch`), Compliance Auditors (AICTE Regulatory Cell), and Students verifying their own identity audit logs for APAAR ID / DigiLocker integration.
- **Key Value**: Delivers regulatory transparency and immutable accountability for identity authentication events in compliance with sovereign Indian DPI standards.

---

## 2. User Experience & Visual Design

- **Modal Header & Tab Navigation**:
  - Top header with terminal/shield branding and live telemetry badge.
  - Two distinct tabs:
    1. **Biometric Scan Ledger**: Lists historical and real-time biometric verification attempts.
    2. **System Audit Trail**: The global event log mirroring `security_audit.db`.
- **Biometric Summary Metric Bar**:
  - **Total Scans Logged**: Counter of all historical verification attempts.
  - **Verification Success Rate**: Percentage of passed scans (e.g. 98.4%).
  - **Avg. Liveness Confidence**: Mean algorithmic confidence across attempts.
  - **Last Verified**: Relative timestamp of the most recent biometric authentication.
- **Event Filter Controls**:
  - Filter chips: `All Modalities`, `Facial 3D Mesh`, `Student ID OCR`, `Voiceprint Spectrogram`.
- **Biometric Verification Event Cards**:
  - Clear visual cards for each attempt:
    - **Modality Icon & Label**: Camera icon for Face, Card icon for OCR, Waveform icon for Voice.
    - **Timestamp**: Human-readable local timestamp and relative time indicator.
    - **Status Pill**: Emerald `VERIFIED_SUCCESS` or Amber `CHALLENGE_REQUIRED`.
    - **Confidence Metric**: e.g., `Score: 99.8%` or `Cosine Similarity: 0.97`.
    - **Subject & Machine Hash**: `CS-2022-04 (Amit Sharma)` and shortened hash (`#sha256:7f4a...92b`).
- **Interactive Feedback**:
  - Instant transition animations when switching tabs or applying modality filters.
  - Real-time pulse animation on freshly appended scan events triggered during the current session.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Tab Segregation vs Single Mixed Log**
  - *Chosen Approach*: Implement a dual-tab toggle inside `AuditLogsModal` separating dedicated Biometric Scan Events from the general system text log.
  - *Why*: Biometric events contain structured metadata (modality, score, student roll number, cryptographic verification status) that benefit from structured card rendering, whereas general logs are raw text streams.
  - *Alternatives Considered*: Injecting raw text strings into the general log stream, which was rejected because it obscures confidence scores and makes status filtering cumbersome.

- **Decision 2: Live Biometrics Event Emission**
  - *Chosen Approach*: Update `AuthContext` to expose `biometricLogs: BiometricLogEntry[]` and `addBiometricLog(entry)`. When `triggerFaceScan`, `triggerOcrScan`, or `triggerVoiceScan` completes in `BiometricsModal`, an event is emitted and saved to state.
  - *Why*: Provides immediate visual gratification and realistic end-to-end integration without page reloads.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          AuthContext State                             │
│  - auditLogs: string[]                                                 │
│  - biometricLogs: BiometricLogEntry[]                                  │
│  - addBiometricLog(modality, status, score, details)                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌───────────────────────────────┐         ┌───────────────────────────────┐
│        BiometricsModal        │         │        AuditLogsModal         │
│  - Scan triggers:             │         │  - Tab 1: Biometric Ledger    │
│    * Face Scan -> Success     │         │    * Modality filter          │
│    * OCR Scan  -> Success     │         │    * Summary KPI metrics      │
│    * Voice Scan -> Success    │         │    * Timestamp & Status cards │
│  - Dispatches addBiometricLog │         │  - Tab 2: System Audit Stream │
└───────────────────────────────┘         └───────────────────────────────┘
```

### Data Model (`src/types/index.ts`)

```typescript
export type BiometricModality = 'FACE_3D' | 'OCR_ID' | 'VOICE_SPECTROGRAM';
export type BiometricStatus = 'VERIFIED_SUCCESS' | 'CHALLENGE_REQUIRED' | 'REJECTED';

export interface BiometricLogEntry {
  id: string;
  modality: BiometricModality;
  modalityLabel: string;
  status: BiometricStatus;
  timestamp: string;
  subjectRollNo: string;
  subjectName: string;
  confidenceScore: string;
  hash: string;
  notes: string;
}
```

### Execution Steps Upon Approval

1. **Update Types (`src/types/index.ts`)**: Add `BiometricLogEntry`, `BiometricModality`, and `BiometricStatus`.
2. **Seed Initial Historical Events (`src/data/mockData.ts`)**: Pre-seed realistic historical verification attempts spanning previous days and today.
3. **Update State (`src/context/AuthContext.tsx`)**: Add `biometricLogs` state and `recordBiometricAttempt` action.
4. **Update Biometrics Modal (`src/components/views/BiometricsModal.tsx`)**: Hook into `recordBiometricAttempt` so scans log in real-time.
5. **Update Audit Modal (`src/components/views/AuditLogsModal.tsx`)**: Build the tabbed UI, KPI bar, modality filters, and event list cards with timestamps and status.
6. **Verify Build**: Run `compile_applet` and verify zero errors.
