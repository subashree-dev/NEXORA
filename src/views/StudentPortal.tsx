// Student Portal View for NEXORA
// Demonstrating Ananya Krishnan (Register No: 310625243001)
// Students can ONLY view and edit their own private data.

import React, { useState } from 'react';
import {
  Sparkles,
  Code2,
  FolderGit2,
  Award,
  UserCheck,
  RefreshCw,
  ExternalLink,
  Github,
  Plus,
  Clock,
  Flame,
  CheckCircle2,
  Save,
  Layers,
} from 'lucide-react';
import { Student, Project } from '../types';
import { api } from '../services/api';
import { DifficultyBar, ActivitySparkline } from '../components/charts/Charts';

interface StudentPortalProps {
  student: Student;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenSubmitProject: () => void;
  onOpenProjectDetail: (project: Project) => void;
  onStudentUpdated: (updated: Student) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  activeTab,
  onTabChange,
  onOpenSubmitProject,
  onOpenProjectDetail,
  onStudentUpdated,
}) => {
  const [currentStudent, setCurrentStudent] = useState<Student>(student);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  // Profile Edit State
  const [leetcodeUrl, setLeetcodeUrl] = useState(student.leetcodeUrl);
  const [hackerrankUrl, setHackerrankUrl] = useState(student.hackerrankUrl);
  const [githubUrl, setGithubUrl] = useState(student.githubUrl);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // New certification modal/form state
  const [showAddCert, setShowAddCert] = useState(false);
  const [certName, setCertName] = useState('');
  const [certProvider, setCertProvider] = useState('');
  const [certDate, setCertDate] = useState('');

  React.useEffect(() => {
    setCurrentStudent(student);
    setLeetcodeUrl(student.leetcodeUrl);
    setHackerrankUrl(student.hackerrankUrl);
    setGithubUrl(student.githubUrl);
    loadStudentProjects(student.id);
  }, [student.id]);

  const loadStudentProjects = async (id: string) => {
    try {
      const data = await api.getProjects({ studentId: id });
      setProjects(data);
    } catch (err) {
      console.error('Error fetching student projects:', err);
    }
  };

  const handleSyncStats = async () => {
    setIsSyncing(true);
    setSyncMsg(null);
    try {
      const res = await api.syncCodingStats(currentStudent.id);
      if (res.success) {
        const updated = {
          ...currentStudent,
          codingStats: res.updatedStats,
        };
        setCurrentStudent(updated);
        onStudentUpdated(updated);
        setSyncMsg(`Coding stats synced at ${new Date(res.syncedAt).toLocaleTimeString()}`);
        setTimeout(() => setSyncMsg(null), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveProfileLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setSaveMsg(null);
    try {
      const updated = await api.updateStudent(currentStudent.id, {
        leetcodeUrl: leetcodeUrl.trim(),
        hackerrankUrl: hackerrankUrl.trim(),
        githubUrl: githubUrl.trim(),
      });
      setCurrentStudent(updated);
      onStudentUpdated(updated);
      setSaveMsg('Profile links updated successfully!');
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !certProvider.trim()) return;

    const newCert = {
      id: `cert-${Date.now()}`,
      name: certName.trim(),
      provider: certProvider.trim(),
      date: certDate.trim() || 'Current Term',
    };

    const updatedCerts = [...currentStudent.certifications, newCert];
    try {
      const updated = await api.updateStudent(currentStudent.id, {
        certifications: updatedCerts,
      });
      setCurrentStudent(updated);
      onStudentUpdated(updated);
      setCertName('');
      setCertProvider('');
      setCertDate('');
      setShowAddCert(false);
    } catch (err: any) {
      alert(err.message || 'Failed to add certification');
    }
  };

  const { codingStats, transparentReadiness } = currentStudent;

  return (
    <div className="space-y-6">
      {/* Student Welcome Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/40 border border-cyan-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="font-extrabold text-2xl text-cyan-300">
                {currentStudent.name.charAt(0)}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{currentStudent.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {currentStudent.registerNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Easwari Engineering College &bull; Department of Artificial Intelligence and Data Science &bull;{' '}
              <span className="text-slate-300 font-medium">{currentStudent.year} (Section {currentStudent.section})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncStats}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Coding Stats'}</span>
          </button>
        </div>
      </div>

      {/* Synchronized alert feedback */}
      {syncMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <span>{syncMsg}</span>
          <span className="text-[10px] text-emerald-400 font-mono">Status: Connected</span>
        </div>
      )}

      {/* Sub-Tabs Selector */}
      <div className="flex border-b border-slate-800 text-xs font-medium space-x-2">
        {[
          { id: 'my-dashboard', label: 'My Dashboard' },
          { id: 'my-coding', label: 'My Coding' },
          { id: 'my-projects', label: 'My Projects' },
          { id: 'my-certifications', label: 'My Certifications' },
          { id: 'my-profile', label: 'My Profile' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-3 px-3.5 transition-all border-b-2 font-semibold ${
              activeTab === tab.id
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MY DASHBOARD */}
      {activeTab === 'my-dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold block">LeetCode Solved</span>
              <div className="text-3xl font-black text-white mt-1 font-mono">{codingStats.totalSolved}</div>
              <span className="text-[11px] text-cyan-400 block mt-1">
                {codingStats.easy} Easy &bull; {codingStats.medium} Med &bull; {codingStats.hard} Hard
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-purple-400 uppercase font-semibold block">Contest Rating</span>
              <div className="text-3xl font-black text-purple-300 mt-1 font-mono">{codingStats.contestRating}</div>
              <span className="text-[11px] text-slate-400 block mt-1">Acceptance: {codingStats.acceptanceRate}%</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-indigo-400 uppercase font-semibold block">Submitted Projects</span>
              <div className="text-3xl font-black text-indigo-300 mt-1 font-mono">{projects.length}</div>
              <span className="text-[11px] text-slate-400 block mt-1">
                {projects.filter((p) => p.status === 'Completed' || p.status === 'Approved').length} Approved/Done
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-emerald-400 uppercase font-semibold block">Readiness Score</span>
              <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">
                {transparentReadiness.score} / 100
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">Deterministic metric</span>
            </div>
          </div>

          {/* Difficulty & Weekly Sparkline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-400" />
                <span>My LeetCode Problem Solved Breakdown</span>
              </h3>
              <DifficultyBar
                easy={codingStats.easy}
                medium={codingStats.medium}
                hard={codingStats.hard}
              />
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span>Recent Problem Solving Cadence</span>
                </h3>
                <span className="text-xs text-cyan-400">
                  {codingStats.recentActiveDays30} active days in past month
                </span>
              </div>
              <ActivitySparkline data={codingStats.weeklyActivity} height={70} strokeColor="#06b6d4" />
            </div>
          </div>

          {/* Transparent Readiness Explanation */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" />
                <span>Transparent Technical Readiness Breakdown</span>
              </h3>
              <span className="text-xs font-bold text-cyan-400">{transparentReadiness.score} / 100 points</span>
            </div>
            <p className="text-xs text-slate-400">
              Your score is computed transparently from four verifiable milestone achievements:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Coding (Max 40)</span>
                <span className="font-bold text-white text-base">{transparentReadiness.factors.coding} pts</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Projects (Max 30)</span>
                <span className="font-bold text-white text-base">{transparentReadiness.factors.projects} pts</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Certifications (Max 15)</span>
                <span className="font-bold text-white text-base">{transparentReadiness.factors.certifications} pts</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Internships (Max 15)</span>
                <span className="font-bold text-white text-base">{transparentReadiness.factors.internship} pts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY CODING */}
      {activeTab === 'my-coding' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-cyan-400" />
                  <span>Coding Platform URLs & Credentials</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your official LeetCode and HackerRank profile handles to automate department monitoring.
                </p>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Last Synced: {new Date(codingStats.lastSynced).toLocaleString()}
              </div>
            </div>

            <form onSubmit={handleSaveProfileLinks} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">LeetCode Profile URL</label>
                  <input
                    type="url"
                    value={leetcodeUrl}
                    onChange={(e) => setLeetcodeUrl(e.target.value)}
                    placeholder="https://leetcode.com/u/ananya_k/"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">HackerRank Profile URL</label>
                  <input
                    type="url"
                    value={hackerrankUrl}
                    onChange={(e) => setHackerrankUrl(e.target.value)}
                    placeholder="https://hackerrank.com/ananyakrishnan"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {saveMsg && <div className="text-emerald-400 text-xs font-medium">{saveMsg}</div>}

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Coding Profiles'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* HackerRank Detail Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>HackerRank Verified Domain Badges</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-emerald-300">{codingStats.hackerrankStatus}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Leaderboard Score: <strong className="text-white">{codingStats.hackerrankScore}</strong> &bull;{' '}
                  {codingStats.hackerrankBadges} verified domain badges
                </div>
              </div>
              <a
                href={codingStats.hackerrankStatus ? currentStudent.hackerrankUrl : '#'}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View HackerRank</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MY PROJECTS */}
      {activeTab === 'my-projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                My Submitted Projects ({projects.length})
              </h3>
              <p className="text-xs text-slate-400">
                Track status updates and faculty evaluation notes for your academic projects.
              </p>
            </div>
            <button
              onClick={onOpenSubmitProject}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Submit New Project</span>
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => onOpenProjectDetail(p)}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-white hover:text-cyan-300 transition-colors">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
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

                <div className="flex flex-wrap gap-1.5">
                  {p.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Feedback Note from Faculty */}
                {p.reviewNotes && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Faculty Evaluator Feedback ({p.reviewerName || 'AI & DS Faculty Committee'}):
                    </span>
                    <p className="text-slate-300 mt-0.5 italic">"{p.reviewNotes}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MY CERTIFICATIONS */}
      {activeTab === 'my-certifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                My Verified Certifications ({currentStudent.certifications.length})
              </h3>
              <p className="text-xs text-slate-400">
                Industry certifications in AI, Machine Learning, Cloud, and Data Engineering.
              </p>
            </div>
            <button
              onClick={() => setShowAddCert(!showAddCert)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Certification</span>
            </button>
          </div>

          {showAddCert && (
            <form
              onSubmit={handleAddCertSubmit}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-in fade-in"
            >
              <h4 className="font-bold text-white">Log New Certification</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Certification Name (e.g. AWS ML Specialty)"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Issuing Provider (e.g. Coursera, NPTEL, AWS)"
                  value={certProvider}
                  onChange={(e) => setCertProvider(e.target.value)}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Completion Month/Year (e.g. Sept 2024)"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCert(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentStudent.certifications.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-sm">{c.name}</div>
                <div className="text-xs text-cyan-400">{c.provider}</div>
                <div className="text-[11px] text-slate-500">Issued: {c.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MY PROFILE */}
      {activeTab === 'my-profile' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Student Academic Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Full Name</span>
              <span className="font-bold text-white text-sm">{currentStudent.name}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Department Register Number</span>
              <span className="font-mono font-bold text-cyan-300 text-sm">{currentStudent.registerNumber}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Institution & Department</span>
              <span className="font-medium text-slate-200">
                Easwari Engineering College &bull; AI & DS
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Batch & Class</span>
              <span className="font-medium text-slate-200">
                {currentStudent.year} &bull; Section {currentStudent.section}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">College Email Address</span>
              <span className="font-mono text-slate-300">{currentStudent.email}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">GitHub Profile</span>
              <a
                href={currentStudent.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-cyan-400 hover:underline"
              >
                {currentStudent.githubUrl}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
