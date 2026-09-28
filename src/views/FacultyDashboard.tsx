// Faculty Main Dashboard for NEXORA
// Department of Artificial Intelligence and Data Science - Easwari Engineering College

import React from 'react';
import {
  Users,
  Code2,
  FolderGit2,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart2,
  TrendingUp,
} from 'lucide-react';
import { DepartmentAnalytics } from '../types';
import {
  DifficultyBar,
  YearComparisonBarChart,
  ProjectStatusCards,
} from '../components/charts/Charts';

interface FacultyDashboardProps {
  analytics: DepartmentAnalytics | null;
  yearFilter: string;
  onYearFilterChange: (year: string) => void;
  onNavigateToStudents: () => void;
  onNavigateToProjects: () => void;
  onNavigateToCodingIntelligence: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  analytics,
  yearFilter,
  onYearFilterChange,
  onNavigateToStudents,
  onNavigateToProjects,
  onNavigateToCodingIntelligence,
}) => {
  if (!analytics) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p>Loading department analytics...</p>
      </div>
    );
  }

  const yearComparisonData = [
    {
      label: 'First Year',
      value: analytics.yearWiseCodingAverage.firstYear,
      count: analytics.yearCounts.firstYear,
      color: '#06b6d4',
    },
    {
      label: 'Second Year',
      value: analytics.yearWiseCodingAverage.secondYear,
      count: analytics.yearCounts.secondYear,
      color: '#6366f1',
    },
    {
      label: 'Third Year',
      value: analytics.yearWiseCodingAverage.thirdYear,
      count: analytics.yearCounts.thirdYear,
      color: '#8b5cf6',
    },
    {
      label: 'Fourth Year',
      value: analytics.yearWiseCodingAverage.fourthYear,
      count: analytics.yearCounts.fourthYear,
      color: '#10b981',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Department Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Department Coding & Project Overview</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              AI & DS Faculty Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Consolidating student LeetCode streaks, HackerRank activities, and project reviews into
              one automated platform for Easwari Engineering College.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400">Filter Year:</span>
            <div className="inline-flex rounded-xl bg-slate-950/80 p-1 border border-slate-800">
              {['All', 'Second Year', 'Third Year', 'Fourth Year'].map((yr) => (
                <button
                  key={yr}
                  onClick={() => onYearFilterChange(yr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    yearFilter === yr
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {yr === 'All' ? 'All Years' : yr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Students Monitored
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">
            {analytics.totalStudents}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2">
            <span>I: {analytics.yearCounts.firstYear} &bull; II: {analytics.yearCounts.secondYear}</span>
            <span>III: {analytics.yearCounts.thirdYear} &bull; IV: {analytics.yearCounts.fourthYear}</span>
          </div>
        </div>

        {/* Active Coders */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Actively Coding
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">
            {analytics.activeCodersCount}{' '}
            <span className="text-xs font-normal text-slate-400">
              ({Math.round((analytics.activeCodersCount / (analytics.totalStudents || 1)) * 100)}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2">
            <span>Moderate: {analytics.moderateCodersCount}</span>
            <span className="text-emerald-400 font-semibold">Active Daily Streaks</span>
          </div>
        </div>

        {/* Average Problems Solved */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Avg Problems Solved
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Code2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">
            {analytics.averageProblemsSolved}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2">
            <span>Highest Solved: {analytics.highestProblemsSolved}</span>
            <span className="text-cyan-400 font-medium">LeetCode + HR</span>
          </div>
        </div>

        {/* Students Needing Attention */}
        <div
          onClick={onNavigateToCodingIntelligence}
          className="p-5 rounded-2xl bg-slate-900/90 border border-rose-900/40 hover:border-rose-700/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Students Needing Attention
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-105 transition-transform">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-300 mt-2 font-mono">
            {analytics.studentsNeedingAttentionCount}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2">
            <span>Low activity or inactive</span>
            <span className="text-rose-300 group-hover:underline flex items-center gap-0.5">
              Review <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Projects KPI Sub-strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Projects Submitted</span>
            <div className="text-2xl font-bold text-white font-mono">{analytics.totalProjects}</div>
          </div>
          <FolderGit2 className="h-6 w-6 text-indigo-400 opacity-60" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Completed & Verified Projects</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {analytics.completedProjects}
            </div>
          </div>
          <CheckCircle2 className="h-6 w-6 text-emerald-400 opacity-60" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Pending Review / Revisions</span>
            <div className="text-2xl font-bold text-amber-400 font-mono">
              {analytics.pendingProjects}
            </div>
          </div>
          <Clock className="h-6 w-6 text-amber-400 opacity-60" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coding Activity by Year */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-indigo-400" />
              <span>Coding Activity & Averages by Year</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">All 4 Batches</span>
          </div>

          <YearComparisonBarChart data={yearComparisonData} />
        </div>

        {/* LeetCode Difficulty Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>LeetCode Difficulty Distribution (Department-wide)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Total:{' '}
              {analytics.difficultyDistribution.easyTotal +
                analytics.difficultyDistribution.mediumTotal +
                analytics.difficultyDistribution.hardTotal}
            </span>
          </div>

          <div className="pt-2">
            <DifficultyBar
              easy={analytics.difficultyDistribution.easyTotal}
              medium={analytics.difficultyDistribution.mediumTotal}
              hard={analytics.difficultyDistribution.hardTotal}
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">Department Algorithmic Health:</span>
            <p>
              Medium-tier solutions constitute{' '}
              <strong className="text-white">
                {Math.round(
                  (analytics.difficultyDistribution.mediumTotal /
                    (analytics.difficultyDistribution.easyTotal +
                      analytics.difficultyDistribution.mediumTotal +
                      analytics.difficultyDistribution.hardTotal || 1)) *
                    100
                )}
                %
              </strong>{' '}
              of solved problems, indicating strong second and third-year progression into technical interview benchmarks.
            </p>
          </div>
        </div>
      </div>

      {/* Project Completion Status Breakdown */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-cyan-400" />
            <span>Project Submission & Review Statuses</span>
          </h3>
          <button
            onClick={onNavigateToProjects}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Projects</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <ProjectStatusCards distribution={analytics.projectStatusDistribution} />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={onNavigateToStudents}
          className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/40 hover:border-indigo-700 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <h4 className="text-sm font-bold text-white">Browse Student Directory</h4>
            <p className="text-xs text-slate-400 mt-1">
              Search by register number (310625243XX), filter by year/section, and inspect coding portfolios.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-indigo-400 shrink-0 ml-3" />
        </div>

        <div
          onClick={onNavigateToCodingIntelligence}
          className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-900/40 hover:border-purple-700 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <h4 className="text-sm font-bold text-white">Coding Intelligence & Rankings</h4>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic department ranking, inactive coders alerts, and weekly problem velocity.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-purple-400 shrink-0 ml-3" />
        </div>
      </div>
    </div>
  );
};
