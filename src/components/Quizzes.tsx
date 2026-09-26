import React, { useState } from 'react';
import { QuizSection, UserProfile } from '../types';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';

interface QuizzesProps {
  user: UserProfile;
  quizzes: QuizSection[];
  onSubmitQuiz: (quizId: string, score: number, totalQuestions: number) => Promise<any>;
}

export const Quizzes: React.FC<QuizzesProps> = ({
  user,
  quizzes,
  onSubmitQuiz,
}) => {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizSection>(quizzes[0] || {} as any);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startQuiz = (quiz: QuizSection) => {
    setSelectedQuiz(quiz);
    setActiveQuestionIdx(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleSelectOption = (idx: number) => {
    if (showAnswer) return;
    setSelectedOption(idx);
    setShowAnswer(true);

    const isCorrect = idx === selectedQuiz.questions[activeQuestionIdx].correctOptionIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = async () => {
    if (activeQuestionIdx < selectedQuiz.questions.length - 1) {
      setActiveQuestionIdx((p) => p + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setQuizFinished(true);
      setIsSubmitting(true);
      try {
        await onSubmitQuiz(selectedQuiz.id, score + (selectedOption === selectedQuiz.questions[activeQuestionIdx].correctOptionIndex ? 1 : 0), selectedQuiz.questions.length);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const currentQ = selectedQuiz.questions?.[activeQuestionIdx];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Knowledge Verification
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Placement Quizzes & Concept Drills</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Test and reinforce critical principles across core computer science, role-specific domain engineering, and fast aptitude reasoning.
          </p>
        </div>
      </div>

      {/* Section Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quizzes.map((q) => {
          const isSelected = selectedQuiz.id === q.id;
          return (
            <div
              key={q.id}
              onClick={() => startQuiz(q)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-300 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200/60 inline-block mb-2">
                  {q.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{q.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{q.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{q.questionsCount} Questions</span>
                <span className="text-indigo-600 font-semibold flex items-center gap-1">
                  Start Drill →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Quiz Area */}
      {selectedQuiz && currentQ && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {!quizFinished ? (
            <>
              {/* Question Meta */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {selectedQuiz.title} · {currentQ.category}
                  </span>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Question {activeQuestionIdx + 1} of {selectedQuiz.questions.length}
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Score: {score} Correct
                </div>
              </div>

              {/* Question */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                  {currentQ.question}
                </h3>

                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === currentQ.correctOptionIndex;

                    let btnStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-700';
                    if (showAnswer) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-semibold';
                      } else {
                        btnStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        disabled={showAnswer}
                        className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm transition-all border flex items-start gap-3 ${btnStyle}`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                            showAnswer && isCorrect
                              ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                              : showAnswer && isSelected
                              ? 'border-rose-600 bg-rose-600 text-white font-bold'
                              : 'border-slate-300 text-slate-500'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation Banner */}
              {showAnswer && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    {selectedOption === currentQ.correctOptionIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Correct! Great intuition.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span className="text-rose-700">Incorrect. Review the concept below:</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Footer Controls */}
              {showAnswer && (
                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    {activeQuestionIdx < selectedQuiz.questions.length - 1 ? (
                      <>
                        Next Question <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Complete Quiz Drill <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-8 space-y-4">
              <Award className="w-12 h-12 text-indigo-600 mx-auto" />
              <h2 className="text-2xl font-black text-slate-900">Quiz Drill Completed!</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You scored <strong className="text-slate-900">{score} out of {selectedQuiz.questions.length}</strong> (
                {Math.round((score / selectedQuiz.questions.length) * 100)}%). Your XP and readiness score have been updated!
              </p>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => startQuiz(selectedQuiz)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Drill
                </button>
                <button
                  onClick={() => {
                    const nextQ = quizzes.find((q) => q.id !== selectedQuiz.id) || quizzes[0];
                    startQuiz(nextQ);
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Try Another Topic
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
