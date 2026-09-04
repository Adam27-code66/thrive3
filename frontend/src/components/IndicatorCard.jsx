import React from 'react';
import ThreatBadge from './ThreatBadge';
import { Mail, Globe, Link2, MessageSquare, Paperclip } from 'lucide-react';

const ICON_MAP = {
  Sender: Mail,
  Domain: Globe,
  URL: Link2,
  Language: MessageSquare,
  Urgency: MessageSquare,
  Attachment: Paperclip,
};

const RISK_COLORS = {
  CRITICAL: { border: 'rgba(239,68,68,0.2)', glow: 'rgba(239,68,68,0.04)' },
  HIGH: { border: 'rgba(249,115,22,0.2)', glow: 'rgba(249,115,22,0.04)' },
  MEDIUM: { border: 'rgba(234,179,8,0.2)', glow: 'rgba(234,179,8,0.04)' },
  LOW: { border: 'rgba(59,130,246,0.2)', glow: 'rgba(59,130,246,0.04)' },
  SAFE: { border: 'rgba(34,197,94,0.2)', glow: 'rgba(34,197,94,0.04)' },
};

export default function IndicatorCard({ category, riskLevel = 'SAFE', title, description, evidence, impactScore }) {
  const IconComp = ICON_MAP[category] || Globe;
  const risk = (riskLevel || 'SAFE').toUpperCase();
  const colors = RISK_COLORS[risk] || RISK_COLORS.SAFE;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all duration-250 cursor-default"
      style={{
        background: `linear-gradient(135deg, #0d1424, ${colors.glow})`,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="p-2 rounded-xl flex-shrink-0"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.15)',
            }}
          >
            <IconComp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p
              className="text-[10px] font-bold uppercase tracking-widest truncate"
              style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}
            >
              {category}
            </p>
            <h4 className="text-sm font-bold text-slate-100 leading-tight mt-0.5 truncate">{title}</h4>
          </div>
        </div>
        <ThreatBadge severity={riskLevel} size="sm" />
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>

      {/* Evidence Block */}
      {evidence && (
        <div
          className="rounded-lg px-3 py-2"
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span
            className="block text-[9px] font-bold uppercase tracking-wider mb-1"
            style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}
          >
            Extracted Evidence
          </span>
          <span
            className="text-[11px] break-all"
            style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {evidence}
          </span>
        </div>
      )}

      {/* Footer */}
      <div
        className="flex items-center justify-between text-[10px] pt-2"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontFamily: 'JetBrains Mono, monospace',
          color: '#334155',
        }}
      >
        <span>Vector: {category}</span>
        {impactScore && (
          <span className="font-bold" style={{ color: '#f87171' }}>
            Weight: +{impactScore}
          </span>
        )}
      </div>
    </div>
  );
}
