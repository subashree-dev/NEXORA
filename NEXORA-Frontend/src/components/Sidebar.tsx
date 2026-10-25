import React from "react";
import {
  LayoutDashboard,
  Trophy,
  Code2,
  TrendingUp,
  Building2,
  GitCompare,
  Users,
  FileSpreadsheet,
  LogOut,
  X,
  ShieldCheck,
} from "lucide-react";
import { AuthUser, UserRole } from "../types";
import { Avatar } from "./Avatar";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: AuthUser;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  // Determine modules strictly based on authenticated role
  let navItems: NavItem[] = [];

  if (currentUser.role === "Student") {
    // EXACTLY TWO MODULES FOR STUDENT
    navItems = [
      { id: "student-dashboard", label: "My Dashboard", icon: LayoutDashboard },
      { id: "student-rank", label: "My Rank", icon: Trophy },
    ];
  } else if (currentUser.role === "Faculty") {
    // THREE MODULES FOR FACULTY
    navItems = [
      {
        id: "faculty-dashboard",
        label: "Faculty Dashboard",
        icon: LayoutDashboard,
      },
      { id: "faculty-monitor", label: "Student Coding Monitor", icon: Code2 },
      {
        id: "faculty-rankings",
        label: "Class Progress & Rankings",
        icon: TrendingUp,
      },
    ];
  } else if (currentUser.role === "HOD") {
    // FOUR MODULES FOR HOD
    navItems = [
      { id: "hod-overview", label: "Department Overview", icon: Building2 },
      {
        id: "hod-comparison",
        label: "Year & Section Comparison",
        icon: GitCompare,
      },
      { id: "hod-monitoring", label: "Student Monitoring", icon: Users },
      { id: "hod-reports", label: "Department Reports", icon: FileSpreadsheet },
    ];
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#eef2f6] border-r border-slate-200/80 flex flex-col shrink-0 select-none transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl neu-card flex items-center justify-center p-1 shadow-[3px_3px_7px_#d1d9e6,-3px_-3px_7px_#ffffff]">
                <img
                  src="/Easwari_Engineering_College_logo.png"
                  alt="Easwari Engineering College logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
                  NEXORA
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  AI & DS Coding Platform
                </span>
              </div>
            </div>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-xl neu-btn-secondary text-slate-500 hover:text-slate-800"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-medium truncate">EEC SRM RMP Campus</span>
            <span className="px-2 py-0.5 rounded-md neu-inset text-blue-700 font-semibold text-[10px]">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {currentUser.role} Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? "neu-inset text-blue-700 font-semibold border border-blue-200/60"
                    : "neu-raised text-slate-700 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-blue-600" : "text-slate-500"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout (No Role Switcher) */}
        <div className="p-3.5 border-t border-slate-200/70 bg-[#eef2f6]">
          <div className="neu-card p-3 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="sm"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600 inline shrink-0" />
                  {currentUser.role}
                  {currentUser.role === "Student" && currentUser.section
                    ? ` · Sec ${currentUser.section}`
                    : ""}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg neu-btn-secondary text-slate-500 hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
