import React from 'react';
import { Shield, Lock, Terminal, FileCode } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-slate-800/80 mt-20 py-10 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white tracking-wide">PhishLens</span>
            <span className="text-xs text-slate-500 font-mono">v1.0.0-soc</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            Explainable Phishing Investigation & Incident Response Platform. Powered by deterministic forensic rule engines, brand homoglyph neural scoring, and automated IOC extraction.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-2">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-400" /> Zero Trust</span>
            <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-cyan-400" /> FastAPI Engine</span>
            <span className="flex items-center gap-1"><FileCode className="w-3 h-3 text-indigo-400" /> Explainable Risk</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 font-mono">Platform Navigation</h4>
          <ul className="space-y-2 text-xs text-slate-400 font-medium">
            <li><a href="/analyzer" className="hover:text-cyan-400 transition-colors">Email Analyzer</a></li>
            <li><a href="/results" className="hover:text-cyan-400 transition-colors">Analysis Results</a></li>
            <li><a href="/dashboard" className="hover:text-cyan-400 transition-colors">SOC Dashboard</a></li>
            <li><a href="/incidents" className="hover:text-cyan-400 transition-colors">Incident Reports</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 font-mono">Hackathon Security Stack</h4>
          <ul className="space-y-2 text-xs text-slate-400 font-mono">
            <li>Python FastAPI Backend</li>
            <li>React + Vite + Tailwind CSS</li>
            <li>SQLAlchemy ORM + MySQL/SQLite</li>
            <li>Levenshtein Brand Homoglyph Scan</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3">
        <p>© 2026 PhishLens Platform. "Don't Trust. Verify. Understand Why."</p>
        <div className="flex items-center gap-4">
          <span className="text-emerald-400">● REST API Active</span>
          <span>● Database Connected</span>
        </div>
      </div>
    </footer>
  );
}
