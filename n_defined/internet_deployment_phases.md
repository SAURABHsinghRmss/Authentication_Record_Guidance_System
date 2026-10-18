# Internet Deployment Phased Roadmap (Render.com & Multi-Cloud Enterprise)

> **Platform**: EduIdentityAI  
> **Date**: October 2026  
> **Status**: Production Deployment Ready  
> **Objective**: Detailed step-by-step operational roadmap for deploying EduIdentityAI live onto the internet via Render.com and scaling to multi-cloud enterprise infrastructure (AWS / GCP / Azure).

> 📘 **Master Architecture Reference**: See **[`dependencies_and_cloud_computing_plan.md`](dependencies_and_cloud_computing_plan.md)** and **[`cloud_storage_and_computing_future_plan.md`](cloud_storage_and_computing_future_plan.md)** for exhaustive dependency profiles, cloud vendor topologies, FinOps cost analysis, and disaster recovery blueprints.

---

## 📑 Phased Deployment Matrix

| Phase | Target Stage | Key Deliverable | Primary Technologies |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Render Web Service Setup | Live internet URL, Static Frontend & FastAPI Backend | Render.com, Python 3.13, Uvicorn, SQLite |
| **Phase 2** | Database Federation & Migration | 7 Domain DBs provisioned, Persistent Disk Mounted | SQLite Federation, Alembic, PostgreSQL 16 |
| **Phase 3** | Containerization & Optimization | Production Docker image with cached offline wheels | Docker, Alpine/Debian Slim, Multi-stage builds |
| **Phase 4** | SSL/TLS, CDN & Domain Routing | Custom domain, Cloudflare edge proxy, Strict CORS | Cloudflare, Let's Encrypt, HTTP/2, TLS 1.3 |
| **Phase 5** | Telemetry, WebSockets & Testing | Prometheus metrics, WebSocket audit logs, E2E tests | Prometheus, Grafana, Pytest, WebSockets |
| **Phase 6** | Cloud Object Storage Lakehouse | Partitioned user logs synced to GCS/S3/Azure | GCS, AWS S3, Azure Blob, Gzip Compression |
| **Phase 7** | Multi-Cloud Kubernetes & GPU Nodes | vLLM dedicated inference & Qdrant vector cluster | GKE/EKS, NVIDIA L4/A10G, vLLM, Qdrant |

---

## **Phase 1: Render.com Web Service Setup (READY)**
* **Objective**: Deploy FastAPI backend and static frontend portal live on the internet via Render.com.
* **Operational Steps**:
  1. Commit and push repository to GitHub:
     ```bash
     git add .
     git commit -m "feat: integrate EduMentor Meta AI, 7-DB federation, and render deployment config"
     git push origin main
     ```
  2. Navigate to [Render Dashboard](https://dashboard.render.com/).
  3. Click **New ➔ Web Service** (or select **New ➔ Blueprint** and connect `render.yaml`).
  4. Connect your GitHub repository.
  5. Configure Environment Settings:
     * **Runtime**: `Python 3` (Version 3.11+ or 3.13)
     * **Build Command**: `pip install -r backend/requirements.txt`
     * **Start Command**: `uvicorn backend.api.main:app --host 0.0.0.0 --port $PORT`
  6. Inject Secret Environment Variables:
     ```env
     GEMINI_API_KEY=AIzaSy...              # Google Gemini 3.8 Flash API key
     JWT_SECRET_KEY=production_secret_key_change_me
     ENVIRONMENT=production
     DATABASE_STORAGE_PATH=/var/data/databases
     LOGS_STORAGE_PATH=/var/data/storage/logs/users
     ```
  7. Attach a **Render Persistent Disk**:
     * Mount Name: `eduidentity-data`
     * Mount Path: `/var/data`
     * Size: `10 GB` (retains the 7 SQLite databases and user activity streams across redeployments).
  8. Click **Deploy Web Service**. Verify service boots and exposes the public HTTPS endpoint (e.g., `https://eduidentity-ai.onrender.com`).

---

## **Phase 2: Polyglot 7-Database Domain Federation & Versioning**
* **Objective**: Maintain domain isolation across the 7 independent databases (`auth_iam`, `academic_sis`, `family_heritage`, `institutions_governance`, `security_audit`, `career_pathways`, `notifications_events`) and establish zero-downtime schema migrations.
* **Operational Steps**:
  1. Verify the persistent disk mount directory contains all 7 initialized databases via `backend/services/db_federation.py`.
  2. For enterprise deployments transitioning from SQLite to managed PostgreSQL:
     * Provision a managed PostgreSQL instance (e.g., Render Managed PostgreSQL or AWS RDS).
     * Configure discrete schema namespaces (`auth_iam`, `academic_sis`, `family_heritage`, etc.).
     * Update `DB_FEDERATION_URL` connection strings in environment configuration.
  3. Execute version-controlled Alembic migrations:
     ```bash
     alembic revision --autogenerate -m "Polyglot 7-DB unified chat schema v2.1"
     alembic upgrade head
     ```
  4. Run database health and seed verification:
     ```bash
     python -c "from backend.services.db_federation import get_db_federation; f = get_db_federation(); print(f.get_all_stats())"
     ```

---

## **Phase 3: Containerization & Dependency Management**
* **Objective**: Package the entire application stack into an immutable Docker container with pre-cached AI dependencies.
* **Operational Steps**:
  1. Build multi-stage optimized Docker image using `backend/Dockerfile`:
     ```bash
     docker build -t eduidentity-api:v2.1 -f backend/Dockerfile .
     ```
  2. For restricted network or air-gapped campus environments, verify offline wheel installations:
     * Wheels pre-cached under `dependencies/python_wheels/`.
     * Pre-downloaded neural model weights located in `dependencies/ai_weights/`.
  3. Configure production concurrency:
     * Use multi-worker Uvicorn with Gunicorn process manager:
       ```bash
       gunicorn backend.api.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
       ```

---

## **Phase 4: SSL/TLS Termination, CDN & Reverse Proxy**
* **Objective**: Secure public traffic, enforce TLS 1.3, configure custom institution subdomains, and prevent DDoS attacks.
* **Operational Steps**:
  1. Configure custom DNS records (e.g., `portal.university.edu`) pointing CNAME to the Render service URL.
  2. Enable Cloudflare Edge Proxy with:
     * Strict SSL/TLS (Full/Strict Mode with automated Let's Encrypt certificates).
     * Cloudflare Web Application Firewall (WAF) blocking suspicious rate-abuse and SQLi patterns.
     * Static asset edge caching for `frontend/css/`, `frontend/js/`, and branding assets.
  3. Harden CORS and Content-Security-Policy (CSP) headers in `backend/api/main.py`:
     * Set `allow_origins=["https://portal.university.edu"]`.
     * Enforce `frame-ancestors 'none'` to eliminate clickjacking vectors.

---

## **Phase 5: Live Monitoring, WebSockets & SLA Verification**
* **Objective**: Ensure 99.99% uptime, real-time telemetry streaming, and automated test suite validation.
* **Operational Steps**:
  1. Expose Prometheus metrics endpoint (`/metrics`) and configure automated scraping for request latency, memory usage, and active WebSocket connections.
  2. Test real-time WebSocket connection stability:
     * Connect to `/ws/audit-logs` for administrative telemetry.
     * Connect to `/ws/chat/{category}` for real-time peer and faculty messaging.
  3. Execute automated integration and regression test suites against the live deployment:
     ```bash
     $env:PYTHONPATH="."
     python backend/tests/test_three_category_chat.py
     ```
     Ensure all 10/10 tests pass with 100% assertions satisfied.

---

## **Phase 6: Cloud Storage Migration & User Log Lake Sync (GCS / S3 / Azure)**
* **Objective**: Transition local partitioned filesystem logs (`storage/logs/users/{user_email}/`) to scalable, distributed cloud object storage.
* **Operational Steps**:
  1. Provision dedicated multi-cloud storage bucket:
     * Google Cloud Storage: `gs://eduidentity-user-logs`
     * AWS S3: `s3://eduidentity-user-logs`
     * Azure Blob: `https://eduidentitylogs.blob.core.windows.net/user-logs`
  2. Configure Workload Identity Federation (avoiding long-lived static API keys).
  3. Enable automated background synchronization in `backend/services/user_work_logger.py`:
     * Daily cron job compresses `.jsonl` files into `.jsonl.gz` format (~75% compression).
     * Uploads compressed logs to cloud path: `users/{user_email}/YYYY/MM/activity_stream.jsonl.gz`.
  4. Configure bucket lifecycle rules:
     * Hot ➔ Warm: Standard tier for 30 days.
     * Warm ➔ Cold: Transition to S3 Glacier Deep Archive or GCS Archive Storage after 30 days for 7-year audit retention.

---

## **Phase 7: Multi-Cloud Enterprise Scaling & GPU Inference Cluster**
* **Objective**: Deploy on Kubernetes (GKE / EKS / AKS) with dedicated GPU worker nodes for high-throughput institutional AI inference.
* **Operational Steps**:
  1. Provision managed Kubernetes cluster using Terraform / Helm v3 charts.
  2. Configure Horizontal Pod Autoscaler (HPA) and KEDA for event-driven scaling of FastAPI pods.
  3. Deploy dedicated GPU node pools (NVIDIA L4 / A10G) running vLLM or TensorRT-LLM:
     * Host quantized high-throughput models (Qwen-2.5-Coder-32B, Mistral-NeMo-12B, Whisper-Large-v3).
     * PagedAttention memory optimization serving 100+ concurrent student inquiries per node.
  4. Deploy distributed Qdrant vector database cluster:
     * 3-node cluster with HNSW sharding and scalar quantization for institutional policy RAG queries.
  5. Establish cross-region active-passive disaster recovery with sub-15-minute Recovery Point Objective (RPO).

