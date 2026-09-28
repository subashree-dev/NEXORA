// Students Table View for NEXORA
// Department of Artificial Intelligence and Data Science - Easwari Engineering College

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Code2,
  ExternalLink,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  FolderGit2,
} from 'lucide-react';
import { Student } from '../types';
import { api } from '../services/api';

interface StudentsListProps {
  initialYearFilter?: string;
  initialSearch?: string;
  onSelectStudent: (student: Student) => void;
  onOpenAIInsight: (student: Student) => void;
}

export const StudentsList: React.FC<StudentsListProps> = ({
  initialYearFilter = 'All',
  initialSearch = '',
  onSelectStudent,
  onOpenAIInsight,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedYear, setSelectedYear] = useState(initialYearFilter);
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedCodingStatus, setSelectedCodingStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'solved' | 'name' | 'reg'>('solved');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    loadStudents();
  }, [selectedYear, selectedSection, selectedCodingStatus]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    if (initialYearFilter !== undefined) {
      setSelectedYear(initialYearFilter);
    }
  }, [initialYearFilter]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await api.getStudents({
        year: selectedYear,
        section: selectedSection,
        codingStatus: selectedCodingStatus,
        search: searchQuery,
      });
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadStudents();
  };

  // Local filtered and sorted students
  const displayedStudents = [...students]
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        s.name.toLowerCase().includes(q) ||
        s.registerNumber.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'solved') {
        const diff = a.codingStats.totalSolved - b.codingStats.totalSolved;
        return sortDesc ? -diff : diff;
      }
      if (sortBy === 'reg') {
        return sortDesc
          ? b.registerNumber.localeCompare(a.registerNumber)
          : a.registerNumber.localeCompare(b.registerNumber);
      }
      return sortDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Department Student Directory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time coding milestones, HackerRank profiles, and project submissions for AI & DS students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadStudents}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name (e.g. Ananya Krishnan) or register number (310625243001)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setTimeout(() => loadStudents(), 50);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Clear
            </button>
          )}
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-medium text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          {/* Year */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Years</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Fourth Year">Fourth Year</option>
          </select>

          {/* Section */}
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Sections (A, B, C, D)</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
          </select>

          {/* Coding Status */}
          <select
            value={selectedCodingStatus}
            onChange={(e) => setSelectedCodingStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Coding Statuses</option>
            <option value="Active">Active</option>
            <option value="Moderate">Moderate</option>
            <option value="Low Activity">Low Activity</option>
            <option value="Inactive">Inactive / Needs Attention</option>
          </select>

          <span className="text-slate-500 text-xs ml-auto">
            Showing <strong className="text-white">{displayedStudents.length}</strong> students
          </span>
        </div>
      </div>

      {/* Student Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => {
                    if (sortBy === 'reg') setSortDesc(!sortDesc);
                    else {
                      setSortBy('reg');
                      setSortDesc(false);
                    }
                  }}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Register No</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    if (sortBy === 'name') setSortDesc(!sortDesc);
                    else {
                      setSortBy('name');
                      setSortDesc(false);
                    }
                  }}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Name</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Year & Sec</th>
                <th
                  onClick={() => {
                    if (sortBy === 'solved') setSortDesc(!sortDesc);
                    else {
                      setSortBy('solved');
                      setSortDesc(true);
                    }
                  }}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>LeetCode Solved</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">HackerRank Status</th>
                <th className="py-3 px-3 font-semibold">Projects</th>
                <th className="py-3 px-3 font-semibold">Coding Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-indigo-400 mb-2" />
                    <span>Loading student records...</span>
                  </td>
                </tr>
              ) : displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No student records matching your filters.
                  </td>
                </tr>
              ) : (
                displayedStudents.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    {/* Register Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                      {s.registerNumber}
                    </td>

                    {/* Student Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {s.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                        {s.email}
                      </div>
                    </td>

                    {/* Year & Section */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-medium text-slate-200">
                        {s.year.replace(' Year', ' Yr')}
                      </div>
                      <div className="text-[11px] text-slate-400">Sec {s.section}</div>
                    </td>

                    {/* LeetCode Solved */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-extrabold text-white text-sm">
                        <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{s.codingStats.totalSolved}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {s.codingStats.easy}E &bull; {s.codingStats.medium}M &bull; {s.codingStats.hard}H
                      </div>
                    </td>

                    {/* HackerRank Status */}
                    <td className="py-3.5 px-4 max-w-[200px] truncate">
                      <div className="text-slate-200 font-medium truncate" title={s.codingStats.hackerrankStatus}>
                        {s.codingStats.hackerrankStatus}
                      </div>
                      <div className="text-[10px] text-emerald-400">
                        Score: {s.codingStats.hackerrankScore} &bull; {s.codingStats.hackerrankBadges} Badges
                      </div>
                    </td>

                    {/* Projects Count */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 font-semibold text-slate-200">
                        <FolderGit2 className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{s.projectsCount || 0}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {s.completedProjectsCount || 0} Completed
                      </div>
                    </td>

                    {/* Coding Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          s.codingStats.codingStatus === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : s.codingStats.codingStatus === 'Moderate'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : s.codingStats.codingStatus === 'Low Activity'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {s.codingStats.codingStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenAIInsight(s)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-[11px] font-semibold border border-indigo-500/30 transition-all cursor-pointer"
                          title="Generate AI Coding Insight"
                        >
                          <Sparkles className="h-3 w-3 text-cyan-300" />
                          <span className="hidden sm:inline">AI Insight</span>
                        </button>
                        <button
                          onClick={() => onSelectStudent(s)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
