import React, { useState } from 'react';
import { JobRecommendation, UserProfile } from '../types';
import {
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Building,
  Check,
} from 'lucide-react';

interface JobRecommendationsProps {
  user: UserProfile;
  jobs: JobRecommendation[];
  onApplyJob: (jobId: string) => Promise<any>;
  setActiveTab: (tab: string) => void;
}

export const JobRecommendations: React.FC<JobRecommendationsProps> = ({
  user,
  jobs,
  onApplyJob,
  setActiveTab,
}) => {
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  const handleApply = async (jobId: string) => {
    setApplyingJobId(jobId);
    try {
      await onApplyJob(jobId);
    } catch (err) {
      console.error(err);
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Skill-to-Opportunity Match
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{user.targetRole} Category</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Curated Placement & Internship Matches</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Roles actively hiring college graduates aligned with your verified skill proficiencies. Review exact matching requisites and missing delta skills before applying.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('tracker')}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0 self-start md:self-auto"
        >
          View Application Tracker <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-indigo-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1 min-w-0">
              {/* Company & Role */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-bold text-slate-900">{job.role}</span>
                <span className="text-xs text-slate-400">at</span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
                  {job.company}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {job.location}
                </span>
              </div>

              {/* Meta Pill bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>Type: <strong className="text-slate-800">{job.type}</strong></span>
                <span>·</span>
                <span>Compensation: <strong className="text-emerald-700">{job.stipendOrSalary}</strong></span>
                <span>·</span>
                <span className="text-amber-600 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Apply {job.deadline}
                </span>
              </div>

              {/* Why it Fits Callout */}
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                <strong className="text-slate-800">Skill-to-Opportunity Fit:</strong> {job.whyItFits}
              </p>

              {/* Matching & Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Skills You Have:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {job.matchingSkills.map((s, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-800 text-[11px] px-2 py-0.5 rounded border border-emerald-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" /> Missing Delta Skills to Acquire:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {job.missingSkills.map((s, idx) => (
                      <span key={idx} className="bg-amber-50 text-amber-800 text-[11px] px-2 py-0.5 rounded border border-amber-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Match Score & Action */}
            <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-4 shrink-0 lg:pl-6 lg:border-l lg:border-slate-100 min-w-[150px]">
              <div className="text-center">
                <div className="text-2xl font-black text-indigo-700">{job.matchPercentage}%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Skill Match
                </div>
              </div>

              {job.applied ? (
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Added to Tracker
                </div>
              ) : (
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={applyingJobId === job.id}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Briefcase className="w-4 h-4" />
                  {applyingJobId === job.id ? 'Adding...' : 'Apply & Track'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
