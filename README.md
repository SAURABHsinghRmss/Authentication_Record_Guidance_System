# EduIdentityAI — Student Authentication, Record & Guidance System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![Alpine.js](https://img.shields.io/badge/Alpine.js-3.17-8BC0D0?logo=alpinedotjs&logoColor=white)](https://alpinejs.dev)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.1-D71F00?logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org)

**EduIdentityAI** is an advanced, AI-powered multi-database federated academic identity management, record governance, application validation, documentation authentication, and regulatory compliance verification platform tailored specifically for India's Digital Public Infrastructure (DPI) and educational standards.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [System Architecture & Directory Layout](#-system-architecture--directory-layout)
- [Exclusive Sarvam AI Integration](#-exclusive-sarvam-ai-integration)
- [India Digital Public Infrastructure (DPI) Integrations](#-india-digital-public-infrastructure-dpi-integrations)
- [Payments, Security Deposits & FDR Escrow Portal](#-payments-security-deposits--fdr-escrow-portal)
- [Admin Complaints Dashboard & AICTE Workflow Automation](#-admin-complaints-dashboard--aicte-workflow-automation)
- [Getting Started](#-getting-started)
- [Automated Testing](#-automated-testing)

---

## 🌟 Key Features

1. **Mobile-First Secure Authentication & Sign-In**:
   - Mobile number primary sign-in with OTP verification and automatic linked email resolution.
   - Per-user **Sarvam AI API Key** input for AI-powered validation and compliance features.

2. **Exclusive Sarvam AI Integration (`sarvam-105b`)**:
   - Sovereign Indian AI powering application validation, documentation authentication, regulatory compliance verification, and EduMentor AI mentoring.

3. **Student Dashboard & Notice Board**:
   - Logged-in students are greeted by the official **Notice Board** (academic bulletins, ABC/APAAR ID synchronization, and scholarship disbursals).
   - Positioned directly below is the prominent **"Enrolled Institutes"** hub button for one-click access to multi-institute academic histories.

4. **Three-Category Chat System**:
   - **Personal AI Mentor Chat**, **Private Study Groups**, and **Global Campus Announcements** (EduMentor Meta AI style with 8 educational criteria).

5. **Multi-Mode Payments, Security Deposits & FDR Escrow Portal**:
   - Multi-mode payment support (**UPI**, **NetBanking**, **Credit/Debit Card**, **SBIePay**, **PFMS Treasury**).
   - Fixed Deposit Receipt (FDR) escrow portal for AICTE statutory reserves and caution money management, fully interconnected across all roles (`student`, `faculty`, `parent`, `institute`, `admin`).

6. **Admin Complaints Dashboard & AICTE Approval Workflow Automation**:
   - Monitoring and tracking institutional complaint cases across AICTE Bureaus/Cells (Approval Bureau, Payment & Finance Cell, Anti-Ragging Cell, Quality Assurance Bureau).
   - 5-stage approval lifecycle automation (Intake, EVC Inspection, Standing Hearing Committee, Executive Committee, LoA/EoA issuance) with real-time severity-tagged compliance alerts.

7. **India Digital Public Infrastructure (DPI) & Cross-Role Pipelines**:
   - Official Indian governance service integrations: **APAAR ID / Academic Bank of Credits (ABC)** via DigiLocker, **National Scholarship Portal (NSP)** DBT, **AICTE Portal SIF**, **UIDAI Aadhaar**, and **PFMS & SBIePay** reconciliation.
   - **Cross-Role Pipelines** bridging Parent-Student ward monitoring, Faculty-Student Sarvam AI document verification, and Institute-Admin compliance escalations.

8. **Official Redesigned Landing Presentation Page & Role Portals**:
   - Stunning animated hero presentation with scrollable role exploration cards for all 5 roles (`Student`, `Faculty`, `Institute`, `Parent`, `Admin`), linking directly to role-specific secure sign-in gateways.

---

## 📂 System Architecture & Directory Layout

```text
Authentication_Record_Guidance_System/
├── backend/                        # FastAPI REST Application & Core Logic
│   ├── api/
│   │   ├── main.py                 # Application factory, lifespan, CORS, rate limiter
│   │   ├── dependencies.py         # JWT extraction, OAuth2 Bearer, RBAC guards
│   │   └── routes/                 # Auth, Mobile Auth, Complaints, DPI, Payments/FDR, Chat, RAG, WS
│   ├── core/
│   │   └── config.py               # Pydantic settings & polyglot domain DB paths
│   ├── models/
│   │   └── student.py              # SQLAlchemy ORM models & Pydantic schemas
│   ├── services/
│   │   ├── db.py                   # Primary SQLAlchemy session and engine
│   │   ├── db_federation.py        # Polyglot 7-Database domain federation manager
│   │   ├── sarvam_ai_service.py    # Exclusive Sarvam-105B AI integration service
│   │   ├── india_dpi_integration_service.py # APAAR, ABC, NSP, AICTE SIF, Aadhaar, PFMS
│   │   ├── payment_fdr_escrow_service.py    # Multi-mode payments & FDR escrow portal
│   │   ├── admin_complaints_aicte_service.py # Admin complaints & AICTE workflow automation
│   │   ├── cross_role_pipeline_service.py    # Cross-role function connectivity bridges
│   │   └── edumentor_ai_service.py # EduMentor AI copilot service
│   └── tests/                      # 63 automated unit & integration tests
├── databases/                      # 7 Federated Domain-Isolated Databases
├── frontend/                       # Lit & Alpine.js Web Application
│   ├── index.html                  # Redesigned landing presentation & role portals
│   ├── js/app.js                   # Alpine.js reactive controller
│   └── css/style.css               # Cyber-glassmorphic styling & themes
└── storage/                        # Persistent & Staged Application Data
```

---

## 🧪 Automated Testing

Run the full test suite (63 passing tests):
```bash
pytest backend/tests/
```
