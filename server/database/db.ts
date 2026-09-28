// In-Memory Database and Store for NEXORA
// Easwari Engineering College - Department of Artificial Intelligence and Data Science

import {
  Student,
  Project,
  AcademicYear,
  SectionName,
  DepartmentAnalytics,
  TransparentReadiness,
  CodingActivityStatus,
  ProjectStatus,
} from '../models/types';

// Helper function to calculate transparent readiness (strictly rules-based, NOT AI)
export function calculateTransparentReadiness(
  totalSolved: number,
  projectsCount: number,
  certificationsCount: number,
  internshipsCount: number
): TransparentReadiness {
  // Coding contribution: max 40 points (benchmarked at 150+ problems)
  const codingPoints = Math.min(40, Math.round((totalSolved / 150) * 40));
  // Projects contribution: max 30 points (15 points per project)
  const projectPoints = Math.min(30, projectsCount * 15);
  // Certifications contribution: max 15 points (5 points per certified skill)
  const certPoints = Math.min(15, certificationsCount * 5);
  // Internship contribution: max 15 points (15 points if student completed an internship)
  const internshipPoints = Math.min(15, internshipsCount * 15);

  const totalScore = Math.min(100, codingPoints + projectPoints + certPoints + internshipPoints);

  return {
    score: totalScore,
    factors: {
      coding: codingPoints,
      projects: projectPoints,
      certifications: certPoints,
      internship: internshipPoints,
    },
  };
}

// Initial seed students
let students: Student[] = [
  {
    id: 'std-310625243001',
    registerNumber: '310625243001',
    name: 'Ananya Krishnan',
    year: 'Second Year',
    section: 'A',
    email: '310625243001@srmeaswari.ac.in',
    githubUrl: 'https://github.com/ananyakrishnan-ai',
    leetcodeUrl: 'https://leetcode.com/u/ananya_k/',
    hackerrankUrl: 'https://hackerrank.com/ananyakrishnan',
    codingStats: {
      totalSolved: 86,
      easy: 48,
      medium: 30,
      hard: 8,
      contestRating: 1560,
      acceptanceRate: 67.4,
      recentActiveDays30: 12,
      weeklyActivity: [8, 12, 14, 10, 15, 9, 11, 7],
      lastSynced: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      hackerrankBadges: 4,
      hackerrankScore: 480,
      hackerrankStatus: '5 Stars (Python), Gold Problem Solving',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-1',
        name: 'Deep Learning Specialization',
        provider: 'DeepLearning.AI / Coursera',
        date: 'August 2024',
      },
      {
        id: 'cert-2',
        name: 'Python for Data Science and AI',
        provider: 'IBM / Coursera',
        date: 'May 2024',
      },
      {
        id: 'cert-3',
        name: 'Database Management Systems with SQL',
        provider: 'NPTEL Elite',
        date: 'April 2024',
      },
    ],
    internships: [],
    transparentReadiness: {
      score: 68,
      factors: { coding: 23, projects: 30, certifications: 15, internship: 0 },
    },
    createdAt: '2023-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243002',
    registerNumber: '310625243002',
    name: 'Keerthana S',
    year: 'Second Year',
    section: 'A',
    email: '310625243002@srmeaswari.ac.in',
    githubUrl: 'https://github.com/keerthanas-code',
    leetcodeUrl: 'https://leetcode.com/u/keerthana_s/',
    hackerrankUrl: 'https://hackerrank.com/keerthana_s',
    codingStats: {
      totalSolved: 142,
      easy: 70,
      medium: 58,
      hard: 14,
      contestRating: 1685,
      acceptanceRate: 72.1,
      recentActiveDays30: 21,
      weeklyActivity: [16, 20, 18, 22, 19, 21, 14, 12],
      lastSynced: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      hackerrankBadges: 5,
      hackerrankScore: 590,
      hackerrankStatus: '6 Stars (Problem Solving), Gold C++',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-4',
        name: 'Machine Learning with PyTorch',
        provider: 'DeepLearning.AI',
        date: 'July 2024',
      },
      {
        id: 'cert-5',
        name: 'Data Structures in Java',
        provider: 'NPTEL Silver',
        date: 'March 2024',
      },
    ],
    internships: [
      {
        id: 'int-1',
        company: 'Cognizant AI Labs',
        role: 'Data Science Intern',
        duration: '2 Months (Summer 2024)',
        description: 'Assisted in building automated text summarization models using Python and HuggingFace.',
      },
    ],
    transparentReadiness: {
      score: 83,
      factors: { coding: 38, projects: 20, certifications: 10, internship: 15 },
    },
    createdAt: '2023-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243003',
    registerNumber: '310625243003',
    name: 'Harini Priya',
    year: 'Second Year',
    section: 'B',
    email: '310625243003@srmeaswari.ac.in',
    githubUrl: 'https://github.com/harinipriya-dev',
    leetcodeUrl: 'https://leetcode.com/u/harinipriya/',
    hackerrankUrl: 'https://hackerrank.com/harinipriya',
    codingStats: {
      totalSolved: 19,
      easy: 16,
      medium: 3,
      hard: 0,
      contestRating: 1390,
      acceptanceRate: 51.2,
      recentActiveDays30: 2,
      weeklyActivity: [2, 0, 1, 0, 0, 3, 1, 0],
      lastSynced: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      hackerrankBadges: 2,
      hackerrankScore: 160,
      hackerrankStatus: '2 Stars (Python)',
      codingStatus: 'Low Activity',
    },
    certifications: [
      {
        id: 'cert-6',
        name: 'Introduction to Python',
        provider: 'Coursera',
        date: 'January 2024',
      },
    ],
    internships: [],
    transparentReadiness: {
      score: 25,
      factors: { coding: 5, projects: 15, certifications: 5, internship: 0 },
    },
    createdAt: '2023-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243004',
    registerNumber: '310625243004',
    name: 'Nivetha R',
    year: 'Third Year',
    section: 'A',
    email: '310625243004@srmeaswari.ac.in',
    githubUrl: 'https://github.com/nivethar-ds',
    leetcodeUrl: 'https://leetcode.com/u/nivethar/',
    hackerrankUrl: 'https://hackerrank.com/nivethar',
    codingStats: {
      totalSolved: 235,
      easy: 95,
      medium: 110,
      hard: 30,
      contestRating: 1780,
      acceptanceRate: 74.5,
      recentActiveDays30: 24,
      weeklyActivity: [24, 28, 30, 22, 26, 25, 18, 20],
      lastSynced: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      hackerrankBadges: 6,
      hackerrankScore: 720,
      hackerrankStatus: '6 Stars (Problem Solving), Gold Java',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-7',
        name: 'AWS Certified Machine Learning - Specialty',
        provider: 'Amazon Web Services',
        date: 'June 2024',
      },
      {
        id: 'cert-8',
        name: 'TensorFlow Developer Certificate',
        provider: 'Google',
        date: 'March 2024',
      },
      {
        id: 'cert-9',
        name: 'Natural Language Processing',
        provider: 'Coursera',
        date: 'December 2023',
      },
    ],
    internships: [
      {
        id: 'int-2',
        company: 'Zoho Corporation',
        role: 'AI Research Intern',
        duration: '3 Months (Winter 2023)',
        description: 'Worked on contextual embedding search using vector databases and Milvus.',
      },
    ],
    transparentReadiness: {
      score: 95,
      factors: { coding: 40, projects: 25, certifications: 15, internship: 15 },
    },
    createdAt: '2022-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243005',
    registerNumber: '310625243005',
    name: 'Sanjana M',
    year: 'Third Year',
    section: 'B',
    email: '310625243005@srmeaswari.ac.in',
    githubUrl: 'https://github.com/sanjanam-ai',
    leetcodeUrl: 'https://leetcode.com/u/sanjanam/',
    hackerrankUrl: 'https://hackerrank.com/sanjanam',
    codingStats: {
      totalSolved: 112,
      easy: 60,
      medium: 44,
      hard: 8,
      contestRating: 1520,
      acceptanceRate: 63.8,
      recentActiveDays30: 15,
      weeklyActivity: [10, 14, 12, 11, 18, 15, 12, 8],
      lastSynced: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      hackerrankBadges: 4,
      hackerrankScore: 450,
      hackerrankStatus: '5 Stars (Python)',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-10',
        name: 'Applied Data Science with Python',
        provider: 'University of Michigan / Coursera',
        date: 'May 2024',
      },
    ],
    internships: [],
    transparentReadiness: {
      score: 55,
      factors: { coding: 30, projects: 20, certifications: 5, internship: 0 },
    },
    createdAt: '2022-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243006',
    registerNumber: '310625243006',
    name: 'Dhivya Lakshmi',
    year: 'Fourth Year',
    section: 'A',
    email: '310625243006@srmeaswari.ac.in',
    githubUrl: 'https://github.com/dhivyalakshmi-cse',
    leetcodeUrl: 'https://leetcode.com/u/dhivyalakshmi/',
    hackerrankUrl: 'https://hackerrank.com/dhivyalakshmi',
    codingStats: {
      totalSolved: 310,
      easy: 120,
      medium: 145,
      hard: 45,
      contestRating: 1845,
      acceptanceRate: 78.2,
      recentActiveDays30: 25,
      weeklyActivity: [22, 26, 29, 28, 30, 24, 25, 20],
      lastSynced: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      hackerrankBadges: 6,
      hackerrankScore: 810,
      hackerrankStatus: '6 Stars (Problem Solving), Gold Algorithms',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-11',
        name: 'Google Cloud Professional Machine Learning Engineer',
        provider: 'Google Cloud',
        date: 'February 2024',
      },
      {
        id: 'cert-12',
        name: 'Full Stack Web Development with React and Node',
        provider: 'Meta / Coursera',
        date: 'October 2023',
      },
      {
        id: 'cert-13',
        name: 'Algorithms Specialization',
        provider: 'Stanford Online',
        date: 'July 2023',
      },
    ],
    internships: [
      {
        id: 'int-3',
        company: 'PayPal India',
        role: 'Software Development Engineering Intern',
        duration: '6 Months (Jan - June 2024)',
        description: 'Engineered fraud detection pipeline integrating real-time telemetry with Spring Boot & Spark.',
      },
    ],
    transparentReadiness: {
      score: 100,
      factors: { coding: 40, projects: 30, certifications: 15, internship: 15 },
    },
    createdAt: '2021-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243007',
    registerNumber: '310625243007',
    name: 'Swetha K',
    year: 'Fourth Year',
    section: 'B',
    email: '310625243007@srmeaswari.ac.in',
    githubUrl: 'https://github.com/swethak-dev',
    leetcodeUrl: 'https://leetcode.com/u/swethak/',
    hackerrankUrl: 'https://hackerrank.com/swethak',
    codingStats: {
      totalSolved: 175,
      easy: 80,
      medium: 75,
      hard: 20,
      contestRating: 1640,
      acceptanceRate: 69.8,
      recentActiveDays30: 18,
      weeklyActivity: [14, 16, 18, 12, 19, 15, 14, 10],
      lastSynced: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      hackerrankBadges: 5,
      hackerrankScore: 560,
      hackerrankStatus: '5 Stars (Python), Gold SQL',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-14',
        name: 'Data Engineering on Google Cloud',
        provider: 'Google Cloud',
        date: 'April 2024',
      },
      {
        id: 'cert-15',
        name: 'SQL Advanced Certification',
        provider: 'HackerRank',
        date: 'November 2023',
      },
    ],
    internships: [
      {
        id: 'int-4',
        company: 'LatentView Analytics',
        role: 'Data Analyst Intern',
        duration: '3 Months (Summer 2024)',
        description: 'Developed automated SQL pipelines and Tableau dashboards for retail churn prediction.',
      },
    ],
    transparentReadiness: {
      score: 87,
      factors: { coding: 37, projects: 25, certifications: 10, internship: 15 },
    },
    createdAt: '2021-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243008',
    registerNumber: '310625243008',
    name: 'Pavithra S',
    year: 'First Year',
    section: 'A',
    email: '310625243008@srmeaswari.ac.in',
    githubUrl: 'https://github.com/pavithras-ai',
    leetcodeUrl: 'https://leetcode.com/u/pavithra_s/',
    hackerrankUrl: 'https://hackerrank.com/pavithra_s',
    codingStats: {
      totalSolved: 34,
      easy: 30,
      medium: 4,
      hard: 0,
      contestRating: 1410,
      acceptanceRate: 60.5,
      recentActiveDays30: 9,
      weeklyActivity: [4, 5, 6, 8, 4, 3, 2, 2],
      lastSynced: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      hackerrankBadges: 3,
      hackerrankScore: 280,
      hackerrankStatus: '3 Stars (C++), Silver Problem Solving',
      codingStatus: 'Moderate',
    },
    certifications: [
      {
        id: 'cert-16',
        name: 'Programming for Everybody (Python)',
        provider: 'University of Michigan',
        date: 'August 2024',
      },
    ],
    internships: [],
    transparentReadiness: {
      score: 24,
      factors: { coding: 9, projects: 10, certifications: 5, internship: 0 },
    },
    createdAt: '2024-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243009',
    registerNumber: '310625243009',
    name: 'Akshaya R',
    year: 'First Year',
    section: 'B',
    email: '310625243009@srmeaswari.ac.in',
    githubUrl: 'https://github.com/akshayar-code',
    leetcodeUrl: 'https://leetcode.com/u/akshaya_r/',
    hackerrankUrl: 'https://hackerrank.com/akshaya_r',
    codingStats: {
      totalSolved: 3,
      easy: 3,
      medium: 0,
      hard: 0,
      contestRating: 1300,
      acceptanceRate: 33.3,
      recentActiveDays30: 0,
      weeklyActivity: [0, 0, 0, 0, 0, 1, 1, 1],
      lastSynced: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      hackerrankBadges: 1,
      hackerrankScore: 60,
      hackerrankStatus: '1 Star (C)',
      codingStatus: 'Inactive',
    },
    certifications: [],
    internships: [],
    transparentReadiness: {
      score: 1,
      factors: { coding: 1, projects: 0, certifications: 0, internship: 0 },
    },
    createdAt: '2024-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243010',
    registerNumber: '310625243010',
    name: 'Bhavani P',
    year: 'First Year',
    section: 'C',
    email: '310625243010@srmeaswari.ac.in',
    githubUrl: 'https://github.com/bhavanip-tech',
    leetcodeUrl: 'https://leetcode.com/u/bhavani_p/',
    hackerrankUrl: 'https://hackerrank.com/bhavani_p',
    codingStats: {
      totalSolved: 52,
      easy: 42,
      medium: 10,
      hard: 0,
      contestRating: 1475,
      acceptanceRate: 64.0,
      recentActiveDays30: 14,
      weeklyActivity: [6, 8, 9, 10, 8, 7, 3, 1],
      lastSynced: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      hackerrankBadges: 3,
      hackerrankScore: 310,
      hackerrankStatus: '4 Stars (Python)',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-17',
        name: 'Crash Course on Python',
        provider: 'Google / Coursera',
        date: 'July 2024',
      },
    ],
    internships: [],
    transparentReadiness: {
      score: 34,
      factors: { coding: 14, projects: 15, certifications: 5, internship: 0 },
    },
    createdAt: '2024-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243011',
    registerNumber: '310625243011',
    name: 'Kavya Srinivasan',
    year: 'Second Year',
    section: 'C',
    email: '310625243011@srmeaswari.ac.in',
    githubUrl: 'https://github.com/kavyasrinivasan',
    leetcodeUrl: 'https://leetcode.com/u/kavyas/',
    hackerrankUrl: 'https://hackerrank.com/kavyas',
    codingStats: {
      totalSolved: 98,
      easy: 52,
      medium: 38,
      hard: 8,
      contestRating: 1590,
      acceptanceRate: 65.5,
      recentActiveDays30: 16,
      weeklyActivity: [11, 14, 15, 12, 16, 10, 12, 8],
      lastSynced: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      hackerrankBadges: 4,
      hackerrankScore: 490,
      hackerrankStatus: '5 Stars (C++), Gold Problem Solving',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-18',
        name: 'Data Structures and Algorithms',
        provider: 'NPTEL Elite',
        date: 'April 2024',
      },
      {
        id: 'cert-19',
        name: 'Supervised Machine Learning',
        provider: 'DeepLearning.AI',
        date: 'June 2024',
      },
    ],
    internships: [],
    transparentReadiness: {
      score: 61,
      factors: { coding: 26, projects: 25, certifications: 10, internship: 0 },
    },
    createdAt: '2023-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243012',
    registerNumber: '310625243012',
    name: 'Sowmya V',
    year: 'Second Year',
    section: 'D',
    email: '310625243012@srmeaswari.ac.in',
    githubUrl: 'https://github.com/sowmyav-ai',
    leetcodeUrl: 'https://leetcode.com/u/sowmyav/',
    hackerrankUrl: 'https://hackerrank.com/sowmyav',
    codingStats: {
      totalSolved: 8,
      easy: 8,
      medium: 0,
      hard: 0,
      contestRating: 1320,
      acceptanceRate: 42.0,
      recentActiveDays30: 1,
      weeklyActivity: [0, 1, 0, 0, 0, 0, 2, 5],
      lastSynced: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
      hackerrankBadges: 1,
      hackerrankScore: 90,
      hackerrankStatus: '2 Stars (Java)',
      codingStatus: 'Inactive',
    },
    certifications: [],
    internships: [],
    transparentReadiness: {
      score: 7,
      factors: { coding: 2, projects: 5, certifications: 0, internship: 0 },
    },
    createdAt: '2023-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243013',
    registerNumber: '310625243013',
    name: 'Aishwarya R',
    year: 'Third Year',
    section: 'C',
    email: '310625243013@srmeaswari.ac.in',
    githubUrl: 'https://github.com/aishwaryar-code',
    leetcodeUrl: 'https://leetcode.com/u/aishwarya_r/',
    hackerrankUrl: 'https://hackerrank.com/aishwarya_r',
    codingStats: {
      totalSolved: 165,
      easy: 75,
      medium: 70,
      hard: 20,
      contestRating: 1630,
      acceptanceRate: 68.9,
      recentActiveDays30: 19,
      weeklyActivity: [18, 20, 22, 17, 19, 18, 16, 15],
      lastSynced: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      hackerrankBadges: 5,
      hackerrankScore: 540,
      hackerrankStatus: '5 Stars (Python), Gold SQL',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-20',
        name: 'Machine Learning A-Z',
        provider: 'Udemy',
        date: 'January 2024',
      },
      {
        id: 'cert-21',
        name: 'Database Foundations',
        provider: 'Oracle Academy',
        date: 'October 2023',
      },
    ],
    internships: [
      {
        id: 'int-5',
        company: 'Kaar Technologies',
        role: 'SAP & Cloud Intern',
        duration: '2 Months (May - June 2024)',
        description: 'Worked on enterprise data migration and SQL verification workflows.',
      },
    ],
    transparentReadiness: {
      score: 84,
      factors: { coding: 34, projects: 25, certifications: 10, internship: 15 },
    },
    createdAt: '2022-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243014',
    registerNumber: '310625243014',
    name: 'Priyadharshini K',
    year: 'Third Year',
    section: 'D',
    email: '310625243014@srmeaswari.ac.in',
    githubUrl: 'https://github.com/priyak-ai',
    leetcodeUrl: 'https://leetcode.com/u/priyadharshini_k/',
    hackerrankUrl: 'https://hackerrank.com/priyadharshini_k',
    codingStats: {
      totalSolved: 14,
      easy: 12,
      medium: 2,
      hard: 0,
      contestRating: 1350,
      acceptanceRate: 48.0,
      recentActiveDays30: 2,
      weeklyActivity: [1, 0, 0, 2, 1, 0, 0, 1],
      lastSynced: new Date(Date.now() - 110 * 3600 * 1000).toISOString(),
      hackerrankBadges: 2,
      hackerrankScore: 140,
      hackerrankStatus: '2 Stars (C++)',
      codingStatus: 'Low Activity',
    },
    certifications: [],
    internships: [],
    transparentReadiness: {
      score: 14,
      factors: { coding: 4, projects: 10, certifications: 0, internship: 0 },
    },
    createdAt: '2022-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243015',
    registerNumber: '310625243015',
    name: 'Deepika M',
    year: 'Fourth Year',
    section: 'C',
    email: '310625243015@srmeaswari.ac.in',
    githubUrl: 'https://github.com/deepikam-tech',
    leetcodeUrl: 'https://leetcode.com/u/deepika_m/',
    hackerrankUrl: 'https://hackerrank.com/deepika_m',
    codingStats: {
      totalSolved: 285,
      easy: 105,
      medium: 140,
      hard: 40,
      contestRating: 1810,
      acceptanceRate: 75.8,
      recentActiveDays30: 23,
      weeklyActivity: [25, 26, 24, 28, 26, 22, 25, 20],
      lastSynced: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      hackerrankBadges: 6,
      hackerrankScore: 780,
      hackerrankStatus: '6 Stars (Problem Solving), Gold C++',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-22',
        name: 'Microsoft Certified: Azure AI Fundamentals',
        provider: 'Microsoft',
        date: 'March 2024',
      },
      {
        id: 'cert-23',
        name: 'Deep Learning with Computer Vision',
        provider: 'Coursera',
        date: 'September 2023',
      },
    ],
    internships: [
      {
        id: 'int-6',
        company: 'Amazon Development Centre',
        role: 'Cloud Support Associate Intern',
        duration: '6 Months (Jan - June 2024)',
        description: 'Worked with EC2, Lambda, and DynamoDB backend infrastructures.',
      },
    ],
    transparentReadiness: {
      score: 95,
      factors: { coding: 40, projects: 30, certifications: 10, internship: 15 },
    },
    createdAt: '2021-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243016',
    registerNumber: '310625243016',
    name: 'Shreya S',
    year: 'Fourth Year',
    section: 'D',
    email: '310625243016@srmeaswari.ac.in',
    githubUrl: 'https://github.com/shreyas-dev',
    leetcodeUrl: 'https://leetcode.com/u/shreya_s/',
    hackerrankUrl: 'https://hackerrank.com/shreya_s',
    codingStats: {
      totalSolved: 198,
      easy: 85,
      medium: 88,
      hard: 25,
      contestRating: 1690,
      acceptanceRate: 71.0,
      recentActiveDays30: 20,
      weeklyActivity: [18, 22, 19, 21, 24, 18, 17, 16],
      lastSynced: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      hackerrankBadges: 5,
      hackerrankScore: 610,
      hackerrankStatus: '5 Stars (Python), Gold SQL',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-24',
        name: 'TensorFlow for Artificial Intelligence',
        provider: 'DeepLearning.AI',
        date: 'November 2023',
      },
    ],
    internships: [
      {
        id: 'int-7',
        company: 'Tata Consultancy Services',
        role: 'Software Intern',
        duration: '2 Months (May - July 2024)',
        description: 'Designed microservices in Java Spring Boot with MySQL integration.',
      },
    ],
    transparentReadiness: {
      score: 85,
      factors: { coding: 40, projects: 25, certifications: 5, internship: 15 },
    },
    createdAt: '2021-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243017',
    registerNumber: '310625243017',
    name: 'Meenakshi R',
    year: 'First Year',
    section: 'D',
    email: '310625243017@srmeaswari.ac.in',
    githubUrl: 'https://github.com/meenakshir-code',
    leetcodeUrl: 'https://leetcode.com/u/meenakshi_r/',
    hackerrankUrl: 'https://hackerrank.com/meenakshi_r',
    codingStats: {
      totalSolved: 41,
      easy: 35,
      medium: 6,
      hard: 0,
      contestRating: 1430,
      acceptanceRate: 61.2,
      recentActiveDays30: 11,
      weeklyActivity: [5, 7, 6, 8, 5, 4, 3, 3],
      lastSynced: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      hackerrankBadges: 3,
      hackerrankScore: 260,
      hackerrankStatus: '3 Stars (Python)',
      codingStatus: 'Moderate',
    },
    certifications: [
      {
        id: 'cert-25',
        name: 'Problem Solving (Basic)',
        provider: 'HackerRank',
        date: 'August 2024',
      },
    ],
    internships: [],
    transparentReadiness: {
      score: 26,
      factors: { coding: 11, projects: 10, certifications: 5, internship: 0 },
    },
    createdAt: '2024-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243018',
    registerNumber: '310625243018',
    name: 'Vaishnavi P',
    year: 'Second Year',
    section: 'B',
    email: '310625243018@srmeaswari.ac.in',
    githubUrl: 'https://github.com/vaishnavip-ai',
    leetcodeUrl: 'https://leetcode.com/u/vaishnavi_p/',
    hackerrankUrl: 'https://hackerrank.com/vaishnavi_p',
    codingStats: {
      totalSolved: 74,
      easy: 45,
      medium: 24,
      hard: 5,
      contestRating: 1530,
      acceptanceRate: 62.9,
      recentActiveDays30: 13,
      weeklyActivity: [9, 11, 10, 8, 12, 9, 8, 7],
      lastSynced: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
      hackerrankBadges: 4,
      hackerrankScore: 420,
      hackerrankStatus: '4 Stars (Java), Silver Problem Solving',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-26',
        name: 'Machine Learning Foundations',
        provider: 'University of Washington',
        date: 'May 2024',
      },
    ],
    internships: [],
    transparentReadiness: {
      score: 45,
      factors: { coding: 20, projects: 20, certifications: 5, internship: 0 },
    },
    createdAt: '2023-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243019',
    registerNumber: '310625243019',
    name: 'Abinaya S',
    year: 'Third Year',
    section: 'A',
    email: '310625243019@srmeaswari.ac.in',
    githubUrl: 'https://github.com/abinayas-ds',
    leetcodeUrl: 'https://leetcode.com/u/abinaya_s/',
    hackerrankUrl: 'https://hackerrank.com/abinaya_s',
    codingStats: {
      totalSolved: 138,
      easy: 66,
      medium: 58,
      hard: 14,
      contestRating: 1615,
      acceptanceRate: 66.8,
      recentActiveDays30: 17,
      weeklyActivity: [14, 18, 17, 21, 19, 16, 15, 12],
      lastSynced: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
      hackerrankBadges: 5,
      hackerrankScore: 510,
      hackerrankStatus: '5 Stars (Problem Solving), Gold Python',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-27',
        name: 'Natural Language Processing with Attention Models',
        provider: 'DeepLearning.AI',
        date: 'February 2024',
      },
      {
        id: 'cert-28',
        name: 'PostgreSQL Essential Training',
        provider: 'LinkedIn Learning',
        date: 'October 2023',
      },
    ],
    internships: [],
    transparentReadiness: {
      score: 67,
      factors: { coding: 37, projects: 20, certifications: 10, internship: 0 },
    },
    createdAt: '2022-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243020',
    registerNumber: '310625243020',
    name: 'Janani K',
    year: 'Fourth Year',
    section: 'A',
    email: '310625243020@srmeaswari.ac.in',
    githubUrl: 'https://github.com/jananik-dev',
    leetcodeUrl: 'https://leetcode.com/u/janani_k/',
    hackerrankUrl: 'https://hackerrank.com/janani_k',
    codingStats: {
      totalSolved: 245,
      easy: 100,
      medium: 115,
      hard: 30,
      contestRating: 1765,
      acceptanceRate: 73.0,
      recentActiveDays30: 22,
      weeklyActivity: [22, 24, 25, 26, 28, 20, 21, 18],
      lastSynced: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      hackerrankBadges: 6,
      hackerrankScore: 740,
      hackerrankStatus: '6 Stars (Problem Solving), Gold Java',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-29',
        name: 'AWS Certified Solutions Architect - Associate',
        provider: 'Amazon Web Services',
        date: 'December 2023',
      },
      {
        id: 'cert-30',
        name: 'Spring Boot Microservices',
        provider: 'Udemy',
        date: 'August 2023',
      },
    ],
    internships: [
      {
        id: 'int-8',
        company: 'HCL Tech',
        role: 'Cloud Engineering Intern',
        duration: '4 Months (Jan - April 2024)',
        description: 'Built automated CI/CD pipelines with GitHub Actions and AWS ECS.',
      },
    ],
    transparentReadiness: {
      score: 95,
      factors: { coding: 40, projects: 30, certifications: 10, internship: 15 },
    },
    createdAt: '2021-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243021',
    registerNumber: '310625243021',
    name: 'Karthik R',
    year: 'Third Year',
    section: 'B',
    email: '310625243021@srmeaswari.ac.in',
    githubUrl: 'https://github.com/karthikr-coder',
    leetcodeUrl: 'https://leetcode.com/u/karthik_r/',
    hackerrankUrl: 'https://hackerrank.com/karthik_r',
    codingStats: {
      totalSolved: 185,
      easy: 80,
      medium: 85,
      hard: 20,
      contestRating: 1675,
      acceptanceRate: 70.4,
      recentActiveDays30: 20,
      weeklyActivity: [18, 21, 19, 23, 20, 17, 18, 14],
      lastSynced: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
      hackerrankBadges: 5,
      hackerrankScore: 590,
      hackerrankStatus: '5 Stars (Python), Gold C++',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-31',
        name: 'Deep Learning Specialization',
        provider: 'DeepLearning.AI',
        date: 'January 2024',
      },
    ],
    internships: [],
    transparentReadiness: {
      score: 69,
      factors: { coding: 39, projects: 25, certifications: 5, internship: 0 },
    },
    createdAt: '2022-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243022',
    registerNumber: '310625243022',
    name: 'Vignesh S',
    year: 'Second Year',
    section: 'A',
    email: '310625243022@srmeaswari.ac.in',
    githubUrl: 'https://github.com/vigneshs-ai',
    leetcodeUrl: 'https://leetcode.com/u/vignesh_s/',
    hackerrankUrl: 'https://hackerrank.com/vignesh_s',
    codingStats: {
      totalSolved: 2,
      easy: 2,
      medium: 0,
      hard: 0,
      contestRating: 1250,
      acceptanceRate: 25.0,
      recentActiveDays30: 0,
      weeklyActivity: [0, 0, 0, 0, 0, 0, 1, 1],
      lastSynced: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
      hackerrankBadges: 1,
      hackerrankScore: 50,
      hackerrankStatus: '1 Star (Python)',
      codingStatus: 'Inactive',
    },
    certifications: [],
    internships: [],
    transparentReadiness: {
      score: 1,
      factors: { coding: 1, projects: 0, certifications: 0, internship: 0 },
    },
    createdAt: '2023-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243023',
    registerNumber: '310625243023',
    name: 'Ashwin Kumar',
    year: 'Fourth Year',
    section: 'B',
    email: '310625243023@srmeaswari.ac.in',
    githubUrl: 'https://github.com/ashwinkumar-ds',
    leetcodeUrl: 'https://leetcode.com/u/ashwin_k/',
    hackerrankUrl: 'https://hackerrank.com/ashwin_k',
    codingStats: {
      totalSolved: 215,
      easy: 90,
      medium: 98,
      hard: 27,
      contestRating: 1725,
      acceptanceRate: 72.5,
      recentActiveDays30: 21,
      weeklyActivity: [20, 22, 24, 21, 25, 19, 18, 16],
      lastSynced: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      hackerrankBadges: 5,
      hackerrankScore: 680,
      hackerrankStatus: '6 Stars (Problem Solving), Gold Python',
      codingStatus: 'Active',
    },
    certifications: [
      {
        id: 'cert-32',
        name: 'Databricks Certified Associate Developer for Apache Spark',
        provider: 'Databricks',
        date: 'May 2024',
      },
    ],
    internships: [
      {
        id: 'int-9',
        company: 'Mu Sigma Inc.',
        role: 'Trainee Decision Scientist',
        duration: '3 Months (June - August 2024)',
        description: 'Analyzed supply chain telemetry and optimized warehouse inventory algorithms.',
      },
    ],
    transparentReadiness: {
      score: 90,
      factors: { coding: 40, projects: 30, certifications: 5, internship: 15 },
    },
    createdAt: '2021-08-15T09:00:00.000Z',
  },
  {
    id: 'std-310625243024',
    registerNumber: '310625243024',
    name: 'Dinesh M',
    year: 'First Year',
    section: 'A',
    email: '310625243024@srmeaswari.ac.in',
    githubUrl: 'https://github.com/dineshm-code',
    leetcodeUrl: 'https://leetcode.com/u/dinesh_m/',
    hackerrankUrl: 'https://hackerrank.com/dinesh_m',
    codingStats: {
      totalSolved: 48,
      easy: 40,
      medium: 8,
      hard: 0,
      contestRating: 1460,
      acceptanceRate: 63.1,
      recentActiveDays30: 13,
      weeklyActivity: [6, 7, 8, 9, 7, 5, 4, 2],
      lastSynced: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
      hackerrankBadges: 3,
      hackerrankScore: 290,
      hackerrankStatus: '3 Stars (C++), Silver Problem Solving',
      codingStatus: 'Moderate',
    },
    certifications: [
      {
        id: 'cert-33',
        name: 'Python Data Structures',
        provider: 'University of Michigan',
        date: 'July 2024',
      },
    ],
    internships: [],
    transparentReadiness: {
      score: 33,
      factors: { coding: 13, projects: 15, certifications: 5, internship: 0 },
    },
    createdAt: '2024-08-15T09:00:00.000Z',
  },
];

// Initial projects seed
let projects: Project[] = [
  {
    id: 'proj-1',
    studentId: 'std-310625243001',
    studentName: 'Ananya Krishnan',
    registerNumber: '310625243001',
    year: 'Second Year',
    section: 'A',
    title: 'Autonomous Plant Disease Detection using MobileNetV3',
    description:
      'A deep learning computer vision system trained on the PlantVillage dataset to detect leaf blight and bacterial spot with 96.4% validation accuracy on edge devices.',
    techStack: ['Python', 'TensorFlow', 'OpenCV', 'FastAPI', 'React'],
    githubUrl: 'https://github.com/ananyakrishnan-ai/plant-disease-ai',
    liveDemoUrl: 'https://plant-disease-demo.easwari-ai.org',
    documentation:
      'Complete project documentation including model training logs, confusion matrix, API specs, and React deployment guide. Uploaded as PDF / Markdown architecture spec.',
    docFileName: 'Plant_Disease_Detection_SRS_v2.pdf',
    status: 'Approved',
    submissionDate: '2024-08-20',
    reviewNotes:
      'Well-architected model pipeline and crisp API documentation. Excellent use of lightweight MobileNet architecture for college farm testing.',
    reviewerName: 'Dr. A. Saravanan (HOD)',
    lastUpdated: '2024-08-25',
  },
  {
    id: 'proj-2',
    studentId: 'std-310625243001',
    studentName: 'Ananya Krishnan',
    registerNumber: '310625243001',
    year: 'Second Year',
    section: 'A',
    title: 'Multi-Modal Student Engagement Sentiment Analyzer',
    description:
      'Real-time lecture feedback analyzer combining audio tone and text comments using BERT and HuggingFace transformers for faculty teaching insights.',
    techStack: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'TailwindCSS'],
    githubUrl: 'https://github.com/ananyakrishnan-ai/student-sentiment-lens',
    documentation:
      'System design document explaining the transformer fine-tuning approach, tokenization pipeline, and privacy safeguards for classroom audio.',
    docFileName: 'Engagement_Analyzer_Architecture_Doc.pdf',
    status: 'Under Review',
    submissionDate: '2024-09-12',
    reviewNotes: 'Under review by Department Project Evaluation Committee.',
    reviewerName: 'Prof. Vignesh K',
    lastUpdated: '2024-09-15',
  },
  {
    id: 'proj-3',
    studentId: 'std-310625243002',
    studentName: 'Keerthana S',
    registerNumber: '310625243002',
    year: 'Second Year',
    section: 'A',
    title: 'Intelligent Traffic Signal Optimizer using Q-Learning',
    description:
      'Reinforcement learning simulation built in SUMO to dynamically adjust green light timers based on vehicle queue lengths at congested Chennai junctions.',
    techStack: ['Python', 'SUMO Simulator', 'PyTorch', 'Gymnasium', 'Flask'],
    githubUrl: 'https://github.com/keerthanas-code/rl-traffic-control',
    documentation: 'Research report and test benchmarks comparing fixed timers against Q-learning reward functions.',
    docFileName: 'Traffic_RL_SUMO_Benchmark.pdf',
    status: 'Completed',
    submissionDate: '2024-07-15',
    reviewNotes: 'Outstanding simulation results. Selected for departmental symposium showcase.',
    reviewerName: 'Dr. A. Saravanan (HOD)',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'proj-4',
    studentId: 'std-310625243004',
    studentName: 'Nivetha R',
    registerNumber: '310625243004',
    year: 'Third Year',
    section: 'A',
    title: 'Federated Learning Framework for Medical Imaging Privacy',
    description:
      'Decentralized model training framework allowing multi-hospital chest X-ray classification without raw patient data leaving local premises.',
    techStack: ['Python', 'PySyft', 'PyTorch', 'Docker', 'FastAPI'],
    githubUrl: 'https://github.com/nivethar-ds/federated-medxray',
    documentation: 'Cryptographic differential privacy guarantee proofs and model convergence graphs.',
    docFileName: 'Federated_Healthcare_Whitepaper.pdf',
    status: 'Approved',
    submissionDate: '2024-08-05',
    reviewNotes: 'Impressive implementation of differential privacy. Keep documenting deployment instructions.',
    reviewerName: 'Prof. Vignesh K',
    lastUpdated: '2024-08-18',
  },
  {
    id: 'proj-5',
    studentId: 'std-310625243006',
    studentName: 'Dhivya Lakshmi',
    registerNumber: '310625243006',
    year: 'Fourth Year',
    section: 'A',
    title: 'Enterprise AI Telemetry & Automated Log Root-Cause Engine',
    description:
      'Production-scale distributed log parser using BERT sentence embeddings, Milvus vector DB, and automated incident ticket triage for DevOps teams.',
    techStack: ['Java', 'Spring Boot', 'Python', 'Kafka', 'Milvus', 'React'],
    githubUrl: 'https://github.com/dhivyalakshmi-cse/ai-ops-log-engine',
    liveDemoUrl: 'https://aiops-telemetry.easwari-ai.org',
    documentation: 'Full Capstone SRS, microservices architecture diagram, and load-testing report.',
    docFileName: 'Capstone_Final_Report_Dhivya.pdf',
    status: 'Completed',
    submissionDate: '2024-06-10',
    reviewNotes: 'Grade: O (Outstanding). Verified capstone submission with industry mentorship.',
    reviewerName: 'Dr. A. Saravanan (HOD)',
    lastUpdated: '2024-07-02',
  },
  {
    id: 'proj-6',
    studentId: 'std-310625243007',
    studentName: 'Swetha K',
    registerNumber: '310625243007',
    year: 'Fourth Year',
    section: 'B',
    title: 'Predictive Churn Analytics Pipeline with Automated ETL',
    description:
      'End-to-end data pipeline extracting customer transaction records, computing feature stores, and predicting churn risk using XGBoost.',
    techStack: ['Python', 'SQL', 'PostgreSQL', 'Airflow', 'Scikit-Learn', 'Streamlit'],
    githubUrl: 'https://github.com/swethak-dev/churn-predictive-etl',
    documentation: 'Database schema diagrams, ETL pipeline scheduling documentation, and accuracy metrics.',
    docFileName: 'Churn_ETL_Documentation.pdf',
    status: 'Approved',
    submissionDate: '2024-08-14',
    reviewNotes: 'Solid data engineering implementation. Good documentation of pipeline fault tolerance.',
    reviewerName: 'Prof. Vignesh K',
    lastUpdated: '2024-08-28',
  },
  {
    id: 'proj-7',
    studentId: 'std-310625243003',
    studentName: 'Harini Priya',
    registerNumber: '310625243003',
    year: 'Second Year',
    section: 'B',
    title: 'Campus Lost and Found Portal with Image Tagging',
    description:
      'Web application for students to report lost items on campus with automatic category tagging using a lightweight image classifier.',
    techStack: ['Python', 'Flask', 'SQLite', 'HTML/CSS', 'JavaScript'],
    githubUrl: 'https://github.com/harinipriya-dev/campus-lost-found',
    documentation: 'Initial project proposal and database schema sketch.',
    docFileName: 'Project_Proposal_Harini.docx',
    status: 'Needs Changes',
    submissionDate: '2024-09-02',
    reviewNotes:
      'Please migrate the classifier from mock static labels to a real pre-trained MobileNet model and add authentication.',
    reviewerName: 'Prof. Vignesh K',
    lastUpdated: '2024-09-08',
  },
  {
    id: 'proj-8',
    studentId: 'std-310625243011',
    studentName: 'Kavya Srinivasan',
    registerNumber: '310625243011',
    year: 'Second Year',
    section: 'C',
    title: 'AI Resume Keyword Matcher and Skill Gap Analyzer',
    description:
      'NLP tool analyzing student resumes against software engineering job descriptions using TF-IDF and word embeddings to recommend missing skills.',
    techStack: ['Python', 'Spacy', 'FastAPI', 'React', 'TailwindCSS'],
    githubUrl: 'https://github.com/kavyasrinivasan/resume-skill-matcher',
    documentation: 'Detailed documentation of parsing pipeline, PDF text extraction, and cosine similarity formulas.',
    docFileName: 'Resume_Matcher_Architecture.pdf',
    status: 'Submitted',
    submissionDate: '2024-09-18',
    reviewNotes: 'Submitted for Phase 1 review.',
    lastUpdated: '2024-09-18',
  },
  {
    id: 'proj-9',
    studentId: 'std-310625243008',
    studentName: 'Pavithra S',
    registerNumber: '310625243008',
    year: 'First Year',
    section: 'A',
    title: 'Interactive Python Algorithm Visualizer for Beginners',
    description:
      'Visual step-by-step debugger for sorting algorithms (Bubble, Insertion, Quick Sort) designed for first-year lab practice.',
    techStack: ['Python', 'Pygame', 'Tkinter'],
    githubUrl: 'https://github.com/pavithras-ai/sorting-visualizer',
    documentation: 'User manual and flowchart of visual rendering algorithm.',
    docFileName: 'Algo_Visualizer_Manual.pdf',
    status: 'Submitted',
    submissionDate: '2024-09-10',
    reviewNotes: 'First year miniproject submission received.',
    lastUpdated: '2024-09-10',
  },
  {
    id: 'proj-10',
    studentId: 'std-310625243015',
    studentName: 'Deepika M',
    registerNumber: '310625243015',
    year: 'Fourth Year',
    section: 'C',
    title: 'Real-Time Driver Drowsiness and Distraction Detection',
    description:
      'Edge-deployed AI camera application using facial landmark detection, eye aspect ratio (EAR), and mouth aspect ratio (MAR) with audio alarms.',
    techStack: ['Python', 'OpenCV', 'Dlib', 'Raspberry Pi', 'Flask'],
    githubUrl: 'https://github.com/deepikam-tech/driver-drowsiness-alert',
    documentation: 'Hardware integration diagram, EAR/MAR threshold tuning logs, and real-car testing results.',
    docFileName: 'Drowsiness_Alert_Final_Thesis.pdf',
    status: 'Completed',
    submissionDate: '2024-05-20',
    reviewNotes: 'Successfully field-tested on college van route. High practical value.',
    reviewerName: 'Dr. A. Saravanan (HOD)',
    lastUpdated: '2024-06-15',
  },
];

// Data access methods
export const db = {
  // Students
  getStudents(filter?: {
    year?: string;
    section?: string;
    codingStatus?: string;
    search?: string;
  }): Student[] {
    let list = [...students];

    if (filter?.year && filter.year !== 'All') {
      list = list.filter((s) => s.year === filter.year);
    }
    if (filter?.section && filter.section !== 'All') {
      list = list.filter((s) => s.section === filter.section);
    }
    if (filter?.codingStatus && filter.codingStatus !== 'All') {
      list = list.filter((s) => s.codingStats.codingStatus === filter.codingStatus);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.registerNumber.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getStudentById(id: string): Student | undefined {
    return students.find((s) => s.id === id || s.registerNumber === id);
  },

  updateStudent(id: string, updates: Partial<Student>): Student | undefined {
    const idx = students.findIndex((s) => s.id === id || s.registerNumber === id);
    if (idx === -1) return undefined;

    students[idx] = {
      ...students[idx],
      ...updates,
      codingStats: {
        ...students[idx].codingStats,
        ...(updates.codingStats || {}),
      },
    };

    // Recompute transparent readiness
    const st = students[idx];
    const studentProjects = projects.filter((p) => p.studentId === st.id);
    st.transparentReadiness = calculateTransparentReadiness(
      st.codingStats.totalSolved,
      studentProjects.length,
      st.certifications.length,
      st.internships.length
    );

    return students[idx];
  },

  // Projects
  getProjects(filter?: {
    year?: string;
    section?: string;
    status?: string;
    studentId?: string;
    search?: string;
  }): Project[] {
    let list = [...projects];

    if (filter?.studentId) {
      list = list.filter((p) => p.studentId === filter.studentId);
    }
    if (filter?.year && filter.year !== 'All') {
      list = list.filter((p) => p.year === filter.year);
    }
    if (filter?.section && filter.section !== 'All') {
      list = list.filter((p) => p.section === filter.section);
    }
    if (filter?.status && filter.status !== 'All') {
      list = list.filter((p) => p.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.studentName.toLowerCase().includes(q) ||
          p.registerNumber.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  },

  getProjectById(id: string): Project | undefined {
    return projects.find((p) => p.id === id);
  },

  addProject(projectData: Omit<Project, 'id' | 'lastUpdated'>): Project {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    projects.unshift(newProject);

    // Update student's transparent readiness
    const student = students.find((s) => s.id === newProject.studentId);
    if (student) {
      const studentProjects = projects.filter((p) => p.studentId === student.id);
      student.transparentReadiness = calculateTransparentReadiness(
        student.codingStats.totalSolved,
        studentProjects.length,
        student.certifications.length,
        student.internships.length
      );
    }

    return newProject;
  },

  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;

    projects[idx] = {
      ...projects[idx],
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    return projects[idx];
  },

  // Department-Level Analytics
  getDepartmentAnalytics(yearFilter?: string): DepartmentAnalytics {
    let filteredStudents = [...students];
    if (yearFilter && yearFilter !== 'All') {
      filteredStudents = filteredStudents.filter((s) => s.year === yearFilter);
    }

    let filteredProjects = [...projects];
    if (yearFilter && yearFilter !== 'All') {
      filteredProjects = filteredProjects.filter((p) => p.year === yearFilter);
    }

    const totalStudents = filteredStudents.length;

    const yearCounts = {
      firstYear: students.filter((s) => s.year === 'First Year').length,
      secondYear: students.filter((s) => s.year === 'Second Year').length,
      thirdYear: students.filter((s) => s.year === 'Third Year').length,
      fourthYear: students.filter((s) => s.year === 'Fourth Year').length,
    };

    let activeCoders = 0;
    let moderateCoders = 0;
    let lowCoders = 0;
    let inactiveCoders = 0;
    let totalProblemsSolved = 0;
    let highestProblemsSolved = 0;
    let easyTotal = 0;
    let mediumTotal = 0;
    let hardTotal = 0;

    for (const s of filteredStudents) {
      const cs = s.codingStats;
      totalProblemsSolved += cs.totalSolved;
      if (cs.totalSolved > highestProblemsSolved) {
        highestProblemsSolved = cs.totalSolved;
      }

      easyTotal += cs.easy;
      mediumTotal += cs.medium;
      hardTotal += cs.hard;

      if (cs.codingStatus === 'Active') activeCoders++;
      else if (cs.codingStatus === 'Moderate') moderateCoders++;
      else if (cs.codingStatus === 'Low Activity') lowCoders++;
      else if (cs.codingStatus === 'Inactive') inactiveCoders++;
    }

    const averageProblemsSolved =
      totalStudents > 0 ? Math.round(totalProblemsSolved / totalStudents) : 0;

    const studentsNeedingAttentionCount = filteredStudents.filter(
      (s) => s.codingStats.codingStatus === 'Inactive' || s.codingStats.codingStatus === 'Low Activity'
    ).length;

    const totalProjects = filteredProjects.length;
    const completedProjects = filteredProjects.filter((p) => p.status === 'Completed').length;
    const approvedProjects = filteredProjects.filter((p) => p.status === 'Approved').length;
    const pendingProjects = filteredProjects.filter(
      (p) => p.status === 'Submitted' || p.status === 'Under Review' || p.status === 'Needs Changes'
    ).length;

    const projectStatusDistribution: Record<ProjectStatus, number> = {
      Draft: filteredProjects.filter((p) => p.status === 'Draft').length,
      Submitted: filteredProjects.filter((p) => p.status === 'Submitted').length,
      'Under Review': filteredProjects.filter((p) => p.status === 'Under Review').length,
      Approved: approvedProjects,
      'Needs Changes': filteredProjects.filter((p) => p.status === 'Needs Changes').length,
      Completed: completedProjects,
    };

    // Year-wise coding averages (across all students in that year)
    const computeYearAvg = (yr: AcademicYear) => {
      const list = students.filter((s) => s.year === yr);
      if (list.length === 0) return 0;
      const sum = list.reduce((acc, curr) => acc + curr.codingStats.totalSolved, 0);
      return Math.round(sum / list.length);
    };

    return {
      totalStudents,
      yearCounts,
      activeCodersCount: activeCoders,
      moderateCodersCount: moderateCoders,
      lowCodersCount: lowCoders,
      inactiveCodersCount: inactiveCoders,
      studentsNeedingAttentionCount,
      averageProblemsSolved,
      highestProblemsSolved,
      totalProjects,
      completedProjects,
      pendingProjects,
      approvedProjects,
      difficultyDistribution: {
        easyTotal,
        mediumTotal,
        hardTotal,
      },
      yearWiseCodingAverage: {
        firstYear: computeYearAvg('First Year'),
        secondYear: computeYearAvg('Second Year'),
        thirdYear: computeYearAvg('Third Year'),
        fourthYear: computeYearAvg('Fourth Year'),
      },
      projectStatusDistribution,
    };
  },
};
