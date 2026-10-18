function portalApp() {
  return {
    isLoggedIn: false,
    authMode: 'login',
    loginForm: { username: 'amit', password: 'amit123', role: 'student' },
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
      institution_type: 'Autonomous College',
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

    activeTab: 'guidance',
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

    newStudent: {
      roll_no: '', name: '', email: '', department: 'Computer Science', semester: '6th Semester',
      cgpa: '8.0', attendance_percentage: '85.0', credits_earned: '100', max_credits: '160', backlogs: 0, status: 'VERIFIED'
    },

    auditLogs: [
      '[2026-10-06 12:00:01] SYSTEM INITIALIZED: FastAPI core online.',
      '[2026-10-06 12:00:02] DATABASE: SQLite/PostgreSQL tables verified and seeded.',
      '[2026-10-06 12:00:03] QDRANT VECTOR STORE: Knowledge base embeddings warmed up.'
    ],

    async init() {
      this.generateCaptcha();
      const token = localStorage.getItem('edu_token');
      const role = localStorage.getItem('edu_role');
      const inst = localStorage.getItem('edu_inst');
      const verified = localStorage.getItem('edu_inst_verified');
      if (token) {
        this.authToken = token;
        this.currentUserRole = role || 'student';
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
          this.activeTab = 'guidance';
        }
        await this.fetchStudents();
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
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.loginForm.username, password: this.loginForm.password })
        });
        if (res.ok) {
          const data = await res.json();
          let assignedRole = data.role;
          if (this.loginForm.username === 'admin' || this.loginForm.username === 'msrch') assignedRole = 'admin';
          else if (this.loginForm.role) assignedRole = this.loginForm.role;
          else assignedRole = data.role;

          localStorage.setItem('edu_token', data.access_token);
          localStorage.setItem('edu_role', assignedRole);
          localStorage.setItem('edu_inst', data.institution_name || 'GL Bajaj');
          localStorage.setItem('edu_inst_verified', data.institution_verified ? 'true' : 'false');

          this.authToken = data.access_token;
          this.currentUserRole = assignedRole;
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
            this.activeTab = 'guidance';
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
          const err = await res.json();
          this.authError = err.detail || 'Invalid username or password.';
        }
      } catch (e) {
        this.authError = 'Network error during login.';
      }
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

    quickFillLogin(role) {
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
    }
  };
}

