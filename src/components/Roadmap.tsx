import React, { useState } from 'react';
import { RoadmapPhase, UserProfile } from '../types';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  BookOpen,
  Video,
  Code2,
  RotateCcw,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface RoadmapProps {
  user: UserProfile;
  roadmap: RoadmapPhase[];
  onToggleMilestone: (milestoneId: string) => void;
  onGenerateAiRoadmap: () => Promise<void>;
  setActiveTab: (tab: string) => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({
  user,
  roadmap,
  onToggleMilestone,
  onGenerateAiRoadmap,
  setActiveTab,
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onGenerateAiRoadmap();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const totalMilestones = roadmap.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = roadmap.reduce(
    (acc, p) => acc + p.milestones.filter((m) => m.completed).length,
    0
  );
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Adaptive Path
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{user.targetRole} Track</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personalized Placement Roadmap</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            A 4-phase structured curriculum calibrated to your target company tier ({user.targetCompanyTier}) and current diagnostic gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isRegenerating ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                Adapting with Gemini...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Regenerate with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overall Progress Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-xl">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700">Roadmap Completion</span>
            <span className="text-indigo-600">{completedMilestones} / {totalMilestones} Milestones ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 border-l border-slate-100 pl-4 hidden sm:block">
          <div>Target Timeline: <strong>10 Weeks</strong></div>
          <div>Avg. Pace: <strong>12 hrs / week</strong></div>
        </div>
      </div>

      {/* Phase Segmented Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {roadmap.map((phase, idx) => {
          const isSelected = activePhaseIndex === idx;
          const phaseCompleted = phase.milestones.filter((m) => m.completed).length;
          return (
            <button
              key={phase.phaseNumber}
              onClick={() => setActivePhaseIndex(idx)}
              className={`px-4 py-3 rounded-xl text-left border transition-all shrink-0 min-w-[200px] ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                Phase {phase.phaseNumber} · {phase.durationWeeks}
              </div>
              <div className="text-xs font-bold truncate mt-0.5">{phase.phaseName.replace(/^Phase \d+:\s*/, '')}</div>
              <div className={`text-[11px] mt-1.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                {phaseCompleted}/{phase.milestones.length} Done
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Content */}
      {roadmap[activePhaseIndex] && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Phase {roadmap[activePhaseIndex].phaseNumber} · {roadmap[activePhaseIndex].durationWeeks}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {roadmap[activePhaseIndex].phaseName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                <strong>Focus:</strong> {roadmap[activePhaseIndex].focus}
              </p>
            </div>
          </div>

          {/* Milestones List */}
          <div className="space-y-4">
            {roadmap[activePhaseIndex].milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-5 rounded-xl border transition-all ${
                  milestone.completed
                    ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => onToggleMilestone(milestone.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                  >
                    {milestone.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3
                        className={`text-sm font-bold ${
                          milestone.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {milestone.title}
                      </h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        Est. {milestone.estimatedHours} hrs
                      </span>
                    </div>

                    <p className={`text-xs mt-1 leading-relaxed ${milestone.completed ? 'text-slate-400' : 'text-slate-600'}`}>
                      {milestone.description}
                    </p>

                    {/* Key Topics */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 mr-1">Topics:</span>
                      {milestone.topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Resources */}
                    {milestone.resources && milestone.resources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                        <span className="text-[11px] font-semibold text-slate-400">Curated Prep:</span>
                        {milestone.resources.map((res, rIdx) => (
                          <div
                            key={rIdx}
                            className="inline-flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-900 font-medium"
                          >
                            {res.type === 'video' ? (
                              <Video className="w-3.5 h-3.5 text-rose-500" />
                            ) : res.type === 'practice' ? (
                              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                            )}
                            <span>{res.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
