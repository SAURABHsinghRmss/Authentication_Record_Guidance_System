# Production Internet Deployment & Database Management Guide

This document outlines the preparation, configuration, and operational procedures required to deploy **EduIdentityAI** securely on the internet (via cloud VPS, AWS, Azure, or Docker Swarm/Kubernetes).

---

## 1. Environment Configuration (`.env`)
Before deploying to production, create a secure `.env` file in the root directory containing production secrets:

```env
DATABASE_URL=postgresql://production_user:secure_password@db_host:5432/eduidentity_prod
JWT_SECRET=generate_a_very_strong_random_secret_key_here_2026
VALKEY_HOST=redis_cluster_host
VALKEY_PORT=6379
QDRANT_HOST=qdrant_cluster_host
QDRANT_PORT=6333
```

---

## 2. Database Management & Migrations (Alembic)
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

## 3. Containerized Internet Deployment (Docker Compose)
1. **Build and Run Production Containers**:
   ```bash
   docker-compose -f infrastructure/docker-compose.yml up -d --build
   ```
2. **Scaling ASGI Workers**:
   Configure Uvicorn / Gunicorn with multiple worker processes in `backend/Dockerfile`:
   ```bash
   uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

---

## 4. Security Hardening for Internet Exposure
* **SSL / TLS Termination**: Place an Nginx reverse proxy or Cloudflare in front of FastAPI to enforce HTTPS (`ports 443:443`).
* **Rate Limiting**: The built-in `RateLimiterMiddleware` protects against brute-force logins and DDoS attacks.
* **CORS Restrictions**: Update `allow_origins` in `backend/api/main.py` from `["*"]` to your exact frontend production domain.
