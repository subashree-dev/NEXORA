// Coding Intelligence View for NEXORA
// Department of Artificial Intelligence and Data Science - Easwari Engineering College

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Trophy,
  AlertTriangle,
  Code2,
  Users,
  Sparkles,
  Info,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { Student } from '../types';
import { api } from '../services/api';

interface CodingIntelligenceProps {
  onSelectStudent: (student: Student) => void;
  onOpenAIInsight: (student: Student) => void;
}

export const CodingIntelligence: React.FC<CodingIntelligenceProps> = ({
  onSelectStudent,
  onOpenAIInsight,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, [yearFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getStudents({ year: yearFilter });
      setStudents(data);
    } catch (err) {
      console.error('Failed to load coding intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Deterministic Coding Ranking Calculation (Strictly Transparent, NOT AI)
  // Formula: Score = (Easy * 1) + (Medium * 3) + (Hard * 5) + (ContestRating / 20) + (ActiveDays * 2)
  const rankedStudents = [...students]
    .map((s) => {
      const cs = s.codingStats;
      const score = Math.round(
        cs.easy * 1 +
          cs.medium * 3 +
          cs.hard * 5 +
          cs.contestRating / 20 +
          cs.recentActiveDays30 * 2
      );
      return {
        ...s,
        rankingScore: score,
      };
    })
    .sort((a, b) => b.rankingScore - a.rankingScore);

  // Inactive students needing immediate attention
  const inactiveStudents = students.filter(
    (s) => s.codingStats.codingStatus === 'Inactive' || s.codingStats.recentActiveDays30 <= 2
  );

  const totalStudents = students.length;
  const activeCoders = students.filter((s) => s.codingStats.codingStatus === 'Active').length;
  const totalSolved = students.reduce((acc, curr) => acc + curr.codingStats.totalSolved, 0);
  const avgSolved = totalStudents > 0 ? Math.round(totalSolved / totalStudents) : 0;
  const highestSolved = students.reduce(
    (max, curr) => (curr.codingStats.totalSolved > max ? curr.codingStats.totalSolved : max),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 border border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="h-4 w-4 text-orange-400" />
            <span>Coding Intelligence & Department Benchmarks</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Student Coding Analytics & Rankings
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Objective, rules-based problem solving rankings and inactivity alerts to help faculty mentors
            intervene early.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Year Filter:</span>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Years</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Fourth Year">Fourth Year</option>
          </select>
        </div>
      </div>

      {/* 5 Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-medium block">Total Students</span>
          <div className="text-2xl font-black text-white mt-1 font-mono">{totalStudents}</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Enrolled in AI & DS</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-emerald-400 uppercase font-medium block">Active Coders</span>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{activeCoders}</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Consistent daily practice</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-cyan-400 uppercase font-medium block">Average Solved</span>
          <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">{avgSolved}</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Problems per student</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-amber-400 uppercase font-medium block">Highest Solved</span>
          <div className="text-2xl font-black text-amber-400 mt-1 font-mono">{highestSolved}</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Department peak</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-900/50 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-rose-400 uppercase font-medium block">No Recent Activity</span>
          <div className="text-2xl font-black text-rose-400 mt-1 font-mono">
            {inactiveStudents.length}
          </div>
          <span className="text-[10px] text-rose-400/80 block mt-0.5">Needs intervention</span>
        </div>
      </div>

      {/* Inactive Coders Alert Board */}
      {inactiveStudents.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4" />
              <span>Students Needing Immediate Faculty Mentorship ({inactiveStudents.length})</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Zero or negligible problem solving logged over the past 30 days
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inactiveStudents.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectStudent(s)}
                className="p-3 rounded-xl bg-slate-900/90 border border-rose-900/40 hover:border-rose-700 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span>{s.name}</span>
                    <span className="text-[10px] font-mono text-rose-300">({s.registerNumber})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {s.year} &bull; Sec {s.section} &bull;{' '}
                    <strong className="text-rose-400">{s.codingStats.totalSolved} solved</strong>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAIInsight(s);
                  }}
                  className="px-2 py-1 rounded bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white text-[10px] font-semibold border border-indigo-500/30 transition-colors"
                >
                  Diagnose
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Department Ranking Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <span>Department Student Coding Rankings</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked via transparent formula:{' '}
              <span className="font-mono text-slate-300">
                Score = (Easy×1) + (Med×3) + (Hard×5) + (Rating/20) + (StreakDays×2)
              </span>
            </p>
          </div>

          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>Deterministic mathematical scoring &mdash; NOT an AI prediction</span>
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 font-semibold w-12 text-center">Rank</th>
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-3 font-semibold">Year & Sec</th>
                <th className="py-3 px-3 font-semibold">Total Solved</th>
                <th className="py-3 px-3 font-semibold">Difficulty Breakdown</th>
                <th className="py-3 px-3 font-semibold">Contest Rating</th>
                <th className="py-3 px-3 font-semibold">30-Day Activity</th>
                <th className="py-3 px-3 font-semibold text-right">Composite Score</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rankedStudents.map((s, index) => {
                const isTop3 = index < 3;
                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-3 text-center font-bold">
                      {index === 0 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black text-xs">
                          1
                        </span>
                      ) : index === 1 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/40 font-black text-xs">
                          2
                        </span>
                      ) : index === 2 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/40 font-black text-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">#{index + 1}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {s.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.registerNumber}</div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span>{s.year.replace(' Year', ' Yr')}</span>
                      <span className="text-slate-500 ml-1">({s.section})</span>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-white text-sm font-mono">
                      {s.codingStats.totalSolved}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-[11px]">
                      <span className="text-emerald-400 font-semibold">{s.codingStats.easy}E</span> &bull;{' '}
                      <span className="text-amber-400 font-semibold">{s.codingStats.medium}M</span> &bull;{' '}
                      <span className="text-rose-400 font-semibold">{s.codingStats.hard}H</span>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-purple-300 font-mono">
                      {s.codingStats.contestRating}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`font-semibold ${
                          s.codingStats.recentActiveDays30 >= 15
                            ? 'text-emerald-400'
                            : s.codingStats.recentActiveDays30 >= 5
                            ? 'text-cyan-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {s.codingStats.recentActiveDays30} days
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-extrabold text-cyan-300 font-mono text-sm">
                      {s.rankingScore}
                    </td>

                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onOpenAIInsight(s)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-[11px] font-semibold border border-indigo-500/30 transition-all flex items-center gap-1 ml-auto"
                      >
                        <Sparkles className="h-3 w-3 text-cyan-300" />
                        <span>AI Insight</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
