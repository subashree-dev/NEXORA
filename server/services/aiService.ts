// NEXORA - AI Service
// Implements the ONE AND ONLY ONE AI Feature: "AI Coding Progress Insight"
// Powered by Gemini 3.8 Flash via @google/genai SDK (Server-Side Only)

import { GoogleGenAI, Type } from '@google/genai';
import { AICodingInsightResponse, Student, Project } from '../models/types';

// Server-side Gemini client initialization with recommended User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Generates an AI Coding Progress Insight for a student.
 * 
 * STRICT GUIDELINES:
 * - Generates:
 *   1. Coding Performance Summary
 *   2. Strengths
 *   3. Areas for Improvement
 *   4. Suggested Coding Practice
 * - NEVER predicts job placement or employability.
 * - NEVER assigns unexplained placement probability or sensitive labels.
 * - Focuses strictly on technical skill progression, algorithmic complexity, and study roadmaps.
 */
export async function generateAICodingInsight(
  student: Student,
  studentProjects: Project[]
): Promise<AICodingInsightResponse> {
  const { codingStats, certifications, name, registerNumber, year } = student;

  const promptInput = `
Student Information:
Name: ${name}
Register Number: ${registerNumber}
Department: Artificial Intelligence and Data Science (Easwari Engineering College)
Academic Year: ${year}

Coding Track Record:
Total LeetCode Problems Solved: ${codingStats.totalSolved}
- Easy: ${codingStats.easy}
- Medium: ${codingStats.medium}
- Hard: ${codingStats.hard}
LeetCode Contest Rating: ${codingStats.contestRating}
Acceptance Rate: ${codingStats.acceptanceRate}%
Recent Activity: Active on ${codingStats.recentActiveDays30} of the last 30 days
HackerRank Badges/Status: ${codingStats.hackerrankStatus} (Score: ${codingStats.hackerrankScore})

Academic Portfolio:
Projects Submitted: ${studentProjects.length} (${studentProjects.map((p) => p.title).join(', ') || 'None'})
Certifications Earned: ${certifications.length} (${certifications.map((c) => `${c.name} [${c.provider}]`).join(', ') || 'None'} )
`;

  // If Gemini client is configured and API key exists, call Gemini 3.8 Flash
  if (ai && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptInput,
        config: {
          systemInstruction: `You are an expert AI & Data Science faculty mentor at Easwari Engineering College.
Analyze the student's coding metrics, algorithmic breadth, and project work.
You MUST provide constructive, practical academic guidance strictly in JSON format matching the schema.

STRICT ETHICAL CONSTRAINTS:
1. Do NOT predict whether the student will get a job or placement.
2. Do NOT assign any placement probability or employment likelihood.
3. Do NOT make sensitive personal judgments.
4. Focus exclusively on coding progression, data structures, algorithm problem-solving depth, and actionable study recommendations.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              performanceSummary: {
                type: Type.STRING,
                description: 'A 2-3 sentence technical overview of the student’s problem-solving trajectory and consistency.',
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of 3 distinct technical strengths observed from their numbers and stacks.',
              },
              areasForImprovement: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of 3 specific technical areas where the student should focus next.',
              },
              suggestedPractice: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    topic: { type: Type.STRING },
                    targetProblems: { type: Type.STRING },
                    rationale: { type: Type.STRING },
                  },
                  required: ['topic', 'targetProblems', 'rationale'],
                },
                description: '3 recommended practice modules (e.g. Graph Algorithms, Dynamic Programming, Two Pointers).',
              },
              weeklyScheduleSuggestion: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4 actionable weekly routine checkpoints.',
              },
            },
            required: [
              'performanceSummary',
              'strengths',
              'areasForImprovement',
              'suggestedPractice',
              'weeklyScheduleSuggestion',
            ],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return {
          studentName: name,
          registerNumber,
          year,
          generatedAt: new Date().toISOString(),
          performanceSummary: parsed.performanceSummary,
          strengths: parsed.strengths || [],
          areasForImprovement: parsed.areasForImprovement || [],
          suggestedPractice: parsed.suggestedPractice || [],
          weeklyScheduleSuggestion: parsed.weeklyScheduleSuggestion || [],
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, using fallback insight engine:', err);
    }
  }

  // Pedagogical fallback generator ensuring the demonstration flow always works flawlessly
  return generateDeterministicInsight(student, studentProjects);
}

/**
 * Deterministic fallback based on student metrics
 * Keeps response academically grounded and consistent even if offline
 */
function generateDeterministicInsight(student: Student, studentProjects: Project[]): AICodingInsightResponse {
  const { codingStats, name, registerNumber, year } = student;
  const isHigh = codingStats.totalSolved >= 150;
  const isModerate = codingStats.totalSolved >= 50 && codingStats.totalSolved < 150;
  const isBeginner = codingStats.totalSolved < 50;

  let performanceSummary = '';
  let strengths: string[] = [];
  let areasForImprovement: string[] = [];
  let suggestedPractice: { topic: string; targetProblems: string; rationale: string }[] = [];
  let weeklyScheduleSuggestion: string[] = [];

  if (isHigh) {
    performanceSummary = `${name} demonstrates an exemplary algorithmic foundation with ${codingStats.totalSolved} solved problems, including ${codingStats.hard} hard-level challenges and a competitive contest rating of ${codingStats.contestRating}. Coding activity is consistent across ${codingStats.recentActiveDays30} of the last 30 days.`;
    strengths = [
      `High Medium/Hard problem ratio (${codingStats.medium + codingStats.hard} problems), reflecting comfort with non-trivial algorithmic puzzles.`,
      `Strong algorithmic discipline with consistent daily streaks (${codingStats.recentActiveDays30} active days in past month).`,
      `Competitive contest rating (${codingStats.contestRating}) signaling capability under timed examination conditions.`,
    ];
    areasForImprovement = [
      'Transition from standard LeetCode problems to complex dynamic programming state transitions and tree DP.',
      'Incorporate graph flow and segment tree optimizations relevant to AI & Data Science matrix computations.',
      'Tie theoretical algorithmic mastery directly into production latency optimizations in capstone projects.',
    ];
    suggestedPractice = [
      {
        topic: 'Advanced Dynamic Programming',
        targetProblems: '10 Medium/Hard problems (State-compression & Knapsack variations)',
        rationale: 'Solidifies optimal substructure problem decomposition for large-scale optimization.',
      },
      {
        topic: 'Graph Algorithms & Shortest Path',
        targetProblems: '8 Medium problems (Dijkstra, Bellman-Ford, Tarjan’s SCC)',
        rationale: 'Essential for relational graph neural networks and network flow modeling.',
      },
      {
        topic: 'Monotonic Stack & Deque',
        targetProblems: '6 Medium problems (Sliding Window Maximum, Next Greater Element)',
        rationale: 'Sharpens linear-time data extraction common in real-time stream processing.',
      },
    ];
    weeklyScheduleSuggestion = [
      'Mon & Wed: 2 Medium LeetCode problems focusing on DP and Graph traversals.',
      'Fri: 1 Hard challenge simulating coding assessment conditions.',
      'Sat: Participate in LeetCode / HackerRank weekend weekly contest (90 minutes).',
      'Sun: Code review and benchmark analysis of weekly submissions.',
    ];
  } else if (isModerate) {
    performanceSummary = `${name} has established a reliable coding cadence with ${codingStats.totalSolved} total problems solved (${codingStats.easy} Easy, ${codingStats.medium} Medium, ${codingStats.hard} Hard). Active on ${codingStats.recentActiveDays30} days in the last month with solid foundational problem solving.`;
    strengths = [
      `Solid foundation in fundamental array, string, and hash table manipulations (${codingStats.easy} Easy solved).`,
      `Promising progression into Medium difficulty problems (${codingStats.medium} solved) demonstrating growing analytical confidence.`,
      `Steady participation on HackerRank (${codingStats.hackerrankStatus}).`,
    ];
    areasForImprovement = [
      'Increase the proportion of Medium-tier problems relative to Easy-tier problems to build competitive depth.',
      'Reinforce recurring data structure paradigms: Binary Search on answer space, Fast & Slow Pointers, and Recursion.',
      'Gradually increase active coding days from ${codingStats.recentActiveDays30} to 18-20 days per month.',
    ];
    suggestedPractice = [
      {
        topic: 'Two Pointers & Sliding Window',
        targetProblems: '8 Medium problems (Longest Substring without Repeating Characters, 3Sum)',
        rationale: 'Builds intuition for reducing brute-force O(N²) time complexities to O(N).',
      },
      {
        topic: 'Binary Search Variations',
        targetProblems: '6 Medium problems (Search in Rotated Sorted Array, Find Peak Element)',
        rationale: 'Key pattern for logarithmic search spaces in big data queries.',
      },
      {
        topic: 'Binary Trees & BFS/DFS Traversal',
        targetProblems: '8 Medium problems (Level Order Traversal, Lowest Common Ancestor)',
        rationale: 'Fundamental for understanding hierarchical models and decision trees.',
      },
    ];
    weeklyScheduleSuggestion = [
      'Tuesday: Solve 1 Array/String Medium problem with time-complexity analysis.',
      'Thursday: Solve 1 Tree/Recursion Medium problem.',
      'Saturday: Dedicate 2 hours to 2 problems in a mock timed session.',
      'Sunday: Review project code repositories and apply clean modular coding patterns.',
    ];
  } else {
    performanceSummary = `${name} has an initial footprint of ${codingStats.totalSolved} solved problems. With only ${codingStats.recentActiveDays30} active days in the recent 30-day window, immediate structured guidance will help establish a daily problem-solving routine.`;
    strengths = [
      'Has active profiles registered on both LeetCode and HackerRank.',
      'Basic exposure to primitive data types, simple loops, and elementary syntax.',
    ];
    areasForImprovement = [
      'Consistency: Establish a non-negotiable habit of solving at least 3-4 problems every week.',
      'Master core data structures: Arrays, Strings, HashMaps, and Stacks before moving to advanced algorithms.',
      'Avoid long gaps between coding sessions to preserve momentum and algorithmic retention.',
    ];
    suggestedPractice = [
      {
        topic: 'Elementary Arrays & Hash Maps',
        targetProblems: '12 Easy problems (Two Sum, Contains Duplicate, Valid Anagram)',
        rationale: 'Develops comfort with O(1) hash map lookups and fundamental iteration.',
      },
      {
        topic: 'Basic String Parsing & Two Pointers',
        targetProblems: '8 Easy problems (Valid Palindrome, Reverse String)',
        rationale: 'Builds indexing precision and in-place memory management.',
      },
      {
        topic: 'Stack Basics',
        targetProblems: '6 Easy problems (Valid Parentheses, Implement Queue using Stacks)',
        rationale: 'Introduces LIFO execution models and expression parsing.',
      },
    ];
    weeklyScheduleSuggestion = [
      'Mon & Wed: 1 Easy LeetCode problem with step-by-step dry-run on paper.',
      'Fri: 1 Easy HackerRank warmup problem to build confidence.',
      'Sat: 1 hour dedicated lab session with peer or faculty mentor.',
    ];
  }

  return {
    studentName: name,
    registerNumber,
    year,
    generatedAt: new Date().toISOString(),
    performanceSummary,
    strengths,
    areasForImprovement,
    suggestedPractice,
    weeklyScheduleSuggestion,
  };
}
