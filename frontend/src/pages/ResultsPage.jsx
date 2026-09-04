import React from 'react';
import { Link } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import RiskScore from '../components/RiskScore';
import IndicatorCard from '../components/IndicatorCard';
import EvidenceCard from '../components/EvidenceCard';
import IOCList from '../components/IOCList';
import ReportPreview from '../components/ReportPreview';
import EmailPreview from '../components/EmailPreview';
import { Search, ArrowLeft } from 'lucide-react';

export default function ResultsPage() {
  const { currentResult, currentEmail } = useAnalysis();

  if (!currentResult) {
    return (
      <div className="bg-[#FBFBF9] min-h-screen flex items-center justify-center p-6 text-center animate-fade-in">
        <div className="max-w-md w-full bg-white p-10 space-y-6">
          <span className="text-xs uppercase tracking-widest font-mono text-neutral-400 block">
            No Active Result
          </span>
          <h2 className="text-2xl font-serif text-neutral-900">
            No Active Analysis Loaded
          </h2>
          <p className="text-xs font-mono text-neutral-500">
            Please analyze an email first to view the SOC threat forensic report.
          </p>
          <Link to="/analyzer" className="btn-editorial-primary inline-flex">
            <Search className="w-4 h-4" />
            Go to Email Analyzer
          </Link>
        </div>
      </div>
    );
  }

  const {
    incident_id, verdict, risk_score, severity, confidence,
    sender_analysis, domain_analysis, url_analysis, language_analysis,
    attachment_analysis, iocs, score_breakdown,
  } = currentResult;

  return (
    <div className="bg-[#FBFBF9] min-h-screen py-16 px-6 lg:px-12 space-y-12 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold block">
              SOC INCIDENT INVESTIGATION · {incident_id}
            </span>
            <h1 className="text-4xl lg:text-5xl font-normal font-serif text-neutral-900 tracking-tight">
              Threat Analysis & Forensics
            </h1>
          </div>

          <Link to="/analyzer" className="btn-editorial-secondary text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Analyze Another Email
          </Link>
        </div>

        {/* 1. Risk Score Gauge (Animated 0 -> Score Count Up) */}
        <RiskScore
          score={risk_score}
          severity={severity}
          verdict={verdict}
          confidence={confidence}
          scoreBreakdown={score_breakdown}
        />

        {/* Section Divider */}
        <hr className="border-t border-[#E5E5E0] my-8" />

        {/* 2. Indicator Grid */}
        <div className="space-y-4">
          <div className="border-b border-[#E5E5E0] pb-3">
            <span className="text-[11px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold block mb-1">
              VECTORS
            </span>
            <h3 className="text-2xl font-normal font-serif text-neutral-900">
              Forensic Vector Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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

        {/* Section Divider */}
        <hr className="border-t border-[#E5E5E0] my-8" />

        {/* 3. Detailed Evidence */}
        <EvidenceCard
          domainAnalysis={domain_analysis}
          languageAnalysis={language_analysis}
          urlAnalysis={url_analysis}
          senderAnalysis={sender_analysis}
          attachmentAnalysis={attachment_analysis}
        />

        {/* 4. IOCs */}
        <IOCList iocs={iocs} />

        {/* 5. Report Preview */}
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
    </div>
  );
}
