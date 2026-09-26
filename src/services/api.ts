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

export const api = {
  // User Profile
  async getUserProfile(): Promise<UserProfile> {
    const res = await fetch('/api/user/profile');
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update user profile');
    return res.json();
  },

  async resetToDemo(): Promise<{ message: string; user: UserProfile }> {
    const res = await fetch('/api/user/reset-demo', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo data');
    return res.json();
  },

  // Assessment
  async getLatestAssessment(): Promise<{ assessment: AssessmentResult | null; skillGaps: SkillGap[] }> {
    const res = await fetch('/api/assessment/latest');
    if (!res.ok) throw new Error('Failed to fetch assessment');
    return res.json();
  },

  async submitAssessment(scores: {
    aptitude: number;
    coding: number;
    communication: number;
    roleSpecific: number;
  }, targetRole: string): Promise<{ assessment: AssessmentResult; skillGaps: SkillGap[]; user: UserProfile }> {
    const res = await fetch('/api/assessment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores, targetRole }),
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    return res.json();
  },

  // Roadmap
  async getRoadmap(): Promise<RoadmapPhase[]> {
    const res = await fetch('/api/roadmap');
    if (!res.ok) throw new Error('Failed to fetch roadmap');
    return res.json();
  },

  async toggleMilestone(milestoneId: string): Promise<{ roadmap: RoadmapPhase[]; user: UserProfile }> {
    const res = await fetch('/api/roadmap/toggle-milestone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestoneId }),
    });
    if (!res.ok) throw new Error('Failed to toggle milestone');
    return res.json();
  },

  async generateAiRoadmap(): Promise<RoadmapPhase[]> {
    const res = await fetch('/api/roadmap/generate-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to generate roadmap');
    return res.json();
  },

  // Daily Tasks
  async getDailyTasks(): Promise<{ tasks: DailyTask[]; streak: number; completedCount: number }> {
    const res = await fetch('/api/tasks/daily');
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async toggleDailyTask(taskId: string): Promise<{ tasks: DailyTask[]; user: UserProfile }> {
    const res = await fetch('/api/tasks/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });
    if (!res.ok) throw new Error('Failed to toggle task');
    return res.json();
  },

  async addDailyTask(task: Partial<DailyTask>): Promise<DailyTask[]> {
    const res = await fetch('/api/tasks/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to add task');
    return res.json();
  },

  // Coding Practice & Quizzes
  async getCodingProblems(): Promise<CodingProblem[]> {
    const res = await fetch('/api/coding/problems');
    if (!res.ok) throw new Error('Failed to fetch problems');
    return res.json();
  },

  async runCode(problemId: string, code: string, language: string) {
    const res = await fetch('/api/coding/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemId, code, language }),
    });
    if (!res.ok) throw new Error('Failed to run code');
    return res.json();
  },

  async getQuizzes(): Promise<QuizSection[]> {
    const res = await fetch('/api/quizzes');
    if (!res.ok) throw new Error('Failed to fetch quizzes');
    return res.json();
  },

  async submitQuiz(quizId: string, score: number, totalQuestions: number) {
    const res = await fetch('/api/quizzes/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId, score, totalQuestions }),
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    return res.json();
  },

  // Mock Interviews
  async getInterviewSessions(): Promise<InterviewSession[]> {
    const res = await fetch('/api/interview/sessions');
    if (!res.ok) throw new Error('Failed to fetch interviews');
    return res.json();
  },

  async startInterview(track: 'HR' | 'Technical' | 'Behavioral' | 'Role-Specific', targetRole?: string): Promise<InterviewSession> {
    const res = await fetch('/api/interview/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ track, targetRole }),
    });
    if (!res.ok) throw new Error('Failed to start interview');
    return res.json();
  },

  async sendInterviewAnswer(sessionId: string, answerText: string) {
    const res = await fetch('/api/interview/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, answerText }),
    });
    if (!res.ok) throw new Error('Failed to submit answer');
    return res.json();
  },

  // Resume Analyzer
  async analyzeResume(resumeText: string, targetRole: string, fileName?: string): Promise<ResumeAnalysis> {
    const res = await fetch('/api/resume/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, targetRole, fileName }),
    });
    if (!res.ok) throw new Error('Failed to analyze resume');
    return res.json();
  },

  // Project Analyzer
  async analyzeProject(title: string, description: string, techStack: string[]): Promise<ProjectAnalysis> {
    const res = await fetch('/api/project/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, techStack }),
    });
    if (!res.ok) throw new Error('Failed to analyze project');
    return res.json();
  },

  // Jobs
  async getJobs(): Promise<JobRecommendation[]> {
    const res = await fetch('/api/jobs');
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async applyToJob(jobId: string) {
    const res = await fetch('/api/jobs/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    });
    if (!res.ok) throw new Error('Failed to apply to job');
    return res.json();
  },

  // Applications Tracker
  async getApplications(): Promise<ApplicationRecord[]> {
    const res = await fetch('/api/applications');
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  async saveApplication(app: Partial<ApplicationRecord>): Promise<ApplicationRecord[]> {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    });
    if (!res.ok) throw new Error('Failed to save application');
    return res.json();
  },

  async deleteApplication(id: string): Promise<ApplicationRecord[]> {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete application');
    const data = await res.json();
    return data.applications;
  },

  // AI Coach
  async askCoach(message: string, history: { sender: 'ai' | 'user'; text: string }[]): Promise<{ reply: string }> {
    const res = await fetch('/api/coach/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) throw new Error('Failed to talk to coach');
    return res.json();
  },
};
