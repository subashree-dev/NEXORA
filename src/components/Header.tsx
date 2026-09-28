// Header Component for NEXORA
// Institution: Easwari Engineering College - Department of Artificial Intelligence and Data Science

import React from 'react';
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Code2,
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onSelectDemoStep?: (stepIndex: number) => void;
  activeDemoStep?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onSelectDemoStep,
  activeDemoStep = 0,
}) => {
  const [showDemoGuide, setShowDemoGuide] = React.useState(false);

  const demoSteps = [
    { title: '1. Faculty Login', desc: 'Active role: Faculty' },
    { title: '2. Faculty Dashboard', desc: 'Overview metrics & charts' },
    { title: '3. Select Second Year', desc: 'Filter department data' },
    { title: '4. Open Students', desc: 'Department student directory' },
    { title: '5. Search Student', desc: 'Find Ananya Krishnan' },
    { title: '6. Open Student Profile', desc: 'View complete portfolio' },
    { title: '7. LeetCode Statistics', desc: 'Solved, Easy, Med, Hard' },
    { title: '8. Coding Progress', desc: 'Weekly cadence & sync' },
    { title: '9. View Projects', desc: 'MobileNetV3 Plant AI & more' },
    { title: '10. Project Review', desc: 'Inspect documentation & status' },
    { title: '11. Generate AI Insight', desc: 'Single AI feature (Gemini)' },
    { title: '12. AI Recommendations', desc: 'Performance summary & plan' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0b1329]/95 backdrop-blur-md border-b border-indigo-950/80">
      {/* Top institution branding bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Code2 className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                NEXORA
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI & DS Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Easwari Engineering College &bull; <span className="text-slate-300">Dept. of Artificial Intelligence & Data Science</span>
            </p>
          </div>
        </div>

        {/* User Role Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-xs text-slate-400 mr-1 hidden sm:inline">Role View:</div>
          <div className="inline-flex p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => onRoleChange('faculty')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentRole === 'faculty'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Faculty</span>
              <span className="text-[10px] opacity-75 hidden lg:inline">(Prof. Vignesh)</span>
            </button>

            <button
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentRole === 'student'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Student</span>
              <span className="text-[10px] opacity-75 hidden lg:inline">(Ananya K)</span>
            </button>

            <button
              onClick={() => onRoleChange('hod')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentRole === 'hod'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>HOD Portal</span>
              <span className="text-[10px] opacity-75 hidden lg:inline">(Dr. Saravanan)</span>
            </button>
          </div>

          <button
            onClick={() => setShowDemoGuide(!showDemoGuide)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 hover:bg-indigo-900/60 hover:text-white transition-colors"
            title="Demonstration Workflow Guide"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Demo Flow</span>
            <HelpCircle className="h-3 w-3 opacity-60" />
          </button>
        </div>
      </div>

      {/* College Project Demonstration Walkthrough Drawer */}
      {showDemoGuide && (
        <div className="bg-slate-900/95 border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-3 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  College Project Demonstration Flow (12 Steps)
                </span>
                <span className="text-[11px] text-slate-400">
                  Click any step to jump directly to that part of the demonstration:
                </span>
              </div>
              <button
                onClick={() => setShowDemoGuide(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Close &times;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {demoSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectDemoStep?.(idx);
                  }}
                  className={`text-left p-2 rounded-lg border text-xs transition-all ${
                    activeDemoStep === idx
                      ? 'bg-indigo-600/30 border-indigo-400 text-white font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="font-semibold text-slate-200 text-[11px] truncate">{step.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{step.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
