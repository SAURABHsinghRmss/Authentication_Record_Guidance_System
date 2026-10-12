# Inter-Role Dependency, Information Flows & Cross-Role Drawbacks Analysis

> **Platform**: EduIdentityAI  
> **Target**: Comprehensive operational dependency mapping and gap analysis of what each role requires from others, and the systemic drawbacks when those needs cannot be met.

---

## 📑 Table of Contents

1. [Inter-Role Dependency & Information Flow Matrix](#1-inter-role-dependency--information-flow-matrix)
2. [Detailed Role-to-Role Dependency Analysis](#2-detailed-role-to-role-dependency-analysis)
    - 2.1 Student Dependencies
    - 2.2 Mentor Teachers / Faculty Dependencies
    - 2.3 Institute / Institution Dependencies
    - 2.4 Parent / Guardian Dependencies
    - 2.5 Administrator Dependencies
3. [Critical Drawbacks & Failure Modes ("What if a role wants and can't get?")](#3-critical-drawbacks--failure-modes-what-if-a-role-wants-and-cant-get)
4. [Strategic Architectural Recommendations to Bridge Gaps](#4-strategic-architectural-recommendations-to-bridge-gaps)

---

## 1. Inter-Role Dependency & Information Flow Matrix

| Requester Role | Target Role | Information / Action Needed | Current System Mechanism |
| :--- | :--- | :--- | :--- |
| **Student** | Faculty / Mentor | Counseling notices, assignment grading, attendance marking, remedial schedules | Faculty roster dashboard & AI guidance RAG queries |
| **Student** | Institute / Admin | Verified credentials, fee clearance, institutional registration, APAAR/DigiLocker validation | Student CRUD table & DigiLocker sandbox endpoints |
| **Faculty** | Student | Attendance logs, assignment submissions, academic performance metrics | Student database (`students` table) & CGPA/attendance records |
| **Faculty** | Admin / Institute | Roster approval, department policy updates, system permissions | Admin user management & RBAC guards (`require_role`) |
| **Parent** | Student / Faculty | Real-time attendance, grade reports, counselor feedback, fee/dues status | AI Guidance summary (currently accessed via student/faculty portal) |
| **Institute** | Admin | System tenant provisioning, verification status, infrastructure scaling | Institution request approval tab (`admin_institutions`) |
| **Admin** | Institute / Users | Audit telemetry, login histories, user work activity streams | Partitioned storage logs (`storage/logs/users/{email}/`) |

---

## 2. Detailed Role-to-Role Dependency Analysis

### 2.1 Student Dependencies
* **Needs from Faculty**: Timely attendance marking, prompt assignment feedback, and academic guidance during remediation.
* **Needs from Institute/Admin**: Instant verification of academic standing, fee receipt acknowledgments, and issuance of digital admit cards for exams.

### 2.2 Mentor Teachers / Faculty Dependencies
* **Needs from Students**: Active engagement, prompt submission of work, and attendance presence in classes.
* **Needs from Institute/Admin**: Accurate student enrollment lists, departmental course plans, and administrative authorization to dispatch counseling notices.

### 2.3 Institute / Institution Dependencies
* **Needs from Admin**: Reliable server infrastructure, database tenant isolation, and verification of institutional registration requests.
* **Needs from Faculty & Students**: Compliance with institutional attendance norms (75% threshold) and adherence to academic calendars.

### 2.4 Parent / Guardian Dependencies
* **Needs from Student**: Transparent sharing of academic progress, exam results, and schedule updates.
* **Needs from Faculty/Institution**: Proactive alerts when a student falls below attendance thresholds, incurs backlogs, or faces mental burnout.

### 2.5 Administrator Dependencies
* **Needs from All Users**: Valid authentication credentials, adherence to rate limiting, and uncorrupted audit event streams.
* **Needs from Institute**: Official institutional verification details to approve pending tenant registrations.

---

## 3. Critical Drawbacks & Failure Modes ("What if a role wants and can't get?")

### Drawback Scenario 1: Parent Wants Real-Time At-Risk Alerts, But Faculty Data is Stale
* **The Desire**: A parent logs in to check if their child is attending classes and maintaining a safe CGPA.
* **The Block / Friction**: Currently, student attendance and backlogs in `EduIdentityAI` are stored as static fields (`attendance_percentage`, `backlogs`) updated via batch admin/faculty CRUD rather than real-time daily sensor/class check-ins.
* **Systemic Drawback**: Parents receive delayed or lagging information. If a student's attendance drops sharply mid-semester, neither the student nor the parent receives automated proactive triggers until faculty manually update the database.

### Drawback Scenario 2: Student Wants Instant Fee & Admit Card Clearance, But Admin Approval is Pending
* **The Desire**: A student needs to download their semester admit card to appear for upcoming end-semester examinations.
* **The Block / Friction**: The system currently lacks an automated fee payment gateway and an admit card generation module (as noted in `student.txt` roadmap as "Left / Pending"). Furthermore, if the student's institution registration is pending verification by an administrator (`admin_institutions`), certain restricted workflows are bottlenecked.
* **Systemic Drawback**: Administrative latency blocks students from taking exams or completing academic registrations, creating high anxiety and friction during crunch periods.

### Drawback Scenario 3: Faculty Wants Cross-Semester Behavioral Analytics & Communication History, But Logs Are Isolated per User
* **The Desire**: A mentor teacher wants to view a chronological history of all mentoring notes, counseling alerts, and past AI guidance interactions for a struggling student.
* **The Block / Friction**: User work logs and activity streams in `EduIdentityAI` are strictly partitioned by Gmail address in isolated filesystem directories (`storage/logs/users/{user_email}/`). There is no unified faculty-facing relational view or cross-user audit aggregation table in SQLite/PostgreSQL for mentoring history.
* **Systemic Drawback**: Faculty suffer from fragmented visibility. They must inspect individual files or rely solely on summary metrics (`cgpa`, `backlogs`) without seeing the qualitative dialogue history between the student and the AI RAG advisor.

### Drawback Scenario 4: Administrator Wants Unified Cross-Campus Audit Visibility, But Relies on Filesystem Traversal
* **The Desire**: An administrator (`msrch` / `admin`) wants to query system-wide activity trends or search for suspicious login patterns across all users instantly.
* **The Block / Friction**: While the backend provides `/api/auth/work-logs/locations` and `/api/auth/work-logs/user/{email}`, inspecting logs requires traversing filesystem directories or calling individual user endpoints. There is no centralized indexing database table for user activity streams.
* **Systemic Drawback**: Scalability bottleneck. As the user base grows from dozens of demo accounts to 5,000+ students, filesystem traversal becomes slow and unindexed, delaying forensic security audits.

---

## 4. Strategic Architectural Recommendations to Bridge Gaps

1. **Relational Event Indexing**: Migrate partitioned JSONL log entries into indexed PostgreSQL tables (`user_work_logs`) while maintaining compressed filesystem archives for cloud storage.
2. **Automated Event-Driven Webhooks**: Implement event-driven triggers in FastAPI that instantly broadcast notifications (via WebSockets or SMS/Email stubs) to parents and mentors whenever a student's attendance drops below 75%.
3. **Dedicated Parent & Admit Card Modules**: Implement the missing `parent.txt` portal view and `Registration & Admit Card` generation endpoints to resolve student-admin bottlenecks.
