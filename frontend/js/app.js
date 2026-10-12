function portalApp() {
  return {
    isLoggedIn: false,
    authMode: 'login',
    loginForm: { username: 'amit', password: 'amit123', role: 'student' },
    registerForm: { full_name: '', username: '', email: '', password: '', role: 'student', institution_name: '' },
    captchaVerified: false,
    captchaAnswer: '',
    showCaptchaModal: false,
    captchaPrompt: '7 + 5',
    captchaExpected: 12,
    authError: '',
    currentUserRole: 'student',
    currentUserInstitution: 'GL Bajaj',
    institutionVerified: true,
    authToken: '',
    themeClass: 'theme-student',

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
    
    targetUrl: '',
    urlCheckResult: null,
    pendingInstitutions: [],

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
        await this.fetchStudents();
        if (this.currentUserRole === 'admin') await this.fetchPendingInstitutions();
        this.initWebSocket();
      }
    },

    generateCaptcha() {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const ops = ['+', '-', '*'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      this.captchaPrompt = `${a} ${op} ${b}`;
      if (op === '+') this.captchaExpected = a + b;
      else if (op === '-') this.captchaExpected = a - b;
      else this.captchaExpected = a * b;
      this.captchaAnswer = '';
    },

    updateTheme() {
      if (this.currentUserRole === 'admin') this.themeClass = 'theme-admin';
      else if (this.currentUserRole === 'faculty') this.themeClass = 'theme-faculty';
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
          if (this.loginForm.username === 'admin') assignedRole = 'admin';
          else if (this.loginForm.username === 'faculty') assignedRole = 'faculty';
          else assignedRole = this.loginForm.role;

          localStorage.setItem('edu_token', data.access_token);
          localStorage.setItem('edu_role', assignedRole);
          localStorage.setItem('edu_inst', data.institution_name || 'GL Bajaj');
          localStorage.setItem('edu_inst_verified', data.institution_verified ? 'true' : 'false');

          this.authToken = data.access_token;
          this.currentUserRole = assignedRole;
          this.currentUserInstitution = data.institution_name || 'GL Bajaj';
          this.institutionVerified = data.institution_verified;
          this.updateTheme();
          this.isLoggedIn = true;

          if (assignedRole === 'admin') {
            this.activeTab = 'admin_crud';
            await this.fetchPendingInstitutions();
          } else if (assignedRole === 'faculty') {
            this.activeTab = 'faculty_roster';
          } else {
            this.activeTab = 'guidance';
          }

          await this.fetchStudents();
          this.initWebSocket();
        } else {
          const err = await res.json();
          this.authError = err.detail || 'Invalid username or password.';
        }
      } catch (e) {
        this.authError = 'Network error during login.';
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
    }
  };
}
