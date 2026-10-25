import React, { useState, useEffect } from 'react';
import {
  Code2,
  Search,
  Filter,
  ExternalLink,
  GraduationCap,
  X,
  AlertCircle,
  Eye,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import {
  FacultyStudentItem,
  fetchFacultyStudents,
} from '../utils/api';

export const FacultyMonitorPage: React.FC = () => {
  const [students, setStudents] = useState<FacultyStudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modal inspection of individual student
  const [inspectStudent, setInspectStudent] = useState<FacultyStudentItem | null>(null);

  const loadData = () => {
    setLoading(true);
    setErrorMsg(null);
    fetchFacultyStudents({
      year: selectedYear,
      section: selectedSection,
      q: searchQuery,
    })
      .then((data) => setStudents(data.students))
      .catch((err: any) => setErrorMsg(err.message || 'Failed to load students'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedYear, selectedSection, searchQuery]);

  // Sort students by total problems solved
  const sortedStudents = [...students].sort((a, b) => {
    return sortOrder === 'desc'
      ? b.totalSolved - a.totalSolved
      : a.totalSolved - b.totalSolved;
  });

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Student Coding Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Filter by academic year and section, inspect problem difficulty counts, and review estimated readiness
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-600 neu-inset px-3 py-1.5 rounded-xl font-mono">
            Total Monitored: {students.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="neu-card rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student name, register number, or LeetCode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl neu-input text-xs text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="neu-input px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="neu-input px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="neu-btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
            title="Toggle sort order by problems solved"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
            <span>{sortOrder === 'desc' ? 'Highest Solves' : 'Lowest Solves'}</span>
          </button>
        </div>
      </div>

      {/* Student Table */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Loading student roster...
          </div>
        ) : errorMsg ? (
          <div className="p-4 rounded-xl text-xs text-red-700 bg-red-50/50">
            {errorMsg}
          </div>
        ) : sortedStudents.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No students found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/70 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Register No.</th>
                  <th className="py-2.5 px-3">Year / Sec</th>
                  <th className="py-2.5 px-3">LeetCode Handle</th>
                  <th className="py-2.5 px-3 text-right">Total Solved</th>
                  <th className="py-2.5 px-3 text-center">Difficulty (E / M / H)</th>
                  <th className="py-2.5 px-3 text-right">Readiness Score</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40 text-slate-700">
                {sortedStudents.map((student) => (
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
                      {student.leetcodeUsername ? (
                        <a
                          href={student.leetcodeProfileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline inline-flex items-center gap-1"
                        >
                          @{student.leetcodeUsername}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400">Not Connected</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {student.totalSolved}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px]">
                      <span className="text-emerald-700 font-semibold">{student.easySolved}</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-amber-700 font-semibold">{student.mediumSolved}</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-red-700 font-semibold">{student.hardSolved}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-700">
                      {student.readinessScore} / 100
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setInspectStudent(student)}
                        className="neu-btn-secondary px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Student Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="neu-card rounded-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {inspectStudent.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Reg: {inspectStudent.registerNumber} · Year {inspectStudent.year} · Section {inspectStudent.section}
                </p>
              </div>

              <button
                onClick={() => setInspectStudent(null)}
                className="p-1.5 rounded-xl neu-btn-secondary text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* LeetCode Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">LeetCode Profile</span>
                {inspectStudent.leetcodeUsername ? (
                  <a
                    href={inspectStudent.leetcodeProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 font-mono font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    @{inspectStudent.leetcodeUsername}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400">Not Connected</span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl neu-inset">
                  <span className="text-[10px] text-slate-500 font-bold block">Total</span>
                  <span className="text-lg font-bold text-slate-900 font-mono">{inspectStudent.totalSolved}</span>
                </div>
                <div className="p-2.5 rounded-xl neu-inset">
                  <span className="text-[10px] text-emerald-700 font-bold block">Easy</span>
                  <span className="text-lg font-bold text-emerald-800 font-mono">{inspectStudent.easySolved}</span>
                </div>
                <div className="p-2.5 rounded-xl neu-inset">
                  <span className="text-[10px] text-amber-700 font-bold block">Medium</span>
                  <span className="text-lg font-bold text-amber-800 font-mono">{inspectStudent.mediumSolved}</span>
                </div>
                <div className="p-2.5 rounded-xl neu-inset">
                  <span className="text-[10px] text-red-700 font-bold block">Hard</span>
                  <span className="text-lg font-bold text-red-800 font-mono">{inspectStudent.hardSolved}</span>
                </div>
              </div>

              {/* Placement Readiness Card */}
              <div className="p-4 rounded-xl neu-inset space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    Placement Readiness
                  </span>
                  <span className="text-lg font-extrabold text-blue-700 font-mono">
                    {inspectStudent.readinessScore} / 100
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Estimated readiness based on verified problem counts. Used for departmental technical monitoring.
                </p>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Last updated: {inspectStudent.lastActiveDate || 'Recorded'}</span>
                {inspectStudent.leetcodeUsername && (
                  <a
                    href={inspectStudent.leetcodeProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="neu-btn-primary px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <span>Open LeetCode</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
