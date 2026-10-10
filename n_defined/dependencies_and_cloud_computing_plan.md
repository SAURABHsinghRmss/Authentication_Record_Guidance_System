# EduIdentityAI — Dependencies & Cloud Computing Master Plan

This document establishes the strategic, architectural, and operational roadmap for managing software dependencies and executing enterprise-grade cloud computing deployments for the **EduIdentityAI (Student Authentication, Record & Guidance System)** ecosystem.

---

## 📑 Table of Contents

- [1. Executive Summary & Architectural Objectives](#1-executive-summary--architectural-objectives)
- [2. Comprehensive Dependency Architecture & Lifecycle Plan](#2-comprehensive-dependency-architecture--lifecycle-plan)
  - [2.1 Backend Core Runtime Stack (Python)](#21-backend-core-runtime-stack-python)
  - [2.2 AI, Biometrics & Vector Search Dependency Profiles](#22-ai-biometrics--vector-search-dependency-profiles)
  - [2.3 Multi-Cloud SDK & Storage Adapter Dependencies](#23-multi-cloud-sdk--storage-adapter-dependencies)
  - [2.4 Frontend Runtime & Build Stack (Node.js)](#24-frontend-runtime--build-stack-nodejs)
  - [2.5 System-Level & Container Host Dependencies](#25-system-level--container-host-dependencies)
  - [2.6 Offline, Air-Gapped & Cached Dependency Architecture (`dependencies/`)](#26-offline-air-gapped--cached-dependency-architecture-dependencies)
  - [2.7 Dependency Supply Chain Security & Vulnerability Auditing](#27-dependency-supply-chain-security--vulnerability-auditing)
- [3. Enterprise Cloud Computing Architecture & Strategy](#3-enterprise-cloud-computing-architecture--strategy)
  - [3.1 Multi-Tier Cloud Topology Blueprint](#31-multi-tier-cloud-topology-blueprint)
  - [3.2 Cloud Provider Deployment Blueprints](#32-cloud-provider-deployment-blueprints)
    - [Tier A: Rapid PaaS Deployment (Render.com + Vercel)](#tier-a-rapid-paas-deployment-rendercom--vercel)
    - [Tier B: AWS Enterprise Cloud Architecture](#tier-b-aws-enterprise-cloud-architecture)
    - [Tier C: Microsoft Azure Institutional Campus Cloud](#tier-c-microsoft-azure-institutional-campus-cloud)
    - [Tier D: Google Cloud Platform (GCP) Cloud Run & GKE](#tier-d-google-cloud-platform-gcp-cloud-run--gke)
  - [3.3 Cloud Storage Lake Architecture for User Work Logs](#33-cloud-storage-lake-architecture-for-user-work-logs)
  - [3.4 Auto-Scaling, Concurrency & High Availability](#34-auto-scaling-concurrency--high-availability)
  - [3.5 Cloud Security, Zero Trust & Compliance Posture](#35-cloud-security-zero-trust--compliance-posture)
  - [3.6 Cloud FinOps, Resource Rightsizing & Cost Matrix](#36-cloud-finops-resource-rightsizing--cost-matrix)
  - [3.7 Disaster Recovery (DR), Backup & Business Continuity](#37-disaster-recovery-dr-backup--business-continuity)
- [4. Phased Cloud Implementation Timeline & Milestones](#4-phased-cloud-implementation-timeline--milestones)

---

## 1. Executive Summary & Architectural Objectives

EduIdentityAI combines institutional role-based identity management, multimodal biometrics (face, voice, OCR), APAAR/DigiLocker credential governance, academic guidance through RAG semantic search, real-time WebSocket telemetry, and Gmail-partitioned user work logging.

To scale reliably from local developer workstations to university campus networks and multi-institutional cloud backbones, this plan defines:
1. **Deterministic Dependency Management**: Predictable, vulnerability-free, and air-gapped dependency hierarchies separating lightweight CPU development from heavy GPU production.
2. **Cloud-Native Computing Topologies**: Multi-cloud deployment patterns across Render, AWS, Azure, and GCP utilizing managed container services, distributed caching, vector databases, and resilient cloud storage lakes.
3. **High Availability & Low-Latency SLAs**: Sub-100ms API responses, 99.95% uptime guarantees, zero-downtime rolling upgrades, and sub-15-minute Recovery Point Objectives (RPO).

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │                    EduIdentityAI Edge / CDN Layer                      │
   │           Cloudflare / AWS CloudFront / Azure Front Door               │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │ HTTPS / WSS (TLS 1.3)
   ┌───────────────────────────────────▼────────────────────────────────────┐
   │                Ingress & Load Balancer / API Gateway                   │
   │                 Nginx / Traefik / AWS ALB / Azure AGW                  │
   └─────────────────┬──────────────────────────────────┬───────────────────┘
                     │                                  │
   ┌─────────────────▼──────────────┐   ┌───────────────▼──────────────────┐
   │    FastAPI ASGI Pod Cluster    │   │  Static Frontend Portal Pods     │
   │  (Uvicorn Multi-Worker Pool)   │   │  (Lit + Alpine.js via Nginx/CDN) │
   └─────────────────┬──────────────┘   └──────────────────────────────────┘
                     │
       ┌─────────────┼─────────────────────────────┐
       │             │                             │
┌──────▼──────┐┌─────▼───────────────┐ ┌───────────▼─────────────┐ ┌─────────▼──────────────┐
│  PostgreSQL ││ Valkey / Redis 7.2  │ │   Qdrant Vector Cluster │ │ Multi-Cloud Object Lake│
│ (Relational ││ (Rate-limit, Cache, │ │ (Dense Embeddings RAG & │ │ (S3 / GCS / Azure Blob │
│ DB Cluster) ││  Session Revocation)│ │  Cosine Similarity)     │ │  Partitioned User Logs)│
└─────────────┘└─────────────────────┘ └─────────────────────────┘ └────────────────────────┘
```

---

## 2. Comprehensive Dependency Architecture & Lifecycle Plan

### 2.1 Backend Core Runtime Stack (Python)

The core backend relies on a strictly bounded Python stack. The dependencies are pinned in `backend/requirements.txt` with cross-platform environment markers:

| Dependency Package | Minimum Version | Category | Architectural Role | Production Policy |
| :--- | :--- | :--- | :--- | :--- |
| `fastapi` | `0.100.0+` | Framework | High-performance asynchronous REST API gateway and OpenAPI engine | Pinned minor; automated patch updates |
| `uvicorn` | `0.22.0+` | ASGI Server | Lightning-fast ASGI HTTP/WebSocket server implementation | Multi-worker execution with uvloop |
| `pydantic` | `2.0.0+` | Validation | Rust-accelerated schema validation and serialization | Strict v2 core with zero v1 deprecation warnings |
| `sqlalchemy` | `2.0.0+` | ORM & Engine | Async-capable Object Relational Mapper for database abstraction | Declarative 2.0 syntax; connection pooling |
| `psycopg2-binary` | `2.9.6+` | DB Driver | High-throughput PostgreSQL dialect connection driver | Multi-arch binary fallback for x86_64 / arm64 |
| `python-jose[cryptography]`| `3.3.0+` | Security | RFC-7519 compliant JSON Web Token (JWT) encoding and verification | HS256 / RS256 algorithm enforcement |
| `passlib[bcrypt]` | `1.7.4+` | Security | Adaptive salted password hashing preventing rainbow-table attacks | Work factor 12 (default) |
| `python-multipart` | `0.0.6+` | Ingestion | Streaming parser for file uploads (biometric scans, degree certs) | Safe memory buffer limits |
| `prometheus-client` | `0.17.0+` | Telemetry | In-memory counter and histogram metrics exporter for `/metrics` | Integrated with Grafana & SLA monitors |
| `websockets` | `11.0+` | Transport | Async bidirectional WebSocket engine for real-time audit streaming | Reconnection backoff & ping keepalive |
| `python-dotenv` | `1.0.0+` | Config | Twelve-Factor App environment configuration loader | Enforces zero secret leakage in source tree |
| `requests` | `2.31.0+` | HTTP Client | Synchronous fallback HTTP client for external verification webhooks | Strict timeout policies (max 5s) |
| `pillow` | `9.5.0+` | Processing | Image parsing and preprocessing for student ID cards and OCR | Memory-bounded decode checks |
| `numpy` | `1.24.0+` | Math / Vectors | High-speed array vector manipulation for similarity cosine metrics | Vectorized SIMD execution |

---

### 2.2 AI, Biometrics & Vector Search Dependency Profiles

To prevent high-overhead GPU dependencies from impeding local development, the system implements a dual-profile dependency model:

```
[Profile 1: Local / CI Mode (Light)]       [Profile 2: Enterprise Cloud Mode (Heavy)]
• CPU-only execution                       • NVIDIA CUDA 12.x / TensorRT acceleration
• NumPy vector similarity                  • ONNX Runtime GPU (onnxruntime-gpu)
• In-memory vector index                   • Managed Qdrant vector database (qdrant-client)
• Synthetic biometric verification stubs   • DeepFace (FaceNet512 / InsightFace)
• Zero binary compilation hurdles          • SpeechBrain (ECAPA-TDNN audio embeddings)
                                           • EasyOCR / Tesseract (Neural OCR pipeline)
                                           • Hugging Face Transformers (Qwen3-0.5B embed)
```

#### Dedicated Production AI Requirements (`backend/requirements-ai.txt`):
```text
# Production AI & Neural Inferencing Extensions
qdrant-client>=1.7.0
onnxruntime-gpu>=1.16.0; sys_platform == 'linux'
torch>=2.1.0; sys_platform == 'linux'
torchvision>=0.16.0; sys_platform == 'linux'
torchaudio>=2.1.0; sys_platform == 'linux'
deepface>=0.0.84
speechbrain>=0.5.15
easyocr>=1.7.1
transformers>=4.36.0
accelerate>=0.25.0
```

---

### 2.3 Multi-Cloud SDK & Storage Adapter Dependencies

The storage abstraction layer (`backend/services/user_work_logger.py`) dynamically synchronizes partitioned user Gmail session logs across major cloud object providers:

```text
# Multi-Cloud Object Storage Drivers
google-cloud-storage>=2.14.0   # Google Cloud Storage (gs://)
boto3>=1.34.0                  # AWS S3 (s3://)
azure-storage-blob>=12.19.0    # Azure Blob Storage (az:// / https://*.blob.core.windows.net)
azure-identity>=1.15.0        # Azure Managed Identity credential resolution
```

---

### 2.4 Frontend Runtime & Build Stack (Node.js)

The frontend is built using lightweight standard Web Components and reactive primitives, eliminating massive monolithic framework bundles:

```
frontend/
├── package.json
├── package-lock.json
├── vite.config.js
└── node_modules/
```

| Package | Version | Layer | Role |
| :--- | :--- | :--- | :--- |
| `lit` | `^3.0.0` | Components | Standard-based, performant reactive Web Components with shadow DOM |
| `alpinejs` | `^3.13.0` | UI State | Declarative UI reactive data binding and modal controllers |
| `vite` | `^5.0.0` | Bundler | Rollup-based instant Hot Module Replacement (HMR) and production optimizer |
| `chart.js` *(Planned)* | `^4.4.0` | Telemetry | Real-time interactive canvas graphs for audit metrics and attendance curves |

---

### 2.5 System-Level & Container Host Dependencies

In containerized and cloud VPS environments, host packages must be installed prior to Python wheel compilation:

```bash
# Debian / Ubuntu Host Packages (Dockerfile)
apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsndfile1 \
    ffmpeg \
    curl \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*
```

* **`libpq-dev`**: Required for compiling PostgreSQL binary adapters.
* **`libgl1-mesa-glx` & `libglib2.0-0`**: Headless graphics and OpenCV runtime requirements for facial biometric verification.
* **`libsndfile1` & `ffmpeg`**: High-performance audio stream decoding for speech biometric analysis.

---

### 2.6 Offline, Air-Gapped & Cached Dependency Architecture (`dependencies/`)

To support institutional environments with strict outbound firewall policies, intranet-only air gaps, or reproducible offline container builds, the repository provides dedicated vendor directories:

```text
dependencies/
├── README.md               # Operational guide for populating & consuming offline bundles
├── python_wheels/          # Pre-downloaded .whl binaries for Python dependencies
├── ai_weights/             # Pre-trained neural model checkpoints & vector weights
└── node_cache/             # Offline npm tarballs and tarball archive files
```

#### Offline Operation Procedures:
1. **Packaging Python Wheels**:
   ```bash
   pip download -r backend/requirements.txt -d dependencies/python_wheels/
   ```
2. **Offline Installation from Cache**:
   ```bash
   pip install --no-index --find-links=dependencies/python_wheels/ -r backend/requirements.txt
   ```
3. **Pre-caching Neural Weights in `dependencies/ai_weights/`**:
   - `facenet512_weights.h5` (~92 MB)
   - `ecapa_tdnn_speechbrain.pt` (~85 MB)
   - `qwen3_0_5b_embeddings.onnx` (~180 MB)
4. **Offline Node Packaging**:
   ```bash
   cd frontend
   npm cache add lit@3.0.0 alpinejs@3.13.0 vite@5.0.0 --cache ../dependencies/node_cache/
   ```

---

### 2.7 Dependency Supply Chain Security & Vulnerability Auditing

To maintain compliance and eliminate known vulnerabilities (CVEs):
1. **Automated Weekly Audits**:
   ```bash
   # Python dependency audit
   pip install pip-audit
   pip-audit -r backend/requirements.txt --strict

   # Node.js dependency audit
   cd frontend && npm audit --audit-level=high
   ```
2. **Dependabot / Renovate CI**:
   - Automated pull requests on CVE publication with automated unit test execution (`python -m unittest backend/tests/test_api.py`).

---

## 3. Enterprise Cloud Computing Architecture & Strategy

### 3.1 Multi-Tier Cloud Topology Blueprint

```
[Public Internet Users: Students / Faculty / Admins / IoT Gateways]
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │ 1. DNS & DDoS Protection (Cloudflare / Route 53 / Azure DNS)    │
  │    - SSL/TLS Termination (Strict Full HTTPS, TLS 1.3)          │
  │    - Web Application Firewall (WAF) Rule Sets                   │
  └──────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │ 2. Cloud Ingress & Reverse Proxy Layer                          │
  │    - Path routing: /api/* -> Backend Cluster                    │
  │    - Path routing: /ws/*  -> WebSocket Cluster                  │
  │    - Path routing: /*     -> Static Web Portal Storage / CDN   │
  └──────────────────────────┬──────────────────────────────────────┘
                             │
       ┌─────────────────────┴─────────────────────────┐
       ▼                                               ▼
┌───────────────────────────────┐       ┌────────────────────────────────┐
│ 3. Compute Pods (PaaS / K8s)   │       │ 4. Asynchronous AI Worker Pods │
│ - FastAPI ASGI Multi-Worker   │       │ - Celery / KEDA GPU Workers    │
│ - Rate Limiting & Auth State  │◄─────►│ - DeepFace & SpeechBrain       │
│ - Student Guidance Engine     │       │ - Neural Feature Extraction    │
└──────────────┬────────────────┘       └────────────────┬───────────────┘
               │                                         │
               └─────────────────────┬───────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. Managed Persistence & Enterprise Storage Tier                       │
│    ├── Primary Relational DB: PostgreSQL 15 (Multi-AZ, Read Replicas)  │
│    ├── Caching & Blacklists: Managed Redis / Valkey 7.2                │
│    ├── Vector Knowledge Base: Managed Qdrant Cluster                   │
│    └── Cloud Audit Lake: S3 / GCS / Azure Blob Storage (Per-User Logs) │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Cloud Provider Deployment Blueprints

#### Tier A: Rapid PaaS Deployment (Render.com + Vercel)
Ideal for agile releases, low maintenance overhead, and rapid institutional pilots.

* **Backend Service**: Render Web Service (`render.yaml`) running Python 3.11/3.13.
  - Compute Spec: Starter / Standard Instance (1–2 CPU cores, 2 GB RAM).
  - Start Command: `uvicorn backend.api.main:app --host 0.0.0.0 --port $PORT --workers 4`.
  - Auto-Deploy: Webhook trigger on commit to `main`.
* **Database**: Managed PostgreSQL on Render or Neon Serverless PostgreSQL with auto-scaling connection pooling.
* **Cache**: Upstash Serverless Redis (Valkey compatible) for distributed rate limiting.
* **Frontend Portal**: Vercel Static Hosting (`vercel.json`) connected to the `frontend/` directory with edge routing.
* **Log Lake**: Google Cloud Storage bucket (`gs://eduidentity-user-logs`) authenticated via GCP Service Account JSON secret.

---

#### Tier B: AWS Enterprise Cloud Architecture
Tailored for large universities and institutional networks requiring GovCloud or AWS Education credits.

```
       [Route 53] ──> [CloudFront CDN] ──> [Application Load Balancer]
                                                   │
                                     ┌─────────────┴─────────────┐
                                     ▼                           ▼
                           [ECS Fargate API]             [ECS GPU Worker]
                             (FastAPI Pods)              (g4dn.xlarge / T4)
                                     │                           │
                   ┌─────────────────┼───────────────────────────┤
                   ▼                 ▼                           ▼
          [Aurora PostgreSQL]   [ElastiCache Redis]       [Amazon S3 Lake]
            (Serverless v2)      (Cluster Mode)       (User Logs + Lifecycle)
```

1. **Networking**: Dedicated VPC across 3 Availability Zones (AZs) with public subnets for ALBs and private subnets for ECS tasks and databases.
2. **Compute**:
   - **API Pods**: AWS ECS on AWS Fargate (Auto-scaling from 2 to 10 tasks based on CPU/Memory utilization).
   - **AI Biometric Workers**: AWS ECS on EC2 `g4dn.xlarge` (NVIDIA T4 Tensor Core GPU) executing batch facial/voice neural comparisons.
3. **Persistence**:
   - **Database**: Amazon Aurora PostgreSQL Serverless v2 with automated daily backups, 1-day Point-In-Time Recovery (PITR), and cross-region snapshots.
   - **Caching**: Amazon ElastiCache for Redis (Redis 7.2) with cluster mode and automated failover.
4. **Log Lake**:
   - Amazon S3 Bucket: `s3://eduidentity-user-logs-prod`
   - User partitioned paths: `users/{user_email}/`
   - S3 Intelligent-Tiering automatically transitioning logs older than 90 days to S3 Glacier Flexible Deep Archive.

---

#### Tier C: Microsoft Azure Institutional Campus Cloud
Optimized for universities with existing Microsoft 365 / Entra ID tenant ecosystems.

1. **Frontend & Ingress**: Azure Front Door with Azure Web Application Firewall (WAF) providing global anycast SSL termination and DDoS protection.
2. **Compute**:
   - **Azure Container Apps (ACA)**: Serverless microcontainers running `eduidentity-backend` with automatic KEDA HTTP traffic scaling (0 to 20 replicas).
   - **Azure Kubernetes Service (AKS)**: Optional GPU node pool (`Standard_NC4as_T4_v3`) for heavy neural inferencing.
3. **Database & Cache**:
   - **Database**: Azure Database for PostgreSQL Flexible Server with Zone-Redundant High Availability and PgBouncer connection pooling.
   - **Cache**: Azure Managed Redis (AMR) with high-availability enterprise tier.
4. **Log Lake**:
   - Azure Blob Storage (`az://eduidentity-user-logs`).
   - Blob lifecycle rules: Hot tier (0–30 days) ➔ Cool tier (31–90 days) ➔ Archive tier (91+ days).
   - Identity: Azure Managed Identity (System-Assigned) eliminating secret keys in application code.

---

#### Tier D: Google Cloud Platform (GCP) Cloud Run & GKE
Optimized for native Google Cloud Storage lake integration and Gemini/Qwen neural pipelines.

1. **Compute**:
   - Google Cloud Run (Fully Managed, Concurrency = 80 requests/container, Min instances = 1, Max instances = 15).
   - Cloud Run GPU (NVIDIA L4 GPU) for instant serverless neural embeddings.
2. **Database & Cache**:
   - Cloud SQL for PostgreSQL (Enterprise Plus edition, 99.99% availability SLA).
   - Cloud Memorystore for Redis.
3. **Log Lake**:
   - Google Cloud Storage (`gs://eduidentity-user-logs`) natively mapped to `UserWorkLogger`.
   - Nearline / Coldline lifecycle policies.
   - IAM Workload Identity Federation binding GCP Service Accounts directly to Cloud Run services.

---

### 3.3 Cloud Storage Lake Architecture for User Work Logs

The application implements a unique partitioned storage layout where each user's login history, session activity stream, and last work state are stored in a dedicated email directory:

```text
gs://eduidentity-user-logs/ (or s3://eduidentity-user-logs/)
├── users/
│   ├── admin@uni.edu/
│   │   ├── last_work.json              # Canonical snapshot of active / last session
│   │   ├── login_history.jsonl         # Append-only chronological login stream
│   │   └── activity_stream.jsonl       # Real-time fine-grained telemetry
│   ├── student_2026_001@uni.edu/
│   │   ├── last_work.json
│   │   ├── login_history.jsonl
│   │   └── activity_stream.jsonl
│   └── msrch.dev@uni.edu/
│       ├── last_work.json
│       ├── login_history.jsonl
│       └── activity_stream.jsonl
```

#### Multi-Cloud Lifecycle & Archival Rules:
| Storage Tier | Age Window | AWS S3 Target | Azure Blob Target | GCP Storage Target | Cost Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hot / Active** | Day 0 – Day 30 | S3 Standard | Hot Tier | Standard Storage | Rapid queries via `/api/auth/work-logs/me/last-work` |
| **Warm / Infrequent** | Day 31 – Day 90 | S3 Standard-IA | Cool Tier | Nearline Storage | 50% storage cost reduction for past semester logs |
| **Cold / Compliance** | Day 91 – Day 365 | S3 Glacier Instant | Cold Tier | Coldline Storage | Regulatory audit access |
| **Deep Archive** | Year 1 – Year 7 | S3 Deep Archive | Archive Tier | Archive Storage | Permanent academic record immutability ($0.00099/GB) |

---

### 3.4 Auto-Scaling, Concurrency & High Availability

#### 1. Horizontal Pod Auto-Scaling (HPA) Formula:
Scale out when average CPU utilization exceeds 70% or average request latency exceeds 250ms:
$$\text{Replicas} = \left\lceil \text{Current Replicas} \times \left( \frac{\text{Current Metric Value}}{\text{Target Metric Value}} \right) \right\rceil$$

#### 2. ASGI Concurrency Configuration:
In production containers, Uvicorn runs under a Gunicorn process supervisor:
```bash
gunicorn backend.api.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --timeout 60 \
    --keep-alive 5 \
    --access-logfile - \
    --error-logfile -
```
* **Worker Count Rule of Thumb**: `Workers = (2 * CPU Cores) + 1`
* **Concurrency per Worker**: 1,000 active asynchronous connections handled via `uvloop`.

---

### 3.5 Cloud Security, Zero Trust & Compliance Posture

1. **Zero Hardcoded Secrets**: All credentials (database passwords, JWT secret keys, cloud storage credentials) must be injected via secure Secret Managers (AWS Secrets Manager, Azure Key Vault, GCP Secret Manager) or encrypted environment variables.
2. **Workload Identity Federation**: Utilize OIDC federation between cloud providers and Kubernetes/Container services so pods authenticate to cloud storage lakes without static access keys.
3. **Data Protection at Rest & In Transit**:
   - AES-256 GCM encryption at rest on all PostgreSQL tables and object buckets.
   - TLS 1.3 enforced on all external endpoints; SSL certificates provisioned and auto-renewed via Let's Encrypt or AWS Certificate Manager.
4. **Academic Compliance Matrix**:
   - **FERPA Compliance (US)**: Student educational records and biometric tokens are strictly protected by RBAC guards (`/api/students/`).
   - **DPDPA 2023 (India)**: Student biometric templates stored as irreversible mathematical hashes; explicit consent logs captured in `activity_stream.jsonl`.
   - **Permanent Master Account Guard**: The universal test account `msrch` is protected by database triggers and SQLAlchemy ORM lifecycle listeners to ensure administrative accessibility during audits.

---

### 3.6 Cloud FinOps, Resource Rightsizing & Cost Matrix

| Infrastructure Tier | Target Environment | Target Concurrency | Monthly Estimated Cost | Primary Components |
| :--- | :--- | :--- | :--- | :--- |
| **Hobby / Sandbox** | Developer Test & Demo | Up to 50 concurrent users | **$0 – $15 / month** | Render Free/Starter Web Service + Neon Free Postgres + Local / Free GCS bucket |
| **Mid-Scale Campus** | College / Department (5,000 students) | Up to 1,000 concurrent users | **$85 – $150 / month** | Render Standard / AWS ECS Fargate (2 tasks) + Managed Postgres + Valkey Redis + S3 Lake |
| **Enterprise Multi-Campus**| Multi-University (50,000+ students) | 10,000+ concurrent users | **$450 – $950 / month** | AWS EKS / Azure AKS (Multi-AZ) + Dedicated GPU inferencing nodes + Aurora Postgres + High-availability Redis |

#### Cost Optimization Strategies:
* **Auto-Pause for Non-Production**: Automatically scale dev/test staging clusters to zero between 10:00 PM and 7:00 AM.
* **Spot Instances for AI Workers**: Run batch biometric model training and periodic data reconciliation on AWS Spot / Azure Spot VMs, yielding 60–80% savings.
* **Log Compression**: Pre-compress inactive `.jsonl` files with gzip (`.jsonl.gz`) before uploading to cloud object lakes, saving 75% on bandwidth and storage fees.

---

### 3.7 Disaster Recovery (DR), Backup & Business Continuity

1. **Recovery Metrics**:
   - **RPO (Recovery Point Objective)**: $\le 15$ minutes (Continuous WAL archiving in PostgreSQL).
   - **RTO (Recovery Time Objective)**: $\le 60$ minutes (Automated Terraform/Bicep infrastructure redeployment).
2. **Backup Strategy**:
   - **Relational Database**: Hourly automated WAL snapshots and daily full dumps retained for 30 days.
   - **User Audit Lake**: Cross-region replication (CRR) enabled on target storage buckets (`gs://eduidentity-user-logs` ➔ secondary region).
   - **Disaster Recovery Drills**: Quarterly failover simulation to verify secondary region spin-up and DNS failover.

---

## 4. Phased Cloud Implementation Timeline & Milestones

```
  Phase 1: Render & Vercel PaaS Deployment (Immediate / Completed)
  ├── Deploy backend on Render via render.yaml
  ├── Wire frontend on Vercel via vercel.json
  └── Smoke test REST API & WebSocket telemetry
        │
        ▼
  Phase 2: Database Migration & Schema Versioning (Alembic)
  ├── Generate migration revisions with Alembic
  └── Execute zero-downtime upgrades against PostgreSQL
        │
        ▼
  Phase 3: Production AI & Offline Dependency Bundling
  ├── Vendor wheels in dependencies/python_wheels/
  ├── Cache offline weights in dependencies/ai_weights/
  └── Enable Qdrant vector database containerization
        │
        ▼
  Phase 4: Multi-Cloud Object Storage Lake Ingestion
  ├── Connect UserWorkLogger to live GCS / S3 buckets
  ├── Enable automated Gzip compression of session logs
  └── Configure 90-day cold-tier lifecycle transitions
        │
        ▼
  Phase 5: Enterprise AWS / Azure Cluster Scaling
  ├── Deploy ECS Fargate / Azure Container Apps clusters
  ├── Enable Prometheus & Grafana executive SLA dashboards
  └── Run automated load testing for 10,000 concurrent students
```

---

*Document Version: 1.0.0 (Enterprise Architecture Specification)*  
*Target System: EduIdentityAI Production Cloud Infrastructure*
