import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  targetArea: string;
  tip: string;
  badge: string;
}

const ROLE_TOUR_STEPS: Record<UserRole, TourStep[]> = {
  student: [
    {
      title: 'Academic Progress & APAAR Credentials',
      subtitle: 'Verified Identity Registry',
      description: 'Your permanent 12-digit APAAR ID and Academic Bank of Credits (ABC) are pre-synchronized with DigiLocker. Review cumulative CGPA, earned degree credits, and real-time attendance.',
      icon: 'fa-graduation-cap',
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      targetArea: 'Top Navigation & Academic Overview',
      tip: 'Click "DigiLocker Sync" in the sidebar to view government-certified transcript badges.',
      badge: 'Step 1 of 5 · Identity'
    },
    {
      title: 'Mandatory 75% Attendance Safety Ring',
      subtitle: 'Statutory AICTE Benchmark',
      description: 'AICTE regulations strictly require 75% physical attendance to qualify for semester examinations. The dynamic progress ring flags yellow below 80% and red if your standing enters condonation risk.',
      icon: 'fa-chart-pie',
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
      targetArea: 'Attendance Compliance Dashboard Card',
      tip: 'Your attendance is automatically updated daily from IoT classroom clock-ins.',
      badge: 'Step 2 of 5 · Compliance'
    },
    {
      title: 'EduMentor Meta AI Copilot',
      subtitle: '24/7 Academic RAG Advisor',
      description: 'Access instantaneous tutoring grounded in 8 educational criteria: Policy Regulations, Concept Tutoring, Quiz Generation, Thread Summaries, and Code Optimization with 3-second fallback.',
      icon: 'fa-brain',
      color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      targetArea: 'EduMentor AI & Guidance Tab',
      tip: 'Tap any of the 8 quick-action criteria chips above the message bar for instant guidance.',
      badge: 'Step 3 of 5 · AI Advisor'
    },
    {
      title: 'Multimodal Biometrics Terminal',
      subtitle: 'Face 3D, OCR & Voice Liveness',
      description: 'Launch the multimodal biometric verification modal for examination hall ticket authorization. Includes 3D depth mesh analysis, student ID OCR extraction, and acoustic voice liveness checks.',
      icon: 'fa-fingerprint',
      color: 'text-teal-400 bg-teal-500/20 border-teal-500/30',
      targetArea: 'Biometric Pass & OCR Tab',
      tip: 'Biometric events are cryptographically digested with SHA-256 for examination verification.',
      badge: 'Step 4 of 5 · Biometrics'
    },
    {
      title: 'Opportunity Scam Shield & Career Roadmap',
      subtitle: 'Proactive Phishing Protection',
      description: 'Audit external scholarship, internship, and hackathon URLs against heuristic domain risk engines before submitting personal data or paying registration fees.',
      icon: 'fa-shield-halved',
      color: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
      targetArea: 'Scam Shield & Career Pathways Tabs',
      tip: 'Paste any scholarship URL into the scanner for instantaneous risk grading.',
      badge: 'Step 5 of 5 · Career & Safety'
    }
  ],
  faculty: [
    {
      title: 'Mentorship Roster Desk',
      subtitle: 'Assigned Student Cohort',
      description: 'View and search your assigned student mentees across departments and semesters. Filter by CGPA, attendance thresholds, and active backlog deficits in real time.',
      icon: 'fa-chalkboard-user',
      color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
      targetArea: 'Mentorship Roster View',
      tip: 'Use the quick search box to find specific students by name or roll number.',
      badge: 'Step 1 of 5 · Roster'
    },
    {
      title: 'At-Risk Student Early Warning Desk',
      subtitle: 'Proactive Intervention Engine',
      description: 'Students falling below 75% attendance or carrying backlogs are automatically isolated. Use the one-click "Send Counseling Notice" button to dispatch formal remediation notices.',
      icon: 'fa-triangle-exclamation',
      color: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
      targetArea: 'At-Risk Warning Desk Tab',
      tip: 'Dispatched counseling alerts are permanently mirrored to the student and parent terminals.',
      badge: 'Step 2 of 5 · At-Risk'
    },
    {
      title: 'Longitudinal Counseling Ledger',
      subtitle: 'Multi-Semester Guidance Archive',
      description: 'Record qualitative coaching notes, student improvement agreements, and parent consultations. Notes are permanently linked to the student record across all 8 semesters.',
      icon: 'fa-book-bookmark',
      color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
      targetArea: 'Longitudinal Ledger Tab',
      tip: 'Choose the relevant counseling category (e.g. SWAYAM credits, CGPA recovery) for clean tagging.',
      badge: 'Step 3 of 5 · Counseling'
    },
    {
      title: 'Pedagogy AI Assistant',
      subtitle: 'Syllabus Quiz & Discussion Synthesizer',
      description: 'Harness Sarvam AI to generate 4-option check-in quizzes with answer keys, synthesize student lab inquiries into revision cheat sheets, and validate citation formats.',
      icon: 'fa-brain',
      color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      targetArea: 'Pedagogy AI Assistant Tab',
      tip: 'One click generates complete 4-option quizzes directly into your faculty stream.',
      badge: 'Step 4 of 5 · Pedagogy'
    },
    {
      title: 'Academic Journal & CFP Verifier',
      subtitle: 'Predatory Conference Defense',
      description: 'Heuristic trust evaluation tool to audit conference websites, call-for-papers, and academic journals against SCOPUS and UGC-CARE index databases.',
      icon: 'fa-newspaper',
      color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
      targetArea: 'Research & Journal Verifier Tab',
      tip: 'Enter any conference domain to verify whether it meets peer-review accreditation standards.',
      badge: 'Step 5 of 5 · Research'
    }
  ],
  parent: [
    {
      title: 'Ward Academic & Attendance Monitor',
      subtitle: 'Real-Time Semester Progress',
      description: 'Continuous oversight of your child\'s attendance percentage against the mandatory 75% rule, cumulative CGPA, earned credits, and course progress.',
      icon: 'fa-user-graduate',
      color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
      targetArea: 'Ward Academic Monitor Tab',
      tip: 'The attendance gauge provides an early warning if attendance dips towards 75%.',
      badge: 'Step 1 of 5 · Overview'
    },
    {
      title: 'Examination Admit Card Clearance',
      subtitle: 'Statutory Eligibility Verification',
      description: 'Inspect hall ticket clearance status, verify that attendance and tuition dues requirements are satisfied, and download certified PDF admit cards with QR security codes.',
      icon: 'fa-id-card-clip',
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
      targetArea: 'Admit Card & Clearance Tab',
      tip: 'Admit cards are digitally verified and sealed by the university registrar.',
      badge: 'Step 2 of 5 · Admit Card'
    },
    {
      title: 'Direct Faculty Mentor Hotline',
      subtitle: 'Confidential 1-on-1 Communication',
      description: 'Direct, private messaging channel with your ward\'s designated faculty mentor (Dr. Priya Sen) to discuss academic progress, exam preparation, and career plans.',
      icon: 'fa-headset',
      color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
      targetArea: 'Faculty Mentor Hotline Tab',
      tip: 'Mentors reply directly to parent inquiries within 24 operational hours.',
      badge: 'Step 3 of 5 · Hotline'
    },
    {
      title: 'Fees & Statutory Escrow Ledger',
      subtitle: 'Transparent Financial Records',
      description: 'View semester tuition and laboratory fee breakdowns, make instantaneous settlements via UPI or NetBanking, and generate official GST receipts.',
      icon: 'fa-receipt',
      color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
      targetArea: 'Fees & Payment Ledger Tab',
      tip: 'Official fee receipts can be immediately downloaded for tax and employer reimbursement.',
      badge: 'Step 4 of 5 · Fees'
    },
    {
      title: 'Academic Policies in Plain English',
      subtitle: 'Jargon-Free AI Advice',
      description: 'Clear, plain-language explanations of complex university policies: what happens if attendance drops, how the Academic Bank of Credits operates, and placement drive eligibility.',
      icon: 'fa-circle-question',
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      targetArea: 'Academic Policies FAQ Tab',
      tip: 'Read simplified explanations of AICTE and Ministry of Education regulations.',
      badge: 'Step 5 of 5 · Regulations'
    }
  ],
  institute: [
    {
      title: 'AICTE SIF Statutory Governance',
      subtitle: 'Standard Inspection Format',
      description: 'Centralized institutional compliance console auditing land norms, built-up instructional area, administrative infrastructure, and annual expansion readiness.',
      icon: 'fa-building-columns',
      color: 'text-teal-400 bg-teal-500/20 border-teal-500/30',
      targetArea: 'AICTE SIF Governance View',
      tip: 'Monitor real-time compliance indicators before official regulatory inspection cycles.',
      badge: 'Step 1 of 5 · Governance'
    },
    {
      title: 'Department Capacities & Cadre Ratios (FSR)',
      subtitle: 'Cadre Benchmarks (< 1:15)',
      description: 'Track sanctioned student intake versus active enrollments across all academic departments. Ensure that Faculty-to-Student Cadre Ratios satisfy AICTE statutory norms.',
      icon: 'fa-users-gear',
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
      targetArea: 'Departments & Faculty Load Tab',
      tip: 'Inspect department-level lab readiness scores and HOD assignments.',
      badge: 'Step 2 of 5 · Cadre Ratios'
    },
    {
      title: 'Campus Statutory Bulletin Broadcaster',
      subtitle: 'Instant Omnichannel Circulars',
      description: 'Compose and dispatch official university notices to #academic_bulletin and #campus_global. Broadcasts immediately appear on all student and faculty portal terminals.',
      icon: 'fa-bullhorn',
      color: 'text-teal-400 bg-teal-500/20 border-teal-500/30',
      targetArea: 'Statutory Bulletin Broadcaster Tab',
      tip: 'Official notices are highlighted with university seal badges in student agoras.',
      badge: 'Step 3 of 5 · Broadcasting'
    },
    {
      title: 'Accreditation Vault & Autonomy Gazette',
      subtitle: 'Institutional Credentials',
      description: 'Manage certified NAAC Grade A++, NBA Tier-1 Washington Accord, and UGC Autonomous Institution gazette orders with countdown to renewal audits.',
      icon: 'fa-certificate',
      color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
      targetArea: 'Accreditation Vault Tab',
      tip: 'Cryptographic SHA-256 digests prove validity for regulatory review teams.',
      badge: 'Step 4 of 5 · Accreditation'
    },
    {
      title: 'Statutory FDR Escrow Reserves',
      subtitle: 'Mandatory Security Deposits',
      description: 'Audit fixed deposit receipts (FDR) held in joint escrow with AICTE to guarantee institutional financial stability and student welfare reserves.',
      icon: 'fa-vault',
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
      targetArea: 'Statutory FDR Escrow Tab',
      tip: 'Principal amounts and maturity dates are matched against regulatory inspection certificates.',
      badge: 'Step 5 of 5 · Escrow'
    }
  ],
  admin: [
    {
      title: 'National AICTE Grievance Triage Bureau',
      subtitle: 'Regulatory Escalation Center',
      description: 'Review, categorize, and assign institutional complaints and student grievances to specialized bureaus (Approval Bureau, Regulatory Bureau, Research & Institutional).',
      icon: 'fa-scale-balanced',
      color: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
      targetArea: 'AICTE Grievances Bureau View',
      tip: 'Filter complaints by assigned bureau to accelerate compliance response times.',
      badge: 'Step 1 of 5 · Grievances'
    },
    {
      title: '3NF Relational Student Database Administration',
      subtitle: 'Master Database CRUD',
      description: 'Direct relational lifecycle management for student records stored in academic_sis.db. Register new students with strict APAAR and CGPA constraint validation.',
      icon: 'fa-database',
      color: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
      targetArea: 'Student Database (3NF CRUD) Tab',
      tip: 'Deletions and updates are cryptographically hashed and recorded to the security audit trail.',
      badge: 'Step 2 of 5 · CRUD'
    },
    {
      title: 'Polyglot 7-Database Domain Cluster Console',
      subtitle: 'Federated Infrastructure Telemetry',
      description: 'Orchestrate 7 isolated domain databases (auth_iam, academic_sis, family_heritage, institutions_governance, security_audit, career_pathways, notifications_events).',
      icon: 'fa-server',
      color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
      targetArea: '7-Database Cluster Console Tab',
      tip: 'Ping database clusters and trigger cross-database synchronizations with sub-second latency.',
      badge: 'Step 3 of 5 · 7-DB Cluster'
    },
    {
      title: 'Institutional Accreditation Approval Queue',
      subtitle: 'College Tenant Onboarding',
      description: 'Audit unverified collegiate tenant applications. Review AISHE identification codes, state accreditations, and evaluate mandatory FDR escrow reserves before authorizing.',
      icon: 'fa-building-shield',
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
      targetArea: 'Institution Approval Queue Tab',
      tip: 'One-click verification dispatches institutional credentials and creates tenant partitions.',
      badge: 'Step 4 of 5 · Tenant Approvals'
    },
    {
      title: 'Security Audit & Biometric Forensics',
      subtitle: 'Forensic Review Flagging',
      description: 'Inspect immutable SHA-256 user activity streams. Flag suspicious or rejected biometric scan events for compliance inspection with custom administrative reasons.',
      icon: 'fa-fingerprint',
      color: 'text-teal-400 bg-teal-500/20 border-teal-500/30',
      targetArea: 'Audit & Biometric Forensics Tab',
      tip: 'Flagged entries synchronize directly to the cloud ledger for formal forensic review.',
      badge: 'Step 5 of 5 · Forensics'
    }
  ]
};

interface GuidedTourProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ role, isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const steps = ROLE_TOUR_STEPS[role] || ROLE_TOUR_STEPS.student;

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleComplete();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`edu_tour_seen_${role}`, 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Spotlight container */}
      <div className="relative max-w-xl w-full bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/10 space-y-6 overflow-hidden">
        {/* Ambient background glow matching role */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header & Progress */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
              {role.toUpperCase()} Onboarding Walkthrough
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-mono text-slate-400">
              {currentStep.badge}
            </span>
            <button
              onClick={handleComplete}
              className="text-slate-400 hover:text-white transition p-1 text-sm"
              title="Close Tour (Esc)"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-start space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold border shrink-0 ${currentStep.color}`}>
              <i className={`fa-solid ${currentStep.icon}`}></i>
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                {currentStep.subtitle}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                {currentStep.title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>

          {/* Target location callout */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
            <div className="flex items-center space-x-2 text-cyan-400 text-[11px]">
              <i className="fa-solid fa-location-crosshairs"></i>
              <span className="font-bold">Focus Location:</span>
              <span className="text-slate-200">{currentStep.targetArea}</span>
            </div>
            <div className="text-slate-400 text-[11px] flex items-center gap-1.5 pt-0.5">
              <i className="fa-solid fa-lightbulb text-amber-400 text-[10px]"></i>
              <span>{currentStep.tip}</span>
            </div>
          </div>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex items-center justify-center space-x-2 py-1">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'w-8 bg-blue-500'
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
              title={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 relative z-10">
          <button
            onClick={handleComplete}
            className="text-xs text-slate-400 hover:text-white transition font-mono"
          >
            Skip Walkthrough
          </button>

          <div className="flex items-center space-x-2.5">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5"
              >
                <i className="fa-solid fa-arrow-left text-[10px]"></i>
                <span>Previous</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center space-x-1.5"
            >
              <span>{isLast ? 'Complete & Start' : 'Next Step'}</span>
              <i className={`fa-solid ${isLast ? 'fa-check' : 'fa-arrow-right'} text-[10px]`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
