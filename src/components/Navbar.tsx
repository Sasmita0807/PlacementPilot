import React from 'react';
import { UserProfile } from '../types';
import { Flame, Award, RefreshCw, UserCheck, Sparkles, LogIn, Edit3 } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  onOpenOnboarding: () => void;
  onOpenAuth: () => void;
  onResetDemo: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenOnboarding,
  onOpenAuth,
  onResetDemo,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#070b19]/80 backdrop-blur-xl border-b border-cyan-500/15 px-4 lg:px-8 py-3 transition-colors shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-cyan-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                PlacementPilot
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full shadow-xs">
                AI Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Campus Placement & Internship Launchpad</p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Streak Indicator with Flame */}
          <div
            onClick={() => setActiveTab('challenges')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 cursor-pointer hover:bg-amber-500/20 transition-all shadow-xs"
            title="Current Learning Streak (Click for Challenges & Badges)"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-xs font-bold">{user.streakDays} Day Streak</span>
          </div>

          {/* XP & Readiness */}
          <div className="hidden md:flex items-center gap-3 text-xs border-l border-r border-slate-800 px-4">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>
                <strong className="text-white font-bold">{user.totalXp}</strong> XP
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="text-slate-300">
              Readiness: <strong className="text-emerald-400 font-bold">{user.overallReadiness}%</strong>
            </div>
          </div>

          {/* Login / Auth Button */}
          <button
            onClick={onOpenAuth}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-all"
            title="Student Authentication & Role Calibration"
          >
            <LogIn className="w-3.5 h-3.5 text-purple-400" />
            <span>Login / Switch</span>
          </button>

          {/* Student Profile Pill */}
          <button
            onClick={onOpenOnboarding}
            title="Click to edit your name and student profile"
            className="flex items-center gap-2 text-left px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400/40 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              {user.name.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block text-xs">
              <div className="font-bold text-white truncate max-w-[120px] flex items-center gap-1 group-hover:text-cyan-300 transition-colors">
                <span>{user.name}</span>
                <Edit3 className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-cyan-400/80 text-[10px] truncate max-w-[120px]">{user.targetRole}</div>
            </div>
            <UserCheck className="w-3.5 h-3.5 text-slate-400 hidden lg:block group-hover:text-cyan-400 transition-colors" />
          </button>

          {/* Demo Reset Button */}
          <button
            onClick={onResetDemo}
            title="Reset database to demo baseline"
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 rounded-xl transition-all border border-slate-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
