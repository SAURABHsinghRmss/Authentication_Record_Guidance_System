import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { StudentPortal } from './components/portals/student/StudentPortal';
import { FacultyPortal } from './components/portals/faculty/FacultyPortal';
import { ParentPortal } from './components/portals/parent/ParentPortal';
import { InstitutePortal } from './components/portals/institute/InstitutePortal';
import { AdminPortal } from './components/portals/admin/AdminPortal';

const AppContent: React.FC = () => {
  const { isLoggedIn, currentRole } = useAuth();

  if (!isLoggedIn) {
    return <LandingPage />;
  }

  // Render completely separated, zero-conflict portal based on active authenticated role
  switch (currentRole) {
    case 'faculty':
      return <FacultyPortal />;
    case 'parent':
      return <ParentPortal />;
    case 'institute':
      return <InstitutePortal />;
    case 'admin':
      return <AdminPortal />;
    case 'student':
    default:
      return <StudentPortal />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
