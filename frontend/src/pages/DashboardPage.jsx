import React, { useEffect, useState } from 'react';
import { getDashboardStats, resetSeedData } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import IncidentTable from '../components/IncidentTable';
import { 
  ShieldAlert, Activity, PieChart as PieIcon, TrendingUp, Globe, AlertTriangle, RefreshCw, BarChart2 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  BarChart, Bar, Legend 
} from 'recharts';

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

  useEffect(() => {
    fetchStats();
  }, []);

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
      <div className="py-20 text-center font-mono text-cyan-400 animate-pulse">
        <Activity className="w-10 h-10 mx-auto mb-2 animate-spin" />
        <span>Loading SOC Dashboard Analytics...</span>
      </div>
    );
  }

  const { summary, threat_distribution, threats_over_time, top_suspicious_domains, common_indicators, recent_incidents } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      
      {/* Header & Reset Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">SECURITY OPERATIONS CENTER</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              ● REALTIME FEEDS
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            SOC SECURITY DASHBOARD
          </h1>
        </div>

        <button
          onClick={handleResetSeed}
          disabled={refreshing}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-2 transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Analyzed Emails"
          value={summary.total_analyzed}
          subtext="Total SOC Submissions"
          icon={Activity}
          color="cyan"
        />

        <DashboardCard
          title="Critical Threats"
          value={summary.critical_count}
          subtext="Immediate Block Action"
          icon={ShieldAlert}
          color="red"
        />

        <DashboardCard
          title="High Risk"
          value={summary.high_count}
          subtext="High Phishing Probability"
          icon={AlertTriangle}
          color="orange"
        />

        <DashboardCard
          title="Medium Risk"
          value={summary.medium_count}
          subtext="Under Tier-2 Investigation"
          icon={BarChart2}
          color="yellow"
        />

        <DashboardCard
          title="Safe Emails"
          value={summary.safe_count}
          subtext="Clean Email Traffic"
          icon={Globe}
          color="emerald"
        />
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Threat Distribution Donut */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-slate-300 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>Threat Severity Distribution</span>
            </h3>
          </div>

          <div className="h-64">
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
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#090d16" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
            {threat_distribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Threats Over Time Area Chart */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Incident Ingestion Timeline (7 Days)</span>
            </h3>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threats_over_time}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="incidents" stroke="#06b6d4" fillOpacity={1} fill="url(#colorIncidents)" name="Total Incidents" />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" fillOpacity={1} fill="url(#colorCritical)" name="Critical Threats" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Suspicious Domains Bar Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Top Flagged Suspicious Domains</span>
            </h3>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top_suspicious_domains}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="domain" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} name="Occurrences" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Common Indicators Horizontal Bar */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-purple-400" />
              <span>Most Common Phishing Indicators</span>
            </h3>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={common_indicators} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="indicator" type="category" stroke="#64748b" fontSize={10} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#a855f7" radius={[0, 4, 4, 0]} name="Trigger Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* RECENT INCIDENTS TABLE */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-slate-400">
          Recent SOC Incidents Ledger
        </h3>
        <IncidentTable incidents={recent_incidents} />
      </div>

    </div>
  );
}
