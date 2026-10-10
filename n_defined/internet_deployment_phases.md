# Internet Deployment Phased Roadmap (Render.com)

This roadmap defines the structured phases required to deploy **EduIdentityAI** live onto the internet via [Render Dashboard](https://dashboard.render.com/).

---

## **Phase 1: Render Web Service Setup** (READY)
* **Objective**: Deploy FastAPI backend and static frontend portal via Render.
* **Deployment Steps**:
  1. Push your repository to GitHub:
     ```bash
     git add .
     git commit -m "Render deployment configuration v2.1"
     git push origin main
     ```
  2. Log in to [Render Dashboard](https://dashboard.render.com/).
  3. Click **New ➔ Blueprint** (or **New ➔ Web Service**).
  4. Connect your GitHub repository. Render will automatically detect `render.yaml`.
  5. Click **Apply Blueprint**. Render will build Python dependencies and launch your FastAPI application live on the internet!

## **Phase 2: Database Migration & Schema Versioning**
* **Objective**: Transition from auto-creation to Alembic version-controlled migrations.
* **Steps**:
  1. Generate production migration revision: `alembic revision --autogenerate -m "Production release schema"`
  2. Execute migration against live cloud database: `alembic upgrade head`
  3. Verify seed data initialization for default admin and student accounts.

## **Phase 3: Containerization & ASGI Process Scaling**
* **Objective**: Package application services for reliable container orchestration.
* **Steps**:
  1. Build optimized Docker images for backend (`backend/Dockerfile`) and AI workers.
  2. Configure multi-worker Uvicorn/Gunicorn execution (`--workers 4`) to handle high concurrency.
  3. Deploy using Docker Compose or Kubernetes manifests (`infrastructure/docker-compose.yml`).

## **Phase 4: SSL/TLS Termination, DNS & Reverse Proxy**
* **Objective**: Secure public internet traffic and domain routing.
* **Steps**:
  1. Point domain DNS records (A/CNAME records) to the cloud server IP or load balancer.
  2. Configure Nginx reverse proxy or Cloudflare proxy for SSL/TLS certificate termination (`HTTPS`).
  3. Restrict CORS `allow_origins` in `backend/api/main.py` exclusively to the production frontend domain.

## **Phase 5: Monitoring, Prometheus & SLA Verification**
* **Objective**: Ensure continuous operational visibility and uptime.
* **Steps**:
  1. Connect Prometheus scraping endpoints (`/metrics`) to Prometheus and Grafana dashboards.
  2. Test WebSocket audit log streaming (`/ws/audit-logs`) over secure WSS.
  3. Run end-to-end integration tests (`python -m unittest backend.tests.test_api`) against the live internet endpoint.

## **Phase 6: Cloud Storage Migration & User Log Lake Sync (GCS / S3)**
* **Objective**: Transition local testing log files (`storage/logs/users/`) to Google Cloud Storage (GCS) or AWS S3 buckets for permanent, distributed audit storage.
* **Steps**:
  1. Provision a dedicated Google Cloud Storage bucket: `gs://eduidentity-user-logs` (Standard storage class with multi-region redundancy).
  2. Configure GCP IAM Service Account with `roles/storage.objectAdmin` and export credentials via `GOOGLE_APPLICATION_CREDENTIALS`.
  3. Update environment variables in cloud deployment:
     ```env
     CLOUD_STORAGE_ENABLED=true
     CLOUD_STORAGE_BUCKET=eduidentity-user-logs
     LOGS_STORAGE_DIR=/var/data/storage/logs/users
     ```
  4. Enable the automated background sync adapter in `backend/services/user_work_logger.py` to synchronize staged user session files (`last_work.json`, `login_history.jsonl`, `activity_stream.jsonl`) to their respective cloud path `gs://eduidentity-user-logs/users/{user_email}/`.
  5. Configure bucket lifecycle management (auto-tier logs older than 30 days to Nearline and older than 90 days to Coldline).
