# Production Internet Deployment & Cloud Management Guide

This document outlines the preparation, configuration, and operational procedures required to deploy **EduIdentityAI** securely on the internet and enterprise cloud platforms (Render, AWS, Azure, GCP, or Docker Swarm/Kubernetes).

> 📘 **Master Architecture Reference**: See **[`n_defined/dependencies_and_cloud_computing_plan.md`](n_defined/dependencies_and_cloud_computing_plan.md)** for exhaustive dependency topologies, multi-cloud blueprints, cost matrices, and disaster recovery strategies.

---

## 1. Environment Configuration (`.env`)
Before deploying to production, create a secure `.env` file in the root directory containing production secrets:

```env
# Database & Security
DATABASE_URL=postgresql://production_user:secure_password@db_host:5432/eduidentity_prod
JWT_SECRET=generate_a_very_strong_random_secret_key_here_2026

# Distributed Caching & Rate Limiting
VALKEY_HOST=redis_cluster_host
VALKEY_PORT=6379

# Vector Knowledge Base
QDRANT_HOST=qdrant_cluster_host
QDRANT_PORT=6333

# Cloud Storage Lake (User Work Logs)
CLOUD_STORAGE_ENABLED=true
CLOUD_STORAGE_BUCKET=eduidentity-user-logs
CLOUD_PROVIDER=gcs
```

---

## 2. Dependency Management & Installation Profiles

EduIdentityAI provides tailored dependency profiles for diverse hosting environments:

### Option A: Standard Production Stack (Lightweight / CPU)
Suitable for Render, basic VPS, and general student CRUD operations:
```bash
pip install -r backend/requirements.txt
```

### Option B: Production AI Stack (Heavy / GPU-Accelerated)
Required for high-accuracy neural facial verification, voice spectrogram matching, and dense vector embeddings:
```bash
pip install -r backend/requirements.txt
pip install -r backend/requirements-ai.txt
```

### Option C: Offline / Air-Gapped Installation
For secured government or private institutional university intranets:
```bash
pip install --no-index --find-links=dependencies/python_wheels/ -r backend/requirements.txt
```
*(See `dependencies/README.md` for guidelines on model weights in `dependencies/ai_weights/`)*.

---

## 3. Database Management & Migrations (Alembic)
For local development, the app automatically initializes tables on startup (`Base.metadata.create_all`). For internet deployment, **Alembic** manages schema versioning and zero-downtime updates:

1. **Initialize Migration Version History**:
   ```bash
   alembic revision --autogenerate -m "Initial production schema"
   ```
2. **Apply Migrations on Production Database**:
   ```bash
   alembic upgrade head
   ```
3. **Rolling Back Schema Changes (if needed)**:
   ```bash
   alembic downgrade -1
   ```

---

## 4. Cloud Computing Deployment Options

### Deployment Path A: Render.com (PaaS / Rapid Deployment)
* **Configuration**: Defined in `render.yaml`.
* **Action**: Connect repository to Render Blueprint. Render automatically provisions the web service, compiles requirements, and attaches PostgreSQL.
* **Command**: `uvicorn backend.api.main:app --host 0.0.0.0 --port $PORT --workers 4`

### Deployment Path B: Containerized Docker Compose
* **Build and Run Production Containers**:
  ```bash
  docker-compose -f infrastructure/docker-compose.yml up -d --build
  ```
* **Scaling ASGI Workers**:
  Run Gunicorn with Uvicorn worker processes:
  ```bash
  gunicorn backend.api.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
  ```

### Deployment Path C: AWS / Azure / GCP Enterprise Containers
* **AWS**: Amazon ECS on Fargate with Aurora Serverless v2 PostgreSQL, ElastiCache Redis, and S3 Intelligent-Tiering log lake.
* **Azure**: Azure Container Apps (ACA) with Azure Database for PostgreSQL Flexible Server, Azure Managed Redis, and Azure Blob Storage.
* **GCP**: Google Cloud Run with Cloud SQL PostgreSQL, Cloud Memorystore, and Google Cloud Storage.

---

## 5. Security Hardening for Internet Exposure
* **SSL / TLS Termination**: Place Cloudflare, AWS CloudFront, or Nginx in front of FastAPI to enforce strict HTTPS (`TLS 1.3`).
* **Rate Limiting**: The built-in `RateLimiterMiddleware` protects against brute-force logins and DDoS attacks.
* **CORS Restrictions**: Update `allow_origins` in `backend/api/main.py` from `["*"]` to your exact frontend production domain.
* **Master Account Immutability**: The universal developer account `msrch` cannot be deleted via API or ORM, safeguarding administrative recovery during live audits.
