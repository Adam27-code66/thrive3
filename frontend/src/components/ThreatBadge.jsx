import React from 'react';

const SEVERITY_CONFIG = {
  CRITICAL: { dot: '#DC2626', label: 'Critical' },
  HIGH: { dot: '#EA580C', label: 'High Threat' },
  MEDIUM: { dot: '#D97706', label: 'Medium Risk' },
  LOW: { dot: '#2563EB', label: 'Low Risk' },
  SAFE: { dot: '#16A34A', label: 'Safe' },
};

export default function ThreatBadge({ severity = 'SAFE', className = '' }) {
  const key = (severity || 'SAFE').toUpperCase();
  const cfg = SEVERITY_CONFIG[key] || SEVERITY_CONFIG.SAFE;

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs text-neutral-800 tracking-wider uppercase font-medium ${className}`}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: cfg.dot }}
      />
      <span>{cfg.label}</span>
    </span>
  );
}
