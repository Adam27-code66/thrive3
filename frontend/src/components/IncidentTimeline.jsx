import React from 'react';

export default function IncidentTimeline({ createdAt, riskScore, severity }) {
  const steps = [
    { label: 'Email Received', desc: 'Headers Captured' },
    { label: 'Sender Analyzed', desc: 'SPF/Spoof Check' },
    { label: 'Domain Checked', desc: 'Homoglyph Scan' },
    { label: 'URL Extracted', desc: 'Link Parsing' },
    { label: 'NLP Urgency', desc: 'Language Threat' },
    { label: 'Risk Score', desc: `Score: ${riskScore}/100` },
    { label: 'Incident Logged', desc: 'SOC Ledger' },
  ];

  return (
    <div className="p-6 bg-white space-y-4">
      <div className="border-b border-[#F4F4F0] pb-3">
        <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
          Forensic Timeline
        </span>
        <h4 className="text-base font-normal font-serif text-neutral-900">
          Automated Pipeline Steps
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 pt-2">
        {steps.map((step, idx) => (
          <div key={idx} className="space-y-1 font-mono text-xs">
            <span className="text-[10px] text-neutral-400 block font-semibold">
              0{idx + 1}
            </span>
            <span className="font-medium text-neutral-900 block leading-tight">
              {step.label}
            </span>
            <span className="text-[11px] text-neutral-500 block">
              {step.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
