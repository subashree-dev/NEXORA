// Projects Management View for NEXORA
// Department of Artificial Intelligence and Data Science - Easwari Engineering College

import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Search,
  Filter,
  Github,
  ExternalLink,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Project, UserRole, Student } from '../types';
import { api } from '../services/api';

interface ProjectsListProps {
  currentUserRole: UserRole;
  currentStudent?: Student;
  onOpenProjectDetail: (project: Project) => void;
  onOpenSubmitModal?: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  currentUserRole,
  currentStudent,
  onOpenProjectDetail,
  onOpenSubmitModal,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadProjects();
  }, [yearFilter, statusFilter]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects({
        year: yearFilter,
        status: statusFilter,
        studentId: currentUserRole === 'student' ? currentStudent?.id : undefined,
      });
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.title.toLowerCase().includes(q) ||
      p.studentName.toLowerCase().includes(q) ||
      p.registerNumber.toLowerCase().includes(q) ||
      p.techStack.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-cyan-400" />
            <span>AI & DS Project Submissions & Evaluations</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoring technical architectures, GitHub repositories, and faculty reviews across all four years.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUserRole === 'student' && onOpenSubmitModal && (
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Submit Project</span>
            </button>
          )}

          <button
            onClick={loadProjects}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, student name, technology stack (e.g. PyTorch, React, SQL)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-medium text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          {/* Year Filter */}
          {currentUserRole !== 'student' && (
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Years</option>
              <option value="First Year">First Year</option>
              <option value="Second Year">Second Year</option>
              <option value="Third Year">Third Year</option>
              <option value="Fourth Year">Fourth Year</option>
            </select>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Submitted">Submitted</option>
            <option value="Needs Changes">Needs Changes</option>
            <option value="Draft">Draft</option>
          </select>

          <span className="text-slate-500 text-xs ml-auto">
            Found <strong className="text-white">{filteredProjects.length}</strong> projects
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-indigo-400 mb-2" />
          <span>Loading project submissions...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 text-center text-slate-400 p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
          <FolderGit2 className="h-10 w-10 mx-auto text-slate-600 mb-2" />
          <p className="font-semibold text-white">No projects found</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting search keywords or status filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => onOpenProjectDetail(p)}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        p.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : p.status === 'Approved'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : p.status === 'Under Review'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : p.status === 'Needs Changes'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {p.status}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-1.5">
                      {p.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {p.description}
                </p>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5">
                  {p.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom footer */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div>
                  <span className="text-slate-300 font-semibold">{p.studentName}</span>
                  <span className="text-slate-500 font-mono ml-1">({p.registerNumber})</span>
                  <div className="text-[10px] text-slate-500">
                    {p.year} &bull; Sec {p.section}
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {p.liveDemoUrl && (
                    <a
                      href={p.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 text-cyan-300 hover:text-white transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => onOpenProjectDetail(p)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white text-[10px] font-semibold border border-indigo-500/30 transition-colors"
                  >
                    Review & Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
