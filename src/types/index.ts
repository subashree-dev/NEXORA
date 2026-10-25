// Frontend Types for NEXORA

export type AcademicYear = 'First Year' | 'Second Year' | 'Third Year' | 'Fourth Year';
export type SectionName = 'A' | 'B' | 'C' | 'D';
export type CodingActivityStatus = 'Active' | 'Moderate' | 'Low Activity' | 'Inactive';

export interface Certification {
  id: string;
  name: string;
  provider: string;
  date: string;
  credentialUrl?: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string;
  description?: string;
}

export interface CodingStatistics {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  contestRating: number;
  acceptanceRate: number;
  recentActiveDays30: number;
  weeklyActivity: number[];
  lastSynced: string;
  hackerrankBadges: number;
  hackerrankScore: number;
  hackerrankStatus: string;
  codingStatus: CodingActivityStatus;
}

export interface TransparentReadiness {
  score: number;
  factors: {
    coding: number;
    projects: number;
    certifications: number;
    internship: number;
  };
}

export interface Student {
  id: string;
  registerNumber: string;
  name: string;
  year: AcademicYear;
  section: SectionName;
  email: string;
  githubUrl: string;
  leetcodeUrl: string;
  hackerrankUrl: string;
  codingStats: CodingStatistics;
  certifications: Certification[];
  internships: Internship[];
  transparentReadiness: TransparentReadiness;
  createdAt: string;
  projectsCount?: number;
  completedProjectsCount?: number;
}

export type ProjectStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Needs Changes'
  | 'Completed';

export interface Project {
  id: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  year: AcademicYear;
  section: SectionName;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  documentation: string;
  docFileName?: string;
  status: ProjectStatus;
  submissionDate: string;
  reviewNotes?: string;
  reviewerName?: string;
  lastUpdated: string;
}

export interface DepartmentAnalytics {
  totalStudents: number;
  yearCounts: {
    firstYear: number;
    secondYear: number;
    thirdYear: number;
    fourthYear: number;
  };
  activeCodersCount: number;
  moderateCodersCount: number;
  lowCodersCount: number;
  inactiveCodersCount: number;
  studentsNeedingAttentionCount: number;
  averageProblemsSolved: number;
  highestProblemsSolved: number;
  totalProjects: number;
  completedProjects: number;
  pendingProjects: number;
  approvedProjects: number;
  difficultyDistribution: {
    easyTotal: number;
    mediumTotal: number;
    hardTotal: number;
  };
  yearWiseCodingAverage: {
    firstYear: number;
    secondYear: number;
    thirdYear: number;
    fourthYear: number;
  };
  projectStatusDistribution: Record<ProjectStatus, number>;
}

export interface AICodingInsightResponse {
  studentName: string;
  registerNumber: string;
  year: string;
  generatedAt: string;
  performanceSummary: string;
  strengths: string[];
  areasForImprovement: string[];
  suggestedPractice: {
    topic: string;
    targetProblems: string;
    rationale: string;
  }[];
  weeklyScheduleSuggestion: string[];
}

export type UserRole = 'faculty' | 'student' | 'hod';
