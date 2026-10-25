export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type CodingStatus = 'Active' | 'Consistent' | 'Inactive' | 'At Risk';
export type ReadinessLevel = 'Placement Ready (Tier-1)' | 'Core Tech Ready' | 'Intermediate Progress' | 'High Attention Needed';

export interface RegressionDataPoint {
  totalSolved: number; // Feature X
  readinessScore: number; // Target Y (0-100)
  studentRef?: string;
}

export interface LinearRegressionModel {
  slope: number; // beta_1 (m)
  intercept: number; // beta_0 (b)
  rSquared: number; // R^2 coefficient of determination
  meanSquaredError: number;
  sampleSize: number;
  trainingData: RegressionDataPoint[];
  datasetDescription: string;
  isDemoData: boolean;
}

export interface PredictionResult {
  totalSolved: number;
  predictedScore: number; // clamped 0-100
  rawScore: number;
  formula: string;
  explanation: string;
  isDemoData: boolean;
}

export interface RecentSubmission {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  platform: 'LeetCode' | 'HackerRank' | 'CodeChef';
  timestamp: string;
  status: 'Accepted' | 'Time Limit Exceeded' | 'Wrong Answer';
}

export interface TopicMastery {
  topic: string;
  solved: number;
  totalBenchmarked: number;
  mastery: 'Expert' | 'Proficient' | 'Developing' | 'Needs Practice';
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  placementRelevance: 'High' | 'Medium' | 'Foundational';
  verified: boolean;
  status: 'Completed' | 'In Progress';
}

export interface StudentCertification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  verificationUrl?: string;
  domain: 'Cloud' | 'Machine Learning' | 'Data Engineering' | 'Algorithms' | 'DevOps';
  verified: boolean;
}

export interface StudentInternship {
  id: string;
  company: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string;
  stipend?: string;
  techStack: string[];
  status: 'Completed' | 'Ongoing' | 'Offer Received';
  verified: boolean;
  ppoProspects: 'High' | 'Moderate' | 'Exploratory' | 'N/A';
}

export interface StudentAchievement {
  id: string;
  title: string;
  event: string;
  rankOrAward: string;
  year: string;
  category: 'Hackathon' | 'Competitive Coding' | 'Paper Publication' | 'Open Source';
}

export interface AIInsight {
  id: string;
  generatedAt: string;
  summary: string;
  strengths: string[];
  improvementAreas: string[];
  recommendedCodingActions: string[];
  suggestedNextSteps?: string[];
  placementPreparationSuggestions: string[];
  facultyNotes?: string;
}

export interface CodingTimelineMilestone {
  id: string;
  date: string;
  period: string;
  title: string;
  description: string;
  cumulativeSolved: number;
  deltaSolved?: number;
  contestRating?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  category: 'Milestone' | 'Contest' | 'Streak' | 'Difficulty' | 'Institutional Audit';
  badge?: string;
}

export interface Student {
  id: string;
  name: string;
  registerNumber: string;
  email: string;
  avatar: string;
  department: string;
  year: number;
  section: string;
  batch: string;
  mentor: string;
  profiles: {
    leetcode: { username: string; profileUrl: string; lastActivity?: string };
    hackerrank: { username: string; profileUrl: string; codingStatus?: string; stars?: number };
    github: { username: string; profileUrl: string; projectCount?: number };
    linkedin?: { username: string; profileUrl: string };
  };
  codingStats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    contestRating: number;
    globalRank?: number;
    acceptanceRate: number;
    currentStreak: number;
    maxStreak: number;
    lastActiveDate: string;
    activeDaysThisMonth: number;
    weeklyProgress: { week: string; solved: number }[];
    monthlySolves: { month: string; solved: number }[];
    topicBreakdown: TopicMastery[];
    recentSubmissions: RecentSubmission[];
    historicalTimeline?: CodingTimelineMilestone[];
  };
  projects: StudentProject[];
  certifications: StudentCertification[];
  internships: StudentInternship[];
  achievements: StudentAchievement[];
  placementReadiness: {
    overallScore: number; // 0 - 100
    level: ReadinessLevel;
    breakdown: {
      codingVelocity: number;
      problemComplexity: number;
      projectPortfolio: number;
      industryExposure: number;
      consistencyIndex: number;
    };
    status: CodingStatus;
    lastAuditDate: string;
  };
  aiInsights: AIInsight[];
}

export type UserRole = 'Student' | 'Faculty' | 'HOD';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  department: string;
  registerNumber?: string;
  year?: number;
  section?: string;
  token?: string;
}

export interface AICodingInsight {
  interpretation: string;
  recommendation: string;
  source: 'gemini' | 'rule-based-fallback';
  generatedAt: string;
}

export interface PlacementReadinessSummary {
  predictedScore: number;
  totalSolved: number;
  status: string;
  lastAuditDate: string;
  isAvailable: boolean;
  explanation: string;
}

export interface StudentRankSummary {
  studentId: string;
  studentName: string;
  registerNumber: string;
  section: string;
  year: number;
  totalSolved: number;
  sectionRank: number;
  sectionTotalStudents: number;
  yearRank: number;
  yearTotalStudents: number;
  lastUpdatedDate: string;
  nearbyLeaderboard: {
    rank: number;
    name: string;
    registerNumber: string;
    totalSolved: number;
    isCurrentStudent: boolean;
    section: string;
  }[];
}

export interface FacultyUser {
  id: string;
  name: string;
  role: UserRole | string;
  department: string;
  email: string;
  avatar: string;
}
