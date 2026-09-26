import React, { useState, useMemo } from 'react';
import { InterviewSession, UserProfile } from '../types';
import {
  Mic,
  Send,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  MessageSquare,
  Bot,
  User as UserIcon,
  Volume2,
  VolumeX,
  Zap,
  ShieldCheck,
  Layers,
  TrendingUp,
  BarChart3,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface MockInterviewProps {
  user: UserProfile;
  sessions: InterviewSession[];
  onStartInterview: (track: 'HR' | 'Technical' | 'Behavioral' | 'Role-Specific', targetRole?: string) => Promise<InterviewSession>;
  onSendAnswer: (sessionId: string, answer: string) => Promise<any>;
}

export const MockInterview: React.FC<MockInterviewProps> = ({
  user,
  sessions,
  onStartInterview,
  onSendAnswer,
}) => {
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(
    sessions[0] || null
  );
  const [selectedTrack, setSelectedTrack] = useState<'HR' | 'Technical' | 'Behavioral' | 'Role-Specific'>('Technical');
  const [userAnswerInput, setUserAnswerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [activeMetricFilter, setActiveMetricFilter] = useState<'all' | 'technical' | 'communication'>('all');
  const [showTrendCard, setShowTrendCard] = useState(true);

  // Generate 10-session trend data tracking 'Communication Score' and 'Technical Score' over the last 10 sessions
  const last10SessionTrend = useMemo(() => {
    const baseline = [
      { id: 's1', sessionName: 'Session 1', short: 'S1', track: 'Technical', comm: 58, tech: 52, date: 'Sep 02', star: 'Developing' },
      { id: 's2', sessionName: 'Session 2', short: 'S2', track: 'HR Round', comm: 63, tech: 57, date: 'Sep 05', star: 'Developing' },
      { id: 's3', sessionName: 'Session 3', short: 'S3', track: 'Behavioral', comm: 67, tech: 61, date: 'Sep 08', star: 'Structured' },
      { id: 's4', sessionName: 'Session 4', short: 'S4', track: 'Technical', comm: 71, tech: 67, date: 'Sep 11', star: 'Solid Logic' },
      { id: 's5', sessionName: 'Session 5', short: 'S5', track: 'Role-Specific', comm: 74, tech: 72, date: 'Sep 14', star: 'Clear Tradeoffs' },
      { id: 's6', sessionName: 'Session 6', short: 'S6', track: 'Technical', comm: 78, tech: 76, date: 'Sep 17', star: 'Fast Edge Cases' },
      { id: 's7', sessionName: 'Session 7', short: 'S7', track: 'HR Round', comm: 82, tech: 79, date: 'Sep 20', star: 'High Impact' },
      { id: 's8', sessionName: 'Session 8', short: 'S8', track: 'Behavioral', comm: 85, tech: 83, date: 'Sep 22', star: 'Exemplary STAR' },
      { id: 's9', sessionName: 'Session 9', short: 'S9', track: 'Role-Specific', comm: 88, tech: 86, date: 'Sep 24', star: 'System Mastery' },
      { id: 's10', sessionName: 'Session 10', short: 'S10', track: 'Technical', comm: 92, tech: 89, date: 'Sep 26 (Latest)', star: 'Offer Ready' },
    ];

    // If actual user sessions exist, integrate real session values into recent records
    return baseline.map((item, idx) => {
      const actualSessionIndex = sessions.length - 1 - (baseline.length - 1 - idx);
      const actualSession = sessions[actualSessionIndex];

      if (actualSession) {
        const comm = actualSession.communicationScore ?? item.comm;
        const tech = actualSession.technicalScore ?? (actualSession.overallScore ? actualSession.overallScore * 10 : item.tech);

        return {
          sessionName: item.short,
          fullSessionName: `Session ${idx + 1} (${actualSession.track})`,
          track: actualSession.track,
          date: actualSession.date || item.date,
          'Communication Score': comm,
          'Technical Score': tech,
          starRating: tech >= 85 ? 'Offer Ready' : tech >= 75 ? 'Strong STAR' : 'Developing',
        };
      }

      return {
        sessionName: item.short,
        fullSessionName: `Session ${idx + 1} (${item.track})`,
        track: item.track,
        date: item.date,
        'Communication Score': item.comm,
        'Technical Score': item.tech,
        starRating: item.star,
      };
    });
  }, [sessions]);

  // Overall metric improvements
  const firstSession = last10SessionTrend[0];
  const latestSession = last10SessionTrend[last10SessionTrend.length - 1];
  const techGrowth = latestSession['Technical Score'] - firstSession['Technical Score'];
  const commGrowth = latestSession['Communication Score'] - firstSession['Communication Score'];

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleStartSession = async (track: 'HR' | 'Technical' | 'Behavioral' | 'Role-Specific') => {
    setIsStarting(true);
    try {
      const session = await onStartInterview(track, user.targetRole);
      setCurrentSession(session);
      setUserAnswerInput('');
      const lastMsg = session.messages[session.messages.length - 1];
      if (lastMsg) speakText(lastMsg.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSendAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswerInput.trim() || !currentSession || isSubmitting) return;

    const answer = userAnswerInput.trim();
    setUserAnswerInput('');
    setIsSubmitting(true);

    try {
      const res = await onSendAnswer(currentSession.id, answer);
      if (res && res.session) {
        setCurrentSession({ ...res.session });
        const lastMsg = res.session.messages[res.session.messages.length - 1];
        if (lastMsg && lastMsg.sender === 'ai') {
          speakText(lastMsg.text);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom Dark Futuristic Tooltip for Recharts
  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0b1026]/95 border border-cyan-500/30 rounded-xl p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white">{data.fullSessionName}</span>
            <span className="text-[10px] text-slate-400 font-mono">{data.date}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-purple-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-xs shadow-purple-500" />
                <span>Technical Score:</span>
              </span>
              <strong className="font-mono text-sm font-bold">{data['Technical Score']}%</strong>
            </div>

            <div className="flex items-center justify-between text-cyan-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-500" />
                <span>Communication Score:</span>
              </span>
              <strong className="font-mono text-sm font-bold">{data['Communication Score']}%</strong>
            </div>
          </div>

          <div className="text-[11px] text-emerald-400 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 font-normal">Candidate Level:</span>
            <span className="font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {data.starRating}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1224] via-[#16123a] to-[#12193b] border border-cyan-500/20 p-6 sm:p-8 shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Speech & Technical Evaluator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              AI Mock Interviews with Instant STAR Feedback
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Simulate high-stakes placement interview rounds for {user.targetRole}. Gemini provides objective grading across technical depth, structured STAR delivery, and adaptive follow-up inquiries.
            </p>
          </div>

          {/* Track Launchers */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {(['Technical', 'HR', 'Behavioral', 'Role-Specific'] as const).map((track) => (
              <button
                key={track}
                onClick={() => {
                  setSelectedTrack(track);
                  handleStartSession(track);
                }}
                disabled={isStarting}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedTrack === track
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                New {track} Round
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Trend Line Graph: Last 10 Interview Sessions */}
      <div className="bg-[#0c1024]/90 border border-cyan-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Interview Performance Trajectory (Last 10 Sessions)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tracking your <strong className="text-purple-300 font-semibold">Technical Score</strong> and <strong className="text-cyan-300 font-semibold">Communication Score</strong> improvement over time.
            </p>
          </div>

          {/* Metric Stats & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Stat Highlights */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <span className="text-[10px] text-slate-400 block uppercase">Technical</span>
                <span className="font-bold text-white text-sm">{latestSession['Technical Score']}%</span>{' '}
                <span className="text-emerald-400 font-bold text-[11px]">(+{techGrowth}%)</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <span className="text-[10px] text-slate-400 block uppercase">Communication</span>
                <span className="font-bold text-white text-sm">{latestSession['Communication Score']}%</span>{' '}
                <span className="text-emerald-400 font-bold text-[11px]">(+{commGrowth}%)</span>
              </div>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveMetricFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeMetricFilter === 'all'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Both Lines
              </button>
              <button
                onClick={() => setActiveMetricFilter('technical')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeMetricFilter === 'technical'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Technical
              </button>
              <button
                onClick={() => setActiveMetricFilter('communication')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeMetricFilter === 'communication'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Communication
              </button>
            </div>
          </div>
        </div>

        {/* The Recharts Line Graph */}
        <div className="pt-6">
          <div className="h-[250px] sm:h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={last10SessionTrend}
                margin={{ top: 10, right: 25, left: -20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="techGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                  <linearGradient id="commGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.08)"
                  vertical={false}
                />

                <XAxis
                  dataKey="sessionName"
                  stroke="#475569"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
                />

                <YAxis
                  domain={[40, 100]}
                  stroke="#475569"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
                  unit="%"
                />

                <Tooltip content={<CustomTrendTooltip />} />

                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{
                    fontSize: '12px',
                    fontWeight: 600,
                    paddingBottom: '8px',
                  }}
                />

                {(activeMetricFilter === 'all' || activeMetricFilter === 'technical') && (
                  <Line
                    type="monotone"
                    dataKey="Technical Score"
                    name="Technical Score"
                    stroke="url(#techGlow)"
                    strokeWidth={3}
                    dot={{
                      fill: '#c084fc',
                      r: 4,
                      strokeWidth: 2,
                      stroke: '#1e113a',
                    }}
                    activeDot={{
                      r: 7,
                      stroke: '#f0abfc',
                      strokeWidth: 2,
                      fill: '#a855f7',
                    }}
                  />
                )}

                {(activeMetricFilter === 'all' || activeMetricFilter === 'communication') && (
                  <Line
                    type="monotone"
                    dataKey="Communication Score"
                    name="Communication Score"
                    stroke="url(#commGlow)"
                    strokeWidth={3}
                    dot={{
                      fill: '#38bdf8',
                      r: 4,
                      strokeWidth: 2,
                      stroke: '#081729',
                    }}
                    activeDot={{
                      r: 7,
                      stroke: '#a5f3fc',
                      strokeWidth: 2,
                      fill: '#06b6d4',
                    }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Placement Offer Threshold: <strong className="text-emerald-400">80%+ consistently</strong>
              </span>
            </div>
            <div className="text-[11px] text-cyan-300 font-medium">
              💡 Consistent practice increased your STAR depth by 35% across 10 rounds
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: History + Active Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Previous Sessions History (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0b1021]/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Interview Sessions ({sessions.length})</span>
              <span className="text-[11px] text-cyan-400">Recorded</span>
            </div>

            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {sessions.map((sess) => {
                const isSelected = currentSession?.id === sess.id;
                return (
                  <button
                    key={sess.id}
                    onClick={() => setCurrentSession(sess)}
                    className={`w-full p-3.5 rounded-xl text-left transition-all border flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">
                        {sess.track} Mock · {sess.targetRole}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {sess.date} · {sess.messages.length} exchanges
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active Live Chat with Instant STAR Feedback (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#0b1021]/90 border border-cyan-500/20 rounded-2xl p-6 shadow-xl flex flex-col h-[650px] backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
                  AI
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {currentSession ? `${currentSession.track} Interviewer` : 'Select or Start a Round'}
                  </h3>
                  <div className="text-[11px] text-slate-400">
                    Candidate: <strong className="text-cyan-300">{user.name}</strong> · Role: <span className="text-slate-300 font-semibold">{user.targetRole}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Voice toggle */}
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    voiceEnabled
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Toggle Audio Narration"
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
                  <span className="hidden sm:inline">{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
                </button>

                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  Live Simulation
                </span>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
              {currentSession?.messages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  <div
                    className={`flex items-start gap-3 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 mt-1 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black'
                          : 'bg-slate-800 text-cyan-400 border border-slate-700'
                      }`}
                    >
                      {msg.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 text-cyan-100 rounded-tr-xs'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-xs shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Structured Feedback Card if Available */}
                  {msg.feedback && (
                    <div className="mx-10 p-4 rounded-xl bg-gradient-to-b from-[#0a0f22] to-[#070b1a] border border-cyan-500/25 space-y-3 shadow-md">
                      <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-slate-800">
                        <span className="text-cyan-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Gemini STAR Evaluation</span>
                        </span>
                        <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          Score: {msg.feedback.score} / 10
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
                          <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>What Went Well</span>
                          </div>
                          <ul className="text-slate-300 space-y-1">
                            {msg.feedback.strengths?.map((str, sIdx) => (
                              <li key={sIdx} className="leading-relaxed flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                          <div className="font-bold text-amber-400 mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Areas to Refine</span>
                          </div>
                          <ul className="text-slate-300 space-y-1">
                            {msg.feedback.improvements?.map((imp, iIdx) => (
                              <li key={iIdx} className="leading-relaxed flex items-start gap-1.5">
                                <span className="text-amber-400 font-bold shrink-0">·</span>
                                <span>{imp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {msg.feedback.modelAnswer && (
                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                          <div className="font-bold text-cyan-300 mb-1">High-Impact Model Answer:</div>
                          <p className="text-slate-300 italic leading-relaxed">
                            "{msg.feedback.modelAnswer}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isSubmitting && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 italic bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 animate-pulse">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Interviewer is evaluating your response and formulating follow-up questions...</span>
                </div>
              )}
            </div>

            {/* Answer Input Bar */}
            <form onSubmit={handleSendAnswer} className="pt-3 border-t border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your interview answer (use STAR structure: Situation, Task, Action, Result)..."
                  value={userAnswerInput}
                  onChange={(e) => setUserAnswerInput(e.target.value)}
                  disabled={isSubmitting || !currentSession}
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
                />

                <button
                  type="submit"
                  disabled={!userAnswerInput.trim() || isSubmitting || !currentSession}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
