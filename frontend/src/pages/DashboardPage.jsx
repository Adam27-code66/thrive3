import React, { useEffect, useState } from 'react';
import { getDashboardStats, resetSeedData } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import IncidentTable from '../components/IncidentTable';
import {
  ShieldAlert, Activity, PieChart as PieIcon, TrendingUp, Globe, AlertTriangle, RefreshCw, BarChart2, Loader2
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';

const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#0d1424',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: '10px',
    fontSize: '12px',
    fontFamily: 'JetBrains Mono, monospace',
    color: '#e2e8f0',
    boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
  },
  itemStyle: { color: '#e2e8f0' },
};

function SectionCard({ title, icon: Icon, iconColor = '#22d3ee', children }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
    >
      <div
        className="flex items-center gap-2 px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="p-1.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {Icon && <Icon className="w-4 h-4" style={{ color: iconColor }} />}
        </div>
        <h3
          className="text-xs font-bold uppercase tracking-widest font-mono"
          style={{ color: '#64748b' }}
        >
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      setData(res);
    } catch (e) {
      console.error('Failed to load dashboard stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleResetSeed = async () => {
    setRefreshing(true);
    try {
      await resetSeedData();
      await fetchStats();
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-32 gap-3">
        <Loader2 className="w-6 h-6 text-emerald-400" style={{ animation: 'spin 1s linear infinite' }} />
        <span className="text-sm font-mono" style={{ color: '#475569' }}>Loading SOC Dashboard Analytics...</span>
      </div>
    );
  }

  const { summary, threat_distribution, threats_over_time, top_suspicious_domains, common_indicators, recent_incidents } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[11px] font-mono font-bold uppercase"
              style={{ color: '#10b981' }}
            >
              Security Operations Center
            </span>
            <span
              className="flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.08)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'dot-blink 1.5s ease-in-out infinite' }} />
              REALTIME FEEDS
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">SOC Security Dashboard</h1>
        </div>

        <button
          onClick={handleResetSeed}
          disabled={refreshing}
          className="btn-ghost"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${refreshing ? 'animate-spin' : ''}`} />
          Reset Demo Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard title="Analyzed Emails" value={summary.total_analyzed} subtext="Total SOC Submissions" icon={Activity} color="cyan" />
        <DashboardCard title="Critical Threats" value={summary.critical_count} subtext="Immediate Block Action" icon={ShieldAlert} color="red" />
        <DashboardCard title="High Risk" value={summary.high_count} subtext="High Phishing Probability" icon={AlertTriangle} color="orange" />
        <DashboardCard title="Medium Risk" value={summary.medium_count} subtext="Under Tier-2 Investigation" icon={BarChart2} color="yellow" />
        <DashboardCard title="Safe Emails" value={summary.safe_count} subtext="Clean Email Traffic" icon={Globe} color="emerald" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Threat Distribution Donut */}
        <div className="lg:col-span-5">
          <SectionCard title="Threat Severity Distribution" icon={PieIcon} iconColor="#22d3ee">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threat_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {threat_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0d1424" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip {...CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {threat_distribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-2" style={{ color: '#64748b' }}>
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Incidents Over Time */}
        <div className="lg:col-span-7">
          <SectionCard title="Incident Ingestion Timeline (7 Days)" icon={TrendingUp} iconColor="#818cf8">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={threats_over_time}>
                  <defs>
                    <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" stroke="#334155" fontSize={11} fontFamily="JetBrains Mono, monospace" />
                  <YAxis stroke="#334155" fontSize={11} fontFamily="JetBrains Mono, monospace" />
                  <Tooltip {...CHART_TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="incidents" stroke="#06b6d4" fillOpacity={1} fill="url(#colorIncidents)" name="Total Incidents" strokeWidth={2} />
                  <Area type="monotone" dataKey="critical" stroke="#ef4444" fillOpacity={1} fill="url(#colorCritical)" name="Critical Threats" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Top Suspicious Domains */}
        <SectionCard title="Top Flagged Suspicious Domains" icon={Globe} iconColor="#fbbf24">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top_suspicious_domains}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="domain" stroke="#334155" fontSize={10} fontFamily="JetBrains Mono, monospace" />
                <YAxis stroke="#334155" fontSize={11} fontFamily="JetBrains Mono, monospace" />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} name="Occurrences" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Common Indicators */}
        <SectionCard title="Most Common Phishing Indicators" icon={AlertTriangle} iconColor="#c4b5fd">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={common_indicators} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" stroke="#334155" fontSize={11} fontFamily="JetBrains Mono, monospace" />
                <YAxis dataKey="indicator" type="category" stroke="#334155" fontSize={10} fontFamily="JetBrains Mono, monospace" width={130} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#a855f7" radius={[0, 4, 4, 0]} name="Trigger Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Recent Incidents */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">Recent SOC Incidents</h2>
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {recent_incidents?.length || 0} entries
          </span>
        </div>
        <IncidentTable incidents={recent_incidents} />
      </div>

    </div>
  );
}
