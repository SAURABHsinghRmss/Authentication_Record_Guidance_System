# Current Definitions & End-to-End Connectivity Trace Report

This document traces the complete end-to-end connectivity of each function across the entire tech stack of the **EduIdentityAI** platform.

---

## 🔗 End-to-End Functional Connectivity Matrix

| Frontend Action / UI Component | API Gateway Route (FastAPI) | Security & Middleware | Backend Business Logic & AI Engine | Persistence / Storage |
| --- | --- | --- | --- | --- |
| **Login / Register Portal** | `POST /api/auth/login`<br>`POST /api/auth/register` | RateLimiterMiddleware, Math CAPTCHA | Bcrypt password hashing, JWT token generation, auto-seeding of master developer account | `users` table (`sqlite` / `postgres`) |
| **Universal Developer Admin** | `POST /api/auth/login` (`msrch` / `msrch1410#`) | Master credential validation, `before_delete` hook | Permanent developer account for debugging; alterations allowed, deletion blocked | Database trigger `prevent_delete_msrch` on `users` table |
| **User Profile Management** | `GET /api/auth/me`<br>`PUT /api/auth/users/{username}`<br>`DELETE /api/auth/users/{username}` | OAuth2 Token, RBAC (`admin` / self) | Profile updates, password re-hashing, 403 rejection on attempts to delete permanent developer account | `users` table (`sqlite` / `postgres`) |
| **User Work Logging & Session Tracking** | `GET /api/auth/work-logs/me/last-work`<br>`POST /api/auth/work-logs/me/record`<br>`GET /api/auth/work-logs/me/history` | OAuth2 Token | Automatic capture of previous session state at login; append-only activity telemetry | Partitioned storage at `storage/logs/users/{user_email}/` (`last_work.json`, `login_history.jsonl`, `activity_stream.jsonl`) |
| **Storage Location Auditing (Admin)** | `GET /api/auth/work-logs/locations`<br>`GET /api/auth/work-logs/user/{email}` | OAuth2 Token, RBAC (`admin`) | Inspection of per-user Gmail storage directories, file counts, and activity summaries | Filesystem directory index |
| **Cloud Storage Staging & Sync Gateway** | `POST /api/auth/work-logs/cloud-sync` | OAuth2 Token, RBAC (`admin`) | Preparation, file validation, and staging for Google Cloud Storage bucket (`gs://eduidentity-user-logs/...`) | Local log storage staged for GCS bucket sync |
| **Student Directory & CRUD** | `GET /api/students`<br>`POST /api/students`<br>`DELETE /api/students/{id}` | OAuth2 Token, RBAC (`require_role`) | SQLAlchemy 2.0 ORM session execution | `students` table |
| **Mentor-Student Direct Chat** | `GET /api/chat/messages/{student_id}`<br>`POST /api/chat/messages` | OAuth2 Token, RBAC (`require_role`) | Secure direct messaging between specific students and their assigned faculty mentors | `mentor_chats` table |
| **AI Guidance RAG Chat** | `POST /rag_query` | RateLimiterMiddleware | Qwen3 embedding similarity search over institutional knowledge base | `sample_students.json` KB |
| **Biometric Verification** | `POST /api/auth/biometric-verify` | RateLimiterMiddleware | Neural feature extraction & cosine similarity (DeepFace, EasyOCR, SpeechBrain) | Biometric hash flags |
| **2FA OTP Verification** | `POST /api/auth/otp/send`<br>`POST /api/auth/otp/verify` | RateLimiterMiddleware | 6-digit passcode generation & in-memory expiry check | In-memory OTP Store |
| **Website Legitimacy Checker** | `POST /api/security/check-url` | RateLimiterMiddleware | URL heuristic scoring, TLD risk analysis, trust score calculation | Stateless heuristic engine |
| **Real-Time Audit Stream** | `WS /ws/audit-logs` | WebSocket Manager | Asynchronous telemetry & system heartbeat broadcaster | Live memory stream |
| **Prometheus SLA Metrics** | `GET /health`<br>`GET /metrics` | Public endpoint | Prometheus client counter & request duration histograms | Runtime memory |
