import React, { useState, useEffect } from 'react';
import { AuthUser, UserRole } from './types';
import { fetchCurrentUser, logoutUser } from './utils/api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';

// Student Pages
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { StudentRankPage } from './pages/StudentRankPage';

// Faculty Pages
import { FacultyDashboardPage } from './pages/FacultyDashboardPage';
import { FacultyMonitorPage } from './pages/FacultyMonitorPage';
import { FacultyRankingsPage } from './pages/FacultyRankingsPage';

// HOD Pages
import { HODOverviewPage } from './pages/HODOverviewPage';
import { HODComparisonPage } from './pages/HODComparisonPage';
import { HODMonitoringPage } from './pages/HODMonitoringPage';
import { HODReportsPage } from './pages/HODReportsPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentPage, setCurrentPage] = useState<string>('student-dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    fetchCurrentUser()
      .then((user) => {
        if (user) {
          setCurrentUser(user);
          // Set default page based on role
          if (user.role === 'Student') {
            setCurrentPage('student-dashboard');
          } else if (user.role === 'Faculty') {
            setCurrentPage('faculty-dashboard');
          } else if (user.role === 'HOD') {
            setCurrentPage('hod-overview');
          }
        }
      })
      .finally(() => {
        setLoadingAuth(false);
      });
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'Student') {
      setCurrentPage('student-dashboard');
    } else if (user.role === 'Faculty') {
      setCurrentPage('faculty-dashboard');
    } else if (user.role === 'HOD') {
      setCurrentPage('hod-overview');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setCurrentPage('student-dashboard');
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#eef2f6] flex flex-col items-center justify-center text-slate-500 font-sans">
        <div className="w-10 h-10 rounded-2xl neu-card flex items-center justify-center text-blue-600 font-bold text-lg mb-3 shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] animate-pulse">
          N
        </div>
        <p className="text-xs font-semibold text-slate-600">Verifying institutional session...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Titles based on active page
  const getPageTitle = () => {
    switch (currentPage) {
      // Student
      case 'student-dashboard':
        return 'My Dashboard';
      case 'student-rank':
        return 'My Class & Cohort Rank';

      // Faculty
      case 'faculty-dashboard':
        return 'Faculty Dashboard';
      case 'faculty-monitor':
        return 'Student Coding Monitor';
      case 'faculty-rankings':
        return 'Class Progress & Rankings';

      // HOD
      case 'hod-overview':
        return 'Department Overview';
      case 'hod-comparison':
        return 'Year & Section Comparison';
      case 'hod-monitoring':
        return 'Student Monitoring';
      case 'hod-reports':
        return 'Department Reports';

      default:
        return 'NEXORA';
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      // Student
      case 'student-dashboard':
        return 'Track your LeetCode problem solving, placement readiness, and coding insights';
      case 'student-rank':
        return 'Your position among Section and Year cohort peers in AI & Data Science';

      // Faculty
      case 'faculty-dashboard':
        return 'Key problem-solving metrics and placement readiness across your student scope';
      case 'faculty-monitor':
        return 'Search, filter, and audit individual student problem distributions';
      case 'faculty-rankings':
        return 'Section comparative analytics and academic guidance reviews';

      // HOD
      case 'hod-overview':
        return 'Artificial Intelligence & Data Science executive coding metrics';
      case 'hod-comparison':
        return 'Evaluate coding velocity across academic years and sections';
      case 'hod-monitoring':
        return 'Department-level student directory and coding guidance cohort';
      case 'hod-reports':
        return 'Generate and export official placement preparation spreadsheets';

      default:
        return '';
    }
  };

  return (
    <div className="flex h-screen bg-[#eef2f6] text-slate-800 overflow-hidden font-sans selection:bg-blue-100">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#eef2f6]">
        {/* Top Header */}
        <Header
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
          currentUser={currentUser}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#eef2f6]">
          {/* STUDENT PAGES */}
          {currentUser.role === 'Student' && (
            <>
              {currentPage === 'student-dashboard' && <StudentDashboardPage />}
              {currentPage === 'student-rank' && <StudentRankPage />}
            </>
          )}

          {/* FACULTY PAGES */}
          {currentUser.role === 'Faculty' && (
            <>
              {currentPage === 'faculty-dashboard' && (
                <FacultyDashboardPage onNavigate={(p) => setCurrentPage(p)} />
              )}
              {currentPage === 'faculty-monitor' && <FacultyMonitorPage />}
              {currentPage === 'faculty-rankings' && <FacultyRankingsPage />}
            </>
          )}

          {/* HOD PAGES */}
          {currentUser.role === 'HOD' && (
            <>
              {currentPage === 'hod-overview' && (
                <HODOverviewPage onNavigate={(p) => setCurrentPage(p)} />
              )}
              {currentPage === 'hod-comparison' && <HODComparisonPage />}
              {currentPage === 'hod-monitoring' && <HODMonitoringPage />}
              {currentPage === 'hod-reports' && <HODReportsPage />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
