import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Search, Activity, FileText, Settings as SettingsIcon, Radio, Menu, X, ShieldAlert, Home } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/analyzer', label: 'Email Analyzer', icon: Search },
    { to: '/results', label: 'Analysis Results', icon: ShieldAlert },
    { to: '/dashboard', label: 'SOC Dashboard', icon: Activity },
    { to: '/incidents', label: 'Incident Reports', icon: FileText },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      <nav
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(7,10,18,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">

          {/* ── Brand ── */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div
              className="relative p-2 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(20,184,166,0.1))',
                border: '1px solid rgba(16,185,129,0.3)',
              }}
            >
              <Shield className="w-5 h-5 text-emerald-400" />
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"
                style={{ animation: 'dot-blink 1.5s ease-in-out infinite' }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
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
                <span
                  className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded hidden sm:inline"
                  style={{
                    background: 'rgba(16,185,129,0.1)',
                    color: '#34d399',
                    border: '1px solid rgba(16,185,129,0.25)',
                  }}
                >
                  SOC v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-mono">Detect. Explain. Respond.</p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
                  style={{
                    color: active ? '#10b981' : '#64748b',
                    background: active ? 'rgba(16,185,129,0.1)' : 'transparent',
                    border: active ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = '#e2e8f0';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-3">
            {/* SOC Status */}
            <div
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              <Radio className="w-3 h-3 text-emerald-400" style={{ animation: 'dot-blink 1.5s ease-in-out infinite' }} />
              <span className="text-[11px] font-mono text-slate-400">SOC Engine:</span>
              <span className="text-[11px] font-mono font-bold text-emerald-400">ONLINE</span>
            </div>

            {/* CTA Button */}
            <Link
              to="/analyzer"
              className="btn-primary text-sm hidden sm:inline-flex"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              <Search className="w-3.5 h-3.5" />
              Analyze Email
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-5 h-5 text-slate-300" /> : <Menu className="w-5 h-5 text-slate-300" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div
            className="md:hidden px-4 pb-4 space-y-1 animate-fade-in"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: active ? '#10b981' : '#94a3b8',
                    background: active ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
                    border: active ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.06)',
                    marginTop: '6px',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
            <Link
              to="/analyzer"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full justify-center mt-3"
              style={{ marginTop: '12px' }}
            >
              <Search className="w-4 h-4" />
              Analyze Email
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
