import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import {
  UserProfile,
  AssessmentResult,
  SkillGap,
  RoadmapPhase,
  DailyTask,
  CodingProblem,
  QuizSection,
  InterviewSession,
  JobRecommendation,
  ApplicationRecord,
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Assessment } from './components/Assessment';
import { Roadmap } from './components/Roadmap';
import { DailyPlanner } from './components/DailyPlanner';
import { CodingPractice } from './components/CodingPractice';
import { Quizzes } from './components/Quizzes';
import { LearningGames } from './components/LearningGames';
import { MockInterview } from './components/MockInterview';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { ProjectAnalyzer } from './components/ProjectAnalyzer';
import { JobRecommendations } from './components/JobRecommendations';
import { ApplicationTracker } from './components/ApplicationTracker';
import { AICoach } from './components/AICoach';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { LearningHub } from './components/LearningHub';
import { ProgressTracker } from './components/ProgressTracker';
import { DailyChallenges } from './components/DailyChallenges';
import { AnimatedBackground } from './components/AnimatedBackground';
import { INITIAL_INTERVIEW_SESSIONS } from './services/api';
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
} from './data/seedData';
import { Menu, RotateCcw } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const cached = localStorage.getItem('placementpilot_user');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object' && parsed.name) {
          return { ...DEMO_USER, ...parsed };
        }
      }
    } catch {
      // fallback
    }
    return DEMO_USER;
  });

  const safeUser: UserProfile = user && user.name ? { ...DEMO_USER, ...user } : DEMO_USER;

  useEffect(() => {
    if (!user || !user.name) {
      setUser(DEMO_USER);
    }
  }, [user]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>(INITIAL_SKILL_GAPS);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResult | null>(INITIAL_ASSESSMENT);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(INITIAL_DAILY_TASKS);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>(INITIAL_ROADMAP);
  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>(CODING_PROBLEMS);
  const [quizzes, setQuizzes] = useState<QuizSection[]>(QUIZ_SECTIONS);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>(INITIAL_INTERVIEW_SESSIONS);
  const [jobs, setJobs] = useState<JobRecommendation[]>(JOB_RECOMMENDATIONS);
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch initial applet state
  const loadData = async () => {
    try {
      const isLive = await api.checkHealth();
      if (!isLive) {
        // Backend unavailable (e.g. static Vercel deployment) - load immediately with 0 network stall
        const u = await api.getUserProfile();
        if (u && u.name) setUser(u);
        return;
      }

      const [u, assessData, tasksData, r, probs, qz, interviews, jbs, apps] =
        await Promise.all([
          api.getUserProfile(),
          api.getLatestAssessment(),
          api.getDailyTasks(),
          api.getRoadmap(),
          api.getCodingProblems(),
          api.getQuizzes(),
          api.getInterviewSessions(),
          api.getJobs(),
          api.getApplications(),
        ]);

      if (u && u.name) setUser(u);
      if (assessData?.assessment) setLatestAssessment(assessData.assessment);
      if (Array.isArray(assessData?.skillGaps) && assessData.skillGaps.length > 0) setSkillGaps(assessData.skillGaps);
      if (Array.isArray(tasksData?.tasks) && tasksData.tasks.length > 0) setDailyTasks(tasksData.tasks);
      if (Array.isArray(r) && r.length > 0) setRoadmap(r);
      if (Array.isArray(probs) && probs.length > 0) setCodingProblems(probs);
      if (Array.isArray(qz) && qz.length > 0) setQuizzes(qz);
      if (Array.isArray(interviews) && interviews.length > 0) setInterviewSessions(interviews);
      if (Array.isArray(jbs) && jbs.length > 0) setJobs(jbs);
      if (Array.isArray(apps) && apps.length > 0) setApplications(apps);
    } catch (err) {
      console.warn('Backend unavailable, running in resilient client mode:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await api.toggleDailyTask(taskId);
      if (res?.tasks) setDailyTasks(res.tasks);
      if (res?.user?.name) setUser(res.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (task: Partial<DailyTask>) => {
    try {
      const updated = await api.addDailyTask(task);
      if (Array.isArray(updated)) setDailyTasks(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMilestone = async (milestoneId: string) => {
    try {
      const res = await api.toggleMilestone(milestoneId);
      if (res?.roadmap) setRoadmap(res.roadmap);
      if (res?.user?.name) setUser(res.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateAiRoadmap = async () => {
    try {
      const updated = await api.generateAiRoadmap();
      if (Array.isArray(updated)) setRoadmap(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAssessment = async (scores: {
    aptitude: number;
    coding: number;
    communication: number;
    roleSpecific: number;
  }) => {
    try {
      const res = await api.submitAssessment(scores, safeUser.targetRole || 'Software/IT');
      if (res?.assessment) setLatestAssessment(res.assessment);
      if (res?.skillGaps) setSkillGaps(res.skillGaps);
      if (res?.user?.name) setUser(res.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunCode = async (problemId: string, code: string, language: string) => {
    const res = await api.runCode(problemId, code, language);
    if (res?.user?.name) setUser(res.user);
    return res;
  };

  const handleSubmitQuiz = async (quizId: string, score: number, totalQuestions: number) => {
    const res = await api.submitQuiz(quizId, score, totalQuestions);
    if (res?.user?.name) setUser(res.user);
    return res;
  };

  const handleStartInterview = async (track: 'HR' | 'Technical' | 'Behavioral' | 'Role-Specific', role?: string) => {
    const session = await api.startInterview(track, role || safeUser.targetRole);
    setInterviewSessions((prev) => [session, ...prev]);
    return session;
  };

  const handleSendInterviewAnswer = async (sessionId: string, answerText: string) => {
    const res = await api.sendInterviewAnswer(sessionId, answerText);
    if (res?.user?.name) setUser(res.user);
    setInterviewSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? res.session : s))
    );
    return res;
  };

  const handleAnalyzeResume = async (text: string, role: string, fileName?: string) => {
    const res = await api.analyzeResume(text, role, fileName);
    try {
      const u = await api.getUserProfile();
      if (u?.name) setUser(u);
    } catch {}
    return res;
  };

  const handleAnalyzeProject = async (title: string, desc: string, stack: string[]) => {
    const res = await api.analyzeProject(title, desc, stack);
    try {
      const u = await api.getUserProfile();
      if (u?.name) setUser(u);
    } catch {}
    return res;
  };

  const handleApplyJob = async (jobId: string) => {
    const res = await api.applyToJob(jobId);
    if (res?.jobs) setJobs(res.jobs);
    if (res?.application) setApplications((prev) => [res.application, ...prev]);
    return res;
  };

  const handleSaveApplication = async (appData: Partial<ApplicationRecord>) => {
    const res = await api.saveApplication(appData);
    if (Array.isArray(res)) setApplications(res);
    return res;
  };

  const handleDeleteApplication = async (id: string) => {
    const res = await api.deleteApplication(id);
    if (Array.isArray(res)) setApplications(res);
    return res;
  };

  const handleSaveProfile = async (profileData: Partial<UserProfile>) => {
    try {
      const updated = await api.updateUserProfile(profileData);
      if (updated && updated.name) {
        setUser(updated);
      }
    } catch {
      setUser((prev) => ({ ...prev, ...profileData }));
    }
  };

  const handleResetDemo = async () => {
    if (confirm('Reset PlacementPilot AI to initial demo student Aarav Sharma?')) {
      try {
        localStorage.clear();
      } catch {}
      await api.resetToDemo();
      setUser(DEMO_USER);
      setDailyTasks(INITIAL_DAILY_TASKS);
      setLatestAssessment(INITIAL_ASSESSMENT);
      setSkillGaps(INITIAL_SKILL_GAPS);
      setRoadmap(INITIAL_ROADMAP);
      setApplications(INITIAL_APPLICATIONS);
      setInterviewSessions(INITIAL_INTERVIEW_SESSIONS);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Live Animated Futuristic Background with Neon Particles, Floating Glowing Orbs, and Cyber Grid Lines */}
      <AnimatedBackground />

      {/* Top Navigation */}
      <div className="relative z-20">
        <Navbar
          user={safeUser}
          onOpenOnboarding={() => setShowOnboarding(true)}
          onOpenAuth={() => setShowAuthModal(true)}
          onResetDemo={handleResetDemo}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="relative z-10 flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 lg:pl-64 p-4 sm:p-6 lg:p-8">
          {/* Mobile menu button */}
          <div className="lg:hidden mb-4 flex items-center justify-between">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-2 text-xs font-semibold shadow-xs"
            >
              <Menu className="w-4 h-4 text-cyan-400" />
              <span>Menu</span>
            </button>

            <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              {safeUser.targetRole} · {safeUser.overallReadiness}% Ready
            </span>
          </div>

          {/* Views */}
          {activeTab === 'dashboard' && (
            <Dashboard
              user={safeUser}
              skillGaps={skillGaps}
              dailyTasks={dailyTasks}
              latestAssessment={latestAssessment}
              onToggleTask={handleToggleTask}
              setActiveTab={setActiveTab}
              onUpdateUser={handleSaveProfile}
              onOpenProfile={() => setShowOnboarding(true)}
            />
          )}

          {activeTab === 'assessment' && (
            <Assessment
              user={safeUser}
              latestAssessment={latestAssessment}
              skillGaps={skillGaps}
              onSubmitAssessment={handleSubmitAssessment}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'learning-hub' && (
            <LearningHub
              user={safeUser}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressTracker
              user={safeUser}
              skillGaps={skillGaps}
              latestAssessment={latestAssessment}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'challenges' && (
            <DailyChallenges
              user={safeUser}
              onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'roadmap' && (
            <Roadmap
              user={safeUser}
              roadmap={roadmap}
              onToggleMilestone={handleToggleMilestone}
              onGenerateAiRoadmap={handleGenerateAiRoadmap}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'planner' && (
            <DailyPlanner
              user={safeUser}
              dailyTasks={dailyTasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'coding' && (
            <CodingPractice
              user={safeUser}
              problems={codingProblems}
              onRunCode={handleRunCode}
            />
          )}

          {activeTab === 'quizzes' && (
            <Quizzes
              user={safeUser}
              quizzes={quizzes}
              onSubmitQuiz={handleSubmitQuiz}
            />
          )}

          {activeTab === 'games' && <LearningGames user={safeUser} />}

          {activeTab === 'interview' && (
            <MockInterview
              user={safeUser}
              sessions={interviewSessions}
              onStartInterview={handleStartInterview}
              onSendAnswer={handleSendInterviewAnswer}
            />
          )}

          {activeTab === 'resume' && (
            <ResumeAnalyzer
              user={safeUser}
              onAnalyzeResume={handleAnalyzeResume}
            />
          )}

          {activeTab === 'project' && (
            <ProjectAnalyzer
              user={safeUser}
              onAnalyzeProject={handleAnalyzeProject}
            />
          )}

          {activeTab === 'jobs' && (
            <JobRecommendations
              user={safeUser}
              jobs={jobs}
              onApplyJob={handleApplyJob}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'tracker' && (
            <ApplicationTracker
              user={safeUser}
              applications={applications}
              onSaveApplication={handleSaveApplication}
              onDeleteApplication={handleDeleteApplication}
            />
          )}
        </main>
      </div>

      {/* Floating AI Coach Widget */}
      <AICoach
        user={safeUser}
        skillGaps={skillGaps}
        onAskCoach={api.askCoach}
      />

      {/* Modern Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={safeUser}
        onLoginSuccess={async (updatedUser) => {
          try {
            const saved = await api.updateUserProfile(updatedUser);
            setUser(saved);
          } catch {
            setUser((prev) => ({ ...prev, ...updatedUser }));
          }
          setShowAuthModal(false);
        }}
      />

      {/* Onboarding / Profile Calibration Modal */}
      <OnboardingModal
        user={safeUser}
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
