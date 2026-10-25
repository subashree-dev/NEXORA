import React, { useState, useEffect } from 'react';
import {
  Code2,
  ExternalLink,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Save,
  User,
  Info,
} from 'lucide-react';
import {
  Student,
  AICodingInsight,
  PlacementReadinessSummary,
} from '../types';
import {
  fetchMyProfile,
  saveMyLeetCodeUsername,
  fetchMyPlacementReadiness,
  fetchMyAICodingInsight,
} from '../utils/api';
import { Avatar } from '../components/Avatar';

export const StudentDashboardPage: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [readiness, setReadiness] = useState<PlacementReadinessSummary | null>(null);
  const [insight, setInsight] = useState<AICodingInsight | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // LeetCode connect input state
  const [inputUsername, setInputUsername] = useState('');
  const [savingLeetCode, setSavingLeetCode] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [profileData, readinessData, insightData] = await Promise.all([
        fetchMyProfile(),
        fetchMyPlacementReadiness(),
        fetchMyAICodingInsight(),
      ]);

      setStudent(profileData);
      setReadiness(readinessData);
      setInsight(insightData);
      setInputUsername(profileData.profiles?.leetcode?.username || '');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load your student dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveLeetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUsername.trim()) return;

    setSavingLeetCode(true);
    setSaveSuccessMsg(null);
    try {
      const res = await saveMyLeetCodeUsername(inputUsername.trim());
      setStudent(res.student);
      setSaveSuccessMsg('LeetCode username connected and saved.');
      // Refresh readiness and insight with new stats
      const [newReadiness, newInsight] = await Promise.all([
        fetchMyPlacementReadiness(),
        fetchMyAICodingInsight(),
      ]);
      setReadiness(newReadiness);
      setInsight(newInsight);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect LeetCode profile');
    } finally {
      setSavingLeetCode(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-medium">Loading your student dashboard...</p>
      </div>
    );
  }

  if (errorMsg && !student) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="neu-card p-6 rounded-2xl text-red-700 bg-red-50/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">Unable to Load Dashboard</h3>
            <p className="text-xs mt-1">{errorMsg}</p>
            <button
              onClick={loadData}
              className="mt-3 px-3 py-1.5 rounded-xl neu-btn-primary text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!student) return null;

  const total = student.codingStats.totalSolved;
  const easy = student.codingStats.easySolved;
  const medium = student.codingStats.mediumSolved;
  const hard = student.codingStats.hardSolved;
  const hasConnectedLeetCode = Boolean(student.profiles?.leetcode?.username);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* 1. Student Identity Card */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <Avatar
              src={student.avatar}
              name={student.name}
              size="xl"
              className="w-14 h-14 rounded-2xl text-base shadow-[2px_2px_5px_#d1d9e6,-2px_-2px_5px_#ffffff]"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {student.name}
              </h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg neu-inset text-blue-800 font-semibold">
                {student.registerNumber}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-1">
              Department of {student.department} · Year {student.year} · Section {student.section}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              College Email: <span className="font-mono text-slate-700">{student.email}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end justify-center text-xs text-slate-600 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200/60">
          <span className="text-[11px] text-slate-500 font-medium">Batch Cohort</span>
          <span className="font-bold text-slate-800 mt-0.5">{student.batch}</span>
          <span className="text-[11px] text-slate-500 mt-0.5">Mentor: {student.mentor}</span>
        </div>
      </div>

      {/* 2. LeetCode Profile & Problem-Solving Progress */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl neu-card flex items-center justify-center text-blue-600 shadow-[2px_2px_5px_#d1d9e6,-2px_-2px_5px_#ffffff]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                LeetCode Profile & Progress
              </h2>
              <p className="text-xs text-slate-500">
                Track problem counts and sync status
              </p>
            </div>
          </div>

          {hasConnectedLeetCode && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg neu-inset text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connected
              </span>
              <a
                href={student.profiles.leetcode.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="neu-btn-primary px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open LeetCode Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Username Connect Form */}
        <form onSubmit={handleSaveLeetCode} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            LeetCode Username
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter your LeetCode handle (e.g. aditya_codes_99)"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl neu-input text-xs font-mono text-slate-900 placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={savingLeetCode || !inputUsername.trim()}
              className="neu-btn-secondary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Save className="w-3.5 h-3.5 text-blue-600" />
              <span>{savingLeetCode ? 'Connecting...' : 'Connect / Save'}</span>
            </button>
          </div>

          {saveSuccessMsg && (
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveSuccessMsg}
            </p>
          )}
        </form>

        {/* Telemetry Breakdown Cards */}
        {hasConnectedLeetCode ? (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Total Solved */}
              <div className="p-3.5 rounded-xl neu-inset text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Total Solved
                </span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5 block">
                  {total}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Problems</span>
              </div>

              {/* Easy Solved */}
              <div className="p-3.5 rounded-xl neu-inset text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                  Easy
                </span>
                <span className="text-2xl font-extrabold text-emerald-800 font-mono mt-0.5 block">
                  {easy}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {total > 0 ? `${Math.round((easy / total) * 100)}% of total` : '0%'}
                </span>
              </div>

              {/* Medium Solved */}
              <div className="p-3.5 rounded-xl neu-inset text-center">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">
                  Medium
                </span>
                <span className="text-2xl font-extrabold text-amber-800 font-mono mt-0.5 block">
                  {medium}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {total > 0 ? `${Math.round((medium / total) * 100)}% of total` : '0%'}
                </span>
              </div>

              {/* Hard Solved */}
              <div className="p-3.5 rounded-xl neu-inset text-center">
                <span className="text-[10px] uppercase font-bold text-red-700 block">
                  Hard
                </span>
                <span className="text-2xl font-extrabold text-red-800 font-mono mt-0.5 block">
                  {hard}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {total > 0 ? `${Math.round((hard / total) * 100)}% of total` : '0%'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 px-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Last activity date: <strong>{student.codingStats.lastActiveDate || 'Recorded'}</strong>
              </span>
              <span>
                Streak: <strong>{student.codingStats.currentStreak || 0} days</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl neu-inset text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">No LeetCode profile connected yet.</p>
            <p>Enter your LeetCode username above and click Connect to link your profile.</p>
          </div>
        )}
      </div>

      {/* 3. Placement Readiness (Clean User-Facing Design - No Technical OLS Jargon) */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl neu-card flex items-center justify-center text-blue-600 shadow-[2px_2px_5px_#d1d9e6,-2px_-2px_5px_#ffffff]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Placement Readiness
              </h2>
              <p className="text-xs text-slate-500">
                Technical assessment readiness indicator
              </p>
            </div>
          </div>

          <span className="text-[11px] px-2.5 py-0.5 rounded-lg neu-inset text-blue-800 font-semibold font-mono">
            {readiness?.status || 'Active'}
          </span>
        </div>

        {readiness && readiness.isAvailable ? (
          <div className="p-4 sm:p-5 rounded-xl neu-inset space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  Estimated Technical Placement Score
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 font-mono tracking-tight">
                    {readiness.predictedScore}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-600 font-medium">
                <div>Problems Solved: <strong className="text-slate-900 font-mono">{readiness.totalSolved}</strong></div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Audited Date: {readiness.lastAuditDate}
                </div>
              </div>
            </div>

            {/* Simple Horizontal Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-slate-200/80 rounded-full overflow-hidden p-0.5 neu-inset">
                <div
                  style={{ width: `${readiness.predictedScore}%` }}
                  className="h-full bg-blue-600 rounded-full transition-all duration-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                <span>Foundational</span>
                <span>Developing</span>
                <span>Placement Ready</span>
              </div>
            </div>

            {/* Supporting Plain-Language Text */}
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {readiness.explanation}
            </p>
          </div>
        ) : (
          <div className="p-6 rounded-xl neu-inset text-center text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-700">Placement Readiness Score Unavailable</p>
            <p>
              Connect your LeetCode profile with at least one verified solved problem to calculate your estimated placement readiness score.
            </p>
          </div>
        )}
      </div>

      {/* 4. Exactly One AI Coding Insight Card */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Your Coding Insight</h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md neu-inset text-slate-600 font-medium">
            {insight?.source === 'gemini' ? 'AI Mentor Insight' : 'Department Baseline'}
          </span>
        </div>

        {insight ? (
          <div className="p-4 rounded-xl neu-inset space-y-2.5">
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              "{insight.interpretation}"
            </p>
            <div className="pt-2 border-t border-slate-200/50 flex items-start gap-2 text-xs text-blue-900">
              <TrendingUp className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Next Step:</strong> {insight.recommendation}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Connecting to coding evaluation service...
          </p>
        )}
      </div>
    </div>
  );
};
