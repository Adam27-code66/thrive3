import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThreatBadge from './ThreatBadge';
import { Search, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export default function IncidentTable({ incidents = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sevFilter, setSevFilter] = useState('ALL');
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id, e) => {
    // Don't expand if user clicked directly on a link
    if (e.target.closest('a')) return;
    setExpandedId(expandedId === id ? null : id);
  };

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

  return (
    <div className="space-y-6">
      {/* ── Search & Filter Toolbar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E0]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-0 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, sender, domain, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="editorial-input pl-7"
            style={{ paddingLeft: '28px' }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <select
            value={sevFilter}
            onChange={(e) => setSevFilter(e.target.value)}
            className="bg-transparent text-neutral-700 outline-none cursor-pointer py-1.5"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="SAFE">Safe</option>
          </select>

          <select
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value)}
            className="bg-transparent text-neutral-700 outline-none cursor-pointer py-1.5"
          >
            <option value="ALL">All Verdicts</option>
            <option value="LIKELY PHISHING">Phishing</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="SAFE">Safe</option>
          </select>

          <button
            onClick={() => setSortBy(sortBy === 'risk' ? 'date' : 'risk')}
            className="text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-wider text-[11px]"
          >
            Sort: {sortBy === 'risk' ? 'Risk Score' : 'Date'}
          </button>
        </div>
      </div>

      {/* ── Table Ledger ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E5E0] text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              <th className="py-3 px-4 font-normal">Incident</th>
              <th className="py-3 px-4 font-normal">Date</th>
              <th className="py-3 px-4 font-normal">Sender</th>
              <th className="py-3 px-4 font-normal">Domain</th>
              <th className="py-3 px-4 font-normal text-center">Score</th>
              <th className="py-3 px-4 font-normal">Verdict</th>
              <th className="py-3 px-4 font-normal text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E0]">
            {filtered.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <React.Fragment key={item.id}>
                  {/* Main Row */}
                  <tr
                    onClick={(e) => toggleExpand(item.id, e)}
                    className="editorial-row text-sm text-neutral-900"
                  >
                    <td className="py-4 px-4 font-mono font-medium text-neutral-900">
                      <Link
                        to={`/incidents/${item.incident_id}`}
                        className="hover:underline text-neutral-900"
                      >
                        {item.incident_id}
                      </Link>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-neutral-500 whitespace-nowrap">
                      {item.created_at ? item.created_at.slice(0, 10) : '—'}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-neutral-600 max-w-[180px] truncate" title={item.sender}>
                      {item.sender}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-neutral-800">
                      <span>{item.domain || '—'}</span>
                      {item.detected_brand && (
                        <span className="block text-[10px] text-neutral-500 font-mono uppercase">
                          Target: {item.detected_brand}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-light text-base">
                      {item.risk_score}/100
                    </td>
                    <td className="py-4 px-4">
                      <ThreatBadge severity={item.severity} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        className="text-neutral-400 hover:text-neutral-900 transition-colors p-1"
                        aria-label="Expand details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Inline Detail View */}
                  {isExpanded && (
                    <tr className="bg-[#F4F4F0] animate-fade-in">
                      <td colSpan="7" className="p-6">
                        <div className="space-y-3 font-sans text-xs text-neutral-700">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                              Subject & Payload Context
                            </span>
                            <Link
                              to={`/incidents/${item.incident_id}`}
                              className="btn-editorial-secondary py-1 px-3 text-xs inline-flex items-center gap-1"
                            >
                              Open Full Dossier <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>

                          <p className="font-medium text-sm text-neutral-900">
                            {item.subject || '(No Subject)'}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#E5E5E0] font-mono text-xs">
                            <div>
                              <span className="text-neutral-400 block text-[10px] uppercase">Recipient</span>
                              <span>{item.recipient || 'employee@company.com'}</span>
                            </div>
                            <div>
                              <span className="text-neutral-400 block text-[10px] uppercase">Status</span>
                              <span>{item.status}</span>
                            </div>
                            <div>
                              <span className="text-neutral-400 block text-[10px] uppercase">Verdict Verdict</span>
                              <span>{item.verdict}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="py-12 text-center text-neutral-400 font-mono text-xs">
                  No matching incidents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Count Summary */}
      <div className="text-xs font-mono text-neutral-400 pt-2 border-t border-[#E5E5E0]">
        Showing {filtered.length} of {incidents.length} threat records
      </div>
    </div>
  );
}
