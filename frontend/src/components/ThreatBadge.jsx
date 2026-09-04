import React from 'react';
import { AlertOctagon, AlertTriangle, AlertCircle, ShieldCheck, Info } from 'lucide-react';

const SEVERITY_CONFIG = {
  CRITICAL: {
    bg: 'rgba(239,68,68,0.1)',
    color: '#f87171',
    border: 'rgba(239,68,68,0.3)',
    dot: '#ef4444',
    icon: AlertOctagon,
    label: 'Critical',
  },
  HIGH: {
    bg: 'rgba(249,115,22,0.1)',
    color: '#fb923c',
    border: 'rgba(249,115,22,0.3)',
    dot: '#f97316',
    icon: AlertTriangle,
    label: 'High Risk',
  },
  MEDIUM: {
    bg: 'rgba(234,179,8,0.1)',
    color: '#fbbf24',
    border: 'rgba(234,179,8,0.3)',
    dot: '#eab308',
    icon: AlertCircle,
    label: 'Medium',
  },
  LOW: {
    bg: 'rgba(59,130,246,0.1)',
    color: '#60a5fa',
    border: 'rgba(59,130,246,0.3)',
    dot: '#3b82f6',
    icon: Info,
    label: 'Low Risk',
  },
  SAFE: {
    bg: 'rgba(34,197,94,0.1)',
    color: '#4ade80',
    border: 'rgba(34,197,94,0.3)',
    dot: '#22c55e',
    icon: ShieldCheck,
    label: 'Safe',
  },
};

const SIZE_STYLES = {
  sm: { padding: '2px 8px', fontSize: '10px', gap: '4px', iconSize: 'w-3 h-3' },
  md: { padding: '4px 10px', fontSize: '11px', gap: '5px', iconSize: 'w-3.5 h-3.5' },
  lg: { padding: '6px 14px', fontSize: '13px', gap: '6px', iconSize: 'w-4 h-4' },
};

export default function ThreatBadge({ severity = 'SAFE', size = 'md', className = '' }) {
  const key = (severity || 'SAFE').toUpperCase();
  const cfg = SEVERITY_CONFIG[key] || SEVERITY_CONFIG.SAFE;
  const s = SIZE_STYLES[size] || SIZE_STYLES.md;
  const IconComp = cfg.icon;

  return (
    <span
      className={`inline-flex items-center font-bold uppercase rounded-full ${className}`}
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        padding: s.padding,
        fontSize: s.fontSize,
        gap: s.gap,
        fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{ width: '6px', height: '6px', background: cfg.dot }}
      />
      <IconComp className={s.iconSize} />
      <span>{cfg.label}</span>
    </span>
  );
}
