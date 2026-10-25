import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Users,
  Code2,
  Calendar,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { StudentRankSummary } from '../types';
import { fetchMyRankSummary } from '../utils/api';

export const StudentRankPage: React.FC = () => {
  const [rankData, setRankData] = useState<StudentRankSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchMyRankSummary()
      .then((data) => {
        setRankData(data);
      })
      .catch((err: any) => {
        setErrorMsg(err.message || 'Failed to load ranking details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-medium">Calculating class and cohort rankings...</p>
      </div>
    );
  }

  if (errorMsg || !rankData) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="neu-card p-6 rounded-2xl text-red-700 bg-red-50/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">Unable to Load Ranking Data</h3>
            <p className="text-xs mt-1">{errorMsg || 'No ranking data available.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            <span>My Department Coding Ranks</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Verified rankings based on total LeetCode problems solved within your class and academic cohort
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 neu-inset px-3 py-1.5 rounded-xl self-start sm:self-auto font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>Updated: {rankData.lastUpdatedDate}</span>
        </div>
      </div>

      {/* Main Two Rank Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Class/Section Rank */}
        <div className="neu-card rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Class / Section Rank</span>
            <span className="px-2 py-0.5 rounded-lg neu-inset text-blue-700 font-mono text-[10px]">
              Sec {rankData.section}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-blue-700 font-mono tracking-tight">
              #{rankData.sectionRank}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              of {rankData.sectionTotalStudents} students in Section {rankData.section}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            Calculated among all AI & DS Section {rankData.section} students in Year {rankData.year}.
          </p>
        </div>

        {/* Academic Year Cohort Rank */}
        <div className="neu-card rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Year Cohort Rank</span>
            <span className="px-2 py-0.5 rounded-lg neu-inset text-blue-700 font-mono text-[10px]">
              Year {rankData.year} AI & DS
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-blue-700 font-mono tracking-tight">
              #{rankData.yearRank}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              of {rankData.yearTotalStudents} total students in Year {rankData.year}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            Calculated across all sections (A & B) of Year {rankData.year} AI & Data Science students.
          </p>
        </div>
      </div>

      {/* Total Solves Summary Card */}
      <div className="neu-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl neu-card flex items-center justify-center text-blue-600 shadow-[2px_2px_5px_#d1d9e6,-2px_-2px_5px_#ffffff]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Total LeetCode Problems Solved: {rankData.totalSolved}
            </span>
            <p className="text-[11px] text-slate-500">
              Your ranking position reflects verified problem-solving counts under the department benchmark policy.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-xl neu-inset text-slate-700 font-semibold self-start sm:self-auto">
          Tie Rule: Shared Ranks
        </span>
      </div>

      {/* Compact Leaderboard Showing Nearby Ranks */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Nearby Cohort Leaderboard
            </h2>
            <p className="text-xs text-slate-500">
              Students ranked adjacent to your position in Year {rankData.year} AI & DS
            </p>
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            Dense Tie-Handling Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/70 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Register No.</th>
                <th className="py-2.5 px-3">Section</th>
                <th className="py-2.5 px-3 text-right">Problems Solved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-slate-700">
              {rankData.nearbyLeaderboard.map((item, idx) => (
                <tr
                  key={`${item.registerNumber}-${idx}`}
                  className={`transition-colors ${
                    item.isCurrentStudent
                      ? 'neu-inset font-semibold text-blue-900'
                      : 'hover:bg-slate-200/30'
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                        item.isCurrentStudent
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'neu-inset text-slate-700'
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.isCurrentStudent && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {item.registerNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md neu-inset text-slate-600 text-[11px]">
                      Sec {item.section}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {item.totalSolved}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 leading-relaxed italic">
          * Note: Rankings are calculated strictly within the same academic cohort (Year {rankData.year}). Academic years are never mixed. Students with identical problem counts share the same rank.
        </p>
      </div>
    </div>
  );
};
