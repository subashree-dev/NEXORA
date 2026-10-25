import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Code2,
  GraduationCap,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import {
  HODDepartmentOverview,
  fetchHODOverview,
} from '../utils/api';

interface HODOverviewPageProps {
  onNavigate: (page: string) => void;
}

export const HODOverviewPage: React.FC<HODOverviewPageProps> = ({ onNavigate }) => {
  const [data, setData] = useState<HODDepartmentOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchHODOverview()
      .then((res) => setData(res))
      .catch((err: any) => setErrorMsg(err.message || 'Failed to load HOD overview'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-medium">Aggregating department-level metrics...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="neu-card p-6 rounded-2xl text-red-700 bg-red-50/50">
          <p className="text-xs font-semibold">{errorMsg || 'Failed to load department overview'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-700" />
            <span>Department Oversight Overview</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Executive metrics for Artificial Intelligence & Data Science student coding activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('hod-comparison')}
            className="neu-btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Year Comparisons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('hod-reports')}
            className="neu-btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Department Reports</span>
          </button>
        </div>
      </div>

      {/* 5 Department-Level Oversight Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Authorized Students */}
        <div className="neu-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Authorized AI & DS</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {data.totalStudents}
          </div>
          <p className="text-[10px] text-slate-500">Registered students</p>
        </div>

        {/* Coding Data Participation */}
        <div className="neu-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Coding Profiles</span>
            <Code2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 font-mono">
            {data.withCodingData}
          </div>
          <p className="text-[10px] text-slate-500 font-semibold text-emerald-700">
            {data.participationRate}% connected
          </p>
        </div>

        {/* Average Problems Solved */}
        <div className="neu-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Avg Solves / Student</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {data.avgProblemsSolved}
          </div>
          <p className="text-[10px] text-slate-500">Department mean</p>
        </div>

        {/* Average Readiness Score */}
        <div className="neu-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Avg Readiness</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-700 font-mono">
            {data.avgReadinessScore}
            <span className="text-xs text-slate-400 font-normal"> / 100</span>
          </div>
          <p className="text-[10px] text-slate-500">Technical estimate</p>
        </div>

        {/* Missing Coding Profiles */}
        <div className="neu-card rounded-2xl p-4 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Missing Profiles</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-800 font-mono">
            {data.missingCodingProfiles}
          </div>
          <p className="text-[10px] text-slate-500">Awaiting connection</p>
        </div>
      </div>

      {/* Executive Briefing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strategic Target Progress */}
        <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Department Coding Policy Benchmarks
          </h2>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl neu-inset space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Campus Placement Target (400 Solves)</span>
                <span className="text-blue-700 font-mono">
                  {Math.min(100, Math.round((data.avgProblemsSolved / 400) * 100))}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden neu-inset">
                <div
                  style={{ width: `${Math.min(100, (data.avgProblemsSolved / 400) * 100)}%` }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl neu-inset space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Cohort Profile Connectivity Target</span>
                <span className="text-emerald-700 font-mono">{data.participationRate}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden neu-inset">
                <div
                  style={{ width: `${data.participationRate}%` }}
                  className="h-full bg-emerald-600 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Executive Controls
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Directly review cohort comparative metrics, audit student records, and generate verified department compliance reports.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => onNavigate('hod-comparison')}
              className="w-full neu-btn-secondary p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between cursor-pointer"
            >
              <span>Cross-Year & Section Comparison Analysis</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => onNavigate('hod-monitoring')}
              className="w-full neu-btn-secondary p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between cursor-pointer"
            >
              <span>Department Student Roster & Coding Audit</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => onNavigate('hod-reports')}
              className="w-full neu-btn-secondary p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between cursor-pointer"
            >
              <span>Download Official Placement Coding Reports (CSV)</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
