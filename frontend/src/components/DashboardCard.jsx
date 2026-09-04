import React from 'react';

const COLOR_MAP = {
  cyan: {
    icon: 'rgba(6,182,212,0.12)',
    iconBorder: 'rgba(6,182,212,0.25)',
    iconText: '#22d3ee',
    value: '#22d3ee',
    cardBorder: 'rgba(6,182,212,0.15)',
    glow: 'rgba(6,182,212,0.08)',
  },
  red: {
    icon: 'rgba(239,68,68,0.1)',
    iconBorder: 'rgba(239,68,68,0.25)',
    iconText: '#f87171',
    value: '#f87171',
    cardBorder: 'rgba(239,68,68,0.15)',
    glow: 'rgba(239,68,68,0.06)',
  },
  orange: {
    icon: 'rgba(249,115,22,0.1)',
    iconBorder: 'rgba(249,115,22,0.25)',
    iconText: '#fb923c',
    value: '#fb923c',
    cardBorder: 'rgba(249,115,22,0.15)',
    glow: 'rgba(249,115,22,0.06)',
  },
  yellow: {
    icon: 'rgba(234,179,8,0.1)',
    iconBorder: 'rgba(234,179,8,0.25)',
    iconText: '#fbbf24',
    value: '#fbbf24',
    cardBorder: 'rgba(234,179,8,0.15)',
    glow: 'rgba(234,179,8,0.06)',
  },
  emerald: {
    icon: 'rgba(16,185,129,0.1)',
    iconBorder: 'rgba(16,185,129,0.25)',
    iconText: '#34d399',
    value: '#34d399',
    cardBorder: 'rgba(16,185,129,0.15)',
    glow: 'rgba(16,185,129,0.06)',
  },
};

export default function DashboardCard({ title, value, subtext, icon: Icon, color = 'cyan' }) {
  const c = COLOR_MAP[color] || COLOR_MAP.cyan;

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 cursor-default transition-all duration-300 group"
      style={{
        background: `linear-gradient(135deg, #0d1424, ${c.glow})`,
        border: `1px solid ${c.cardBorder}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 8px 25px rgba(0,0,0,0.4), 0 0 20px ${c.glow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)';
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="p-2.5 rounded-xl"
          style={{
            background: c.icon,
            border: `1px solid ${c.iconBorder}`,
          }}
        >
          {Icon && <Icon className="w-5 h-5" style={{ color: c.iconText }} />}
        </div>
        <div
          className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(16,185,129,0.08)',
            color: '#34d399',
            border: '1px solid rgba(16,185,129,0.15)',
          }}
        >
          <span>LIVE</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
          {title}
        </p>
        <div
          className="text-3xl font-black tracking-tight font-mono leading-none"
          style={{ color: c.value }}
        >
          {typeof value === 'number' ? value.toLocaleString() : (value ?? '—')}
        </div>
        {subtext && (
          <p className="text-[11px] mt-1.5 font-mono" style={{ color: '#475569' }}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
