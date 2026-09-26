import React, { useState, useEffect } from 'react';
import { DailyTask, UserProfile } from '../types';
import {
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Flame,
  Sparkles,
  Award,
} from 'lucide-react';

interface DailyPlannerProps {
  user: UserProfile;
  dailyTasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Partial<DailyTask>) => void;
  setActiveTab: (tab: string) => void;
}

export const DailyPlanner: React.FC<DailyPlannerProps> = ({
  user,
  dailyTasks,
  onToggleTask,
  onAddTask,
  setActiveTab,
}) => {
  // Focus Pomodoro Timer State (25 minutes = 1500 seconds)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [selectedTaskForTimer, setSelectedTaskForTimer] = useState<DailyTask | null>(
    dailyTasks[0] || null
  );

  // New task form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'DSA' | 'Aptitude' | 'Mock' | 'Project' | 'Core CS'>('DSA');
  const [newMinutes, setNewMinutes] = useState(30);

  const [timerNotification, setTimerNotification] = useState<string | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      if (timerMode === 'focus') {
        setTimerNotification('🎉 Great work! 25-minute study sprint complete. Take a 5-minute break!');
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        setTimerNotification('Break over! Ready for the next focus sprint?');
        setTimerMode('focus');
        setTimerSeconds(25 * 60);
      }
      setTimeout(() => setTimerNotification(null), 5000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, timerMode]);

  const toggleTimer = () => setTimerRunning((p) => !p);

  const resetTimer = (mode: 'focus' | 'break') => {
    setTimerRunning(false);
    setTimerMode(mode);
    setTimerSeconds(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle,
      description: newDesc || 'Targeted placement preparation exercise',
      category: newCategory,
      difficulty: 'Medium',
      estimatedMinutes: Number(newMinutes),
    });
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const top3 = dailyTasks.slice(0, 3);
  const additionalTasks = dailyTasks.slice(3);
  const completedCount = dailyTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {user.streakDays} Days Consistent
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Study Planner & Focus Sprint</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            We limit your daily plan to <strong className="text-slate-800">Top 3 high-impact tasks</strong> to eliminate cognitive overload and build consistent daily interview habits.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Daily Task
        </button>
      </div>

      {/* Grid: Tasks + Pomodoro Focus Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top 3 Daily Priorities (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Today&apos;s Top 3 Priorities
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                {completedCount} of {dailyTasks.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {top3.map((task, idx) => {
                const isSelected = selectedTaskForTimer?.id === task.id;
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                      task.completed
                        ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                        : isSelected
                        ? 'bg-indigo-50/40 border-indigo-300 ring-1 ring-indigo-200 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4
                            className={`text-sm font-semibold truncate ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h4>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimatedMinutes}m
                        </span>
                      </div>

                      <p className={`text-xs mt-1 leading-relaxed ${task.completed ? 'text-slate-400' : 'text-slate-600'}`}>
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100/70 text-[11px]">
                        <span className="text-slate-500 font-medium">
                          {task.category} · {task.difficulty}
                        </span>

                        {!task.completed && (
                          <button
                            onClick={() => setSelectedTaskForTimer(task)}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                          >
                            Focus with Timer →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional backlog */}
            {additionalTasks.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Secondary / Stretch Tasks
                </div>
                {additionalTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <button onClick={() => onToggleTask(task.id)}>
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <span className={task.completed ? 'line-through text-slate-400' : 'font-medium text-slate-800'}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-slate-400">{task.estimatedMinutes}m</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Focus Timer / Pomodoro (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-5">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => resetTimer('focus')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  timerMode === 'focus' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                25m Focus Sprint
              </button>
              <button
                onClick={() => resetTimer('break')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  timerMode === 'break' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                5m Quick Break
              </button>
            </div>

            {/* Notification Banner */}
            {timerNotification && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-semibold animate-fadeIn">
                {timerNotification}
              </div>
            )}

            {/* Current Active Task Banner */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-left">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Active Focus Target</div>
              <div className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {selectedTaskForTimer ? selectedTaskForTimer.title : 'Select a daily priority task above'}
              </div>
            </div>

            {/* Giant Digits */}
            <div className="py-4">
              <div className="font-mono text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-wider">
                {formatTimer(timerSeconds)}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                {timerRunning ? 'Timer active — stay in deep focus!' : 'Ready to start your preparation session'}
              </div>
            </div>

            {/* Timer Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleTimer}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause Session
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Start Sprint
                  </>
                )}
              </button>
              <button
                onClick={() => resetTimer(timerMode)}
                className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Completing daily priorities grants +40 XP & safeguards streak.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Add Daily Focus Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Practice 3 Sliding Window questions"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Description</label>
                <textarea
                  placeholder="Key patterns to remember or specific problem links..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  >
                    <option value="DSA">DSA / LeetCode</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Mock">Mock Interview</option>
                    <option value="Core CS">Core CS (OS/DBMS/CN)</option>
                    <option value="Project">Project & Resume</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
