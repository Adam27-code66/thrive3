import React from 'react';
import { Link } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import RiskScore from '../components/RiskScore';
import IndicatorCard from '../components/IndicatorCard';
import EvidenceCard from '../components/EvidenceCard';
import IOCList from '../components/IOCList';
import ReportPreview from '../components/ReportPreview';
import EmailPreview from '../components/EmailPreview';
import { ShieldAlert, Search, ArrowLeft } from 'lucide-react';

export default function ResultsPage() {
  const { currentResult, currentEmail } = useAnalysis();

  if (!currentResult) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}
        >
          <ShieldAlert className="w-10 h-10 text-amber-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No Active Analysis Loaded</h2>
          <p className="text-sm font-mono" style={{ color: '#475569' }}>
            Please analyze an email first to view the SOC threat forensic report.
          </p>
        </div>
        <Link to="/analyzer" className="btn-primary inline-flex mx-auto">
          <Search className="w-4 h-4" />
          Go to Email Analyzer
        </Link>
      </div>
    );
  }

  const {
    incident_id, verdict, risk_score, severity, confidence,
    sender_analysis, domain_analysis, url_analysis, language_analysis,
    attachment_analysis, indicators, iocs, score_breakdown,
  } = currentResult;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase" style={{ color: '#10b981' }}>
              SOC Incident Investigation
            </span>
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {incident_id}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Threat Analysis & Forensics</h1>
        </div>

        <Link to="/analyzer" className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
          Analyze Another Email
        </Link>
      </div>

      {/* 1. Risk Score Gauge */}
      <RiskScore
        score={risk_score}
        severity={severity}
        verdict={verdict}
        confidence={confidence}
        scoreBreakdown={score_breakdown}
      />

      {/* 2. Indicator Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span
            className="w-1 h-5 rounded-full"
            style={{ background: 'linear-gradient(180deg, #10b981, #14b8a6)' }}
          />
          Forensic Vector Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <IndicatorCard
            category="Sender"
            riskLevel={sender_analysis?.risk_level || 'SAFE'}
            title="Sender Identity"
            description={sender_analysis?.indicators?.[0] || 'Sender address verified.'}
            evidence={`Email: ${sender_analysis?.sender_email || 'N/A'}`}
            impactScore={15}
          />
          <IndicatorCard
            category="Domain"
            riskLevel={domain_analysis?.risk_level || 'SAFE'}
            title="Domain Reputation"
            description={domain_analysis?.indicators?.[0] || 'Domain appears clean.'}
            evidence={domain_analysis?.domain ? `Domain: ${domain_analysis.domain}` : undefined}
            impactScore={20}
          />
          <IndicatorCard
            category="URL"
            riskLevel={url_analysis?.risk_level || 'SAFE'}
            title="Embedded Links"
            description={url_analysis?.indicators?.[0] || 'No suspicious URLs.'}
            evidence={`Total Links: ${url_analysis?.total_urls || 0}`}
            impactScore={15}
          />
          <IndicatorCard
            category="Urgency"
            riskLevel={language_analysis?.risk_level || 'SAFE'}
            title="NLP Threat Language"
            description={language_analysis?.indicators?.[0] || 'Normal linguistic tone.'}
            evidence={`Urgency Score: ${language_analysis?.urgency_score || 0}/100`}
            impactScore={10}
          />
          <IndicatorCard
            category="Attachment"
            riskLevel={attachment_analysis?.risk_level || 'SAFE'}
            title="Attachments"
            description={attachment_analysis?.indicators?.[0] || 'No hazardous attachments.'}
            evidence={`Count: ${attachment_analysis?.total_attachments || 0}`}
            impactScore={15}
          />
        </div>
      </div>

      {/* 3. Evidence Section */}
      <EvidenceCard
        domainAnalysis={domain_analysis}
        languageAnalysis={language_analysis}
        urlAnalysis={url_analysis}
        senderAnalysis={sender_analysis}
        attachmentAnalysis={attachment_analysis}
      />

      {/* 4. IOCs */}
      <IOCList iocs={iocs} />

      {/* 5. Report & Recommendations */}
      <ReportPreview result={currentResult} />

      {/* 6. Raw Email */}
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
