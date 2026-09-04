import React from 'react';

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
    { label: 'Backend Engine', value: 'Python 3.14 + FastAPI' },
    { label: 'Database Driver', value: 'SQLAlchemy + MySQL/SQLite' },
    { label: 'Frontend Framework', value: 'React 19 + Vite + Tailwind' },
    { label: 'Analysis Method', value: 'Deterministic Rule Engine' },
    { label: 'Scoring Method', value: 'Weighted Factor Matrix' },
    { label: 'IOC Format', value: 'STIX-compatible JSON' },
  ];

  return (
    <div className="bg-[#FBFBF9] min-h-screen py-16 px-6 lg:px-12 space-y-12 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="space-y-2 border-b border-[#E5E5E0] pb-6">
          <span className="text-[11px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold block">
            SYSTEM CONFIGURATION
          </span>
          <h1 className="text-4xl lg:text-5xl font-normal font-serif text-neutral-900 tracking-tight">
            Settings & Engine Weights
          </h1>
        </div>

        {/* 1. Risk Scoring Weights */}
        <div className="p-8 bg-white space-y-6">
          <div className="border-b border-[#F4F4F0] pb-3">
            <span className="text-[11px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold block mb-1">
              ENGINE MATRIX
            </span>
            <h3 className="text-2xl font-normal font-serif text-neutral-900">
              Explainable Risk Factor Weights
            </h3>
          </div>

          <div className="space-y-4">
            {rules.map((r, idx) => (
              <div
                key={idx}
                className="flex items-start sm:items-center justify-between gap-4 p-4 bg-[#F4F4F0] font-sans"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 font-mono">{r.factor}</p>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{r.desc}</p>
                </div>
                <span className="font-mono text-xs font-semibold text-neutral-900 flex-shrink-0">
                  {r.weight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section Divider */}
        <hr className="border-t border-[#E5E5E0] my-8" />

        {/* 2. Protected Brands */}
        <div className="p-8 bg-white space-y-6">
          <div className="border-b border-[#F4F4F0] pb-3">
            <span className="text-[11px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold block mb-1">
              DICTIONARY
            </span>
            <h3 className="text-2xl font-normal font-serif text-neutral-900">
              Protected Brand Targets ({brandList.length})
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {brandList.map((brand, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-[#F4F4F0] text-neutral-800 font-mono text-xs border border-[#E5E5E0]"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Section Divider */}
        <hr className="border-t border-[#E5E5E0] my-8" />

        {/* 3. Environment Specs */}
        <div className="p-8 bg-white space-y-6">
          <div className="border-b border-[#F4F4F0] pb-3">
            <span className="text-[11px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold block mb-1">
              SPECIFICATIONS
            </span>
            <h3 className="text-2xl font-normal font-serif text-neutral-900">
              Environment & Runtime Architecture
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-mono text-xs">
            {envItems.map(({ label, value }) => (
              <div key={label} className="p-4 bg-[#F4F4F0] space-y-1 border border-[#E5E5E0]">
                <span className="text-[10px] text-neutral-400 block uppercase tracking-[0.18em] font-sans font-semibold">{label}</span>
                <span className="font-semibold text-neutral-900 block">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Single Primary Button */}
        <div className="pt-4 flex justify-end">
          <button className="btn-editorial-primary text-sm px-8 py-4">
            Save System Configuration
          </button>
        </div>

      </div>
    </div>
  );
}
