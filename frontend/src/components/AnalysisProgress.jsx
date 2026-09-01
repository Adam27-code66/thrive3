import React from 'react';
import { Shield, Loader2, CheckCircle2 } from 'lucide-react';

export default function AnalysisProgress({ isAnalyzing, currentStep, steps = [] }) {
  if (!isAnalyzing) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-cyan-500/30 shadow-2xl space-y-6 text-center">
        
        <div className="relative inline-flex items-center justify-center p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40">
          <Shield className="w-10 h-10 text-cyan-400 animate-pulse" />
          <Loader2 className="w-16 h-16 text-indigo-400 animate-spin absolute" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            PhishLens Threat Engine Scanning...
          </h3>
          <p className="text-xs font-mono text-cyan-400 mt-1">
            Running explainable rule matrix & brand homoglyph scan
          </p>
        </div>

        <div className="space-y-2 text-left bg-slate-950/90 p-4 rounded-xl border border-slate-800 font-mono text-xs max-h-48 overflow-y-auto">
          {steps.map((stepText, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className={`flex items-center gap-2.5 transition-all ${
                isDone ? 'text-emerald-400 font-medium' : isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-600'
              }`}>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-800 shrink-0" />
                )}
                <span className="truncate">{stepText}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
