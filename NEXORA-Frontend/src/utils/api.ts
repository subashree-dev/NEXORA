import {
  Student,
  AuthUser,
  UserRole,
  StudentRankSummary,
  AICodingInsight,
  PlacementReadinessSummary,
} from '../types';

const TOKEN_KEY = 'nexora_auth_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });
  return response;
}

// ==========================================
// AUTHENTICATION CLIENT
// ==========================================

export async function loginUser(params: {
  role: UserRole;
  email: string;
  password: string;
  registerNumber?: string;
}): Promise<{ token: string; user: AuthUser; message: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Authentication failed');
  }

  setStoredToken(data.token);
  return data;
}

export async function logoutUser(): Promise<void> {
  try {
    await authFetch('/api/auth/logout', { method: 'POST' });
  } finally {
    setStoredToken(null);
  }
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await authFetch('/api/auth/me');
    if (!res.ok) {
      setStoredToken(null);
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
}

// ==========================================
// STUDENT API
// ==========================================

export async function fetchMyProfile(): Promise<Student> {
  const res = await authFetch('/api/student/me');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch student profile');
  }
  return res.json();
}

export async function saveMyLeetCodeUsername(username: string): Promise<{ message: string; student: Student }> {
  const res = await authFetch('/api/student/me/leetcode', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to connect LeetCode profile');
  }
  return res.json();
}

export async function fetchMyRankSummary(): Promise<StudentRankSummary> {
  const res = await authFetch('/api/student/me/rank');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch ranking metrics');
  }
  return res.json();
}

export async function fetchMyPlacementReadiness(): Promise<PlacementReadinessSummary> {
  const res = await authFetch('/api/student/me/readiness');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to calculate placement readiness');
  }
  return res.json();
}

export async function fetchMyAICodingInsight(): Promise<AICodingInsight> {
  const res = await authFetch('/api/student/me/ai-insight');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate coding insight');
  }
  return res.json();
}

// ==========================================
// FACULTY API
// ==========================================

export interface FacultyDashboardStats {
  totalScopeStudents: number;
  studentsWithCodingData: number;
  missingCodingData: number;
  avgProblemsSolved: number;
  avgReadinessScore: number;
  compactStudentProgress: {
    id: string;
    name: string;
    registerNumber: string;
    year: number;
    section: string;
    totalSolved: number;
    readinessScore: number;
    leetcodeUsername: string;
  }[];
}

export async function fetchFacultyDashboard(): Promise<FacultyDashboardStats> {
  const res = await authFetch('/api/faculty/dashboard');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load faculty dashboard data');
  }
  return res.json();
}

export interface FacultyStudentItem {
  id: string;
  name: string;
  registerNumber: string;
  year: number;
  section: string;
  leetcodeUsername: string;
  leetcodeProfileUrl: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  readinessScore: number;
  lastActiveDate: string;
}

export async function fetchFacultyStudents(params?: {
  year?: string;
  section?: string;
  q?: string;
}): Promise<{ students: FacultyStudentItem[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.year && params.year !== 'ALL') query.append('year', params.year);
  if (params?.section && params.section !== 'ALL') query.append('section', params.section);
  if (params?.q) query.append('q', params.q);

  const res = await authFetch(`/api/faculty/students?${query.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load student monitor roster');
  }
  return res.json();
}

export interface FacultyClassProgress {
  sectionStats: {
    section: string;
    studentCount: number;
    activeProfiles: number;
    totalSolved: number;
    avgSolved: number;
  }[];
  studentsNeedingGuidance: {
    id: string;
    name: string;
    registerNumber: string;
    year: number;
    section: string;
    totalSolved: number;
    readinessScore: number;
    indicatorNote: string;
  }[];
  missingProfiles: {
    id: string;
    name: string;
    registerNumber: string;
    year: number;
    section: string;
  }[];
}

export async function fetchFacultyClassProgress(): Promise<FacultyClassProgress> {
  const res = await authFetch('/api/faculty/class-progress');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load class progress rankings');
  }
  return res.json();
}

// ==========================================
// HOD API
// ==========================================

export interface HODDepartmentOverview {
  totalStudents: number;
  withCodingData: number;
  participationRate: number;
  missingCodingProfiles: number;
  avgProblemsSolved: number;
  avgReadinessScore: number;
  department: string;
}

export async function fetchHODOverview(): Promise<HODDepartmentOverview> {
  const res = await authFetch('/api/hod/department-overview');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load HOD department overview');
  }
  return res.json();
}

export interface HODComparisonData {
  yearComparisons: {
    year: number;
    totalStudents: number;
    activeProfiles: number;
    participationPct: number;
    avgSolved: number;
    avgReadinessScore: number;
  }[];
  sectionBreakdown: {
    section: string;
    count: number;
    avgSolved: number;
  }[];
}

export async function fetchHODComparison(): Promise<HODComparisonData> {
  const res = await authFetch('/api/hod/comparison');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load comparison benchmarks');
  }
  return res.json();
}

export interface HODReportData {
  generatedAt: string;
  department: string;
  totalRecords: number;
  records: {
    name: string;
    registerNumber: string;
    year: number;
    section: string;
    leetcodeUsername: string;
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    placementReadinessScore: number;
    lastAuditDate: string;
  }[];
}

export async function fetchHODReports(): Promise<HODReportData> {
  const res = await authFetch('/api/hod/reports');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load department reports');
  }
  return res.json();
}
