# Database & Localhost Analysis Report
**EduIdentityAI — Student Authentication, Record & Guidance System**
*Date: Thursday, 22 October 2026*

---

## 1. Database Establishment & Federation Status

All required SQLite databases are fully established, structured, and operational within the workspace:

- **`eduidentity.db`**: Primary overarching SQLite database.
- **`databases/auth_iam.db`**: Domain 1 — Authentication, IAM, credentials, and user tokens.
- **`databases/academic_sis.db`**: Domain 2 — Student Information System (SIS), grades, attendance, and coursework.
- **`databases/family_heritage.db`**: Domain 3 — Parent-ward linkages, socio-economic data, and heritage logs.
- **`databases/institutions_governance.db`**: Domain 4 — Institutional accreditation, AICTE SIF filings, and governance.
- **`databases/security_audit.db`**: Domain 5 — Security audit stream, threat intelligence, and tamper detection logs.
- **`databases/career_pathways.db`**: Domain 6 — Technical skill roadmaps, internships, and placement drives.
- **`databases/notifications_events.db`**: Domain 7 — Real-time alerts, system notices, and broadcast events.

### Auto-Seeding Mechanism
On first login or access, the backend database service (`backend/services/db.py` & `backend/api/routes/auth_routes.py`) automatically seeds standard role accounts if they do not already exist, guaranteeing zero cold-start failures.

---

## 2. Localhost & Proxy Architecture

The platform runs across partitioned backend ports and a Vite-powered frontend portal:

- **Frontend Portal**: `http://localhost:3000` (Vite development server)
- **Unified FastAPI Backend Gateway**: `http://localhost:8000` (Handles all API routes, WebSockets, and RAG queries)
- **Role-Specific Isolated Backends** (when using `start_role_servers.bat`):
  - Student Portal: `http://localhost:8001`
  - Faculty Portal: `http://localhost:8002`
  - Parent Portal: `http://localhost:8003`
  - Institute Portal: `http://localhost:8004`
  - Admin Control Center: `http://localhost:8005`

### Vite Proxy Configuration (`frontend/vite.config.js`)
All `/api`, `/rag_query`, `/ws`, `/health`, and `/metrics` requests originating from port `3000` are automatically proxied to `http://localhost:8000`, ensuring seamless local communication without CORS errors.

---

## 3. Verified Demo Credentials for Instant Login

| Role | Username | Password | Mobile Number | Port |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `amit` | `amit123` | `+91 9876543210` | `:8001` / `:8000` |
| **Faculty** | `faculty` | `faculty123` | `+91 9123456780` | `:8002` / `:8000` |
| **Parent** | `parent_alex` | `parent123` | `+91 9876543211` | `:8003` / `:8000` |
| **Institute** | `institute_admin` | `inst123` | `+91 9876543212` | `:8004` / `:8000` |
| **Admin (`msrch`)** | `msrch` | `msrch1410#` | `+91 9876543219` | `:8005` / `:8000` |

---

## 4. Troubleshooting & Login Instructions

1. **Start the System**: Double-click `start_system.bat` and choose option **[1] Standard Unified System** or option **[2] Multi-Role Isolated Servers**.
2. **Access Frontend**: Open your browser at `http://localhost:3000`.
3. **Select Role**: Explore the landing presentation page, scroll down to the role cards, and click **"Login as [Role]"**.
4. **Instant Login**: Click the **⚡ Quick Fill Demo Account** button inside the modal to instantly populate valid credentials and log in securely.
