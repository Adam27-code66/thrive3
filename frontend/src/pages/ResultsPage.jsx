import React from 'react';
import { Link } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import RiskScore from '../components/RiskScore';
import IndicatorCard from '../components/IndicatorCard';
import EvidenceCard from '../components/EvidenceCard';
import IOCList from '../components/IOCList';
import ReportPreview from '../components/ReportPreview';
import EmailPreview from '../components/EmailPreview';
import { ShieldAlert, Search, ArrowLeft, Terminal, AlertTriangle, FileText } from 'lucide-react';

export default function ResultsPage() {
  const { currentResult, currentEmail } = useAnalysis();

  if (!currentResult) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-6">
        <div className="p-4 rounded-full bg-slate-900 w-fit mx-auto border border-slate-800 text-slate-400">
          <ShieldAlert className="w-12 h-12 text-amber-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No Active Analysis Loaded</h2>
          <p className="text-xs font-mono text-slate-400">
            Please analyze an email first to view the SOC threat forensic report.
          </p>
        </div>
        <Link
          to="/analyzer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500"
        >
          <Search className="w-4 h-4" />
          <span>Go to Email Analyzer</span>
        </Link>
      </div>
    );
  }

  const {
    incident_id,
    verdict,
    risk_score,
    severity,
    confidence,
    sender_analysis,
    domain_analysis,
    url_analysis,
    language_analysis,
    attachment_analysis,
    indicators,
    iocs,
    score_breakdown
  } = currentResult;

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">SOC Incident Investigation</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              {incident_id}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            THREAT ANALYSIS & FORENSICS
          </h1>
        </div>

        <Link
          to="/analyzer"
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze Another Email</span>
        </Link>
      </div>

      {/* 1. Main Risk Score Gauge */}
      <RiskScore
        score={risk_score}
        severity={severity}
        verdict={verdict}
        confidence={confidence}
        scoreBreakdown={score_breakdown}
      />

      {/* 2. Top Vector Indicator Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Forensic Vector Indicators
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <IndicatorCard
            category="Sender"
            riskLevel={sender_analysis?.risk_level || 'SAFE'}
            title="Sender Identity"
            description={sender_analysis?.indicators?.[0] || "Sender address verified."}
            evidence={`Email: ${sender_analysis?.sender_email || 'N/A'}`}
            impactScore={15}
          />

          <IndicatorCard
            category="Domain"
            riskLevel={domain_analysis?.risk_level || 'SAFE'}
            title="Domain Reputation"
            description={domain_analysis?.indicators?.[0] || "Domain appears clean."}
            evidence={domain_analysis?.domain ? `Domain: ${domain_analysis.domain}` : undefined}
            impactScore={20}
          />

          <IndicatorCard
            category="URL"
            riskLevel={url_analysis?.risk_level || 'SAFE'}
            title="Embedded Links"
            description={url_analysis?.indicators?.[0] || "No suspicious URLs."}
            evidence={`Total Links: ${url_analysis?.total_urls || 0}`}
            impactScore={15}
          />

          <IndicatorCard
            category="Urgency"
            riskLevel={language_analysis?.risk_level || 'SAFE'}
            title="NLP Threat Language"
            description={language_analysis?.indicators?.[0] || "Normal linguistic tone."}
            evidence={`Urgency Score: ${language_analysis?.urgency_score || 0}/100`}
            impactScore={10}
          />

          <IndicatorCard
            category="Attachment"
            riskLevel={attachment_analysis?.risk_level || 'SAFE'}
            title="Attachments"
            description={attachment_analysis?.indicators?.[0] || "No hazardous attachments."}
            evidence={`Count: ${attachment_analysis?.total_attachments || 0}`}
            impactScore={15}
          />
        </div>
      </div>

      {/* 3. Detailed Evidence Section */}
      <EvidenceCard
        domainAnalysis={domain_analysis}
        languageAnalysis={language_analysis}
        urlAnalysis={url_analysis}
        senderAnalysis={sender_analysis}
        attachmentAnalysis={attachment_analysis}
      />

      {/* 4. Indicators of Compromise (IOCs) */}
      <IOCList iocs={iocs} />

      {/* 5. Automatic Incident Report & Action Recommendations */}
      <ReportPreview result={currentResult} />

      {/* 6. Raw Email Payload Viewer */}
      {currentEmail && (
        <EmailPreview
          sender={currentEmail.sender}
          recipient={currentEmail.recipient}
          subject={currentEmail.subject}
          body={currentEmail.body}
        />
      )}

    </div>
  );
}
