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
