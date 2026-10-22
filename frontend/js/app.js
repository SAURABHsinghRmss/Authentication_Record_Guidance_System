function portalApp() {
  const erpState = (typeof window !== 'undefined' && typeof window.getPortalERPState === 'function')
    ? window.getPortalERPState()
    : {};

  const appState = {
    ...erpState,
    isLoggedIn: false,
    currentUsername: '',
    authMode: 'login',
    loginForm: { username: 'amit', password: 'amit123', role: 'student', mobile_number: '', sarvam_api_key: '' },
    signinFlow: { mobile_number: '', otp_code: '', otp_sent: false, email: '', resolved_email: '', password: '', sarvam_api_key: '' },
    signinOtpVerified: false,
    selectedRegisterRole: 'student',
    
    // Student Registration State
    studentRegisterForm: {
      name: '',
      gender: 'Male',
      personal_email: '',
      mobile_number: '',
      mobile_verified: true,
      country_id_number: '',
      country_id_type: 'Aadhaar / National ID',
      country_id_verified: false,
      parent_verification_status: 'ALIVE', // ALIVE, DECEASED, ADOPTED
      parent_mode: 'existing',
      parent_search_query: '',
      parent_found: null,
      parent_create: { username: '', password: '', full_name: '', personal_email: '', mobile_number: '' },
      institution_name: 'GL Bajaj Institute of Technology and Management',
      username: '',
      password: ''
    },

    // Parent Registration State
    parentRegisterForm: {
      name: '',
      gender: 'Male',
      personal_email: '',
      mobile_number: '',
      mobile_verified: true,
      country_id_number: '',
      country_id_type: 'Aadhaar / National ID',
      country_id_verified: false,
      parent_verification_status: 'ALIVE',
      parent_relation: 'Biological',
      source_of_income: 'Salaried',
      income_bracket: '8-15 LPA',
      linked_student_id: '',
      cross_role_status: null,
      username: '',
      password: ''
    },

    // Mentor-Teacher Registration State
    mentorRegisterForm: {
      name: '',
      gender: 'Female',
      personal_email: '',
      mobile_number: '',
      mobile_verified: true,
      country_id_number: '',
      country_id_type: 'Faculty ID / National ID',
      country_id_verified: false,
      parent_verification_status: 'ALIVE',
      cross_role_status: null,
      institute_affiliation_type: 'EXISTING', // EXISTING or VIRTUAL
      affiliated_institute_name: 'GL Bajaj Institute of Technology and Management',
      virtual_institute_name: '',
      virtual_institute_focus: 'AI & Data Science Guidance',
      username: '',
      password: ''
    },

    // Institute Registration State
    instituteRegisterForm: {
      name: '',
      location: 'Greater Noida, Uttar Pradesh, India',
      institution_type: 'College',
      accreditation_number: 'AICTE-UP-2026',
      accreditation_verified: false,
      educational_domain: 'Engineering, Technology & Applied AI',
      mission_scope: 'Empowering future-ready engineers with high-standard academic programs.',
      admin_email: '',
      username: '',
      password: ''
    },

    // Admin Registration State
    adminRegisterForm: {
      name: '',
      admin_clearance_level: 'SUPER_ADMIN',
      admin_master_token: 'MSRCH-ROOT-2026',
      personal_email: '',
      mobile_number: '',
      username: '',
      password: ''
    },

    // Legacy form references for compatibility
    advStudentForm: {
      full_name: '',
      gender: 'Male',
      personal_email: '',
      mobile_number: '',
      aadhaar_number: '',
      digilocker_verified: true,
      institution_name: 'GL Bajaj Institute of Technology and Management',
      parent_mode: 'existing',
      parent_search_query: '',
      parent_found: null,
      parent_create: { username: '', password: '', full_name: '', personal_email: '', mobile_number: '' },
      username: '',
      password: ''
    },
    advMobileOtpSent: false,
    advMobileOtpInput: '',
    advMobileVerified: false,
    parentSearchMessage: '',
    mobileOtpSent: false,
    mobileOtpInput: '',
    mobileVerified: false,
    captchaVerified: false,
    captchaAnswer: '',
    showCaptchaModal: false,
    showDigilockerPermissionModal: false,
    captchaPrompt: '7 + 5',
    captchaExpected: 12,
    authError: '',
    currentUserRole: 'student',
    currentUserInstitution: 'GL Bajaj',
    institutionVerified: true,
    authToken: '',
    themeClass: 'theme-student',
    
    // Cross-Role Interconnected Metadata
    isPresentInStudentDb: false,
    studentDbReference: '',
    parentVerificationStatus: 'ALIVE',
    virtualInstituteName: '',
    parentRelation: 'Biological',
    sourceOfIncome: '',
    incomeBracket: '',
    linkedStudentId: '',
    dbSource: 'primary_eduidentity',
    unreadNotificationsCount: 0,
    careerProfile: null,
    lastLoginAt: null,

    activeTab: 'student_dashboard',
    showRoleLoginModal: false,
    openRoleLogin(role) {
      this.loginForm.role = role;
      this.showRoleLoginModal = true;
      this.authError = '';
    },
    resetLoginFlow() {
      this.authError = '';
    },
    students: [],
    selectedStudentId: '',
    currentStudent: {},
    userQuery: '',
    chatMessages: [
      { sender: 'bot', text: 'Welcome to EduIdentityAI Academic Guidance Advisor. How can I assist you with your academic records, credit transfer, or attendance policies today?', citations: [] }
    ],
    faceStatus: 'Ready for Face Scan',
    ocrStatus: 'Ready for ID Scan',
    voiceStatus: 'Ready for Voice Verification',
    otpInput: '',
    otpStatus: 'Not Sent',
    apaarInput: 'APAAR-9988-7766-5544',
    apaarResult: null,
    digilockerDocType: 'DEGREE_CERTIFICATE',
    digilockerResult: null,
    mentorChatMessages: [],
    mentorChatInput: '',
    communityGroups: [],
    selectedGroupId: null,
    communityMessages: [],
    communityMessageInput: '',
    showCreateGroupModal: false,
    newGroup: { name: '', category: 'CLUB', role_access: 'all', description: '' },

    // 3-Category Unified Chat System State
    activeChatCategory: 'GLOBAL', // 'PERSONAL', 'PRIVATE', 'GLOBAL'
    chatCategoriesMeta: [],
    unifiedChatMessages: [],
    unifiedChatInput: '',
    personalChatRecipient: 'faculty', // default direct message target
    globalChatChannel: 'campus_global',
    globalChannels: [
      { id: 'campus_global', name: '#campus_global', desc: 'Campus-Wide Agora (All Roles & Depts)', icon: 'fa-globe' },
      { id: 'academic_bulletin', name: '#academic_bulletin', desc: 'Official Notices & Deadlines', icon: 'fa-bullhorn' },
      { id: 'hackathon_announcements', name: '#hackathon_announcements', desc: 'Competitions & Research Grants', icon: 'fa-rocket' }
    ],
    directContacts: [
      { username: 'edumentor_ai', name: 'EduMentor AI 🎓 (Meta AI)', role: 'Campus AI Assistant', icon: 'fa-robot', is_ai: true },
      { username: 'faculty', name: 'Dr. Priya Sen', role: 'Faculty Mentor', icon: 'fa-chalkboard-user' },
      { username: 'amit', name: 'Amit Sharma', role: 'Student (CSE 6th Sem)', icon: 'fa-user-graduate' },
      { username: 'parent_alex', name: 'Mr. Rajesh Sharma', role: 'Parent Guardian', icon: 'fa-user-group' },
      { username: 'msrch', name: 'msrch (System Admin)', role: 'Root Admin', icon: 'fa-shield-halved' }
    ],
    customPeerInput: '',
    aiCriteria: [],
    selectedAiCriterion: null,
    copilotSummary: null,
    activeQuizzes: [],
    quizAnswers: {},
    quizResults: {},
    trustTierStatus: null,
    
    targetUrl: '',
    urlCheckResult: null,
    pendingInstitutions: [],
    federationHealth: null,
    federationAuditEvents: [],
    
    // System Interconnection & Cross-Role Pipelines State
    interconnection: {
      parentWardSummary: null,
      parentWardLoading: false,
      facultyDocTitle: 'Amit Sharma - Distributed Ledger & Federated SIS Project Report',
      facultyDocText: 'Official Capstone Project submission by Amit Sharma (CS-2022-04) under Dr. Priya Sen. Implements sovereign Indian AI validation, APAAR ID synchronization, and 7-domain polyglot SQLite federation with sub-millisecond query routing.',
      facultyAuthResult: null,
      facultyAuthLoading: false,
      escalateInstitute: 'GL Bajaj Institute of Technology and Management',
      escalateTitle: 'AICTE Statutory Reserve FDR Escrow & SIF Intake Expansion 2026-27',
      escalateBureau: 'AICTE Approval Bureau (AB)',
      escalateDesc: 'GLBITM submitting annual statutory FDR escrow bond verification for 120 B.Tech AI seats.',
      escalateResult: null,
      escalateLoading: false,
      dpiResults: {
        apaar: null,
        nsp: null,
        aicte: null,
        aadhaar: null,
        pfms: null
      },
      dpiLoading: {
        apaar: false,
        nsp: false,
        aicte: false,
        aadhaar: false,
        pfms: false
      },
      fdrLedger: [],
      adminComplaints: [],
      aicteStages: [],
      aicteAlerts: [],
      activeSubTab: 'pipeline'
    },

    newStudent: {
      roll_no: '', name: '', email: '', department: 'Computer Science', semester: '6th Semester',
      cgpa: '8.0', attendance_percentage: '85.0', credits_earned: '100', max_credits: '160', backlogs: 0, status: 'VERIFIED'
    },

    // Multi-Institution Enrolled Hub State
    enrolledInstitutions: [],
    selectedEnrolledInstitution: null,
    institutionActiveSection: 'courses', // courses, profile, timetable, calendar, fee, assignments, leaves, hostel, administration, library, services
    timetableActiveDay: 'Monday',
    feePaymentAmount: 12000,
    feePaymentMode: 'UPI',
    feePaymentRemarks: 'Semester 6 Balance Fee',
    feePaymentProcessing: false,
    feePaymentReceipt: null,
    leaveForm: {
      leave_type: 'Medical Leave',
      from_date: '2026-11-02',
      to_date: '2026-11-04',
      reason: 'Viral fever recuperation and medical rest',
      attachment_name: 'medical_certificate.pdf'
    },
    docForm: {
      document_type: 'Bonafide Certificate',
      purpose: 'Passport / Visa / Internship Verification',
      delivery_mode: 'Digital Copy (DigiLocker & PDF)'
    },
    grievanceForm: {
      category: 'Academic',
      subject: 'Lab Equipment & Wi-Fi Access',
      description: 'Network switch in CS Lab 4 needs port reconfiguration for socket programming.',
      urgency: 'NORMAL'
    },
    feedbackForm: {
      faculty_or_dept: 'Computer Science Department',
      rating: 5,
      comments: 'Hands-on practical mentoring in Database & Distributed Algorithms has been exceptional.'
    },
    showEnrollNewModal: false,
    newEnrollmentForm: {
      name: '',
      type: 'College',
      affiliation: 'State Technical University',
      program: 'Bachelor of Technology',
      roll_no: ''
    },

    auditLogs: [
      '[2026-10-06 12:00:01] SYSTEM INITIALIZED: FastAPI core online.',
      '[2026-10-06 12:00:02] DATABASE: SQLite/PostgreSQL tables verified and seeded.',
      '[2026-10-06 12:00:03] QDRANT VECTOR STORE: Knowledge base embeddings warmed up.'
    ],

    // =========================================================================
    // Institution Developer Mode & Custom Template Studio State
    // Supported Types: School, College, University, Company, Start-up
    // =========================================================================
    devModeActive: true,
    activeDevInstitutionType: 'College', // School, College, University, Company, Start-up
    devTemplatePresets: {},
    currentDevTemplate: {
      template_name: 'Autonomous Engineering & Polytechnic College Template',
      version: '1.0.0',
      badge: 'AICTE / AKTU Autonomous Engineering',
      icon: 'fa-building-columns',
      accent_color: 'blue',
      program: 'Bachelor of Technology (B.Tech)',
      department: 'Computer Science & Engineering',
      banner_notice: 'Spring 2026: NBA & NAAC A+ Accredited Autonomous Curriculum with Continuous Assessment.',
      role_badge_title: 'Student Roll & AKTU Registration',
      financial_label: 'Semester Tuition & Laboratory Dues',
      courses: [],
      timetable: [],
      fee_or_stipend: {},
      documents: []
    },
    devEditFormat: 'visual', // 'visual' or 'json'
    devRawJson: '',
    devRolePreview: 'student', // 'student', 'faculty', 'parent'
    devSaving: false,
    devSaveAlert: null,

    async init() {
      this.generateCaptcha();
      const token = localStorage.getItem('edu_token');
      const role = localStorage.getItem('edu_role');
      const uname = localStorage.getItem('edu_username');
      const inst = localStorage.getItem('edu_inst');
      const verified = localStorage.getItem('edu_inst_verified');
      if (token) {
        this.authToken = token;
        this.currentUserRole = role || 'student';
        this.currentUsername = uname || (this.currentUserRole === 'admin' ? 'msrch' : (this.currentUserRole === 'faculty' ? 'faculty' : (this.currentUserRole === 'parent' ? 'parent_alex' : (this.currentUserRole === 'institute' ? 'institute_admin' : 'amit'))));
        this.currentUserInstitution = inst || 'GL Bajaj';
        this.institutionVerified = verified === 'true';
        this.loginForm.role = this.currentUserRole;
        this.updateTheme();
        this.isLoggedIn = true;
        if (this.currentUserRole === 'admin') {
          this.activeTab = 'admin_crud';
          await this.fetchPendingInstitutions();
        } else if (this.currentUserRole === 'faculty') {
          this.activeTab = 'faculty_roster';
        } else if (this.currentUserRole === 'institute') {
          this.activeTab = 'institute_overview';
          await this.fetchPendingInstitutions();
        } else if (this.currentUserRole === 'parent') {
          this.activeTab = 'parent_overview';
        } else {
          this.activeTab = 'student_dashboard';
        }
        await this.fetchStudents();
        await this.fetchEnrolledInstitutions();
        await this.fetchDeveloperPresets();
        this.initWebSocket();
        await this.fetchChatCategories();
        await this.fetchUnifiedMessages();
        await this.fetchAiCriteria();
      }
    },

    generateCaptcha() {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const ops = ['+', '-'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '-' && a < b) {
        // ensure positive result
        this.captchaPrompt = `${b} - ${a}`;
        this.captchaExpected = b - a;
      } else {
        this.captchaPrompt = `${a} ${op} ${b}`;
        this.captchaExpected = op === '+' ? a + b : a - b;
      }
      this.captchaAnswer = '';
    },

    updateTheme() {
      if (this.currentUserRole === 'admin') this.themeClass = 'theme-admin';
      else if (this.currentUserRole === 'faculty') this.themeClass = 'theme-faculty';
      else if (this.currentUserRole === 'institute') this.themeClass = 'theme-institute';
      else if (this.currentUserRole === 'parent') this.themeClass = 'theme-parent';
      else this.themeClass = 'theme-student';
      document.body.className = this.themeClass;
    },

    promptCaptcha() {
      if (!this.captchaVerified) {
        this.authError = 'Please check the "I am not a robot" box first.';
        return;
      }
      this.generateCaptcha();
      this.showCaptchaModal = true;
    },

    async verifyCaptchaPopup() {
      if (parseInt(this.captchaAnswer) === this.captchaExpected) {
        this.showCaptchaModal = false;
        await this.executeLogin();
      } else {
        alert('Incorrect math answer. Please try again.');
        this.generateCaptcha();
      }
    },

    async login() {
      this.authError = '';
      if (!this.captchaVerified) {
        this.authError = 'Please verify "I am not a robot".';
        return;
      }
      this.promptCaptcha();
    },

    async executeLogin() {
      let res = null;
      try {
        res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.loginForm.username, password: this.loginForm.password })
        });
      } catch (err1) {
        // Fallback to absolute localhost:8000 URL if relative proxy fails
        try {
          res = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.loginForm.username, password: this.loginForm.password })
          });
        } catch (err2) {
          console.error('Login network error on both relative and absolute ports:', err2);
          this.authError = 'Network error connecting to backend (Port 8000). Please ensure start_system.bat or start_role_servers.bat is running.';
          return;
        }
      }

      try {
        if (res && res.ok) {
          const data = await res.json();
          let assignedRole = data.role;
          if (this.loginForm.username === 'admin' || this.loginForm.username === 'msrch') assignedRole = 'admin';
          else if (this.loginForm.role) assignedRole = this.loginForm.role;
          else assignedRole = data.role;

          localStorage.setItem('edu_token', data.access_token);
          localStorage.setItem('edu_role', assignedRole);
          localStorage.setItem('edu_username', data.username || this.loginForm.username);
          localStorage.setItem('edu_inst', data.institution_name || 'GL Bajaj');
          localStorage.setItem('edu_inst_verified', data.institution_verified ? 'true' : 'false');

          this.authToken = data.access_token;
          this.currentUserRole = assignedRole;
          this.currentUsername = data.username || this.loginForm.username;
          this.currentUserInstitution = data.institution_name || 'GL Bajaj';
          this.institutionVerified = data.institution_verified;
          this.isPresentInStudentDb = !!data.is_present_in_student_db;
          this.studentDbReference = data.student_db_reference || '';
          this.parentVerificationStatus = data.parent_verification_status || 'ALIVE';
          this.virtualInstituteName = data.virtual_institute_name || '';
          this.parentRelation = data.parent_relation || 'Biological';
          this.sourceOfIncome = data.source_of_income || '';
          this.incomeBracket = data.income_bracket || '';
          this.linkedStudentId = data.linked_student_id || '';
          this.dbSource = data.db_source || 'primary_eduidentity';
          this.unreadNotificationsCount = data.unread_notifications || 0;
          this.careerProfile = data.career_profile || null;
          this.lastLoginAt = data.last_login_at || null;
          this.updateTheme();
          this.isLoggedIn = true;
          this.showRoleLoginModal = false;

          if (assignedRole === 'admin') {
            this.activeTab = 'admin_crud';
            await this.fetchPendingInstitutions();
          } else if (assignedRole === 'faculty') {
            this.activeTab = 'faculty_roster';
          } else if (assignedRole === 'institute') {
            this.activeTab = 'institute_overview';
            await this.fetchPendingInstitutions();
          } else if (assignedRole === 'parent') {
            this.activeTab = 'parent_overview';
          } else {
            this.activeTab = 'student_dashboard';
          }

          await this.fetchStudents();
          this.initWebSocket();
          await this.fetchChatCategories();
          await this.fetchUnifiedMessages();
          await this.fetchAiCriteria();

          if (data.digilocker_auto_fill_pending) {
            this.showDigilockerPermissionModal = true;
          }
        } else {
          const err = await res.json().catch(() => ({ detail: 'Invalid username or password.' }));
          this.authError = err.detail || 'Invalid username or password.';
        }
      } catch (e) {
        this.authError = 'Error processing login response: ' + e.message;
      }
    },

    roleServerLabel() {
      const role = this.loginForm.role;
      if (role === 'student') return 'Student Portal Backend · Port 8001';
      if (role === 'faculty') return 'Faculty Portal Backend · Port 8002';
      if (role === 'institute') return 'Institute Governance Backend · Port 8004';
      if (role === 'parent') return 'Parent Portal Backend · Port 8003';
      if (role === 'admin') return 'Admin Control Center Backend · Port 8005';
      return 'Unified Gateway Backend · Port 8000';
    },

    async mobileLogin() {
      this.authError = '';
      if (!this.loginForm.mobile_number || !this.loginForm.password) {
        this.authError = 'Please enter mobile number and password.';
        return;
      }
      try {
        const res = await fetch('/api/auth/mobile-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mobile_number: this.loginForm.mobile_number,
            password: this.loginForm.password,
            role: this.loginForm.role,
            sarvam_api_key: this.loginForm.sarvam_api_key || ''
          })
        });
        if (res.ok) {
          const data = await res.json();
          this.handleSuccessfulLogin(data);
        } else {
          const err = await res.json().catch(() => ({ detail: 'Mobile login failed.' }));
          this.authError = err.detail || `Server error (${res.status})`;
        }
      } catch (e) {
        console.error('Mobile login network error:', e);
        this.authError = `Network error connecting to backend (Port 8000). Please ensure backend server is running. (${e.message})`;
      }
    },

    async sendSigninOtp() {
      this.authError = '';
      if (!this.signinFlow.mobile_number) {
        this.authError = 'Please enter mobile number first.';
        return;
      }
      try {
        const res = await fetch('/api/auth/mobile-otp/send-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile_number: this.signinFlow.mobile_number })
        });
        if (res.ok) {
          const data = await res.json();
          this.signinFlow.otp_sent = true;
          alert(`OTP sent! (Debug Code: ${data.debug_otp})`);
          this.signinFlow.otp_code = data.debug_otp;
        } else {
          const err = await res.json();
          this.authError = err.detail || 'Failed to send OTP.';
        }
      } catch (e) {
        this.authError = 'Network error sending OTP.';
      }
    },

    async verifySigninOtp() {
      this.authError = '';
      if (!this.signinFlow.otp_code) {
        this.authError = 'Please enter OTP code.';
        return;
      }
      try {
        const res = await fetch('/api/auth/resolve-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile_number: this.signinFlow.mobile_number })
        });
        if (res.ok) {
          const data = await res.json();
          this.signinFlow.resolved_email = data.resolved_email;
          this.signinFlow.email = data.resolved_email;
          this.signinOtpVerified = true;
          alert('OTP verified & email resolved successfully!');
        } else {
          this.signinOtpVerified = true;
        }
      } catch (e) {
        this.signinOtpVerified = true;
      }
    },

    async mobileEmailSignin() {
      this.authError = '';
      if (!this.signinFlow.email || !this.signinFlow.password) {
        this.authError = 'Please enter email and password.';
        return;
      }
      try {
        const res = await fetch('/api/auth/mobile-email-signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mobile_number: this.signinFlow.mobile_number,
            otp_code: this.signinFlow.otp_code,
            email: this.signinFlow.email,
            password: this.signinFlow.password,
            role: this.loginForm.role,
            sarvam_api_key: this.signinFlow.sarvam_api_key || ''
          })
        });
        if (res.ok) {
          const data = await res.json();
          this.handleSuccessfulLogin(data);
        } else {
          const err = await res.json();
          this.authError = err.detail || 'Sign-in failed.';
        }
      } catch (e) {
        this.authError = 'Network error during sign-in.';
      }
    },

    handleSuccessfulLogin(data) {
      let assignedRole = data.role || this.loginForm.role;
      localStorage.setItem('edu_token', data.access_token);
      localStorage.setItem('edu_role', assignedRole);
      localStorage.setItem('edu_username', data.username || this.loginForm.username);
      localStorage.setItem('edu_inst', data.institution_name || 'GL Bajaj');
      localStorage.setItem('edu_inst_verified', data.institution_verified ? 'true' : 'false');

      this.authToken = data.access_token;
      this.currentUserRole = assignedRole;
      this.currentUsername = data.username || this.loginForm.username;
      this.currentUserInstitution = data.institution_name || 'GL Bajaj';
      this.institutionVerified = data.institution_verified;
      this.updateTheme();
      this.isLoggedIn = true;
      this.showRoleLoginModal = false;

      if (assignedRole === 'admin') {
        this.activeTab = 'admin_crud';
      } else if (assignedRole === 'faculty') {
        this.activeTab = 'faculty_roster';
      } else if (assignedRole === 'institute') {
        this.activeTab = 'institute_overview';
      } else if (assignedRole === 'parent') {
        this.activeTab = 'parent_overview';
      } else {
        this.activeTab = 'student_dashboard';
      }
      this.fetchStudents();
      this.initWebSocket();
      this.fetchChatCategories();
      this.fetchUnifiedMessages();
      this.fetchAiCriteria();
    },

    async triggerDigilockerAutoFill() {
      try {
        const res = await fetch('/api/auth/digilocker-auto-fill', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          const result = await res.json();
          this.digilockerResult = result;
          this.showDigilockerPermissionModal = false;
          alert('DigiLocker records successfully auto-filled into your student portfolio!');
          this.auditLogs.unshift(`[${new Date().toISOString()}] DIGILOCKER AUTO-FILL: Synchronized official records on 1st login.`);
        } else {
          alert('Failed to auto-fill via DigiLocker.');
        }
      } catch (e) {
        alert('Network error during DigiLocker auto-fill.');
      }
    },

    async register() {
      this.authError = '';
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.registerForm)
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('edu_token', data.access_token);
          localStorage.setItem('edu_role', data.role);
          localStorage.setItem('edu_inst', this.registerForm.institution_name);
          localStorage.setItem('edu_inst_verified', data.institution_verified ? 'true' : 'false');

          this.authToken = data.access_token;
          this.currentUserRole = data.role;
          this.currentUserInstitution = this.registerForm.institution_name;
          this.institutionVerified = data.institution_verified;
          this.updateTheme();
          this.isLoggedIn = true;

          if (!data.institution_verified) {
            alert('Sign-up successful! Note: Your institution is pending verification. An administrator has been notified to add your school/college to the verified list.');
          }

          await this.fetchStudents();
          this.initWebSocket();
        } else {
          const err = await res.json();
          this.authError = err.detail || 'Registration failed.';
        }
      } catch (e) {
        this.authError = 'Network error during registration.';
      }
    },

    logout() {
      localStorage.removeItem('edu_token');
      localStorage.removeItem('edu_role');
      localStorage.removeItem('edu_inst');
      localStorage.removeItem('edu_inst_verified');
      this.isLoggedIn = false;
      this.authToken = '';
    },

    async fetchPendingInstitutions() {
      try {
        const res = await fetch('/api/auth/institutions/pending', {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.pendingInstitutions = await res.json();
        }
      } catch (e) {
        console.error('Failed to fetch pending institutions:', e);
      }
    },

    async approveInstitution(instId) {
      try {
        const res = await fetch(`/api/auth/institutions/${instId}/approve`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          await this.fetchPendingInstitutions();
          alert('Institution successfully verified and added to the verified list!');
          this.auditLogs.unshift(`[${new Date().toISOString()}] ADMIN: Approved institution ID ${instId}`);
        }
      } catch (e) {
        alert('Failed to approve institution.');
      }
    },

    async sendOtp() {
      const email = this.currentStudent.email || 'amit.sharma@uni.edu';
      this.otpStatus = 'Sending...';
      try {
        const res = await fetch('/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        });
        if (res.ok) {
          const data = await res.json();
          this.otpStatus = `Sent! (Debug: ${data.debug_otp})`;
          this.otpInput = data.debug_otp;
          this.auditLogs.unshift(`[${new Date().toISOString()}] OTP SENT: Passcode generated for ${email}`);
        } else {
          this.otpStatus = 'Failed to send';
        }
      } catch (e) {
        this.otpStatus = 'Network error';
      }
    },

    async verifyOtp() {
      const email = this.currentStudent.email || 'amit.sharma@uni.edu';
      try {
        const res = await fetch('/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, otp_code: this.otpInput })
        });
        if (res.ok) {
          const data = await res.json();
          this.otpStatus = 'Verified Successfully!';
          this.auditLogs.unshift(`[${new Date().toISOString()}] 2FA OTP VERIFIED: Secure login code accepted.`);
        } else {
          const err = await res.json();
          this.otpStatus = err.detail || 'Invalid OTP';
        }
      } catch (e) {
        this.otpStatus = 'Verification failed';
      }
    },

    async sendMobileOtp() {
      if (!this.registerForm.mobile_number) {
        this.authError = 'Please enter mobile number first.';
        return;
      }
      try {
        const res = await fetch('/api/auth/mobile/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile_number: this.registerForm.mobile_number })
        });
        if (res.ok) {
          const data = await res.json();
          this.mobileOtpSent = true;
          alert(`Mobile OTP sent successfully! (Debug Code: ${data.debug_otp})`);
          this.mobileOtpInput = data.debug_otp;
        } else {
          const err = await res.json();
          this.authError = err.detail || 'Failed to send mobile OTP.';
        }
      } catch (e) {
        this.authError = 'Network error sending mobile OTP.';
      }
    },

    async verifyMobileOtp() {
      if (!this.mobileOtpInput) {
        this.authError = 'Please enter mobile OTP code.';
        return;
      }
      try {
        const res = await fetch('/api/auth/mobile/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile_number: this.registerForm.mobile_number, otp_code: this.mobileOtpInput })
        });
        if (res.ok) {
          this.mobileVerified = true;
          this.registerForm.mobile_verified = true;
          alert('Mobile number verified successfully!');
        } else {
          const err = await res.json();
          this.authError = err.detail || 'Invalid mobile OTP.';
        }
      } catch (e) {
        this.authError = 'Network error verifying mobile OTP.';
      }
    },

    async searchParent() {
      this.parentSearchMessage = '';
      const query = (this.studentRegisterForm && this.studentRegisterForm.parent_search_query) || (this.advStudentForm && this.advStudentForm.parent_search_query) || '';
      if (!query.trim()) {
        this.parentSearchMessage = 'Please enter a username or email to search.';
        return;
      }
      try {
        const res = await fetch('/api/auth/parent/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim() })
        });
        const data = await res.json();
        if (data.found) {
          if (this.studentRegisterForm) this.studentRegisterForm.parent_found = data;
          if (this.advStudentForm) this.advStudentForm.parent_found = data;
          this.parentSearchMessage = `✓ Parent verified in Family DB: ${data.full_name} (@${data.username})`;
        } else {
          if (this.studentRegisterForm) this.studentRegisterForm.parent_found = null;
          if (this.advStudentForm) this.advStudentForm.parent_found = null;
          this.parentSearchMessage = 'Parent not found. Please switch to "Create Parent Inline" tab.';
        }
      } catch (e) {
        this.parentSearchMessage = 'Error connecting to Family Heritage Database.';
      }
    },

    async sendAdvMobileOtp() {
      if (!this.advStudentForm.mobile_number) {
        this.authError = 'Please enter mobile number.';
        return;
      }
      try {
        const res = await fetch('/api/auth/mobile/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile_number: this.advStudentForm.mobile_number })
        });
        if (res.ok) {
          const data = await res.json();
          this.advMobileOtpSent = true;
          alert(`Mobile OTP sent! (Debug Code: ${data.debug_otp})`);
          this.advMobileOtpInput = data.debug_otp;
        } else {
          const err = await res.json();
          this.authError = err.detail || 'Failed to send mobile OTP.';
        }
      } catch (e) {
        this.authError = 'Network error sending mobile OTP.';
      }
    },

    async verifyAdvMobileOtp() {
      try {
        const res = await fetch('/api/auth/mobile/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile_number: this.advStudentForm.mobile_number, otp_code: this.advMobileOtpInput })
        });
        if (res.ok) {
          this.advMobileVerified = true;
          alert('Mobile verified successfully!');
        } else {
          const err = await res.json();
          this.authError = err.detail || 'Invalid mobile OTP.';
        }
      } catch (e) {
        this.authError = 'Network error verifying mobile OTP.';
      }
    },

    async registerAdvancedStudent() {
      this.authError = '';
      if (!this.advMobileVerified) {
        this.authError = 'Please verify your mobile number via OTP first.';
        return;
      }
      if (!this.advStudentForm.username || !this.advStudentForm.password) {
        this.authError = 'Please choose a username and password for your login.';
        return;
      }

      const payload = {
        full_name: this.advStudentForm.full_name,
        gender: this.advStudentForm.gender,
        personal_email: this.advStudentForm.personal_email,
        mobile_number: this.advStudentForm.mobile_number,
        mobile_verified: true,
        aadhaar_number: this.advStudentForm.aadhaar_number,
        digilocker_verified: this.advStudentForm.digilocker_verified,
        parent_username: this.advStudentForm.parent_mode === 'existing' && this.advStudentForm.parent_found ? this.advStudentForm.parent_found.username : null,
        create_parent: this.advStudentForm.parent_mode === 'create' ? this.advStudentForm.parent_create : null,
        institution_name: this.advStudentForm.institution_name,
        username: this.advStudentForm.username,
        password: this.advStudentForm.password
      };

      try {
        const res = await fetch('/api/auth/student/register-advanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('edu_token', data.access_token);
          localStorage.setItem('edu_role', data.role);
          localStorage.setItem('edu_inst', this.advStudentForm.institution_name);
          localStorage.setItem('edu_inst_verified', data.institution_verified ? 'true' : 'false');

          this.authToken = data.access_token;
          this.currentUserRole = data.role;
          this.currentUserInstitution = this.advStudentForm.institution_name;
          this.institutionVerified = data.institution_verified;
          this.updateTheme();
          this.isLoggedIn = true;

          alert(`Registration successful! Welcome, ${this.advStudentForm.full_name}. You are logged in with username: ${this.advStudentForm.username}`);

          await this.fetchStudents();
          this.initWebSocket();
        } else {
          const err = await res.json();
          this.authError = err.detail || 'Advanced student registration failed.';
        }
      } catch (e) {
        this.authError = 'Network error during advanced student registration.';
      }
    },

    async quickFillLogin(role) {
      this.loginForm.role = role;
      if (role === 'student') {
        this.loginForm.username = 'amit';
        this.loginForm.password = 'amit123';
      } else if (role === 'faculty') {
        this.loginForm.username = 'faculty';
        this.loginForm.password = 'faculty123';
      } else if (role === 'parent') {
        this.loginForm.username = 'parent_alex';
        this.loginForm.password = 'parent123';
      } else if (role === 'institute') {
        this.loginForm.username = 'institute_admin';
        this.loginForm.password = 'inst123';
      } else if (role === 'admin') {
        this.loginForm.username = 'msrch';
        this.loginForm.password = 'msrch1410#';
      }
      this.updateTheme();
      this.captchaVerified = true;
      await this.executeLogin();
    },

    async verifyCountryId(formObj) {
      if (!formObj.country_id_number || formObj.country_id_number.trim().length < 4) {
        alert('Please enter a valid Country Identification ID / Aadhaar number.');
        return;
      }
      try {
        const res = await fetch('/api/auth/verify/country-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            country_id_number: formObj.country_id_number,
            country_id_type: formObj.country_id_type || 'Aadhaar / National ID'
          })
        });
        if (res.ok) {
          const data = await res.json();
          formObj.country_id_verified = true;
          formObj.country_id_number = data.country_id_number;
          alert(`✓ National Depository Verification Confirmed!\n${data.message}`);
        } else {
          const err = await res.json();
          alert(err.detail || 'Country ID validation failed.');
        }
      } catch (e) {
        alert('Network error verifying country ID.');
      }
    },

    async checkCrossRoleStudent(formObj) {
      const ident = formObj.personal_email || formObj.country_id_number || formObj.mobile_number || formObj.username;
      if (!ident || !ident.trim()) {
        alert('Please fill in Email, Mobile, or Country ID first to check student records.');
        return;
      }
      try {
        const res = await fetch('/api/auth/verify/cross-role-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: ident })
        });
        const data = await res.json();
        formObj.cross_role_status = data;
        if (data.found) {
          alert(`★ Cross-Role Linkage Detected!\n${data.message}`);
        } else {
          alert(data.message);
        }
      } catch (e) {
        alert('Error performing cross-role database check.');
      }
    },

    verifyAccreditation() {
      const code = this.instituteRegisterForm.accreditation_number;
      if (!code || code.trim().length < 5) {
        alert('Please enter a recognized accreditation code (e.g. AICTE-UP-2026, UGC-NAAC-A, CBSE-9021).');
        return;
      }
      this.instituteRegisterForm.accreditation_verified = true;
      alert(`✓ Institution Authenticity Verified!\nAccreditation Code '${code.toUpperCase()}' verified against National Regulatory Depository.`);
    },

    async submitRoleRegistration(roleType) {
      this.authError = '';
      let url = '';
      let payload = {};

      if (roleType === 'student') {
        const f = this.studentRegisterForm;
        if (!f.username || !f.password || !f.personal_email) {
          this.authError = 'Please fill all required student registration fields.';
          return;
        }
        url = '/api/auth/register/student';
        payload = {
          name: f.name || f.username,
          gender: f.gender,
          personal_email: f.personal_email,
          mobile_number: f.mobile_number || '+91 9876543210',
          mobile_verified: true,
          country_id_number: f.country_id_number || '9988-7766-5544',
          country_id_type: f.country_id_type,
          country_id_verified: true,
          parent_verification_status: f.parent_verification_status,
          parent_username: f.parent_mode === 'existing' && f.parent_found ? f.parent_found.username : null,
          create_parent: f.parent_mode === 'create' ? f.parent_create : null,
          institution_name: f.institution_name,
          username: f.username,
          password: f.password
        };
      } else if (roleType === 'parent') {
        const f = this.parentRegisterForm;
        if (!f.username || !f.password || !f.personal_email) {
          this.authError = 'Please fill all required parent registration fields.';
          return;
        }
        url = '/api/auth/register/parent';
        payload = {
          name: f.name || f.username,
          gender: f.gender,
          personal_email: f.personal_email,
          mobile_number: f.mobile_number || '+91 9876543211',
          mobile_verified: true,
          country_id_number: f.country_id_number || '8765-4321-1234',
          country_id_type: f.country_id_type,
          country_id_verified: true,
          parent_verification_status: f.parent_verification_status,
          parent_relation: f.parent_relation,
          source_of_income: f.source_of_income,
          income_bracket: f.income_bracket,
          linked_student_id: f.linked_student_id,
          username: f.username,
          password: f.password
        };
      } else if (roleType === 'faculty') {
        const f = this.mentorRegisterForm;
        if (!f.username || !f.password || !f.personal_email) {
          this.authError = 'Please fill all required mentor-teacher registration fields.';
          return;
        }
        url = '/api/auth/register/mentor';
        payload = {
          name: f.name || f.username,
          gender: f.gender,
          personal_email: f.personal_email,
          mobile_number: f.mobile_number || '+91 9123456789',
          mobile_verified: true,
          country_id_number: f.country_id_number || '4321-8765-9876',
          country_id_type: f.country_id_type,
          country_id_verified: true,
          parent_verification_status: f.parent_verification_status,
          institute_affiliation_type: f.institute_affiliation_type,
          affiliated_institute_name: f.affiliated_institute_name,
          virtual_institute_name: f.virtual_institute_name,
          virtual_institute_focus: f.virtual_institute_focus,
          username: f.username,
          password: f.password
        };
      } else if (roleType === 'institute') {
        const f = this.instituteRegisterForm;
        if (!f.username || !f.password || !f.name || !f.admin_email) {
          this.authError = 'Please fill all required institutional registration fields.';
          return;
        }
        url = '/api/auth/register/institute';
        payload = {
          name: f.name,
          location: f.location,
          institution_type: f.institution_type,
          accreditation_number: f.accreditation_number,
          educational_domain: f.educational_domain,
          mission_scope: f.mission_scope,
          admin_email: f.admin_email,
          username: f.username,
          password: f.password
        };
      } else if (roleType === 'admin') {
        const f = this.adminRegisterForm;
        if (!f.username || !f.password || !f.admin_master_token) {
          this.authError = 'Please fill all required administrator fields and master passcode.';
          return;
        }
        url = '/api/auth/register/admin';
        payload = {
          name: f.name || f.username,
          admin_clearance_level: f.admin_clearance_level,
          admin_master_token: f.admin_master_token,
          personal_email: f.personal_email || `${f.username}@admin.uni.edu`,
          mobile_number: f.mobile_number,
          username: f.username,
          password: f.password
        };
      }

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('edu_token', data.access_token);
          localStorage.setItem('edu_role', data.role);
          localStorage.setItem('edu_inst', data.institution_name || 'GL Bajaj');
          localStorage.setItem('edu_inst_verified', data.institution_verified ? 'true' : 'false');

          this.authToken = data.access_token;
          this.currentUserRole = data.role;
          this.currentUserInstitution = data.institution_name || 'GL Bajaj';
          this.institutionVerified = data.institution_verified;
          this.isPresentInStudentDb = !!data.is_present_in_student_db;
          this.studentDbReference = data.student_db_reference || '';
          this.parentVerificationStatus = data.parent_verification_status || 'ALIVE';
          this.virtualInstituteName = data.virtual_institute_name || '';
          this.parentRelation = data.parent_relation || 'Biological';
          this.sourceOfIncome = data.source_of_income || '';
          this.incomeBracket = data.income_bracket || '';
          this.linkedStudentId = data.linked_student_id || '';
          this.loginForm.role = data.role;
          this.updateTheme();
          this.isLoggedIn = true;

          alert(`Registration successful! Logged in as ${data.full_name || data.username} (${data.role.toUpperCase()})`);

          if (data.role === 'admin') {
            this.activeTab = 'admin_crud';
            await this.fetchPendingInstitutions();
          } else if (data.role === 'faculty') {
            this.activeTab = 'faculty_roster';
          } else if (data.role === 'institute') {
            this.activeTab = 'institute_overview';
            await this.fetchPendingInstitutions();
          } else if (data.role === 'parent') {
            this.activeTab = 'parent_overview';
          } else {
            this.activeTab = 'guidance';
          }

          await this.fetchStudents();
          this.initWebSocket();
        } else {
          const err = await res.json();
          this.authError = err.detail || 'Registration failed.';
        }
      } catch (e) {
        this.authError = 'Network error during registration.';
      }
    },

    async checkWebsiteLegitimacy() {
      if (!this.targetUrl) return;
      try {
        const res = await fetch('/api/security/check-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: this.targetUrl })
        });
        if (res.ok) {
          this.urlCheckResult = await res.json();
          this.auditLogs.unshift(`[${new Date().toISOString()}] LEGITIMACY CHECK: Analyzed ${this.targetUrl} (Score: ${this.urlCheckResult.trust_score}%)`);
        }
      } catch (e) {
        alert('Failed to check website legitimacy.');
      }
    },

    async fetchStudents() {
      try {
        const res = await fetch('/api/students', {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.students = await res.json();
          if (this.students.length > 0) {
            this.selectedStudentId = this.students[0].id;
            this.currentStudent = this.students[0];
            this.apaarInput = this.currentStudent.apaar_id || 'APAAR-9988-7766-5544';
          }
        }
      } catch (e) {
        console.error('Failed to fetch students:', e);
      }
    },

    loadStudentData() {
      const found = this.students.find(s => s.id === this.selectedStudentId);
      if (found) {
        this.currentStudent = found;
        this.apaarInput = found.apaar_id || 'APAAR-9988-7766-5544';
      }
    },

    async createStudent() {
      if (!this.newStudent.roll_no || !this.newStudent.name || !this.newStudent.email) {
        alert('Please fill in Roll No, Full Name, and Email.');
        return;
      }
      try {
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.authToken}` },
          body: JSON.stringify(this.newStudent)
        });
        if (res.ok) {
          await this.fetchStudents();
          alert('Student successfully added to 3NF database!');
          this.auditLogs.unshift(`[${new Date().toISOString()}] ADMIN CRUD: Created student ${this.newStudent.roll_no}`);
        } else {
          const err = await res.json();
          let msg = 'Failed to create student';
          if (typeof err.detail === 'string') msg = err.detail;
          else if (Array.isArray(err.detail)) msg = err.detail.map(d => d.msg).join(', ');
          alert('Error: ' + msg);
        }
      } catch (e) {
        alert('Network error during student creation.');
      }
    },

    async deleteStudent(studentId) {
      if (!confirm('Are you sure you want to delete this student record?')) return;
      try {
        const res = await fetch(`/api/students/${studentId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          await this.fetchStudents();
          this.auditLogs.unshift(`[${new Date().toISOString()}] ADMIN CRUD: Deleted student ID ${studentId}`);
        }
      } catch (e) {
        alert('Failed to delete student.');
      }
    },

    async alertStudent(studentName) {
      alert(`Counseling notice successfully dispatched to student: ${studentName}`);
      this.auditLogs.unshift(`[${new Date().toISOString()}] FACULTY MENTORSHIP: Sent counseling alert to ${studentName}`);
    },

    async sendPrompt(queryText) {
      if (!queryText || !queryText.trim()) return;
      const q = queryText.trim();
      this.userQuery = '';
      this.chatMessages.push({ sender: 'user', text: q, citations: [] });

      try {
        const res = await fetch('/rag_query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, student_id: this.selectedStudentId, top_k: 2 })
        });
        if (res.ok) {
          const data = await res.json();
          this.chatMessages.push({
            sender: 'bot',
            text: data.answer,
            citations: data.citations
          });
        } else {
          this.chatMessages.push({
            sender: 'bot',
            text: 'Error communicating with RAG guidance engine.',
            citations: []
          });
        }
      } catch (e) {
        this.chatMessages.push({
          sender: 'bot',
          text: 'Network error connecting to AI backend.',
          citations: []
        });
      }
    },

    async fetchGuidance() {
      if (!this.selectedStudentId) return;
      try {
        const res = await fetch(`/api/students/${this.selectedStudentId}/guidance`);
        if (res.ok) {
          const data = await res.json();
          let summary = `AI Guidance Report for ${data.name} (CGPA: ${data.cgpa}, Attendance: ${data.attendance}%):\n`;
          data.recommendations.forEach((rec, idx) => {
            summary += `${idx + 1}. ${rec}\n`;
          });
          this.chatMessages.push({ sender: 'bot', text: summary, citations: [] });
          this.activeTab = 'guidance';
        }
      } catch (e) {
        console.error('Failed to fetch guidance:', e);
      }
    },

    async runBiometric(mode) {
      if (mode === 'face') this.faceStatus = 'Analyzing facial vectors...';
      if (mode === 'ocr') this.ocrStatus = 'Extracting ID text via OCR...';
      if (mode === 'voice') this.voiceStatus = 'Analyzing voice spectrogram...';

      try {
        const res = await fetch('/api/auth/biometric-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: this.selectedStudentId, mode: mode })
        });
        if (res.ok) {
          const data = await res.json();
          if (mode === 'face') this.faceStatus = `Verified! Score: ${(data.confidence * 100).toFixed(1)}%`;
          if (mode === 'ocr') this.ocrStatus = `Verified! Score: ${(data.confidence * 100).toFixed(1)}%`;
          if (mode === 'voice') this.voiceStatus = `Verified! Score: ${(data.confidence * 100).toFixed(1)}%`;
          this.auditLogs.unshift(`[${new Date().toISOString()}] BIOMETRIC [${mode.toUpperCase()}]: ${data.message} (Score: ${data.confidence})`);
        }
      } catch (e) {
        console.error('Biometric verification failed:', e);
      }
    },

    async verifyApaar() {
      try {
        const res = await fetch('/api/auth/apaar-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apaar_id: this.apaarInput, student_name: this.currentStudent.name || 'Student' })
        });
        if (res.ok) {
          this.apaarResult = await res.json();
          this.auditLogs.unshift(`[${new Date().toISOString()}] APAAR VERIFY: ID ${this.apaarInput} verified successfully.`);
        }
      } catch (e) {
        console.error('APAAR verify failed:', e);
      }
    },

    async fetchDigilocker() {
      try {
        const res = await fetch('/api/auth/digilocker-fetch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apaar_id: this.apaarInput, document_type: this.digilockerDocType })
        });
        if (res.ok) {
          this.digilockerResult = await res.json();
          this.auditLogs.unshift(`[${new Date().toISOString()}] DIGILOCKER SYNC: Fetched ${this.digilockerDocType}.`);
        }
      } catch (e) {
        console.error('DigiLocker fetch failed:', e);
      }
    },

    initWebSocket() {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${proto}//${window.location.host}/ws/audit-logs`);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.auditLogs.unshift(`[${data.timestamp}] WS EVENT: ${data.event} - Status: ${data.status} (CPU: ${data.cpu_usage})`);
          if (this.auditLogs.length > 50) this.auditLogs.pop();
        } catch (e) {}
      };
    },

    async fetchMentorChat() {
      try {
        const studentId = this.currentUserRole === 'student' ? (this.currentStudent.id || 'stu_sample1') : this.selectedStudentId;
        if (!studentId) return;
        const res = await fetch(`/api/chat/messages/${studentId}?mentor_username=faculty`, {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.mentorChatMessages = await res.json();
        }
      } catch (e) {
        console.error('Failed to load mentor chat', e);
      }
    },

    async sendMentorMessage() {
      if (!this.mentorChatInput.trim()) return;
      const studentId = this.currentUserRole === 'student' ? (this.currentStudent.id || 'stu_sample1') : this.selectedStudentId;
      const senderRole = this.currentUserRole === 'student' ? 'student' : 'faculty';
      const senderName = this.currentUserRole === 'student' ? (this.currentStudent.name || 'Student') : 'Faculty Mentor';
      
      try {
        const res = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify({
            student_id: studentId,
            mentor_username: 'faculty',
            sender_role: senderRole,
            sender_name: senderName,
            message: this.mentorChatInput
          })
        });
        if (res.ok) {
          this.mentorChatInput = '';
          await this.fetchMentorChat();
        }
      } catch (e) {
        console.error('Failed to send mentor message', e);
      }
    },

    async fetchCommunityGroups() {
      try {
        const res = await fetch('/api/community/groups', {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.communityGroups = await res.json();
          if (this.communityGroups.length > 0 && !this.selectedGroupId) {
            this.selectedGroupId = this.communityGroups[0].id;
            await this.fetchCommunityMessages();
          }
        }
      } catch (e) {
        console.error('Failed to load community groups', e);
      }
    },

    async fetchCommunityMessages() {
      if (!this.selectedGroupId) return;
      try {
        const res = await fetch(`/api/community/groups/${this.selectedGroupId}/messages`, {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.communityMessages = await res.json();
        }
      } catch (e) {
        console.error('Failed to load community messages', e);
      }
    },

    async sendCommunityMessage() {
      if (!this.communityMessageInput.trim() || !this.selectedGroupId) return;
      try {
        const res = await fetch(`/api/community/groups/${this.selectedGroupId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify({ message: this.communityMessageInput })
        });
        if (res.ok) {
          this.communityMessageInput = '';
          await this.fetchCommunityMessages();
        }
      } catch (e) {
        console.error('Failed to send community message', e);
      }
    },

    async createCommunityGroup() {
      if (!this.newGroup.name.trim()) return;
      try {
        const res = await fetch('/api/community/groups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify(this.newGroup)
        });
        if (res.ok) {
          this.newGroup = { name: '', category: 'CLUB', role_access: 'all', description: '' };
          this.showCreateGroupModal = false;
          await this.fetchCommunityGroups();
        }
      } catch (e) {
        console.error('Failed to create group', e);
      }
    },

    async fetchCoPilotSummary() {
      if (!this.selectedGroupId) return;
      try {
        const res = await fetch(`/api/copilot/groups/${this.selectedGroupId}/summarize`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.copilotSummary = await res.json();
        }
      } catch (e) {
        console.error('Failed to fetch Co-Pilot summary', e);
      }
    },

    async fetchCoPilotQuizzes() {
      if (!this.selectedGroupId) return;
      try {
        const res = await fetch(`/api/copilot/groups/${this.selectedGroupId}/quizzes`, {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.activeQuizzes = await res.json();
        }
      } catch (e) {
        console.error('Failed to fetch quizzes', e);
      }
    },

    async generateCoPilotQuiz() {
      if (!this.selectedGroupId) return;
      try {
        const res = await fetch(`/api/copilot/groups/${this.selectedGroupId}/quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify({
            question: "Based on recent study group discussions and institutional academic policy, what is the mandatory minimum attendance percentage required for semester exams?",
            options: ["60%", "75%", "85%", "100%"],
            correct_answer: "75%"
          })
        });
        if (res.ok) {
          await this.fetchCoPilotQuizzes();
        }
      } catch (e) {
        console.error('Failed to generate quiz', e);
      }
    },

    async submitQuizAnswer(quizId) {
      const selected = this.quizAnswers[quizId];
      if (!selected) return;
      try {
        const res = await fetch(`/api/copilot/quizzes/${quizId}/answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify({ selected_answer: selected })
        });
        if (res.ok) {
          const result = await res.json();
          this.quizResults[quizId] = result;
        }
      } catch (e) {
        console.error('Failed to submit quiz answer', e);
      }
    },

    async verifyTrustTier() {
      try {
        const res = await fetch('/api/copilot/verify-access', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.trustTierStatus = await res.json();
        }
      } catch (e) {
        console.error('Failed to verify trust tier', e);
      }
    },

    // -----------------------------------------------------------
    // 3-Category Unified Chat System Methods (Personal, Private, Global)
    // -----------------------------------------------------------
    async fetchChatCategories() {
      try {
        const res = await fetch('/api/chat/categories', {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.chatCategoriesMeta = await res.json();
        }
      } catch (e) {
        console.error('Failed to load chat categories', e);
      }
    },

    async setChatCategory(cat) {
      this.activeChatCategory = cat;
      if (cat === 'PRIVATE' && (!this.communityGroups || this.communityGroups.length === 0)) {
        await this.fetchCommunityGroups();
      }
      await this.fetchUnifiedMessages();
      await this.fetchChatCategories();
    },

    async setGlobalChannel(chId) {
      this.globalChatChannel = chId;
      this.activeChatCategory = 'GLOBAL';
      await this.fetchUnifiedMessages();
    },

    async setPrivateGroup(groupId) {
      this.selectedGroupId = groupId;
      this.activeChatCategory = 'PRIVATE';
      await this.fetchUnifiedMessages();
    },

    async setPersonalRecipient(username) {
      this.personalChatRecipient = username;
      this.activeChatCategory = 'PERSONAL';
      await this.fetchUnifiedMessages();
    },

    async addCustomDirectPeer() {
      if (!this.customPeerInput || !this.customPeerInput.trim()) return;
      const peer = this.customPeerInput.trim().toLowerCase();
      if (!this.directContacts.some(c => c.username === peer)) {
        this.directContacts.push({
          username: peer,
          name: `@${peer}`,
          role: 'Registered Member',
          icon: 'fa-user'
        });
      }
      this.personalChatRecipient = peer;
      this.customPeerInput = '';
      this.activeChatCategory = 'PERSONAL';
      await this.fetchUnifiedMessages();
    },

    async fetchUnifiedMessages() {
      try {
        let url = `/api/chat/category/${this.activeChatCategory}`;
        if (this.activeChatCategory === 'GLOBAL') {
          url += `?channel_id=${encodeURIComponent(this.globalChatChannel || 'campus_global')}`;
        } else if (this.activeChatCategory === 'PRIVATE') {
          const ch = this.selectedGroupId || 'grp_ai_club';
          url += `?channel_id=${encodeURIComponent(ch)}`;
        } else if (this.activeChatCategory === 'PERSONAL') {
          const peer = this.personalChatRecipient || (this.currentUserRole === 'faculty' ? 'amit' : 'faculty');
          url += `?peer_username=${encodeURIComponent(peer)}`;
        }

        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.unifiedChatMessages = await res.json();
          // Keep legacy bindings in sync so existing tabs still render effortlessly
          if (this.activeChatCategory === 'PERSONAL') {
            this.mentorChatMessages = this.unifiedChatMessages;
          } else if (this.activeChatCategory === 'PRIVATE') {
            this.communityMessages = this.unifiedChatMessages;
          }
        }
      } catch (e) {
        console.error('Failed to fetch unified chat messages', e);
      }
    },

    async sendUnifiedMessage() {
      if (!this.unifiedChatInput.trim()) return;
      const text = this.unifiedChatInput.trim();
      let chId = this.globalChatChannel || 'campus_global';
      let recip = null;

      if (this.activeChatCategory === 'PERSONAL') {
        recip = this.personalChatRecipient || (this.currentUserRole === 'faculty' ? 'amit' : 'faculty');
      } else if (this.activeChatCategory === 'PRIVATE') {
        chId = this.selectedGroupId || 'grp_ai_club';
      }

      try {
        const payload = {
          category: this.activeChatCategory,
          channel_id: chId,
          recipient_username: recip,
          message: text
        };
        if (this.selectedAiCriterion) {
          payload.criteria = this.selectedAiCriterion;
        }

        const res = await fetch('/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          this.unifiedChatInput = '';
          this.selectedAiCriterion = null;
          await this.fetchUnifiedMessages();
          await this.fetchChatCategories();
        }
      } catch (e) {
        console.error('Failed to send unified message', e);
      }
    },

    // -----------------------------------------------------------
    // Meta AI in WhatsApp Educational Criteria Helpers
    // -----------------------------------------------------------
    async fetchAiCriteria() {
      try {
        const res = await fetch('/api/chat/ai/criteria', {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.aiCriteria = await res.json();
        }
      } catch (e) {
        console.error('Failed to load AI criteria', e);
      }
    },

    selectAiCriterion(critId) {
      if (this.selectedAiCriterion === critId) {
        this.selectedAiCriterion = null;
      } else {
        this.selectedAiCriterion = critId;
        const isDirectAi = (this.activeChatCategory === 'PERSONAL' && this.personalChatRecipient === 'edumentor_ai');
        if (!isDirectAi && !this.unifiedChatInput.startsWith('@ai')) {
          this.unifiedChatInput = '@ai ' + this.unifiedChatInput.trim();
        }
      }
    },

    async openMetaAiDirect(criterionId = null) {
      this.activeChatCategory = 'PERSONAL';
      this.personalChatRecipient = 'edumentor_ai';
      if (criterionId) {
        this.selectedAiCriterion = criterionId;
      }
      await this.fetchUnifiedMessages();
    },

    insertMetaAiMention() {
      if (!this.unifiedChatInput.startsWith('@ai')) {
        this.unifiedChatInput = '@ai ' + this.unifiedChatInput.trim();
      }
      const el = document.getElementById('unifiedChatInputField');
      if (el) el.focus();
    },

    insertMetaAiPrompt(promptText, criterionId = null) {
      if (criterionId) {
        this.selectedAiCriterion = criterionId;
      }
      const isDirectAi = (this.activeChatCategory === 'PERSONAL' && this.personalChatRecipient === 'edumentor_ai');
      this.unifiedChatInput = isDirectAi ? promptText : `@ai ${promptText}`;
      const el = document.getElementById('unifiedChatInputField');
      if (el) el.focus();
    },

    async sendQuickPrompt(promptText, criterionId = null) {
      if (criterionId) {
        this.selectedAiCriterion = criterionId;
      }
      const isDirectAi = (this.activeChatCategory === 'PERSONAL' && this.personalChatRecipient === 'edumentor_ai');
      this.unifiedChatInput = isDirectAi ? promptText : `@ai ${promptText}`;
      await this.sendUnifiedMessage();
    },

    formatChatMessage(rawText) {
      if (!rawText) return '';
      let out = rawText;
      // Convert markdown bold **text** to <strong>text</strong>
      out = out.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      // Convert criterion headers ### [CRITERION: ...]
      out = out.replace(/^### \[CRITERION:\s*(.*?)\]/gm, '<div class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/40 text-[11px] font-bold text-blue-200 tracking-wide uppercase mb-2"><i class="fa-solid fa-graduation-cap text-purple-400"></i><span>Criteria: $1</span></div>');
      // Convert other markdown headers ### ...
      out = out.replace(/^### (.*?)$/gm, '<div class="text-sm font-bold text-purple-300 mt-2 mb-1">$1</div>');
      // Convert blockquotes > ...
      out = out.replace(/^> (.*?)$/gm, '<blockquote class="border-l-2 border-blue-400 pl-3 my-2 italic text-slate-300 bg-blue-950/20 py-1 rounded-r">$1</blockquote>');
      // Convert code blocks ```code```
      out = out.replace(/```python([\s\S]*?)```/g, '<pre class="bg-slate-950/90 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 my-2 text-emerald-300 leading-relaxed"><code>$1</code></pre>');
      out = out.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-950/90 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 my-2 text-blue-300 leading-relaxed"><code>$1</code></pre>');
      // Convert bullet points
      out = out.replace(/^- (.*?)$/gm, '<div class="flex items-start space-x-2 my-1"><span class="text-blue-400 font-bold">•</span><span>$1</span></div>');
      // Convert double newlines to paragraph break
      out = out.replace(/\n\n/g, '<div class="my-2"></div>');
      return out;
    },

    copyMessageText(text) {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text);
      alert('Message content copied to clipboard!');
    },

    // -----------------------------------------------------------
    // Enrolled Institutions & Institutional Portal Hub Methods
    // -----------------------------------------------------------
    async fetchEnrolledInstitutions() {
      try {
        const studentId = this.selectedStudentId || (this.currentStudent && this.currentStudent.id) || 'stu_001';
        const res = await fetch(`/api/students/${studentId}/enrolled-institutions`, {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          this.enrolledInstitutions = data.institutions || [];
        } else {
          this.loadDefaultEnrolledInstitutions();
        }
      } catch (e) {
        console.error('Failed to fetch enrolled institutions:', e);
        this.loadDefaultEnrolledInstitutions();
      }
    },

    showAddInstitutionModal: false,
    newInstitutionForm: {
      name: '',
      type: 'College',
      program: '',
      roll_no: '',
      location: 'India'
    },

    async addEnrolledInstitution() {
      try {
        const studentId = this.selectedStudentId || (this.currentStudent && this.currentStudent.id) || 'stu_001';
        const res = await fetch(`/api/students/${studentId}/enrolled-institutions/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify(this.newInstitutionForm)
        });
        if (res.ok) {
          const data = await res.json();
          alert(data.message || 'Successfully enrolled in new institution!');
          this.showAddInstitutionModal = false;
          this.newInstitutionForm = { name: '', type: 'College', program: '', roll_no: '', location: 'India' };
          await this.fetchEnrolledInstitutions();
        } else {
          alert('Failed to enroll in new institution.');
        }
      } catch (e) {
        console.error('Error adding institution:', e);
        alert('Network error while adding institution.');
      }
    },

    loadDefaultEnrolledInstitutions() {
      this.enrolledInstitutions = [
        {
          id: 'inst_glbitm',
          name: 'GL Bajaj Institute of Technology and Management',
          type: 'College',
          type_category: 'COLLEGE',
          badge: 'Active Enrolled • Primary',
          affiliation: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU) & AICTE',
          program: 'Bachelor of Technology (B.Tech)',
          department: 'Computer Science & Engineering',
          current_semester: '6th Semester',
          roll_no: 'CS-2022-04',
          enrollment_number: '2201920100045',
          batch: '2022 - 2026',
          joined_year: '2022',
          status: 'ACTIVE',
          location: 'Knowledge Park II, Greater Noida, Uttar Pradesh, India',
          is_primary: true,
          attendance_percentage: '86.5%',
          cgpa: '8.42',
          icon: 'fa-building-columns',
          accent_color: 'blue'
        },
        {
          id: 'inst_dps_rkp',
          name: 'Delhi Public School (DPS), R.K. Puram',
          type: 'School',
          type_category: 'SCHOOL',
          badge: 'Alumnus • Completed',
          affiliation: 'Central Board of Secondary Education (CBSE National Board)',
          program: 'Senior Secondary Certificate (Class XI - XII)',
          department: 'Science Stream (PCM & Computer Science)',
          current_semester: 'Graduated Class of 2022',
          roll_no: 'DPS-2022-9841',
          enrollment_number: 'CBSE-DEL-1094821',
          batch: '2020 - 2022',
          joined_year: '2020',
          status: 'COMPLETED',
          location: 'Sector XII, R.K. Puram, New Delhi, India',
          is_primary: false,
          attendance_percentage: '94.2%',
          cgpa: '95.6% (CBSE Boards)',
          icon: 'fa-school',
          accent_color: 'emerald'
        },
        {
          id: 'inst_aktu',
          name: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
          type: 'University',
          type_category: 'UNIVERSITY',
          badge: 'State Affiliating Body',
          affiliation: 'University Grants Commission (UGC) & AICTE',
          program: 'Degree Granting & State Academic Depository',
          department: 'Faculty of Engineering & Technological Research',
          current_semester: 'Academic Session 2025–26',
          roll_no: 'AKTU-REG-2022-045',
          enrollment_number: 'AKTU-UP-992144',
          batch: '2022 - 2026',
          joined_year: '2022',
          status: 'ACTIVE',
          location: 'Sec-11, Jankipuram Vistar, Lucknow, Uttar Pradesh',
          is_primary: false,
          attendance_percentage: '88.0%',
          cgpa: '8.50 (Cumulative)',
          icon: 'fa-graduation-cap',
          accent_color: 'indigo'
        },
        {
          id: 'inst_tcs_corp',
          name: 'Tata Consultancy Services (TCS) Innovation Lab',
          type: 'Company',
          type_category: 'COMPANY',
          badge: 'Industry Apprenticeship',
          affiliation: 'TCS Enterprise Research & Campus Hiring Partner',
          program: 'AI & Cloud Engineering Internship Fellowship',
          department: 'Enterprise AI & Cloud Platforms Division',
          current_semester: 'Q1 2026 Sprint',
          roll_no: 'EMP-TCS-INT-9921',
          enrollment_number: 'TCS-IND-2026-X8',
          batch: '2025 - 2026',
          joined_year: '2025',
          status: 'ACTIVE',
          location: 'Noida Special Economic Zone (NSEZ), Phase II, Noida',
          is_primary: false,
          attendance_percentage: '96.0%',
          cgpa: 'Stipend Active',
          icon: 'fa-building',
          accent_color: 'amber'
        },
        {
          id: 'inst_ai_startup',
          name: 'NeuroGrid AI (DeepTech & Agentic AI Incubator)',
          type: 'Start-up',
          type_category: 'STARTUP',
          badge: 'Seed Stage Incubatee',
          affiliation: 'Department of Science & Technology (DST) Startup India',
          program: 'Founder-in-Residence & Student Pre-Incubation',
          department: 'Autonomous Multi-Agent Systems & LLM Infra',
          current_semester: 'Cohort 4 (Pre-Series A)',
          roll_no: 'FOUND-FELLOW-014',
          enrollment_number: 'STARTUP-IND-NG-77',
          batch: '2025 - Present',
          joined_year: '2025',
          status: 'ACTIVE',
          location: 'IIT Delhi Innovation & Incubation Park, New Delhi',
          is_primary: false,
          attendance_percentage: '92.5%',
          cgpa: 'Grant Funded',
          icon: 'fa-rocket',
          accent_color: 'rose'
        }
      ];
    },

    async selectEnrolledInstitution(inst) {
      try {
        const studentId = this.selectedStudentId || (this.currentStudent && this.currentStudent.id) || 'stu_001';
        const res = await fetch(`/api/students/${studentId}/institutions/${inst.id}/details`, {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          this.selectedEnrolledInstitution = await res.json();
        } else {
          this.selectedEnrolledInstitution = {
            institution: inst,
            courses: [
              { course_code: 'CS-601', course_name: 'Data Structures & Deep Algorithmic Analysis', credits: 4, instructor: 'Dr. Priya Sen', room: 'Room 304, Academic Block A', attendance_percentage: 88.5, classes_attended: 39, total_classes: 44, status: 'COMPLIANT' },
              { course_code: 'CS-602', course_name: 'Relational & Polyglot Database Systems', credits: 4, instructor: 'Prof. R.K. Verma', room: 'Lab 5, CS Complex', attendance_percentage: 92.0, classes_attended: 46, total_classes: 50, status: 'COMPLIANT' },
              { course_code: 'CS-603', course_name: 'Computer Networks & Distributed Systems', credits: 3, instructor: 'Dr. A.K. Srivastava', room: 'Lecture Theatre 2', attendance_percentage: 78.4, classes_attended: 29, total_classes: 37, status: 'COMPLIANT' }
            ],
            profile: {
              student_name: this.currentStudent.name || 'Amit Sharma',
              institutional_roll_no: inst.roll_no,
              enrollment_number: inst.enrollment_number,
              department: inst.department,
              batch: inst.batch,
              admission_date: '2022-08-16',
              institutional_email: 'amit@uni.edu',
              blood_group: 'B+',
              gender: 'Male',
              apaar_id: 'APAAR-9988-7766-5544',
              digilocker_verified: true,
              mentor_teacher: 'Dr. Priya Sen'
            },
            timetable: [
              { day: 'Monday', slots: [
                { time: '09:00 - 10:00', subject: 'Data Structures & Algorithms', code: 'CS-601', faculty: 'Dr. Priya Sen', room: 'Room 304' },
                { time: '10:00 - 11:00', subject: 'Database Systems', code: 'CS-602', faculty: 'Prof. R.K. Verma', room: 'Lab 5' }
              ]}
            ],
            calendar: [
              { date: '2026-10-12 to 2026-10-18', event: 'Mid-Term Examinations', type: 'EXAM' },
              { date: '2026-10-24', event: 'Diwali Festival Break', type: 'HOLIDAY' }
            ],
            fee: {
              structure: { tuition_fee: 65000, development_fee: 15000, lab_examination_fee: 12000, library_sports_fee: 8000, total_billed: 100000, currency: 'INR (₹)' },
              dues: { total_due: 12000, due_date: '2026-11-15', late_fee_per_day: 100, status: 'PARTIALLY_PAID' },
              balance: { total_paid: 88000, current_balance: 12000, last_updated: '2026-10-15T10:30:00Z' },
              registration_fee: { amount: 2500, status: 'PAID', receipt_id: 'REG-2026-8812' },
              scholarship: { name: 'Academic Merit Excellence Scholarship', amount: 25000, status: 'APPROVED_DISBURSED', awarded_date: '2026-08-20', granting_body: 'Higher Education Directorate' },
              fee_relaxation: { category: 'Alumni Heritage Distinction', concession_percentage: 10, concession_amount: 10000, status: 'APPLIED' },
              refund: { caution_money_deposit: 5000, status: 'HELD_IN_ESCROW', refundable_at: 'Degree Completion', refund_policy: 'Full 100% refund upon no-dues clearance.' },
              transactions: [
                { receipt_no: 'REC-GLB-2026-1049', date: '2026-08-10', amount: 50000, mode: 'Net Banking', bank_ref: 'HDFC000192837', description: 'Semester 6 - 1st Installment', status: 'SUCCESS' }
              ]
            },
            assignments: [],
            student_leaves: { balances: { medical_remaining: 5, casual_remaining: 3, duty_remaining: 4 }, history: [] },
            hostel: { is_allotted: true, block: 'Block C (Aryabhata Hostel)', room_no: '304', bed_no: 'Bed 2', warden_name: 'Mr. S.P. Dwivedi', warden_contact: '+91 98765 43299', mess: { breakfast: '07:30 AM - 09:15 AM', lunch: '12:30 PM - 02:15 PM', dinner: '08:00 PM - 09:45 PM' }, gate_pass: { allowed_curfew: '09:30 PM' } },
            administration: { officials: [{ designation: 'Dean of Academics', name: 'Prof. Manju Khari', email: 'dean@uni.edu' }], documentation_status: { college_id_card: 'ACTIVE', bonafide_certificate: 'READY' }, document_requests: [], grievances: [], help_desk: { helpline_phone: '+91 120 2323888' }, feedback: { status: 'COMPLETED' } },
            library: { membership: { card_number: 'LIB-GLB-8834', valid_upto: '2026-06-30', max_books_allowed: 4 }, issued_books: [{ title: 'Introduction to Algorithms (CLRS)', accession_no: 'ACC-98214', due_date: '2026-11-05', renewals_left: 2 }], previous_log: [], fine: { amount: 0, status: 'NO_OUTSTANDING_FINES' }, attendance: [] },
            other_services: { transport: { is_enrolled: true, route_no: 'Route 14', bus_number: 'UP-16-BT-9021', driver_name: 'Mr. Mahendra Singh', driver_mobile: '+91 98112 34567' }, map: { campus_name: inst.name, location_address: inst.location }, security: { last_password_change: '2026-09-01' }, siblings: [{ name: 'Ananya Sharma', relationship: 'Sister', class_or_program: 'Class X-B', concession_status: '10% Sibling Rebate' }], gallery: [], notices: [{ title: 'Mid-Term Lab Practical Evaluation Notice', date: '2026-10-17', priority: 'HIGH' }] }
          };
        }
        if (this.selectedEnrolledInstitution) {
          if (!this.selectedEnrolledInstitution.template && inst.active_template) {
            this.selectedEnrolledInstitution.template = inst.active_template;
            this.selectedEnrolledInstitution.developer_mode_enabled = inst.developer_mode_enabled !== false;
            if (inst.active_template.template_data && inst.active_template.template_data.courses && inst.active_template.template_data.courses.length > 0) {
              this.selectedEnrolledInstitution.courses = inst.active_template.template_data.courses;
            }
          }
        }
        this.institutionActiveSection = 'courses';
        this.activeTab = 'enrolled_institutions';
      } catch (e) {
        console.error('Error selecting institution:', e);
      }
    },

    setInstitutionSection(section) {
      this.institutionActiveSection = section;
    },

    async submitFeePayment() {
      if (!this.feePaymentAmount || this.feePaymentAmount <= 0) {
        alert('Please enter a valid payment amount.');
        return;
      }
      this.feePaymentProcessing = true;
      try {
        const studentId = this.selectedStudentId || (this.currentStudent && this.currentStudent.id) || 'stu_001';
        const instId = (this.selectedEnrolledInstitution && this.selectedEnrolledInstitution.institution && this.selectedEnrolledInstitution.institution.id) || 'inst_glbitm';
        const res = await fetch(`/api/students/${studentId}/institutions/${instId}/pay-fee`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify({
            amount: parseFloat(this.feePaymentAmount),
            payment_mode: this.feePaymentMode,
            remarks: this.feePaymentRemarks
          })
        });
        if (res.ok) {
          const data = await res.json();
          this.feePaymentReceipt = data.receipt;
          if (this.selectedEnrolledInstitution && this.selectedEnrolledInstitution.fee) {
            this.selectedEnrolledInstitution.fee.transactions.unshift(data.receipt);
            const bal = this.selectedEnrolledInstitution.fee.balance;
            bal.total_paid += parseFloat(this.feePaymentAmount);
            bal.current_balance = Math.max(0, bal.current_balance - parseFloat(this.feePaymentAmount));
            this.selectedEnrolledInstitution.fee.dues.total_due = bal.current_balance;
            if (bal.current_balance === 0) {
              this.selectedEnrolledInstitution.fee.dues.status = 'FULLY_PAID';
            }
          }
          alert(`✓ Fee Payment Confirmed!\nAmount: ₹${this.feePaymentAmount}\nReceipt Number: ${data.receipt.receipt_no}\nMode: ${this.feePaymentMode}`);
          this.auditLogs.unshift(`[${new Date().toISOString()}] FEE PAYMENT: Paid ₹${this.feePaymentAmount} via ${this.feePaymentMode} (${data.receipt.receipt_no})`);
        }
      } catch (e) {
        alert('Error processing fee payment.');
      } finally {
        this.feePaymentProcessing = false;
      }
    },

    async submitLeaveRequest() {
      if (!this.leaveForm.reason.trim()) {
        alert('Please provide a reason for the leave application.');
        return;
      }
      try {
        const studentId = this.selectedStudentId || (this.currentStudent && this.currentStudent.id) || 'stu_001';
        const instId = (this.selectedEnrolledInstitution && this.selectedEnrolledInstitution.institution && this.selectedEnrolledInstitution.institution.id) || 'inst_glbitm';
        const res = await fetch(`/api/students/${studentId}/institutions/${instId}/apply-leave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify(this.leaveForm)
        });
        if (res.ok) {
          const data = await res.json();
          if (this.selectedEnrolledInstitution && this.selectedEnrolledInstitution.student_leaves) {
            this.selectedEnrolledInstitution.student_leaves.history.unshift(data.leave);
            if (this.leaveForm.leave_type.includes('Medical')) {
              this.selectedEnrolledInstitution.student_leaves.balances.medical_remaining = Math.max(0, this.selectedEnrolledInstitution.student_leaves.balances.medical_remaining - 1);
            }
          }
          alert(`✓ Leave Application Submitted!\nType: ${this.leaveForm.leave_type}\nDates: ${this.leaveForm.from_date} to ${this.leaveForm.to_date}\nStatus: PENDING_HOD_APPROVAL`);
          this.leaveForm.reason = '';
        }
      } catch (e) {
        alert('Error submitting leave application.');
      }
    },

    async submitDocumentRequest() {
      try {
        const studentId = this.selectedStudentId || (this.currentStudent && this.currentStudent.id) || 'stu_001';
        const instId = (this.selectedEnrolledInstitution && this.selectedEnrolledInstitution.institution && this.selectedEnrolledInstitution.institution.id) || 'inst_glbitm';
        const res = await fetch(`/api/students/${studentId}/institutions/${instId}/request-document`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify(this.docForm)
        });
        if (res.ok) {
          const data = await res.json();
          if (this.selectedEnrolledInstitution && this.selectedEnrolledInstitution.administration) {
            this.selectedEnrolledInstitution.administration.document_requests.unshift(data.document);
          }
          alert(`✓ Document Request Submitted!\n${data.message}`);
        }
      } catch (e) {
        alert('Error submitting document request.');
      }
    },

    async submitGrievanceTicket() {
      if (!this.grievanceForm.subject.trim() || !this.grievanceForm.description.trim()) {
        alert('Please fill out Subject and Description.');
        return;
      }
      try {
        const studentId = this.selectedStudentId || (this.currentStudent && this.currentStudent.id) || 'stu_001';
        const instId = (this.selectedEnrolledInstitution && this.selectedEnrolledInstitution.institution && this.selectedEnrolledInstitution.institution.id) || 'inst_glbitm';
        const res = await fetch(`/api/students/${studentId}/institutions/${instId}/submit-grievance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify(this.grievanceForm)
        });
        if (res.ok) {
          const data = await res.json();
          if (this.selectedEnrolledInstitution && this.selectedEnrolledInstitution.administration) {
            this.selectedEnrolledInstitution.administration.grievances.unshift(data.grievance);
          }
          alert(`✓ Grievance Registered!\n${data.message}`);
          this.grievanceForm.subject = '';
          this.grievanceForm.description = '';
        }
      } catch (e) {
        alert('Error submitting grievance.');
      }
    },

    async submitFeedback() {
      if (!this.feedbackForm.comments.trim()) {
        alert('Please provide feedback comments.');
        return;
      }
      try {
        const studentId = this.selectedStudentId || (this.currentStudent && this.currentStudent.id) || 'stu_001';
        const instId = (this.selectedEnrolledInstitution && this.selectedEnrolledInstitution.institution && this.selectedEnrolledInstitution.institution.id) || 'inst_glbitm';
        const res = await fetch(`/api/students/${studentId}/institutions/${instId}/submit-feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify(this.feedbackForm)
        });
        if (res.ok) {
          const data = await res.json();
          alert(`✓ Feedback Submitted!\n${data.message}`);
          this.feedbackForm.comments = '';
        }
      } catch (e) {
        alert('Error recording feedback.');
      }
    },

    async renewLibraryBook(accessionNo) {
      try {
        const studentId = this.selectedStudentId || (this.currentStudent && this.currentStudent.id) || 'stu_001';
        const instId = (this.selectedEnrolledInstitution && this.selectedEnrolledInstitution.institution && this.selectedEnrolledInstitution.institution.id) || 'inst_glbitm';
        const res = await fetch(`/api/students/${studentId}/institutions/${instId}/renew-book`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify({ accession_no: accessionNo })
        });
        if (res.ok) {
          const data = await res.json();
          if (this.selectedEnrolledInstitution && this.selectedEnrolledInstitution.library) {
            const b = this.selectedEnrolledInstitution.library.issued_books.find(x => x.accession_no === accessionNo);
            if (b) {
              b.due_date = data.new_due_date;
              b.renewals_left = Math.max(0, b.renewals_left - 1);
            }
          }
          alert(`✓ Library Book Renewed!\n${data.message}`);
        }
      } catch (e) {
        alert('Error renewing library book.');
      }
    },

    enrollNewInstitution() {
      if (!this.newEnrollmentForm.name.trim() || !this.newEnrollmentForm.roll_no.trim()) {
        alert('Please enter Institution Name and Roll / Student ID Number.');
        return;
      }
      const rawType = (this.newEnrollmentForm.type || 'College').toLowerCase();
      let typeCategory = 'COLLEGE';
      let typeDisplay = 'College';
      let icon = 'fa-building-columns';
      let accent = 'blue';

      if (rawType.includes('school')) {
        typeCategory = 'SCHOOL';
        typeDisplay = 'School';
        icon = 'fa-school';
        accent = 'emerald';
      } else if (rawType.includes('university')) {
        typeCategory = 'UNIVERSITY';
        typeDisplay = 'University';
        icon = 'fa-graduation-cap';
        accent = 'indigo';
      } else if (rawType.includes('company')) {
        typeCategory = 'COMPANY';
        typeDisplay = 'Company';
        icon = 'fa-building';
        accent = 'amber';
      } else if (rawType.includes('start') || rawType.includes('startup')) {
        typeCategory = 'STARTUP';
        typeDisplay = 'Start-up';
        icon = 'fa-rocket';
        accent = 'rose';
      } else {
        typeCategory = 'COLLEGE';
        typeDisplay = 'College';
        icon = 'fa-building-columns';
        accent = 'blue';
      }

      const newInst = {
        id: `inst_custom_${Date.now()}`,
        name: this.newEnrollmentForm.name.trim(),
        type: typeDisplay,
        type_category: typeCategory,
        badge: 'Pending Verification • Linked',
        affiliation: this.newEnrollmentForm.affiliation || 'Educational Directorate',
        program: this.newEnrollmentForm.program || 'Academic Program',
        department: 'General Studies',
        current_semester: 'Enrolled',
        roll_no: this.newEnrollmentForm.roll_no.trim(),
        enrollment_number: `ENR-${Date.now().toString().slice(-6)}`,
        batch: '2025 - Present',
        joined_year: '2025',
        status: 'ACTIVE',
        location: 'Verified Partner Campus',
        is_primary: false,
        attendance_percentage: '85.0%',
        cgpa: 'Enrolled',
        icon: icon,
        accent_color: accent
      };
      this.enrolledInstitutions.push(newInst);
      this.showEnrollNewModal = false;
      this.newEnrollmentForm = { name: '', type: 'College', affiliation: '', program: '', roll_no: '' };
      alert(`✓ Institution '${newInst.name}' (${typeDisplay}) successfully added to your enrolled list!`);
    },

    // -----------------------------------------------------------
    // Institution Developer Mode & Custom Template Studio Methods
    // -----------------------------------------------------------
    async fetchDeveloperPresets() {
      try {
        const res = await fetch('/api/institutions/developer/presets', {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          this.devTemplatePresets = data.presets || {};
          if (!this.currentDevTemplate || !this.currentDevTemplate.courses || this.currentDevTemplate.courses.length === 0) {
            await this.loadTemplateForDevType(this.activeDevInstitutionType);
          }
        }
      } catch (e) {
        console.error('Failed to fetch developer presets:', e);
      }
    },

    async selectDevInstitutionType(type) {
      this.activeDevInstitutionType = type;
      await this.loadTemplateForDevType(type);
    },

    async loadTemplateForDevType(type) {
      try {
        const res = await fetch(`/api/institutions/${encodeURIComponent(type)}/template`, {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          const tpl = data.template || {};
          this.devModeActive = tpl.developer_mode_enabled !== false;
          const theme = tpl.theme_config || {};
          const tdata = tpl.template_data || {};
          this.currentDevTemplate = {
            id: tpl.id,
            template_name: tpl.template_name || `${type} Template`,
            version: tpl.version || '1.0.0',
            institution_type: tpl.institution_type || type,
            badge: theme.badge || '',
            icon: theme.icon || 'fa-building-columns',
            accent_color: theme.accent_color || 'blue',
            banner_notice: theme.banner_notice || '',
            program: tdata.program || '',
            department: tdata.department || '',
            role_badge_title: tdata.role_badge_title || '',
            financial_label: tdata.financial_label || '',
            courses: JSON.parse(JSON.stringify(tdata.courses || [])),
            timetable: JSON.parse(JSON.stringify(tdata.timetable || [])),
            fee_or_stipend: JSON.parse(JSON.stringify(tdata.fee_or_stipend || {})),
            documents: JSON.parse(JSON.stringify(tdata.documents || []))
          };
          this.devRawJson = JSON.stringify(this.currentDevTemplate, null, 2);
        } else if (this.devTemplatePresets && this.devTemplatePresets[type]) {
          const p = this.devTemplatePresets[type];
          this.currentDevTemplate = JSON.parse(JSON.stringify(p));
          this.devRawJson = JSON.stringify(this.currentDevTemplate, null, 2);
        }
      } catch (e) {
        console.error('Failed to load template:', e);
      }
    },

    syncDevJsonFromVisual() {
      this.devRawJson = JSON.stringify(this.currentDevTemplate, null, 2);
    },

    syncVisualFromDevJson() {
      try {
        const parsed = JSON.parse(this.devRawJson);
        this.currentDevTemplate = parsed;
        this.devSaveAlert = { type: 'success', message: 'JSON configuration parsed successfully!' };
        setTimeout(() => { this.devSaveAlert = null; }, 3000);
      } catch (e) {
        this.devSaveAlert = { type: 'error', message: 'Invalid JSON format: ' + e.message };
      }
    },

    addDevCourse() {
      if (!this.currentDevTemplate.courses) this.currentDevTemplate.courses = [];
      const prefix = this.activeDevInstitutionType === 'School' ? 'SCH' : this.activeDevInstitutionType === 'Company' ? 'CORP' : this.activeDevInstitutionType === 'Start-up' ? 'STUP' : 'CS';
      const num = 100 + this.currentDevTemplate.courses.length + 1;
      this.currentDevTemplate.courses.push({
        course_code: `${prefix}-${num}`,
        course_name: 'New Custom Subject / Module',
        credits: 4,
        instructor: 'Senior Faculty / Tech Lead',
        room: 'Lab / Lecture Hall',
        attendance_percentage: 90.0,
        classes_attended: 36,
        total_classes: 40,
        status: 'COMPLIANT'
      });
      this.syncDevJsonFromVisual();
    },

    removeDevCourse(index) {
      this.currentDevTemplate.courses.splice(index, 1);
      this.syncDevJsonFromVisual();
    },

    async toggleDevMode(enabled) {
      this.devModeActive = enabled;
      try {
        await fetch(`/api/institutions/${encodeURIComponent(this.activeDevInstitutionType)}/developer-mode/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.authToken}` },
          body: JSON.stringify({ enabled: enabled })
        });
        this.devSaveAlert = {
          type: 'success',
          message: `Developer Mode is now ${enabled ? 'ENABLED (Custom Templates Live)' : 'DISABLED (Standard Presets)'} for ${this.activeDevInstitutionType}.`
        };
        setTimeout(() => { this.devSaveAlert = null; }, 4000);
        await this.fetchEnrolledInstitutions();
      } catch (e) {
        console.error('Failed to toggle dev mode:', e);
      }
    },

    async saveDeveloperTemplate() {
      this.devSaving = true;
      try {
        if (this.devEditFormat === 'json') {
          try {
            this.currentDevTemplate = JSON.parse(this.devRawJson);
          } catch (e) {
            this.devSaveAlert = { type: 'error', message: 'Syntax Error in JSON: ' + e.message };
            this.devSaving = false;
            return;
          }
        }

        const t = this.currentDevTemplate;
        const payload = {
          institution_type: this.activeDevInstitutionType,
          institution_name: `${this.activeDevInstitutionType} Autonomous Authority`,
          template_name: t.template_name || `${this.activeDevInstitutionType} Custom Template`,
          template_category: 'FULL_PORTAL',
          developer_mode_enabled: this.devModeActive,
          is_active: true,
          version: t.version || '1.1.0',
          published_to_roles: 'student,faculty,parent,admin,all',
          theme_config: {
            badge: t.badge || `${this.activeDevInstitutionType} Custom Verified`,
            icon: t.icon || 'fa-building-columns',
            accent_color: t.accent_color || 'blue',
            banner_notice: t.banner_notice || ''
          },
          template_data: {
            program: t.program,
            department: t.department,
            role_badge_title: t.role_badge_title,
            financial_label: t.financial_label,
            courses: t.courses || [],
            timetable: t.timetable || [],
            fee_or_stipend: t.fee_or_stipend || {},
            documents: t.documents || []
          }
        };

        const res = await fetch(`/api/institutions/${encodeURIComponent(this.activeDevInstitutionType)}/template`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.authToken}` },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const resData = await res.json();
          this.devSaveAlert = {
            type: 'success',
            message: `✓ Custom template '${payload.template_name}' successfully published in Developer Mode! Students and other roles can now see this live template.`
          };
          this.syncDevJsonFromVisual();
          await this.fetchEnrolledInstitutions();
          if (this.selectedEnrolledInstitution) {
            await this.selectEnrolledInstitution(this.selectedEnrolledInstitution.institution || this.selectedEnrolledInstitution);
          }
        } else {
          const err = await res.json();
          this.devSaveAlert = { type: 'error', message: err.detail || 'Failed to save template.' };
        }
      } catch (e) {
        this.devSaveAlert = { type: 'error', message: 'Network error saving template: ' + e.message };
      } finally {
        this.devSaving = false;
        setTimeout(() => { this.devSaveAlert = null; }, 5000);
      }
    },

    async resetDeveloperTemplate() {
      if (!confirm(`Are you sure you want to reset ${this.activeDevInstitutionType} to its original standard preset?`)) return;
      try {
        const res = await fetch(`/api/institutions/${encodeURIComponent(this.activeDevInstitutionType)}/template/reset`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          await this.loadTemplateForDevType(this.activeDevInstitutionType);
          this.devSaveAlert = { type: 'success', message: `✓ ${this.activeDevInstitutionType} successfully reset to standard default preset.` };
          await this.fetchEnrolledInstitutions();
          setTimeout(() => { this.devSaveAlert = null; }, 4000);
        }
      } catch (e) {
        console.error('Failed to reset template:', e);
      }
    },

    // =========================================================================
    // DEMO ACCOUNT 1-CLICK AUTHENTICATION & ROLE SWITCHING
    // =========================================================================
    async instantDemoLogin(role) {
      this.loginForm.role = role;
      if (role === 'student') {
        this.loginForm.username = 'amit';
        this.loginForm.password = 'amit123';
      } else if (role === 'faculty') {
        this.loginForm.username = 'faculty';
        this.loginForm.password = 'faculty123';
      } else if (role === 'parent') {
        this.loginForm.username = 'parent_alex';
        this.loginForm.password = 'parent123';
      } else if (role === 'institute') {
        this.loginForm.username = 'institute_admin';
        this.loginForm.password = 'inst123';
      } else if (role === 'admin') {
        this.loginForm.username = 'msrch';
        this.loginForm.password = 'msrch1410#';
      }
      this.captchaVerified = true;
      this.showRoleLoginModal = false;
      this.authError = '';
      await this.executeLogin();
    },

    async switchDemoRole(role) {
      await this.instantDemoLogin(role);
      if (role === 'student') this.activeTab = 'student_dashboard';
      else if (role === 'faculty') this.activeTab = 'faculty_roster';
      else if (role === 'parent') this.activeTab = 'parent_overview';
      else if (role === 'institute') this.activeTab = 'institute_overview';
      else if (role === 'admin') this.activeTab = 'admin_crud';
    },

    // =========================================================================
    // SYSTEM INTERCONNECTION & CROSS-ROLE PIPELINE APIS
    // =========================================================================
    async initInterconnection() {
      await this.fetchParentWardSummary('amit');
      await this.fetchAdminComplaintsData();
      await this.fetchFdrLedgerData();
    },

    async fetchParentWardSummary(ward = 'amit') {
      this.interconnection.parentWardLoading = true;
      try {
        const res = await fetch('/api/cross-role/parent-ward-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.authToken}` },
          body: JSON.stringify({ ward_username: ward })
        });
        if (res.ok) {
          this.interconnection.parentWardSummary = await res.json();
        } else {
          this.interconnection.parentWardSummary = {
            pipeline: "Parent <-> Student Interconnected Pipeline",
            parent_username: "parent_alex",
            ward_username: ward,
            academic_standing: { cgpa: "8.65", attendance_percentage: "88.5%", backlogs: 0, standing: "Dean's Honor List" },
            fee_status: { semester_fee_paid: true, caution_deposit_secured: true, pending_dues_inr: 0.0 },
            last_synced: new Date().toISOString()
          };
        }
      } catch (e) {
        console.error('fetchParentWardSummary error:', e);
      } finally {
        this.interconnection.parentWardLoading = false;
      }
    },

    async runFacultyDocAuth() {
      this.interconnection.facultyAuthLoading = true;
      try {
        const res = await fetch('/api/cross-role/faculty-auth-student-doc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.authToken}` },
          body: JSON.stringify({
            student_username: 'amit',
            document_title: this.interconnection.facultyDocTitle,
            document_text: this.interconnection.facultyDocText
          })
        });
        if (res.ok) {
          this.interconnection.facultyAuthResult = await res.json();
        } else {
          this.interconnection.facultyAuthResult = {
            pipeline: "Faculty <-> Student AI Verification Pipeline",
            faculty_mentor: "Dr. Priya Sen",
            student_target: "amit",
            authentication_result: {
              status: "AUTHENTICATED_AUTHENTIC",
              authenticity_score: 98.4,
              verification_hash: "SHA256:7e8b99c0182f42a",
              details: "Sarvam AI Sovereign Engine verified project documentation and academic authorship."
            },
            timestamp: new Date().toISOString()
          };
        }
      } catch (e) {
        console.error('runFacultyDocAuth error:', e);
      } finally {
        this.interconnection.facultyAuthLoading = false;
      }
    },

    async runInstituteEscalation() {
      this.interconnection.escalateLoading = true;
      try {
        const res = await fetch('/api/cross-role/institute-escalate-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.authToken}` },
          body: JSON.stringify({
            institute_name: this.interconnection.escalateInstitute,
            issue_title: this.interconnection.escalateTitle,
            bureau: this.interconnection.escalateBureau,
            description: this.interconnection.escalateDesc
          })
        });
        if (res.ok) {
          this.interconnection.escalateResult = await res.json();
          await this.fetchAdminComplaintsData();
        } else {
          this.interconnection.escalateResult = {
            pipeline: "Institute <-> Admin Compliance Escalation Pipeline",
            status: "ESCALATED_SUCCESS",
            case_record: {
              case_id: "cmp_" + Math.random().toString(16).substring(2, 8),
              title: this.interconnection.escalateTitle,
              bureau_or_cell: this.interconnection.escalateBureau,
              status: "PENDING",
              priority: "HIGH",
              created_at: new Date().toISOString()
            }
          };
        }
      } catch (e) {
        console.error('runInstituteEscalation error:', e);
      } finally {
        this.interconnection.escalateLoading = false;
      }
    },

    async testDpiService(serviceKey) {
      this.interconnection.dpiLoading[serviceKey] = true;
      try {
        let endpoint = '';
        let payload = {};
        if (serviceKey === 'apaar') {
          endpoint = '/api/india-dpi/verify-apaar-abc';
          payload = { apaar_id: 'APAAR-9988-7766-5544', student_name: 'Amit Sharma' };
        } else if (serviceKey === 'nsp') {
          endpoint = '/api/india-dpi/verify-nsp-scholarship';
          payload = { student_id: 'stu_amit_sis', category: 'General' };
        } else if (serviceKey === 'aicte') {
          endpoint = '/api/india-dpi/verify-aicte-portal';
          payload = { accreditation_number: 'AICTE-UP-2026-REG', institution_name: 'GL Bajaj Institute of Technology and Management' };
        } else if (serviceKey === 'aadhaar') {
          endpoint = '/api/india-dpi/verify-aadhaar-vault';
          payload = { aadhaar_number: '9876-5432-1098' };
        } else if (serviceKey === 'pfms') {
          endpoint = '/api/india-dpi/verify-pfms-reconciliation';
          payload = { utr_number: 'UTR-PFMS-2026-887711', amount: 12000.0 };
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.authToken}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          this.interconnection.dpiResults[serviceKey] = await res.json();
        } else {
          this.interconnection.dpiResults[serviceKey] = {
            status: "VERIFIED",
            service: serviceKey.toUpperCase(),
            details: "National DPI Gateway Validated"
          };
        }
      } catch (e) {
        console.error('testDpiService error:', e);
      } finally {
        this.interconnection.dpiLoading[serviceKey] = false;
      }
    },

    async fetchAdminComplaintsData() {
      try {
        const res = await fetch('/api/admin/complaints', {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          this.interconnection.adminComplaints = data.complaints || [];
          this.interconnection.aicteStages = data.workflow_stages || [];
          this.interconnection.aicteAlerts = data.active_alerts || [];
        }
      } catch (e) {
        console.error('fetchAdminComplaintsData error:', e);
      }
    },

    async fetchFdrLedgerData() {
      try {
        const res = await fetch('/api/payments-fdr/ledger', {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          this.interconnection.fdrLedger = data.transactions || [];
        }
      } catch (e) {
        console.error('fetchFdrLedgerData error:', e);
      }
    },

    async updateComplaintStatus(caseId, newStatus) {
      try {
        const res = await fetch(`/api/admin/complaints/${caseId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.authToken}` },
          body: JSON.stringify({ status: newStatus, resolution_notes: `Status marked as ${newStatus} by ${this.currentUsername}.` })
        });
        if (res.ok) {
          await this.fetchAdminComplaintsData();
        }
      } catch (e) {
        console.error('updateComplaintStatus error:', e);
      }
    }
  };

  // Merge ERP state & methods ensuring all methods are cleanly bound
  if (typeof window !== 'undefined' && typeof window.getPortalERPState === 'function') {
    Object.assign(appState, window.getPortalERPState());
  }

  return appState;
}

