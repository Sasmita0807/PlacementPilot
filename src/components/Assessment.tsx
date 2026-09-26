import React, { useState, useEffect } from 'react';
import { AssessmentResult, SkillGap, UserProfile } from '../types';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  RotateCcw,
  Zap,
  Target,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AssessmentProps {
  user: UserProfile;
  latestAssessment: AssessmentResult | null;
  skillGaps: SkillGap[];
  onSubmitAssessment: (scores: {
    aptitude: number;
    coding: number;
    communication: number;
    roleSpecific: number;
  }) => Promise<void>;
  setActiveTab: (tab: string) => void;
}

interface Question {
  id: string;
  category: 'aptitude' | 'coding' | 'communication' | 'roleSpecific';
  sectionLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ASSESSMENT_QUESTIONS: Question[] = [
  // Aptitude
  {
    id: 'a1',
    category: 'aptitude',
    sectionLabel: 'Quantitative & Logic',
    question: 'A shopkeeper marks an article 40% above cost price and allows a 20% discount. What is his net profit percentage?',
    options: ['12%', '14%', '16%', '20%'],
    correctIndex: 0,
    explanation: 'Let CP = 100. Marked Price = 140. Selling Price = 140 * 0.8 = 112. Profit = 112 - 100 = 12%.',
  },
  {
    id: 'a2',
    category: 'aptitude',
    sectionLabel: 'Quantitative & Logic',
    question: 'Six friends A, B, C, D, E, F are sitting in a circle facing the center. A is second to the left of C. B is between A and E. Who is directly opposite to C?',
    options: ['B', 'E', 'D', 'Cannot be determined'],
    correctIndex: 1,
    explanation: 'In a 6-person circle, opposite positions are separated by 3 seats. Placing A, B, E around C yields E opposite C.',
  },
  // Coding
  {
    id: 'c1',
    category: 'coding',
    sectionLabel: 'Coding Fundamentals & DSA',
    question: 'Which data structure is optimal for implementing an O(1) lookup and O(1) insert Least Recently Used (LRU) Cache?',
    options: [
      'Balanced Binary Search Tree',
      'Doubly Linked List + Hash Map',
      'Min-Heap + Array',
      'Circular Queue',
    ],
    correctIndex: 1,
    explanation: 'A Hash Map gives O(1) node reference access, and a Doubly Linked List allows O(1) node removal and insertion at head/tail.',
  },
  {
    id: 'c2',
    category: 'coding',
    sectionLabel: 'Coding Fundamentals & DSA',
    question: 'What is the recurrence relation and overall time complexity for Merge Sort?',
    options: [
      'T(n) = 2T(n/2) + O(n) -> O(n log n)',
      'T(n) = T(n-1) + O(n) -> O(n^2)',
      'T(n) = 2T(n/2) + O(1) -> O(n)',
      'T(n) = T(n/2) + O(log n) -> O(log n)',
    ],
    correctIndex: 0,
    explanation: 'Merge sort splits the array into two halves 2T(n/2) and takes linear time O(n) to merge the sorted sub-arrays, resulting in O(n log n).',
  },
  // Communication
  {
    id: 'cm1',
    category: 'communication',
    sectionLabel: 'Technical & STAR Communication',
    question: 'When asked "Tell me about a time you had a technical disagreement with a team member", which approach best demonstrates emotional intelligence and engineering maturity?',
    options: [
      'Explain that you were factually correct and escalated immediately to the professor/manager',
      'Structure using STAR: detail the disagreement objectively, how you collected benchmark data or ran a POC, and aligned on the best user outcome together',
      'State that you avoid all conflict by conceding to the other person immediately',
      'Change the subject to discuss your technical GitHub projects instead',
    ],
    correctIndex: 1,
    explanation: 'Top tier recruiters evaluate collaboration and data-driven conflict resolution. Running an objective benchmark or POC demonstrates maturity without personal ego.',
  },
  {
    id: 'cm2',
    category: 'communication',
    sectionLabel: 'Technical & STAR Communication',
    question: 'In an interview system design round, what should be your immediate first action after the interviewer gives you a vague problem statement?',
    options: [
      'Begin sketching database schema tables immediately on the whiteboard',
      'Ask clarifying questions to scope functional vs non-functional requirements (throughput, latency, read/write ratio)',
      'Recommend Kubernetes and Microservices right away',
      'Stay silent and wait for the interviewer to provide more details',
    ],
    correctIndex: 1,
    explanation: 'Clarifying ambiguity is the number one criteria in system design interviews. Scoping scale, constraints, and traffic patterns defines the correct architecture.',
  },
  // Role Specific
  {
    id: 'r1',
    category: 'roleSpecific',
    sectionLabel: 'Role-Specific Engineering Concepts',
    question: 'In distributed backend architectures, what does the CAP Theorem state you must sacrifice during a network partition (P)?',
    options: [
      'You must choose between Consistency (C) and Availability (A)',
      'You must sacrifice Latency for Security',
      'You must drop ACID transactions entirely',
      'You can maintain both full Consistency and 100% Availability with modern SSDs',
    ],
    correctIndex: 0,
    explanation: 'When a network partition occurs, a distributed system must either reject writes to preserve consistency (CP) or accept writes to remain available at the cost of stale reads (AP).',
  },
  {
    id: 'r2',
    category: 'roleSpecific',
    sectionLabel: 'Role-Specific Engineering Concepts',
    question: 'What is the primary benefit of Database Indexing using B+ Trees over Hash Indexes?',
    options: [
      'B+ Trees efficiently support range queries (BETWEEN, >, <) and ordered scans, while Hash Indexes only support point equality lookups',
      'B+ Trees require zero disk memory',
      'Hash indexes cannot handle string columns',
      'B+ Trees guarantee O(1) worst-case lookups',
    ],
    correctIndex: 0,
    explanation: 'Hash indexes only work for exact matches (equality). B+ Trees keep keys sorted in leaf nodes linked sequentially, enabling fast range scans.',
  },
];

export const Assessment: React.FC<AssessmentProps> = ({
  user,
  latestAssessment,
  skillGaps,
  onSubmitAssessment,
  setActiveTab,
}) => {
  const [inProgress, setInProgress] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(720); // 12 minutes timer

  useEffect(() => {
    let timer: any;
    if (inProgress && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [inProgress, secondsRemaining]);

  const startNewTest = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setSecondsRemaining(720);
    setInProgress(true);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const currentQ = ASSESSMENT_QUESTIONS[currentIdx];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let aptitudeCorrect = 0, aptitudeTotal = 0;
      let codingCorrect = 0, codingTotal = 0;
      let commCorrect = 0, commTotal = 0;
      let roleCorrect = 0, roleTotal = 0;

      ASSESSMENT_QUESTIONS.forEach((q) => {
        const isCorrect = selectedAnswers[q.id] === q.correctIndex;
        if (q.category === 'aptitude') {
          aptitudeTotal++;
          if (isCorrect) aptitudeCorrect++;
        } else if (q.category === 'coding') {
          codingTotal++;
          if (isCorrect) codingCorrect++;
        } else if (q.category === 'communication') {
          commTotal++;
          if (isCorrect) commCorrect++;
        } else if (q.category === 'roleSpecific') {
          roleTotal++;
          if (isCorrect) roleCorrect++;
        }
      });

      const scores = {
        aptitude: Math.round((aptitudeCorrect / (aptitudeTotal || 1)) * 100),
        coding: Math.round((codingCorrect / (codingTotal || 1)) * 100),
        communication: Math.round((commCorrect / (commTotal || 1)) * 100),
        roleSpecific: Math.round((roleCorrect / (roleTotal || 1)) * 100),
      };

      await onSubmitAssessment(scores);
      setInProgress(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1224] via-[#16123a] to-[#12193b] border border-cyan-500/20 p-6 sm:p-8 shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Section Diagnostic Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              AI Skill Assessment & Gap Radar
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Timed comprehensive diagnostic evaluating Quantitative Aptitude, Data Structures & Coding, Technical Communication, and {user.targetRole} systems.
            </p>
          </div>

          {!inProgress && (
            <button
              onClick={startNewTest}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>{latestAssessment ? 'Retake Full Diagnostic' : 'Start Diagnostic Assessment'}</span>
            </button>
          )}
        </div>
      </div>

      {/* In-Progress Testing View */}
      {inProgress ? (
        <div className="bg-[#0b1021]/90 border border-cyan-500/25 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
          {/* Diagnostic Active Top Bar with Live Timer & Question Navigator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Section: {currentQ.sectionLabel}
              </span>
              <h3 className="text-sm font-semibold text-white mt-0.5">
                Question {currentIdx + 1} of {totalQuestions}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Countdown Timer */}
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold shadow-xs ${
                  secondsRemaining < 180
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-cyan-300'
                }`}
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Time Left: {formatTimer(secondsRemaining)}</span>
              </div>

              <div className="text-xs font-semibold text-slate-400">
                Answered: <strong className="text-cyan-400">{answeredCount}</strong> / {totalQuestions}
              </div>
            </div>
          </div>

          {/* Question Navigator Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ASSESSMENT_QUESTIONS.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = selectedAnswers[q.id] !== undefined;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shrink-0 border ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-500/20'
                      : isAnswered
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((answeredCount) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Body */}
          <div className="space-y-4 pt-2">
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </p>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-3.5 border ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-200 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                          : 'border-slate-700 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-xs text-slate-400 font-medium">
              Review answers anytime before submitting
            </div>

            {currentIdx < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIdx((p) => p + 1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Calculating AI Gap Analysis...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Analyze Gaps</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : latestAssessment ? (
        /* Results View */
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-[#0b1021]/90 border border-cyan-500/20 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  Assessment Completed · {latestAssessment.date}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
                  Overall Placement Readiness: <span className="text-cyan-300">{latestAssessment.overallScore}%</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Benchmarked against 2026 campus recruitment criteria for {user.targetCompanyTier} companies.
                </p>
              </div>

              {/* Score Gauge Circle */}
              <div className="flex items-center gap-4">
                <div className="text-center p-5 bg-gradient-to-b from-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl min-w-[130px] shadow-lg shadow-cyan-950/30">
                  <div className="text-3xl font-black text-cyan-300">{latestAssessment.overallScore}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Placement Ready
                  </div>
                </div>
              </div>
            </div>

            {/* Section Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Aptitude & Logic</div>
                <div className="text-2xl font-black text-amber-300 mt-1">{latestAssessment.aptitudeScore}%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${latestAssessment.aptitudeScore}%` }} />
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Coding & DSA</div>
                <div className="text-2xl font-black text-purple-300 mt-1">{latestAssessment.codingScore}%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: `${latestAssessment.codingScore}%` }} />
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Communication</div>
                <div className="text-2xl font-black text-emerald-300 mt-1">{latestAssessment.communicationScore}%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${latestAssessment.communicationScore}%` }} />
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Role Specific</div>
                <div className="text-2xl font-black text-cyan-300 mt-1">{latestAssessment.roleSpecificScore}%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${latestAssessment.roleSpecificScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Gap Analysis & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weak Areas vs Strong Areas */}
            <div className="bg-[#0b1021]/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Diagnostic Strengths & Weak Areas</span>
              </h3>

              <div>
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Identified Weak Areas:</div>
                <ul className="space-y-2">
                  {latestAssessment.weakAreas?.map((item, idx) => (
                    <li key={idx} className="text-xs text-rose-200 flex items-start gap-2 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                      <span className="text-rose-400 font-bold shrink-0">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Validated Strengths:</div>
                <ul className="space-y-2">
                  {latestAssessment.strongAreas?.map((item, idx) => (
                    <li key={idx} className="text-xs text-emerald-200 flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Action Recommendations */}
            <div className="bg-[#0b1021]/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Gemini Prioritized Action Recommendations</span>
              </h3>

              <div className="space-y-2.5">
                {latestAssessment.recommendations?.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <span>Sync With Learning Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0b1021]/90 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <Brain className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Assessment Completed Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
            Take our timed placement diagnostic to calculate your exact readiness score and generate your personalized gap analysis.
          </p>
          <button
            onClick={startNewTest}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 transition-all"
          >
            Start Diagnostic Now
          </button>
        </div>
      )}
    </div>
  );
};
