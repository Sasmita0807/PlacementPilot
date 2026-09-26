import React, { useState } from 'react';
import { CodingProblem, UserProfile } from '../types';
import {
  Code2,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

interface CodingPracticeProps {
  user: UserProfile;
  problems: CodingProblem[];
  onRunCode: (problemId: string, code: string, language: string) => Promise<any>;
}

export const CodingPractice: React.FC<CodingPracticeProps> = ({
  user,
  problems,
  onRunCode,
}) => {
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem>(problems[0] || {} as any);
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');
  const [editorCode, setEditorCode] = useState<string>(
    problems[0]?.starterCode?.javascript || ''
  );
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState<'problem' | 'solution'>('problem');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const handleSelectProblem = (prob: CodingProblem) => {
    setSelectedProblem(prob);
    setEditorCode(prob.starterCode[selectedLanguage] || prob.starterCode.javascript);
    setTestResults(null);
    setActiveTab('problem');
  };

  const handleLanguageChange = (lang: 'javascript' | 'python' | 'cpp' | 'java') => {
    setSelectedLanguage(lang);
    setEditorCode(selectedProblem.starterCode[lang] || '');
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await onRunCode(selectedProblem.id, editorCode, selectedLanguage);
      if (res && res.results) {
        setTestResults(res.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const filteredProblems = problems.filter((p) => {
    if (selectedDifficulty === 'All') return true;
    return p.difficulty === selectedDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Curated DSA Track
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Coding Practice & Problem Patterns</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            High-frequency placement coding challenges covering arrays, two pointers, sliding window, DP, and trees with automated test cases.
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace: Left Problem List + Right Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Problem Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Select Problem ({filteredProblems.length})
            </div>

            <div className="space-y-1.5">
              {filteredProblems.map((prob) => {
                const isSelected = selectedProblem.id === prob.id;
                return (
                  <button
                    key={prob.id}
                    onClick={() => handleSelectProblem(prob)}
                    className={`w-full p-3 rounded-xl text-left transition-all border flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold shadow-xs'
                        : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{prob.title}</div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span
                          className={`font-semibold ${
                            prob.difficulty === 'Easy'
                              ? 'text-emerald-600'
                              : prob.difficulty === 'Medium'
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                        <span>·</span>
                        <span>{prob.category}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Code Workspace & Problem View (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            {/* Problem Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{selectedProblem.title}</h2>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      selectedProblem.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : selectedProblem.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}
                  >
                    {selectedProblem.difficulty}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">{selectedProblem.category}</span>
                </div>
              </div>

              {/* View Switcher: Problem vs Solution */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
                <button
                  onClick={() => setActiveTab('problem')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'problem' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Problem & Code
                </button>
                <button
                  onClick={() => setActiveTab('solution')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'solution' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Solution & Approach
                </button>
              </div>
            </div>

            {activeTab === 'problem' ? (
              <div className="space-y-4">
                {/* Description */}
                <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedProblem.description}
                </div>

                {/* Examples */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-800">Examples:</div>
                  {selectedProblem.examples.map((ex, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1 font-mono">
                      <div><strong className="text-slate-500 font-sans">Input:</strong> {ex.input}</div>
                      <div><strong className="text-slate-500 font-sans">Output:</strong> {ex.output}</div>
                      {ex.explanation && (
                        <div className="text-slate-500 font-sans mt-0.5"><strong>Explanation:</strong> {ex.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Code Editor Header */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">Code Editor</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {(['javascript', 'python', 'cpp', 'java'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageChange(lang)}
                          className={`px-2.5 py-1 text-[11px] rounded font-medium capitalize transition-colors ${
                            selectedLanguage === lang
                              ? 'bg-slate-900 text-white font-semibold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {lang === 'cpp' ? 'C++' : lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monospace Code Editor Area */}
                  <div className="relative rounded-xl border border-slate-300 bg-slate-900 text-slate-100 overflow-hidden font-mono text-xs shadow-inner">
                    <textarea
                      rows={12}
                      value={editorCode}
                      onChange={(e) => setEditorCode(e.target.value)}
                      className="w-full p-4 bg-transparent text-emerald-300 focus:outline-none resize-y font-mono leading-relaxed"
                      spellCheck={false}
                    />
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setEditorCode(selectedProblem.starterCode[selectedLanguage] || '')}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Starter Code
                    </button>

                    <button
                      onClick={handleRun}
                      disabled={isRunning}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isRunning ? (
                        <>
                          <RotateCcw className="w-4 h-4 animate-spin" /> Running Test Cases...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" /> Run Test Cases
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Test Results Output */}
                {testResults && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">
                          All {testResults.length} Test Cases Passed!
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        +60 XP Awarded
                      </span>
                    </div>

                    <div className="space-y-2">
                      {testResults.map((tr) => (
                        <div key={tr.testCaseNumber} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono space-y-1">
                          <div className="flex items-center justify-between font-sans">
                            <span className="font-semibold text-slate-700">Test Case #{tr.testCaseNumber}</span>
                            <span className="text-[11px] text-emerald-600 font-bold">Passed ({tr.executionTimeMs}ms)</span>
                          </div>
                          <div className="text-slate-500">Input: {tr.input}</div>
                          <div className="text-slate-800">Expected: {tr.expectedOutput} | Actual: {tr.actualOutput}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Solution Tab */
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Optimal Approach</div>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedProblem.approach}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Time Complexity:</span>
                    <strong className="text-slate-900 font-mono mt-0.5 block">{selectedProblem.timeComplexity}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Space Complexity:</span>
                    <strong className="text-slate-900 font-mono mt-0.5 block">{selectedProblem.spaceComplexity}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-900">Reference Solution (JavaScript):</div>
                  <pre className="p-4 bg-slate-900 text-emerald-300 rounded-xl font-mono text-xs overflow-x-auto">
                    {selectedProblem.solutionCode}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
