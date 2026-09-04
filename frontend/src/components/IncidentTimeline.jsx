import React from 'react';
import { Mail, ShieldCheck, Globe, Link2, MessageSquare, Calculator, FileCheck2 } from 'lucide-react';

export default function IncidentTimeline({ createdAt, riskScore, severity }) {
  const steps = [
    { label: 'Email Received', icon: Mail, desc: 'SMTP Headers Captured' },
    { label: 'Sender Analyzed', icon: ShieldCheck, desc: 'SPF/DKIM/Spoof Check' },
    { label: 'Domain Checked', icon: Globe, desc: 'Brand Homoglyph Scan' },
    { label: 'URL Extracted', icon: Link2, desc: 'Payload Link Parsing' },
    { label: 'NLP Analysis', icon: MessageSquare, desc: 'Urgency & Threat Words' },
    { label: 'Risk Calculated', icon: Calculator, desc: `Score: ${riskScore}/100` },
    { label: 'Incident Created', icon: FileCheck2, desc: 'Logged to SOC Ledger' },
  ];

  return (
    <div
      className="rounded-2xl p-6 space-y-4"
      style={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
    >
      <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h3
          className="text-xs font-bold uppercase tracking-widest font-mono"
          style={{ color: '#64748b' }}
        >
          SOC Forensic Incident Processing Timeline
        </h3>
        <span
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(16,185,129,0.08)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          Automated Pipeline
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-1">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          const isLast = idx === steps.length - 1;
          return (
            <div key={idx} className="flex flex-col items-center text-center relative">
              {/* Connector */}
              {!isLast && (
                <div
                  className="absolute top-5 left-1/2 w-full h-px hidden md:block"
                  style={{
                    background: 'linear-gradient(90deg, rgba(16,185,129,0.35), rgba(16,185,129,0.08))',
                    zIndex: 0,
                  }}
                />
              )}

              <div
                className="relative z-10 p-2.5 rounded-xl mb-2 transition-all"
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)',
                }}
              >
                <IconComponent className="w-4 h-4 text-emerald-400" />
              </div>

              <span
                className="text-[11px] font-bold leading-tight font-mono"
                style={{ color: '#cbd5e1' }}
              >
                {step.label}
              </span>
              <span
                className="text-[9px] font-mono mt-0.5"
                style={{ color: '#334155' }}
              >
                {step.desc}
              </span>

              {/* Step number */}
              <span
                className="mt-1.5 text-[9px] font-mono font-bold"
                style={{ color: '#10b981' }}
              >
                0{idx + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
