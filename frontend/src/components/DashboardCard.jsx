import React from 'react';

export default function DashboardCard({ title, value, subtext, dotColor = '#111111' }) {
  return (
    <div
      className="p-6 transition-all duration-200"
      style={{
        backgroundColor: '#FFFFFF',
        border: 'none',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium">
          {title}
        </span>
        {dotColor && (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: dotColor }}
          />
        )}
      </div>

      <div className="text-4xl font-light text-neutral-900 font-mono tracking-tight leading-none mb-2">
        {typeof value === 'number' ? value.toLocaleString() : (value ?? '—')}
      </div>

      {subtext && (
        <p className="text-xs text-neutral-500 font-sans">
          {subtext}
        </p>
      )}
    </div>
  );
}
