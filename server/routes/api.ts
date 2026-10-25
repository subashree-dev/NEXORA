// Express API Router for NEXORA
// Department of Artificial Intelligence and Data Science - Easwari Engineering College

import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { syncStudentCodingStats } from '../services/codingService';
import { generateAICodingInsight } from '../services/aiService';

export const apiRouter = Router();

// ==========================================
// 1. STUDENTS ENDPOINTS
// ==========================================

/**
 * GET /api/students
 * Query: year, section, codingStatus, search
 */
apiRouter.get('/students', (req: Request, res: Response) => {
  try {
    const { year, section, codingStatus, search } = req.query;
    const students = db.getStudents({
      year: year as string,
      section: section as string,
      codingStatus: codingStatus as string,
      search: search as string,
    });

    // Attach project count for each student
    const allProjects = db.getProjects();
    const studentsWithMeta = students.map((s) => {
      const studentProjects = allProjects.filter((p) => p.studentId === s.id);
      return {
        ...s,
        projectsCount: studentProjects.length,
        completedProjectsCount: studentProjects.filter((p) => p.status === 'Completed').length,
      };
    });

    res.json(studentsWithMeta);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch students', message: err.message });
  }
});

/**
 * GET /api/students/:id
 * Fetch a single student by ID or Register Number
 */
apiRouter.get('/students/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = db.getStudentById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentProjects = db.getProjects({ studentId: student.id });

    res.json({
      ...student,
      projects: studentProjects,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve student profile', message: err.message });
  }
});

/**
 * PUT /api/students/:id
 * Update student profile info (LeetCode URL, HackerRank URL, GitHub, certifications)
 */
apiRouter.put('/students/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = db.updateStudent(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Student not found to update' });
    }

    res.json({ success: true, student: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update student profile', message: err.message });
  }
});

/**
 * GET /api/students/:id/coding
 * Get detailed coding stats & history for a specific student
 */
apiRouter.get('/students/:id/coding', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = db.getStudentById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      studentId: student.id,
      name: student.name,
      registerNumber: student.registerNumber,
      year: student.year,
      section: student.section,
      leetcodeUrl: student.leetcodeUrl,
      hackerrankUrl: student.hackerrankUrl,
      codingStats: student.codingStats,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch coding statistics', message: err.message });
  }
});

// ==========================================
// 2. CODING INTEGRATION (LEETCODE & HACKERRANK)
// ==========================================

/**
 * POST /api/coding/sync
 * Trigger sync of LeetCode & HackerRank statistics
 * Body: { studentId: string }
 */
apiRouter.post('/coding/sync', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: 'Missing studentId parameter' });
    }

    const syncResult = await syncStudentCodingStats(studentId);
    res.json(syncResult);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to synchronize coding statistics', message: err.message });
  }
});

// ==========================================
// 3. PROJECT SUBMISSION & TRACKING
// ==========================================

/**
 * GET /api/projects
 * Query: year, section, status, studentId, search
 */
apiRouter.get('/projects', (req: Request, res: Response) => {
  try {
    const { year, section, status, studentId, search } = req.query;
    const projects = db.getProjects({
      year: year as string,
      section: section as string,
      status: status as string,
      studentId: studentId as string,
      search: search as string,
    });
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch projects', message: err.message });
  }
});

/**
 * POST /api/projects
 * Submit a new project
 */
apiRouter.post('/projects', (req: Request, res: Response) => {
  try {
    const {
      studentId,
      studentName,
      registerNumber,
      year,
      section,
      title,
      description,
      techStack,
      githubUrl,
      liveDemoUrl,
      documentation,
      docFileName,
    } = req.body;

    if (!studentId || !title || !description) {
      return res.status(400).json({ error: 'studentId, title, and description are required' });
    }

    const newProject = db.addProject({
      studentId,
      studentName: studentName || 'Student',
      registerNumber: registerNumber || '310625243000',
      year: year || 'Second Year',
      section: section || 'A',
      title,
      description,
      techStack: Array.isArray(techStack) ? techStack : [techStack].filter(Boolean),
      githubUrl: githubUrl || '',
      liveDemoUrl: liveDemoUrl || '',
      documentation: documentation || 'Project documentation uploaded via portal.',
      docFileName: docFileName || 'Project_Documentation.pdf',
      status: 'Submitted',
      submissionDate: new Date().toISOString().split('T')[0],
      reviewNotes: 'Awaiting faculty evaluation.',
    });

    res.status(201).json({ success: true, project: newProject });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create project', message: err.message });
  }
});

/**
 * PUT /api/projects/:id
 * Update project details or review status
 */
apiRouter.put('/projects/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = db.updateProject(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, project: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update project', message: err.message });
  }
});

// ==========================================
// 4. DEPARTMENT ANALYTICS (FACULTY & HOD)
// ==========================================

/**
 * GET /api/analytics/department
 * Query: year (optional)
 */
apiRouter.get('/analytics/department', (req: Request, res: Response) => {
  try {
    const { year } = req.query;
    const analytics = db.getDepartmentAnalytics(year as string);
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to compute analytics', message: err.message });
  }
});

// ==========================================
// 5. ONE AND ONLY ONE AI FEATURE:
//    "AI Coding Progress Insight"
// ==========================================

/**
 * POST /api/ai/coding-insight
 * Body: { studentId: string }
 */
apiRouter.post('/ai/coding-insight', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    const student = db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found for AI insight generation' });
    }

    const studentProjects = db.getProjects({ studentId: student.id });
    const insight = await generateAICodingInsight(student, studentProjects);

    res.json(insight);
  } catch (err: any) {
    console.error('Error generating AI coding insight:', err);
    res.status(500).json({ error: 'Failed to generate AI coding insight', message: err.message });
  }
});
