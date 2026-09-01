import React, { useEffect, useState } from 'react';
import { getIncidents } from '../services/api';
import IncidentTable from '../components/IncidentTable';
import { FileText, RefreshCw } from 'lucide-react';

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

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">SOC DATABASE</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              {incidents.length} Total Logged
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            INCIDENT REPORTS LEDGER
          </h1>
        </div>

        <button
          onClick={fetchIncidents}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <IncidentTable incidents={incidents} />

    </div>
  );
}
