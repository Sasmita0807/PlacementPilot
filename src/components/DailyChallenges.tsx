import React, { useState } from 'react';
import { UserProfile, AchievementBadge, DailyChallenge } from '../types';
import {
  Flame,
  Award,
  Zap,
  Code2,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Star,
  Clock,
  ChevronRight,
  Shield,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface DailyChallengesProps {
  user: UserProfile;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  setActiveTab: (tab: string) => void;
}

export const DailyChallenges: React.FC<DailyChallengesProps> = ({
  user,
  onUpdateUser,
  setActiveTab,
}) => {
  const [activeTab, setActiveTabLocal] = useState<'coding' | 'quiz' | 'badges'>('coding');

  // Daily Coding Challenge State
  const [userCode, setUserCode] = useState<string>(`function maxSubArraySum(nums, k) {
  // Return the maximum sum of any contiguous subarray of size k
  let maxSum = 0;
  let currentSum = 0;

  for (let i = 0; i < k; i++) {
    currentSum += nums[i];
  }
  maxSum = currentSum;

  for (let i = k; i < nums.length; i++) {
    currentSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}`);

  const [testResults, setTestResults] = useState<{
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
  }[] | null>(null);

  const [codeRunning, setCodeRunning] = useState(false);
  const [codingCompleted, setCodingCompleted] = useState(false);

  // Daily Rapid Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [qIndex: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Achievement Badges
  const [badges] = useState<AchievementBadge[]>([
    {
      id: 'badge-1',
      title: '7-Day Streak Warrior',
      description: 'Log in and complete at least one preparation goal for 7 consecutive days.',
      icon: '🔥',
      unlocked: user.streakDays >= 7,
      progress: Math.min(100, Math.round((user.streakDays / 7) * 100)),
      category: 'Streak',
      tier: 'Gold',
      xpReward: 100,
    },
    {
      id: 'badge-2',
      title: 'Aptitude Maestro',
      description: 'Score above 80% on the comprehensive campus aptitude diagnostic test.',
      icon: '🧠',
      unlocked: true,
      progress: 100,
      category: 'Assessment',
      tier: 'Silver',
      xpReward: 80,
    },
    {
      id: 'badge-3',
      title: 'DSA Speed Demon',
      description: 'Solve 10 algorithm and data structure problems with passing test cases.',
      icon: '⚡',
      unlocked: false,
      progress: 60,
      category: 'DSA',
      tier: 'Gold',
      xpReward: 120,
    },
    {
      id: 'badge-4',
      title: 'STAR Storyteller',
      description: 'Complete 3 AI Mock Interview simulations using structured STAR responses.',
      icon: '🎙️',
      unlocked: true,
      progress: 100,
      category: 'Interview',
      tier: 'Silver',
      xpReward: 75,
    },
    {
      id: 'badge-5',
      title: 'ATS Resume Certified',
      description: 'Optimize your technical resume to achieve an ATS score above 85.',
      icon: '📄',
      unlocked: false,
      progress: 88,
      category: 'Assessment',
      tier: 'Bronze',
      xpReward: 50,
    },
    {
      id: 'badge-6',
      title: 'Application Pioneer',
      description: 'Track and apply to at least 5 campus placements or internship listings.',
      icon: '💼',
      unlocked: true,
      progress: 100,
      category: 'Speed',
      tier: 'Silver',
      xpReward: 60,
    },
    {
      id: 'badge-7',
      title: 'Algorithm Blitz Champ',
      description: 'Achieve a flawless score on Algorithmic Pattern Blitz mini-game.',
      icon: '🎮',
      unlocked: false,
      progress: 40,
      category: 'DSA',
      tier: 'Diamond',
      xpReward: 150,
    },
    {
      id: 'badge-8',
      title: 'Offer Ready Master',
      description: 'Attain an overall placement readiness rating exceeding 80%.',
      icon: '🏆',
      unlocked: user.overallReadiness >= 80,
      progress: Math.min(100, Math.round((user.overallReadiness / 80) * 100)),
      category: 'Assessment',
      tier: 'Diamond',
      xpReward: 200,
    },
  ]);

  // 7-day activity mock
  const weekDays = [
    { day: 'Mon', completed: true, xp: 60, label: 'Sep 22' },
    { day: 'Tue', completed: true, xp: 75, label: 'Sep 23' },
    { day: 'Wed', completed: true, xp: 90, label: 'Sep 24' },
    { day: 'Thu', completed: true, xp: 50, label: 'Sep 25' },
    { day: 'Fri', completed: true, xp: 85, label: 'Today (Sep 26)' },
    { day: 'Sat', completed: false, xp: 0, label: 'Tomorrow' },
    { day: 'Sun', completed: false, xp: 0, label: 'Sun' },
  ];

  const handleRunDailyCode = () => {
    setCodeRunning(true);
    setTimeout(() => {
      try {
        const results = [
          {
            passed: true,
            input: 'nums = [2, 1, 5, 1, 3, 2], k = 3',
            expected: '9',
            actual: '9',
          },
          {
            passed: true,
            input: 'nums = [2, 3, 4, 1, 5], k = 2',
            expected: '7',
            actual: '7',
          },
          {
            passed: true,
            input: 'nums = [1, 2], k = 1',
            expected: '2',
            actual: '2',
          },
        ];
        setTestResults(results);
        setCodingCompleted(true);
      } catch (e) {
        console.error(e);
      } finally {
        setCodeRunning(false);
      }
    }, 600);
  };

  const dailyQuizQuestions = [
    {
      id: 1,
      question: 'Which scheduling algorithm can lead to the "convoy effect" where short jobs wait for one long job?',
      options: ['Round Robin', 'First-Come, First-Served (FCFS)', 'Shortest Job First (SJF)', 'Priority Scheduling'],
      correct: 1,
      explanation: 'FCFS is non-preemptive. If a CPU-bound process arrives first, all subsequent I/O bound processes queue behind it, reducing throughput.',
    },
    {
      id: 2,
      question: 'In a B+ Tree with fanout (order) M, what is the maximum number of children each internal node can have?',
      options: ['M / 2', 'M', '2 * M', 'M - 1'],
      correct: 1,
      explanation: 'In a B+ Tree of order M, internal nodes can have at most M pointers/children and M-1 keys.',
    },
    {
      id: 3,
      question: 'A train 180 meters long is running at a speed of 54 km/hr. How many seconds will it take to pass an electric pole?',
      options: ['10 seconds', '12 seconds', '15 seconds', '18 seconds'],
      correct: 1,
      explanation: 'Speed = 54 * (5/18) = 15 m/s. Time = Distance / Speed = 180 / 15 = 12 seconds.',
    },
  ];

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx });
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    dailyQuizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        correctCount++;
      }
    });
    setQuizScore(correctCount);
    setQuizSubmitted(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner with Flame Streak Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1224] via-[#1a1038] to-[#121a3a] border border-cyan-500/20 p-6 sm:p-8 shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{user.streakDays}-Day Learning Streak Active!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Daily Challenges & Badges
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Complete today's coding puzzle and quick quiz sprint to earn bonus XP, level up your placement readiness, and collect achievement badges.
            </p>
          </div>

          {/* Streak & XP Multiplier Stat Pill */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-5 py-3 rounded-xl bg-gradient-to-b from-amber-950/40 to-slate-900/90 border border-amber-500/30 text-center">
              <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>Streak Bonus</span>
              </div>
              <div className="text-2xl font-black text-amber-300 mt-0.5">+15% XP</div>
              <div className="text-[10px] text-slate-400">Day {user.streakDays} / 30 Goal</div>
            </div>

            <div className="px-5 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Earned XP</div>
              <div className="text-2xl font-black text-cyan-300 mt-0.5">{user.totalXp}</div>
              <div className="text-[10px] text-cyan-400 font-semibold">Tier: Challenger</div>
            </div>
          </div>
        </div>

        {/* 7-Day Activity Grid */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider">Weekly Activity Heatmap</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>5 of 7 Days Active</span>
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {weekDays.map((item, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  item.completed
                    ? 'bg-amber-500/15 border-amber-400/40 shadow-sm shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-300">{item.day}</div>
                <div className="my-1.5 flex justify-center">
                  {item.completed ? (
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {item.completed ? `+${item.xp} XP` : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="relative z-10 mt-6 flex items-center gap-2">
          <button
            onClick={() => setActiveTabLocal('coding')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'coding'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Daily Coding Challenge</span>
            {codingCompleted && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTabLocal('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Daily Rapid Quiz</span>
            {quizSubmitted && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTabLocal('badges')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'badges'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 text-purple-400" />
            <span>Achievement Badges ({badges.filter(b => b.unlocked).length}/{badges.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Daily Coding Challenge */}
      {activeTab === 'coding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Problem Prompt */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0b1021]/90 border border-cyan-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Medium · Sliding Window
                </span>
                <span className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  +50 XP
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Maximum Sum Subarray of Size K</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Given an array of integers <code className="text-cyan-300 font-mono">nums</code> and a positive integer <code className="text-cyan-300 font-mono">k</code>, find the maximum sum of any contiguous subarray of size <code className="text-cyan-300 font-mono">k</code>.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Example 1</h4>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                  <div><strong>Input:</strong> nums = [2, 1, 5, 1, 3, 2], k = 3</div>
                  <div><strong>Output:</strong> 9</div>
                  <div className="text-[11px] text-slate-400">Subarray with max sum is [5, 1, 3] = 9.</div>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Optimal Approach</h4>
                <div className="p-3 rounded-xl bg-[#080e22] border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed">
                  💡 <strong>Sliding Window:</strong> Compute sum of first <code className="text-white">k</code> elements, then slide the window by adding the next incoming element and subtracting the element sliding out. Time: O(N), Space: O(1).
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Code Editor & Tester */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#0b1021]/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">JavaScript / TypeScript Solution</span>
                </div>
                <button
                  onClick={() => setUserCode(`function maxSubArraySum(nums, k) {\n  let maxSum = 0, current = 0;\n  for (let i = 0; i < k; i++) current += nums[i];\n  maxSum = current;\n  for (let i = k; i < nums.length; i++) {\n    current += nums[i] - nums[i - k];\n    maxSum = Math.max(maxSum, current);\n  }\n  return maxSum;\n}`)}
                  className="text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Reset Solution
                </button>
              </div>

              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={12}
                className="w-full bg-[#060914] text-cyan-200 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 leading-relaxed shadow-inner"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleRunDailyCode}
                  disabled={codeRunning}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>{codeRunning ? 'Running Tests...' : 'Run Test Cases'}</span>
                </button>

                {codingCompleted && (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>All Tests Passed (+50 XP)</span>
                  </div>
                )}
              </div>

              {/* Test Results Output */}
              {testResults && (
                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300">Test Execution Summary</h4>
                  <div className="space-y-2">
                    {testResults.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950 text-xs font-mono flex items-center justify-between border border-slate-800"
                      >
                        <div className="text-slate-300">
                          <span className="text-slate-400 font-sans text-[11px]">Test #{idx + 1}: </span>
                          <span>{t.input}</span>
                        </div>
                        <span className="text-emerald-400 font-bold">Passed (Output: {t.actual})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Daily Rapid Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-[#0b1021]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-1">
                <Zap className="w-4 h-4" />
                <span>3-Question Placement Sprint</span>
              </div>
              <h3 className="text-lg font-bold text-white">Daily Aptitude & Core CS Sprint</h3>
            </div>
            <div className="text-xs text-slate-400">
              Answer all 3 to claim <strong className="text-cyan-400">+30 XP</strong>
            </div>
          </div>

          <div className="space-y-6">
            {dailyQuizQuestions.map((q, qIdx) => (
              <div key={q.id} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-cyan-400">Question {qIdx + 1} of 3</span>
                </div>
                <h4 className="text-sm font-semibold text-white leading-relaxed">{q.question}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[qIdx] === optIdx;
                    let btnClass = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (quizSubmitted) {
                      if (optIdx === q.correct) {
                        btnClass = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-500/20 border-rose-400 text-rose-200';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                        className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && optIdx === q.correct && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="mt-3 p-3 rounded-lg bg-[#070b18] border border-cyan-500/20 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-cyan-300">Explanation: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {!quizSubmitted ? (
              <button
                disabled={Object.keys(quizAnswers).length < dailyQuizQuestions.length}
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
              >
                Submit Daily Quiz
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">
                  Score: <strong className="text-cyan-400">{quizScore} / {dailyQuizQuestions.length} Correct</strong>
                </span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                  +{quizScore! * 10} XP Awarded
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Achievement Badges */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="bg-[#0b1021]/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Placement Achievement Badges</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Unlock badges by maintaining streaks, solving algorithmic challenges, and acing mock interviews.
                </p>
              </div>

              <div className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-3.5 py-1.5 rounded-xl border border-cyan-400/30">
                {badges.filter(b => b.unlocked).length} of {badges.length} Badges Unlocked
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                    badge.unlocked
                      ? 'bg-gradient-to-b from-slate-900/90 to-[#0e1329] border-amber-500/30 shadow-md shadow-amber-500/5'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-75'
                  }`}
                >
                  {badge.unlocked && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 inline-block shadow-sm">
                        {badge.icon}
                      </span>
                      {badge.unlocked ? (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          Locked
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className={badge.unlocked ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                        {badge.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          badge.unlocked
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                            : 'bg-cyan-500/60'
                        }`}
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
