import React from 'react';

export default function DashboardCard({ title, value, subtext, icon: Icon, color = 'cyan' }) {
  const colorStyles = {
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20',
    red: 'border-red-500/30 text-red-400 bg-red-950/20',
    orange: 'border-orange-500/30 text-orange-400 bg-orange-950/20',
    yellow: 'border-yellow-500/30 text-yellow-400 bg-yellow-950/20',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
  };

  const activeStyle = colorStyles[color] || colorStyles.cyan;

  return (
    <div className={`glass-panel rounded-2xl p-5 border ${activeStyle} hover:scale-[1.02] transition-all duration-300 shadow-xl flex items-center justify-between`}>
      <div className="space-y-1">
        <span className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400">
          {title}
        </span>
        <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {subtext && (
          <p className="text-[11px] font-mono text-slate-400">
            {subtext}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`p-3 rounded-2xl border ${activeStyle}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
