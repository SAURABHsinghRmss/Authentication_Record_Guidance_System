# Security Specification & Adversarial Payload Test Suite

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created or modified if `userId == request.auth.uid`. A non-admin user can NEVER modify their own `role` field.
2. **Admin Authority Invariant**: Elevated actions (such as overriding complaints or managing institution escrow) require either explicit existence in `/admins/{userId}` or verified email `ssrmsr06@gmail.com` with `email_verified == true`.
3. **Biometric Integrity Invariant**: A biometric audit event at `/biometric_logs/{logId}` can only be written if the `userId` in the payload matches `request.auth.uid`. Once created, biometric logs are strictly append-only (immutable).
4. **Complaint Ownership Invariant**: A complaint ticket at `/complaints/{complaintId}` must have `userId == request.auth.uid` upon creation. Users can only read their own complaints unless user is admin.
5. **Temporal & Bound Invariants**: All string lengths must be bounded (e.g., descriptions <= 2048 chars, hashes <= 128 chars, IDs <= 128 chars) to guard against Denial of Wallet and storage attacks.

## 2. The "Dirty Dozen" Payloads (Adversarial Test Vectors)

1. **Payload 1 (Self-Assigned Admin Escalation)**:
   - Target: `/users/attacker123`
   - Attacker Auth: `{ uid: "attacker123", email: "evil@edu.in" }`
   - Payload: `{ uid: "attacker123", email: "evil@edu.in", role: "admin" }`
   - Expected: `PERMISSION_DENIED` (Cannot self-assign `admin` role without verification).

2. **Payload 2 (Ghost Field / Shadow Key Injection)**:
   - Target: `/users/user123`
   - Attacker Auth: `{ uid: "user123", email: "student@uni.edu" }`
   - Payload: `{ uid: "user123", email: "student@uni.edu", role: "student", isSuperUser: true, bypassBiometrics: true }`
   - Expected: `PERMISSION_DENIED` (`hasOnly` strict key validation failure).

3. **Payload 3 (Unverified Admin Email Spoofing)**:
   - Target: `/admins/spoofedUid`
   - Attacker Auth: `{ uid: "spoofedUid", email: "ssrmsr06@gmail.com", email_verified: false }`
   - Payload: `{ email: "ssrmsr06@gmail.com", role: "admin" }`
   - Expected: `PERMISSION_DENIED` (`email_verified == true` gate blocks spoofed identity).

4. **Payload 4 (Biometric Log Cross-User Forgery)**:
   - Target: `/biometric_logs/bio-attack-99`
   - Attacker Auth: `{ uid: "attacker123" }`
   - Payload: `{ id: "bio-attack-99", userId: "victimStudent456", modality: "FACE_3D", status: "VERIFIED_SUCCESS", hash: "SHA256-fake", timestamp: "2026-10-24 12:00:00" }`
   - Expected: `PERMISSION_DENIED` (`userId != request.auth.uid`).

5. **Payload 5 (Biometric Tampering / Retroactive Status Mutation)**:
   - Target: `/biometric_logs/bio-existing-1`
   - Attacker Auth: `{ uid: "student123" }`
   - Payload: `{ status: "VERIFIED_SUCCESS" }` (Updating a previously `REJECTED` attempt)
   - Expected: `PERMISSION_DENIED` (Biometric logs are append-only; update is blocked).

6. **Payload 6 (Denial of Wallet String Bomb)**:
   - Target: `/complaints/cmp-overflow`
   - Attacker Auth: `{ uid: "attacker123" }`
   - Payload: `{ id: "cmp-overflow", ticket_no: "AIC-1", userId: "attacker123", category: "Harassment", subject: "Test", description: "A".repeat(50000), status: "PENDING" }`
   - Expected: `PERMISSION_DENIED` (`description.size() <= 2048` boundary violated).

7. **Payload 7 (Path Variable Poisoning / Huge Document ID)**:
   - Target: `/users/${"A".repeat(250)}`
   - Attacker Auth: `{ uid: "A".repeat(250) }`
   - Payload: `{ uid: "A".repeat(250), role: "student", email: "test@uni.edu" }`
   - Expected: `PERMISSION_DENIED` (`isValidId()` rejects IDs > 128 chars).

8. **Payload 8 (Special Character / Shell Injection Document ID)**:
   - Target: `/users/user%20..%2Fhack`
   - Attacker Auth: `{ uid: "user%20..%2Fhack" }`
   - Payload: `{ uid: "user%20..%2Fhack", role: "student" }`
   - Expected: `PERMISSION_DENIED` (`matches('^[a-zA-Z0-9_\\-]+$')` fails).

9. **Payload 9 (Unauthenticated Anonymous Eavesdropping)**:
   - Target: `/users/targetUser`
   - Attacker Auth: `null` (Unauthenticated)
   - Operation: `GET /users/targetUser`
   - Expected: `PERMISSION_DENIED` (`isSignedIn()` fails).

10. **Payload 10 (Unauthorized Snooping into Another Student's Complaints)**:
    - Target: `/complaints/privateTicket789`
    - Attacker Auth: `{ uid: "nosyStudent123" }`
    - Document Existing: `{ userId: "victimStudent456", ... }`
    - Operation: `GET /complaints/privateTicket789`
    - Expected: `PERMISSION_DENIED` (`resource.data.userId == request.auth.uid` or `isAdmin()` fails).

11. **Payload 11 (Blanket Query Scraping without Filter)**:
    - Query: `collection('complaints')` without `where('userId', '==', auth.uid)`
    - Attacker Auth: `{ uid: "student123" }`
    - Expected: `PERMISSION_DENIED` (Rule enforces `resource.data.userId == request.auth.uid`).

12. **Payload 12 (Admin Registry Hijack)**:
    - Target: `/admins/attacker123`
    - Attacker Auth: `{ uid: "attacker123", email: "attacker@edu.in" }`
    - Payload: `{ email: "attacker@edu.in", role: "admin" }`
    - Expected: `PERMISSION_DENIED` (Writing to `/admins` is strictly restricted to current `isAdmin()`).

## 3. Test Runner Definition
Verified against `firestore.rules` where each scenario triggers rule evaluation and resolves to `PERMISSION_DENIED`.
