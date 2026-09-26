export type TargetRole = 'Software/IT' | 'AI/ML' | 'Data Science' | 'CS & Systems';

export type CompanyTier = 'Tier 1 / Product (Google, Microsoft, Amazon)' | 'High Growth Startups (Zomato, Swiggy, Razorpay)' | 'Service & Enterprise (TCS, Infosys, Accenture)' | 'Fintech & Quant';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetRole: TargetRole;
  careerGoals: string;
  targetCompanyTier: CompanyTier;
  graduationYear: string;
  college: string;
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  overallReadiness: number; // 0-100%
  roleReadiness: number; // 0-100%
  streakDays: number;
  lastActiveDate: string;
  totalXp: number;
  completedTasksCount: number;
  createdAt: string;
}

export interface SkillGap {
  skill: string;
  category: 'Aptitude' | 'Coding Fundamentals' | 'Communication' | 'Role Specific';
  currentScore: number; // 0-100
  targetScore: number;
  gapLevel: 'High' | 'Medium' | 'Low';
  priorityAction: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  date: string;
  overallScore: number;
  aptitudeScore: number;
  codingScore: number;
  communicationScore: number;
  roleSpecificScore: number;
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
  roleReadinessBreakdown: {
    role: string;
    readiness: number;
    fitLevel: 'Strong Fit' | 'Moderate Fit' | 'Needs Preparation';
  }[];
}

export interface RoadmapMilestone {
  id: string;
  phaseId: number;
  title: string;
  description: string;
  topics: string[];
  estimatedHours: number;
  completed: boolean;
  resources: { title: string; url?: string; type: 'doc' | 'video' | 'practice' }[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  durationWeeks: string;
  focus: string;
  milestones: RoadmapMilestone[];
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  category: 'DSA' | 'Aptitude' | 'Mock' | 'Project' | 'Core CS';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedMinutes: number;
  completed: boolean;
  priority: 1 | 2 | 3;
  date: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Arrays' | 'Two Pointers' | 'DP' | 'Trees' | 'Graphs' | 'Strings';
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  solutionCode: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  testCases: TestCase[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  category: string;
}

export interface QuizSection {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  category: 'Fundamentals' | 'Role-Specific' | 'Aptitude';
  questions: QuizQuestion[];
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  feedback?: {
    score: number; // 1-10
    strengths: string[];
    improvements: string[];
    modelAnswer: string;
  };
}

export interface InterviewSession {
  id: string;
  track: 'HR' | 'Technical' | 'Behavioral' | 'Role-Specific';
  targetRole: string;
  status: 'active' | 'completed';
  date: string;
  overallScore?: number;
  communicationScore?: number;
  technicalScore?: number;
  summaryFeedback?: string;
  messages: InterviewMessage[];
}

export interface ResumeAnalysis {
  id: string;
  fileName?: string;
  date: string;
  atsScore: number;
  targetRole: string;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletPointAudits: {
    original: string;
    score: number;
    issue: string;
    improved: string;
  }[];
  formatCritique: string[];
  actionPlan: string[];
}

export interface ProjectAnalysis {
  id: string;
  title: string;
  techStack: string[];
  depthScore: number; // 0-100
  strengths: string[];
  risksAndGaps: string[];
  likelyInterviewQuestions: string[];
  pitch30s: string;
  pitch1min: string;
  pitch3min: string;
}

export interface JobRecommendation {
  id: string;
  company: string;
  role: string;
  location: string;
  type: 'Full-time' | 'Internship';
  stipendOrSalary: string;
  targetRoleCategory: TargetRole;
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  whyItFits: string;
  deadline: string;
  applied?: boolean;
}

export interface ApplicationRecord {
  id: string;
  company: string;
  role: string;
  status: 'Applied' | 'Screening' | 'Technical Round' | 'HR Round' | 'Offered' | 'Rejected';
  appliedDate: string;
  interviewDate?: string;
  stipendOrSalary: string;
  notes: string;
  followUpReminder?: string;
}

export interface StreakRecord {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  history: { date: string; completedCount: number }[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'DSA' | 'Streak' | 'Interview' | 'Assessment' | 'Speed';
  unlocked: boolean;
  unlockedDate?: string;
  xpReward: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  progress?: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  category: 'Coding' | 'Aptitude' | 'System Concept' | 'Rapid Fire';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  rewardXp: number;
  completed: boolean;
  timeLimitMinutes: number;
  problemId?: string;
  quizId?: string;
}
