import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIncidentDetail, updateIncidentStatus } from '../services/api';
import RiskScore from '../components/RiskScore';
import EvidenceCard from '../components/EvidenceCard';
import IOCList from '../components/IOCList';
import ReportPreview from '../components/ReportPreview';
import EmailPreview from '../components/EmailPreview';
import IncidentTimeline from '../components/IncidentTimeline';
import { ArrowLeft, Activity, Loader2 } from 'lucide-react';

export default function IncidentDetailsPage() {
  const { incidentId } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getIncidentDetail(incidentId);
        setIncident(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [incidentId]);

  const handleStatusToggle = async (newStatus) => {
    try {
      setUpdating(true);
      await updateIncidentStatus(incidentId, newStatus);
      setIncident(prev => ({ ...prev, status: newStatus }));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !incident) {
    return (
      <div className="flex items-center justify-center py-32 gap-3">
        <Loader2 className="w-6 h-6 text-emerald-400" style={{ animation: 'spin 1s linear infinite' }} />
        <span className="text-sm font-mono" style={{ color: '#475569' }}>
          Fetching Forensic Incident Record #{incidentId}...
        </span>
      </div>
    );
  }

  const STATUS_STYLES = {
    OPEN: { active: { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.35)' } },
    INVESTIGATING: { active: { background: 'rgba(234,179,8,0.15)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.35)' } },
    RESOLVED: { active: { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.35)' } },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/incidents"
              className="flex items-center gap-1 text-[11px] font-mono font-bold transition-colors"
              style={{ color: '#475569', textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Incidents
            </Link>
            <span style={{ color: '#1e293b' }}>/</span>
            <span
              className="text-[11px] font-mono font-bold px-2 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {incident.incident_id}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Incident Dossier #{incident.incident_id}
          </h1>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: '#475569' }}>SOC Status:</span>
          {['OPEN', 'INVESTIGATING', 'RESOLVED'].map((st) => {
            const isActive = incident.status === st;
            const activeStyle = STATUS_STYLES[st]?.active || {};
            return (
              <button
                key={st}
                onClick={() => handleStatusToggle(st)}
                disabled={updating}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all"
                style={isActive ? activeStyle : {
                  background: 'rgba(255,255,255,0.04)',
                  color: '#475569',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <IncidentTimeline
        createdAt={incident.created_at}
        riskScore={incident.risk_score}
        severity={incident.severity}
      />

      {/* Risk Score */}
      <RiskScore
        score={incident.risk_score}
        severity={incident.severity}
        verdict={incident.verdict}
        confidence={incident.confidence}
        scoreBreakdown={incident.score_breakdown}
      />

      {/* Evidence */}
      <EvidenceCard
        domainAnalysis={incident.domain_analysis}
        languageAnalysis={incident.language_analysis}
        urlAnalysis={incident.url_analysis}
        senderAnalysis={incident.sender_analysis}
        attachmentAnalysis={incident.attachment_analysis}
      />

      {/* IOCs */}
      <IOCList iocs={incident.iocs} />

      {/* Report & Recommendations */}
      <ReportPreview result={incident} />

      {/* Raw Email */}
      <EmailPreview
        sender={incident.sender}
        recipient={incident.recipient}
        subject={incident.subject}
        body={incident.body}
      />
    </div>
  );
}
