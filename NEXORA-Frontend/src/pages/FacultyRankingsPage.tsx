import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Download,
  Users,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  FileSpreadsheet,
  Info,
} from 'lucide-react';
import {
  FacultyClassProgress,
  fetchFacultyClassProgress,
  fetchFacultyStudents,
} from '../utils/api';

export const FacultyRankingsPage: React.FC = () => {
  const [data, setData] = useState<FacultyClassProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchFacultyClassProgress()
      .then((res) => setData(res))
      .catch((err: any) => setErrorMsg(err.message || 'Failed to load class progress rankings'))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await fetchFacultyStudents();
      const headers = [
        'Name',
        'Register Number',
        'Year',
        'Section',
        'LeetCode Username',
        'Total Solved',
        'Easy Solved',
        'Medium Solved',
        'Hard Solved',
        'Estimated Readiness Score',
        'Last Active Date',
      ];

      const rows = res.students.map((s) => [
        `"${s.name}"`,
        s.registerNumber,
        s.year,
        s.section,
        s.leetcodeUsername || 'None',
        s.totalSolved,
        s.easySolved,
        s.mediumSolved,
        s.hardSolved,
        s.readinessScore,
        s.lastActiveDate || 'N/A',
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `nexora_faculty_coding_roster_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export CSV error:', err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-medium">Aggregating class progress and section rankings...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="neu-card p-6 rounded-2xl text-red-700 bg-red-50/50">
          <p className="text-xs font-semibold">{errorMsg || 'Failed to load progress'}</p>
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
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span>Class Progress and Section Comparisons</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Compare section coding velocity, review students needing coding guidance, and export authorised records
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="neu-btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{exporting ? 'Generating CSV...' : 'Export Class CSV'}</span>
        </button>
      </div>

      {/* Section Comparisons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.sectionStats.map((sec) => (
          <div key={sec.section} className="neu-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg neu-card flex items-center justify-center font-bold text-blue-700 text-xs">
                  {sec.section}
                </span>
                <h3 className="font-bold text-sm text-slate-900">
                  Section {sec.section} Performance
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {sec.studentCount} Students
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl neu-inset">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Active Profiles</span>
                <span className="text-xl font-extrabold text-emerald-800 font-mono mt-0.5 block">
                  {sec.activeProfiles}
                </span>
              </div>
              <div className="p-3 rounded-xl neu-inset">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Total Solved</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono mt-0.5 block">
                  {sec.totalSolved}
                </span>
              </div>
              <div className="p-3 rounded-xl neu-inset">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Average Solves</span>
                <span className="text-xl font-extrabold text-blue-700 font-mono mt-0.5 block">
                  {sec.avgSolved}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guidance Indicator Card (Mandatory Objective Framing) */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Students Flagged for Coding Guidance Review
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified based on problem counts under initial department benchmark (100 problems)
            </p>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded-lg neu-inset text-amber-800 font-semibold shrink-0">
            {data.studentsNeedingGuidance.length} Flagged
          </span>
        </div>

        {/* Ethical Academic Framing Notice */}
        <div className="p-3.5 rounded-xl neu-inset text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Department Guidance Policy: </strong>
            Lower problem counts do not represent low student aptitude or poor placement potential. This list serves solely as an indicator for faculty mentoring, lab assistance, and targeted practice sessions.
          </p>
        </div>

        {data.studentsNeedingGuidance.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center">
            All registered students meet the current foundational problem-solving benchmark.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/70 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Register No.</th>
                  <th className="py-2.5 px-3">Year / Sec</th>
                  <th className="py-2.5 px-3 text-right">Problems Solved</th>
                  <th className="py-2.5 px-3 text-right">Readiness Score</th>
                  <th className="py-2.5 px-3">Review Indicator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40 text-slate-700">
                {data.studentsNeedingGuidance.map((student) => (
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
                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-800">
                      {student.totalSolved}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                      {student.readinessScore} / 100
                    </td>
                    <td className="py-3 px-3 text-slate-500 italic text-[11px]">
                      {student.indicatorNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Missing Profiles Review */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400" />
            <span>Students with Missing Coding Profiles</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">
            {data.missingProfiles.length} students
          </span>
        </div>

        {data.missingProfiles.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            All registered cohort students have connected their coding profiles.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {data.missingProfiles.map((s) => (
              <div key={s.id} className="p-3 rounded-xl neu-inset text-xs">
                <span className="font-semibold text-slate-900 block">{s.name}</span>
                <span className="text-[11px] text-slate-500 font-mono block">
                  Reg: {s.registerNumber} · Year {s.year} {s.section}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
