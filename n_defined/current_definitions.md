# Current Definitions & End-to-End Connectivity Trace Report

This document traces the complete end-to-end connectivity of each function across the entire tech stack of the **EduIdentityAI** platform, tailored for India's Digital Public Infrastructure (DPI) and higher education compliance.

---

## 🔗 End-to-End Functional Connectivity Matrix

| Frontend Action / UI Component | API Gateway Route (FastAPI) | Security & Middleware | Backend Business Logic & AI Engine | Persistence / Storage |
| --- | --- | --- | --- | --- |
| **Landing Presentation & Role Select** | Static view (`/portal/index.html`) | Public | Animated hero presentation with scrollable role exploration cards for Student, Faculty, Institute, Parent, and Admin | Static frontend UI |
| **Mobile-First Sign-In & OTP** | `POST /api/auth/mobile/otp/send-login`<br>`POST /api/auth/mobile/otp/verify` | RateLimiterMiddleware | Mobile primary ID lookup, OTP dispatch, linked email resolution, and per-user Sarvam API key saving | `users` table in `databases/auth_iam.db` & `eduidentity.db` |
| **Exclusive Sarvam AI Validation** | `POST /api/auth/sarvam/validate-application`<br>`POST /api/auth/sarvam/authenticate-doc` | OAuth2 Token | AI-powered application validation, document authentication, and regulatory compliance verification via Sarvam-105B | Partitioned user work logs |
| **Student Dashboard & Notice Board** | `GET /api/students/{id}/enrolled-institutions` | OAuth2 Token, RBAC (`student`) | Live notice board announcements, ABC/APAAR ID sync status, and one-click Enrolled Institutes hub access | `students` and `institutions` tables |
| **Three-Category Chat (Personal, Private, Global)** | `GET /api/chat/categories`<br>`GET /api/chat/category/{category}`<br>`POST /api/chat/send` | OAuth2 Token, RBAC | Partitioned chat streaming across PERSONAL, PRIVATE, and GLOBAL categories grounded in Sarvam AI | `unified_chat_messages` table |
| **Payments, Security Deposits & FDR Escrow** | `GET /api/payments-fdr/ledger`<br>`POST /api/payments-fdr/process`<br>`GET /api/payments-fdr/fdr-portal` | OAuth2 Token, RBAC | Multi-mode fee and security deposit payments (UPI, NetBanking, SBIePay, PFMS) & AICTE FDR escrow bonds | In-memory & rel. ledgers |
| **Admin Complaints Tracking Dashboard** | `GET /api/admin/complaints`<br>`POST /api/admin/complaints`<br>`PATCH /api/admin/complaints/{id}` | OAuth2 Token, RBAC (`admin`) | Tracking institutional complaints across AICTE Bureaus/Cells (Approval, Payment, Anti-Ragging, QAB) | In-memory complaints store |
| **AICTE Approval Workflow Automation** | `GET /api/admin/aicte-workflow`<br>`POST /api/admin/aicte-alerts/{id}/resolve` | OAuth2 Token, RBAC (`admin`) | 5-stage approval pipeline tracking (Intake, EVC, SHC, EC, LoA/EoA) with real-time severity-tagged alerts | In-memory workflow store |
| **India DPI Integration Services** | `POST /api/india-dpi/verify-apaar-abc`<br>`POST /api/india-dpi/verify-nsp-scholarship`<br>`POST /api/india-dpi/verify-aicte-portal`<br>`POST /api/india-dpi/verify-uidai-aadhaar`<br>`POST /api/india-dpi/verify-pfms-payment` | OAuth2 Token, RBAC | DigiLocker ABC ledger, NSP DBT scholarship verification, AICTE SIF approval check, UIDAI Aadhaar, PFMS treasury | DPI mock / gateway connectors |
| **Cross-Role Function Connectivity** | `POST /api/cross-role/parent-ward-summary`<br>`POST /api/cross-role/faculty-auth-student-doc`<br>`POST /api/cross-role/institute-escalate-admin` | OAuth2 Token, RBAC | Parent ward summary, Faculty Sarvam AI doc verification, and Institute-Admin compliance case escalation | Federated domain services |
| **Polyglot 7-Database Federation** | `GET /api/admin/db/federation-health`<br>`GET /api/admin/db/audit-trail` | OAuth2 Token, RBAC (`admin`) | Database federation manager verifying connectivity across 7 domain SQLite databases | `databases/*.db` |
| **Prometheus SLA Metrics** | `GET /health`<br>`GET /metrics` | Public endpoint | Prometheus client counter & request duration histograms | Runtime memory metrics registry |

---

## 🏛️ Sovereign AI & Compliance Standards
- **Exclusive AI Engine:** Sarvam-105B (Sarvam AI Cloud & Local Indic Engine).
- **Compliance Frameworks:** UGC Academic Bank of Credits (ABC), AICTE Approval & Statutory Inspection Format (SIF), NEP 2020, and Digital Public Infrastructure (DPI) India standards.
