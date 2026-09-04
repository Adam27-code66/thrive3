import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIncidentDetail, updateIncidentStatus } from '../services/api';
import RiskScore from '../components/RiskScore';
import EvidenceCard from '../components/EvidenceCard';
import IOCList from '../components/IOCList';
import ReportPreview from '../components/ReportPreview';
import EmailPreview from '../components/EmailPreview';
import IncidentTimeline from '../components/IncidentTimeline';
import { ArrowLeft, Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center p-6 font-mono text-xs text-neutral-400">
        <Loader2 className="w-5 h-5 animate-spin text-neutral-900 mr-2" />
        <span>Fetching Dossier #{incidentId}...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFBF9] min-h-screen py-16 px-6 lg:px-12 space-y-12 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-6">
          <div className="space-y-2">
            <Link
              to="/incidents"
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
            </Link>
            <h1 className="text-4xl lg:text-5xl font-light font-serif text-neutral-900 tracking-tight">
              Incident Dossier #{incident.incident_id}
            </h1>
          </div>

          {/* Status Toggle Links */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-neutral-400 uppercase tracking-widest text-[10px]">Status:</span>
            {['OPEN', 'INVESTIGATING', 'RESOLVED'].map((st) => {
              const isActive = incident.status === st;
              return (
                <button
                  key={st}
                  onClick={() => handleStatusToggle(st)}
                  disabled={updating}
                  className="py-1 transition-colors uppercase tracking-wider"
                  style={{
                    color: isActive ? '#111111' : '#A3A3A3',
                    fontWeight: isActive ? 600 : 400,
                    borderBottom: isActive ? '1px solid #111111' : '1px solid transparent',
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

        {/* Report Preview */}
        <ReportPreview result={incident} />

        {/* Email Header/Body Inspection */}
        <EmailPreview
          sender={incident.sender}
          recipient={incident.recipient}
          subject={incident.subject}
          body={incident.body}
        />

      </div>
    </div>
  );
}
