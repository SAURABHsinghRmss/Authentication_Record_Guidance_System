# EduIdentityAI — Multi-Role Zero-Conflict Frontend Architecture

Architecture and implementation plan to completely separate the frontend into 5 independent role-based portals (Student, Faculty Mentor, Parent Guardian, Institute Governance, and Administrator), eliminating cross-role functional leakage, establishing logical boundaries with clear rationales, and enforcing formal authentication-based role access.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural directions below were confirmed through user clarifications in Phase 1:
> - **Navigation & Layout**: Completely independent portal themes and layouts for each role (no shared single-sidebar clutter).
> - **Tool & Feature Scoping**: Strictly restrict shared capabilities (e.g., Unified Chat Agora, Biometrics Terminal, Scam Shield) only to roles where explicitly mandated by business logic.
> - **Authentication & Switching**: Formal authentication logout and login per role account (clean session boundaries without arbitrary in-app role jumping).

---

## 1. Overview & Core Concept

### What It Does
EduIdentityAI is a unified academic identity, governance, and regulatory verification platform. Currently, the user interface uses a unified sidebar that exposes technical infrastructure, developer tooling, and cross-role views indiscriminately to all users. 

This implementation replaces the shared monolith with **5 completely independent, tailored frontend portals**:
1. **Student Academic Portal (`StudentPortal`)**: Personal transcripts, Academic Bank of Credits (APAAR/DigiLocker), EduMentor Meta AI tutor, multimodal biometric verification, scam shield, and career placement tracking.
2. **Faculty Mentorship Portal (`FacultyPortal`)**: Student mentee rosters, automated at-risk early warnings (attendance < 75%), longitudinal counseling notes, faculty council discussions, and academic research verifier.
3. **Parent Guardian Portal (`ParentPortal`)**: Ward academic monitor, attendance compliance gauge, direct 1-on-1 faculty mentor hotline, fee escrow receipts, and plain-language policy explanations.
4. **Institute Governance Portal (`InstitutePortal`)**: AICTE Standard Inspection Format (SIF) compliance, department capacities, faculty-student ratio telemetry, accreditation vault, and campus-wide statutory circular broadcasting.
5. **Administrator & Regulatory Portal (`AdminPortal`)**: AICTE grievance resolution queue, 3NF student record lifecycle (CRUD), polyglot 7-database federation orchestrator, institution approval workflow, and security audit log forensics.

### Target Audience & Personas
- **Students**: Learners managing records, attendance, verify exams, and seeking AI tutoring.
- **Faculty / Mentors**: Teachers monitoring academic performance and delivering student guidance.
- **Parents / Guardians**: Families tracking their ward's academic standing and attendance thresholds.
- **Deans / Institute Officials**: Institutional administrators managing college accreditation and AICTE compliance.
- **System Administrators / AICTE Officers**: Regulatory auditors and system architects maintaining data integrity and federation.

---

## 2. Role Functionality Analysis & Logical Separation Rationale

The table below details what each role needs, what has been removed to prevent conflicts, and the logical rationale for the change:

| Role | Permitted Capabilities & Views | Restricted / Removed Capabilities | Logical Separation Rationale |
| :--- | :--- | :--- | :--- |
| **Student** | • Personal Transcript & Metrics (CGPA, Backlogs, Credits)<br>• APAAR ID / DigiLocker Verification<br>• EduMentor Meta AI (8 Academic Criteria)<br>• Peer & Club Chat Agora<br>• Multimodal Biometric Verification<br>• Opportunity Scam Shield<br>• Career Pathways & Placements | • 7-DB Federation Console<br>• Student Database CRUD<br>• Institute SIF Governance<br>• Faculty Mentorship Rosters<br>• At-Risk Student Dispatch<br>• Developer Template Studio | Students should only view and mutate their own academic records. Exposing infrastructure federation or administrative CRUD compromises system integrity and causes extreme cognitive clutter. |
| **Faculty** | • Assigned Mentee Roster<br>• At-Risk Student Warning Desk (Attendance < 75%)<br>• Longitudinal Counseling Notes Ledger<br>• Direct Mentee & Faculty Council Chat<br>• EduMentor AI Pedagogical Assistant<br>• Research & Journal Verifier | • Root 7-DB Cluster Management<br>• Student Job Application Scrutiny<br>• Institute AICTE SIF Accreditation<br>• System Audit Log Traversal<br>• Parent Financial Kinship Management | Faculty need focused teaching and student counseling tools. They must not be burdened with server federation operations or institutional accreditation paperwork. |
| **Parent** | • Ward Overview & Progress Card<br>• Real-Time Attendance Compliance Ring (<75% alert)<br>• Direct Faculty Mentor Hotline (1-on-1)<br>• Fee Payment & Escrow Clearance Receipts<br>• Plain-Language Policy Advisory<br>• Family Scam Defense | • Peer Social Chat Agora<br>• Other Students' Academic Data<br>• Faculty Workload Rosters<br>• 7-DB Federation Console<br>• Administrative Database Tools | Parents require a clean, empathetic, privacy-preserving view of *their ward only*. Exposing campus peer chats or complex database settings violates student privacy and creates confusion. |
| **Institute** | • AICTE SIF Governance & Compliance<br>• Department Roster & Faculty-Student Ratios<br>• Accreditation Document Vault (NAAC/NBA)<br>• Official Campus Statutory Notice Broadcaster<br>• Institutional Verification Status Monitor | • Individual Student Peer Chat Rooms<br>• Multi-University Database Cluster Federation<br>• Developer Code Template Studio<br>• Student Career Resumes | College deans require high-level institutional oversight, regulatory reporting, and campus-wide broadcasting, distinct from root server infrastructure or student private chatrooms. |
| **Admin** | • AICTE Grievance & Complaint Bureau<br>• Full Student Lifecycle CRUD (3NF SQLite/Postgres)<br>• 7-Database Domain Federation Orchestrator<br>• Institutional Accreditation Approval Workflow<br>• Security Audit Streams & Biometric Review Flags | • Casual Student Chat Feeds<br>• Student Exam Preparation Drills<br>• Daily Mentee Grading Worksheets | Administrators manage the sovereign platform's health, compliance complaints, and institutional approvals. Their view is a high-density, high-security mission control room. |

---

## 3. User Experience & Visual Design

### Design System & Layout Architecture (SaaS & Dashboard Domain)
Adhering to the Universal Frontend Design Constitution and SaaS/Dashboard guidelines:
- **Zero-Pill Metadata**: Statuses and timestamps rendered as clean unboxed text with subtle typographic separators (`·`, `/`).
- **Tabular Figures**: All metric values, timestamps, and numeric scores use `tabular-nums` and `font-mono`.
- **Top Bar Contract**: Breadcrumb trail on the left, clear user identity & role badge in the center, and a single primary action/Logout button on the right (`whitespace-nowrap shrink-0`).
- **Single-Elevation Depth**: Flat slate surfaces with 1px hairline dividers (`border-slate-800`), avoiding nested card-in-card clutter.
- **No Mechanical Slop**: No `//` comment headers, no fake telemetry tickers, no arbitrary AI percentage scores.

### Distinct Visual Themes per Role Portal

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Role-Specific Color Themes                      │
├───────────────────┬──────────────────────┬─────────────────────────────┤
│ Role Portal       │ Primary Accent       │ Layout Atmosphere           │
├───────────────────┼──────────────────────┼─────────────────────────────┤
│ StudentPortal     │ Electric Blue/Indigo │ Academic & Focus-Centric    │
│ FacultyPortal     │ Deep Cobalt/Cyan     │ Scholastic & Mentorship     │
│ ParentPortal      │ Warm Amber/Gold      │ Empathetic & Clear Ward KPI │
│ InstitutePortal   │ Forest Teal/Emerald  │ Statutory & Institutional   │
│ AdminPortal       │ Crimson/Rose Slate   │ High-Security Mission Grid  │
└───────────────────┴──────────────────────┴─────────────────────────────┘
```

---

## 4. Technical Architecture & Component Hierarchy

### Component Architecture Diagram

```
                              ┌─────────────────────────┐
                              │     App.tsx (Root)      │
                              └────────────┬────────────┘
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     ▼                                           ▼
          ┌──────────────────────┐                   ┌──────────────────────┐
          │     LandingPage      │                   │   AuthContext.tsx    │
          │ (Role Login & OAuth) │                   │  (Session & Roles)   │
          └──────────────────────┘                   └──────────┬───────────┘
                                                                │
         ┌──────────────────┬─────────────────┬─────────────────┼─────────────────┐
         ▼                  ▼                 ▼                 ▼                 ▼
  ┌─────────────┐    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
  │StudentPortal│    │FacultyPortal│   │ParentPortal │   │InstitutePrtl│   │ AdminPortal │
  ├─────────────┤    ├─────────────┤   ├─────────────┤   ├─────────────┤   ├─────────────┤
  │StudentHeader│    │FacultyHeader│   │ParentHeader │   │InstHeader   │   │ AdminHeader │
  │StudentNav   │    │FacultyNav   │   │ParentNav    │   │InstNav      │   │ AdminNav    │
  │Views:       │    │Views:       │   │Views:       │   │Views:       │   │Views:       │
  │•Dashboard   │    │•Roster Desk │   │•Ward Monitor│   │•SIF Governc │   │•Grievances  │
  │•Transcripts │    │•At-Risk Warn│   │•Attendance  │   │•Departments │   │•Student CRUD│
  │•EduMentor AI│    │•Counseling  │   │•Mentor Line │   │•Broadcaster │   │•7-DB Fed    │
  │•Biometrics  │    │•Pedagogy AI │   │•Fee Escrow  │   │•Accreditatn │   │•Inst Approve│
  │•Scam Shield │    │•Research Vrf│   │•Policy FAQs │   │             │   │•Audit Logs  │
  │•Career Hub  │    │             │   │             │   │             │   │             │
  └─────────────┘    └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

### File & Directory Strategy
- `src/components/portals/student/`:
  - `StudentPortal.tsx`: Top-level shell with student theme, header, and dedicated navigation.
  - `StudentDashboardView.tsx`, `StudentTranscriptsView.tsx`, `StudentAiGuidanceView.tsx`, `StudentBiometricsView.tsx`, `StudentScamShieldView.tsx`, `StudentCareerHubView.tsx`.
- `src/components/portals/faculty/`:
  - `FacultyPortal.tsx`: Dedicated faculty shell.
  - `FacultyRosterView.tsx`, `FacultyAtRiskView.tsx`, `FacultyCounselingLedgerView.tsx`, `FacultyPedagogyAiView.tsx`, `FacultyResearchVerifierView.tsx`.
- `src/components/portals/parent/`:
  - `ParentPortal.tsx`: Dedicated parent shell.
  - `ParentWardOverviewView.tsx`, `ParentAttendanceAlertsView.tsx`, `ParentMentorHotlineView.tsx`, `ParentFeeReceiptsView.tsx`.
- `src/components/portals/institute/`:
  - `InstitutePortal.tsx`: Dedicated institute governance shell.
  - `InstituteSifView.tsx`, `InstituteDepartmentRosterView.tsx`, `InstituteBroadcastAgoraView.tsx`, `InstituteAccreditationVaultView.tsx`.
- `src/components/portals/admin/`:
  - `AdminPortal.tsx`: Dedicated administrative shell.
  - `AdminGrievanceQueueView.tsx`, `AdminStudentCrudView.tsx`, `AdminDbFederationView.tsx`, `AdminInstitutionApprovalsView.tsx`, `AdminAuditForensicsView.tsx`.
- `src/components/LandingPage.tsx`:
  - Clean role-based login gateway offering 1-click persona logins (`Student`, `Faculty`, `Parent`, `Institute`, `Admin`) and standard Google OAuth login.
- `src/App.tsx`:
  - Inspects `isLoggedIn` and `currentRole`.
  - Routes directly to the matching portal component (`<StudentPortal />`, `<FacultyPortal />`, etc.).
  - Eliminates the monolithic shared sidebar and cross-role tab switching.

---

## 5. Verification & Testing Plan

1. **Compilation & Type Safety**:
   - Run `compile_applet` to guarantee complete TypeScript compilation with zero errors.
   - Run `lint_applet` to ensure syntax, imports, and component props are strictly typed.
2. **Role Isolation Verification**:
   - Verify that logging in as `student` displays only student tabs with zero administrative or faculty controls.
   - Verify that logging in as `faculty` displays mentee roster, at-risk warnings, and counseling tools, with no database federation or student scam shield views.
   - Verify that logging in as `parent` shows strictly ward attendance, grade metrics, and mentor hotline.
   - Verify that logging in as `institute` shows SIF governance, departments, and statutory circular broadcasts.
   - Verify that logging in as `admin` loads the 7-DB federation console, grievance triage, student CRUD, and audit streams.
3. **Session & Logout Integrity**:
   - Verify that clicking "Logout" in any portal immediately returns the user to the `LandingPage` with clean localStorage state.
4. **Data Persistence & Fallbacks**:
   - Ensure all student records, complaints, biometric events, and chat messages retain real-time Firebase sync with safe local fallbacks.
