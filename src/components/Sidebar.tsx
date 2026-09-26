import React from 'react';
import {
  LayoutDashboard,
  Target,
  BookOpen,
  Mic,
  TrendingUp,
  Flame,
  MapPin,
  CalendarCheck,
  Code2,
  HelpCircle,
  Gamepad2,
  FileText,
  Boxes,
  Briefcase,
  CheckSquare,
  Sparkles,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
}) => {
  const navSections = [
    {
      title: 'Core Platform',
      items: [
        { id: 'dashboard', label: 'Home Dashboard', icon: LayoutDashboard, badge: 'Main' },
        { id: 'assessment', label: 'Skill Assessment', icon: Target, badge: 'AI Test' },
        { id: 'learning-hub', label: 'Learning Hub', icon: BookOpen, badge: 'New' },
        { id: 'interview', label: 'Mock Interview', icon: Mic, badge: 'AI Voice' },
        { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
        { id: 'challenges', label: 'Daily Challenges', icon: Flame, badge: 'XP' },
      ],
    },
    {
      title: 'Preparation & Practice',
      items: [
        { id: 'roadmap', label: 'Learning Roadmap', icon: MapPin },
        { id: 'planner', label: 'Daily Study Planner', icon: CalendarCheck },
        { id: 'coding', label: 'Coding Practice (DSA)', icon: Code2 },
        { id: 'quizzes', label: 'Topic & Aptitude Quizzes', icon: HelpCircle },
        { id: 'games', label: 'Learning Mini-Games', icon: Gamepad2 },
      ],
    },
    {
      title: 'Career & Applications',
      items: [
        { id: 'resume', label: 'Resume ATS Analyzer', icon: FileText },
        { id: 'project', label: 'Project Story Pitcher', icon: Boxes },
        { id: 'jobs', label: 'Job Recommendations', icon: Briefcase },
        { id: 'tracker', label: 'Application Tracker', icon: CheckSquare },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#070b19]/80 backdrop-blur-2xl border-r border-cyan-500/20 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-sm">PlacementPilot AI</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Banner for Desktop */}
        <div className="hidden lg:flex items-center gap-3 p-5 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-cyan-200" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>PlacementPilot</span>
              <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1 rounded font-bold">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Placement Launchpad</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/15 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            isActive
                              ? 'bg-cyan-400 text-slate-950 shadow-xs'
                              : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quick Help Card */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#0c1228] to-[#161233] border border-cyan-500/20 text-center">
            <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Coach Nova Active</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Need instant interview coaching? Tap Nova in the bottom right!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
