import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  BookOpen,
  Brain,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  RotateCw,
  Search,
  Bookmark,
  Share2,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';

interface LearningHubProps {
  user: UserProfile;
  setActiveTab: (tab: string) => void;
}

interface ModuleTopic {
  id: string;
  title: string;
  category: 'aptitude' | 'coding' | 'technical' | 'interview';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  summary: string;
  keyPoints: string[];
  codeOrFormula?: string;
  flashcards: { question: string; answer: string; tip: string }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const MODULES_DATA: ModuleTopic[] = [
  {
    id: 'apt-1',
    title: 'Permutations, Combinations & Probability',
    category: 'aptitude',
    level: 'Intermediate',
    duration: '25 mins',
    summary: 'Master arrangements and selections for top tech company online aptitude assessments.',
    keyPoints: [
      'P(n, r) = n! / (n - r)! when order matters (e.g. passwords, rank orders).',
      'C(n, r) = n! / [r!(n - r)!] when order does not matter (e.g. team selection, handshakes).',
      'P(A ∪ B) = P(A) + P(B) - P(A ∩ B) for overlapping events.',
      'Circular arrangements: (n - 1)! for distinct items, (n - 1)! / 2 for necklaces/keyrings.',
    ],
    codeOrFormula: `Handshake formula for N people: Total Handshakes = N * (N - 1) / 2
Probability of at least 1 success: P(at least 1) = 1 - P(none)`,
    flashcards: [
      {
        question: 'In how many ways can 5 software engineers sit around a round table?',
        answer: '(5 - 1)! = 4! = 24 distinct ways.',
        tip: 'For circular permutations, fixing 1 reference node eliminates rotational duplicates.'
      },
      {
        question: 'What is the sum of first N natural numbers?',
        answer: 'S = N * (N + 1) / 2',
        tip: 'Frequently used in finding missing array numbers and algorithmic series.'
      }
    ],
    quiz: {
      question: 'From a group of 7 developers and 5 designers, in how many ways can a team of 3 developers and 2 designers be formed?',
      options: [
        '350 ways',
        '210 ways',
        '150 ways',
        '420 ways'
      ],
      correctIndex: 0,
      explanation: 'Selection of 3 developers from 7 = C(7,3) = 35. Selection of 2 designers from 5 = C(5,2) = 10. By multiplication principle: 35 * 10 = 350 ways.'
    }
  },
  {
    id: 'apt-2',
    title: 'Work, Pipes & Cisterns Efficiency',
    category: 'aptitude',
    level: 'Beginner',
    duration: '20 mins',
    summary: 'Standard rate-of-work mechanics tested by TCS, Infosys, Cognizant, and Amazon OA.',
    keyPoints: [
      'If A completes work in X days, 1-day rate = 1/X.',
      'LCM Method: Assume total work = LCM(days) to work with integers instead of fractions.',
      'Efficiency is inversely proportional to time taken when total work is constant.',
      'Negative work: Inlet pipe fills at rate +1/A, outlet pipe empties at rate -1/B.',
    ],
    codeOrFormula: `Total Work = LCM(time_A, time_B)
Efficiency_A = Total Work / time_A
Combined Days = Total Work / (Efficiency_A + Efficiency_B)`,
    flashcards: [
      {
        question: 'If A does work in 10 days and B in 15 days, in how many days can they finish together?',
        answer: '6 days (LCM = 30; rate A = 3, rate B = 2; combined rate = 5; 30/5 = 6 days).',
        tip: 'LCM method is 3x faster than fraction additions during timed placement exams!'
      }
    ],
    quiz: {
      question: 'Pipe A can fill a tank in 4 hours, and Pipe B can empty it in 6 hours. If both are open, how long to fill?',
      options: ['10 hours', '12 hours', '8 hours', '15 hours'],
      correctIndex: 1,
      explanation: 'Net rate = 1/4 - 1/6 = 1/12 per hour. Therefore, it takes 12 hours to fill the tank.'
    }
  },
  {
    id: 'code-1',
    title: 'Sliding Window & Two Pointer Mastery',
    category: 'coding',
    level: 'Intermediate',
    duration: '35 mins',
    summary: 'Reduce O(N²) quadratic nested loops into lightning-fast O(N) linear time.',
    keyPoints: [
      'Fixed-size Window: Calculate initial window sum, then slide by adding arr[i] and subtracting arr[i - k].',
      'Dynamic-size Window: Expand right pointer until condition violates, then contract left pointer.',
      'Two pointers in opposite directions: Ideal for sorted arrays (e.g. Two Sum II, Container With Most Water).',
      'Two pointers in same direction (Fast & Slow): Detect cycle in linked list or find middle node.'
    ],
    codeOrFormula: `// Fixed Window K pattern
let maxVal = 0, current = 0;
for (let i = 0; i < k; i++) current += arr[i];
maxVal = current;
for (let i = k; i < arr.length; i++) {
  current += arr[i] - arr[i - k];
  maxVal = Math.max(maxVal, current);
}`,
    flashcards: [
      {
        question: 'When should you suspect a Sliding Window approach?',
        answer: 'When asked for contiguous subarrays/substrings with min/max or target sum/constraint.',
        tip: 'If array elements are positive, monotonic expansion and contraction guarantee O(N).'
      },
      {
        question: 'What is the time complexity of Floyd\'s Tortoise and Hare cycle detection?',
        answer: 'O(N) time and O(1) auxiliary space.',
        tip: 'The fast pointer advances 2 steps while slow pointer advances 1 step.'
      }
    ],
    quiz: {
      question: 'Why does the dynamic sliding window achieve O(N) runtime even though it contains an inner while loop?',
      options: [
        'Because the inner loop runs only once.',
        'Because both left and right pointers traverse the array at most once (2N operations).',
        'Because the array is automatically sorted in memory.',
        'Because of compiler SIMD auto-vectorization.'
      ],
      correctIndex: 1,
      explanation: 'Each element is visited by the right pointer once and left pointer at most once, bounding the total operations strictly to O(2N) = O(N).'
    }
  },
  {
    id: 'code-2',
    title: 'Dynamic Programming: 0/1 Knapsack & Subsets',
    category: 'coding',
    level: 'Advanced',
    duration: '40 mins',
    summary: 'Understand state definition, transition equations, and 1D space optimization.',
    keyPoints: [
      'Identify Optimal Substructure and Overlapping Subproblems before applying DP.',
      'State definition: dp[i][w] = maximum value using first i items with weight capacity w.',
      'Decision choice: Include item (val[i] + dp[i-1][w-wt[i]]) or exclude item (dp[i-1][w]).',
      'Space optimization: Iterate backwards on weight capacity to compress 2D table into 1D.'
    ],
    codeOrFormula: `// 1D Space Optimized 0/1 Knapsack
const dp = new Array(W + 1).fill(0);
for (let i = 0; i < n; i++) {
  for (let w = W; w >= weights[i]; w--) {
    dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  }
}`,
    flashcards: [
      {
        question: 'Why must we iterate backwards from W to 0 in 1D 0/1 Knapsack?',
        answer: 'To prevent reusing the same item multiple times in the current step.',
        tip: 'Iterating forward converts the problem into Unbounded Knapsack (unlimited item reuse).'
      }
    ],
    quiz: {
      question: 'What is the space complexity of standard 2D DP for 0/1 Knapsack with N items and capacity W?',
      options: ['O(N + W)', 'O(N * W)', 'O(2^N)', 'O(N log W)'],
      correctIndex: 1,
      explanation: 'Standard 2D DP allocates an (N+1) x (W+1) matrix, requiring O(N * W) space.'
    }
  },
  {
    id: 'tech-1',
    title: 'Database Indexing: B-Trees vs Hash & Transactions',
    category: 'technical',
    level: 'Intermediate',
    duration: '30 mins',
    summary: 'Core SQL internals, ACID guarantees, isolation levels, and execution plan optimization.',
    keyPoints: [
      'B+ Trees store records in leaves connected sequentially, allowing fast range queries (O(log N)).',
      'Hash indexes offer O(1) equality lookups but cannot support range queries (BETWEEN, >, <).',
      'ACID: Atomicity (all-or-nothing), Consistency (rules valid), Isolation (concurrent safety), Durability (persisted).',
      'Index selectivity: High cardinality columns (e.g. user_id, email) yield optimal index performance.'
    ],
    codeOrFormula: `-- Composite index left-to-right rule
CREATE INDEX idx_users_dept_status ON users(department_id, status);
-- Queries filtering by department_id can utilize this index; queries filtering ONLY status cannot.`,
    flashcards: [
      {
        question: 'What is a "Dirty Read" in database transaction isolation?',
        answer: 'When Transaction A reads uncommitted data written by Transaction B that may later be rolled back.',
        tip: 'Prevented by READ COMMITTED isolation level.'
      },
      {
        question: 'Why are B+ Trees preferred over Binary Search Trees in storage engines?',
        answer: 'High branching factor lowers tree depth, minimizing expensive disk block I/O operations.',
        tip: 'A B+ Tree with depth 3 can easily index millions of records!'
      }
    ],
    quiz: {
      question: 'Which index type can efficiently execute the query: `SELECT * FROM orders WHERE amount BETWEEN 50 AND 200`?',
      options: ['Hash Index', 'B+ Tree Index', 'Bitmap Index only', 'No index can optimize range filters'],
      correctIndex: 1,
      explanation: 'B+ Tree leaf nodes are sorted and linked sequentially, making range scans remarkably efficient.'
    }
  },
  {
    id: 'interview-1',
    title: 'The STAR Method & High-Impact Behavioral Answers',
    category: 'interview',
    level: 'Beginner',
    duration: '25 mins',
    summary: 'Structure responses for Amazon Leadership Principles, Google Googlyness, and HR rounds.',
    keyPoints: [
      'S - Situation (15%): Set the stage, company/team context, and core challenge in 2 sentences.',
      'T - Task (15%): Clarify your specific responsibility and what success looked like.',
      'A - Action (50%): Deep dive into YOUR technical decisions, leadership, and tradeoffs taken.',
      'R - Result (20%): Quantifiable outcomes (e.g. reduced latency by 34%, saved 12 dev-hours/week).'
    ],
    codeOrFormula: `STAR Blueprint Formula:
"When our team faced [Situation], I was tasked with [Task].
I implemented [Action: Architecture + Tech + Tradeoff],
resulting in [Result: Metrics + What you learned]."`,
    flashcards: [
      {
        question: 'What is the most common mistake students make during behavioral questions?',
        answer: 'Focusing on "We did this" instead of "I did this", and failing to give quantifiable metrics.',
        tip: 'Always quantify impact (percentages, hours saved, query speedups, user retention).'
      }
    ],
    quiz: {
      question: 'What percentage of your interview answer duration should be dedicated to the "Action" phase in STAR?',
      options: ['10%', '20%', '50% to 60%', '80%'],
      correctIndex: 2,
      explanation: 'Interviewers evaluate your thought process, technical actions, and ownership. The Action phase should comprise roughly 50-60% of your response.'
    }
  }
];

export const LearningHub: React.FC<LearningHubProps> = ({ user, setActiveTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'aptitude' | 'coding' | 'technical' | 'interview'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<ModuleTopic>(MODULES_DATA[2]); // Default to Sliding Window
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(['apt-1']);
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredTopics = MODULES_DATA.filter((topic) => {
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTopic = (topic: ModuleTopic) => {
    setActiveTopic(topic);
    setFlippedCardIndex(null);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
  };

  const handleToggleCompleted = (id: string) => {
    if (completedTopicIds.includes(id)) {
      setCompletedTopicIds(completedTopicIds.filter((t) => t !== id));
    } else {
      setCompletedTopicIds([...completedTopicIds, id]);
    }
  };

  const handleCopyCode = () => {
    if (activeTopic.codeOrFormula) {
      navigator.clipboard.writeText(activeTopic.codeOrFormula);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const categories = [
    { id: 'all', label: 'All Modules', icon: Layers },
    { id: 'aptitude', label: 'Aptitude & Quant', icon: Brain },
    { id: 'coding', label: 'DSA & Coding', icon: Code2 },
    { id: 'technical', label: 'Core CS & Systems', icon: Cpu },
    { id: 'interview', label: 'Interview Mastery', icon: Sparkles },
  ] as const;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1224] via-[#151238] to-[#1a0f3d] border border-cyan-500/20 p-6 sm:p-8 shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Structured Placement Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Learning Hub & Cheat Sheets
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Curated crash modules for Quantitative Aptitude, High-Yield DSA Patterns, Core CS (OS, DBMS, Networks), and STAR Interview Tactics tailored for {user.targetRole}.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Completed</div>
              <div className="text-xl font-black text-cyan-400 mt-0.5">
                {completedTopicIds.length} / {MODULES_DATA.length}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('challenges')}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-slate-950" />
              <span>Daily Challenge</span>
            </button>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics, algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Sidebar Topics + Active Topic Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topics List (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Module Lessons ({filteredTopics.length})
            </span>
            <span className="text-[11px] text-cyan-400 font-medium">Click to study</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredTopics.map((topic) => {
              const isSelected = activeTopic.id === topic.id;
              const isCompleted = completedTopicIds.includes(topic.id);

              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-400/50 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                      : 'bg-[#0b1021]/80 hover:bg-slate-900/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            topic.category === 'aptitude'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                              : topic.category === 'coding'
                              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                              : topic.category === 'technical'
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          }`}
                        >
                          {topic.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">· {topic.level}</span>
                        <span className="text-[10px] text-slate-400 font-medium">· {topic.duration}</span>
                      </div>
                      <h4 className={`text-sm font-bold leading-snug ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {topic.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {topic.summary}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCompleted(topic.id);
                      }}
                      title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                      className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'bg-slate-800/60 border-slate-700 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Lesson Reader (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0c1024]/90 border border-cyan-500/20 rounded-2xl p-6 sm:p-7 relative shadow-xl backdrop-blur-md">
            {/* Topic Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {activeTopic.category} Masterclass
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-400">{activeTopic.level}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-400">{activeTopic.duration} read</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activeTopic.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleCompleted(activeTopic.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    completedTopicIds.includes(activeTopic.id)
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completedTopicIds.includes(activeTopic.id) ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>

            {/* Summary & Core Concepts */}
            <div className="mt-5 space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed font-normal bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                {activeTopic.summary}
              </p>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  High-Yield Takeaways
                </h3>
                <ul className="space-y-2">
                  {activeTopic.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-sm shadow-cyan-400" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code / Formula Snippet */}
              {activeTopic.codeOrFormula && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Standard Template / Formula
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition-colors"
                    >
                      {copiedCode ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#070b18] border border-cyan-500/20 text-cyan-200 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
                    <code>{activeTopic.codeOrFormula}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Interactive Flashcards */}
            {activeTopic.flashcards.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                    <span>Quick Recall Flashcard (Click to flip)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {activeTopic.flashcards.map((fc, idx) => {
                    const isFlipped = flippedCardIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setFlippedCardIndex(isFlipped ? null : idx)}
                        className={`p-4 rounded-xl cursor-pointer transition-all border text-left select-none ${
                          isFlipped
                            ? 'bg-gradient-to-br from-purple-950/70 to-indigo-950/70 border-purple-400/40 shadow-lg shadow-purple-900/20'
                            : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-purple-400 font-bold mb-1.5">
                          <span>{isFlipped ? 'RECALL ANSWER & INTERVIEW TIP' : 'INTERVIEW QUESTION'}</span>
                          <span className="text-slate-400 text-[10px]">Click to flip</span>
                        </div>
                        <p className="text-xs font-semibold text-white leading-relaxed">
                          {isFlipped ? fc.answer : fc.question}
                        </p>
                        {isFlipped && (
                          <div className="mt-2.5 pt-2.5 border-t border-purple-800/40 text-[11px] text-purple-200 font-medium flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                            <span><strong>Pro-Tip:</strong> {fc.tip}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Knowledge Check (Mini Quiz) */}
            {activeTopic.quiz && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Quick Knowledge Check</span>
                  </h3>
                  <span className="text-[11px] text-cyan-400 font-semibold">+15 XP</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-white leading-relaxed">
                    {activeTopic.quiz.question}
                  </p>

                  <div className="space-y-2">
                    {activeTopic.quiz.options.map((opt, optIdx) => {
                      const isSelected = selectedQuizOption === optIdx;
                      let optionClasses = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (isQuizSubmitted) {
                        if (optIdx === activeTopic.quiz.correctIndex) {
                          optionClasses = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-semibold';
                        } else if (isSelected) {
                          optionClasses = 'bg-rose-500/20 border-rose-400 text-rose-200';
                        }
                      } else if (isSelected) {
                        optionClasses = 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isQuizSubmitted}
                          onClick={() => setSelectedQuizOption(optIdx)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${optionClasses}`}
                        >
                          <span>{opt}</span>
                          {isQuizSubmitted && optIdx === activeTopic.quiz.correctIndex && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!isQuizSubmitted ? (
                    <button
                      disabled={selectedQuizOption === null}
                      onClick={() => setIsQuizSubmitted(true)}
                      className="w-full mt-2 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="mt-3 p-3 rounded-lg bg-[#070b18] border border-cyan-500/30 text-xs text-slate-300 leading-relaxed">
                      <div className="font-bold text-cyan-300 mb-1">
                        {selectedQuizOption === activeTopic.quiz.correctIndex ? 'Correct! 🎯' : 'Explanation:'}
                      </div>
                      {activeTopic.quiz.explanation}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
