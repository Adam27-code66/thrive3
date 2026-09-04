import React, { useState } from 'react';
import { Copy, Check, Terminal, Filter } from 'lucide-react';

export default function IOCList({ iocs = [] }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [selectedType, setSelectedType] = useState('ALL');

  const categories = ['ALL', ...new Set(iocs.map(i => i.type))];

  const filteredIocs = selectedType === 'ALL'
    ? iocs
    : iocs.filter(i => i.type === selectedType);

  const handleCopySingle = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const handleCopyAll = () => {
    const formatted = iocs.map(i => `[${i.type}] ${i.value} (${i.context || 'N/A'})`).join('\n');
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const getTypeColor = (type) => {
    const map = {
      'EMAIL': { bg: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: 'rgba(6,182,212,0.3)' },
      'DOMAIN': { bg: 'rgba(249,115,22,0.1)', color: '#fb923c', border: 'rgba(249,115,22,0.3)' },
      'URL': { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
      'IP': { bg: 'rgba(168,85,247,0.1)', color: '#c4b5fd', border: 'rgba(168,85,247,0.3)' },
      'FILE': { bg: 'rgba(234,179,8,0.1)', color: '#fbbf24', border: 'rgba(234,179,8,0.3)' },
    };
    return map[type] || { bg: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: 'rgba(99,102,241,0.3)' };
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5"
        style={{
          background: '#0d1424',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
          >
            <Terminal className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Indicators of Compromise (IOCs)</h2>
            <p className="text-xs font-mono mt-0.5" style={{ color: '#475569' }}>
              Structured threat intelligence for firewall blocklists & SIEM ingestion
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyAll}
          className="btn-primary flex-shrink-0"
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copiedAll ? 'Copied!' : 'Copy All IOCs'}
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div
        className="flex items-center gap-2 px-6 py-3 overflow-x-auto"
        style={{ background: '#090d18', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {categories.map((cat, idx) => {
          const active = selectedType === cat;
          const count = cat === 'ALL' ? iocs.length : iocs.filter(i => i.type === cat).length;
          return (
            <button
              key={idx}
              onClick={() => setSelectedType(cat)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all whitespace-nowrap flex-shrink-0"
              style={{
                background: active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#34d399' : '#64748b',
                border: active ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {cat}
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px]"
                style={{
                  background: active ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* IOC Table */}
      <div className="overflow-x-auto" style={{ background: '#090d18' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>IOC Value</th>
              <th>Forensic Context</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIocs.map((ioc, idx) => {
              const tc = getTypeColor(ioc.type);
              return (
                <tr key={idx}>
                  <td>
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold font-mono"
                      style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}
                    >
                      {ioc.type}
                    </span>
                  </td>
                  <td>
                    <span
                      className="font-mono font-bold text-xs break-all"
                      style={{ color: '#e2e8f0' }}
                    >
                      {ioc.value}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {ioc.context || '—'}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleCopySingle(ioc.value, idx)}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-all"
                      style={{
                        background: copiedIdx === idx ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                        color: copiedIdx === idx ? '#4ade80' : '#64748b',
                        border: copiedIdx === idx ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
                      }}
                      title="Copy IOC value"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredIocs.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center font-mono text-sm" style={{ color: '#334155' }}>
                  No IOCs extracted for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
