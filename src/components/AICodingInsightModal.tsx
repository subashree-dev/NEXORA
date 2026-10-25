// Modal Dialog for the ONE AND ONLY ONE AI Feature:
// "AI Coding Progress Insight"
// Powered by Gemini 3.8 Flash (Server-Side)

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Calendar,
  Layers,
  FileCode2,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { Student, AICodingInsightResponse } from '../types';
import { api } from '../services/api';

interface AICodingInsightModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AICodingInsightModal: React.FC<AICodingInsightModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const [insight, setInsight] = useState<AICodingInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // When opened with a student, fetch or allow generating
  React.useEffect(() => {
    if (isOpen && student) {
      handleGenerate();
    } else {
      setInsight(null);
      setError(null);
    }
  }, [isOpen, student?.id]);

  const handleGenerate = async () => {
    if (!student) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAICodingInsight(student.id);
      setInsight(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI coding insight');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!insight) return;
    const text = `NEXORA - AI Coding Progress Insight
Student: ${insight.studentName} (${insight.registerNumber})
Year: ${insight.year}

PERFORMANCE SUMMARY:
${insight.performanceSummary}

STRENGTHS:
${insight.strengths.map((s) => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${insight.areasForImprovement.map((a) => `• ${a}`).join('\n')}

SUGGESTED CODING PRACTICE:
${insight.suggestedPractice.map((p) => `• ${p.topic}: ${p.targetProblems} (${p.rationale})`).join('\n')}

WEEKLY SCHEDULE:
${insight.weeklyScheduleSuggestion.map((w) => `• ${w}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/80 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/30 flex items-center justify-center shrink-0">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">AI Coding Progress Insight</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Target Student: <strong className="text-white">{student.name}</strong> &bull;{' '}
                <span className="font-mono text-cyan-300">{student.registerNumber}</span> &bull;{' '}
                <span>{student.year} (Sec {student.section})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {insight && (
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Copy Insight Text"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">LeetCode Solved</span>
              <span className="font-bold text-white text-sm">{student.codingStats.totalSolved} problems</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Difficulty Mix</span>
              <span className="font-semibold text-slate-300">
                {student.codingStats.easy}E &bull; {student.codingStats.medium}M &bull; {student.codingStats.hard}H
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">30-Day Activity</span>
              <span className="font-bold text-cyan-400 text-sm">
                {student.codingStats.recentActiveDays30} / 30 active days
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contest Rating</span>
              <span className="font-bold text-purple-400 text-sm">{student.codingStats.contestRating}</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-white">Analyzing coding data with Gemini...</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Evaluating algorithmic problem distribution, daily streak consistency, and project stacks.
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to generate insight</span>
              </div>
              <p>{error}</p>
              <button
                onClick={handleGenerate}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-500 transition-colors inline-block"
              >
                Retry Analysis
              </button>
            </div>
          )}

          {/* Result Content */}
          {insight && !loading && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* 1. Performance Summary */}
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
                  <FileCode2 className="h-4 w-4 text-indigo-400" />
                  <span>1. Coding Performance Summary</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {insight.performanceSummary}
                </p>
              </div>

              {/* 2 & 3. Strengths and Areas for Improvement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>2. Strengths</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {insight.strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs uppercase tracking-wider">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    <span>3. Areas for Improvement</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {insight.areasForImprovement.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 4. Suggested Coding Practice */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs uppercase tracking-wider">
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                  <span>4. Suggested Coding Practice</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {insight.suggestedPractice.map((practice, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5"
                    >
                      <div className="text-xs font-bold text-white truncate">{practice.topic}</div>
                      <div className="text-[11px] font-semibold text-cyan-400">
                        {practice.targetProblems}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{practice.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Weekly Routine */}
              {insight.weeklyScheduleSuggestion && insight.weeklyScheduleSuggestion.length > 0 && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs uppercase tracking-wider">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span>Recommended Weekly Practice Routine</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {insight.weeklyScheduleSuggestion.map((sched, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80"
                      >
                        <span className="text-purple-400 font-bold text-xs">{idx + 1}.</span>
                        <span>{sched}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pedagogical Compliance & Ethical Disclaimer */}
              <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Ethical Guardrail & Positioning:</span>
                </div>
                <p>
                  This AI feature strictly synthesizes code problem-solving metrics and algorithmic practice pathways.
                  It does <strong>not</strong> make placement predictions, job outcome forecasts, or subjective personal assessments.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-xs">
          <div className="text-slate-400 text-[11px]">
            {insight ? `Generated: ${new Date(insight.generatedAt).toLocaleTimeString()}` : ''}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate Insight</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
