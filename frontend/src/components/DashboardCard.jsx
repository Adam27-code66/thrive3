import React, { useState, useEffect } from 'react';

export default function DashboardCard({ title, value, subtext, dotColor = '#111111' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const targetNum = typeof value === 'number' ? value : 0;

  useEffect(() => {
    if (typeof value !== 'number') return;
    let startTimestamp = null;
    const duration = 800; // ms

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = progress * (2 - progress);
      setDisplayValue(Math.floor(easedProgress * targetNum));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, targetNum]);

  return (
    <div
      className="p-6 transition-all duration-200 hover:bg-[#F4F4F0] animate-fade-in"
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
        {typeof value === 'number' ? displayValue.toLocaleString() : (value ?? '—')}
      </div>

      {subtext && (
        <p className="text-xs text-neutral-500 font-sans">
          {subtext}
        </p>
      )}
    </div>
  );
}
