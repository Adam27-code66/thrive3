import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Download, FileJson } from 'lucide-react';
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

      // Pure Editorial Minimal PDF Export Styling
      doc.setFillColor(251, 251, 249);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setTextColor(17, 17, 17);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(20);
      doc.text('PHISHLENS INCIDENT DOSSIER', 14, 20);

      doc.setFontSize(9);
      doc.setTextColor(115, 115, 115);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

      doc.setDrawColor(229, 229, 224);
      doc.setLineWidth(0.5);
      doc.line(14, 30, 196, 30);

      let y = 42;

      // Executive Summary
      doc.setFontSize(11);
      doc.setTextColor(17, 17, 17);
      doc.text(`Incident ID: ${result.incident_id}`, 14, y);
      doc.text(`Verdict: ${result.verdict}`, 110, y);
      y += 8;

      doc.text(`Risk Index: ${result.risk_score} / 100 (${result.severity})`, 14, y);
      doc.text(`Confidence: ${result.confidence}%`, 110, y);
      y += 14;

      doc.line(14, y, 196, y);
      y += 12;

      // Recommendations
      doc.setFontSize(12);
      doc.text('Mitigation Actions', 14, y);
      y += 8;

      if (result.recommendation) {
        result.recommendation.forEach((rec, i) => {
          doc.setFontSize(9);
          doc.setTextColor(80, 80, 80);
          doc.text(`${i + 1}. ${rec}`, 14, y);
          y += 6;
        });
      }

      doc.save(`${result.incident_id}_Security_Report.pdf`);
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const jsonUrl = getReportJsonUrl(result.incident_id);

  return (
    <div className="p-8 bg-white space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
            Incident Dossier
          </span>
          <h3 className="text-2xl font-normal font-serif text-neutral-900">
            Export Security Report
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={downloadPDF}
            disabled={isGenerating}
            className="btn-editorial-primary"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Download PDF Report'}
          </button>

          <a
            href={jsonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-editorial-secondary"
          >
            <FileJson className="w-4 h-4" />
            Export JSON
          </a>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="space-y-4 pt-2">
        <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block">
          Recommended Security Mitigation Actions
        </span>

        <div className="space-y-3">
          {result.recommendation?.map((action, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-[#F4F4F0] text-neutral-800 text-sm font-sans">
              <span className="font-mono text-xs font-semibold text-neutral-400">
                0{idx + 1}
              </span>
              <p className="leading-relaxed">{action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
