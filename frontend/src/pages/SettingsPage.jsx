import React from 'react';
import { Settings as SettingsIcon, Shield, Database, Terminal, Cpu, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const brandList = [
    "PayPal (paypal.com)", "Google (google.com)", "Microsoft (microsoft.com)",
    "Amazon (amazon.com)", "Apple (apple.com)", "Netflix (netflix.com)",
    "LinkedIn (linkedin.com)", "Instagram (instagram.com)", "Facebook (facebook.com)",
    "Bank of America", "Chase Bank", "Wells Fargo", "DHL Express", "FedEx", "DocuSign", "USPS"
  ];

  const rules = [
    { factor: "Brand Impersonation / Homoglyph Match", weight: "+25 Points", desc: "Levenshtein distance & character substitution scan against protected brand dictionary." },
    { factor: "Suspicious Domain / High-Risk TLD", weight: "+20 Points", desc: "Domain length, hyphens, numbers replacing letters, and untrusted TLDs (.xyz, .top, .tk)." },
    { factor: "Display Name / Sender Mismatch", weight: "+15 Points", desc: "Display name claims official corporate identity while sender utilizes free mail provider." },
    { factor: "Suspicious URL Target", weight: "+15 Points", desc: "Embedded links targeting credential harvesting paths (/verify, /login, /update)." },
    { factor: "Insecure HTTP Link Protocol", weight: "+10 Points", desc: "Unencrypted HTTP URLs present in email body." },
    { factor: "Urgency & Threat NLP Phrases", weight: "+10 Points", desc: "Coercive psychological patterns threatening account closure or immediate deadlines." },
    { factor: "Hazardous Attachment Payload", weight: "+15 Points", desc: "Executable file formats, double extension tricks (.pdf.exe), or macro-enabled documents." }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">SYSTEM CONFIGURATION</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          SETTINGS & ENGINE RULES
        </h1>
      </div>

      {/* 1. Rule Engine Weights */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Explainable Risk Scoring Weights Matrix
          </h2>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {rules.map((r, idx) => (
            <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-white font-bold block">{r.factor}</span>
                <span className="text-slate-400 text-[11px]">{r.desc}</span>
              </div>
              <span className="px-3 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold whitespace-nowrap">
                {r.weight}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Protected Brand Target List */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Protected Target Brand Dictionary
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {brandList.map((brand, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* 3. System Environment Info */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Terminal className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Environment & Stack Specifications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Backend Engine</span>
            <span className="text-cyan-400 font-bold">Python 3.14 + FastAPI</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Database Driver</span>
            <span className="text-emerald-400 font-bold">SQLAlchemy + MySQL/SQLite</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Frontend Framework</span>
            <span className="text-indigo-400 font-bold">React 18 + Vite + Tailwind</span>
          </div>
        </div>
      </div>

    </div>
  );
}
