# Database Development, Migration & Scaling Plan

> **Platform**: EduIdentityAI  
> **Objective**: Provide a comprehensive engineering blueprint for database architecture, normalization, Alembic migrations, security triggers, and multi-tenant scaling.

---

## 📑 Table of Contents

1. [Database Technology Stack & Selection](#1-database-technology-stack--selection)
2. [Entity-Relationship (ER) Design & 3NF Normalization](#2-entity-relationship-er-design--3nf-normalization)
3. [Database Migration Lifecycle (Alembic)](#3-database-migration-lifecycle-alembic)
4. [Security Triggers, Immutability & Constraints](#4-security-triggers-immutability--constraints)
5. [Indexing, Performance Tuning & High Availability](#5-indexing-performance-tuning--high-availability)
6. [Backup, Recovery & Multi-Tenant Sharding](#6-backup-recovery--multi-tenant-sharding)

---

## 1. Database Technology Stack & Selection

* **Local Development & Testing**: SQLite (`eduidentity.db`) for lightweight, zero-configuration local execution and rapid integration testing.
* **Production Deployment**: PostgreSQL 15+ hosted on managed cloud infrastructure (Render PostgreSQL, AWS RDS, or Azure Database for PostgreSQL) providing robust ACID compliance, connection pooling, and row-level security.

---

## 2. Entity-Relationship (ER) Design & 3NF Normalization

EduIdentityAI strictly enforces **Third Normal Form (3NF)** relational design to eliminate data redundancy and maintain referential integrity across all core entities:

* **`users` Table**:
  * Stores authentication credentials, roles (`student`, `faculty`, `admin`, `institute`, `parent`), and institutional association flags.
* **`students` Table**:
  * Stores normalized student academic records (`roll_no`, `name`, `email`, `department`, `semester`, `cgpa`, `attendance_percentage`, `credits_earned`, `backlogs`, `apaar_id`, `digilocker_verified`).
* **`institutions` Table**:
  * Manages institutional verification status (`PENDING` vs. `VERIFIED`) and onboarding requests.
* **`mentor_chats` Table**:
  * Stores direct secure messaging between students and faculty mentors (`student_id`, `mentor_username`, `sender_role`, `message`, `timestamp`).
* **`counseling_notices` Table**:
  * Stores faculty-dispatched attendance warnings and academic remediation logs.
* **`community_groups` & `community_messages` Tables**:
  * Relational tables managing role-segregated campus clubs, study groups, and community broadcast channels.

---

## 3. Database Migration Lifecycle (Alembic)

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

## 4. Security Triggers, Immutability & Constraints

* **Permanent Developer Immunity**:
  * Enforced via database triggers (e.g., `prevent_delete_msrch` in SQLite/PostgreSQL) which intercept `DELETE` operations on the `users` table for username `msrch`, raising an immediate exception.
* **Unique Constraints & Foreign Keys**:
  * Strict unique indexes on `roll_no`, `email`, and `username` prevent duplicate user registration and data corruption.

---

## 5. Indexing, Performance Tuning & High Availability

* **Indexing Strategy**:
  * B-Tree indexes on foreign keys (`student_id`, `group_id`, `mentor_username`) and frequently filtered columns (`email`, `roll_no`, `role`).
* **Connection Pooling**:
  * SQLAlchemy `QueuePool` configured with appropriate timeout and pool sizes to prevent database connection exhaustion under high concurrency.

---

## 6. Backup, Recovery & Multi-Tenant Sharding

* **Automated Snapshots**:
  * Daily automated database snapshots stored in encrypted cloud object storage (GCS/S3).
* **Point-in-Time Recovery (PITR)**:
  * Enabled on production PostgreSQL instances allowing restoration to any exact transaction timestamp in case of failure.
* **Multi-Tenant Sharding (Future State)**:
  * Partitioning large database tables by institutional tenant ID to ensure high-performance querying across millions of concurrent students.
