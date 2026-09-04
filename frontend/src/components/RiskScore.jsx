import React from 'react';
import ThreatBadge from './ThreatBadge';
import { ShieldAlert, CheckCircle2, ShieldX, HelpCircle } from 'lucide-react';

export default function RiskScore({ score = 0, severity = 'SAFE', verdict = 'SAFE', confidence = 85, scoreBreakdown = [] }) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 81) return '#ef4444';
    if (score >= 61) return '#f97316';
    if (score >= 41) return '#eab308';
    if (score >= 21) return '#3b82f6';
    return '#22c55e';
  };

  const scoreColor = getScoreColor();
  const scoreLabel = score >= 81 ? 'CRITICAL RISK' : score >= 61 ? 'HIGH RISK' : score >= 41 ? 'MEDIUM RISK' : score >= 21 ? 'LOW RISK' : 'SAFE';

  const verdictDescriptions = {
    'LIKELY PHISHING': 'Critical threat detected. Email contains multiple high-confidence phishing indicators including brand impersonation, deceptive URLs, and psychological urgency tactics.',
    'SUSPICIOUS': 'High threat probability. Email presents suspicious characteristics matching credential harvesting or malicious domain patterns that warrant immediate investigation.',
    'SAFE': 'Low to zero risk detected. Email passed all standard sender, domain, URL, and threat language checks with no significant indicators of compromise.',
  };

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0d1424 0%, #0a1020 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Subtle background glow matching score */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${scoreColor}10 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
        }}
      />

      <div className="relative flex flex-col md:flex-row items-center gap-8">

        {/* ── SVG Gauge ── */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg className="w-48 h-48 -rotate-90" viewBox="0 0 180 180">
            {/* Track */}
            <circle
              cx="90" cy="90" r={radius}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="14"
              fill="transparent"
            />
            {/* Fill */}
            <circle
              cx="90" cy="90" r={radius}
              stroke={scoreColor}
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 10px ${scoreColor}80)` }}
            />
          </svg>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="text-5xl font-black font-mono leading-none"
              style={{ color: scoreColor }}
            >
              {score}
            </span>
            <span className="text-[10px] font-mono text-slate-500 mt-1 tracking-wider">/ 100</span>
            <span
              className="text-[10px] font-black uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded-full"
              style={{
                background: `${scoreColor}18`,
                color: scoreColor,
                border: `1px solid ${scoreColor}40`,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {scoreLabel}
            </span>
          </div>
        </div>

        {/* ── Verdict Details ── */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <ThreatBadge severity={severity} size="lg" />
            <span
              className="px-3 py-1.5 rounded-full text-xs font-mono font-bold"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {confidence}% Confidence
            </span>
          </div>

          <div>
            <p
              className="text-[11px] uppercase tracking-widest font-semibold mb-1"
              style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}
            >
              Automated SOC Verdict
            </p>
            <p className="text-2xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2" style={{ color: scoreColor }}>
              {verdict === 'LIKELY PHISHING' && <ShieldX className="w-6 h-6" style={{ animation: 'pulse-slow 2s infinite' }} />}
              {verdict === 'SUSPICIOUS' && <ShieldAlert className="w-6 h-6" />}
              {verdict === 'SAFE' && <CheckCircle2 className="w-6 h-6" />}
              {verdict}
            </p>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
            {verdictDescriptions[verdict] || verdictDescriptions['SAFE']}
          </p>
        </div>

        {/* ── Score Breakdown ── */}
        {scoreBreakdown.length > 0 && (
          <div
            className="w-full md:w-72 rounded-xl p-4 flex-shrink-0 space-y-3"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div
              className="flex items-center justify-between text-[10px] font-mono font-bold uppercase pb-2"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                color: '#475569',
              }}
            >
              <span>Score Breakdown</span>
              <span style={{ color: '#10b981' }}>+{score} pts total</span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {scoreBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] truncate max-w-[150px]"
                      style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}
                      title={item.factor}
                    >
                      {item.factor}
                    </span>
                    <span
                      className="text-[11px] font-bold font-mono flex-shrink-0"
                      style={{ color: '#f87171' }}
                    >
                      +{item.points}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min((item.points / 30) * 100, 100)}%`,
                        background: `linear-gradient(90deg, ${scoreColor}90, ${scoreColor})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
