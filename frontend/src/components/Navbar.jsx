import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, ShieldAlert, FileText, Activity, Settings as SettingsIcon, Search, Radio } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-cyan-900/60 to-indigo-900/60 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all shadow-lg shadow-cyan-950/50">
            <Shield className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-400">
                PhishLens
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                SOC v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
              Detect. Explain. Respond.
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              isActive('/') 
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Home
          </Link>

          <Link
            to="/analyzer"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              isActive('/analyzer') 
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            Email Analyzer
          </Link>

          <Link
            to="/results"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              isActive('/results') 
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Analysis Results
          </Link>

          <Link
            to="/dashboard"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              isActive('/dashboard') 
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            SOC Dashboard
          </Link>

          <Link
            to="/incidents"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              isActive('/incidents') 
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            Incident Reports
          </Link>

          <Link
            to="/settings"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              isActive('/settings') 
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
            Settings
          </Link>
        </div>

        {/* System Status & CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>SOC Engine:</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>

          <Link
            to="/analyzer"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Analyze Email</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
