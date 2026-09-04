import React, { useEffect, useState } from 'react';
import { getDashboardStats, resetSeedData } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import IncidentTable from '../components/IncidentTable';
import { RefreshCw, Loader2 } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from 'recharts';

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
        <Loader2 className="w-6 h-6 animate-spin text-neutral-900 mr-2" />
        <span>Loading Executive Telemetry...</span>
      </div>
    );
  }

  const overview = data?.overview || {};
  const recentIncidents = data?.recent_incidents || [];
  const topTargetBrands = data?.top_target_brands || [];

  const verdictData = [
    { name: 'Phishing', value: overview.verdict_counts?.['LIKELY PHISHING'] || 0, color: '#DC2626' },
    { name: 'Suspicious', value: overview.verdict_counts?.['SUSPICIOUS'] || 0, color: '#EA580C' },
    { name: 'Safe', value: overview.verdict_counts?.['SAFE'] || 0, color: '#16A34A' },
  ];

  return (
    <div className="bg-[#FBFBF9] min-h-screen py-16 px-6 lg:px-12 space-y-16 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-400 font-medium block">
              Executive Briefing
            </span>
            <h1 className="text-4xl lg:text-5xl font-light font-serif text-neutral-900 tracking-tight">
              Threat & Incident Telemetry
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
            value={overview.total_incidents || 0}
            subtext="Analyzed email payloads"
            dotColor="#111111"
          />
          <DashboardCard
            title="Phishing Threat"
            value={overview.critical_incidents || 0}
            subtext="Critical severity flagged"
            dotColor="#DC2626"
          />
          <DashboardCard
            title="High Severity"
            value={overview.high_severity || 0}
            subtext="Elevated threat level"
            dotColor="#EA580C"
          />
          <DashboardCard
            title="Clean & Safe"
            value={overview.safe_emails || 0}
            subtext="Passed all forensic checks"
            dotColor="#16A34A"
          />
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Verdict Distribution */}
          <div className="lg:col-span-5 p-8 bg-white space-y-4">
            <div className="border-b border-[#F4F4F0] pb-3">
              <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
                Verdict Breakdown
              </span>
              <h3 className="text-xl font-normal font-serif text-neutral-900">
                Threat Classification
              </h3>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verdictData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {verdictData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-around font-mono text-xs text-neutral-600 pt-2 border-t border-[#F4F4F0]">
              {verdictData.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                  <span>{v.name}: {v.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Impersonated Brands */}
          <div className="lg:col-span-7 p-8 bg-white space-y-4">
            <div className="border-b border-[#F4F4F0] pb-3">
              <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
                Brand Impersonation
              </span>
              <h3 className="text-xl font-normal font-serif text-neutral-900">
                Top Targeted Brands
              </h3>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topTargetBrands} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="brand" type="category" axisLine={false} tickLine={false} width={100} style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#111111" radius={[0, 2, 2, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Expandable Incident Ledger Table */}
        <div className="p-8 bg-white space-y-6">
          <div className="border-b border-[#F4F4F0] pb-4">
            <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
              Live Threat Ledger
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
