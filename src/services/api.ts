// Frontend API Client for NEXORA
import {
  Student,
  Project,
  DepartmentAnalytics,
  AICodingInsightResponse,
} from '../types';

export const api = {
  // Students
  async getStudents(params?: {
    year?: string;
    section?: string;
    codingStatus?: string;
    search?: string;
  }): Promise<Student[]> {
    const query = new URLSearchParams();
    if (params?.year && params.year !== 'All') query.append('year', params.year);
    if (params?.section && params.section !== 'All') query.append('section', params.section);
    if (params?.codingStatus && params.codingStatus !== 'All')
      query.append('codingStatus', params.codingStatus);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`/api/students?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  async getStudentById(id: string): Promise<Student & { projects: Project[] }> {
    const res = await fetch(`/api/students/${id}`);
    if (!res.ok) throw new Error('Failed to fetch student details');
    return res.json();
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update student profile');
    const data = await res.json();
    return data.student;
  },

  // Coding Sync
  async syncCodingStats(studentId: string): Promise<{
    success: boolean;
    message: string;
    updatedStats: Student['codingStats'];
    syncedAt: string;
  }> {
    const res = await fetch('/api/coding/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    if (!res.ok) throw new Error('Failed to synchronize coding statistics');
    return res.json();
  },

  // Projects
  async getProjects(params?: {
    year?: string;
    section?: string;
    status?: string;
    studentId?: string;
    search?: string;
  }): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params?.year && params.year !== 'All') query.append('year', params.year);
    if (params?.section && params.section !== 'All') query.append('section', params.section);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.studentId) query.append('studentId', params.studentId);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`/api/projects?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to submit project');
    const data = await res.json();
    return data.project;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update project status');
    const data = await res.json();
    return data.project;
  },

  // Analytics
  async getDepartmentAnalytics(year?: string): Promise<DepartmentAnalytics> {
    const query = year && year !== 'All' ? `?year=${encodeURIComponent(year)}` : '';
    const res = await fetch(`/api/analytics/department${query}`);
    if (!res.ok) throw new Error('Failed to load analytics');
    return res.json();
  },

  // AI Feature: Single AI Coding Insight
  async getAICodingInsight(studentId: string): Promise<AICodingInsightResponse> {
    const res = await fetch('/api/ai/coding-insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to generate AI coding insight');
    }
    return res.json();
  },
};
