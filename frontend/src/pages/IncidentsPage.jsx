import React, { useEffect, useState } from 'react';
import { getIncidents } from '../services/api';
import IncidentTable from '../components/IncidentTable';
import { RefreshCw, Loader2 } from 'lucide-react';

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
    <div className="bg-[#FBFBF9] min-h-screen py-16 px-6 lg:px-12 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-400 font-medium block">
              Incident Directory · {incidents.length} Logged
            </span>
            <h1 className="text-4xl lg:text-5xl font-light font-serif text-neutral-900 tracking-tight">
              Investigated Threat Ledger
            </h1>
          </div>

          <button
            onClick={fetchIncidents}
            disabled={loading}
            className="btn-editorial-secondary text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Ledger'}
          </button>
        </div>

        {/* Incident Table */}
        <div className="p-8 bg-white space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-xs font-mono text-neutral-400">
              <Loader2 className="w-5 h-5 animate-spin text-neutral-900" />
              <span>Fetching incident database...</span>
            </div>
          ) : (
            <IncidentTable incidents={incidents} />
          )}
        </div>

      </div>
    </div>
  );
}
