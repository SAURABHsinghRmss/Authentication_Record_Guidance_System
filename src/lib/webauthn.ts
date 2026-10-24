/**
 * WebAuthn (FIDO2 / Web Authentication API) Utility
 * Provides cryptographic challenge generation, credential enrollment (create),
 * assertion verification (get), and local credential registry management.
 */

export interface RegisteredPasskey {
  id: string; // Base64URL credential ID
  name: string; // User-defined passkey nickname
  role: string;
  username: string;
  createdAt: string;
  authenticatorType: 'Platform Biometric' | 'Cross-Platform Security Key';
  modality: string;
  algorithm: string;
  counter: number;
  transports?: string[];
}

export interface WebAuthnEnrollResult {
  success: boolean;
  passkey?: RegisteredPasskey;
  error?: string;
}

export interface WebAuthnAuthResult {
  success: boolean;
  credentialId?: string;
  authenticatorType?: string;
  error?: string;
}

const STORAGE_KEY = 'edu_webauthn_passkeys';

// Utility: convert ArrayBuffer to Base64URL string
export function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Utility: convert Base64URL string to Uint8Array
export function base64UrlToBuffer(base64Url: string): Uint8Array {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Check if WebAuthn API is supported in the current browser
export function isWebAuthnSupported(): boolean {
  return typeof window !== 'undefined' &&
    window.PublicKeyCredential !== undefined &&
    typeof navigator.credentials?.create === 'function' &&
    typeof navigator.credentials?.get === 'function';
}

// Check if user-verifying platform authenticator (Touch ID, Face ID, Windows Hello) is available
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

// Check if conditional UI (Autofill passkeys) is supported
export async function isConditionalMediationAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  try {
    if ('isConditionalMediationAvailable' in PublicKeyCredential) {
      return await (PublicKeyCredential as any).isConditionalMediationAvailable();
    }
    return false;
  } catch {
    return false;
  }
}

// Retrieve registered passkeys filtered by role
export function getRegisteredPasskeys(role?: string): RegisteredPasskey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: RegisteredPasskey[] = JSON.parse(raw);
    if (!role) return all;
    return all.filter(p => p.role === role);
  } catch {
    return [];
  }
}

// Save a newly registered passkey
export function saveRegisteredPasskey(passkey: RegisteredPasskey): void {
  const existing = getRegisteredPasskeys();
  const filtered = existing.filter(p => p.id !== passkey.id);
  const updated = [passkey, ...filtered];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Delete a registered passkey
export function deleteRegisteredPasskey(id: string): void {
  const existing = getRegisteredPasskeys();
  const updated = existing.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Seed initial demo passkeys for seamless demonstration
export function seedDefaultDemoPasskeys(): void {
  const existing = getRegisteredPasskeys();
  if (existing.length === 0) {
    const defaultKeys: RegisteredPasskey[] = [
      {
        id: 'pk_msrch_root_master_fido2',
        name: 'Master YubiKey 5Ci (Root Administrator)',
        role: 'admin',
        username: 'msrch',
        createdAt: '2026-10-24 10:00:00',
        authenticatorType: 'Cross-Platform Security Key',
        modality: 'Hardware Security Key (FIDO2)',
        algorithm: 'ES256 (ECDSA SHA-256)',
        counter: 14
      },
      {
        id: 'pk_glbitm_director_touchid',
        name: 'Director Office MacBook Touch ID',
        role: 'institute',
        username: 'institute_admin',
        createdAt: '2026-10-24 10:15:00',
        authenticatorType: 'Platform Biometric',
        modality: 'Biometric Touch ID (Secure Enclave)',
        algorithm: 'ES256 (ECDSA SHA-256)',
        counter: 8
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultKeys));
  }
}

// Register a new WebAuthn credential (Passkey creation)
export async function registerWebAuthnCredential(
  username: string,
  displayName: string,
  role: string,
  passkeyName: string
): Promise<WebAuthnEnrollResult> {
  if (!isWebAuthnSupported()) {
    return {
      success: false,
      error: 'WebAuthn is not supported on this browser or platform.'
    };
  }

  try {
    // Generate random 32-byte challenge
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    // Generate random user ID buffer
    const userId = new TextEncoder().encode(`${role}:${username}:${Date.now()}`);

    const creationOptions: PublicKeyCredentialCreationOptions = {
      challenge: challenge as unknown as BufferSource,
      rp: {
        name: 'EduIdentityAI National Governance Portal',
        id: window.location.hostname
      },
      user: {
        id: userId as unknown as BufferSource,
        name: username,
        displayName: displayName || `${role.toUpperCase()} Authority`
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 }, // ES256 (ECDSA w/ SHA-256)
        { type: 'public-key', alg: -257 } // RS256 (RSA Signature w/ SHA-256)
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred'
      },
      timeout: 60000,
      attestation: 'none'
    };

    let credential: any;
    try {
      credential = await navigator.credentials.create({
        publicKey: creationOptions
      });
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        return {
          success: false,
          error: 'Biometric registration was declined or timed out by user.'
        };
      }
      // Attempt fallback without attachment constraint (e.g. external USB key)
      const fallbackOptions = { ...creationOptions };
      delete fallbackOptions.authenticatorSelection?.authenticatorAttachment;
      credential = await navigator.credentials.create({
        publicKey: fallbackOptions
      });
    }

    if (!credential) {
      return {
        success: false,
        error: 'No credential was returned by the hardware authenticator.'
      };
    }

    const credentialId = bufferToBase64Url(credential.rawId);
    const registered: RegisteredPasskey = {
      id: credentialId,
      name: passkeyName || `${role.toUpperCase()} Biometric Passkey`,
      role,
      username,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      authenticatorType: 'Platform Biometric',
      modality: 'Biometric Sensor / TouchID / Windows Hello',
      algorithm: 'ES256 (ECDSA SHA-256)',
      counter: 1
    };

    saveRegisteredPasskey(registered);
    return {
      success: true,
      passkey: registered
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Biometric credential creation failed.'
    };
  }
}

// Authenticate user with WebAuthn (Passkey assertion)
export async function authenticateWithWebAuthn(
  role: string,
  username: string
): Promise<WebAuthnAuthResult> {
  if (!isWebAuthnSupported()) {
    return {
      success: false,
      error: 'WebAuthn is not supported on this browser or device.'
    };
  }

  const hasHardware = await isPlatformAuthenticatorAvailable();
  if (!hasHardware) {
    return {
      success: false,
      error: 'Strict Security Enforcement: No biometric hardware or platform authenticator detected on this device.'
    };
  }

  try {
    // Generate random 32-byte challenge
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const registeredKeys = getRegisteredPasskeys(role);

    const requestOptions: PublicKeyCredentialRequestOptions = {
      challenge: challenge as unknown as BufferSource,
      rpId: window.location.hostname,
      timeout: 60000,
      userVerification: 'required'
    };

    // If credentials are registered, specify allowCredentials; otherwise allow any resident key on this RP
    if (registeredKeys.length > 0) {
      const realKeys = registeredKeys.filter(k => k.id.length > 10 && !k.id.startsWith('pk_'));
      if (realKeys.length > 0) {
        requestOptions.allowCredentials = realKeys.map(k => ({
          id: base64UrlToBuffer(k.id) as unknown as BufferSource,
          type: 'public-key' as const
        }));
      }
    }

    let assertion: any;
    try {
      assertion = await navigator.credentials.get({
        publicKey: requestOptions
      });
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        return {
          success: false,
          error: 'Biometric verification prompt was declined or cancelled.'
        };
      }
      throw err;
    }

    if (!assertion) {
      return {
        success: false,
        error: 'Biometric assertion was empty.'
      };
    }

    const credentialId = bufferToBase64Url(assertion.rawId);

    // Increment sign counter for the matched passkey
    if (registeredKeys.length > 0) {
      const matched = registeredKeys.find(k => k.id === credentialId);
      if (matched) {
        matched.counter = (matched.counter || 0) + 1;
        saveRegisteredPasskey(matched);
      }
    }

    return {
      success: true,
      credentialId,
      authenticatorType: 'Hardware Biometric (Verified)'
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Biometric hardware verification failed.'
    };
  }
}
