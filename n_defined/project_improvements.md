# Project Improvement Guide & Roadmap

This document outlines strategic architectural and feature enhancements to elevate the **EduIdentityAI** platform to an enterprise-grade production ecosystem.

---

## 1. Security & Compliance Hardening
* **JWT Token Blacklisting**: Implement token revocation lists in Valkey/Redis so logout immediately invalidates active sessions.
* **Database Migrations (Alembic)**: Replace direct `Base.metadata.create_all()` with Alembic database migration scripts to manage zero-downtime schema upgrades in PostgreSQL.
* **Content Security Policy (CSP)**: Enforce strict CSP HTTP headers to prevent Cross-Site Scripting (XSS) and clickjacking attacks.

## 2. Artificial Intelligence & RAG Enhancements
* **Hybrid Search (Vector + BM25)**: Combine dense Qwen3 vector embeddings with sparse BM25 keyword matching (Hybrid Search) in Qdrant for superior retrieval precision.
* **LLM Streaming Responses**: Implement Server-Sent Events (SSE) or WebSocket streaming for RAG chatbot responses so AI answers stream word-by-word with typing animations.

## 3. Monitoring & Developer Experience
* **Automated CI/CD Workflows**: Add GitHub Actions workflows to run automated unit tests (`python -m unittest`), linting (`flake8`), and Docker image builds on every pull request.
* **Grafana Dashboards**: Fully wire the JSON dashboard files located in `configs/grafana/` to Prometheus metrics for automated SLA and executive KPI scorecards.
