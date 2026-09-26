import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  SkillGap,
  DailyTask,
  AssessmentResult,
} from '../types';
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Flame,
  Award,
  Sparkles,
  Target,
  Code2,
  Mic,
  FileText,
  Clock,
  Briefcase,
  BookOpen,
  Trophy,
  ArrowUpRight,
  Zap,
  BarChart2,
  Layers,
  Edit3,
  Check,
  X,
  UserCheck
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  skillGaps: SkillGap[];
  dailyTasks: DailyTask[];
  latestAssessment: AssessmentResult | null;
  onToggleTask: (taskId: string) => void;
  setActiveTab: (tab: string) => void;
  onUpdateUser?: (profile: Partial<UserProfile>) => Promise<void> | void;
  onOpenProfile?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  skillGaps,
  dailyTasks,
  latestAssessment,
  onToggleTask,
  setActiveTab,
  onUpdateUser,
  onOpenProfile,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSavedToast, setNameSavedToast] = useState(false);

  useEffect(() => {
    setEditedName(user.name);
  }, [user.name]);

  const handleSaveName = async () => {
    const trimmed = editedName.trim();
    if (!trimmed) return;
    if (trimmed === user.name) {
      setIsEditingName(false);
      return;
    }
    setIsSavingName(true);
    try {
      if (onUpdateUser) {
        await onUpdateUser({ name: trimmed });
      }
      setNameSavedToast(true);
      setTimeout(() => setNameSavedToast(false), 3000);
      setIsEditingName(false);
    } catch (err) {
      console.error('Failed to update name:', err);
    } finally {
      setIsSavingName(false);
    }
  };
  const topThreeTasks = dailyTasks.slice(0, 3);
  const completedTodayCount = dailyTasks.filter((t) => t.completed).length;

  const aptitudeScore = latestAssessment?.aptitudeScore ?? 78;
  const codingScore = latestAssessment?.codingScore ?? 68;
  const commScore = latestAssessment?.communicationScore ?? 84;
  const overallReadiness = user.overallReadiness ?? 74;

  const quickActionCards = [
    {
      id: 'assessment',
      title: 'Skill Assessment Engine',
      desc: 'Take timed multi-section tests and analyze gaps.',
      icon: Target,
      color: 'from-cyan-500/20 to-blue-500/10',
      border: 'border-cyan-500/30',
      accent: 'text-cyan-400',
    },
    {
      id: 'learning-hub',
      title: 'Learning Hub & Cheatsheets',
      desc: 'High-yield DSA patterns, Quant aptitude & Core CS.',
      icon: BookOpen,
      color: 'from-purple-500/20 to-indigo-500/10',
      border: 'border-purple-500/30',
      accent: 'text-purple-400',
    },
    {
      id: 'interview',
      title: 'AI Mock Interview Room',
      desc: 'Realistic HR & Tech simulations with STAR feedback.',
      icon: Mic,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-400',
    },
    {
      id: 'challenges',
      title: 'Daily Coding & Quizzes',
      desc: 'Solve today’s problem, maintain streak & unlock badges.',
      icon: Flame,
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
      accent: 'text-amber-400',
    },
    {
      id: 'resume',
      title: 'Resume ATS Optimizer',
      desc: 'Scan resume against target job descriptions.',
      icon: FileText,
      color: 'from-rose-500/20 to-pink-500/10',
      border: 'border-rose-500/30',
      accent: 'text-rose-400',
    },
    {
      id: 'progress',
      title: 'Cohort Progress Radar',
      desc: 'Benchmark your scores against college batch standards.',
      icon: TrendingUp,
      color: 'from-blue-500/20 to-indigo-500/10',
      border: 'border-blue-500/30',
      accent: 'text-blue-400',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b0f24] via-[#15123d] to-[#141d3b] border border-cyan-500/25 p-6 sm:p-8 shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 px-2.5 py-0.5 rounded-full">
                Target Role: {user.targetRole}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                {user.targetCompanyTier}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">Graduation 2026</span>
            </div>

            {isEditingName ? (
              <div className="flex flex-wrap items-center gap-2.5 py-1">
                <span className="text-xl sm:text-2xl font-bold text-white">Welcome,</span>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    autoFocus
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') {
                        setEditedName(user.name);
                        setIsEditingName(false);
                      }
                    }}
                    placeholder="Enter your name"
                    className="px-3.5 py-1.5 bg-[#090d21] border-2 border-cyan-400 text-white font-extrabold text-lg sm:text-xl rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-lg shadow-cyan-500/25 w-52 sm:w-64"
                  />
                </div>
                <button
                  type="button"
                  disabled={isSavingName || !editedName.trim()}
                  onClick={handleSaveName}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/30 transition-all cursor-pointer disabled:opacity-50"
                  title="Save your new name"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isSavingName ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditedName(user.name);
                    setIsEditingName(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  title="Cancel editing"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <span className="text-[11px] text-cyan-300/80 hidden sm:inline-block">Press Enter to save</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Welcome back,</span>
                  <span
                    onClick={() => setIsEditingName(true)}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 hover:brightness-125 cursor-pointer underline decoration-cyan-400/30 hover:decoration-cyan-400 underline-offset-4 transition-all"
                    title="Click here to change your name"
                  >
                    {user.name}
                  </span>
                  <span>!</span>
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition-all hover:scale-105 shadow-sm shadow-cyan-500/20 cursor-pointer"
                  title="Edit your name"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Change Name</span>
                </button>
                {nameSavedToast && (
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 rounded-lg animate-fadeIn flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Name updated!
                  </span>
                )}
              </div>
            )}
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Your placement diagnostic indicates a strong <strong className="text-cyan-300">{overallReadiness}% Placement Readiness</strong>. Complete your 3 daily priorities to protect your <strong className="text-amber-300">{user.streakDays}-day streak</strong> and close identified skill gaps.
            </p>
          </div>

          {/* Quick CTA Action Group */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="px-3.5 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                title="Edit your complete student profile, roles, and college info"
              >
                <UserCheck className="w-4 h-4 text-purple-400" />
                <span>Edit Profile</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('assessment')}
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Skill Diagnostic</span>
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-slate-950" />
              <span>Launch Mock Interview</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Metric Glow Cards */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/20 backdrop-blur-md">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Readiness</div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 mt-1">{overallReadiness}%</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>Target: 85%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/20 backdrop-blur-md">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Streak</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1 flex items-center gap-1.5">
              <span>{user.streakDays}</span>
              <Flame className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <div className="text-[11px] text-amber-400 font-semibold mt-1">Multiplier: +15% XP</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-purple-500/20 backdrop-blur-md">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total XP Earned</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 mt-1">{user.totalXp}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Award className="w-3 h-3 text-purple-400" />
              <span>Rank: Top 15%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/20 backdrop-blur-md">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Gaps</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">{skillGaps.length}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Prioritized for you</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Today's Goals (Left 7 cols) & Readiness Progress Charts (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Top 3 Goals Card */}
        <div className="lg:col-span-7 bg-[#0c1024]/90 border border-cyan-500/20 rounded-2xl p-6 relative backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Today's Top 3 Daily Goals</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Curated by AI to prevent overwhelm and target critical placement gaps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/25">
                {completedTodayCount} / {topThreeTasks.length} Done
              </span>
            </div>
          </div>

          {/* Goals List */}
          <div className="mt-4 space-y-3">
            {topThreeTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                  task.completed
                    ? 'bg-slate-950/60 border-emerald-500/30 text-slate-400'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/40 text-slate-200'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-semibold leading-snug truncate ${
                        task.completed ? 'line-through text-slate-500' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded shrink-0">
                      +{task.priority === 1 ? 30 : 20} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {task.estimatedMinutes} mins
                    </span>
                    <span>·</span>
                    <span className="capitalize text-slate-400">{task.category}</span>
                    <span>·</span>
                    <span
                      className={`font-semibold ${
                        task.priority === 1
                          ? 'text-rose-400'
                          : task.priority === 2
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {task.priority === 1 ? 'HIGH' : task.priority === 2 ? 'MEDIUM' : 'NORMAL'} PRIORITY
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Completed tasks automatically boost your learning streak and profile XP.
            </span>
            <button
              onClick={() => setActiveTab('planner')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>Full Study Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Competency & Progress Charts (Right 5 cols) */}
        <div className="lg:col-span-5 bg-[#0c1024]/90 border border-slate-800 rounded-2xl p-6 relative backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-bold text-white">Competency Progress Radar</h3>
            </div>
            <button
              onClick={() => setActiveTab('progress')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              View Analytics
            </button>
          </div>

          {/* Progress Bars for Core Areas */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Quantitative & Aptitude</span>
                <span className="text-amber-400 font-bold">{aptitudeScore}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${aptitudeScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Data Structures & Coding</span>
                <span className="text-purple-400 font-bold">{codingScore}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${codingScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Technical & STAR Communication</span>
                <span className="text-emerald-400 font-bold">{commScore}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${commScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Core Systems & CS Fundamentals</span>
                <span className="text-cyan-400 font-bold">75%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-700"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
          </div>

          {/* AI Gap Alert Widget */}
          {skillGaps.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 leading-relaxed space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Primary Gap: {skillGaps[0].skill}</span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2">
                {skillGaps[0].priorityAction}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Launchpad to All Features */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Placement Preparation Hub</span>
          </h3>
          <span className="text-xs text-slate-400">Click any module to jump in</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} to-slate-950/80 border ${card.border} hover:scale-[1.01] transition-all duration-200 cursor-pointer group shadow-sm flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 ${card.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold">
                  <span className={card.accent}>Launch Feature</span>
                  <span className="text-slate-400">Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
