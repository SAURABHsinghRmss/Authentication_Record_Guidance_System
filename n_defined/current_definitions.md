# Current Definitions & End-to-End Connectivity Trace Report

This document traces the complete end-to-end connectivity of each function across the entire tech stack of the **EduIdentityAI** platform.

---

## 🔗 End-to-End Functional Connectivity Matrix

| Frontend Action / UI Component | API Gateway Route (FastAPI) | Security & Middleware | Backend Business Logic & AI Engine | Persistence / Storage |
| --- | --- | --- | --- | --- |
| **Login / Register Portal** | `POST /api/auth/login`<br>`POST /api/auth/register` | RateLimiterMiddleware, Math CAPTCHA | Bcrypt password hashing, JWT token generation, auto-seeding of master developer account | `users` table in `databases/auth_iam.db` & `eduidentity.db` |
| **Universal Developer Admin** | `POST /api/auth/login` (`msrch` / `msrch1410#`) | Master credential validation, `before_delete` hook | Permanent developer account for debugging; alterations allowed, deletion blocked | Database trigger `prevent_delete_msrch` on `users` table |
| **User Profile Management** | `GET /api/auth/me`<br>`PUT /api/auth/users/{username}`<br>`DELETE /api/auth/users/{username}` | OAuth2 Token, RBAC (`admin` / self) | Profile updates, password re-hashing, 403 rejection on attempts to delete permanent developer account | `users` table in `auth_iam.db` |
| **Polyglot 7-Database Federation** | `GET /api/admin/db/federation-health`<br>`GET /api/admin/db/audit-trail`<br>`POST /api/admin/db/sync-all` | OAuth2 Token, RBAC (`admin`) | Database federation manager verifying connectivity, schema integrity, and cross-domain data synchronization | 7 Isolated Domain Databases (`databases/*.db`) |
| **User Work Logging & Session Tracking** | `GET /api/auth/work-logs/me/last-work`<br>`POST /api/auth/work-logs/me/record`<br>`GET /api/auth/work-logs/me/history` | OAuth2 Token | Automatic capture of previous session state at login; append-only activity telemetry | Partitioned storage at `storage/logs/users/{user_email}/` (`last_work.json`, `login_history.jsonl`, `activity_stream.jsonl`) |
| **Storage Location Auditing (Admin)** | `GET /api/auth/work-logs/locations`<br>`GET /api/auth/work-logs/user/{email}` | OAuth2 Token, RBAC (`admin`) | Inspection of per-user Gmail storage directories, file counts, and activity summaries | Filesystem directory index |
| **Cloud Storage Staging & Sync Gateway** | `POST /api/auth/work-logs/cloud-sync` | OAuth2 Token, RBAC (`admin`) | Preparation, file validation, and staging for Google Cloud Storage bucket (`gs://eduidentity-user-logs/...`) | Local log storage staged for GCS bucket sync |
| **Student Directory & CRUD** | `GET /api/students`<br>`POST /api/students`<br>`DELETE /api/students/{id}` | OAuth2 Token, RBAC (`require_role`) | SQLAlchemy 2.0 ORM session execution over academic records | `students` table in `databases/academic_sis.db` |
| **Unified 3-Category Chat (Personal, Private, Global)** | `GET /api/chat/categories`<br>`GET /api/chat/category/{category}`<br>`POST /api/chat/send` | OAuth2 Token, RBAC | Partitioned chat streaming across PERSONAL (1-on-1 direct), PRIVATE (enclosed clubs/councils), and GLOBAL (campus agora) | `unified_chat_messages` table & cross-sync to `mentor_chats` |
| **EduMentor Meta AI in WhatsApp (8 Criteria)** | `GET /api/chat/ai/criteria`<br>`POST /api/chat/ai/ask`<br>In-chat `@ai` / `@meta` triggers | OAuth2 Token, Prompt Sanitizer | Dual-engine AI copilot: Google Gemini 3.8 Flash (`models/gemini-3.8-flash:generateContent`) with 3s deterministic offline RAG fallback across 8 Educational Criteria | `unified_chat_messages` (`sender_username: edumentor_ai`, `criteria: string`) |
| **Community Clubs & Verified Peer Hives** | `GET /api/community/groups`<br>`POST /api/community/groups`<br>`GET /api/community/groups/{id}/messages`<br>`POST /api/community/groups/{id}/messages` | OAuth2 Token, RBAC | Trust-tiered study group creation, role-gated access control, and message cross-sync to PRIVATE category | `community_groups`, `community_messages` tables |
| **EduMentor Co-Pilot & Study Quizzes** | `POST /api/copilot/groups/{id}/summarize`<br>`POST /api/copilot/groups/{id}/quiz`<br>`POST /api/copilot/quizzes/{id}/answer`<br>`POST /api/copilot/verify-access` | OAuth2 Token, RBAC | AI thread summarization with RAG policy context, interactive quiz evaluation, trust-tier verification | `study_session_summaries`, `interactive_quizzes` tables |
| **AI Guidance RAG Chat** | `POST /rag_query` | RateLimiterMiddleware | Qwen3 embedding similarity search over institutional knowledge base | `sample_students.json` vector store |
| **Multimodal Biometrics & Verification** | `POST /api/auth/biometric-verify` | RateLimiterMiddleware | Neural feature extraction & cosine similarity across Face, Voice, OCR, and Fusion pipelines | Biometric hash verification flags |
| **2FA Mobile & Email OTP** | `POST /api/auth/otp/send`<br>`POST /api/auth/otp/verify`<br>`POST /api/auth/otp/mobile/send`<br>`POST /api/auth/otp/mobile/verify` | RateLimiterMiddleware | Cryptographic 6-digit passcode generation, rate limiting, and in-memory TTL verification | In-memory OTP Store & SMS/Email Dispatch |
| **National Credentials & DigiLocker Auto-Fill** | `POST /api/auth/apaar-verify`<br>`POST /api/auth/digilocker-fetch`<br>`POST /api/auth/digilocker-auto-fill` | RateLimiterMiddleware, OAuth2 Token | Automated student registration pre-filling, APAAR ID cryptographic verification, and digital degree certificate fetching | Relational user metadata & DigiLocker state |
| **Opportunity Scam Shield & URL Verifier** | `POST /api/security/check-url` | RateLimiterMiddleware | URL heuristic scoring, TLD risk analysis, domain trust scoring, and fraud mitigation advice | Stateless heuristic inspection engine |
| **Real-Time Audit Stream** | `WS /ws/audit-logs` | WebSocket Manager | Asynchronous telemetry & system heartbeat broadcaster | Live memory telemetry broadcaster |
| **Prometheus SLA Metrics** | `GET /health`<br>`GET /metrics` | Public endpoint | Prometheus client counter & request duration histograms | Runtime memory metrics registry |

---

## 🏛️ 8 Grounded Educational AI Criteria (Meta AI Style)

1. **`POLICY_REGULATION`**: Institutional Regulations & Credit Policy (RAG grounded verification of the mandatory 75% attendance rule and 20% SWAYAM/NPTEL credit transfer allowance).
2. **`CONCEPT_TUTORING`**: Interactive Academic Concept Tutoring (Pedagogical step-by-step breakdowns with real-world analogies, algorithm workflows, and Big-O complexity analysis).
3. **`QUIZ_GENERATION`**: Knowledge Assessment & Study Quizzes (Interactive 4-option MCQs with pedagogical hints and expandable `<details>` answer and reasoning reveals).
4. **`THREAD_SUMMARIZATION`**: Lecture & Study Thread Synthesis (Summarizing recent discussions in study groups or campus agora into structured study notes and action items).
5. **`ACADEMIC_INTEGRITY`**: Academic Integrity & Research Citation Standards (IEEE / APA 7th edition citation generation, anti-plagiarism guidelines, and ethical AI usage codes).
6. **`CAREER_PATHWAY`**: Technical Roadmap & Career Advisory (Structured milestone roadmap from semester 1 to 8, placement preparation, and coding interview guidance).
7. **`EXAM_REVISION`**: Exam Revision & High-Yield Cheat Sheets (Rapid-fire formula summaries, core theorems, common semester exam traps, and probable viva voce questions).
8. **`CODE_LAB_ASSIST`**: Code Walkthrough & Pedagogical Debugging (Line-by-line algorithmic walkthroughs, asymptotic complexity analysis, and defensive coding best practices).
