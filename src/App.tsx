/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// NEXORA - AI & DS Department Coding and Project Tracking Platform
// Easwari Engineering College - Department of Artificial Intelligence and Data Science

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FacultyDashboard } from './views/FacultyDashboard';
import { StudentsList } from './views/StudentsList';
import { CodingIntelligence } from './views/CodingIntelligence';
import { ProjectsList } from './views/ProjectsList';
import { StudentPortal } from './views/StudentPortal';
import { HODDashboard } from './views/HODDashboard';

import { StudentProfileModal } from './components/StudentProfileModal';
import { AICodingInsightModal } from './components/AICodingInsightModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { SubmitProjectModal } from './components/SubmitProjectModal';

import { Student, Project, DepartmentAnalytics, UserRole } from './types';
import { api } from './services/api';

export default function App() {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('faculty');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Department analytics
  const [analytics, setAnalytics] = useState<DepartmentAnalytics | null>(null);

  // Active student for Student Portal or Profile Inspector
  const [primaryStudent, setPrimaryStudent] = useState<Student | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [selectedStudentForAI, setSelectedStudentForAI] = useState<Student | null>(null);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);

  // Modals visibility
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const [isSubmitProjectOpen, setIsSubmitProjectOpen] = useState(false);

  // Active demonstration step (0 to 11 for the 12 steps)
  const [demoStep, setDemoStep] = useState(0);

  // Initial load
  useEffect(() => {
    loadDepartmentAnalytics();
    loadPrimaryStudent();
  }, []);

  // When year filter changes, reload analytics
  useEffect(() => {
    loadDepartmentAnalytics(yearFilter);
  }, [yearFilter]);

  const loadDepartmentAnalytics = async (yr?: string) => {
    try {
      const data = await api.getDepartmentAnalytics(yr);
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const loadPrimaryStudent = async () => {
    try {
      // Default to Ananya Krishnan (310625243001) for student view & demo
      const student = await api.getStudentById('310625243001');
      setPrimaryStudent(student);
    } catch (err) {
      console.error('Error fetching primary demo student:', err);
    }
  };

  // Handle switching user roles
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentUserRole(newRole);
    if (newRole === 'faculty') {
      setActiveTab('dashboard');
    } else if (newRole === 'student') {
      setActiveTab('my-dashboard');
    } else if (newRole === 'hod') {
      setActiveTab('hod-dashboard');
    }
  };

  // 12-Step Demonstration Flow Runner
  const handleSelectDemoStep = async (stepIndex: number) => {
    setDemoStep(stepIndex);
    // Ensure primary demo student (Ananya Krishnan) is ready
    let demoStudent = primaryStudent;
    if (!demoStudent) {
      demoStudent = await api.getStudentById('310625243001');
      setPrimaryStudent(demoStudent);
    }

    switch (stepIndex) {
      case 0: // 1. Faculty Login
        setCurrentUserRole('faculty');
        setActiveTab('dashboard');
        setIsProfileModalOpen(false);
        setIsAIModalOpen(false);
        break;
      case 1: // 2. Faculty Dashboard
        setCurrentUserRole('faculty');
        setActiveTab('dashboard');
        setYearFilter('All');
        setIsProfileModalOpen(false);
        setIsAIModalOpen(false);
        break;
      case 2: // 3. Select Second Year
        setCurrentUserRole('faculty');
        setActiveTab('dashboard');
        setYearFilter('Second Year');
        setIsProfileModalOpen(false);
        setIsAIModalOpen(false);
        break;
      case 3: // 4. Open Students
        setCurrentUserRole('faculty');
        setActiveTab('students');
        setYearFilter('Second Year');
        setSearchQuery('');
        setIsProfileModalOpen(false);
        setIsAIModalOpen(false);
        break;
      case 4: // 5. Search for a student
        setCurrentUserRole('faculty');
        setActiveTab('students');
        setYearFilter('Second Year');
        setSearchQuery('Ananya Krishnan');
        setIsProfileModalOpen(false);
        setIsAIModalOpen(false);
        break;
      case 5: // 6. Open Student Profile
        setCurrentUserRole('faculty');
        setActiveTab('students');
        if (demoStudent) {
          setSelectedStudentForProfile(demoStudent);
          setIsProfileModalOpen(true);
        }
        setIsAIModalOpen(false);
        break;
      case 6: // 7. Show LeetCode statistics
        setCurrentUserRole('faculty');
        if (demoStudent) {
          setSelectedStudentForProfile(demoStudent);
          setIsProfileModalOpen(true);
        }
        setIsAIModalOpen(false);
        break;
      case 7: // 8. Show coding progress
        setCurrentUserRole('faculty');
        if (demoStudent) {
          setSelectedStudentForProfile(demoStudent);
          setIsProfileModalOpen(true);
        }
        setIsAIModalOpen(false);
        break;
      case 8: // 9. Show projects
        setCurrentUserRole('faculty');
        if (demoStudent) {
          setSelectedStudentForProfile(demoStudent);
          setIsProfileModalOpen(true);
        }
        setIsAIModalOpen(false);
        break;
      case 9: // 10. Show project submission
        setCurrentUserRole('student');
        setActiveTab('my-projects');
        setIsProfileModalOpen(false);
        setIsAIModalOpen(false);
        break;
      case 10: // 11. Click Generate AI Coding Insight
        setCurrentUserRole('faculty');
        if (demoStudent) {
          setSelectedStudentForAI(demoStudent);
          setIsProfileModalOpen(false);
          setIsAIModalOpen(true);
        }
        break;
      case 11: // 12. Show AI-generated coding recommendations
        setCurrentUserRole('faculty');
        if (demoStudent) {
          setSelectedStudentForAI(demoStudent);
          setIsProfileModalOpen(false);
          setIsAIModalOpen(true);
        }
        break;
      default:
        break;
    }
  };

  const handleOpenStudentProfile = (student: Student) => {
    setSelectedStudentForProfile(student);
    setIsProfileModalOpen(true);
  };

  const handleOpenAIInsight = (student: Student) => {
    setSelectedStudentForAI(student);
    setIsAIModalOpen(true);
  };

  const handleOpenProjectDetail = (project: Project) => {
    setSelectedProjectForDetail(project);
    setIsProjectDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header with Role Switcher & Demonstration Guide */}
      <Header
        currentRole={currentUserRole}
        onRoleChange={handleRoleChange}
        onSelectDemoStep={handleSelectDemoStep}
        activeDemoStep={demoStep}
      />

      {/* Main Workspace Layout with responsive sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          currentRole={currentUserRole}
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'ai-insight') {
              if (primaryStudent) {
                handleOpenAIInsight(primaryStudent);
              }
            } else {
              setActiveTab(tab);
            }
          }}
          yearFilter={yearFilter}
          onYearFilterChange={(yr) => setYearFilter(yr)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* FACULTY PORTAL VIEWS */}
          {currentUserRole === 'faculty' && (
            <>
              {activeTab === 'dashboard' && (
                <FacultyDashboard
                  analytics={analytics}
                  yearFilter={yearFilter}
                  onYearFilterChange={setYearFilter}
                  onNavigateToStudents={() => setActiveTab('students')}
                  onNavigateToProjects={() => setActiveTab('projects')}
                  onNavigateToCodingIntelligence={() => setActiveTab('coding-intelligence')}
                />
              )}

              {activeTab === 'students' && (
                <StudentsList
                  initialYearFilter={yearFilter}
                  initialSearch={searchQuery}
                  onSelectStudent={handleOpenStudentProfile}
                  onOpenAIInsight={handleOpenAIInsight}
                />
              )}

              {activeTab === 'coding-intelligence' && (
                <CodingIntelligence
                  onSelectStudent={handleOpenStudentProfile}
                  onOpenAIInsight={handleOpenAIInsight}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsList
                  currentUserRole="faculty"
                  onOpenProjectDetail={handleOpenProjectDetail}
                />
              )}
            </>
          )}

          {/* STUDENT PORTAL VIEWS */}
          {currentUserRole === 'student' && primaryStudent && (
            <StudentPortal
              student={primaryStudent}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenSubmitProject={() => setIsSubmitProjectOpen(true)}
              onOpenProjectDetail={handleOpenProjectDetail}
              onStudentUpdated={(updated) => {
                setPrimaryStudent(updated);
                loadDepartmentAnalytics();
              }}
            />
          )}

          {/* HEAD OF DEPARTMENT (HOD) PORTAL VIEWS */}
          {currentUserRole === 'hod' && (
            <>
              {(activeTab === 'hod-dashboard' || activeTab === 'year-overview') && (
                <HODDashboard
                  analytics={analytics}
                  onNavigateToStudents={() => setActiveTab('students')}
                  onNavigateToCoding={() => setActiveTab('coding-analytics')}
                  onNavigateToProjects={() => setActiveTab('projects')}
                  onOpenAIInsight={() => {
                    if (primaryStudent) handleOpenAIInsight(primaryStudent);
                  }}
                />
              )}

              {activeTab === 'students' && (
                <StudentsList
                  initialYearFilter={yearFilter}
                  initialSearch={searchQuery}
                  onSelectStudent={handleOpenStudentProfile}
                  onOpenAIInsight={handleOpenAIInsight}
                />
              )}

              {activeTab === 'coding-analytics' && (
                <CodingIntelligence
                  onSelectStudent={handleOpenStudentProfile}
                  onOpenAIInsight={handleOpenAIInsight}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsList
                  currentUserRole="hod"
                  onOpenProjectDetail={handleOpenProjectDetail}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Student Profile Modal */}
      <StudentProfileModal
        student={selectedStudentForProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenAIInsight={(st) => {
          setSelectedStudentForAI(st);
          setIsAIModalOpen(true);
        }}
        onOpenProjectDetail={handleOpenProjectDetail}
        onStudentUpdated={() => {
          loadDepartmentAnalytics();
        }}
      />

      {/* 2. THE ONE AND ONLY ONE AI FEATURE: AI Coding Progress Insight */}
      <AICodingInsightModal
        student={selectedStudentForAI}
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />

      {/* 3. Project Detail & Review Modal */}
      <ProjectDetailModal
        project={selectedProjectForDetail}
        isOpen={isProjectDetailOpen}
        onClose={() => setIsProjectDetailOpen(false)}
        currentUserRole={currentUserRole}
        onProjectUpdated={() => {
          loadDepartmentAnalytics();
        }}
      />

      {/* 4. Submit New Project Modal */}
      {primaryStudent && (
        <SubmitProjectModal
          student={primaryStudent}
          isOpen={isSubmitProjectOpen}
          onClose={() => setIsSubmitProjectOpen(false)}
          onProjectSubmitted={() => {
            loadDepartmentAnalytics();
          }}
        />
      )}
    </div>
  );
}
