# Database Development, Federation & Scaling Blueprint

> **Platform**: EduIdentityAI  
> **Objective**: Comprehensive engineering blueprint for database architecture, 3NF normalization, Alembic migrations, security triggers, 7-domain polyglot federation, and unified chat persistence.

---

## 📑 Table of Contents

1. [Database Technology Stack & Selection](#1-database-technology-stack--selection)
2. [Entity-Relationship (ER) Design & 3NF Normalization](#2-entity-relationship-er-design--3nf-normalization)
3. [Polyglot 7-Database Domain Federation Architecture](#3-polyglot-7-database-domain-federation-architecture)
4. [Unified 3-Category Chat & Meta AI Storage Design](#4-unified-3-category-chat--meta-ai-storage-design)
5. [Database Migration Lifecycle (Alembic)](#5-database-migration-lifecycle-alembic)
6. [Security Triggers, Immutability & Constraints](#6-security-triggers-immutability--constraints)
7. [Indexing, Performance Tuning & High Availability](#7-indexing-performance-tuning--high-availability)
8. [Backup, Recovery & Multi-Tenant Sharding](#8-backup-recovery--multi-tenant-sharding)

---

## 1. Database Technology Stack & Selection

* **Local Development & Testing**: SQLite (`eduidentity.db`) alongside 7 isolated domain SQLite instances in `databases/` for lightweight, zero-configuration local execution and rapid integration testing.
* **Production Deployment**: PostgreSQL 15+ hosted on managed cloud infrastructure (Render PostgreSQL, AWS RDS, or Azure Database for PostgreSQL) providing robust ACID compliance, connection pooling, and row-level security.

---

## 2. Entity-Relationship (ER) Design & 3NF Normalization

EduIdentityAI strictly enforces **Third Normal Form (3NF)** relational design to eliminate data redundancy and maintain referential integrity across all core entities:

* **`users` Table**: Authentication credentials, roles (`student`, `faculty`, `admin`, `institute`, `parent`), and institutional association flags.
* **`students` Table**: Normalized student academic records (`roll_no`, `name`, `email`, `department`, `semester`, `cgpa`, `attendance_percentage`, `credits_earned`, `backlogs`, `apaar_id`, `digilocker_verified`).
* **`institutions` Table**: Institutional verification status (`PENDING` vs. `VERIFIED`) and onboarding requests.
* **`mentor_chats` Table**: Direct secure messaging between students and faculty mentors (`student_id`, `mentor_username`, `sender_role`, `message`, `timestamp`).
* **`counseling_notices` Table**: Faculty-dispatched attendance warnings and academic remediation logs.
* **`community_groups` & `community_messages` Tables**: Relational tables managing role-segregated campus clubs, study groups, and community broadcast channels.

---

## 3. Polyglot 7-Database Domain Federation Architecture

To prevent monolithic database contention and provide domain-driven boundary isolation, EduIdentityAI implements a **7-Database Domain Federation Architecture** managed by `backend/services/db_federation.py`:

| Domain | Database File | Core Entities & Responsibility | Isolation Rationale |
|:---|:---|:---|:---|
| **Domain 1: Auth & IAM** | `databases/auth_iam.db` | Users, hashed passwords, roles, 2FA states, permissions | Zero-trust authentication perimeter; credentials never co-located with academic transcripts. |
| **Domain 2: Academic SIS** | `databases/academic_sis.db` | Students, enrollments, CGPA, courses, attendance records | High-frequency read/write queries isolated from credential authentication. |
| **Domain 3: Family & Heritage** | `databases/family_heritage.db` | Parent-ward links, socio-economic background, verification states | Sensitive personal identifiers protected with independent privacy boundaries. |
| **Domain 4: Institutional Governance** | `databases/institutions_governance.db` | Colleges, accreditation codes (AICTE, UGC, NAAC), tenant rules | Multi-institutional governance separated from student-level operational records. |
| **Domain 5: Security & Audit** | `databases/security_audit.db` | Immutable activity streams, login telemetry, tamper-detection hashes | Append-only security audit log preventing retroactive log tampering. |
| **Domain 6: Career Pathways** | `databases/career_pathways.db` | Technical skill roadmaps, placement drives, internships | Autonomous placement cell queries decoupled from core registrar records. |
| **Domain 7: Notifications & Events** | `databases/notifications_events.db` | Real-time alerts, notice broadcasts, counseling dispatches | Ephemeral notification queues keeping operational tables lean. |

---

## 4. Unified 3-Category Chat & Meta AI Storage Design

Unified messaging is persisted in the `unified_chat_messages` table across 3 operational envelopes:

```sql
CREATE TABLE IF NOT EXISTS unified_chat_messages (
    id VARCHAR PRIMARY KEY,
    category VARCHAR NOT NULL,             -- 'PERSONAL', 'PRIVATE', 'GLOBAL'
    channel_id VARCHAR NOT NULL,           -- 'campus_global', 'direct_u1_u2', 'grp_ai_club'
    sender_username VARCHAR NOT NULL,
    sender_name VARCHAR NOT NULL,
    sender_role VARCHAR NOT NULL,
    recipient_username VARCHAR,            -- Present for PERSONAL 1-on-1 direct messages
    message TEXT NOT NULL,
    criteria VARCHAR,                      -- Active Educational Criterion (e.g. POLICY_REGULATION, QUIZ_GENERATION)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT 0
);
CREATE INDEX IF NOT EXISTS ix_unified_chat_category ON unified_chat_messages(category);
CREATE INDEX IF NOT EXISTS ix_unified_chat_channel ON unified_chat_messages(channel_id);
CREATE INDEX IF NOT EXISTS ix_unified_chat_sender ON unified_chat_messages(sender_username);
CREATE INDEX IF NOT EXISTS ix_unified_chat_recipient ON unified_chat_messages(recipient_username);
```

### EduMentor Meta AI Storage
When EduMentor Meta AI (`edumentor_ai`) synthesizes educational responses, messages are recorded with:
* `sender_username = "edumentor_ai"`
* `sender_role = "ai_assistant"`
* `criteria = "<ACTIVE_CRITERION_ID>"` (e.g., `POLICY_REGULATION`, `QUIZ_GENERATION`, `CONCEPT_TUTORING`, `THREAD_SUMMARIZATION`, `ACADEMIC_INTEGRITY`, `CAREER_PATHWAY`, `EXAM_REVISION`, `CODE_LAB_ASSIST`)

---

## 5. Database Migration Lifecycle (Alembic)

All schema evolutions are managed via **Alembic** version-controlled migration scripts (`alembic/versions/`).

* **Migration Workflow**:
  1. Modify SQLAlchemy ORM models in `backend/models/student.py`.
  2. Generate migration script:
     ```bash
     alembic revision --autogenerate -m "description_of_change"
     ```
  3. Review generated migration script in `alembic/versions/`.
  4. Apply migration to database:
     ```bash
     alembic upgrade head
     ```

---

## 6. Security Triggers, Immutability & Constraints

* **Permanent Developer Immunity**:
  * Enforced via database triggers (e.g., `prevent_delete_msrch` in SQLite/PostgreSQL) which intercept `DELETE` operations on the `users` table for username `msrch`, raising an immediate exception.
* **SQLAlchemy ORM Event Hooks**:
  * `@event.listens_for(UserModel, 'before_delete')` intercepts programmatic ORM deletions of protected master accounts.
* **Unique Constraints & Foreign Keys**:
  * Strict unique indexes on `roll_no`, `email`, and `username` prevent duplicate user registration and data corruption.

---

## 7. Indexing, Performance Tuning & High Availability

* **Indexing Strategy**:
  * B-Tree indexes on foreign keys (`student_id`, `channel_id`, `recipient_username`) and frequently filtered columns (`email`, `roll_no`, `role`, `category`).
* **Connection Pooling**:
  * SQLAlchemy `QueuePool` configured with appropriate timeout and pool sizes to prevent database connection exhaustion under high concurrency.

---

## 8. Backup, Recovery & Multi-Tenant Sharding

* **Automated Snapshots**:
  * Daily automated database snapshots stored in encrypted cloud object storage (GCS/S3).
* **Point-in-Time Recovery (PITR)**:
  * Enabled on production PostgreSQL instances allowing restoration to any exact transaction timestamp in case of failure.
* **Multi-Tenant Sharding**:
  * Partitioning domain tables by institutional tenant ID to ensure high-performance querying across millions of concurrent students.
