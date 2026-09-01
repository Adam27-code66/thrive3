import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThreatBadge from './ThreatBadge';
import { Search, Filter, ArrowUpDown, ChevronRight, Eye, ShieldX, ShieldCheck } from 'lucide-react';

export default function IncidentTable({ incidents = [], onStatusChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sevFilter, setSevFilter] = useState('ALL');
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'risk'

  const filtered = incidents.filter(item => {
    const matchesSearch = 
      item.incident_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.domain && item.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.subject && item.subject.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSev = sevFilter === 'ALL' || item.severity === sevFilter;
    const matchesVerdict = verdictFilter === 'ALL' || item.verdict === verdictFilter;

    return matchesSearch && matchesSev && matchesVerdict;
  }).sort((a, b) => {
    if (sortBy === 'risk') {
      return b.risk_score - a.risk_score;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
      
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search incident ID, sender, domain, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sevFilter}
              onChange={(e) => setSevFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Severities</option>
              <option value="CRITICAL" className="bg-slate-900">🔴 Critical</option>
              <option value="HIGH" className="bg-slate-900">🟠 High</option>
              <option value="MEDIUM" className="bg-slate-900">🟡 Medium</option>
              <option value="SAFE" className="bg-slate-900">🟢 Safe</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Verdicts</option>
              <option value="LIKELY PHISHING" className="bg-slate-900">Phishing</option>
              <option value="SUSPICIOUS" className="bg-slate-900">Suspicious</option>
              <option value="SAFE" className="bg-slate-900">Safe</option>
            </select>
          </div>

          <button
            onClick={() => setSortBy(sortBy === 'risk' ? 'date' : 'risk')}
            className="flex items-center gap-1 bg-slate-950 hover:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sort: {sortBy === 'risk' ? 'Risk Score' : 'Date'}</span>
          </button>
        </div>
      </div>

      {/* Incident Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Incident</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Sender</th>
              <th className="py-3 px-4">Domain</th>
              <th className="py-3 px-4 text-center">Risk Score</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Verdict</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-900/50 transition-colors group">
                <td className="py-3.5 px-4 font-bold text-cyan-400">
                  <Link to={`/incidents/${item.incident_id}`} className="hover:underline flex items-center gap-1">
                    {item.incident_id}
                  </Link>
                </td>
                <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{item.created_at}</td>
                <td className="py-3.5 px-4 text-white max-w-[180px] truncate" title={item.sender}>
                  {item.sender}
                </td>
                <td className="py-3.5 px-4 text-slate-300 font-bold max-w-[150px] truncate">
                  {item.domain || 'N/A'}
                  {item.detected_brand && (
                    <span className="block text-[9px] text-emerald-400 uppercase">Brand: {item.detected_brand}</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded font-black font-mono text-xs ${
                    item.risk_score >= 81 ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    item.risk_score >= 61 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                    item.risk_score >= 41 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {item.risk_score}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <ThreatBadge severity={item.severity} size="sm" />
                </td>
                <td className="py-3.5 px-4 font-bold">
                  <span className={item.verdict === 'LIKELY PHISHING' ? 'text-red-400' : item.verdict === 'SUSPICIOUS' ? 'text-amber-400' : 'text-emerald-400'}>
                    {item.verdict}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.status === 'OPEN' ? 'bg-red-950 text-red-400 border border-red-800' :
                    item.status === 'INVESTIGATING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to={`/incidents/${item.incident_id}`}
                    className="p-1.5 inline-flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-800 transition-all text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="9" className="py-8 text-center text-slate-500">
                  No matching incidents found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
