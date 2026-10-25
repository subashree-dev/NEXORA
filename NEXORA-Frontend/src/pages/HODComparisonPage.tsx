import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  BarChart3,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  HODComparisonData,
  fetchHODComparison,
} from '../utils/api';

export const HODComparisonPage: React.FC = () => {
  const [data, setData] = useState<HODComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchHODComparison()
      .then((res) => setData(res))
      .catch((err: any) => setErrorMsg(err.message || 'Failed to load comparison data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-medium">Aggregating cross-year and section comparative telemetry...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="neu-card p-6 rounded-2xl text-red-700 bg-red-50/50">
          <p className="text-xs font-semibold">{errorMsg || 'Failed to load comparison data'}</p>
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
            <GitCompare className="w-6 h-6 text-purple-700" />
            <span>Academic Year & Section Comparison</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Cross-cohort participation rates, average solve velocity, and section balance across AI & DS
          </p>
        </div>
      </div>

      {/* Cross-Year Cohort Comparison Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-[11px]">
          Academic Cohort Performance (Years 1–4)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.yearComparisons.map((item) => (
            <div key={item.year} className="neu-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-sm font-bold text-slate-900">
                  Year {item.year} AI & DS
                </span>
                <span className="px-2 py-0.5 rounded-lg neu-inset text-blue-700 text-xs font-mono font-semibold">
                  {item.totalStudents} Students
                </span>
              </div>

              <div className="space-y-3">
                {/* Average Solves */}
                <div className="p-3 rounded-xl neu-inset">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Average Solves / Student
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-extrabold text-blue-700 font-mono">
                      {item.avgSolved}
                    </span>
                    <span className="text-xs text-slate-500">problems</span>
                  </div>
                </div>

                {/* Average Readiness */}
                <div className="p-3 rounded-xl neu-inset">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Average Readiness Score
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono">
                      {item.avgReadinessScore}
                    </span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>

                {/* Participation Rate */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Profile Connectivity</span>
                    <span className="text-emerald-700 font-mono">{item.participationPct}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden neu-inset">
                    <div
                      style={{ width: `${item.participationPct}%` }}
                      className="h-full bg-emerald-600 rounded-full"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block text-right">
                    {item.activeProfiles} of {item.totalStudents} connected
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Balance Comparison */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Department Section Breakdown (Sections A, B, C, D)
            </h2>
            <p className="text-xs text-slate-500">
              Evaluates parity in coding problem-solving between parallel sections
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.sectionBreakdown.map((sec) => (
            <div key={sec.section} className="p-4 rounded-xl neu-inset space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">
                  Section {sec.section}
                </span>
                <span className="text-xs font-mono text-slate-600">
                  {sec.count} Enrolled
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-slate-500">Mean Problems Solved:</span>
                <span className="text-xl font-extrabold text-blue-700 font-mono">
                  {sec.avgSolved}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 leading-relaxed italic">
          Departmental observation: All departmental sections demonstrate active coding momentum. High-frequency problems are distributed proportionately across algorithm topics.
        </p>
      </div>
    </div>
  );
};
