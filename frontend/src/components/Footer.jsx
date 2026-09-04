import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Terminal, FileCode, Search, Activity, FileText, BarChart2, Radio } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #070a12 0%, #050710 100%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: 'auto',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(20,184,166,0.1))',
                  border: '1px solid rgba(16,185,129,0.25)',
                }}
              >
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span
                  className="font-extrabold text-lg tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #34d399 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  PhishLens
                </span>
                <span className="ml-2 text-[10px] font-mono text-slate-500">v1.0.0-soc</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Explainable Phishing Investigation & Incident Response Platform. Powered by deterministic forensic rule engines, brand homoglyph neural scoring, and automated IOC extraction.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Zero Trust
              </span>
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                FastAPI Engine
              </span>
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                Explainable Risk
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 font-mono">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/analyzer', label: 'Email Analyzer', icon: Search },
                { to: '/results', label: 'Analysis Results', icon: BarChart2 },
                { to: '/dashboard', label: 'SOC Dashboard', icon: Activity },
                { to: '/incidents', label: 'Incident Reports', icon: FileText },
              ].map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm text-slate-400 transition-colors"
                    style={{ textDecoration: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 font-mono">Tech Stack</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                Python FastAPI Backend
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                React 19 + Vite + Tailwind
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                SQLAlchemy + MySQL/SQLite
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                Levenshtein Homoglyph Scan
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p>© 2026 PhishLens Platform · "Don't Trust. Verify. Understand Why."</p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400" style={{ animation: 'dot-blink 1.5s ease-in-out infinite' }} />
              REST API Active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              Database Connected
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
