// NEXORA - AI & DS Department Data Models
// Designed for Easwari Engineering College - Artificial Intelligence and Data Science

export type AcademicYear = 'First Year' | 'Second Year' | 'Third Year' | 'Fourth Year';
export type SectionName = 'A' | 'B' | 'C' | 'D';
export type CodingActivityStatus = 'Active' | 'Moderate' | 'Low Activity' | 'Inactive';

export interface Certification {
  id: string;
  name: string;
  provider: string; // e.g., Coursera, NPTEL, AWS, Google Cloud, DeepLearning.AI
  date: string;
  credentialUrl?: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string; // e.g., "3 Months (Summer 2024)"
  description?: string;
}

export interface CodingStatistics {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  contestRating: number;
  acceptanceRate: number; // e.g. 64.2%
  recentActiveDays30: number; // e.g. 12 of last 30 days
  weeklyActivity: number[]; // e.g. [12, 15, 8, 20, 14, 18, 9, 22] (last 8 weeks)
  lastSynced: string;
  hackerrankBadges: number;
  hackerrankScore: number;
  hackerrankStatus: string; // e.g. "5 Stars (Python), Gold Problem Solving"
  codingStatus: CodingActivityStatus;
}

export interface TransparentReadiness {
  score: number; // 0 - 100
  factors: {
    coding: number; // max 40
    projects: number; // max 30
    certifications: number; // max 15
    internship: number; // max 15
  };
}

export interface Student {
  id: string;
  registerNumber: string; // e.g. 310625243001
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
  documentation: string; // uploaded doc summary or file reference
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
