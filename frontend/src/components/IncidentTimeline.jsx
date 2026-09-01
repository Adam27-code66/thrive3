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
    { label: 'Incident Created', icon: FileCheck2, desc: 'Logged to SOC Ledger' }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-slate-300">
          SOC Forensic Incident Processing Timeline
        </h3>
        <span className="text-xs font-mono text-cyan-400">Automated Pipeline</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 pt-2">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 relative">
              <div className="p-2 rounded-xl bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 mb-2">
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white leading-tight font-mono">{step.label}</span>
              <span className="text-[9px] text-slate-400 font-mono mt-1">{step.desc}</span>
              
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-xs z-10">
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
