import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AnalysisProgress({ isAnalyzing, currentStep, steps = [] }) {
  if (!isAnalyzing) return null;

  const progress = steps.length ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#FBFBF9]/90 backdrop-blur-md animate-fade-in"
    >
      <div className="max-w-md w-full bg-white p-8 space-y-6 text-center shadow-sm">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-neutral-900 animate-spin" />
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
            Processing Engine
          </span>
          <h3 className="text-xl font-serif font-normal text-neutral-900">
            PhishLens Threat Engine Scanning
          </h3>
        </div>

        <div className="space-y-2 text-left font-mono text-xs max-h-48 overflow-y-auto">
          {steps.map((stepText, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className="flex items-center gap-3 py-1"
                style={{
                  color: isDone ? '#111111' : isCurrent ? '#111111' : '#A3A3A3',
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isDone || isCurrent ? '#111111' : '#D4D4D0' }} />
                <span>{stepText}</span>
              </div>
            );
          })}
        </div>

        <div className="space-y-1 pt-2 border-t border-[#F4F4F0]">
          <div className="flex justify-between text-xs font-mono text-neutral-400">
            <span>Progress</span>
            <span className="text-neutral-900">{progress}%</span>
          </div>
          <div className="w-full h-1 bg-[#F4F4F0] overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
