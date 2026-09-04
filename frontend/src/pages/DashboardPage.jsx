import React, { useEffect, useState } from 'react';
import { getDashboardStats, resetSeedData } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import IncidentTable from '../components/IncidentTable';
import { RefreshCw, Loader2, TrendingUp, ShieldAlert, Globe, AlertTriangle } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, AreaChart, Area, CartesianGrid
} from 'recharts';

const CUSTOM_LIGHT_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E0',
    border: '1px solid #E5E5E0',
    fontSize: '12px',
    fontFamily: 'JetBrains Mono, monospace',
    color: '#111111',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
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
  const threatsOverTime = data?.threats_over_time || [];
  const commonIndicators = data?.common_indicators || [];

  // Muted, non-neon threat distribution
  const threatDistribution = (data?.threat_distribution || []).map(item => ({
    ...item,
    color: COLOR_MAP[item.name] || item.color || '#18181B',
  }));

  const totalIncidents = summary.total_analyzed || 1;
  const maxDomainCount = Math.max(...topSuspiciousDomains.map(d => d.count || 1), 1);
  const maxIndicatorCount = Math.max(...commonIndicators.map(i => i.count || 1), 1);

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

        {/* Primary Visual Analytics Section: 7-Day Ingestion Velocity */}
        <div className="p-8 bg-white space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
                Telemetry Velocity
              </span>
              <h3 className="text-2xl font-normal font-serif text-neutral-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-neutral-500" />
                7-Day Ingestion & Incident Volume
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-400">Past 7 Days</span>
          </div>

          <div className="w-full relative" style={{ height: '220px', minHeight: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatsOverTime} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181B" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#18181B" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F0" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#737373' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#737373' }}
                  allowDecimals={false}
                />
                <Tooltip {...CUSTOM_LIGHT_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="incidents" name="Total Payloads" stroke="#18181B" strokeWidth={2} fillOpacity={1} fill="url(#colorIncidents)" />
                <Area type="monotone" dataKey="critical" name="Critical Threats" stroke="#DC2626" strokeWidth={2} fillOpacity={1} fill="url(#colorCritical)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Visual Charts: Verdict Classification & Domain Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Verdict Distribution Donut Chart + Visual Breakdown */}
          <div className="lg:col-span-6 p-8 bg-white space-y-6">
            <div className="border-b border-[#F4F4F0] pb-3">
              <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
                Threat Matrix
              </span>
              <h3 className="text-xl font-normal font-serif text-neutral-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-neutral-600" />
                Threat Classification
              </h3>
            </div>

            {/* Visual Recharts Pie Chart Container */}
            <div className="w-full relative" style={{ height: '200px', minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
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
            </div>

            {/* Visual Progress Bar Breakdown for absolute reliability */}
            <div className="space-y-3 pt-4 border-t border-[#F4F4F0] font-mono text-xs">
              {threatDistribution.map((item, idx) => {
                const percent = Math.round((item.value / totalIncidents) * 100) || 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-neutral-700">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span>{item.value} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-[#F4F4F0] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Targeted Domains Bar Chart + Visual Bars */}
          <div className="lg:col-span-6 p-8 bg-white space-y-6">
            <div className="border-b border-[#F4F4F0] pb-3">
              <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
                Domain Intelligence
              </span>
              <h3 className="text-xl font-normal font-serif text-neutral-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-neutral-600" />
                Top Targeted Domains & Impersonated Brands
              </h3>
            </div>

            {/* Recharts Bar Chart Container */}
            <div className="w-full relative" style={{ height: '200px', minHeight: '200px' }}>
              {topSuspiciousDomains.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSuspiciousDomains} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
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
                <div className="h-full flex items-center justify-center text-xs font-mono text-neutral-400">
                  No suspicious domain data logged
                </div>
              )}
            </div>

            {/* Visual Frequency Progress Bar List */}
            <div className="space-y-3 pt-4 border-t border-[#F4F4F0] font-mono text-xs">
              {topSuspiciousDomains.slice(0, 4).map((d, i) => {
                const fillPercent = Math.round((d.count / maxDomainCount) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-neutral-700">
                      <span className="truncate max-w-[200px]">{d.domain}</span>
                      <span className="text-neutral-500">{d.count} flags</span>
                    </div>
                    <div className="w-full bg-[#F4F4F0] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#18181B] h-full transition-all duration-500"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Common IOC Indicators Bar Panel */}
        {commonIndicators.length > 0 && (
          <div className="p-8 bg-white space-y-4">
            <div className="border-b border-[#F4F4F0] pb-3">
              <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
                Forensic Pattern Analysis
              </span>
              <h3 className="text-xl font-normal font-serif text-neutral-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-neutral-600" />
                Frequently Triggered Threat Indicators
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {commonIndicators.map((ind, idx) => {
                const ratio = Math.round((ind.count / maxIndicatorCount) * 100);
                return (
                  <div key={idx} className="p-4 bg-[#FBFBF9] border border-[#F4F4F0] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-medium text-neutral-900 truncate max-w-[180px]" title={ind.indicator}>
                        {ind.indicator}
                      </span>
                      <span className="text-neutral-500">{ind.count} hits</span>
                    </div>
                    <div className="w-full bg-[#E5E5E0] h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-[#DC2626] h-full transition-all duration-500"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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

