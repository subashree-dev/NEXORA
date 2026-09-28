// Navigation Sidebar for NEXORA
// Department of Artificial Intelligence and Data Science - Easwari Engineering College

import React from 'react';
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  FolderGit2,
  Sparkles,
  Award,
  UserCheck,
  BarChart3,
  Flame,
  FileCode2,
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  yearFilter: string;
  onYearFilterChange: (year: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onTabChange,
  yearFilter,
  onYearFilterChange,
}) => {
  // Navigation config per role as specified in user prompt
  const facultyNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'coding-intelligence', label: 'Coding Intelligence', icon: Flame },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'ai-insight', label: 'AI Coding Insight', icon: Sparkles, badge: 'Gemini AI' },
  ];

  const studentNav: NavItem[] = [
    { id: 'my-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'my-coding', label: 'My Coding Stats', icon: FileCode2 },
    { id: 'my-projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'my-certifications', label: 'My Certifications', icon: Award },
    { id: 'my-profile', label: 'My Profile', icon: UserCheck },
  ];

  const hodNav: NavItem[] = [
    { id: 'hod-dashboard', label: 'Department Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'coding-analytics', label: 'Coding Analytics', icon: Flame },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'year-overview', label: 'Year-wise Overview', icon: BarChart3 },
    { id: 'ai-insight', label: 'AI Coding Insight', icon: Sparkles, badge: 'Gemini AI' },
  ];

  const currentNav =
    currentRole === 'faculty' ? facultyNav : currentRole === 'student' ? studentNav : hodNav;

  const academicYears = ['All', 'First Year', 'Second Year', 'Third Year', 'Fourth Year'];

  return (
    <aside className="w-64 shrink-0 bg-slate-950/70 border-r border-slate-800/80 flex flex-col justify-between p-4 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Active Role Card */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Current Session
          </div>
          {currentRole === 'faculty' && (
            <div className="mt-1.5">
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Prof. Vignesh K</span>
              </div>
              <div className="text-xs text-indigo-400">Faculty Coordinator</div>
              <div className="text-[11px] text-slate-400 mt-0.5">AI & DS Department</div>
            </div>
          )}
          {currentRole === 'student' && (
            <div className="mt-1.5">
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Ananya Krishnan</span>
              </div>
              <div className="text-xs text-cyan-400 font-mono">Reg: 310625243001</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Second Year &bull; Section A</div>
            </div>
          )}
          {currentRole === 'hod' && (
            <div className="mt-1.5">
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Dr. A. Saravanan</span>
              </div>
              <div className="text-xs text-purple-400">Professor & Head (HOD)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">AI & DS Department</div>
            </div>
          )}
        </div>

        {/* Year Filter Quick Switcher (For Faculty & HOD) */}
        {(currentRole === 'faculty' || currentRole === 'hod') && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Department Year Filter</span>
              {yearFilter !== 'All' && (
                <button
                  onClick={() => onYearFilterChange('All')}
                  className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {academicYears.map((yr) => (
                <button
                  key={yr}
                  onClick={() => onYearFilterChange(yr)}
                  className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-all text-center truncate ${
                    yearFilter === yr
                      ? 'bg-indigo-600/90 text-white font-semibold shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {yr === 'All' ? 'All Years' : yr.replace(' Year', ' Yr')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Primary Navigation Menu */}
        <nav className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
            Navigation
          </div>
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/80 text-white shadow-md shadow-indigo-900/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-semibold border border-cyan-400/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Department Badge */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
          <BrainCircuit className="h-3.5 w-3.5 text-cyan-400" />
          <span>Centralized Intelligence</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Replaces disconnected Google Sheets with live coding & project monitoring.
        </p>
      </div>
    </aside>
  );
};
