import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Download, FileJson, Shield, FileText } from 'lucide-react';
import ThreatBadge from './ThreatBadge';
import { getReportJsonUrl } from '../services/api';

export default function ReportPreview({ result }) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!result) return null;

  const downloadPDF = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Styling tokens
      const primaryColor = [15, 23, 42];   // Slate 900
      const accentColor = [6, 182, 212];   // Cyan 500
      const redColor = [239, 68, 68];      // Red 500

      // Page 1 Header Banner
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('PHISHLENS INCIDENT REPORT', 14, 18);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(6, 182, 212);
      doc.text('Explainable Phishing Investigation & Incident Response Platform', 14, 25);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32);

      doc.setDrawColor(6, 182, 212);
      doc.setLineWidth(1);
      doc.line(0, 40, 210, 40);

      // Section 1: Executive Summary Box
      let y = 50;

      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, 182, 35, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, y, 182, 35, 'S');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Incident ID: ${result.incident_id}`, 20, y + 10);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Verdict: ${result.verdict}`, 20, y + 18);
      doc.text(`Risk Score: ${result.risk_score} / 100 (${result.severity})`, 20, y + 26);

      doc.text(`Sender: ${result.sender_analysis?.sender_email || 'N/A'}`, 110, y + 10);
      doc.text(`Target Brand: ${result.detected_brand || 'None Detected'}`, 110, y + 18);
      doc.text(`Confidence: ${result.confidence}%`, 110, y + 26);

      y += 45;

      // Section 2: Email Metadata
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('1. Email Metadata & Context', 14, y);
      y += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Subject: ${result.language_analysis?.subject || 'Analyzed Email Payload'}`, 14, y);
      y += 6;
      doc.text(`Domain: ${result.domain_analysis?.domain || 'N/A'}`, 14, y);
      y += 10;

      // Section 3: Risk Score Breakdown
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Risk Score Factor Breakdown', 14, y);
      y += 8;

      if (result.score_breakdown && result.score_breakdown.length > 0) {
        result.score_breakdown.forEach((item) => {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(239, 68, 68);
          doc.text(`+${item.points} pts`, 14, y);

          doc.setTextColor(15, 23, 42);
          doc.text(`${item.factor}`, 30, y);

          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.text(`${item.description}`, 30, y + 5);

          y += 12;
        });
      }

      y += 5;

      // Section 4: Triggered Indicators
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('3. Triggered Security Indicators & Evidence', 14, y);
      y += 8;

      if (result.indicators && result.indicators.length > 0) {
        result.indicators.forEach((ind) => {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text(`[${ind.severity}] ${ind.title}`, 14, y);

          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.text(`${ind.description}`, 14, y + 5);

          y += 12;
        });
      }

      y += 5;

      // Section 5: IOCs
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('4. Extracted Indicators of Compromise (IOCs)', 14, y);
      y += 8;

      if (result.iocs && result.iocs.length > 0) {
        result.iocs.forEach((ioc) => {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(6, 182, 212);
          doc.text(`[${ioc.type}]`, 14, y);

          doc.setTextColor(15, 23, 42);
          doc.text(`${ioc.value}`, 45, y);

          y += 6;
        });
      }

      y += 8;

      // Section 6: Recommendations
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('5. Recommended Security Mitigation Actions', 14, y);
      y += 8;

      if (result.recommendation && result.recommendation.length > 0) {
        result.recommendation.forEach((rec, i) => {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          doc.text(`${i + 1}. ${rec}`, 14, y);
          y += 6;
        });
      }

      // Save PDF
      doc.save(`${result.incident_id}_Security_Report.pdf`);
    } catch (e) {
      console.error('PDF Generation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const jsonUrl = getReportJsonUrl(result.incident_id);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5"
        style={{
          background: 'linear-gradient(90deg, #0d1424, #0a1020)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Automatic Incident Report & Export</h2>
            <p className="text-xs font-mono mt-0.5" style={{ color: '#475569' }}>
              Complete SOC forensic dossier ready for distribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={downloadPDF}
            disabled={isGenerating}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </button>

          <a
            href={jsonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            <FileJson className="w-4 h-4" style={{ color: '#a5b4fc' }} />
            Export JSON
          </a>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 space-y-4" style={{ background: '#090d18' }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3
            className="text-xs font-bold uppercase tracking-wider font-mono"
            style={{ color: '#475569' }}
          >
            Recommended Security Mitigation Actions
          </h3>
        </div>

        <div className="space-y-2">
          {result.recommendation?.map((action, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl p-3.5"
              style={{
                background: 'rgba(16,185,129,0.04)',
                border: '1px solid rgba(16,185,129,0.12)',
              }}
            >
              <span
                className="flex-shrink-0 px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase"
                style={{
                  background: 'rgba(16,185,129,0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16,185,129,0.25)',
                  marginTop: '1px',
                }}
              >
                {idx + 1}
              </span>
              <span className="text-sm text-slate-300 leading-relaxed">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
