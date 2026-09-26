import React, { useState } from 'react';
import { UserProfile, TargetRole } from '../types';
import { X, Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(currentUser.name || '');
  const [targetRole, setTargetRole] = useState<TargetRole>(currentUser.targetRole || 'Software/IT');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen && currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setTargetRole(currentUser.targetRole || 'Software/IT');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: email || currentUser.email,
        name: name.trim() || currentUser.name,
        targetRole: authMode === 'signup' ? targetRole : currentUser.targetRole,
      });
      onClose();
    }, 600);
  };

  const handleDemoLogin = (role: TargetRole, demoName: string, demoEmail: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: demoName,
        email: demoEmail,
        targetRole: role,
      });
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl glass-card border border-indigo-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(99,102,241,0.25)] text-slate-100">
        {/* Glow orb */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">PlacementPilot</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                AI Auth
              </span>
            </div>
            <p className="text-xs text-slate-400">Campus Placement & Internship Launchpad</p>
          </div>
        </div>

        {/* Tabs: Login vs Signup */}
        <div className="flex p-1 bg-slate-900/80 border border-slate-700/60 rounded-xl mb-6">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'login'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Student Login
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'signup'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Campus / College Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
              />
            </div>
          </div>

          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Engineering Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Software/IT">Software/IT Engineer (SDE, Backend, Full-Stack)</option>
                <option value="AI/ML">AI/ML Engineer (LLMs, Deep Learning, Vision)</option>
                <option value="Data Science">Data Scientist & Quant Analytics</option>
                <option value="CS & Systems">CS & Systems (DevOps, Cloud, OS)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <span className="animate-pulse">Authenticating student...</span>
            ) : (
              <>
                <span>{authMode === 'login' ? 'Sign In to Hub' : 'Create Student Profile'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Fast Demo Bypass */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Instant Demo Bypass:</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> One-Click Access
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('Software/IT', 'Aarav Sharma', 'aarav.sharma@campus.edu')}
              className="p-2 text-left bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/50 rounded-lg text-[11px] text-slate-300 transition-colors"
            >
              <div className="font-bold text-white">Aarav (SDE)</div>
              <div className="text-[10px] text-slate-400">Software/IT Track</div>
            </button>

            <button
              onClick={() => handleDemoLogin('AI/ML', 'Priya Patel', 'priya.ml@campus.edu')}
              className="p-2 text-left bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 hover:border-purple-500/50 rounded-lg text-[11px] text-slate-300 transition-colors"
            >
              <div className="font-bold text-white">Priya (AI/ML)</div>
              <div className="text-[10px] text-slate-400">AI/ML Track</div>
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted with persistent session storage</span>
        </div>
      </div>
    </div>
  );
};
