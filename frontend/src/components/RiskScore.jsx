import React, { useState, useEffect } from 'react';
import ThreatBadge from './ThreatBadge';

export default function RiskScore({ score = 0, severity = 'SAFE', verdict = 'SAFE', confidence = 85, scoreBreakdown = [] }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Smooth Count-Up Animation from 0 to target score on mount/change
  useEffect(() => {
    let startTimestamp = null;
    const duration = 900; // ms

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad formula
      const easedProgress = progress * (2 - progress);
      setDisplayScore(Math.floor(easedProgress * score));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [score]);

  const verdictDescriptions = {
    'LIKELY PHISHING': 'Critical threat detected. Email contains multiple high-confidence phishing indicators including brand impersonation, deceptive URLs, and psychological urgency tactics.',
    'SUSPICIOUS': 'High threat probability. Email presents suspicious characteristics matching credential harvesting or malicious domain patterns.',
    'SAFE': 'Low to zero risk detected. Email passed all standard sender, domain, URL, and threat language checks with no significant indicators.',
  };

  return (
    <div
      className="p-8 transition-all duration-300 animate-fade-in"
      style={{
        backgroundColor: '#FFFFFF',
        border: 'none',
      }}
    >
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12">

        {/* Animated Numerical Score Block */}
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 mb-2 font-medium">
            Forensic Risk Index
          </span>

          <div className="flex items-baseline gap-2">
            <span className="text-6xl lg:text-7xl font-light font-mono text-neutral-900 tracking-tight leading-none">
              {displayScore}
            </span>
            <span className="text-xl font-mono text-neutral-400">/ 100</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <ThreatBadge severity={severity} />
            <span className="text-xs font-mono text-neutral-500">
              {confidence}% Confidence Score
            </span>
          </div>
        </div>

        {/* Verdict Explanation */}
        <div className="flex-1 max-w-xl space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium">
            Automated SOC Verdict
          </span>
          <h2 className="text-2xl font-normal font-serif text-neutral-900">
            {verdict}
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-sans">
            {verdictDescriptions[verdict] || verdictDescriptions['SAFE']}
          </p>
        </div>

        {/* Score Breakdown List */}
        {scoreBreakdown.length > 0 && (
          <div className="w-full lg:w-72 space-y-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E5E5E0]">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              <span>Factors</span>
              <span>Impact</span>
            </div>

            <div className="space-y-2 font-mono text-xs text-neutral-700">
              {scoreBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-[#F4F4F0]">
                  <span className="truncate max-w-[180px]" title={item.factor}>
                    {item.factor}
                  </span>
                  <span className="font-semibold text-neutral-900">
                    +{item.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
