import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThreatBadge from './ThreatBadge';
import { Search, Filter, ArrowUpDown, Eye } from 'lucide-react';

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
    if (sortBy === 'risk') return b.risk_score - a.risk_score;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const getRiskScoreStyle = (score) => {
    if (score >= 81) return { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' };
    if (score >= 61) return { background: 'rgba(249,115,22,0.12)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)' };
    if (score >= 41) return { background: 'rgba(234,179,8,0.12)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.3)' };
    return { background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' };
  };

  const getStatusStyle = (status) => {
    if (status === 'OPEN') return { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' };
    if (status === 'INVESTIGATING') return { background: 'rgba(234,179,8,0.1)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.25)' };
    return { background: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.2)' };
  };

  const getVerdictColor = (verdict) => {
    if (verdict === 'LIKELY PHISHING') return '#f87171';
    if (verdict === 'SUSPICIOUS') return '#fbbf24';
    return '#4ade80';
  };

  const selectStyle = {
    background: 'transparent',
    color: '#94a3b8',
    outline: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'JetBrains Mono, monospace',
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
    >
      {/* ── Search & Filter Toolbar ── */}
      <div
        className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3"
        style={{
          background: '#0d1424',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident ID, sender, domain, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9"
            style={{ paddingLeft: '36px', fontSize: '12px' }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select value={sevFilter} onChange={(e) => setSevFilter(e.target.value)} style={selectStyle}>
              <option value="ALL" style={{ background: '#0d1424' }}>All Severities</option>
              <option value="CRITICAL" style={{ background: '#0d1424' }}>Critical</option>
              <option value="HIGH" style={{ background: '#0d1424' }}>High</option>
              <option value="MEDIUM" style={{ background: '#0d1424' }}>Medium</option>
              <option value="SAFE" style={{ background: '#0d1424' }}>Safe</option>
            </select>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <select value={verdictFilter} onChange={(e) => setVerdictFilter(e.target.value)} style={selectStyle}>
              <option value="ALL" style={{ background: '#0d1424' }}>All Verdicts</option>
              <option value="LIKELY PHISHING" style={{ background: '#0d1424' }}>Phishing</option>
              <option value="SUSPICIOUS" style={{ background: '#0d1424' }}>Suspicious</option>
              <option value="SAFE" style={{ background: '#0d1424' }}>Safe</option>
            </select>
          </div>

          <button
            onClick={() => setSortBy(sortBy === 'risk' ? 'date' : 'risk')}
            className="btn-ghost"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
            Sort: {sortBy === 'risk' ? 'Risk Score' : 'Date'}
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto" style={{ background: '#090d18' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th className="text-left">Incident</th>
              <th className="text-left">Date</th>
              <th className="text-left">Sender</th>
              <th className="text-left">Domain</th>
              <th className="text-center">Risk</th>
              <th className="text-left">Severity</th>
              <th className="text-left">Verdict</th>
              <th className="text-left">Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link
                    to={`/incidents/${item.incident_id}`}
                    className="font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    style={{ textDecoration: 'none', fontSize: '12px' }}
                  >
                    {item.incident_id}
                  </Link>
                </td>
                <td
                  className="whitespace-nowrap font-mono"
                  style={{ color: '#475569', fontSize: '11px' }}
                >
                  {item.created_at}
                </td>
                <td
                  className="max-w-[160px] truncate font-mono"
                  style={{ color: '#94a3b8', fontSize: '12px' }}
                  title={item.sender}
                >
                  {item.sender}
                </td>
                <td style={{ fontSize: '12px' }}>
                  <span className="font-mono font-semibold text-slate-300">{item.domain || '—'}</span>
                  {item.detected_brand && (
                    <span className="block text-[9px] text-emerald-400 font-mono uppercase mt-0.5">
                      Brand: {item.detected_brand}
                    </span>
                  )}
                </td>
                <td className="text-center">
                  <span
                    className="inline-block px-2.5 py-1 rounded-full font-black font-mono text-xs"
                    style={getRiskScoreStyle(item.risk_score)}
                  >
                    {item.risk_score}
                  </span>
                </td>
                <td>
                  <ThreatBadge severity={item.severity} size="sm" />
                </td>
                <td>
                  <span
                    className="font-bold text-xs font-mono"
                    style={{ color: getVerdictColor(item.verdict) }}
                  >
                    {item.verdict}
                  </span>
                </td>
                <td>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono"
                    style={getStatusStyle(item.status)}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="text-right">
                  <Link
                    to={`/incidents/${item.incident_id}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: 'rgba(16,185,129,0.08)',
                      color: '#34d399',
                      border: '1px solid rgba(16,185,129,0.2)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(16,185,129,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(16,185,129,0.08)';
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="9" className="py-12 text-center" style={{ color: '#334155' }}>
                  <div className="space-y-2">
                    <p className="font-mono text-sm">No matching incidents found</p>
                    <p className="text-xs text-slate-600">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer Count ── */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: '#0d1424',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <span className="text-xs font-mono" style={{ color: '#334155' }}>
          Showing {filtered.length} of {incidents.length} incidents
        </span>
      </div>
    </div>
  );
}
