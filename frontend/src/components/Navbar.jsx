import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Overview' },
    { to: '/analyzer', label: 'Analyzer' },
    { to: '/results', label: 'Results' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/incidents', label: 'Incidents' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        backgroundColor: '#FBFBF9',
        borderBottom: '1px solid #E5E5E0',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

        {/* ── Brand Logo ── */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-neutral-900" />
          <div className="flex flex-col">
            <span className="text-xl font-normal tracking-tight text-neutral-900 font-serif">
              PhishLens
            </span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
              Editorial Security
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation (Text Links Only) ── */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className="text-xs tracking-wider uppercase font-mono py-1 relative transition-colors duration-150"
                style={{
                  color: active ? '#111111' : '#737373',
                  fontWeight: active ? 600 : 400,
                  borderBottom: active ? '1px solid #111111' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#111111';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#737373';
                  }
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* ── Right Action CTA ── */}
        <div className="flex items-center gap-4">
          <Link
            to="/analyzer"
            className="btn-editorial-primary hidden sm:inline-flex"
          >
            <Search className="w-3.5 h-3.5" />
            Analyze Email
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-neutral-800 transition-opacity hover:opacity-70"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ── */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 space-y-3 bg-[#FBFBF9] animate-fade-in"
          style={{ borderTop: '1px solid #E5E5E0' }}
        >
          {navLinks.map(({ to, label }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="block text-xs uppercase tracking-widest font-mono py-2 text-neutral-800"
                style={{
                  fontWeight: active ? 600 : 400,
                  color: active ? '#111111' : '#737373',
                }}
              >
                {label}
              </Link>
            );
          })}
          <Link
            to="/analyzer"
            onClick={() => setMobileOpen(false)}
            className="btn-editorial-primary w-full justify-center mt-4"
          >
            <Search className="w-4 h-4" />
            Analyze Email
          </Link>
        </div>
      )}
    </nav>
  );
}
