import React from 'react';
import ThreatBadge from './ThreatBadge';

export default function IndicatorCard({ category, riskLevel = 'SAFE', title, description, evidence, impactScore }) {
  return (
    <div
      className="p-6 transition-colors duration-200 space-y-3"
      style={{
        backgroundColor: '#FFFFFF',
        border: 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium">
          {category}
        </span>
        <ThreatBadge severity={riskLevel} />
      </div>

      <h4 className="text-base font-normal font-serif text-neutral-900 leading-snug">
        {title}
      </h4>

      <p className="text-xs text-neutral-600 leading-relaxed font-sans">
        {description}
      </p>

      {evidence && (
        <div className="pt-2 border-t border-[#F4F4F0] font-mono text-xs text-neutral-700 break-all">
          <span className="text-[10px] text-neutral-400 block uppercase tracking-widest mb-1">
            Evidence
          </span>
          {evidence}
        </div>
      )}

      {impactScore && (
        <div className="text-[10px] font-mono text-neutral-500 pt-1">
          Weight: +{impactScore} pts
        </div>
      )}
    </div>
  );
}
