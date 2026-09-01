import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Download, FileJson, Printer, Shield, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
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
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Automatic Incident Report & Export
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Complete SOC forensic dossier ready for distribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadPDF}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 border border-cyan-500/30 flex items-center gap-2 shadow-lg shadow-cyan-950/50 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>

          <a
            href={jsonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center gap-2 transition-all"
          >
            <FileJson className="w-4 h-4 text-purple-400" />
            <span>Export JSON</span>
          </a>
        </div>
      </div>

      {/* Recommended Security Actions Section */}
      <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Recommended Security Mitigation Actions</span>
        </h3>
        
        <div className="space-y-2 font-mono text-xs">
          {result.recommendation?.map((action, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                STEP {idx + 1}
              </span>
              <span className="leading-relaxed">{action}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
