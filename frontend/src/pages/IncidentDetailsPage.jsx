import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIncidentDetail, updateIncidentStatus } from '../services/api';
import RiskScore from '../components/RiskScore';
import EvidenceCard from '../components/EvidenceCard';
import IOCList from '../components/IOCList';
import ReportPreview from '../components/ReportPreview';
import EmailPreview from '../components/EmailPreview';
import IncidentTimeline from '../components/IncidentTimeline';
import { ArrowLeft, ShieldAlert, Activity, FileText, CheckCircle2, Clock } from 'lucide-react';

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
      <div className="py-20 text-center font-mono text-cyan-400 animate-pulse">
        <Activity className="w-10 h-10 mx-auto mb-2 animate-spin" />
        <span>Fetching Forensic Incident Record #{incidentId}...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/incidents" className="text-xs font-mono font-bold text-cyan-400 hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Incidents
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-white font-bold border border-slate-800">
              {incident.incident_id}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            INCIDENT DOSSIER #{incident.incident_id}
          </h1>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">SOC Status:</span>
          {['OPEN', 'INVESTIGATING', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => handleStatusToggle(st)}
              disabled={updating}
              className={`px-3 py-1.5 rounded-lg border font-bold uppercase transition-all ${
                incident.status === st
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Incident Processing Timeline */}
      <IncidentTimeline
        createdAt={incident.created_at}
        riskScore={incident.risk_score}
        severity={incident.severity}
      />

      {/* 2. Main Risk Score Meter */}
      <RiskScore
        score={incident.risk_score}
        severity={incident.severity}
        verdict={incident.verdict}
        confidence={incident.confidence}
        scoreBreakdown={incident.score_breakdown}
      />

      {/* 3. Evidence */}
      <EvidenceCard
        domainAnalysis={incident.domain_analysis}
        languageAnalysis={incident.language_analysis}
        urlAnalysis={incident.url_analysis}
        senderAnalysis={incident.sender_analysis}
        attachmentAnalysis={incident.attachment_analysis}
      />

      {/* 4. IOCs */}
      <IOCList iocs={incident.iocs} />

      {/* 5. Report Preview & Action Mitigations */}
      <ReportPreview result={incident} />

      {/* 6. Raw Email Viewer */}
      <EmailPreview
        sender={incident.sender}
        recipient={incident.recipient}
        subject={incident.subject}
        body={incident.body}
      />

    </div>
  );
}
