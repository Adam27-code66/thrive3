import React from 'react';
import { Settings as SettingsIcon, Shield, Terminal, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

function SectionCard({ title, icon: Icon, iconColor, children }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
    >
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="p-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const brandList = [
    'PayPal (paypal.com)', 'Google (google.com)', 'Microsoft (microsoft.com)',
    'Amazon (amazon.com)', 'Apple (apple.com)', 'Netflix (netflix.com)',
    'LinkedIn (linkedin.com)', 'Instagram (instagram.com)', 'Facebook (facebook.com)',
    'Bank of America', 'Chase Bank', 'Wells Fargo', 'DHL Express', 'FedEx', 'DocuSign', 'USPS',
  ];

  const rules = [
    { factor: 'Brand Impersonation / Homoglyph Match', weight: '+25 pts', desc: 'Levenshtein distance & character substitution scan against protected brand dictionary.' },
    { factor: 'Suspicious Domain / High-Risk TLD', weight: '+20 pts', desc: 'Domain length, hyphens, numbers replacing letters, and untrusted TLDs (.xyz, .top, .tk).' },
    { factor: 'Display Name / Sender Mismatch', weight: '+15 pts', desc: 'Display name claims official corporate identity while sender utilizes free mail provider.' },
    { factor: 'Suspicious URL Target', weight: '+15 pts', desc: 'Embedded links targeting credential harvesting paths (/verify, /login, /update).' },
    { factor: 'Insecure HTTP Link Protocol', weight: '+10 pts', desc: 'Unencrypted HTTP URLs present in email body.' },
    { factor: 'Urgency & Threat NLP Phrases', weight: '+10 pts', desc: 'Coercive psychological patterns threatening account closure or immediate deadlines.' },
    { factor: 'Hazardous Attachment Payload', weight: '+15 pts', desc: 'Executable file formats, double extension tricks (.pdf.exe), or macro-enabled documents.' },
  ];

  const envItems = [
    { label: 'Backend Engine', value: 'Python 3.14 + FastAPI', color: '#22d3ee' },
    { label: 'Database Driver', value: 'SQLAlchemy + MySQL/SQLite', color: '#34d399' },
    { label: 'Frontend Framework', value: 'React 19 + Vite + Tailwind', color: '#818cf8' },
    { label: 'Analysis Method', value: 'Deterministic Rule Engine', color: '#fbbf24' },
    { label: 'Scoring Method', value: 'Weighted Factor Matrix', color: '#fb923c' },
    { label: 'IOC Format', value: 'STIX-compatible JSON', color: '#c4b5fd' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 space-y-8">

      {/* Page Header */}
      <div>
        <span className="text-[11px] font-mono font-bold uppercase" style={{ color: '#10b981' }}>
          System Configuration
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">Settings & Engine Rules</h1>
      </div>

      {/* 1. Risk Scoring Weights */}
      <SectionCard title="Explainable Risk Scoring Weights Matrix" icon={Cpu} iconColor="#22d3ee">
        <div className="space-y-3">
          {rules.map((r, idx) => (
            <div
              key={idx}
              className="flex items-start sm:items-center justify-between gap-4 rounded-xl p-4 transition-all"
              style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-white font-mono">{r.factor}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#64748b' }}>{r.desc}</p>
              </div>
              <span
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold font-mono"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  color: '#f87171',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                {r.weight}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 2. Protected Brand List */}
      <SectionCard title="Protected Target Brand Dictionary" icon={Shield} iconColor="#34d399">
        <div className="flex flex-wrap gap-2">
          {brandList.map((brand, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(16,185,129,0.08)';
                e.currentTarget.style.color = '#34d399';
                e.currentTarget.style.borderColor = 'rgba(16,185,129,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              }}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {brand}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* 3. Environment & Stack */}
      <SectionCard title="Environment & Stack Specifications" icon={Terminal} iconColor="#c4b5fd">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {envItems.map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl p-4"
              style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span
                className="block text-[9px] font-bold uppercase tracking-widest mb-1.5 font-mono"
                style={{ color: '#334155' }}
              >
                {label}
              </span>
              <span className="text-sm font-bold font-mono" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>
      </SectionCard>

    </div>
  );
}
