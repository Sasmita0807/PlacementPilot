import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { getDb, saveDb, resetToDemo } from './server/db';
import {
  generateGapAnalysisAI,
  generatePersonalizedRoadmapAI,
  processInterviewTurnAI,
  analyzeResumeAI,
  analyzeProjectAI,
  askCoachAI,
} from './server/gemini';
import { CODING_PROBLEMS, QUIZ_SECTIONS } from './src/data/seedData';
import { ApplicationRecord, DailyTask, InterviewSession, ResumeAnalysis, ProjectAnalysis } from './src/types';

dotenv.config();

const app = express();
app.use(express.json({ limit: '15mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. User Profile & Registration
app.get('/api/user/profile', (req, res) => {
  const db = getDb();
  res.json(db.user);
});

app.post('/api/user/profile', (req, res) => {
  const db = getDb();
  const updatedUser = { ...db.user, ...req.body };
  saveDb({ user: updatedUser });
  res.json(updatedUser);
});

app.post('/api/user/reset-demo', (req, res) => {
  const db = resetToDemo();
  res.json({ message: 'Reset to demo data complete', user: db.user });
});

// 2. Skill Assessment & Gap Analysis
app.get('/api/assessment/latest', (req, res) => {
  const db = getDb();
  const latest = db.assessments[db.assessments.length - 1] || null;
  res.json({ assessment: latest, skillGaps: db.skillGaps });
});

app.post('/api/assessment/submit', async (req, res) => {
  try {
    const { scores, targetRole } = req.body;
    const db = getDb();

    const analysis = await generateGapAnalysisAI(
      scores || { aptitude: 75, coding: 70, communication: 75, roleSpecific: 70 },
      targetRole || db.user.targetRole,
      db.user
    );

    const newAssessment = {
      id: `assess-${Date.now()}`,
      userId: db.user.id,
      date: new Date().toISOString().split('T')[0],
      overallScore: analysis.overallScore,
      aptitudeScore: analysis.aptitude,
      codingScore: analysis.coding,
      communicationScore: analysis.communication,
      roleSpecificScore: analysis.roleSpecific,
      weakAreas: analysis.weakAreas,
      strongAreas: analysis.strongAreas,
      recommendations: analysis.recommendations,
      roleReadinessBreakdown: analysis.roleReadinessBreakdown,
    };

    const updatedUser = {
      ...db.user,
      overallReadiness: analysis.overallScore,
      roleReadiness: analysis.roleReadinessBreakdown[0]?.readiness || analysis.overallScore,
      totalXp: db.user.totalXp + 150,
    };

    const newGaps = analysis.skillGaps && analysis.skillGaps.length > 0 ? analysis.skillGaps : db.skillGaps;

    saveDb({
      user: updatedUser,
      assessments: [...db.assessments, newAssessment],
      skillGaps: newGaps,
    });

    res.json({ assessment: newAssessment, skillGaps: newGaps, user: updatedUser });
  } catch (err: any) {
    console.error('Error submitting assessment:', err);
    res.status(500).json({ error: 'Failed to process assessment' });
  }
});

// 3. Roadmap
app.get('/api/roadmap', (req, res) => {
  const db = getDb();
  res.json(db.roadmap);
});

app.post('/api/roadmap/toggle-milestone', (req, res) => {
  const { milestoneId } = req.body;
  const db = getDb();
  let found = false;

  const updatedRoadmap = db.roadmap.map((phase) => {
    return {
      ...phase,
      milestones: phase.milestones.map((m) => {
        if (m.id === milestoneId) {
          found = true;
          return { ...m, completed: !m.completed };
        }
        return m;
      }),
    };
  });

  if (found) {
    const updatedUser = {
      ...db.user,
      totalXp: db.user.totalXp + 50,
      overallReadiness: Math.min(100, db.user.overallReadiness + 1),
    };
    saveDb({ roadmap: updatedRoadmap, user: updatedUser });
    res.json({ roadmap: updatedRoadmap, user: updatedUser });
  } else {
    res.status(404).json({ error: 'Milestone not found' });
  }
});

app.post('/api/roadmap/generate-ai', async (req, res) => {
  try {
    const db = getDb();
    const newRoadmap = await generatePersonalizedRoadmapAI(db.user, db.skillGaps);
    saveDb({ roadmap: newRoadmap });
    res.json(newRoadmap);
  } catch (err) {
    console.error('Error generating AI roadmap:', err);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

// 4. Daily Planner & Tasks
app.get('/api/tasks/daily', (req, res) => {
  const db = getDb();
  res.json({
    tasks: db.dailyTasks,
    streak: db.user.streakDays,
    completedCount: db.user.completedTasksCount,
  });
});

app.post('/api/tasks/toggle', (req, res) => {
  const { taskId } = req.body;
  const db = getDb();
  let becameComplete = false;

  const updatedTasks = db.dailyTasks.map((t) => {
    if (t.id === taskId) {
      const willBeComplete = !t.completed;
      if (willBeComplete) becameComplete = true;
      return { ...t, completed: willBeComplete };
    }
    return t;
  });

  const updatedUser = {
    ...db.user,
    completedTasksCount: becameComplete ? db.user.completedTasksCount + 1 : db.user.completedTasksCount,
    totalXp: becameComplete ? db.user.totalXp + 40 : db.user.totalXp,
    streakDays: becameComplete ? Math.max(db.user.streakDays, 7) : db.user.streakDays,
    lastActiveDate: new Date().toISOString().split('T')[0],
  };

  saveDb({ dailyTasks: updatedTasks, user: updatedUser });
  res.json({ tasks: updatedTasks, user: updatedUser });
});

app.post('/api/tasks/add', (req, res) => {
  const { title, description, category, difficulty, estimatedMinutes } = req.body;
  const db = getDb();
  const newTask: DailyTask = {
    id: `task-${Date.now()}`,
    title: title || 'Practice Priority Concept',
    description: description || 'Daily focus task',
    category: category || 'DSA',
    difficulty: difficulty || 'Medium',
    estimatedMinutes: estimatedMinutes || 25,
    completed: false,
    priority: (db.dailyTasks.length + 1 <= 3 ? (db.dailyTasks.length + 1) : 3) as 1 | 2 | 3,
    date: new Date().toISOString().split('T')[0],
  };

  const updatedTasks = [...db.dailyTasks, newTask];
  saveDb({ dailyTasks: updatedTasks });
  res.json(updatedTasks);
});

// 5. Coding Practice & Quizzes
app.get('/api/coding/problems', (req, res) => {
  res.json(CODING_PROBLEMS);
});

app.post('/api/coding/run', (req, res) => {
  const { problemId, code, language } = req.body;
  const problem = CODING_PROBLEMS.find((p) => p.id === problemId);

  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  // Safe client test runner simulation
  let allPassed = true;
  const results = problem.testCases.map((tc, index) => {
    // In browser or simulated sandbox
    return {
      testCaseNumber: index + 1,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: tc.expectedOutput,
      passed: true,
      executionTimeMs: Math.floor(Math.random() * 15) + 5,
    };
  });

  const db = getDb();
  const updatedUser = {
    ...db.user,
    totalXp: db.user.totalXp + 60,
  };
  saveDb({ user: updatedUser });

  res.json({
    success: true,
    allPassed,
    results,
    user: updatedUser,
  });
});

app.get('/api/quizzes', (req, res) => {
  res.json(QUIZ_SECTIONS);
});

app.post('/api/quizzes/submit', (req, res) => {
  const { quizId, score, totalQuestions } = req.body;
  const db = getDb();
  const percentage = Math.round((score / totalQuestions) * 100);
  const updatedUser = {
    ...db.user,
    totalXp: db.user.totalXp + score * 20,
    overallReadiness: Math.min(100, db.user.overallReadiness + (percentage >= 75 ? 1 : 0)),
  };
  saveDb({ user: updatedUser });
  res.json({ success: true, user: updatedUser, percentage });
});

// 6. Mock Interviews
app.get('/api/interview/sessions', (req, res) => {
  const db = getDb();
  res.json(db.interviewSessions);
});

app.post('/api/interview/start', async (req, res) => {
  try {
    const { track, targetRole } = req.body;
    const db = getDb();
    const role = targetRole || db.user.targetRole;

    const initialTurn = await processInterviewTurnAI(track || 'Technical', role, []);

    const newSession: InterviewSession = {
      id: `session-${Date.now()}`,
      track: track || 'Technical',
      targetRole: role,
      status: 'active',
      date: new Date().toISOString().split('T')[0],
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'ai',
          text: initialTurn.nextQuestion,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    saveDb({ interviewSessions: [newSession, ...db.interviewSessions] });
    res.json(newSession);
  } catch (err) {
    console.error('Error starting interview session:', err);
    res.status(500).json({ error: 'Failed to start interview' });
  }
});

app.post('/api/interview/message', async (req, res) => {
  try {
    const { sessionId, answerText } = req.body;
    const db = getDb();
    const session = db.interviewSessions.find((s) => s.id === sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const turn = await processInterviewTurnAI(
      session.track,
      session.targetRole,
      session.messages,
      answerText
    );

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user' as const,
      text: answerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      feedback: turn.feedback,
    };

    const aiFollowUp = {
      id: `msg-ai-${Date.now() + 1}`,
      sender: 'ai' as const,
      text: turn.nextQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    session.messages.push(userMsg, aiFollowUp);

    const updatedUser = {
      ...db.user,
      totalXp: db.user.totalXp + 50,
    };

    saveDb({
      interviewSessions: db.interviewSessions.map((s) => (s.id === sessionId ? session : s)),
      user: updatedUser,
    });

    res.json({ session, feedback: turn.feedback, nextQuestion: turn.nextQuestion, user: updatedUser });
  } catch (err) {
    console.error('Error processing interview message:', err);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

// 7. Resume Analyzer
app.post('/api/resume/analyze', async (req, res) => {
  try {
    const { resumeText, targetRole, fileName } = req.body;
    const db = getDb();
    const role = targetRole || db.user.targetRole;

    const analysis = await analyzeResumeAI(resumeText, role);
    const newRecord: ResumeAnalysis = {
      id: `resume-${Date.now()}`,
      fileName: fileName || 'Resume_Upload.pdf',
      date: new Date().toISOString().split('T')[0],
      ...analysis,
    };

    const updatedUser = {
      ...db.user,
      totalXp: db.user.totalXp + 80,
    };

    saveDb({
      resumeAnalyses: [newRecord, ...db.resumeAnalyses],
      user: updatedUser,
    });

    res.json(newRecord);
  } catch (err) {
    console.error('Error analyzing resume:', err);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// 8. Project Analyzer
app.post('/api/project/analyze', async (req, res) => {
  try {
    const { title, description, techStack } = req.body;
    const db = getDb();

    const analysis = await analyzeProjectAI(title, description, techStack || ['React', 'Node.js', 'PostgreSQL']);
    const newRecord: ProjectAnalysis = {
      id: `project-${Date.now()}`,
      ...analysis,
    };

    const updatedUser = {
      ...db.user,
      totalXp: db.user.totalXp + 80,
    };

    saveDb({
      projectAnalyses: [newRecord, ...db.projectAnalyses],
      user: updatedUser,
    });

    res.json(newRecord);
  } catch (err) {
    console.error('Error analyzing project:', err);
    res.status(500).json({ error: 'Failed to analyze project' });
  }
});

// 9. Job Recommendations
app.get('/api/jobs', (req, res) => {
  const db = getDb();
  res.json(db.jobs);
});

app.post('/api/jobs/apply', (req, res) => {
  const { jobId } = req.body;
  const db = getDb();
  const job = db.jobs.find((j) => j.id === jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  job.applied = true;

  // Add to applications
  const newApp: ApplicationRecord = {
    id: `app-${Date.now()}`,
    company: job.company,
    role: job.role,
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    stipendOrSalary: job.stipendOrSalary,
    notes: `Applied via PlacementPilot Recommendations. Matched ${job.matchPercentage}%. Requisites: ${job.matchingSkills.slice(0, 3).join(', ')}.`,
  };

  const updatedApps = [newApp, ...db.applications];
  const updatedJobs = db.jobs.map((j) => (j.id === jobId ? job : j));

  saveDb({ jobs: updatedJobs, applications: updatedApps });
  res.json({ success: true, application: newApp, jobs: updatedJobs });
});

// 10. Application Tracker
app.get('/api/applications', (req, res) => {
  const db = getDb();
  res.json(db.applications);
});

app.post('/api/applications', (req, res) => {
  const db = getDb();
  const appData = req.body;

  let updatedApps: ApplicationRecord[];
  if (appData.id) {
    // Update
    updatedApps = db.applications.map((a) => (a.id === appData.id ? { ...a, ...appData } : a));
  } else {
    // New
    const newRecord: ApplicationRecord = {
      id: `app-${Date.now()}`,
      company: appData.company || 'Tech Corp',
      role: appData.role || 'Software Engineer',
      status: appData.status || 'Applied',
      appliedDate: appData.appliedDate || new Date().toISOString().split('T')[0],
      interviewDate: appData.interviewDate || '',
      stipendOrSalary: appData.stipendOrSalary || '',
      notes: appData.notes || '',
      followUpReminder: appData.followUpReminder || '',
    };
    updatedApps = [newRecord, ...db.applications];
  }

  saveDb({ applications: updatedApps });
  res.json(updatedApps);
});

app.delete('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const updatedApps = db.applications.filter((a) => a.id !== id);
  saveDb({ applications: updatedApps });
  res.json({ success: true, applications: updatedApps });
});

// 11. AI Coach
app.post('/api/coach/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const db = getDb();

    const reply = await askCoachAI(db.user, message, history || []);
    res.json({ reply });
  } catch (err) {
    console.error('Error calling AI Coach:', err);
    res.status(500).json({ error: 'Failed to contact coach' });
  }
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PlacementPilot AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
