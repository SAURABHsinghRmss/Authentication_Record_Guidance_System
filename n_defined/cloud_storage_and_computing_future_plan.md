# Cloud Storage & Computing Architecture: Present & Future Plan

> **Platform**: EduIdentityAI  
> **Date**: October 2026  
> **Status**: Active Local Hybrid (Present) | Cloud Storage Lakehouse (Phase II) | Distributed Kubernetes & GPU Mesh (Phase III)  
> **Objective**: Comprehensive architectural roadmap for multi-cloud object storage, automated log tiering, Kubernetes microservice container orchestration, and GPU-accelerated AI computing.

---

## 📑 Master Table of Contents

1. [Executive Summary & Architecture Vision](#1-executive-summary--architecture-vision)
2. [Present Implementation (Active in Production)](#2-present-implementation-active-in-production)
    - 2.1 Partitioned User Work Logging (`storage/logs/users/{email}/`)
    - 2.2 Schema & Forensic Digest Standards
    - 2.3 Polyglot 7-Database Domain Federation
3. [Multi-Cloud Object Storage Lakehouse Architecture](#3-multi-cloud-object-storage-lakehouse-architecture)
    - 3.1 Cloud Storage Adapters (AWS S3, GCP GCS, Azure Blob, MinIO)
    - 3.2 Automated Gzip Stream Compression & 3-Tier Lifecycle
    - 3.3 Workload Identity Federation & Zero-Trust IAM
4. [Cloud Computing & Container Orchestration (Kubernetes)](#4-cloud-computing--container-orchestration-kubernetes)
    - 4.1 Microservice Decomposition Topology
    - 4.2 Ingress, Reverse Proxy & Service Mesh (Istio / Cilium)
    - 4.3 Elastic Autoscaling (HPA & KEDA Event-Driven Scaling)
5. [GPU Acceleration & Distributed AI Inference Cluster](#5-gpu-acceleration--distributed-ai-inference-cluster)
    - 5.1 vLLM / TensorRT-LLM Model Serving Nodes
    - 5.2 Distributed Qdrant Vector Sharding & Quantization
    - 5.3 Cloud FinOps & Serverless Spot Optimization

---

## 1. Executive Summary & Architecture Vision

EduIdentityAI is engineered with a **cloud-agnostic, modular hybrid architecture**. In its present production state, the platform runs an efficient, resilient multi-database system coupled with granular, partitioned filesystem forensic logging and Gemini 3.8 Flash inference.

As the platform scales to multi-campus deployments (50,000+ students and faculty), the computing and storage backbone will transition through an automated object-storage lakehouse into an enterprise Kubernetes cluster backed by dedicated GPU inference nodes.

---

## 2. Present Implementation (Active in Production)

### 2.1 Partitioned User Work Logging (`storage/logs/users/{user_email}/`)
All user actions, security events, authentication handshakes, and UI interactions are isolated into individual per-user storage directories partitioned by the user's canonical email address:

```
storage/logs/users/{user_email}/
  ├── last_work.json          # Atomic snapshot of user's latest session state
  ├── login_history.jsonl     # Append-only chronological authentication audit log
  ├── activity_stream.jsonl   # High-velocity event log (API requests, UI route changes)
  └── audit_forensics.json    # Cryptographic SHA-256 verification digest
```

* **`last_work.json`**: Written atomically upon session state transitions. Captures `email`, `role`, `current_route`, `ip_address`, `user_agent`, `last_action_timestamp`, and `active_session_id`.
* **`login_history.jsonl`**: Immutable JSONL stream recording login timestamp, authentication method (Password, MFA, Biometric passkey), IP address, client device fingerprint, and login outcome (`SUCCESS`, `MFA_CHALLENGE`, `FAILED`).
* **`activity_stream.jsonl`**: Real-time event log capturing fine-grained user interactions, API endpoint invocations, chat message dispatches (`PEER_STUDENT`, `FACULTY_MENTOR`, `ADMIN_SUPPORT`), and Meta AI query criteria.
* **`audit_forensics.json`**: Contains a rolling SHA-256 hash chaining the previous block of activities, guaranteeing tamper-evident audit trails compliant with institutional data protection standards.

### 2.2 UserWorkLogger Service Engine (`backend/services/user_work_logger.py`)
* Implements thread-safe non-blocking async file I/O.
* Automatically creates required directories, initializes missing JSONL manifests, and validates payload integrity.
* Exposes secure administrative endpoints (`/api/auth/work-logs/locations`, `/api/auth/work-logs/user/{email}`) guarded by strict RBAC (`require_role("admin")`).

### 2.3 Polyglot 7-Database Domain Federation
Decouples domain data into 7 isolated SQLite database files in `databases/` via `backend/services/db_federation.py`:
1. `auth_iam.db`: Credentials, password salts, JWT revocation blocks, MFA secrets.
2. `academic_sis.db`: Student enrollment, courses, CGPA, attendance, marks, mentoring assignments.
3. `family_heritage.db`: Kinship links, guardian emergency contacts, legacy alumni verification.
4. `institutions_governance.db`: University metadata, tenant subscriptions, faculty departments.
5. `security_audit.db`: Centralized audit logs, threat detection alerts, WebSocket streaming events.
6. `career_pathways.db`: Industry skills taxonomy, alumni job placements, internship matching.
7. `notifications_events.db`: Push notifications, SMS/Email delivery queues, calendar reminders.

---

## 3. Multi-Cloud Object Storage Lakehouse Architecture

### 3.1 Cloud Storage Adapters (AWS S3, GCP GCS, Azure Blob, MinIO)
A pluggable adapter interface (`ICloudStorageAdapter`) abstracts cloud-specific SDKs:

```python
class ICloudStorageAdapter(ABC):
    @abstractmethod
    async def upload_file(self, local_path: str, remote_key: str) -> str: ...
    @abstractmethod
    async def download_file(self, remote_key: str, local_path: str) -> bool: ...
    @abstractmethod
    async def stream_append(self, remote_key: str, data: bytes) -> bool: ...
```

* **Google Cloud Storage (GCS)**: `gs://eduidentity-data-lake/users/{email}/` via `google-cloud-storage`.
* **Amazon Web Services (S3)**: `s3://eduidentity-data-lake/users/{email}/` via `boto3` / `aioboto3`.
* **Microsoft Azure Blob Storage**: `https://eduidentity.blob.core.windows.net/user-logs/{email}/` via `azure-storage-blob`.
* **Private Campus On-Premise**: S3-compatible `MinIO` cluster for air-gapped university compliance.

### 3.2 Automated Gzip Stream Compression & 3-Tier Lifecycle
To eliminate disk space exhaustion and optimize multi-cloud egress/storage costs:

```
┌─────────────────┐       24 Hours       ┌─────────────────┐       30 Days       ┌─────────────────┐
│   HOT STORAGE   │ ───────────────────> │  WARM STORAGE   │ ──────────────────> │  COLD ARCHIVE   │
│ Raw JSONL Files │   Gzip Compression   │ .jsonl.gz Files │  Lifecycle Rules    │ Glacier / Deep  │
│ High-Speed SSD  │   (~75% reduction)   │ Standard S3/GCS │  Audit Retention    │ Archive Storage │
└─────────────────┘                      └─────────────────┘                     └─────────────────┘
```

1. **Hot Tier (0 - 24 Hours)**:
   * Uncompressed raw JSONL on local NVMe SSD volumes.
   * Enables zero-latency administrative forensic search and real-time WebSocket dashboard streaming.
2. **Warm Tier (1 - 30 Days)**:
   * Scheduled cron worker compresses completed daily activity streams into gzip format (`activity_stream_2026_10_19.jsonl.gz`).
   * Synced asynchronously to standard cloud object buckets. Compression reduces storage footprint by ~75%.
3. **Cold / Archival Tier (30 Days - 7 Years)**:
   * Automated cloud bucket lifecycle policies transition objects to AWS S3 Glacier Deep Archive, GCP Archive Storage, or Azure Archive Blob.
   * Guarantees 7-year statutory retention for educational accreditations (NAAC / ABET) at sub-$1 per TB/month.

### 3.3 Workload Identity Federation & Zero-Trust IAM
* Completely removes static cloud API keys, secret access keys, and long-lived service account JSON files from container environments.
* Utilizes **OIDC Workload Identity Federation**:
  * GCP: GKE Workload Identity maps Kubernetes Service Accounts (KSA) directly to Google Cloud IAM Service Accounts (GSA).
  * AWS: EKS IAM Roles for Service Accounts (IRSA) leverage short-lived STS tokens.
  * Azure: AKS Workload Identity binds federated credentials directly to Azure AD Managed Identities.

---

## 4. Cloud Computing & Container Orchestration (Kubernetes)

### 4.1 Microservice Decomposition Topology
When migrating from single-host FastAPI to enterprise Kubernetes (EKS / GKE / AKS), the application decomposes into dedicated, horizontally scalable microservices:

```
                                  Internet / Cloudflare CDN
                                              │ HTTPS / WSS
                                              ▼
                                   Ingress Controller (NGINX)
                                              │ mTLS
                        ┌─────────────────────┴─────────────────────┐
                        ▼                                           ▼
            ┌───────────────────────┐                   ┌───────────────────────┐
            │  api-gateway-service  │                   │   auth-iam-service    │
            │  (Routing, Rate-Limit)│                   │  (JWT, Passkeys, RBAC)│
            └───────────┬───────────┘                   └───────────┬───────────┘
                        │                                           │
         ┌──────────────┼──────────────┬─────────────┐              │
         ▼              ▼              ▼             ▼              ▼
  ┌─────────────┐ ┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐
  │ sis-service │ │ chat-ai-svc │ │ audit-svc│ │ async-wrk│ │ Postgres /   │
  │ (Academic)  │ │ (EduMentor) │ │ (Forensic│ │ (Celery/ │ │ Managed DBs   │
  └─────────────┘ └─────────────┘ └──────────┘ │  KEDA)   │ └───────────────┘
                                               └──────────┘
```

* **`api-gateway-service`**: Reverse proxy, SSL termination, CORS validation, DDoS rate-limiting via Redis token-bucket algorithms.
* **`auth-iam-service`**: Handles authentication, TOTP MFA, DigiLocker credentials verification, and RBAC token generation.
* **`academic-sis-service`**: Student record management, attendance calculations, grading, and counseling rosters.
* **`chat-ai-service`**: Unified 3-category messaging, WebSocket broadcasting, and Gemini 3.8 Flash EduMentor AI orchestration.
* **`audit-forensics-service`**: Async worker pool ingesting activity streams, computing SHA-256 digests, and syncing to cloud object storage.

### 4.2 Ingress, Reverse Proxy & Service Mesh
* **Istio / Cilium Service Mesh**:
  * Enforces mutual TLS (mTLS) with cryptographically rotated certificates for all pod-to-pod east-west communications.
  * Implements strict Layer-7 authorization policies (e.g., only `chat-ai-service` can call `academic-sis-service` for grade summaries).
* **Distributed Tracing**:
  * OpenTelemetry instrumentation across all FastAPI endpoints forwarding traces to Jaeger / Grafana Tempo.

### 4.3 Elastic Autoscaling (HPA & KEDA)
* **Horizontal Pod Autoscaling (HPA)**:
  * Scales API pods based on 70% CPU threshold and P95 latency metrics.
* **Kubernetes Event-driven Autoscaling (KEDA)**:
  * Scales async worker pods dynamically based on Redis job queue length and Kafka event backlogs, automatically scaling to zero during idle periods.

---

## 5. GPU Acceleration & Distributed AI Inference Cluster

### 5.1 vLLM / TensorRT-LLM Model Serving Nodes
For institutions requiring on-premise data residency or low-latency dedicated inference without external API calls:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GPU Inference Node Pool                         │
│  (NVIDIA L4 24GB / A10G 24GB / H100 80GB with TensorRT-LLM / vLLM)    │
├────────────────────────────────────────────────────────────────────────┤
│  • PagedAttention dynamic continuous batching                          │
│  • Int8 / FP8 AWQ Quantization for high concurrency                    │
│  • Serving: Qwen-2.5-Coder-32B, Mistral-NeMo-12B, Whisper-Large-v3     │
│  • P99 Token Generation Latency: < 18ms per token                      │
└────────────────────────────────────────────────────────────────────────┘
```

* High-throughput inference engine featuring **PagedAttention** to eliminate KV-cache memory fragmentation.
* Supports concurrent student queries across all 8 educational criteria simultaneously.

### 5.2 Distributed Qdrant Vector Sharding & Quantization
* Multi-node Qdrant cluster deployed with 3-way shard replication.
* Stores dense vector embeddings (1536-dim OpenAI `text-embedding-3-large` or 768-dim Google `text-multilingual-embedding-002`) for:
  * Institutional syllabus, examination bylaws, and university fee codes.
  * Student career skill maps and corporate internship descriptions.
* Leverages **Scalar Quantization (SQ8)** to reduce RAM footprint by 75% while preserving 99.2% retrieval accuracy.

### 5.3 Cloud FinOps & Serverless Spot Optimization
* **Spot Instance Fleets**: Nightly predictive at-risk classification (LightGBM/XGBoost) and counseling voice transcription (Whisper) execute on AWS EC2 Spot or GCP Preemptible GPU instances, cutting compute costs by 65–70%.
* **Scale-to-Zero Scheduling**: Heavy inference GPU pods scale down during night-time campus hours (2:00 AM – 6:00 AM), falling back to serverless pay-per-token Gemini 3.8 Flash APIs for off-peak student queries.

