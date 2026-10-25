// Head of Department (HOD) Overview for NEXORA
// Dr. A. Saravanan - Professor & Head, Department of Artificial Intelligence and Data Science

import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  AlertTriangle,
  FolderCheck,
  Sparkles,
  BarChart3,
  FileCheck,
} from 'lucide-react';
import { DepartmentAnalytics, Student } from '../types';
import {
  DifficultyBar,
  YearComparisonBarChart,
  ProjectStatusCards,
} from '../components/charts/Charts';

interface HODDashboardProps {
  analytics: DepartmentAnalytics | null;
  onNavigateToStudents: () => void;
  onNavigateToCoding: () => void;
  onNavigateToProjects: () => void;
  onOpenAIInsight: () => void;
}

export const HODDashboard: React.FC<HODDashboardProps> = ({
  analytics,
  onNavigateToStudents,
  onNavigateToCoding,
  onNavigateToProjects,
  onOpenAIInsight,
}) => {
  if (!analytics) {
    return <div className="p-8 text-center text-slate-400">Loading HOD Departmental View...</div>;
  }

  const yearComparisonData = [
    {
      label: 'First Year (Batch 2024-28)',
      value: analytics.yearWiseCodingAverage.firstYear,
      count: analytics.yearCounts.firstYear,
      color: '#06b6d4',
    },
    {
      label: 'Second Year (Batch 2023-27)',
      value: analytics.yearWiseCodingAverage.secondYear,
      count: analytics.yearCounts.secondYear,
      color: '#6366f1',
    },
    {
      label: 'Third Year (Batch 2022-26)',
      value: analytics.yearWiseCodingAverage.thirdYear,
      count: analytics.yearCounts.thirdYear,
      color: '#8b5cf6',
    },
    {
      label: 'Fourth Year (Batch 2021-25)',
      value: analytics.yearWiseCodingAverage.fourthYear,
      count: analytics.yearCounts.fourthYear,
      color: '#10b981',
    },
  ];

  return (
    <div className="space-y-6">
      {/* HOD Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/70 border border-purple-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                Department Executive Dashboard (HOD)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Official Leadership View
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Dr. A. Saravanan &bull; Professor & Head of Department &bull;{' '}
              <span className="text-cyan-300">Easwari Engineering College</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIInsight}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span>AI Student Diagnostic</span>
          </button>
        </div>
      </div>

      {/* Top 4 Leadership Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold block">Total Department Cohort</span>
          <div className="text-3xl font-black text-white mt-1 font-mono">{analytics.totalStudents}</div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Across 4 Academic Years (16 Sections)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-emerald-400 uppercase font-semibold block">Active Coders Percentage</span>
          <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">
            {Math.round((analytics.activeCodersCount / (analytics.totalStudents || 1)) * 100)}%
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {analytics.activeCodersCount} of {analytics.totalStudents} regular problem solvers
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-cyan-400 uppercase font-semibold block">Capstone Project Submissions</span>
          <div className="text-3xl font-black text-cyan-400 mt-1 font-mono">{analytics.totalProjects}</div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {analytics.completedProjects} Completed &bull; {analytics.approvedProjects} Approved
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-900/40">
          <span className="text-xs text-rose-400 uppercase font-semibold block">Students Needing Mentorship</span>
          <div className="text-3xl font-black text-rose-300 mt-1 font-mono">
            {analytics.studentsNeedingAttentionCount}
          </div>
          <span className="text-[11px] text-rose-400/80 block mt-1">
            Immediate attention recommended
          </span>
        </div>
      </div>

      {/* Year-wise Comparative Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <span>Year-wise Average Problems Solved</span>
            </h3>
            <span className="text-xs text-slate-400">All Batches</span>
          </div>

          <YearComparisonBarChart data={yearComparisonData} />
        </div>

        {/* Project Completion Review */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FolderCheck className="h-4 w-4 text-emerald-400" />
              <span>Department Project Pipeline</span>
            </h3>
            <button
              onClick={onNavigateToProjects}
              className="text-xs text-indigo-400 hover:underline cursor-pointer"
            >
              View Details
            </button>
          </div>

          <ProjectStatusCards distribution={analytics.projectStatusDistribution} />
        </div>
      </div>

      {/* LeetCode Difficulty Analysis */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-cyan-400" />
          <span>Department Algorithmic Depth Distribution</span>
        </h3>
        <DifficultyBar
          easy={analytics.difficultyDistribution.easyTotal}
          medium={analytics.difficultyDistribution.mediumTotal}
          hard={analytics.difficultyDistribution.hardTotal}
        />
      </div>
    </div>
  );
};
