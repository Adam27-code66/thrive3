import React from 'react';
import { AlertOctagon, AlertTriangle, AlertCircle, ShieldCheck, Info } from 'lucide-react';

export default function ThreatBadge({ severity = 'SAFE', size = 'md', className = '' }) {
  const sevUpper = (severity || 'SAFE').toUpperCase();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-bold'
  };

  const styleMap = {
    CRITICAL: {
      bg: 'bg-red-500/15 text-red-400 border-red-500/40 shadow-red-950/40',
      icon: AlertOctagon,
      label: '🔴 CRITICAL RISK'
    },
    HIGH: {
      bg: 'bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-orange-950/40',
      icon: AlertTriangle,
      label: '🟠 HIGH RISK'
    },
    MEDIUM: {
      bg: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40 shadow-yellow-950/40',
      icon: AlertCircle,
      label: '🟡 MEDIUM RISK'
    },
    LOW: {
      bg: 'bg-blue-500/15 text-blue-400 border-blue-500/40 shadow-blue-950/40',
      icon: Info,
      label: '🔵 LOW RISK'
    },
    SAFE: {
      bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-emerald-950/40',
      icon: ShieldCheck,
      label: '🟢 SAFE / CLEAN'
    }
  };

  const current = styleMap[sevUpper] || styleMap.SAFE;
  const IconComponent = current.icon;

  return (
    <span className={`inline-flex items-center font-mono font-bold tracking-wider rounded-lg border shadow-sm uppercase ${sizeClasses[size]} ${current.bg} ${className}`}>
      <IconComponent className="w-3.5 h-3.5" />
      <span>{current.label}</span>
    </span>
  );
}
