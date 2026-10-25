// Student Profile Detailed Modal for NEXORA
// Department of Artificial Intelligence and Data Science - Easwari Engineering College

import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Award,
  Briefcase,
  FolderGit2,
  Github,
  Mail,
  CheckCircle,
  Clock,
  Code2,
  Flame,
  Info,
  Layers,
} from 'lucide-react';
import { Student, Project } from '../types';
import { api } from '../services/api';
import { DifficultyBar, ActivitySparkline } from './charts/Charts';

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAIInsight: (student: Student) => void;
  onOpenProjectDetail?: (project: Project) => void;
  onStudentUpdated?: (updated: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onOpenAIInsight,
  onOpenProjectDetail,
  onStudentUpdated,
}) => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(student);
  const [studentProjects, setStudentProjects] = useState<Project[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    setCurrentStudent(student);
    if (student) {
      loadStudentDetails(student.id);
    }
  }, [student?.id, isOpen]);

  const loadStudentDetails = async (id: string) => {
    try {
      const data = await api.getStudentById(id);
      setCurrentStudent(data);
      setStudentProjects(data.projects || []);
    } catch (err) {
      console.error('Error loading student details:', err);
    }
  };

  const handleSyncCodingStats = async () => {
    if (!currentStudent) return;
    setIsSyncing(true);
    setSyncSuccessMsg(null);
    try {
      const res = await api.syncCodingStats(currentStudent.id);
      if (res.success) {
        const updated = {
          ...currentStudent,
          codingStats: res.updatedStats,
        };
        setCurrentStudent(updated);
        onStudentUpdated?.(updated);
        setSyncSuccessMsg(`Synchronized live stats at ${new Date(res.syncedAt).toLocaleTimeString()}`);
        setTimeout(() => setSyncSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen || !currentStudent) return null;

  const { codingStats, transparentReadiness } = currentStudent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Strip */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="font-extrabold text-xl text-white">
                  {currentStudent.name.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white">{currentStudent.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {currentStudent.registerNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    codingStats.codingStatus === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : codingStats.codingStatus === 'Moderate'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : codingStats.codingStatus === 'Low Activity'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {codingStats.codingStatus}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                <span>{currentStudent.year} &bull; Section {currentStudent.section}</span>
                <span>&bull;</span>
                <a
                  href={`mailto:${currentStudent.email}`}
                  className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{currentStudent.email}</span>
                </a>
                <span>&bull;</span>
                <a
                  href={currentStudent.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:underline"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAIInsight(currentStudent)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-cyan-300 animate-pulse" />
              <span>Generate AI Coding Insight</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Synchronize bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="h-4 w-4 text-indigo-400" />
              <span>
                Last Synced:{' '}
                <strong className="text-white font-mono">
                  {new Date(codingStats.lastSynced).toLocaleString()}
                </strong>
              </span>
              {syncSuccessMsg && (
                <span className="ml-2 text-emerald-400 font-medium animate-in fade-in">
                  &bull; {syncSuccessMsg}
                </span>
              )}
            </div>

            <button
              onClick={handleSyncCodingStats}
              disabled={isSyncing}
              className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-medium hover:text-white transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-cyan-300' : ''}`} />
              <span>{isSyncing ? 'Syncing Platforms...' : 'Sync Coding Stats'}</span>
            </button>
          </div>

          {/* Coding Platforms & Statistics Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-400" />
                <span>Coding Platforms & Performance</span>
              </h3>
              <div className="flex items-center gap-3 text-xs">
                <a
                  href={currentStudent.leetcodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-amber-400 hover:underline"
                >
                  <span>LeetCode Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-slate-600">|</span>
                <a
                  href={currentStudent.hackerrankUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  <span>HackerRank Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Total Solved</span>
                <span className="text-2xl font-black text-white">{codingStats.totalSolved}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">LeetCode problems</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-emerald-400 block">Easy</span>
                <span className="text-2xl font-bold text-emerald-400">{codingStats.easy}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Fundamentals</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-amber-400 block">Medium</span>
                <span className="text-2xl font-bold text-amber-400">{codingStats.medium}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Core algorithms</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-rose-400 block">Hard</span>
                <span className="text-2xl font-bold text-rose-400">{codingStats.hard}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Complex DP & Graphs</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-purple-400 block">Contest Rating</span>
                <span className="text-2xl font-bold text-purple-400">{codingStats.contestRating}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Competitive tier</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-cyan-400 block">Acceptance</span>
                <span className="text-2xl font-bold text-cyan-400">{codingStats.acceptanceRate}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Submission accuracy</span>
              </div>
            </div>

            {/* HackerRank & Difficulty Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <div className="text-xs font-semibold text-slate-300">LeetCode Difficulty Distribution</div>
                <DifficultyBar
                  easy={codingStats.easy}
                  medium={codingStats.medium}
                  hard={codingStats.hard}
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>HackerRank Portfolio</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    Score: {codingStats.hackerrankScore}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                  <div className="text-emerald-300 font-semibold">{codingStats.hackerrankStatus}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Badges: <strong className="text-white">{codingStats.hackerrankBadges} verified domain badges</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coding Progress Chart (Weekly activity over last 8 weeks) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Flame className="h-4 w-4 text-orange-400" />
                <span>Coding Progress (Weekly Problem Solving Cadence)</span>
              </div>
              <span className="text-xs text-cyan-400 font-medium">
                Active on {codingStats.recentActiveDays30} of the last 30 days
              </span>
            </div>
            <div className="pt-2">
              <ActivitySparkline data={codingStats.weeklyActivity} height={70} strokeColor="#06b6d4" />
            </div>
          </div>

          {/* Transparent Readiness Indicator (STRICTLY RULES-BASED, NOT AI PREDICTION) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/30 border border-indigo-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
                <Layers className="h-4 w-4 text-indigo-400" />
                <span>Transparent Placement Readiness Indicator</span>
              </div>
              <div className="text-xs font-extrabold text-white">
                Score: <span className="text-cyan-400 text-sm font-mono">{transparentReadiness.score} / 100</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Deterministic, rules-based score derived directly from contributing milestones (Not an AI prediction):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Coding Progress (Max 40)</span>
                <span className="font-bold text-white text-sm">{transparentReadiness.factors.coding} pts</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Project Delivery (Max 30)</span>
                <span className="font-bold text-white text-sm">{transparentReadiness.factors.projects} pts</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Certifications (Max 15)</span>
                <span className="font-bold text-white text-sm">{transparentReadiness.factors.certifications} pts</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Internship (Max 15)</span>
                <span className="font-bold text-white text-sm">{transparentReadiness.factors.internship} pts</span>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-indigo-400" />
                <span>Department Projects ({studentProjects.length})</span>
              </h3>
            </div>

            {studentProjects.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                No project submissions logged for this student yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {studentProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onOpenProjectDetail?.(p)}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{p.description}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
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
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {p.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                      <span>Submitted: {p.submissionDate}</span>
                      <div className="flex items-center gap-3">
                        {p.docFileName && (
                          <span className="text-slate-300 underline font-mono text-[10px]">
                            {p.docFileName}
                          </span>
                        )}
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <Github className="h-3 w-3" />
                            <span>Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certifications & Internships */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Certifications */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span>Verified Certifications ({currentStudent.certifications.length})</span>
              </h3>
              <div className="space-y-2">
                {currentStudent.certifications.length === 0 ? (
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-500">
                    No certifications registered yet.
                  </div>
                ) : (
                  currentStudent.certifications.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                        <span>{c.provider}</span>
                        <span>{c.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Internships */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                <span>Industry Internships ({currentStudent.internships.length})</span>
              </h3>
              <div className="space-y-2">
                {currentStudent.internships.length === 0 ? (
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-500">
                    No active internships recorded.
                  </div>
                ) : (
                  currentStudent.internships.map((int) => (
                    <div key={int.id} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-white">
                        <span>{int.company}</span>
                        <span className="text-[11px] text-cyan-400 font-normal">{int.duration}</span>
                      </div>
                      <div className="text-[11px] text-slate-300">{int.role}</div>
                      {int.description && (
                        <p className="text-[10px] text-slate-400">{int.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Student Register Number: <span className="text-slate-200 font-mono font-semibold">{currentStudent.registerNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 font-medium hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
