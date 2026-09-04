import React, { useEffect, useState } from 'react';
import { getIncidents } from '../services/api';
import IncidentTable from '../components/IncidentTable';
import { FileText, RefreshCw, Loader2 } from 'lucide-react';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await getIncidents({ limit: 100 });
      setIncidents(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIncidents(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase" style={{ color: '#10b981' }}>
              SOC Database
            </span>
            <span
              className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {incidents.length} Total Logged
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Incident Reports Ledger</h1>
        </div>

        <button
          onClick={fetchIncidents}
          className="btn-ghost"
          disabled={loading}
        >
          {loading
            ? <Loader2 className="w-3.5 h-3.5 text-emerald-400" style={{ animation: 'spin 1s linear infinite' }} />
            : <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          }
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 className="w-5 h-5 text-emerald-400" style={{ animation: 'spin 1s linear infinite' }} />
          <span className="text-sm font-mono" style={{ color: '#475569' }}>Loading incident database...</span>
        </div>
      ) : (
        <IncidentTable incidents={incidents} />
      )}
    </div>
  );
}
