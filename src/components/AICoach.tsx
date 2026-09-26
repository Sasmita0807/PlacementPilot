import React, { useState } from 'react';
import { UserProfile, SkillGap } from '../types';
import {
  Bot,
  Send,
  Sparkles,
  ChevronDown,
  RotateCcw,
  MessageSquare,
  Flame,
  Award,
  X,
} from 'lucide-react';

interface AICoachProps {
  user: UserProfile;
  skillGaps: SkillGap[];
  onAskCoach: (message: string, history: { sender: 'ai' | 'user'; text: string }[]) => Promise<{ reply: string }>;
}

export const AICoach: React.FC<AICoachProps> = ({
  user,
  skillGaps,
  onAskCoach,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: `Hey ${user.name.split(' ')[0]}! 🔥 You are rocking a ${user.streakDays}-day streak with ${user.overallReadiness}% placement readiness. I'm Coach Nova, your 24/7 placement mentor. How can I help you conquer your goals today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'What should I prioritize today?',
    'Explain Sliding Window vs Two Pointers simply',
    'How do I handle "Tell me about a time you failed"?',
    'Tips to improve my dynamic programming score',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg = { sender: 'user' as const, text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await onAskCoach(text, newHistory);
      setMessages([...newHistory, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newHistory,
        {
          sender: 'ai',
          text: `Focus on mastering your core high-priority gaps today (${skillGaps[0]?.skill || 'DSA Patterns'}). Consistent daily practice beats cramming!`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-800 hover:to-indigo-700 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 group"
          title="Open AI Placement Coach"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-700 animate-pulse" />
          </div>
          <span className="text-xs font-bold pr-1 hidden sm:inline">Coach Nova</span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center text-indigo-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold">Coach Nova</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-semibold">
                    Gemini Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">Targeting {user.targetRole}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  m.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                    m.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'
                  }`}
                >
                  {m.sender === 'user' ? user.name.charAt(0) : 'AI'}
                </div>

                <div
                  className={`max-w-[82%] p-3 rounded-xl leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 w-fit text-[11px]">
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                Coach Nova is formulating advice...
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[11px] whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors font-medium shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about interviews, DSA, or roadmaps..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
