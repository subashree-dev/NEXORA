import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { AuthUser } from '../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  currentUser: AuthUser;
  onOpenMobileMenu?: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  currentUser,
  onOpenMobileMenu,
  onLogout,
}) => {
  const roleBadgeColor =
    currentUser.role === 'HOD'
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : currentUser.role === 'Faculty'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-emerald-100 text-emerald-800 border-emerald-200';

  return (
    <header className="h-16 bg-[#eef2f6] border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between z-20 sticky top-0 shadow-[0_2px_8px_rgba(209,217,230,0.5)]">
      {/* Left: Mobile Menu + Title */}
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl neu-btn-secondary text-slate-700 hover:text-slate-900 focus:outline-none"
            aria-label="Open navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
              {title}
            </h1>
            <span
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${roleBadgeColor}`}
            >
              <ShieldCheck className="w-3 h-3" />
              {currentUser.role} Portal
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 truncate hidden md:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Authenticated User Info & Logout */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-semibold text-slate-900 leading-tight">
            {currentUser.name}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {currentUser.role === 'Student' && currentUser.registerNumber
              ? `Reg: ${currentUser.registerNumber}`
              : currentUser.department}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="neu-btn-secondary px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
          title="Sign out of NEXORA"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};
