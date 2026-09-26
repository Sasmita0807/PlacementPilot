import React, { useState } from 'react';
import { ResumeAnalysis, UserProfile } from '../types';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  UploadCloud,
  FileCheck,
} from 'lucide-react';

interface ResumeAnalyzerProps {
  user: UserProfile;
  onAnalyzeResume: (resumeText: string, targetRole: string, fileName?: string) => Promise<ResumeAnalysis>;
}

const SAMPLE_RESUME_TEXT = `AARAV SHARMA
aarav.sharma@campus.edu | +91 98765 43210 | GitHub: github.com/aarav | LinkedIn: linkedin.com/in/aarav

EDUCATION
National Institute of Technology — B.Tech Computer Science & Engineering (2022 - 2026)
CGPA: 8.8 / 10.0

TECHNICAL SKILLS
Languages: C++, Python, JavaScript, SQL
Frameworks & Tools: React, Node.js, Express, MongoDB, Git, Postman
Core CS: Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks

PROJECTS
PlacementPrep Portal (React, Node.js, Express, MongoDB)
- Developed a full-stack platform for college students preparing for technical placement tests.
- Implemented user authentication with JWT and bcrypt for secure login sessions.
- Created interactive quizzes and stored test scores in MongoDB database collections.
- Designed responsive user interface using Tailwind CSS.

Algorithmic Trading Backtester (Python, Pandas, Matplotlib)
- Built a backtesting framework to test moving average crossover strategies on historical equity data.
- Parsed CSV financial datasets containing 10,000+ daily stock records with Pandas.
- Visualized portfolio drawdown curves and Sharpe ratio performance charts.

COURSEWORK & ACHIEVEMENTS
- Solved 250+ algorithmic problems across LeetCode and Codeforces.
- Top 10 finalist in Inter-College Annual Hackathon 2025 (Fintech track).`;

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  user,
  onAnalyzeResume,
}) => {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME_TEXT);
  const [targetRole, setTargetRole] = useState(user.targetRole);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await onAnalyzeResume(resumeText, targetRole, 'Resume_Draft.pdf');
      setAnalysisResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              ATS Recruiter Screen
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ATS Resume Analyzer & Keyword Auditor</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Audit your resume against applicant tracking systems (Workday, Greenhouse, Lever). Identify missing tech keywords, score quantifiable metrics, and get Google XYZ rewrites.
          </p>
        </div>

        <button
          onClick={() => {
            setResumeText(SAMPLE_RESUME_TEXT);
            handleAnalyze();
          }}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors shrink-0"
        >
          Load & Analyze Sample Resume
        </button>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Text / File Upload (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Resume Content
              </h2>

              <label className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5" />
                Upload .txt / .doc
                <input type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <textarea
              rows={16}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume plain text or project bullets here..."
              className="w-full p-4 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-600 leading-relaxed resize-y bg-slate-50/50"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Target Role:</span>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as any)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="Software/IT">Software/IT Engineer</option>
                  <option value="AI/ML">AI/ML Engineer</option>
                  <option value="Data Science">Data Scientist</option>
                  <option value="CS & Systems">CS & Systems</option>
                </select>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resumeText.trim()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" /> Auditing with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Run ATS Audit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Analysis Results (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {analysisResult ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
              {/* ATS Score Meter */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    ATS Readiness Rating
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {analysisResult.atsScore} / 100
                  </div>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    analysisResult.atsScore >= 80
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {analysisResult.atsScore >= 80 ? 'Highly Competitive' : 'Needs Metric Calibration'}
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {analysisResult.summary}
              </p>

              {/* Keywords Breakdown */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800">High-Impact Keyword Audit:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-xl space-y-2">
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Matched Keywords
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.matchedKeywords.map((k, idx) => (
                        <span key={idx} className="bg-white text-emerald-900 px-1.5 py-0.5 rounded text-[11px] border border-emerald-100">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50/50 border border-rose-200/60 rounded-xl space-y-2">
                    <span className="font-bold text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Missing High-Demand
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.missingKeywords.map((k, idx) => (
                        <span key={idx} className="bg-white text-rose-900 px-1.5 py-0.5 rounded text-[11px] border border-rose-100">
                          + {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bullet Point Rewrites (Google XYZ Formula) */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800">
                  Google XYZ Bullet Point Rewrites:
                </div>
                {analysisResult.bulletPointAudits.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                    <div className="text-slate-400">
                      <span className="font-semibold text-rose-600">Original:</span> &ldquo;{item.original}&rdquo;
                    </div>
                    <div className="text-[11px] text-amber-700 font-medium">
                      <strong>Issue:</strong> {item.issue}
                    </div>
                    <div className="p-2.5 bg-white border border-indigo-200 rounded-lg text-slate-900 font-medium leading-relaxed">
                      <span className="text-indigo-600 font-bold block mb-0.5">Recommended XYZ Rewrite:</span>
                      &ldquo;{item.improved}&rdquo;
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Plan */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800">Priority Action Steps:</div>
                <ul className="space-y-1 text-xs text-slate-600">
                  {analysisResult.actionPlan.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-xs">
              <FileCheck className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Run Your First ATS Scan</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                Paste your resume on the left and click &ldquo;Run ATS Audit&rdquo; to benchmark keyword density and receive line-by-line metric rewrites.
              </p>
              <button
                onClick={handleAnalyze}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Audit Current Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
