# EduIdentityAI — Federated Institutional Identity & Academic Record Guidance Platform

[![Digital Public Infrastructure](https://img.shields.io/badge/DPI-Digital%20Public%20Infrastructure-blue.svg)](https://github.com/)
[![React 18 & TypeScript](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-orange.svg)](https://vitejs.dev/)
[![FastAPI & SQLAlchemy](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11%20%7C%20SQLAlchemy-green.svg)](https://fastapi.tiangolo.com/)
[![Federated SQLite](https://img.shields.io/badge/Database-7--Tier%20Federated%20SQLite-purple.svg)](https://www.sqlite.org/)
[![Security & W3C VC](https://img.shields.io/badge/Security-W3C%20Verifiable%20Credentials%20%7C%20Zero%20Trust-red.svg)](https://www.w3.org/TR/vc-data-model/)

Official Digital Public Infrastructure (DPI) & AI Governance Platform designed to unify academic credentialing, decentralized identity management (APAAR / ABC ID), institutional governance, and real-time stakeholder counseling. Featuring a high-performance **React / TypeScript / Vite** Single Page Application, an asynchronous **FastAPI Python backend**, and a federated **7-database SQLite** architecture with W3C Verifiable Credential support.

---

## 🏛️ Comprehensive System Architecture

EduIdentityAI is engineered with a modular, 6-layer distributed architecture designed for zero-trust institutional environments, air-gapped campuses, and high-scalability cloud deployments.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        1. FRONTEND CLIENT (SPA)                         │
│   React 18 • TypeScript • Tailwind CSS • Vite Rollup Code Splitting     │
│   (Port 3000 / Vercel / Netlify / Docker Container)                   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS / REST / WebSockets
┌────────────────────────────────────▼────────────────────────────────────┐
│                        2. BACKEND API ENGINE                            │
│   Asynchronous FastAPI • SQLAlchemy ORM • Pydantic V2 Validation        │
│   JWT Auth • W3C VC Cryptographic Signing • Role Middleware (Port 8000) │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Multi-Bind SQLAlchemy Sessions
┌────────────────────────────────────▼────────────────────────────────────┐
│                 3. FEDERATED 7-DATABASE SQLite STORAGE                  │
│  • academic_sis.db       • auth_iam.db         • career_pathways.db     │
│  • family_heritage.db    • institutions_gov.db • notifications_events.db│
│  • security_audit.db                                                    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Append-Only File Streams
┌────────────────────────────────────▼────────────────────────────────────┐
│                 4. STORAGE LAKE & AUDIT LOG REPOSITORY                  │
│   Per-User Activity Streams & Immutable Biometric Verification Trails   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1. Frontend Client (`src/`)
- **Framework**: React 18 with TypeScript strict typing and Vite for lightning-fast HMR and optimized production bundles.
- **Styling & UI**: Tailwind CSS coupled with custom Vanilla CSS glassmorphism, responsive grid layouts, and dynamic theme switching.
- **State & Routing**: Context API (`AuthContext.tsx`), modular component trees, and immersive Instagram-style interactive widgets.

### 2. Backend API Engine (`backend/`)
- **Framework**: Asynchronous FastAPI service (`backend/main.py`) providing high-throughput non-blocking request handling.
- **Database Layer**: Multi-bind SQLAlchemy configuration (`backend/database.py`) routing queries across 7 specialized SQLite files with enforced foreign key constraints (`PRAGMA foreign_keys = ON;`).
- **Services & Security**: JWT bearer token authentication, bcrypt password hashing, W3C Verifiable Credential issuance & verification service (`src/lib/vcService.ts`), and role-based access control (RBAC) middleware.

### 3. Federated 7-Database SQLite Architecture (`databases/`)
Rather than relying on a monolithic database, EduIdentityAI isolates data domains across 7 independent SQLite stores to enforce privacy and granular access boundaries:
1. **`academic_sis.db`**: Student Information System records, APAAR/ABC IDs, enrollment history, transcripts, and fee ledgers.
2. **`auth_iam.db`**: User accounts, credentials, multi-factor authentication passkeys, and role mappings.
3. **`career_pathways.db`**: Skill taxonomies, mentorship matching matrices, AI guidance recommendations, and placement tracking.
4. **`family_heritage.db`**: Parent-guardian linkage, FERPA/GDPR compliance consent registries, and generational academic lineages.
5. **`institutions_governance.db`**: University accreditation metrics, NAAC/AICTE scorecards, faculty workload analytics, and compliance audit reports.
6. **`notifications_events.db`**: Real-time event streams, calendar appointments, push notifications, and broadcast announcements.
7. **`security_audit.db`**: Immutable security audit trails, adversarial attack logs, and biometric verification history.

### 4. Storage Lake & Dependencies (`storage/`, `dependencies/`)
- **Per-User Audit Lake (`storage/logs/users/`)**: Isolated activity logs and session records per user ID.
- **Air-Gapped Binaries (`dependencies/`)**: Pre-packaged Python wheel binaries (`python_wheels/`), node module caches (`node_cache/`), and offline AI model weight weights (`ai_weights/`).

---

## 🎓 The 5 Interconnected Operational Roles

EduIdentityAI provides tailored, role-specific workspaces designed for every stakeholder in the educational ecosystem:

1. **🎓 Student Portal**:
   - APAAR ID & ABC (Academic Bank of Credits) digital locker integration.
   - Enrolled Multi-Institution Hub with live transcript viewer.
   - 7-Module ERP covering attendance registers, fee ledgers, and scholarship Direct Benefit Transfer (DBT) tracking.
   - W3C Verifiable Credential (DID/VC) cryptographic export for instant employment or higher-ed verification.
2. **👩‍🏫 Faculty Desk**:
   - Passkey office hours calendar and student appointment scheduler.
   - Automated Early-Warning Risk Intervention engine flagging attendance drops or academic stress.
   - AI-Assisted Letter of Recommendation (LoR) generator synthesizing student achievements.
3. **👨‍👦 Parent & Guardian Portal**:
   - Encrypted direct faculty messaging and performance monitoring.
   - Tuition ledger tracking and secure payment gateway integration.
   - FERPA & GDPR-compliant privacy consent matrices controlling data sharing.
4. **🏛️ Institute Governance (Admin / NAAC)**:
   - NAAC and AICTE accreditation compliance scorecards with automated evidence collation.
   - Faculty workload and research performance analytics.
   - Admissions ScamShield screening pipeline detecting fraudulent credential submissions.
5. **🛡️ Root Admin Control Center**:
   - Federated database health & synchronization monitor.
   - Advanced threat detection cockpit reviewing security audit logs.
   - Dynamic RBAC policy editor and system-wide broadcast manager.

---

## 📸 Interactive Social & Multimedia Modules

EduIdentityAI bridges administrative rigor with modern, intuitive user engagement through Instagram-style immersive modules:

- **Instagram Direct Messages (DM) Chat (`UnifiedChat.tsx`)**:
  - 2-column split layout with categorized conversation threads (EduMentor AI, Campus Global Agora, Faculty Mentors).
  - Online presence indicators, typing status, and styled message bubbles supporting rich media and file attachments.
  - Interactive audio and video call simulation modals.
- **Instagram Reels & Video Feed (`VideoEditStudio.tsx`)**:
  - Vertical immersive video cards showcasing campus events, research breakthroughs, and tutorials.
  - Overlay action buttons for likes, comments, shares, and bookmarking.
  - Audio track indicators and reel publishing studio.
- **Instagram Stories Tray (`StoriesBar.tsx`)**:
  - Horizontal stories component featuring gradient rings for unread institutional notices and student startup spotlights.
  - Interactive story popup viewer with progress bars and quick reply inputs.

---

## ⚙️ Automation & Operational Info

EduIdentityAI includes robust automation scripts, seeding utilities, and cloud deployment pipelines to ensure seamless operation across local development machines and production clusters.

### 1. Automated Setup & Execution Scripts
- **Windows (`start.bat`)**:
  1. Automatically verifies Python and Node.js environments.
  2. Initializes and seeds all 7 federated SQLite databases (`python infrastructure/db_init/init_db.py`).
  3. Launches the asynchronous FastAPI backend server on port `8000`.
  4. Launches the Vite development server on port `3000`.
- **Linux / macOS (`start.sh`)**:
  - Shell equivalent executing database initialization, backend daemon startup, and frontend hot-reloading in parallel.

### 2. Database Initialization & Seeding (`infrastructure/db_init/init_db.py`)
- Automatically creates database tables across all 7 SQLite files if they do not exist.
- Seeds default administrative, faculty, and student test accounts, sample transcripts, and initial accreditation scorecards.

### 3. Docker & Containerization (`Dockerfile`, `infrastructure/docker-compose.yml`)
- Multi-stage production `Dockerfile` building optimized static assets and packaging the FastAPI backend.
- `docker-compose.yml` orchestrating the full application stack alongside Redis/Valkey caching and QDRANT vector database containers.

### 4. Migration Management (Alembic)
- Database schema changes in production are governed by Alembic (`alembic/`), supporting zero-downtime upgrades and rollbacks:
  ```bash
  alembic upgrade head
  ```

---

## 🛡️ Security & Adversarial Safeguards

EduIdentityAI enforces rigorous security principles, adhering to Zero Trust architecture and OWASP Top 10 defenses:

- **Zero Trust Data Invariants**: Strict validation rules ensuring users can only modify permitted records (e.g., users cannot self-assign administrative roles).
- **Immutable Biometric & Audit Logs**: Biometric verification attempts and security events are written to append-only tables in `security_audit.db`, preventing retroactive tampering.
- **"Dirty Dozen" Threat Mitigation**: Pre-tested security specifications guarding against privilege escalation, path traversal, string bombing (Denial of Wallet), and ghost-key injection.
- **Cryptographic W3C VCs**: Digital credentials are cryptographically signed using DID standards, ensuring tamper-evident verification.

---

## 🌟 What It Helps In (Use Cases & Value Proposition)

EduIdentityAI solves critical pain points in modern educational administration and digital identity ecosystems:
1. **Eliminating Credential Fraud**: Replaces paper certificates and easily forged PDFs with cryptographically verifiable W3C Verifiable Credentials tied to decentralized student IDs (APAAR/ABC).
2. **Streamlining Accreditation & Compliance**: Automates the collection and verification of NAAC, AICTE, and institutional governance metrics, reducing audit preparation time by 80%.
3. **Proactive Student Risk Mitigation**: Early-warning AI monitoring detects attendance drops and academic stress before failure occurs, enabling timely faculty intervention.
4. **Transparent Stakeholder Collaboration**: Bridges the communication gap between students, faculty, and parents through secure messaging, transparent fee tracking, and GDPR-compliant consent controls.
5. **Unified Digital Public Infrastructure (DPI)**: Acts as an open, modular framework for universities and governmental bodies to deploy sovereign academic identity systems.

---

## 🚀 How to Use & Getting Started Guide

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)

### Quick Start (Automated)
- **Windows**: Double-click or execute `start.bat` in your terminal.
- **Linux / macOS**: Execute `./start.sh` in your terminal.

### Manual Setup & Execution

1. **Install Python Dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. **Initialize Databases**:
   ```bash
   python infrastructure/db_init/init_db.py
   ```
3. **Start the FastAPI Backend**:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
4. **Install Frontend Dependencies & Run Vite**:
   ```bash
   npm install
   npm run dev
   ```
5. **Access the Application**:
   - Open your browser at `http://localhost:3000`
   - API Documentation (Swagger UI): `http://localhost:8000/docs`

---

## 📄 License & Documentation
- Refer to `presentation.md`, `security_spec.md`, and the `n_defined/` directory for detailed architectural research papers, presentation decks, and future roadmaps.
