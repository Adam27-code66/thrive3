import React from 'react';
import { Shield, Loader2, CheckCircle2 } from 'lucide-react';

export default function AnalysisProgress({ isAnalyzing, currentStep, steps = [] }) {
  if (!isAnalyzing) return null;

  const progress = steps.length ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(7,10,18,0.85)', backdropFilter: 'blur(20px)' }}
    >
      <div
        className="max-w-md w-full rounded-2xl p-6 space-y-6 text-center"
        style={{
          background: 'linear-gradient(135deg, #0d1424, #0a1020)',
          border: '1px solid rgba(16,185,129,0.25)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(16,185,129,0.1)',
        }}
      >
        {/* Animated Icon */}
        <div className="relative inline-flex items-center justify-center mx-auto">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
            }}
          >
            <Shield className="w-10 h-10 text-emerald-400" style={{ animation: 'pulse-slow 2s ease-in-out infinite' }} />
          </div>
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
          />
          <Loader2
            className="w-24 h-24 absolute"
            style={{ color: 'rgba(16,185,129,0.3)', animation: 'spin 1.5s linear infinite' }}
          />
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-white">PhishLens Threat Engine Scanning</h3>
          <p className="text-xs font-mono mt-1" style={{ color: '#10b981' }}>
            Running explainable rule matrix & brand homoglyph scan
          </p>
        </div>

        {/* Step List */}
        <div
          className="rounded-xl p-4 space-y-2 text-left max-h-52 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {steps.map((stepText, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 transition-all duration-300"
                style={{
                  color: isDone ? '#34d399' : isCurrent ? '#a7f3d0' : '#1e3a2f',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  fontWeight: isCurrent ? 700 : isDone ? 500 : 400,
                }}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#34d399' }} />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 flex-shrink-0" style={{ color: '#10b981', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                )}
                <span>{stepText}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono" style={{ color: '#475569' }}>
            <span>Analysis Progress</span>
            <span style={{ color: '#10b981' }}>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #10b981, #34d399)',
                boxShadow: '0 0 8px rgba(16,185,129,0.5)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
