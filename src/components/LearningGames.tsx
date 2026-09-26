import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  PATTERN_BLITZ_QUESTIONS,
  CODE_DETECTIVE_QUESTIONS,
  TERMINOLOGY_PAIRS,
} from '../data/gamesData';
import {
  Gamepad2,
  Zap,
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

interface LearningGamesProps {
  user: UserProfile;
}

export const LearningGames: React.FC<LearningGamesProps> = ({ user }) => {
  const [activeGame, setActiveGame] = useState<'blitz' | 'detective' | 'matcher'>('blitz');

  // --- Game 1: Pattern Blitz State ---
  const [blitzIdx, setBlitzIdx] = useState(0);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzStreak, setBlitzStreak] = useState(0);
  const [blitzTimeLeft, setBlitzTimeLeft] = useState(20);
  const [blitzActive, setBlitzActive] = useState(false);
  const [blitzGameOver, setBlitzGameOver] = useState(false);
  const [blitzFeedback, setBlitzFeedback] = useState<string | null>(null);

  useEffect(() => {
    let timer: any = null;
    if (blitzActive && blitzTimeLeft > 0 && !blitzGameOver) {
      timer = setInterval(() => setBlitzTimeLeft((p) => p - 1), 1000);
    } else if (blitzActive && blitzTimeLeft === 0) {
      handleBlitzAnswer('__TIME_UP__');
    }
    return () => clearInterval(timer);
  }, [blitzActive, blitzTimeLeft, blitzGameOver]);

  const startBlitz = () => {
    setBlitzIdx(0);
    setBlitzScore(0);
    setBlitzStreak(0);
    setBlitzTimeLeft(20);
    setBlitzGameOver(false);
    setBlitzFeedback(null);
    setBlitzActive(true);
  };

  const handleBlitzAnswer = (chosenPattern: string) => {
    const q = PATTERN_BLITZ_QUESTIONS[blitzIdx];
    const isCorrect = chosenPattern === q.correctPattern;

    if (isCorrect) {
      const addedPoints = 100 + blitzStreak * 25;
      setBlitzScore((p) => p + addedPoints);
      setBlitzStreak((p) => p + 1);
      setBlitzFeedback(`✓ Correct! +${addedPoints} pts (${q.explanation})`);
    } else {
      setBlitzStreak(0);
      setBlitzFeedback(
        chosenPattern === '__TIME_UP__'
          ? `⏰ Time's up! Pattern was: ${q.correctPattern}`
          : `✕ Incorrect. Correct pattern is ${q.correctPattern}.`
      );
    }

    setTimeout(() => {
      setBlitzFeedback(null);
      if (blitzIdx < PATTERN_BLITZ_QUESTIONS.length - 1) {
        setBlitzIdx((p) => p + 1);
        setBlitzTimeLeft(20);
      } else {
        setBlitzGameOver(true);
        setBlitzActive(false);
      }
    }, 1400);
  };

  // --- Game 2: Code Detective State ---
  const [detectiveIdx, setDetectiveIdx] = useState(0);
  const [detectiveSelected, setDetectiveSelected] = useState<number | null>(null);
  const [detectiveScore, setDetectiveScore] = useState(0);
  const [detectiveAnswered, setDetectiveAnswered] = useState(false);

  const currentDetectiveQ = CODE_DETECTIVE_QUESTIONS[detectiveIdx];

  const handleDetectiveOption = (optIdx: number) => {
    if (detectiveAnswered) return;
    setDetectiveSelected(optIdx);
    setDetectiveAnswered(true);
    if (optIdx === currentDetectiveQ.correctIndex) {
      setDetectiveScore((p) => p + 1);
    }
  };

  const nextDetective = () => {
    if (detectiveIdx < CODE_DETECTIVE_QUESTIONS.length - 1) {
      setDetectiveIdx((p) => p + 1);
      setDetectiveSelected(null);
      setDetectiveAnswered(false);
    } else {
      alert(`🎉 Code Detective finished! You scored ${detectiveScore + (detectiveSelected === currentDetectiveQ.correctIndex ? 1 : 0)} / ${CODE_DETECTIVE_QUESTIONS.length}!`);
    }
  };

  // --- Game 3: Terminology Matcher State ---
  // Create 12 cards (6 pairs: terms & definitions)
  const [cards, setCards] = useState<
    { id: string; content: string; pairId: string; type: 'term' | 'def' }[]
  >([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matcherMoves, setMatcherMoves] = useState(0);

  const initMatcherGame = () => {
    const deck: { id: string; content: string; pairId: string; type: 'term' | 'def' }[] = [];
    TERMINOLOGY_PAIRS.slice(0, 6).forEach((pair) => {
      deck.push({ id: `${pair.id}-t`, content: pair.term, pairId: pair.id, type: 'term' });
      deck.push({ id: `${pair.id}-d`, content: pair.definition, pairId: pair.id, type: 'def' });
    });
    // Shuffle
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMatcherMoves(0);
  };

  useEffect(() => {
    if (activeGame === 'matcher' && cards.length === 0) {
      initMatcherGame();
    }
  }, [activeGame]);

  const handleCardClick = (cardIdx: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardIdx)) return;
    const card = cards[cardIdx];
    if (matchedPairs.includes(card.pairId)) return;

    const newFlipped = [...flippedCards, cardIdx];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMatcherMoves((p) => p + 1);
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.pairId === card2.pairId && card1.type !== card2.type) {
        // Matched!
        setMatchedPairs((p) => [...p, card1.pairId]);
        setFlippedCards([]);
      } else {
        // Unflip after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1100);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Interactive Mini-Games
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Placement Training Mini-Games</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Gamified exercises designed to sharpen your pattern recognition, bug detection, and core technical terminology under pressure.
          </p>
        </div>

        {/* Game Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveGame('blitz')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeGame === 'blitz' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Pattern Blitz
          </button>

          <button
            onClick={() => setActiveGame('detective')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeGame === 'detective' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-indigo-600" /> Code Detective
          </button>

          <button
            onClick={() => setActiveGame('matcher')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeGame === 'matcher' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Term Matcher
          </button>
        </div>
      </div>

      {/* GAME 1: ALGORITHMIC PATTERN BLITZ */}
      {activeGame === 'blitz' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {!blitzActive && !blitzGameOver ? (
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <Zap className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Algorithmic Pattern Blitz</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                You will be presented with problem scenarios. Rapidly identify the optimal algorithmic technique (Two Pointers, Sliding Window, Monotonic Stack, DP, etc.) within 20 seconds. Chain streaks for combo multiplier points!
              </p>
              <button
                onClick={startBlitz}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Start Blitz Mode
              </button>
            </div>
          ) : blitzGameOver ? (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
              <h2 className="text-2xl font-black text-slate-900">Blitz Session Over!</h2>
              <p className="text-xs text-slate-600">
                Final Score: <strong className="text-slate-900 text-base">{blitzScore} pts</strong>
              </p>
              <button
                onClick={startBlitz}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" /> Play Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score & Streak Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="text-xs">
                    <span className="text-slate-400">Score:</span>{' '}
                    <strong className="text-slate-900 text-sm">{blitzScore}</strong>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    {blitzStreak}x Combo
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                  <Clock className="w-3.5 h-3.5" />
                  {blitzTimeLeft}s
                </div>
              </div>

              {/* Problem Prompt */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Scenario {blitzIdx + 1} of {PATTERN_BLITZ_QUESTIONS.length}
                </span>
                <p className="text-base font-semibold text-slate-900 leading-relaxed">
                  &ldquo;{PATTERN_BLITZ_QUESTIONS[blitzIdx].problemScenario}&rdquo;
                </p>
              </div>

              {/* Feedback toast */}
              {blitzFeedback && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-medium text-indigo-900 animate-fadeIn">
                  {blitzFeedback}
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PATTERN_BLITZ_QUESTIONS[blitzIdx].options.map((option, idx) => (
                  <button
                    key={idx}
                    disabled={blitzFeedback !== null}
                    onClick={() => handleBlitzAnswer(option)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left text-xs font-bold text-slate-800 transition-all shadow-xs"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: LOGIC & CODE DETECTIVE */}
      {activeGame === 'detective' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Bug Hunt {detectiveIdx + 1} of {CODE_DETECTIVE_QUESTIONS.length}
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {currentDetectiveQ.title}
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              Score: {detectiveScore} / {CODE_DETECTIVE_QUESTIONS.length}
            </div>
          </div>

          {/* Code snippet */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-300 overflow-x-auto shadow-inner leading-relaxed">
            <pre>{currentDetectiveQ.codeSnippet}</pre>
          </div>

          {/* Question & Options */}
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              {currentDetectiveQ.question}
            </p>

            <div className="space-y-2.5">
              {currentDetectiveQ.options.map((opt, idx) => {
                const isSelected = detectiveSelected === idx;
                const isCorrect = idx === currentDetectiveQ.correctIndex;
                let btnStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-700';
                if (detectiveAnswered) {
                  if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                  else if (isSelected) btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-semibold';
                  else btnStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleDetectiveOption(idx)}
                    disabled={detectiveAnswered}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {detectiveAnswered && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-900">Detective Finding:</div>
              <p className="text-xs text-slate-600 leading-relaxed">{currentDetectiveQ.explanation}</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={nextDetective}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  {detectiveIdx < CODE_DETECTIVE_QUESTIONS.length - 1 ? 'Next Puzzle →' : 'Finish Detective'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME 3: TECH TERMINOLOGY MATCHER */}
      {activeGame === 'matcher' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Tech Terminology Matcher</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Match each technical term with its exact system definition. Test your memory and conceptual precision!
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500">Moves: <strong>{matcherMoves}</strong></span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Matched: {matchedPairs.length} / 6
              </span>
              <button
                onClick={initMatcherGame}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 border border-slate-200"
                title="Shuffle & Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {cards.map((card, idx) => {
              const isFlipped = flippedCards.includes(idx);
              const isMatched = matchedPairs.includes(card.pairId);

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`p-4 rounded-xl border min-h-[110px] flex items-center justify-center text-center cursor-pointer transition-all ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold opacity-70 pointer-events-none'
                      : isFlipped
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-400'
                  }`}
                >
                  {isFlipped || isMatched ? (
                    <div className="text-xs leading-snug">
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70 mb-1">
                        {card.type === 'term' ? 'Term' : 'Definition'}
                      </span>
                      {card.content}
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                      Flip Card
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {matchedPairs.length === 6 && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <Trophy className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-sm font-bold text-emerald-900">All 6 Concepts Matched!</div>
              <p className="text-xs text-emerald-700">Completed in {matcherMoves} turns.</p>
              <button
                onClick={initMatcherGame}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Play Another Round
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
