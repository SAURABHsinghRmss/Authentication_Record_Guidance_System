# EduIdentityAI — Student Authentication, Record & Guidance System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![Alpine.js](https://img.shields.io/badge/Alpine.js-3.17-8BC0D0?logo=alpinedotjs&logoColor=white)](https://alpinejs.dev)
[![Lit](https://img.shields.io/badge/Lit-3.3-324FFF?logo=lit&logoColor=white)](https://lit.dev)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.1-D71F00?logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org)

**EduIdentityAI** is a high-performance, modular academic identity management, record governance, and AI-driven student guidance platform. It integrates multi-factor biometric authentication, APAAR/DigiLocker verification, dense RAG academic advisement, real-time WebSocket telemetry, and partitioned user work logging ready for Cloud Storage lakes.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [System Architecture & Directory Layout](#-system-architecture--directory-layout)
- [Universal Developer Account](#-universal-developer-account)
- [User Work Logging & Cloud Storage](#-user-work-logging--cloud-storage)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Running on Windows](#running-on-windows)
  - [Running on Linux / macOS](#running-on-linux--macos)
- [API Reference & Key Endpoints](#-api-reference--key-endpoints)
- [Automated Testing](#-automated-testing)
- [Architecture & Roadmap Documentation](#-architecture--roadmap-documentation)

---

## 🌟 Key Features

1. **Academic Identity & Institutional Verification**:
   - Strict institutional sign-up verification with approval workflows for universities.
   - Roll-based access control (RBAC): `student`, `faculty`, `admin`.
   - 2FA one-time passcodes (OTP) and Math CAPTCHA bot mitigation.

2. **Multimodal Biometric & Credential Verification**:
   - Simulated neural feature extraction and cosine similarity across **Face** (DeepFace), **Voice** (SpeechBrain), **OCR** (EasyOCR), and **Multimodal Fusion**.
   - Automated sandbox verification for **APAAR ID** (National Academic Depository) and **DigiLocker** degree credentials.

3. **Academic Guidance & RAG Advisement**:
   - AI-driven guidance generating personalized recommendations based on CGPA, attendance thresholds, and backlogs.
   - Semantic Retrieval-Augmented Generation (RAG) answering academic policies (SWAYAM/NPTEL credit transfer, minimum attendance).

4. **Permanent Universal Developer User**:
   - Master account `msrch` with credentials for developer testing and bug inspection.
   - Immutable anti-deletion protection via SQLite database triggers and SQLAlchemy ORM lifecycle listeners.

5. **Gmail-Partitioned User Work Logging & Cloud Storage Readiness**:
   - Isolated log storage directories partitioned by user Gmail/email in `storage/logs/users/{user_email}/`.
   - Tracks previous session work snapshots at each login, continuous session activity streams, and cloud sync readiness for Google Cloud Storage (`gs://eduidentity-user-logs/...`).

---

## 📂 System Architecture & Directory Layout

```text
Authentication_Record_Guidance_System/
├── backend/                        # FastAPI REST Application & Core Logic
│   ├── api/
│   │   ├── main.py                 # Application factory, lifespan, CORS, rate limiter
│   │   ├── dependencies.py         # JWT extraction, OAuth2 Bearer, RBAC guards
│   │   ├── middleware/             # RateLimiterMiddleware with testclient bypass
│   │   └── routes/
│   │       ├── auth_routes.py      # Auth, user profile, work logs, biometrics, OTP
│   │       ├── student_routes.py   # Student CRUD, academic records, guidance engine
│   │       ├── rag_router.py       # Knowledge base RAG search endpoint
│   │       └── ws_router.py        # Real-time WebSocket telemetry stream
│   ├── core/
│   │   └── config.py               # Pydantic/Environment settings, Cloud Storage config
│   ├── models/
│   │   ├── student.py              # SQLAlchemy models & Pydantic schemas
│   │   └── sample_students.json    # Sample student data and RAG knowledge base
│   ├── services/
│   │   ├── db.py                   # SQLAlchemy engine, session maker, declarative base
│   │   └── user_work_logger.py     # Partitioned user work logging & cloud sync adapter
│   ├── tests/
│   │   └── test_api.py             # 10 comprehensive unit & integration tests
│   └── requirements.txt            # Python dependencies with cross-platform markers
├── dependencies/                   # Offline wheel cache, AI model weights, & node cache
│   ├── README.md                   # Offline air-gapped installation guide
│   ├── python_wheels/              # Pre-downloaded Python wheel binaries
│   ├── ai_weights/                 # Pre-trained neural model weights
│   └── node_cache/                 # Offline npm package cache
├── frontend/                       # Lit & Alpine.js Web Application
│   ├── index.html                  # Cyber-glassmorphism portal UI & components
│   ├── js/app.js                   # Alpine.js state store & API communications
│   ├── css/style.css               # Styling definitions and animations
│   └── package.json                # Frontend dependencies (lit, alpinejs, vite)
├── ai_engine/                      # Biometrics & Vector Store Engine
│   └── pipelines/
│       ├── biometric_worker.py     # Biometric verification pipeline simulations
│       └── vector_store.py         # In-memory vector store & keyword overlap scoring
├── storage/                        # Persistent & Staged Application Data
│   └── logs/users/                 # Partitioned user log folders by Gmail/email
│       ├── <user_email>/
│       │   ├── last_work.json      # Latest work snapshot and previous session state
│       │   ├── login_history.jsonl # Append-only chronological login stream
│       │   └── activity_stream.jsonl # Real-time session action telemetry
├── infrastructure/                 # Containerized Infrastructure Services
│   └── docker-compose.yml          # PostgreSQL 15 & Valkey 7.2 container definitions
├── n_defined/                      # System Specifications & Roadmaps
│   ├── current_definitions.md      # End-to-end connectivity matrix
│   ├── internet_deployment_phases.md # Phased Render.com cloud deployment roadmap
│   ├── pending_definitions.md      # Future enterprise scope & neural GPU scaling
│   └── project_improvements.md     # Security, RAG, and cloud lake enhancement roadmap
├── eduidentity.db                  # Default SQLite database file
├── start_system.bat                # Windows startup script (Backend + Frontend)
└── start_system.sh                 # Linux/macOS startup script (Containers + App)
```

---

## 🛡️ Universal Developer Account

For testing, auditing, and bug reproduction, a permanent universal master account is pre-configured:

| Parameter | Value |
| :--- | :--- |
| **Username** | `msrch` |
| **Password** | `msrch1410#` |
| **Role** | `admin` |
| **Permissions** | Full administrative and testing access |
| **Immutability** | **Permanent (Anti-Deletion)**: Protected by SQLite trigger `prevent_delete_msrch` and SQLAlchemy `before_delete` hook. Cannot be deleted via API or ORM, but profile attributes (email, full name, password) can be altered as needed. |

---

## 🗄️ User Work Logging & Cloud Storage

Every time a user logs in, the platform captures their session in an isolated storage directory named after their Gmail/email:

- **Directory Path**: `storage/logs/users/{user_email}/`
- **Session Continuity**: When logging in, the system reads `last_work.json`, retrieves what the user was doing in their prior session (`previous_work`), and updates `current_work` with the new session ID and timestamps.
- **Action Recording**: Users or background operations call `POST /api/auth/work-logs/me/record` to record actions into `activity_stream.jsonl` and keep `last_work.json` updated.
- **Cloud Storage Readiness**: Each file is formatted and staged with a canonical Cloud Storage URI (`gs://eduidentity-user-logs/users/{user_email}/last_work.json`). Administrators can trigger staging verification via `POST /api/auth/work-logs/cloud-sync`.

---

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.10+ (tested through Python 3.13 on x86_64 and ARM64)
- **Node.js**: 18+ & npm
- *(Optional)* **Docker & Docker Compose**: For running PostgreSQL and Valkey

### Running on Windows

1. Double-click or run:
   ```cmd
   start_system.bat
   ```
2. The batch script will automatically:
   - Launch the FastAPI Backend on `http://localhost:8000`
   - Launch the Vite Frontend Portal on `http://localhost:3000`

### Running on Linux / macOS

1. Grant execution permissions:
   ```bash
   chmod +x start_system.sh
   ```
2. Execute the startup script:
   ```bash
   ./start_system.sh
   ```

### Manual Execution

**Backend**:
```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev -- --port 3000
```

---

## 🌐 API Reference & Key Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Authenticate user, log session in user Gmail directory, return JWT token and last work summary |
| **Auth** | `POST` | `/api/auth/register` | Institutional user registration |
| **Profile** | `GET` | `/api/auth/me` | Fetch authenticated user profile (`is_permanent` flag) |
| **Profile** | `PUT` | `/api/auth/users/{username}` | Alter profile attributes (name, email, password) |
| **Profile** | `DELETE`| `/api/auth/users/{username}` | Delete user (permanently rejects deletion of `msrch`) |
| **Work Logs** | `GET` | `/api/auth/work-logs/me/last-work` | Retrieve last work snapshot from user's storage location |
| **Work Logs** | `POST`| `/api/auth/work-logs/me/record` | Record work actions in active session |
| **Work Logs** | `GET` | `/api/auth/work-logs/me/history`| Fetch chronological login history stream |
| **Work Logs** | `GET` | `/api/auth/work-logs/locations` | *(Admin only)* List all user Gmail storage folders |
| **Work Logs** | `POST`| `/api/auth/work-logs/cloud-sync`| *(Admin only)* Verify staging and trigger Cloud Storage sync |
| **Students** | `GET` | `/api/students/` | List student records with filtering |
| **Students** | `POST`| `/api/students/` | Create student record (Admin/Faculty) |
| **Students** | `GET` | `/api/students/{id}/guidance` | Compute AI academic guidance & alerts |
| **AI RAG** | `POST`| `/rag_query` | Query institutional knowledge base |
| **Biometrics**| `POST`| `/api/auth/biometric-verify` | Verify face, voice, OCR, or fusion biometric match |
| **System** | `GET` | `/health` | Health check & service connectivity status |
| **Metrics** | `GET` | `/metrics` | Prometheus metrics scrape endpoint |
| **Docs** | `GET` | `/docs` | Swagger / OpenAPI interactive documentation |

---

## 🧪 Automated Testing

The backend includes a comprehensive automated test suite covering authentication, RBAC, CRUD, RAG, biometrics, developer account permanence, and user Gmail work logging:

```bash
python -m unittest backend/tests/test_api.py
```

All 10 test cases run in `< 0.5s` and execute against testclient with rate-limiting bypass.

---

## 📖 Architecture & Roadmap Documentation

Detailed architectural and deployment guides are available in the **[`n_defined/`](n_defined/)** folder:

- **[`dependencies_and_cloud_computing_plan.md`](n_defined/dependencies_and_cloud_computing_plan.md)**: Master architecture blueprint for software dependencies, multi-cloud topologies (AWS, Azure, GCP, Render), FinOps, and disaster recovery.
- **[`current_definitions.md`](n_defined/current_definitions.md)**: End-to-end trace from frontend UI to database persistence.
- **[`internet_deployment_phases.md`](n_defined/internet_deployment_phases.md)**: Phased cloud deployment roadmap (Render.com, DNS, SSL, and Phase 6 Cloud Storage Lake migration).
- **[`pending_definitions.md`](n_defined/pending_definitions.md)**: Enterprise scaling specifications for GPU neural inferencing, OIDC, and live GCS bucket streaming.
- **[`project_improvements.md`](n_defined/project_improvements.md)**: Roadmap for multi-cloud storage backends, automated session restoration cards, and log compression.
