import React, { useState, useEffect } from 'react';
import {
  Users,
  Code2,
  GraduationCap,
  AlertTriangle,
  ArrowRight,
  Search,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import {
  FacultyDashboardStats,
  fetchFacultyDashboard,
} from '../utils/api';

interface FacultyDashboardPageProps {
  onNavigate: (page: string) => void;
  onSelectStudent?: (studentId: string) => void;
}

export const FacultyDashboardPage: React.FC<FacultyDashboardPageProps> = ({
  onNavigate,
}) => {
  const [stats, setStats] = useState<FacultyDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchFacultyDashboard()
      .then((data) => setStats(data))
      .catch((err: any) => setErrorMsg(err.message || 'Failed to load faculty dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-medium">Loading faculty dashboard metrics...</p>
      </div>
    );
  }

  if (errorMsg || !stats) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="neu-card p-6 rounded-2xl text-red-700 bg-red-50/50">
          <p className="text-xs font-semibold">{errorMsg || 'Failed to load dashboard metrics'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Faculty Monitoring Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Overview of student coding metrics and technical placement readiness across your assigned cohort
          </p>
        </div>

        <button
          onClick={() => onNavigate('faculty-monitor')}
          className="neu-btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>Open Full Student Monitor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Students */}
        <div className="neu-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Authorised Students</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {stats.totalScopeStudents}
          </div>
          <p className="text-[10px] text-slate-500">In department scope</p>
        </div>

        {/* Available Coding Profiles */}
        <div className="neu-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Active Profiles</span>
            <Code2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 font-mono">
            {stats.studentsWithCodingData}
          </div>
          <p className="text-[10px] text-slate-500">
            {stats.totalScopeStudents > 0
              ? `${Math.round((stats.studentsWithCodingData / stats.totalScopeStudents) * 100)}% connected`
              : '0%'}
          </p>
        </div>

        {/* Avg Problems Solved */}
        <div className="neu-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Avg Solves</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {stats.avgProblemsSolved}
          </div>
          <p className="text-[10px] text-slate-500">LeetCode problems</p>
        </div>

        {/* Avg Readiness Score */}
        <div className="neu-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Avg Readiness</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-700 font-mono">
            {stats.avgReadinessScore}
            <span className="text-xs text-slate-400 font-normal"> / 100</span>
          </div>
          <p className="text-[10px] text-slate-500">Calculated score</p>
        </div>

        {/* Missing / Outdated Coding Info */}
        <div className="neu-card rounded-2xl p-4 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Missing Profiles</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-800 font-mono">
            {stats.missingCodingData}
          </div>
          <p className="text-[10px] text-slate-500">Pending profile links</p>
        </div>
      </div>

      {/* Compact Student Progress Table */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Recent Student Coding Progress
            </h2>
            <p className="text-xs text-slate-500">
              Sample roster snapshot with verified problem counts and readiness scores
            </p>
          </div>

          <button
            onClick={() => onNavigate('faculty-monitor')}
            className="neu-btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/70 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Register No.</th>
                <th className="py-2.5 px-3">Year / Sec</th>
                <th className="py-2.5 px-3">LeetCode Handle</th>
                <th className="py-2.5 px-3 text-right">Problems Solved</th>
                <th className="py-2.5 px-3 text-right">Readiness Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-slate-700">
              {stats.compactStudentProgress.map((student) => (
                <tr key={student.id} className="hover:bg-slate-200/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {student.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {student.registerNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md neu-inset text-slate-600 text-[11px]">
                      Y{student.year} · Sec {student.section}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-blue-700">
                    {student.leetcodeUsername ? `@${student.leetcodeUsername}` : '—'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {student.totalSolved}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-blue-700">
                    {student.readinessScore} / 100
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
