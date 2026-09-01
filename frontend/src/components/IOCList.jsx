import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Terminal, Filter } from 'lucide-react';

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
    <div className="glass-panel rounded-xl p-6 border border-slate-800 space-y-4">
      
      {/* Header & Copy All Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span>Indicators of Compromise (IOCs)</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Structured threat intelligence objects for firewall blocklists & SIEM ingestion
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 border border-cyan-500/30 flex items-center gap-2 shadow-lg shadow-cyan-950/50 active:scale-95 transition-all"
        >
          {copiedAll ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copiedAll ? 'All IOCs Copied!' : 'Copy All IOCs'}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedType(cat)}
            className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
              selectedType === cat
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat} ({cat === 'ALL' ? iocs.length : iocs.filter(i => i.type === cat).length})
          </button>
        ))}
      </div>

      {/* IOC Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/70">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-4">Type</th>
              <th className="py-2.5 px-4">IOC Value</th>
              <th className="py-2.5 px-4">Forensic Context</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredIocs.map((ioc, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-2.5 px-4 font-bold text-cyan-400">{ioc.type}</td>
                <td className="py-2.5 px-4 font-bold text-white break-all">{ioc.value}</td>
                <td className="py-2.5 px-4 text-slate-400">{ioc.context || 'N/A'}</td>
                <td className="py-2.5 px-4 text-right">
                  <button
                    onClick={() => handleCopySingle(ioc.value, idx)}
                    className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy IOC value"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>
            ))}

            {filteredIocs.length === 0 && (
              <tr>
                <td colSpan="4" className="py-6 text-center text-slate-500">
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
