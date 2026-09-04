import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E0]">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
            Threat Intelligence
          </span>
          <h3 className="text-2xl font-normal font-serif text-neutral-900">
            Indicators of Compromise (IOCs)
          </h3>
        </div>

        <button
          onClick={handleCopyAll}
          className="btn-editorial-primary flex-shrink-0"
        >
          {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copiedAll ? 'Copied' : 'Copy All IOCs'}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-4 border-b border-[#E5E5E0] pb-3 overflow-x-auto text-xs font-mono">
        {categories.map((cat, idx) => {
          const active = selectedType === cat;
          const count = cat === 'ALL' ? iocs.length : iocs.filter(i => i.type === cat).length;
          return (
            <button
              key={idx}
              onClick={() => setSelectedType(cat)}
              className="py-1 transition-colors uppercase tracking-wider whitespace-nowrap"
              style={{
                color: active ? '#111111' : '#737373',
                fontWeight: active ? 600 : 400,
                borderBottom: active ? '1px solid #111111' : '1px solid transparent',
              }}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* IOC Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-[#E5E5E0] text-[11px] uppercase tracking-widest text-neutral-400">
              <th className="py-3 px-4 font-normal">Type</th>
              <th className="py-3 px-4 font-normal">IOC Value</th>
              <th className="py-3 px-4 font-normal">Context</th>
              <th className="py-3 px-4 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E0] bg-white">
            {filteredIocs.map((ioc, idx) => (
              <tr key={idx} className="editorial-row">
                <td className="py-3 px-4 font-semibold text-neutral-900">{ioc.type}</td>
                <td className="py-3 px-4 text-neutral-900 break-all">{ioc.value}</td>
                <td className="py-3 px-4 text-neutral-500">{ioc.context || '—'}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleCopySingle(ioc.value, idx)}
                    className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                    title="Copy IOC value"
                  >
                    {copiedIdx === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}

            {filteredIocs.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-neutral-400 font-mono text-xs">
                  No IOCs found for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
