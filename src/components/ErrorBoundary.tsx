import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PlacementPilot UI Caught Unhandled Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('placementpilot_user');
      localStorage.removeItem('placementpilot_assessment');
      localStorage.removeItem('placementpilot_skill_gaps');
      localStorage.removeItem('placementpilot_daily_tasks');
      localStorage.removeItem('placementpilot_roadmap');
      localStorage.removeItem('placementpilot_applications');
      localStorage.removeItem('placementpilot_interviews');
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060814] text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#090d24] border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.25)] space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 shadow-md">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white flex items-center justify-center gap-2">
                <span>PlacementPilot AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Recovery
                </span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                An unexpected display state occurred. Tap below to reset your cache and restore full dashboard readiness.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 font-mono text-left truncate">
              {this.state.error?.message || 'Initialization error'}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore & Reload Platform</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
