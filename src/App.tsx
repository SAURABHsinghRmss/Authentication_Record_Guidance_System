import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/views/StudentDashboard';
import { EnrolledInstitutionsHub } from './components/views/EnrolledInstitutionsHub';
import { InterconnectionHub } from './components/views/InterconnectionHub';
import { FacultyDesk } from './components/views/FacultyDesk';
import { ParentMonitor } from './components/views/ParentMonitor';
import { InstituteGovernance } from './components/views/InstituteGovernance';
import { AdminWorkflow } from './components/views/AdminWorkflow';
import { UnifiedChat } from './components/views/UnifiedChat';
import { AcademicGuidance } from './components/views/AcademicGuidance';
import { ScamShield } from './components/views/ScamShield';
import { CareerPathways } from './components/views/CareerPathways';
import { FederationView } from './components/views/FederationView';
import { DevTemplateStudio } from './components/views/DevTemplateStudio';
import { BiometricsModal } from './components/views/BiometricsModal';
import { AuditLogsModal } from './components/views/AuditLogsModal';

const AppContent: React.FC = () => {
  const { isLoggedIn, activeTab, currentRole } = useAuth();
  const [showLogs, setShowLogs] = useState(false);
  const [showBiometrics, setShowBiometrics] = useState(false);

  if (!isLoggedIn) {
    return <LandingPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'interconnection':
        return <InterconnectionHub />;
      case 'faculty_roster':
        return <FacultyDesk />;
      case 'parent_overview':
        return <ParentMonitor />;
      case 'institute_overview':
        return <InstituteGovernance />;
      case 'admin_crud':
        return <AdminWorkflow />;
      case 'enrolled_institutions':
        return <EnrolledInstitutionsHub />;
      case 'unified_chat':
        return <UnifiedChat />;
      case 'guidance':
        return <AcademicGuidance />;
      case 'scam_shield':
        return <ScamShield />;
      case 'career':
        return <CareerPathways />;
      case 'admin_federation':
        return <FederationView />;
      case 'dev_templates':
        return <DevTemplateStudio />;
      case 'biometrics':
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-3xl mx-auto">
                <i className="fa-solid fa-fingerprint"></i>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Multimodal Biometrics Terminal</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Launch multimodal facial recognition, OCR student ID verification, and acoustic voice liveness checks.
              </p>
              <button
                onClick={() => setShowBiometrics(true)}
                className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition"
              >
                Open Biometrics Scanner Modal
              </button>
            </div>
          </div>
        );
      case 'student_dashboard':
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans theme-${currentRole}`}>
      <Header
        onOpenLogs={() => setShowLogs(true)}
        onOpenBiometrics={() => setShowBiometrics(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>

      <BiometricsModal
        isOpen={showBiometrics}
        onClose={() => setShowBiometrics(false)}
      />

      <AuditLogsModal
        isOpen={showLogs}
        onClose={() => setShowLogs(false)}
        onOpenBiometrics={() => setShowBiometrics(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
