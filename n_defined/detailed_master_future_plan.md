# Detailed Master Future Engineering Plan & Execution Blueprint

> **Project**: EduIdentityAI  
> **Document Version**: v2.0-Enterprise  
> **Target Scope**: Detailed minute-by-minute architectural specifications, database schema upgrades, neural pipeline architectures, multi-cloud synchronization protocols, and role-based feature implementations for future production scaling.

---

## 📑 Table of Contents

1. [Architectural Principles & Design Philosophy](#1-architectural-principles--design-philosophy)
2. [Database Schema Evolution (Alembic & PostgreSQL)](#2-database-schema-evolution-alembic--postgresql)
3. [Minute AI/ML Pipeline Specifications by Role](#3-minute-aiml-pipeline-specifications-by-role)
    - 3.1 Student Role (`student.txt`)
    - 3.2 Mentor Teachers / Faculty Role (`mentor_teachers.txt`)
    - 3.3 Institute / Institution Role (`institute.txt`)
    - 3.4 Parent / Guardian Role (`parent.txt`)
    - 3.5 Administrator Role (`admin.txt`)
4. [Storage Partitioning, Compression & Multi-Cloud Sync](#4-storage-partitioning-compression--multi-cloud-sync)
5. [Security, Zero-Trust Hardening & Token Revocation](#5-security-zero-trust-hardening--token-revocation)
6. [Phased Engineering Execution Roadmap](#6-phased-engineering-execution-roadmap)

---

## 1. Architectural Principles & Design Philosophy

* **Modularity & Loose Coupling**: Decoupling the FastAPI core services, Qdrant vector retrieval engine, biometrics micro-workers, and frontend single-page application (SPA).
* **Air-Gapped & Offline Compatibility**: Maintaining support for pre-packaged wheels (`dependencies/python_wheels/`), model weights (`dependencies/ai_weights/`), and npm caches for secure, disconnected campus deployments.
* **Immutable Auditability**: Enforcing append-only JSONL event streams per user and database-level triggers to protect master administrator credentials (`msrch`).

---

## 2. Database Schema Evolution (Alembic & PostgreSQL)

Transitioning from SQLite `Base.metadata.create_all()` to robust Alembic versioned migrations (`alembic/versions/`).

### 2.1 Extended Relational Schema Specifications

```sql
-- 1. Enhanced Users Table with Role & Institution Foreign Keys
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'student', -- student, faculty, admin, institute, parent
    full_name VARCHAR(128) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    institution_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Developer Immunity Trigger
CREATE OR REPLACE FUNCTION prevent_delete_msrch()
RETURNS TRIGGER AS $$
BEGIN
    IF LOWER(OLD.username) = 'msrch' THEN
        RAISE EXCEPTION 'Universal developer user "msrch" is immutable and cannot be deleted.';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_delete_msrch
BEFORE DELETE ON users
FOR EACH ROW EXECUTE FUNCTION prevent_delete_msrch();

-- 3. Students Table with Extended Academic & Biometric Hashes
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    roll_no VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(64) NOT NULL,
    semester VARCHAR(32) NOT NULL,
    cgpa DECIMAL(4,2) NOT NULL,
    attendance_percentage DECIMAL(5,2) NOT NULL,
    credits_earned INTEGER NOT NULL,
    max_credits INTEGER NOT NULL,
    backlogs INTEGER DEFAULT 0,
    apaar_id VARCHAR(64) UNIQUE,
    digilocker_verified BOOLEAN DEFAULT FALSE,
    face_enrolled BOOLEAN DEFAULT FALSE,
    voice_enrolled BOOLEAN DEFAULT FALSE,
    biometric_hash TEXT,
    status VARCHAR(32) DEFAULT 'PENDING_REVIEW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Unified 3-Category Chat Table (Personal, Private, Global)
CREATE TABLE unified_chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    category VARCHAR(32) NOT NULL,             -- 'PERSONAL', 'PRIVATE', 'GLOBAL'
    channel_id VARCHAR(128) NOT NULL,          -- 'campus_global', 'direct_u1_u2', 'grp_ai_club'
    sender_username VARCHAR(64) NOT NULL,
    sender_name VARCHAR(128) NOT NULL,
    sender_role VARCHAR(32) NOT NULL,
    recipient_username VARCHAR(64),            -- Present for PERSONAL 1-on-1 direct messages
    message TEXT NOT NULL,
    criteria VARCHAR(64),                      -- Active Educational Criterion ID
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_unified_chat_cat_channel ON unified_chat_messages(category, channel_id);

-- 5. Audit & Session Telemetry Partition Tables
CREATE TABLE user_work_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_user_work_logs_email_created ON user_work_logs(user_email, created_at DESC);
```

---

## 3. Minute AI/ML Pipeline Specifications by Role

### 3.1 Student Role (`student.txt`)
* **EduMentor Meta AI Copilot (8 Grounded Educational Criteria)**:
  * *Dual-Engine Intelligence*: Google Gemini 3.8 Flash (`models/gemini-3.8-flash:generateContent`) with 3s deterministic local RAG vector store fallback.
  * *8 Criteria*: `POLICY_REGULATION`, `CONCEPT_TUTORING`, `QUIZ_GENERATION`, `THREAD_SUMMARIZATION`, `ACADEMIC_INTEGRITY`, `CAREER_PATHWAY`, `EXAM_REVISION`, `CODE_LAB_ASSIST`.
  * *In-Chat Invocations*: Direct 1-on-1 `@edumentor_ai` chat and in-channel `@ai` mentions across Campus Global Agora and Private Club channels.
* **National Credential & DigiLocker Auto-Fill**:
  * *Workflow*: Ingests certified DigiLocker degree certificates and APAAR ID registry to automatically verify student identity and pre-fill institutional registration profiles.
* **CGPA Trajectory Predictor**:
  * *Model*: Gradient Boosted Trees (XGBoost) trained on features: `attendance_percentage`, `credits_earned`, `backlogs`, `past_semester_cgpa`.
  * *Output*: Expected final CGPA confidence interval `[8.2 - 8.6]` with automated remediation triggers if projected CGPA $< 6.0$.

### 3.2 Mentor Teachers / Faculty Role (`mentor_teachers.txt`)
* **Unified Faculty Mentorship Communication**:
  * *Channels*: 1-on-1 confidential direct mentee messaging (`PERSONAL`), Private Faculty Councils (`PRIVATE`), and campus-wide research symposia announcements (`GLOBAL`).
* **AI Quiz & Discussion Synthesis**:
  * *Pipeline*: Faculty triggers `@ai quiz` or `@ai summarize` to generate syllabus check-ins and synthesize cohort lecture discussions into structured takeaways.
* **At-Risk Early Warning System**:
  * *Feature Vector*: `[attendance_drop_rate, library_access_frequency, failed_quiz_count, assignment_delay_hours]`.
  * *Inference*: Random Forest classifier running asynchronously every night at 02:00 UTC, automatically populating the faculty at-risk dashboard.

### 3.3 Institute / Institution Role (`institute.txt`)
* **Campus-Wide Broadcast Agora**:
  * *Governance*: Official institutional broadcasting in `#academic_bulletin` and `#campus_global` with verification badge badges.
* **Graph Neural Networks for Credential Fraud Detection**:
  * *Graph Representation*: Nodes = `{Institution, Student, DigiLockerHash, CertificateID}`; Edges = `{ISSUED_TO, VERIFIED_BY, MATCHES_HASH}`.
  * *Algorithm*: GraphSAGE embedding aggregation to compute anomaly scores for certificate authenticity. If anomaly score $> 0.85$, flag for manual administrative audit.

### 3.4 Parent / Guardian Role (`parent.txt`)
* **Direct Mentor Advisory & Ward Telemetry**:
  * *Two-Way Messaging*: Direct, confidential communication with the ward's assigned faculty mentor and AI explanation of academic regulations (75% attendance rule and credit transfer limits).
* **Proactive Safety & Scam Alert Engine**:
  * *Heuristic + ML*: Combines URL lexical analysis (`backend/api/middleware/rate_limiter.py`) with deep learning text classification to instantly broadcast scam warnings to parents when suspicious scholarship or internship URLs are accessed.

### 3.5 Administrator Role (`admin.txt`)
* **Polyglot 7-Database Domain Federation**:
  * *Domains*: `auth_iam`, `academic_sis`, `family_heritage`, `institutions_governance`, `security_audit`, `career_pathways`, `notifications_events`.
  * *Monitoring*: `/api/admin/db/federation-health` and cross-database synchronization orchestration.
* **Master Developer Account Immunity**:
  * *Security*: Immutable trigger `prevent_delete_msrch` and ORM lifecycle listeners protecting master developer account `msrch`.

---

## 4. Storage Partitioning, Compression & Multi-Cloud Sync

To ensure high availability and minimal bandwidth cost across multi-region deployments:

* **Directory Structure**:
  ```text
  storage/logs/users/{user_email}/
  ├── last_work.json          # Atomic snapshot of current/previous session
  ├── login_history.jsonl     # Chronological login audits
  └── activity_stream.jsonl   # Real-time action telemetry
  ```
* **Gzip Compression Pipeline**:
  * Inactive logs older than 24 hours are automatically compressed into `.jsonl.gz` streams, achieving ~75% storage size reduction.
* **Multi-Cloud Adapter (`UserWorkLogger`)**:
  * Configurable via environment variables (`CLOUD_PROVIDER=gcs|s3|azure`).
  * Uses workload identity federation to securely upload compressed logs to `gs://eduidentity-user-logs/`, `s3://eduidentity-user-logs/`, or `azure-blob://eduidentity-user-logs/` upon session termination.

---

## 5. Security, Zero-Trust Hardening & Token Revocation

* **Token Revocation Blacklist**:
  * Valkey / Redis in-memory key-value store stores revoked JWT token IDs (`jti`) with TTL matching token expiration time. Logout requests add `jti` to blacklist; middleware validates `jti` on every authenticated request.
* **Content Security Policy (CSP)**:
  * Enforced HTTP headers: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;`.
* **Database Trigger Protections**:
  * `prevent_delete_msrch` trigger on PostgreSQL/SQLite ensures the universal developer account (`msrch`) can never be purged.

---

## 6. Phased Engineering Execution Roadmap

| Milestone | Target Date | Deliverables & Technical Scope |
| :--- | :--- | :--- |
| **Milestone 1** | Q4 2026 | Core FastAPI REST API, Polyglot 7-Database Domain Federation (`databases/*.db`), Unified 3-Category Chat (Personal, Private, Global), EduMentor Meta AI in WhatsApp (8 Educational Criteria via Gemini 3.8 Flash & RAG fallback), Alpine.js/Lit cyber-glassmorphism portal, and Gmail-partitioned user logging. *(Operational)* |
| **Milestone 2** | Q1-Q2 2027 | Alembic database migration automation, Redis distributed token blacklisting, Whisper voice counseling transcription, and XGBoost at-risk student classification. |
| **Milestone 3** | Q3-Q4 2027 | GraphSAGE credential fraud detection pipeline, GCS/S3 multi-cloud log sync adapters, and multilingual parent copilot (SeamlessM4T). |
| **Milestone 4** | 2028+ | Autonomous agentic study workflows (LangGraph), Kubernetes self-healing operators, Zero-Trust LLM security watchdog, and GPU-accelerated tensor serving. |
