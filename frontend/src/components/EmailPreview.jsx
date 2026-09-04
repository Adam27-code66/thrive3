import React from 'react';
import { Mail, User, Send, FileText } from 'lucide-react';

export default function EmailPreview({ sender, recipient, subject, body }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ background: '#0d1424', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
          >
            <Mail className="w-4 h-4 text-cyan-400" />
          </div>
          <h3
            className="text-xs font-bold uppercase tracking-widest font-mono"
            style={{ color: '#64748b' }}
          >
            Analyzed Email Payload Header & Body
          </h3>
        </div>
        <span
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
          style={{ background: 'rgba(255,255,255,0.04)', color: '#475569', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Raw Inspection
        </span>
      </div>

      <div className="p-5 space-y-3" style={{ background: '#090d18' }}>
        {/* Email Headers */}
        <div
          className="rounded-xl p-4 space-y-2.5"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {[
            { icon: Send, label: 'From', value: sender, color: '#22d3ee' },
            { icon: User, label: 'To', value: recipient || 'employee@company.com', color: '#818cf8' },
            { icon: FileText, label: 'Subject', value: subject, color: '#fbbf24' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-2.5 font-mono text-xs">
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
              <span
                className="text-[9px] font-bold uppercase tracking-wider w-12 flex-shrink-0"
                style={{ color: '#334155' }}
              >
                {label}:
              </span>
              <span style={{ color: '#cbd5e1' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span
            className="block text-[9px] font-bold uppercase tracking-widest mb-2 font-mono"
            style={{ color: '#334155' }}
          >
            Email Body Content:
          </span>
          <p
            className="text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto"
            style={{ color: '#94a3b8' }}
          >
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}
