import React, { useEffect, useState } from 'react';
import { getDashboardStats, resetSeedData } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import IncidentTable from '../components/IncidentTable';
import { RefreshCw, Loader2 } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from 'recharts';

const CUSTOM_LIGHT_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E0',
    border: '1px solid #E5E5E0',
    fontSize: '12px',
    fontFamily: 'JetBrains Mono, monospace',
    color: '#111111',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    borderRadius: '0px',
  },
  itemStyle: { color: '#111111' },
};

const COLOR_MAP = {
  'Critical Threat': '#DC2626',
  'High Risk': '#EA580C',
  'Medium Risk': '#D97706',
  'Low Risk': '#475569',
  'Safe / Clean': '#16A34A',
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const stats = await getDashboardStats();
      setData(stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleResetDemoData = async () => {
    setRefreshing(true);
    try {
      await resetSeedData();
      await fetchStats();
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center p-6 font-mono text-xs text-neutral-400">
        <Loader2 className="w-5 h-5 animate-spin text-neutral-900 mr-2" />
        <span>Loading Telemetry...</span>
      </div>
    );
  }

  const summary = data?.summary || {};
  const recentIncidents = data?.recent_incidents || [];
  const topSuspiciousDomains = data?.top_suspicious_domains || [];

  // Muted, non-neon threat distribution
  const threatDistribution = (data?.threat_distribution || []).map(item => ({
    ...item,
    color: COLOR_MAP[item.name] || item.color || '#18181B',
  }));

  const activeThreatData = threatDistribution.filter(item => item.value > 0);

  return (
    <div className="bg-[#FBFBF9] min-h-screen py-16 px-6 lg:px-12 space-y-16 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-400 font-medium block">
              Executive Briefing & Telemetry
            </span>
            <h1 className="text-4xl lg:text-5xl font-normal font-serif text-neutral-900 tracking-tight">
              SOC Threat Dashboard
            </h1>
          </div>

          <button
            onClick={handleResetDemoData}
            disabled={refreshing}
            className="btn-editorial-secondary text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Resetting...' : 'Reset Demo Data'}
          </button>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Incidents"
            value={summary.total_analyzed || 0}
            subtext="Analyzed email payloads"
            dotColor="#111111"
          />
          <DashboardCard
            title="Phishing Threat"
            value={summary.critical_count || 0}
            subtext="Critical severity flagged"
            dotColor="#DC2626"
          />
          <DashboardCard
            title="High Severity"
            value={summary.high_count || 0}
            subtext="Elevated threat level"
            dotColor="#EA580C"
          />
          <DashboardCard
            title="Clean & Safe"
            value={summary.safe_count || 0}
            subtext="Passed all forensic checks"
            dotColor="#16A34A"
          />
        </div>

        {/* Muted Charts Section (No Neon, Light Editorial Styling) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Verdict Distribution */}
          <div className="lg:col-span-5 p-8 bg-white space-y-4">
            <div className="border-b border-[#F4F4F0] pb-3">
              <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
                Verdict Distribution
              </span>
              <h3 className="text-xl font-normal font-serif text-neutral-900">
                Threat Classification
              </h3>
            </div>

            <div className="h-60 flex items-center justify-center">
              {activeThreatData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={threatDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      dataKey="value"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    >
                      {threatDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...CUSTOM_LIGHT_TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs font-mono text-neutral-400">No threat distribution telemetry</div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-around font-mono text-xs text-neutral-600 pt-3 border-t border-[#F4F4F0] gap-2">
              {threatDistribution.map((v, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                  <span>{v.name}: {v.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Impersonated / Suspicious Domains */}
          <div className="lg:col-span-7 p-8 bg-white space-y-4">
            <div className="border-b border-[#F4F4F0] pb-3">
              <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
                Domain Intelligence
              </span>
              <h3 className="text-xl font-normal font-serif text-neutral-900">
                Top Targeted Brands & Domains
              </h3>
            </div>

            <div className="h-60 flex items-center justify-center">
              {topSuspiciousDomains.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSuspiciousDomains} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="domain"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      width={140}
                      style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fill: '#404040' }}
                    />
                    <Tooltip {...CUSTOM_LIGHT_TOOLTIP_STYLE} />
                    <Bar dataKey="count" fill="#18181B" radius={[0, 2, 2, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs font-mono text-neutral-400">No domain threats logged</div>
              )}
            </div>
          </div>

        </div>

        {/* Expandable Incident Ledger Table */}
        <div className="p-8 bg-white space-y-6">
          <div className="border-b border-[#F4F4F0] pb-4">
            <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
              Live Threat Directory
            </span>
            <h3 className="text-2xl font-normal font-serif text-neutral-900">
              Recent SOC Incident Directory
            </h3>
          </div>

          <IncidentTable incidents={recentIncidents} />
        </div>

      </div>
    </div>
  );
}
