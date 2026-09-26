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
import { Menu, RotateCcw } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResult | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizSection[]>([]);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial applet state
  const loadData = async () => {
    try {
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

      setUser(u);
      setLatestAssessment(assessData.assessment);
      setSkillGaps(assessData.skillGaps);
      setDailyTasks(tasksData.tasks);
      setRoadmap(r);
      setCodingProblems(probs);
      setQuizzes(qz);
      setInterviewSessions(interviews);
      setJobs(jbs);
      setApplications(apps);
    } catch (err) {
      console.error('Error loading initial data:', err);
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
      setDailyTasks(res.tasks);
      setUser(res.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (task: Partial<DailyTask>) => {
    try {
      const updated = await api.addDailyTask(task);
      setDailyTasks(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMilestone = async (milestoneId: string) => {
    try {
      const res = await api.toggleMilestone(milestoneId);
      setRoadmap(res.roadmap);
      setUser(res.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateAiRoadmap = async () => {
    try {
      const updated = await api.generateAiRoadmap();
      setRoadmap(updated);
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
      const res = await api.submitAssessment(scores, user?.targetRole || 'Software/IT');
      setLatestAssessment(res.assessment);
      setSkillGaps(res.skillGaps);
      setUser(res.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunCode = async (problemId: string, code: string, language: string) => {
    const res = await api.runCode(problemId, code, language);
    if (res.user) setUser(res.user);
    return res;
  };

  const handleSubmitQuiz = async (quizId: string, score: number, totalQuestions: number) => {
    const res = await api.submitQuiz(quizId, score, totalQuestions);
    if (res.user) setUser(res.user);
    return res;
  };

  const handleStartInterview = async (track: 'HR' | 'Technical' | 'Behavioral' | 'Role-Specific', role?: string) => {
    const session = await api.startInterview(track, role || user?.targetRole);
    setInterviewSessions((prev) => [session, ...prev]);
    return session;
  };

  const handleSendInterviewAnswer = async (sessionId: string, answerText: string) => {
    const res = await api.sendInterviewAnswer(sessionId, answerText);
    if (res.user) setUser(res.user);
    setInterviewSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? res.session : s))
    );
    return res;
  };

  const handleAnalyzeResume = async (text: string, role: string, fileName?: string) => {
    const res = await api.analyzeResume(text, role, fileName);
    // Reload user XP
    const u = await api.getUserProfile();
    setUser(u);
    return res;
  };

  const handleAnalyzeProject = async (title: string, desc: string, stack: string[]) => {
    const res = await api.analyzeProject(title, desc, stack);
    const u = await api.getUserProfile();
    setUser(u);
    return res;
  };

  const handleApplyJob = async (jobId: string) => {
    const res = await api.applyToJob(jobId);
    setJobs(res.jobs);
    setApplications((prev) => [res.application, ...prev]);
    return res;
  };

  const handleSaveApplication = async (appData: Partial<ApplicationRecord>) => {
    const res = await api.saveApplication(appData);
    setApplications(res);
    return res;
  };

  const handleDeleteApplication = async (id: string) => {
    const res = await api.deleteApplication(id);
    setApplications(res);
    return res;
  };

  const handleSaveProfile = async (profileData: Partial<UserProfile>) => {
    const updated = await api.updateUserProfile(profileData);
    setUser(updated);
  };

  const handleResetDemo = async () => {
    if (confirm('Reset PlacementPilot AI to initial demo student Aarav Sharma?')) {
      await api.resetToDemo();
      await loadData();
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#060913] flex flex-col items-center justify-center space-y-4 text-white">
        <RotateCcw className="w-8 h-8 animate-spin text-cyan-400" />
        <div className="text-sm font-bold text-slate-300">Loading PlacementPilot AI...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Live Animated Futuristic Background with Neon Particles, Floating Glowing Orbs, and Cyber Grid Lines */}
      <AnimatedBackground />

      {/* Top Navigation */}
      <div className="relative z-20">
        <Navbar
          user={user}
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
              {user.targetRole} · {user.overallReadiness}% Ready
            </span>
          </div>

          {/* Views */}
          {activeTab === 'dashboard' && (
            <Dashboard
              user={user}
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
              user={user}
              latestAssessment={latestAssessment}
              skillGaps={skillGaps}
              onSubmitAssessment={handleSubmitAssessment}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'learning-hub' && (
            <LearningHub
              user={user}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressTracker
              user={user}
              skillGaps={skillGaps}
              latestAssessment={latestAssessment}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'challenges' && (
            <DailyChallenges
              user={user}
              onUpdateUser={(updated) => setUser((prev) => (prev ? { ...prev, ...updated } : null))}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'roadmap' && (
            <Roadmap
              user={user}
              roadmap={roadmap}
              onToggleMilestone={handleToggleMilestone}
              onGenerateAiRoadmap={handleGenerateAiRoadmap}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'planner' && (
            <DailyPlanner
              user={user}
              dailyTasks={dailyTasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'coding' && (
            <CodingPractice
              user={user}
              problems={codingProblems}
              onRunCode={handleRunCode}
            />
          )}

          {activeTab === 'quizzes' && (
            <Quizzes
              user={user}
              quizzes={quizzes}
              onSubmitQuiz={handleSubmitQuiz}
            />
          )}

          {activeTab === 'games' && <LearningGames user={user} />}

          {activeTab === 'interview' && (
            <MockInterview
              user={user}
              sessions={interviewSessions}
              onStartInterview={handleStartInterview}
              onSendAnswer={handleSendInterviewAnswer}
            />
          )}

          {activeTab === 'resume' && (
            <ResumeAnalyzer
              user={user}
              onAnalyzeResume={handleAnalyzeResume}
            />
          )}

          {activeTab === 'project' && (
            <ProjectAnalyzer
              user={user}
              onAnalyzeProject={handleAnalyzeProject}
            />
          )}

          {activeTab === 'jobs' && (
            <JobRecommendations
              user={user}
              jobs={jobs}
              onApplyJob={handleApplyJob}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'tracker' && (
            <ApplicationTracker
              user={user}
              applications={applications}
              onSaveApplication={handleSaveApplication}
              onDeleteApplication={handleDeleteApplication}
            />
          )}
        </main>
      </div>

      {/* Floating AI Coach Widget */}
      <AICoach
        user={user}
        skillGaps={skillGaps}
        onAskCoach={api.askCoach}
      />

      {/* Modern Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={user}
        onLoginSuccess={async (updatedUser) => {
          try {
            const saved = await api.updateUserProfile(updatedUser);
            setUser(saved);
          } catch {
            setUser((prev) => (prev ? { ...prev, ...updatedUser } : (updatedUser as UserProfile)));
          }
          setShowAuthModal(false);
        }}
      />

      {/* Onboarding / Profile Calibration Modal */}
      <OnboardingModal
        user={user}
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
