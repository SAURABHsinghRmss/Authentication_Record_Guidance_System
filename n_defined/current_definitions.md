# Current Definitions & End-to-End Connectivity Trace Report

This document traces the complete end-to-end connectivity of each function across the entire tech stack of the **EduIdentityAI** platform.

---

## 🔗 End-to-End Functional Connectivity Matrix

| Frontend Action / UI Component | API Gateway Route (FastAPI) | Security & Middleware | Backend Business Logic & AI Engine | Persistence / Storage |
| --- | --- | --- | --- | --- |
| **Login / Register Portal** | `POST /api/auth/login`<br>`POST /api/auth/register` | RateLimiterMiddleware, Math CAPTCHA | Bcrypt password hashing, JWT token generation | `users` table (`sqlite` / `postgres`) |
| **Student Directory & CRUD** | `GET /api/students`<br>`POST /api/students`<br>`DELETE /api/students/{id}` | OAuth2 Token, RBAC (`require_role`) | SQLAlchemy 2.0 ORM session execution | `students` table |
| **AI Guidance RAG Chat** | `POST /rag_query` | RateLimiterMiddleware | Qwen3 embedding similarity search over institutional knowledge base | `sample_students.json` KB |
| **Biometric Verification** | `POST /api/auth/biometric-verify` | RateLimiterMiddleware | Neural feature extraction & cosine similarity (DeepFace, EasyOCR, SpeechBrain) | Biometric hash flags |
| **2FA OTP Verification** | `POST /api/auth/otp/send`<br>`POST /api/auth/otp/verify` | RateLimiterMiddleware | 6-digit passcode generation & in-memory expiry check | In-memory OTP Store |
| **Website Legitimacy Checker** | `POST /api/security/check-url` | RateLimiterMiddleware | URL heuristic scoring, TLD risk analysis, trust score calculation | Stateless heuristic engine |
| **Real-Time Audit Stream** | `WS /ws/audit-logs` | WebSocket Manager | Asynchronous telemetry & system heartbeat broadcaster | Live memory stream |
| **Prometheus SLA Metrics** | `GET /health`<br>`GET /metrics` | Public endpoint | Prometheus client counter & request duration histograms | Runtime memory |
