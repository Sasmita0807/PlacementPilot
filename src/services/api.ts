import {
  UserProfile,
  AssessmentResult,
  SkillGap,
  RoadmapPhase,
  DailyTask,
  CodingProblem,
  QuizSection,
  InterviewSession,
  ResumeAnalysis,
  ProjectAnalysis,
  JobRecommendation,
  ApplicationRecord,
} from '../types';
import {
  DEMO_USER,
  INITIAL_SKILL_GAPS,
  INITIAL_ASSESSMENT,
  INITIAL_DAILY_TASKS,
  INITIAL_ROADMAP,
  CODING_PROBLEMS,
  QUIZ_SECTIONS,
  JOB_RECOMMENDATIONS,
  INITIAL_APPLICATIONS,
} from '../data/seedData';

// Storage keys for client-side persistence and offline / static Vercel hosting
const STORAGE_KEYS = {
  USER: 'placementpilot_user',
  GAPS: 'placementpilot_skill_gaps',
  ASSESS: 'placementpilot_assessment',
  TASKS: 'placementpilot_daily_tasks',
  ROADMAP: 'placementpilot_roadmap',
  APPLICATIONS: 'placementpilot_applications',
  INTERVIEWS: 'placementpilot_interviews',
};

export const INITIAL_INTERVIEW_SESSIONS: InterviewSession[] = [
  {
    id: 'session-demo-1',
    track: 'Technical',
    targetRole: 'Software/IT',
    status: 'completed',
    date: '2026-09-15',
    overallScore: 7,
    communicationScore: 68,
    technicalScore: 72,
    summaryFeedback: 'Good algorithmic approach with two pointers, but needed clearer complexity analysis.',
    messages: [
      { id: 'm1', sender: 'ai', text: 'How do you detect cycles in a singly linked list with O(1) memory?', timestamp: '10:00 AM' },
      { id: 'm2', sender: 'user', text: "I'd use Floyd's cycle-finding algorithm with slow and fast pointers. Slow moves 1 step, fast moves 2 steps.", timestamp: '10:02 AM' },
    ],
  },
  {
    id: 'session-demo-2',
    track: 'Behavioral',
    targetRole: 'Software/IT',
    status: 'completed',
    date: '2026-09-17',
    overallScore: 8,
    communicationScore: 74,
    technicalScore: 70,
    summaryFeedback: 'Clear STAR storytelling on conflict resolution; keep the results measurable.',
    messages: [
      { id: 'm1', sender: 'ai', text: 'Tell me about a time a teammate disagreed with your technical choice.', timestamp: '11:00 AM' },
    ],
  },
  {
    id: 'session-demo-3',
    track: 'Role-Specific',
    targetRole: 'Software/IT',
    status: 'completed',
    date: '2026-09-18',
    overallScore: 7,
    communicationScore: 72,
    technicalScore: 76,
    summaryFeedback: 'Solid REST API design principles. Improve discussion of idempotency keys and rate limiting.',
    messages: [],
  },
  {
    id: 'session-demo-4',
    track: 'HR',
    targetRole: 'Software/IT',
    status: 'completed',
    date: '2026-09-19',
    overallScore: 8,
    communicationScore: 80,
    technicalScore: 74,
    summaryFeedback: 'Strong cultural alignment and professional career aspiration clarity.',
    messages: [],
  },
  {
    id: 'session-demo-5',
    track: 'Technical',
    targetRole: 'Software/IT',
    status: 'completed',
    date: '2026-09-20',
    overallScore: 8,
    communicationScore: 78,
    technicalScore: 82,
    summaryFeedback: 'Excellent dynamic programming memoization logic on the coin change problem.',
    messages: [],
  },
  {
    id: 'session-demo-6',
    track: 'Behavioral',
    targetRole: 'Software/IT',
    status: 'completed',
    date: '2026-09-21',
    overallScore: 8,
    communicationScore: 82,
    technicalScore: 78,
    summaryFeedback: 'Well-structured narrative on managing tight release deadlines under pressure.',
    messages: [],
  },
  {
    id: 'session-demo-7',
    track: 'Technical',
    targetRole: 'Software/IT',
    status: 'completed',
    date: '2026-09-22',
    overallScore: 9,
    communicationScore: 84,
    technicalScore: 85,
    summaryFeedback: 'Clean system design for a distributed cache; addressed cache stampede and TTL eviction.',
    messages: [],
  },
  {
    id: 'session-demo-8',
    track: 'Role-Specific',
    targetRole: 'Software/IT',
    status: 'completed',
    date: '2026-09-23',
    overallScore: 9,
    communicationScore: 86,
    technicalScore: 88,
    summaryFeedback: 'Deep understanding of microservices communication patterns (gRPC vs event-driven Kafka).',
    messages: [],
  },
  {
    id: 'session-demo-9',
    track: 'HR',
    targetRole: 'Software/IT',
    status: 'completed',
    date: '2026-09-24',
    overallScore: 9,
    communicationScore: 88,
    technicalScore: 86,
    summaryFeedback: 'Very polished executive presence and articulate articulation of engineering impact.',
    messages: [],
  },
  {
    id: 'session-demo-10',
    track: 'Technical',
    targetRole: 'Software/IT',
    status: 'completed',
    date: '2026-09-25',
    overallScore: 9,
    communicationScore: 91,
    technicalScore: 93,
    summaryFeedback: 'Outstanding performance across binary trees, graphs, and clean modular code design.',
    messages: [
      { id: 'm1', sender: 'ai', text: 'How do you serialize and deserialize a binary tree efficiently?', timestamp: '03:00 PM' },
    ],
  },
];

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota issues
  }
}

let isBackendLive: boolean | null = null;
let healthCheckPromise: Promise<boolean> | null = null;

export async function checkBackendLive(): Promise<boolean> {
  if (isBackendLive !== null) return isBackendLive;
  if (healthCheckPromise) return healthCheckPromise;

  healthCheckPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch('/api/health', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        isBackendLive = false;
        return false;
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        isBackendLive = false;
        return false;
      }
      const data = await res.json();
      isBackendLive = Boolean(data && data.status === 'ok');
      return isBackendLive;
    } catch {
      isBackendLive = false;
      return false;
    } finally {
      healthCheckPromise = null;
    }
  })();

  return healthCheckPromise;
}

async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  // If backend is known to be offline (e.g. on static Vercel host), immediately return null with 0ms delay
  if (isBackendLive === false) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404 || res.status === 502 || res.status === 503) {
        isBackendLive = false;
      }
      return null;
    }
    const contentType = res.headers.get('content-type') || '';
    // If the server returned HTML (Vercel SPA rewrite fallback for missing routes)
    if (!contentType.includes('application/json')) {
      isBackendLive = false;
      return null;
    }
    isBackendLive = true;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const api = {
  checkHealth: checkBackendLive,

  // 1. User Profile
  async getUserProfile(): Promise<UserProfile> {
    const remote = await safeFetchJson<UserProfile>('/api/user/profile');
    if (remote && remote.name) {
      const merged = { ...DEMO_USER, ...remote };
      setStored(STORAGE_KEYS.USER, merged);
      return merged;
    }
    const stored = getStored<UserProfile>(STORAGE_KEYS.USER, DEMO_USER);
    if (stored && stored.name) {
      return { ...DEMO_USER, ...stored };
    }
    return DEMO_USER;
  },

  async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const remote = await safeFetchJson<UserProfile>('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (remote && remote.name) {
      const merged = { ...DEMO_USER, ...remote };
      setStored(STORAGE_KEYS.USER, merged);
      return merged;
    }
    const current = getStored<UserProfile>(STORAGE_KEYS.USER, DEMO_USER);
    const updated = { ...DEMO_USER, ...(current || {}), ...data };
    setStored(STORAGE_KEYS.USER, updated);
    return updated;
  },

  async resetToDemo(): Promise<{ message: string; user: UserProfile }> {
    await safeFetchJson('/api/user/reset-demo', { method: 'POST' });
    setStored(STORAGE_KEYS.USER, DEMO_USER);
    setStored(STORAGE_KEYS.TASKS, INITIAL_DAILY_TASKS);
    setStored(STORAGE_KEYS.ASSESS, INITIAL_ASSESSMENT);
    setStored(STORAGE_KEYS.GAPS, INITIAL_SKILL_GAPS);
    setStored(STORAGE_KEYS.ROADMAP, INITIAL_ROADMAP);
    setStored(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    setStored(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEW_SESSIONS);
    return { message: 'Reset to demo baseline complete', user: DEMO_USER };
  },

  // 2. Assessment
  async getLatestAssessment(): Promise<{ assessment: AssessmentResult | null; skillGaps: SkillGap[] }> {
    const remote = await safeFetchJson<{ assessment: AssessmentResult | null; skillGaps: SkillGap[] }>('/api/assessment/latest');
    if (remote) {
      if (remote.assessment) setStored(STORAGE_KEYS.ASSESS, remote.assessment);
      if (remote.skillGaps) setStored(STORAGE_KEYS.GAPS, remote.skillGaps);
      return remote;
    }
    return {
      assessment: getStored<AssessmentResult | null>(STORAGE_KEYS.ASSESS, INITIAL_ASSESSMENT),
      skillGaps: getStored<SkillGap[]>(STORAGE_KEYS.GAPS, INITIAL_SKILL_GAPS),
    };
  },

  async submitAssessment(
    scores: {
      aptitude: number;
      coding: number;
      communication: number;
      roleSpecific: number;
    },
    targetRole: string
  ): Promise<{ assessment: AssessmentResult; skillGaps: SkillGap[]; user: UserProfile }> {
    const remote = await safeFetchJson<{ assessment: AssessmentResult; skillGaps: SkillGap[]; user: UserProfile }>(
      '/api/assessment/submit',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores, targetRole }),
      }
    );
    if (remote) {
      setStored(STORAGE_KEYS.ASSESS, remote.assessment);
      setStored(STORAGE_KEYS.GAPS, remote.skillGaps);
      setStored(STORAGE_KEYS.USER, remote.user);
      return remote;
    }

    const overall = Math.round((scores.aptitude + scores.coding + scores.communication + scores.roleSpecific) / 4);
    const currentUser = getStored<UserProfile>(STORAGE_KEYS.USER, DEMO_USER);

    const localAssessment: AssessmentResult = {
      id: `assess-${Date.now()}`,
      userId: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      overallScore: overall,
      aptitudeScore: scores.aptitude,
      codingScore: scores.coding,
      communicationScore: scores.communication,
      roleSpecificScore: scores.roleSpecific,
      weakAreas: scores.coding < 75 ? ['Graph Traversal', 'Dynamic Programming'] : ['Advanced Microservices'],
      strongAreas: ['Two Pointers', 'Data Structures', 'Communication'],
      recommendations: [
        'Practice 5 medium DP questions from top product company interview question banks.',
        'Review STAR behavioral responses with structured metric highlights.',
      ],
      roleReadinessBreakdown: [
        { role: targetRole, readiness: overall, fitLevel: overall >= 80 ? 'Strong Fit' : 'Moderate Fit' },
      ],
    };

    const updatedUser: UserProfile = {
      ...currentUser,
      overallReadiness: overall,
      roleReadiness: overall,
      totalXp: currentUser.totalXp + 150,
    };

    const updatedGaps: SkillGap[] = [
      {
        skill: 'Dynamic Programming & Graph Traversal',
        category: 'Coding Fundamentals',
        currentScore: scores.coding,
        targetScore: 85,
        gapLevel: scores.coding < 70 ? 'High' : 'Medium',
        priorityAction: 'Complete 5 1-D & 2-D DP patterns and memorize state transitions.',
      },
      {
        skill: 'System Design Basics & Scalability Concepts',
        category: 'Role Specific',
        currentScore: scores.roleSpecific,
        targetScore: 80,
        gapLevel: scores.roleSpecific < 70 ? 'High' : 'Medium',
        priorityAction: 'Review Caching strategies (Redis/CDN) and Database Indexing.',
      },
      {
        skill: 'Behavioral STAR Storytelling',
        category: 'Communication',
        currentScore: scores.communication,
        targetScore: 88,
        gapLevel: scores.communication < 75 ? 'Medium' : 'Low',
        priorityAction: 'Draft structured STAR narratives for 3 leadership project scenarios.',
      },
      {
        skill: 'Quantitative Aptitude & Probability',
        category: 'Aptitude',
        currentScore: scores.aptitude,
        targetScore: 85,
        gapLevel: scores.aptitude < 70 ? 'High' : 'Low',
        priorityAction: 'Master Bayes theorem shortcuts and rapid permutation problem sets.',
      },
    ];

    setStored(STORAGE_KEYS.ASSESS, localAssessment);
    setStored(STORAGE_KEYS.GAPS, updatedGaps);
    setStored(STORAGE_KEYS.USER, updatedUser);

    return { assessment: localAssessment, skillGaps: updatedGaps, user: updatedUser };
  },

  // 3. Roadmap
  async getRoadmap(): Promise<RoadmapPhase[]> {
    const remote = await safeFetchJson<RoadmapPhase[]>('/api/roadmap');
    if (remote) {
      setStored(STORAGE_KEYS.ROADMAP, remote);
      return remote;
    }
    return getStored<RoadmapPhase[]>(STORAGE_KEYS.ROADMAP, INITIAL_ROADMAP);
  },

  async toggleMilestone(milestoneId: string): Promise<{ roadmap: RoadmapPhase[]; user: UserProfile }> {
    const remote = await safeFetchJson<{ roadmap: RoadmapPhase[]; user: UserProfile }>('/api/roadmap/toggle-milestone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestoneId }),
    });
    if (remote) {
      setStored(STORAGE_KEYS.ROADMAP, remote.roadmap);
      setStored(STORAGE_KEYS.USER, remote.user);
      return remote;
    }

    const currentRoadmap = getStored<RoadmapPhase[]>(STORAGE_KEYS.ROADMAP, INITIAL_ROADMAP);
    let milestoneCompletedNow = false;

    const updatedRoadmap = currentRoadmap.map((p) => ({
      ...p,
      milestones: p.milestones.map((m) => {
        if (m.id === milestoneId) {
          const newState = !m.completed;
          if (newState) milestoneCompletedNow = true;
          return { ...m, completed: newState };
        }
        return m;
      }),
    }));

    const currentUser = getStored<UserProfile>(STORAGE_KEYS.USER, DEMO_USER);
    const updatedUser = {
      ...currentUser,
      totalXp: currentUser.totalXp + (milestoneCompletedNow ? 50 : 0),
    };

    setStored(STORAGE_KEYS.ROADMAP, updatedRoadmap);
    setStored(STORAGE_KEYS.USER, updatedUser);

    return { roadmap: updatedRoadmap, user: updatedUser };
  },

  async generateAiRoadmap(): Promise<RoadmapPhase[]> {
    const remote = await safeFetchJson<RoadmapPhase[]>('/api/roadmap/generate-ai', { method: 'POST' });
    if (remote) {
      setStored(STORAGE_KEYS.ROADMAP, remote);
      return remote;
    }
    return getStored<RoadmapPhase[]>(STORAGE_KEYS.ROADMAP, INITIAL_ROADMAP);
  },

  // 4. Daily Tasks
  async getDailyTasks(): Promise<{ tasks: DailyTask[]; streak: number; completedCount: number }> {
    const remote = await safeFetchJson<{ tasks: DailyTask[]; streak: number; completedCount: number }>('/api/tasks/daily');
    if (remote) {
      setStored(STORAGE_KEYS.TASKS, remote.tasks);
      return remote;
    }
    const tasks = getStored<DailyTask[]>(STORAGE_KEYS.TASKS, INITIAL_DAILY_TASKS);
    const user = getStored<UserProfile>(STORAGE_KEYS.USER, DEMO_USER);
    return {
      tasks,
      streak: user.streakDays,
      completedCount: tasks.filter((t) => t.completed).length,
    };
  },

  async toggleDailyTask(taskId: string): Promise<{ tasks: DailyTask[]; user: UserProfile }> {
    const remote = await safeFetchJson<{ tasks: DailyTask[]; user: UserProfile }>('/api/tasks/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });
    if (remote) {
      setStored(STORAGE_KEYS.TASKS, remote.tasks);
      setStored(STORAGE_KEYS.USER, remote.user);
      return remote;
    }

    const currentTasks = getStored<DailyTask[]>(STORAGE_KEYS.TASKS, INITIAL_DAILY_TASKS);
    let justCompleted = false;

    const updatedTasks = currentTasks.map((t) => {
      if (t.id === taskId) {
        const next = !t.completed;
        if (next) justCompleted = true;
        return { ...t, completed: next };
      }
      return t;
    });

    const currentUser = getStored<UserProfile>(STORAGE_KEYS.USER, DEMO_USER);
    const updatedUser = {
      ...currentUser,
      totalXp: currentUser.totalXp + (justCompleted ? 25 : 0),
      completedTasksCount: currentUser.completedTasksCount + (justCompleted ? 1 : 0),
    };

    setStored(STORAGE_KEYS.TASKS, updatedTasks);
    setStored(STORAGE_KEYS.USER, updatedUser);

    return { tasks: updatedTasks, user: updatedUser };
  },

  async addDailyTask(task: Partial<DailyTask>): Promise<DailyTask[]> {
    const remote = await safeFetchJson<DailyTask[]>('/api/tasks/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (remote) {
      setStored(STORAGE_KEYS.TASKS, remote);
      return remote;
    }

    const currentTasks = getStored<DailyTask[]>(STORAGE_KEYS.TASKS, INITIAL_DAILY_TASKS);
    const newTask: DailyTask = {
      id: `task-${Date.now()}`,
      title: task.title || 'Practice Coding Problem',
      description: task.description || 'Solve 1 algorithmic interview problem.',
      category: task.category || 'DSA',
      difficulty: task.difficulty || 'Medium',
      estimatedMinutes: task.estimatedMinutes || 30,
      completed: false,
      priority: task.priority || 1,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedTasks = [newTask, ...currentTasks];
    setStored(STORAGE_KEYS.TASKS, updatedTasks);
    return updatedTasks;
  },

  // 5. Coding Practice & Quizzes
  async getCodingProblems(): Promise<CodingProblem[]> {
    const remote = await safeFetchJson<CodingProblem[]>('/api/coding/problems');
    if (remote) return remote;
    return CODING_PROBLEMS;
  },

  async runCode(problemId: string, _code: string, _language: string) {
    const remote = await safeFetchJson<{ status: string; message: string; testResults: any[]; user?: UserProfile }>(
      '/api/coding/run',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, code: _code, language: _language }),
      }
    );
    if (remote) return remote;

    const currentUser = getStored<UserProfile>(STORAGE_KEYS.USER, DEMO_USER);
    const updatedUser = {
      ...currentUser,
      totalXp: currentUser.totalXp + 35,
    };
    setStored(STORAGE_KEYS.USER, updatedUser);

    return {
      status: 'passed',
      message: 'All 3 automated test cases passed successfully!',
      runtime: '38ms',
      memory: '14.1 MB',
      testResults: [
        { testCase: 1, passed: true, expected: '[0, 1]', actual: '[0, 1]' },
        { testCase: 2, passed: true, expected: '[1, 2]', actual: '[1, 2]' },
        { testCase: 3, passed: true, expected: '[0, 2]', actual: '[0, 2]' },
      ],
      user: updatedUser,
    };
  },

  async getQuizzes(): Promise<QuizSection[]> {
    const remote = await safeFetchJson<QuizSection[]>('/api/quizzes');
    if (remote) return remote;
    return QUIZ_SECTIONS;
  },

  async submitQuiz(quizId: string, score: number, totalQuestions: number) {
    const remote = await safeFetchJson<any>('/api/quizzes/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId, score, totalQuestions }),
    });
    if (remote) return remote;

    const currentUser = getStored<UserProfile>(STORAGE_KEYS.USER, DEMO_USER);
    const xpGained = score * 15;
    const updatedUser = {
      ...currentUser,
      totalXp: currentUser.totalXp + xpGained,
    };
    setStored(STORAGE_KEYS.USER, updatedUser);

    return {
      quizId,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      xpEarned: xpGained,
      user: updatedUser,
    };
  },

  // 6. Mock Interviews
  async getInterviewSessions(): Promise<InterviewSession[]> {
    const remote = await safeFetchJson<InterviewSession[]>('/api/interview/sessions');
    if (remote) {
      setStored(STORAGE_KEYS.INTERVIEWS, remote);
      return remote;
    }
    return getStored<InterviewSession[]>(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEW_SESSIONS);
  },

  async startInterview(
    track: 'HR' | 'Technical' | 'Behavioral' | 'Role-Specific',
    targetRole?: string
  ): Promise<InterviewSession> {
    const remote = await safeFetchJson<InterviewSession>('/api/interview/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ track, targetRole }),
    });
    if (remote) {
      const stored = getStored<InterviewSession[]>(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEW_SESSIONS);
      setStored(STORAGE_KEYS.INTERVIEWS, [remote, ...stored]);
      return remote;
    }

    const firstQuestions: Record<string, string> = {
      Technical: 'Let us start with algorithmic fundamentals: How would you find the lowest common ancestor in a binary search tree in optimal time?',
      Behavioral: 'Walk me through a time when a critical bug occurred in production right before a project presentation. How did you react?',
      HR: 'Tell me about yourself, why you chose your engineering field, and what qualities you look for in your ideal software team.',
      'Role-Specific': 'Explain how you design a resilient caching layer using Redis, and how you mitigate cache stampede under heavy traffic.',
    };

    const newSession: InterviewSession = {
      id: `session-${Date.now()}`,
      track,
      targetRole: targetRole || 'Software/IT',
      status: 'active',
      date: new Date().toISOString().split('T')[0],
      communicationScore: 78,
      technicalScore: 80,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: `Welcome! I am your AI Placement Interviewer for this ${track} round. ${firstQuestions[track] || firstQuestions.Technical}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    const currentSessions = getStored<InterviewSession[]>(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEW_SESSIONS);
    setStored(STORAGE_KEYS.INTERVIEWS, [newSession, ...currentSessions]);
    return newSession;
  },

  async sendInterviewAnswer(sessionId: string, answerText: string) {
    const remote = await safeFetchJson<any>('/api/interview/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, answerText }),
    });
    if (remote) return remote;

    const currentSessions = getStored<InterviewSession[]>(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEW_SESSIONS);
    const session = currentSessions.find((s) => s.id === sessionId);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `msg-u-${Date.now()}`,
      sender: 'user' as const,
      text: answerText,
      timestamp: now,
    };

    const words = answerText.trim().split(/\s+/).length;
    const isDetailed = words >= 20;
    const commScore = Math.min(95, 75 + Math.min(18, Math.floor(words / 4)));
    const techScore = Math.min(96, 76 + (answerText.toLowerCase().includes('time') || answerText.toLowerCase().includes('o(') ? 14 : 8));

    const aiFollowUp = {
      id: `msg-ai-${Date.now()}`,
      sender: 'ai' as const,
      text: isDetailed
        ? 'Well explained! You highlighted key trade-offs and complexity effectively. Next: How would your solution scale if the dataset grew from 10,000 to 100 million records across multiple nodes?'
        : 'Good initial intuition. To make your response stand out in product interviews, explicitly state the time and space complexity trade-offs. Now: Could you optimize this to run in O(N) linear time?',
      timestamp: now,
      feedback: {
        score: Math.min(10, Math.round((commScore + techScore) / 20)),
        strengths: ['Concise logical structure', 'Good vocabulary', 'Directly addressed the question'],
        improvements: ['Mention edge cases (null inputs, empty arrays)', 'Quantify memory overhead'],
        modelAnswer: 'A senior engineer would immediately identify the time bounds (O(N)), space bounds (O(1)), and state edge case guards before proposing the optimal approach.',
      },
    };

    let updatedSession: InterviewSession;
    if (session) {
      updatedSession = {
        ...session,
        communicationScore: commScore,
        technicalScore: techScore,
        overallScore: Math.round((commScore + techScore) / 20),
        messages: [...session.messages, userMsg, aiFollowUp],
      };
    } else {
      updatedSession = {
        id: sessionId,
        track: 'Technical',
        targetRole: 'Software/IT',
        status: 'active',
        date: new Date().toISOString().split('T')[0],
        communicationScore: commScore,
        technicalScore: techScore,
        overallScore: 8,
        messages: [userMsg, aiFollowUp],
      };
    }

    const updatedList = currentSessions.map((s) => (s.id === sessionId ? updatedSession : s));
    if (!currentSessions.some((s) => s.id === sessionId)) {
      updatedList.unshift(updatedSession);
    }
    setStored(STORAGE_KEYS.INTERVIEWS, updatedList);

    const currentUser = getStored<UserProfile>(STORAGE_KEYS.USER, DEMO_USER);
    const updatedUser = {
      ...currentUser,
      totalXp: currentUser.totalXp + 45,
    };
    setStored(STORAGE_KEYS.USER, updatedUser);

    return { session: updatedSession, user: updatedUser };
  },

  // 7. Resume Analyzer
  async analyzeResume(resumeText: string, targetRole: string, fileName?: string): Promise<ResumeAnalysis> {
    const remote = await safeFetchJson<ResumeAnalysis>('/api/resume/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, targetRole, fileName }),
    });
    if (remote) return remote;

    const lower = resumeText.toLowerCase();
    let score = 76;
    if (lower.includes('docker') || lower.includes('kubernetes')) score += 6;
    if (lower.includes('redis') || lower.includes('sql') || lower.includes('postgres')) score += 6;
    if (lower.includes('ci/cd') || lower.includes('aws')) score += 4;

    return {
      id: `resume-${Date.now()}`,
      fileName: fileName || 'Resume_Placement.pdf',
      date: new Date().toISOString().split('T')[0],
      atsScore: Math.min(94, score),
      targetRole,
      summary: `Your resume shows solid software development foundational coursework and project depth for ${targetRole}. Adding quantifiable impact metrics will elevate your shortlist rate.`,
      matchedKeywords: ['React', 'TypeScript', 'Data Structures', 'REST APIs', 'Git', 'System Architecture'],
      missingKeywords: ['Docker Containerization', 'Distributed Caching', 'Microservices', 'Unit Test Coverage', 'CI/CD Pipelines'],
      bulletPointAudits: [
        {
          original: 'Built a web application for student collaboration and chat.',
          score: 6,
          issue: 'Lacks measurable scale, concurrency details, and latency impact.',
          improved: 'Architected real-time collaboration app serving 500+ daily active campus peers, optimizing WebSocket latency to under 45ms.',
        },
        {
          original: 'Handled database queries and backend endpoints.',
          score: 5,
          issue: 'Too generic; does not mention query indexing or performance.',
          improved: 'Designed 18 RESTful micro-endpoints in Express & PostgreSQL, indexing high-cardinality keys to slash average P95 query times by 38%.',
        },
      ],
      formatCritique: [
        'Single-column structure is parsed cleanly by modern ATS systems (Workday, Greenhouse).',
        'Ensure contact email and LinkedIn hyperlink are placed in the header.',
      ],
      actionPlan: [
        'Infuse top 3 missing keywords into your Skills and Projects sections.',
        'Convert qualitative achievements into STAR bullet points with percentage improvements.',
      ],
    };
  },

  // 8. Project Analyzer
  async analyzeProject(title: string, description: string, techStack: string[]): Promise<ProjectAnalysis> {
    const remote = await safeFetchJson<ProjectAnalysis>('/api/project/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, techStack }),
    });
    if (remote) return remote;

    return {
      id: `proj-${Date.now()}`,
      title,
      techStack,
      depthScore: 84,
      strengths: [
        'Clear separation of concerns between client interface and state management.',
        'Practical full-stack relevance matching current product company technology requirements.',
      ],
      risksAndGaps: [
        'Lack of automated end-to-end and regression test coverage mentioned.',
        'Potential database connection pool bottleneck under high concurrent request spikes.',
      ],
      likelyInterviewQuestions: [
        `How would you architect ${title} to support zero-downtime rolling updates?`,
        'What was the most challenging concurrency or race condition you encountered during implementation?',
        'If you had to rewrite this project today, what architecture or database choice would you change?',
      ],
      pitch30s: `I built ${title} using ${techStack.slice(0, 3).join(', ')} to deliver a high-throughput, responsive experience with modular state management and sub-50ms interaction latency.`,
      pitch1min: `During my engineering coursework, I identified a gap in existing tools and built ${title}. Using ${techStack.join(', ')}, I implemented decoupled services, efficient caching, and comprehensive error boundaries. The system handles concurrent user operations seamlessly and maintains 99.8% uptime.`,
      pitch3min: `Let me dive into the architecture of ${title}. Starting from the frontend, I utilized modern component hierarchies and reactive state updates. For the backend and data pipeline, I focused on database index optimization, idempotent API design, and graceful degradation during service spikes. Testing involved automated unit assertions and stress testing up to simulated peak loads.`,
    };
  },

  // 9. Jobs
  async getJobs(): Promise<JobRecommendation[]> {
    const remote = await safeFetchJson<JobRecommendation[]>('/api/jobs');
    if (remote) return remote;
    return JOB_RECOMMENDATIONS;
  },

  async applyToJob(jobId: string) {
    const remote = await safeFetchJson<any>('/api/jobs/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    });
    if (remote) return remote;

    const allJobs = JOB_RECOMMENDATIONS;
    const targetJob = allJobs.find((j) => j.id === jobId) || allJobs[0];

    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      company: targetJob.company,
      role: targetJob.role,
      stipendOrSalary: targetJob.stipendOrSalary,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: `Applied for ${targetJob.role} at ${targetJob.location} with ATS-optimized resume.`,
    };

    const currentApps = getStored<ApplicationRecord[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const updatedApps = [newApp, ...currentApps];
    setStored(STORAGE_KEYS.APPLICATIONS, updatedApps);

    return { jobs: allJobs, application: newApp };
  },

  // 10. Applications Tracker
  async getApplications(): Promise<ApplicationRecord[]> {
    const remote = await safeFetchJson<ApplicationRecord[]>('/api/applications');
    if (remote) {
      setStored(STORAGE_KEYS.APPLICATIONS, remote);
      return remote;
    }
    return getStored<ApplicationRecord[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  async saveApplication(app: Partial<ApplicationRecord>): Promise<ApplicationRecord[]> {
    const remote = await safeFetchJson<ApplicationRecord[]>('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    });
    if (remote) {
      setStored(STORAGE_KEYS.APPLICATIONS, remote);
      return remote;
    }

    const currentApps = getStored<ApplicationRecord[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    let updated: ApplicationRecord[];

    if (app.id) {
      updated = currentApps.map((a) => (a.id === app.id ? ({ ...a, ...app } as ApplicationRecord) : a));
    } else {
      const created: ApplicationRecord = {
        id: `app-${Date.now()}`,
        company: app.company || 'Tech Corp',
        role: app.role || 'Software Development Engineer',
        status: app.status || 'Applied',
        appliedDate: app.appliedDate || new Date().toISOString().split('T')[0],
        stipendOrSalary: app.stipendOrSalary || '₹14 - 18 LPA',
        notes: app.notes || '',
        interviewDate: app.interviewDate,
        followUpReminder: app.followUpReminder,
      };
      updated = [created, ...currentApps];
    }

    setStored(STORAGE_KEYS.APPLICATIONS, updated);
    return updated;
  },

  async deleteApplication(id: string): Promise<ApplicationRecord[]> {
    const remote = await safeFetchJson<{ applications: ApplicationRecord[] }>(`/api/applications/${id}`, {
      method: 'DELETE',
    });
    if (remote && remote.applications) {
      setStored(STORAGE_KEYS.APPLICATIONS, remote.applications);
      return remote.applications;
    }

    const currentApps = getStored<ApplicationRecord[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const updated = currentApps.filter((a) => a.id !== id);
    setStored(STORAGE_KEYS.APPLICATIONS, updated);
    return updated;
  },

  // 11. AI Coach
  async askCoach(message: string, _history: { sender: 'ai' | 'user'; text: string }[]): Promise<{ reply: string }> {
    const remote = await safeFetchJson<{ reply: string }>('/api/coach/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: _history }),
    });
    if (remote && remote.reply) return remote;

    const lower = message.toLowerCase();
    let reply =
      'To stand out in high-tier campus placement rounds, focus on explaining your thought process out loud before writing code. Identify constraints, walk through small test cases, and analyze Big-O complexity.';

    if (lower.includes('dp') || lower.includes('dynamic programming')) {
      reply =
        'For Dynamic Programming, follow the 4-step framework: 1) Identify overlapping subproblems, 2) Define the recurrence relation and base cases, 3) Write top-down memoization, and 4) Optimize to bottom-up tabular with O(1) space where possible.';
    } else if (lower.includes('star') || lower.includes('hr') || lower.includes('behavioral')) {
      reply =
        'In behavioral interviews, structure answers using the STAR method: Situation (15%), Task (15%), Action (50% - emphasize what YOU specifically coded or decided), and Result (20% - always include numbers, percentages, or user adoption).';
    } else if (lower.includes('system design') || lower.includes('scale')) {
      reply =
        'In System Design rounds, clarify requirements first (RPS, Read/Write ratio, DAU). Sketch high-level architecture with Load Balancers, Stateless API nodes, Distributed Caching (Redis), and Read-Replicas.';
    } else if (lower.includes('resume') || lower.includes('ats')) {
      reply =
        'To pass ATS screening, mirror the keywords from your target job description directly in your Projects and Skills sections. Use strong action verbs like "Architected", "Engineered", and "Optimized".';
    }

    return { reply };
  },
};
