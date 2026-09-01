import React from 'react';
import ThreatBadge from './ThreatBadge';
import { Mail, Globe, Link2, MessageSquare, Paperclip } from 'lucide-react';

export default function IndicatorCard({ category, riskLevel = 'SAFE', title, description, evidence, impactScore }) {
  const iconMap = {
    Sender: Mail,
    Domain: Globe,
    URL: Link2,
    Language: MessageSquare,
    Urgency: MessageSquare,
    Attachment: Paperclip
  };

  const IconComp = iconMap[category] || Globe;

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
            <IconComp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-slate-300">{category} Analysis</h4>
            <p className="text-sm font-bold text-white leading-tight mt-0.5">{title}</p>
          </div>
        </div>
        <ThreatBadge severity={riskLevel} size="sm" />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        {description}
      </p>

      {evidence && (
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-300 break-all">
          <span className="text-slate-500 font-bold uppercase block text-[9px] mb-0.5">Extracted Evidence:</span>
          {evidence}
        </div>
      )}

      <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800/60">
        <span>Vector: {category}</span>
        {impactScore && <span className="text-red-400 font-bold">Risk Weight: +{impactScore}</span>}
      </div>
    </div>
  );
}
