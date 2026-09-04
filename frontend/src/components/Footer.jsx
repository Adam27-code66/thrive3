import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        backgroundColor: '#FBFBF9',
        borderTop: '1px solid #E5E5E0',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-neutral-900" />
              <span className="text-xl font-normal tracking-tight text-neutral-900 font-serif">
                PhishLens
              </span>
            </div>

            <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
              Explainable Phishing Investigation & Incident Response Platform. Built on deterministic forensic rule engines, brand homoglyph scoring, and automated telemetry extraction.
            </p>

            <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 font-sans font-semibold pt-2">
              DON'T TRUST. VERIFY. EXPLAIN WHY.
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.18em] text-neutral-900 font-sans font-semibold">
              PLATFORM
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Overview' },
                { to: '/analyzer', label: 'Email Analyzer' },
                { to: '/results', label: 'Analysis Results' },
                { to: '/dashboard', label: 'SOC Dashboard' },
                { to: '/incidents', label: 'Incident Directory' },
                { to: '/settings', label: 'Settings' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Architecture Details */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.18em] text-neutral-900 font-sans font-semibold">
              ARCHITECTURE
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500 font-mono">
              <li>Python FastAPI Engine</li>
              <li>React 19 & Tailwind</li>
              <li>SQLAlchemy ORM</li>
              <li>Levenshtein Homoglyph Analysis</li>
              <li>Vercel Serverless Architecture</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 font-mono gap-4"
          style={{ borderTop: '1px solid #E5E5E0' }}
        >
          <p>© 2026 PhishLens Platform · All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              API Engine Active
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Database Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
