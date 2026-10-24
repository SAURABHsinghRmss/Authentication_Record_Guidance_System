# WebAuthn Biometric Authentication Layer for High-Security Roles

Implementation plan for integrating a strict, mandatory WebAuthn (FIDO2 / Passkey) biometric authentication layer for high-security roles (`institute` and `admin`), enforcing platform authenticator hardware verification, manual passkey credential management, and clean security audit logging.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural directions below were confirmed through user clarifications:
> - **Enforcement Policy**: Strict mandatory requirement that blocks logins without biometric hardware (no password-only bypass for `institute` and `admin`).
> - **Passkey Enrollment**: Manual passkey management tab inside high-security portals (`InstitutePortal` and `AdminPortal`) for registering and removing biometric credentials.
> - **Security Audit Logging**: Basic success or failure status recorded to the sovereign audit stream without storing or exposing raw cryptographic payloads.

---

## 1. Overview & Core Concept

### What It Does
EduIdentityAI handles institutional accreditations, AICTE Standard Inspection Format (SIF) compliance, FDR financial escrow vaults, and system-wide student records. High-security roles (`institute` and `admin`) have access to critical institutional operations.

This implementation integrates the standard **Web Authentication API (`navigator.credentials`)**:
1. **Login-Time WebAuthn Challenge**:
   - When an `institute` or `admin` user submits credentials on the login portal, the system checks for `window.PublicKeyCredential`.
   - If no biometric hardware/platform authenticator is available, the login is strictly blocked with an explanatory error.
   - If available, `navigator.credentials.get()` triggers the native OS/browser biometric prompt (Touch ID, Face ID, Windows Hello, or FIDO2 hardware key).
   - Only upon cryptographically valid user presence verification is the authenticated session established.
2. **Dedicated Passkey Management Tabs**:
   - `InstitutePortal`: New "WebAuthn & Passkeys" tab under institutional governance to register new biometric devices, test passkeys, and view registered authenticator status.
   - `AdminPortal`: New "Hardware Passkeys & FIDO2" tab under sovereign security settings to enroll master developer passkeys and inspect active device registrations.
3. **Audit Ledger Logging**:
   - Records clean, human-readable entries in `auditLogs` and the Firestore `biometric_logs` ledger:
     `[Timestamp] WEBAUTHN BIOMETRICS: Authentication [SUCCESS] for user {username} [Role: {role}].`

---

## 2. Technical Architecture & Cryptographic Flow

### WebAuthn Authentication Sequence Diagram

```
┌──────────────┐         ┌────────────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│ User / Agent │         │  LandingPage / UI  │         │ WebAuthn Service API │         │ OS Biometric HW │
└──────┬───────┘         └─────────┬──────────┘         └──────────┬───────────┘         └────────┬────────┘
       │                           │                               │                              │
       │ 1. Enters Admin/Inst creds│                               │                              │
       ├──────────────────────────►│                               │                              │
       │                           │ 2. Check HW presence          │                              │
       │                           ├──────────────────────────────►│                              │
       │                           │    isUserVerifyingPlatform... │                              │
       │                           │◄──────────────────────────────┤                              │
       │                           │ [If No HW: Strict Block 403]  │                              │
       │                           │                               │                              │
       │                           │ 3. Request Assertion Challenge│                              │
       │                           ├──────────────────────────────►│                              │
       │                           │                               │ 4. navigator.credentials.get │
       │                           │                               ├─────────────────────────────►│
       │                           │                               │                              │ 5. Touch ID /
       │                           │                               │                              │    Face ID
       │                           │                               │◄─────────────────────────────┤
       │                           │ 6. Assertion Verified (OK)    │                              │
       │                           │◄──────────────────────────────┤                              │
       │                           │                               │                              │
       │ 7. Session Granted        │ 8. Log Basic Success Event    │                              │
       │◄──────────────────────────┤                               │                              │
```

### Module Structure
- `src/lib/webauthn.ts`:
  - `isWebAuthnSupported()`: Validates `window.PublicKeyCredential`.
  - `isPlatformAuthenticatorAvailable()`: Checks `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()`.
  - `registerPasskey(user, deviceName)`: Executes `navigator.credentials.create()`, storing public key credential metadata in localStorage / Firestore.
  - `authenticateWithPasskey(role, username)`: Executes `navigator.credentials.get()` with a cryptographic challenge, enforcing biometric verification.
  - `getStoredPasskeys(role)`: Retrieves registered passkeys for the persona.
  - `deletePasskey(credentialId)`: Revokes a registered authenticator.
- `src/components/common/WebAuthnPromptModal.tsx`:
  - Non-intrusive step modal displaying native biometric status, countdown challenge, device icon, and biometric feedback during login.
- `src/components/portals/institute/InstitutePasskeysView.tsx`:
  - Dedicated passkey enrollment and device management tab inside `InstitutePortal`.
- `src/components/portals/admin/AdminPasskeysView.tsx`:
  - Dedicated FIDO2 & hardware passkey tab inside `AdminPortal`.

---

## 3. User Experience & Strict Security Policy

### Login Enforcement for High-Security Roles
1. **Student & Faculty & Parent**: Standard mobile OTP / password / Google SSO logins remain accessible without mandatory WebAuthn hardware locks.
2. **Institute & Admin**:
   - When attempting login (either via 1-click launchpad or traditional username/password), the system verifies the device's WebAuthn support.
   - If unsupported: Immediately presents a high-security lock screen:
     *"High-Security Access Restricted: Institute and Admin roles strictly require WebAuthn biometric verification (Touch ID, Windows Hello, or FIDO2 hardware key). No compatible platform authenticator was detected."*
   - If supported: Prompts the native biometric dialog. Successful biometric authorization grants entry; rejection or cancellation prevents login.

### Passkey Management Inside Portals
- Located in the sidebar of both `InstitutePortal` ("WebAuthn Passkeys") and `AdminPortal` ("FIDO2 Hardware Passkeys").
- Features:
  - List of registered authenticators (Passkey Name, Credential ID, Enrollment Date, Authenticator Type).
  - "Register New Biometric Key" button triggering `navigator.credentials.create()`.
  - "Test Passkey Verification" button to verify existing biometrics anytime.
  - "Revoke Passkey" action with confirmation.

---

## 4. Verification & Testing Plan

1. **Browser & Hardware Capability Check**:
   - Verify that devices without WebAuthn or platform authenticators are strictly blocked from logging into `institute` or `admin`.
2. **Passkey Enrollment & Authentication**:
   - Test passkey registration in both `InstitutePortal` and `AdminPortal`.
   - Test login verification on `LandingPage` for `institute` (`institute_admin`) and `admin` (`msrch`).
3. **Audit Ledger Logging**:
   - Verify that successful logins record:
     `WEBAUTHN: Biometric authentication [SUCCESS] for user {username} [Role: {role}].`
   - Verify that cancelled or failed attempts record:
     `WEBAUTHN: Biometric authentication [FAILED] for user {username} [Role: {role}].`
4. **Compilation & Linting**:
   - Run `compile_applet` and `lint_applet` to ensure zero TypeScript errors.
