import React from 'react';
import ThreatBadge from './ThreatBadge';
import { ShieldAlert, CheckCircle2, ShieldX, HelpCircle } from 'lucide-react';

export default function RiskScore({ score = 0, severity = 'SAFE', verdict = 'SAFE', confidence = 85, scoreBreakdown = [] }) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 81) return '#ef4444'; // Red
    if (score >= 61) return '#f97316'; // Orange
    if (score >= 41) return '#eab308'; // Yellow
    if (score >= 21) return '#3b82f6'; // Blue
    return '#22c55e';                  // Green
  };

  const scoreColor = getScoreColor();

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* SVG Circular Gauge */}
      <div className="relative flex items-center justify-center">
        <svg className="w-44 h-44 transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="#1e293b"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke={scoreColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 12px ${scoreColor}80)`
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
            {score}
          </span>
          <span className="text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase">
            Out of 100
          </span>
        </div>
      </div>

      {/* Threat Verdict Details */}
      <div className="flex-1 space-y-3 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <ThreatBadge severity={severity} size="lg" />
          <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 text-slate-300 border border-slate-700">
            {confidence}% Confidence
          </span>
        </div>

        <div>
          <h3 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-semibold">
            Automated SOC Verdict
          </h3>
          <p className="text-2xl font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-2 mt-0.5">
            {verdict === 'LIKELY PHISHING' && <ShieldX className="w-7 h-7 text-red-500 animate-pulse" />}
            {verdict === 'SUSPICIOUS' && <ShieldAlert className="w-7 h-7 text-amber-500" />}
            {verdict === 'SAFE' && <CheckCircle2 className="w-7 h-7 text-emerald-500" />}
            <span className={verdict === 'LIKELY PHISHING' ? 'text-red-400' : verdict === 'SUSPICIOUS' ? 'text-amber-400' : 'text-emerald-400'}>
              {verdict}
            </span>
          </p>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
          {score >= 81 && "Critical threat detected. Email contains multiple high-confidence phishing indicators including brand impersonation, deceptive URLs, and psychological urgency."}
          {score >= 61 && score < 81 && "High threat probability. Email presents suspicious characteristics matching credential harvesting or malicious domain patterns."}
          {score >= 41 && score < 61 && "Medium threat level. Email exhibits unusual attributes that warrant secondary SOC tier review before clicking links."}
          {score < 41 && "Low to zero risk detected. Email passed standard sender, domain, URL, and threat language checks."}
        </p>
      </div>

      {/* Score Breakdown Summary Box */}
      {scoreBreakdown.length > 0 && (
        <div className="w-full md:w-64 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-slate-300 border-b border-slate-800 pb-1.5">
            <span>Score Breakdown</span>
            <span className="text-cyan-400">+{score} pts</span>
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {scoreBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 truncate max-w-[130px]" title={item.factor}>{item.factor}</span>
                <span className="font-mono text-red-400 font-bold">+{item.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
