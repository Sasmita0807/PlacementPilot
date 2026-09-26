import React, { useState } from 'react';
import { ProjectAnalysis, UserProfile } from '../types';
import {
  Boxes,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Layers,
  Send,
} from 'lucide-react';

interface ProjectAnalyzerProps {
  user: UserProfile;
  onAnalyzeProject: (title: string, description: string, techStack: string[]) => Promise<ProjectAnalysis>;
}

const SAMPLE_PROJECT = {
  title: 'Distributed Real-Time Collaborative Canvas',
  techStack: 'React, TypeScript, Node.js, WebSockets, Redis, Docker',
  description: `Built an interactive whiteboard enabling 50+ concurrent users to sketch, annotate diagrams, and synchronize canvas state in real time.
Designed custom operational transformation (OT) and conflict-resolution algorithms to handle packet drops and out-of-order vector updates.
Integrated Redis Pub/Sub backplane to scale WebSocket connections horizontally across 3 Node.js container instances.
Implemented vector path simplification with Ramer-Douglas-Peucker algorithm, reducing WebSocket payload size by 65%.`,
};

export const ProjectAnalyzer: React.FC<ProjectAnalyzerProps> = ({
  user,
  onAnalyzeProject,
}) => {
  const [title, setTitle] = useState(SAMPLE_PROJECT.title);
  const [techStackStr, setTechStackStr] = useState(SAMPLE_PROJECT.techStack);
  const [description, setDescription] = useState(SAMPLE_PROJECT.description);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ProjectAnalysis | null>(null);
  const [activePitch, setActivePitch] = useState<'30s' | '1min' | '3min'>('30s');

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsAnalyzing(true);
    try {
      const stack = techStackStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await onAnalyzeProject(title, description, stack);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Engineering Narrative Coach
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Depth & Interview Pitch Analyzer</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Transform technical repositories into captivating interview answers. Analyze architectural depth, pinpoint interviewer vulnerability probes, and generate 30s, 1-min, and 3-min pitch scripts.
          </p>
        </div>

        <button
          onClick={() => {
            setTitle(SAMPLE_PROJECT.title);
            setTechStackStr(SAMPLE_PROJECT.techStack);
            setDescription(SAMPLE_PROJECT.description);
            handleAnalyze();
          }}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors shrink-0"
        >
          Load & Analyze Sample Project
        </button>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleAnalyze} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-indigo-600" />
              Project Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Real-Time Distributed Whiteboard"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tech Stack (comma separated)</label>
              <input
                type="text"
                required
                value={techStackStr}
                onChange={(e) => setTechStackStr(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js, WebSockets, Redis"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Overview & Technical Highlights
              </label>
              <textarea
                rows={9}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the architecture, key technical challenges solved, concurrency, or performance metrics achieved..."
                className="w-full p-3 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600 leading-relaxed font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || !title.trim() || !description.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" /> Analyzing Project Depth...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Analyze Project & Generate Pitches
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Pitch Generator & Architectural Audit (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Score Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{result.title}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.techStack.map((tech, i) => (
                      <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Technical Depth
                  </span>
                  <span className="text-2xl font-black text-indigo-600">{result.depthScore} / 100</span>
                </div>
              </div>

              {/* Pitch Script Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Interview Pitch Script
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    <button
                      onClick={() => setActivePitch('30s')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        activePitch === '30s' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      30s Elevator
                    </button>
                    <button
                      onClick={() => setActivePitch('1min')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        activePitch === '1min' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      1m Recruiter
                    </button>
                    <button
                      onClick={() => setActivePitch('3min')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        activePitch === '3min' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      3m Deep Dive (STAR)
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                  {activePitch === '30s' && result.pitch30s}
                  {activePitch === '1min' && result.pitch1min}
                  {activePitch === '3min' && result.pitch3min}
                </div>
              </div>

              {/* Strengths & Interview Vulnerabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/60 rounded-xl space-y-2">
                  <span className="font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Architectural Merits
                  </span>
                  <ul className="space-y-1 text-slate-700 text-[11px]">
                    {result.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-2">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Potential Probes & Gaps
                  </span>
                  <ul className="space-y-1 text-slate-700 text-[11px]">
                    {result.risksAndGaps.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Likely Interview Questions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  Questions Interviewers Will Ask About This Project:
                </div>
                <div className="space-y-1.5">
                  {result.likelyInterviewQuestions.map((q, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 flex items-start gap-2">
                      <span className="font-bold text-indigo-600 shrink-0">Q{idx + 1}:</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-xs">
              <Layers className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Elevate Your Engineering Stories</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                Fill in your project information on the left and click &ldquo;Analyze Project&rdquo; to prepare structured STAR explanations that impress senior interviewers.
              </p>
              <button
                onClick={() => handleAnalyze()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Analyze Sample Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
