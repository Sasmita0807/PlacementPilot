import React, { useState, useEffect } from 'react';
import { UserProfile, TargetRole, CompanyTier } from '../types';
import { X, Sparkles, User, Briefcase, GraduationCap, Check, Edit3, Mail, Building, Calendar, Award } from 'lucide-react';

interface OnboardingModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const PRESET_PROFILES: {
  label: string;
  role: TargetRole;
  data: Partial<UserProfile>;
}[] = [
  {
    label: 'Aarav Sharma (Software/IT SDE)',
    role: 'Software/IT',
    data: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu',
      targetRole: 'Software/IT',
      careerGoals: 'Crack an SDE-1 / Software Engineering internship at a top product tech company with solid fundamentals in DSA, clean system design, and strong behavioral confidence.',
      targetCompanyTier: 'Tier 1 / Product (Google, Microsoft, Amazon)',
      graduationYear: '2026',
      college: 'National Institute of Technology',
      proficiencyLevel: 'Intermediate',
      overallReadiness: 74,
      roleReadiness: 78,
    },
  },
  {
    label: 'Priya Patel (AI/ML Engineer)',
    role: 'AI/ML',
    data: {
      name: 'Priya Patel',
      email: 'priya.ml@campus.edu',
      targetRole: 'AI/ML',
      careerGoals: 'Land a Machine Learning Engineer role building scalable generative AI pipelines, feature stores, and low-latency inference systems.',
      targetCompanyTier: 'High Growth Startups (Zomato, Swiggy, Razorpay)',
      graduationYear: '2026',
      college: 'Indian Institute of Information Technology',
      proficiencyLevel: 'Intermediate',
      overallReadiness: 78,
      roleReadiness: 82,
    },
  },
  {
    label: 'Rahul Verma (Data Scientist)',
    role: 'Data Science',
    data: {
      name: 'Rahul Verma',
      email: 'rahul.data@campus.edu',
      targetRole: 'Data Science',
      careerGoals: 'Join a fintech quant or analytics team driving high-impact predictive modeling, A/B experimentation, and Bayesian statistical analysis.',
      targetCompanyTier: 'Fintech & Quant',
      graduationYear: '2026',
      college: 'Birla Institute of Technology and Science',
      proficiencyLevel: 'Advanced',
      overallReadiness: 81,
      roleReadiness: 85,
    },
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  user,
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [targetRole, setTargetRole] = useState<TargetRole>(user.targetRole);
  const [careerGoals, setCareerGoals] = useState(user.careerGoals);
  const [targetCompanyTier, setTargetCompanyTier] = useState<CompanyTier>(user.targetCompanyTier);
  const [college, setCollege] = useState(user.college);
  const [graduationYear, setGraduationYear] = useState(user.graduationYear);
  const [proficiencyLevel, setProficiencyLevel] = useState(user.proficiencyLevel);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name);
      setEmail(user.email);
      setTargetRole(user.targetRole);
      setCareerGoals(user.careerGoals);
      setTargetCompanyTier(user.targetCompanyTier);
      setCollege(user.college);
      setGraduationYear(user.graduationYear);
      setProficiencyLevel(user.proficiencyLevel);
      setSavedNotice(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_PROFILES[0]) => {
    setName(preset.data.name || '');
    setEmail(preset.data.email || '');
    setTargetRole(preset.data.targetRole || 'Software/IT');
    setCareerGoals(preset.data.careerGoals || '');
    setTargetCompanyTier(preset.data.targetCompanyTier || 'Tier 1 / Product (Google, Microsoft, Amazon)');
    setCollege(preset.data.college || '');
    setGraduationYear(preset.data.graduationYear || '2026');
    setProficiencyLevel(preset.data.proficiencyLevel || 'Intermediate');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onSaveProfile({
        name: name.trim(),
        email: email.trim(),
        targetRole,
        careerGoals,
        targetCompanyTier,
        college,
        graduationYear,
        proficiencyLevel,
      });
      setSavedNotice(true);
      setTimeout(() => {
        onClose();
      }, 400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040714]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative bg-[#090d24] border border-cyan-500/30 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.2)] text-white space-y-5 my-8">
        {/* Glow ambient balls */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between pb-4 border-b border-cyan-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
              <User className="w-5 h-5 text-cyan-100" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Edit Student Profile & Name
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize your name, target company tier, and campus placement roadmap.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          {/* Highlighted Name Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-cyan-400/40 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                Your Full Name (Directly Editable)
              </label>
              <span className="text-[10px] text-cyan-400/80 bg-cyan-500/20 px-2 py-0.5 rounded-full font-semibold">
                Changes Greeting & Certificates
              </span>
            </div>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sasmita Logesh"
              className="w-full px-3.5 py-2.5 bg-[#050817] border border-cyan-400/50 rounded-xl text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 transition-all shadow-inner"
            />
            <p className="text-[11px] text-slate-400">
              This name will be displayed across your dashboard greetings, skill assessments, and AI mock interview feedback.
            </p>
          </div>

          {/* Email & Target Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@campus.edu"
                className="w-full px-3 py-2 bg-[#050817] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                className="w-full px-3 py-2 bg-[#050817] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="Software/IT">Software/IT (SDE, Backend, Full-Stack)</option>
                <option value="AI/ML">AI/ML (Machine Learning, Generative AI)</option>
                <option value="Data Science">Data Science & Analytics</option>
                <option value="CS & Systems">CS & Systems (OS, Embedded, DevOps)</option>
              </select>
            </div>
          </div>

          {/* Target Company Tier */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Target Company Tier
            </label>
            <select
              value={targetCompanyTier}
              onChange={(e) => setTargetCompanyTier(e.target.value as CompanyTier)}
              className="w-full px-3 py-2 bg-[#050817] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
            >
              <option value="Tier 1 / Product (Google, Microsoft, Amazon)">
                Tier 1 / Product (Google, Microsoft, Amazon)
              </option>
              <option value="High Growth Startups (Zomato, Swiggy, Razorpay)">
                High Growth Startups (Zomato, Swiggy, Razorpay)
              </option>
              <option value="Service & Enterprise (TCS, Infosys, Accenture)">
                Service & Enterprise (TCS, Infosys, Accenture)
              </option>
              <option value="Fintech & Quant">Fintech & Quant</option>
            </select>
          </div>

          {/* College, Graduation Year, Proficiency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                College / Univ
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="College Name"
                className="w-full px-3 py-2 bg-[#050817] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Grad Year
              </label>
              <input
                type="text"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                placeholder="2026"
                className="w-full px-3 py-2 bg-[#050817] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                Proficiency
              </label>
              <select
                value={proficiencyLevel}
                onChange={(e) => setProficiencyLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#050817] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Placement Goals */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Placement Career Goals
            </label>
            <textarea
              rows={2}
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="e.g. Crack SDE-1 internship at a high-growth tech firm with strong focus on DSA and clean architecture..."
              className="w-full px-3 py-2 bg-[#050817] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors leading-relaxed"
            />
          </div>

          {/* Quick Preset Strip (Optional) */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Or load sample student profile:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PROFILES.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/80 text-[11px] text-slate-300 hover:text-cyan-300 rounded-lg transition-colors cursor-pointer"
                >
                  {p.data.name} ({p.role})
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-cyan-500/15">
            <div>
              {savedNotice && (
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Saved successfully!
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !name.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isSaving ? 'Saving Name & Profile...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
