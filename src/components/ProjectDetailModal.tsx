// Project Details and Faculty Review Modal for NEXORA

import React, { useState } from 'react';
import {
  X,
  FolderGit2,
  Github,
  ExternalLink,
  FileText,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Project, ProjectStatus, UserRole } from '../types';
import { api } from '../services/api';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  onProjectUpdated?: (updated: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  currentUserRole,
  onProjectUpdated,
}) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(project);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('Submitted');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    setCurrentProject(project);
    if (project) {
      setSelectedStatus(project.status);
      setReviewNotes(project.reviewNotes || '');
    }
  }, [project, isOpen]);

  if (!isOpen || !currentProject) return null;

  const isFacultyOrHod = currentUserRole === 'faculty' || currentUserRole === 'hod';

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const reviewerName =
        currentUserRole === 'hod'
          ? 'Dr. A. Saravanan (HOD)'
          : 'Prof. Vignesh K (Faculty Evaluator)';

      const updated = await api.updateProject(currentProject.id, {
        status: selectedStatus,
        reviewNotes,
        reviewerName,
      });

      setCurrentProject(updated);
      onProjectUpdated?.(updated);
      alert('Project review status updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update project');
    } finally {
      setIsUpdating(false);
    }
  };

  const allStatuses: ProjectStatus[] = [
    'Draft',
    'Submitted',
    'Under Review',
    'Approved',
    'Needs Changes',
    'Completed',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-indigo-950/40 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
              <FolderGit2 className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  currentProject.status === 'Completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : currentProject.status === 'Approved'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : currentProject.status === 'Under Review'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : currentProject.status === 'Needs Changes'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {currentProject.status}
              </span>
              <h3 className="text-base font-bold text-white mt-1">{currentProject.title}</h3>
              <p className="text-xs text-slate-400">
                Submitted by <strong>{currentProject.studentName}</strong> (
                <span className="font-mono text-cyan-400">{currentProject.registerNumber}</span>) &bull;{' '}
                {currentProject.year} Sec {currentProject.section}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Project Abstract & Scope
            </label>
            <p className="text-slate-300 text-sm leading-relaxed p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              {currentProject.description}
            </p>
          </div>

          {/* Technology Stack */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Technology Stack
            </label>
            <div className="flex flex-wrap gap-1.5">
              {currentProject.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-200 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links & Documentation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Repository & Demo
              </span>
              <div className="space-y-1">
                {currentProject.githubUrl ? (
                  <a
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-cyan-400 hover:underline font-medium truncate"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>{currentProject.githubUrl}</span>
                  </a>
                ) : (
                  <span className="text-slate-500">No GitHub URL provided</span>
                )}

                {currentProject.liveDemoUrl && (
                  <a
                    href={currentProject.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:underline font-medium truncate"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{currentProject.liveDemoUrl}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Project Documentation & Specs
              </span>
              <div className="flex items-center gap-2 text-slate-300">
                <FileText className="h-4 w-4 text-indigo-400" />
                <span className="font-mono text-cyan-300 truncate">
                  {currentProject.docFileName || 'Project_Documentation.pdf'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{currentProject.documentation}</p>
            </div>
          </div>

          {/* Faculty Review Section */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <span>Department Faculty Evaluation & Review</span>
              </div>
              {currentProject.reviewerName && (
                <span className="text-[11px] text-slate-400">
                  Reviewed by: <strong className="text-slate-200">{currentProject.reviewerName}</strong>
                </span>
              )}
            </div>

            {isFacultyOrHod ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Set Project Review Status:</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {allStatuses.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStatus(st)}
                        className={`px-2 py-1.5 rounded-lg text-center text-[11px] font-medium transition-all ${
                          selectedStatus === st
                            ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Faculty Feedback / Review Notes:</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                    placeholder="Provide constructive feedback, required revisions, or commendations..."
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving Review...' : 'Save Evaluation Status'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-slate-300 text-xs">
                <div className="text-[11px] text-slate-400">Feedback from Faculty Evaluator:</div>
                <p className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 italic">
                  "{currentProject.reviewNotes || 'Project is currently awaiting departmental review.'}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Last Updated: <strong className="text-slate-200">{currentProject.lastUpdated}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
