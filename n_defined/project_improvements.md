# Project Improvement Guide & Roadmap

This document outlines strategic architectural and feature enhancements to elevate the **EduIdentityAI** platform to an enterprise-grade production ecosystem.

> 📘 **Master Architecture Reference**: See **[`dependencies_and_cloud_computing_plan.md`](dependencies_and_cloud_computing_plan.md)** for the complete system dependency inventory, cloud provider topologies, cost models, and disaster recovery blueprints.

---

## 1. Security & Compliance Hardening
* **JWT Token Blacklisting**: Implement token revocation lists in Valkey/Redis so logout immediately invalidates active sessions.
* **Database Migrations (Alembic)**: Replace direct `Base.metadata.create_all()` with Alembic database migration scripts to manage zero-downtime schema upgrades in PostgreSQL.
* **Content Security Policy (CSP)**: Enforce strict CSP HTTP headers to prevent Cross-Site Scripting (XSS) and clickjacking attacks.
* **Master Developer Anti-Deletion Defense**: Harden the universal developer account `msrch` with immutable triggers and cryptographic audit logging across all state mutations.

## 2. Artificial Intelligence & RAG Enhancements
* **Hybrid Search (Vector + BM25)**: Combine dense Qwen3 vector embeddings with sparse BM25 keyword matching (Hybrid Search) in Qdrant for superior retrieval precision.
* **LLM Streaming Responses**: Implement Server-Sent Events (SSE) or WebSocket streaming for RAG chatbot responses so AI answers stream word-by-word with typing animations.
* **Hardware-Accelerated Biometrics**: Deploy `backend/requirements-ai.txt` on GPU worker nodes (NVIDIA CUDA / TensorRT) for sub-second facial and voice biometric matching.

## 3. Monitoring & Developer Experience
* **Automated CI/CD Workflows**: Add GitHub Actions workflows to run automated unit tests (`python -m unittest`), dependency audits (`pip-audit`, `npm audit`), and Docker image builds on every pull request.
* **Grafana Dashboards**: Fully wire the JSON dashboard files located in `configs/grafana/` to Prometheus metrics for automated SLA and executive KPI scorecards.

## 4. User Audit Logging & Cloud Storage Enhancements
* **Automatic Session Restoration**: In the frontend portal, render an interactive "Last Work" card upon login displaying the user's previous work summary and quick resume shortcuts.
* **Multi-Cloud Storage Providers**: Expand `UserWorkLogger` to support multi-cloud storage backends (Google Cloud Storage, AWS S3, Azure Blob Storage) dynamically selected via environment configuration (`CLOUD_PROVIDER=gcs|s3|azure`).
* **Log Compression & Archival**: Implement automatic Gzip compression (`.jsonl.gz`) for inactive session activity files before cloud sync to minimize cloud bandwidth and storage costs.
* **Developer Diagnostics View**: Provide a dedicated developer inspector for `msrch` in the portal to monitor live work actions and session telemetry across all user Gmail storage locations.

## 5. Enterprise Cloud Infrastructure & Multi-Cloud Portability
* **Managed Container Scaling**: Migrate from single-instance VPS to serverless containers (AWS ECS Fargate, Azure Container Apps, GCP Cloud Run) with auto-scaling from 2 to 20 replicas based on HTTP request concurrency.
* **Zone-Redundant Persistence**: Deploy PostgreSQL Flexible Server with multi-AZ replication, automated daily snapshots, and 15-minute point-in-time recovery (PITR).
* **Distributed Redis / Valkey Clustering**: Replace standalone instances with clustered Redis Sentinel to synchronize rate limiting, session revocation, and WebSocket broadcast events across multiple regions.
* **Cloud FinOps Optimization**: Implement automated off-hours auto-pause for non-production environments and S3/Blob intelligent tiering to keep total infrastructure costs under $150/month for 5,000 students.

## 6. Dependency Supply Chain Security & Offline Readiness
* **Offline Bundling Pipelines**: Utilize `dependencies/python_wheels/`, `dependencies/ai_weights/`, and `dependencies/node_cache/` for zero-internet air-gapped deployments in secured government or defense university intranets.
* **Automated CVE Scans**: Integrate automated `pip-audit` and `npm audit` gates into CI/CD pipelines to block builds containing vulnerabilities with severity CVSS > 7.0.
* **Pre-Baked Container Images**: Publish hardened multi-architecture (amd64 / arm64) base container images containing pre-compiled wheels and pre-cached neural weights for rapid container startup.
