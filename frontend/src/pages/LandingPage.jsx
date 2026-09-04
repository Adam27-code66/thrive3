import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Search, Activity, Mail, Globe, Link2, MessageSquare,
  CheckCircle2, Terminal, ArrowRight, Lock, Zap, Cpu, Sparkles,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Mail,
      title: 'Sender Analysis',
      description: 'Detect suspicious sender addresses, free mail provider impersonations, and display-name mismatches.',
      accent: '#22d3ee',
      iconBg: 'rgba(6,182,212,0.1)',
      iconBorder: 'rgba(6,182,212,0.2)',
    },
    {
      icon: Globe,
      title: 'Domain Intelligence',
      description: 'Scan look-alike domains, typosquatting homoglyphs, and brand impersonations using Levenshtein fuzzy matching.',
      accent: '#818cf8',
      iconBg: 'rgba(99,102,241,0.1)',
      iconBorder: 'rgba(99,102,241,0.2)',
    },
    {
      icon: Link2,
      title: 'URL Analysis',
      description: 'Analyze embedded links for HTTP protocol risk, IP address targets, URL shorteners, and credential harvest paths.',
      accent: '#fbbf24',
      iconBg: 'rgba(234,179,8,0.1)',
      iconBorder: 'rgba(234,179,8,0.2)',
    },
    {
      icon: MessageSquare,
      title: 'NLP Threat Detection',
      description: 'Detect urgency, panic language, account suspension warnings, financial demands, and suspicious keywords.',
      accent: '#f87171',
      iconBg: 'rgba(239,68,68,0.1)',
      iconBorder: 'rgba(239,68,68,0.2)',
    },
    {
      icon: Cpu,
      title: 'Explainable Risk Score',
      description: 'Understand exactly why an email received its score with transparent factor weights normalized from 0 to 100.',
      accent: '#c4b5fd',
      iconBg: 'rgba(168,85,247,0.1)',
      iconBorder: 'rgba(168,85,247,0.2)',
    },
    {
      icon: Terminal,
      title: 'Automatic Incident Report',
      description: 'Instantly export complete security incident reports, extracted IOC lists, and PDF forensic dossiers.',
      accent: '#34d399',
      iconBg: 'rgba(16,185,129,0.1)',
      iconBorder: 'rgba(16,185,129,0.2)',
    },
  ];

  const steps = [
    { label: 'Upload or paste email', icon: Mail },
    { label: 'Extract indicators', icon: Search },
    { label: 'Analyze sender/domain/URLs', icon: Globe },
    { label: 'Detect suspicious language', icon: MessageSquare },
    { label: 'Calculate risk score', icon: Cpu },
    { label: 'Generate evidence', icon: Shield },
    { label: 'Create incident report', icon: Terminal },
  ];

  return (
    <div>
      {/* ================================================================
          HERO SECTION
      ================================================================ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #070a12 0%, #0a0f1e 50%, #070a12 100%)',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Grid Pattern */}
        <div className="absolute inset-0 hero-grid-bg pointer-events-none" />

        {/* Radial Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Column */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Eyebrow Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold"
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  color: '#34d399',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                NEXT-GEN SOC PHISHING INVESTIGATION
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="font-black tracking-tight leading-none" style={{ fontSize: 'clamp(40px, 6vw, 68px)', color: '#ffffff' }}>
                  PHISHLENS
                </h1>
                <h2
                  className="font-extrabold tracking-tight leading-tight"
                  style={{
                    fontSize: 'clamp(20px, 3vw, 32px)',
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 40%, #6ee7b7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Explainable Phishing Investigation Platform
                </h2>
              </div>

              {/* Description */}
              <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                Analyze suspicious emails in seconds. Detect phishing indicators, understand the evidence, extract indicators of compromise, and automatically generate an incident report.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link to="/analyzer" className="btn-primary text-base" style={{ padding: '14px 28px', fontSize: '15px' }}>
                  <Search className="w-5 h-5" />
                  Analyze an Email
                </Link>
                <Link to="/dashboard" className="btn-secondary text-base" style={{ padding: '14px 28px', fontSize: '15px' }}>
                  <Activity className="w-5 h-5" />
                  View Dashboard
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-2 flex-wrap">
                {[
                  { icon: Lock, label: 'Deterministic Rules', color: '#34d399' },
                  { icon: Zap, label: 'Zero AI Dependency', color: '#22d3ee' },
                  { icon: Terminal, label: 'Instant PDF Export', color: '#818cf8' },
                ].map(({ icon: Icon, label, color }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 text-xs font-mono"
                    style={{ color: '#475569' }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Product Preview Card */}
            <div className="relative animate-slide-right stagger-2">
              {/* Floating glow behind card */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.12) 0%, transparent 70%)',
                  transform: 'scale(1.1)',
                }}
              />

              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0d1424, #0a0f1e)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(239,68,68,0.08)',
                }}
              >
                {/* Window Bar */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: '#eab308' }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                    <span className="text-[11px] font-mono ml-2" style={{ color: '#334155' }}>PhishLens_Inspector.exe</span>
                  </div>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                    style={{
                      background: 'rgba(239,68,68,0.15)',
                      color: '#f87171',
                      border: '1px solid rgba(239,68,68,0.3)',
                    }}
                  >
                    CRITICAL THREAT
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Email Preview */}
                  <div
                    className="rounded-xl p-4 space-y-2"
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    <div className="text-xs">
                      <span style={{ color: '#f87171', fontWeight: 700 }}>From: </span>
                      <span style={{ color: '#94a3b8' }}>security@paypa1-login.com</span>
                    </div>
                    <div className="text-xs">
                      <span style={{ color: '#fbbf24', fontWeight: 700 }}>Subject: </span>
                      <span style={{ color: '#94a3b8' }}>Your account will be suspended!</span>
                    </div>
                    <div
                      className="text-[11px] pt-2 leading-relaxed"
                      style={{
                        color: '#64748b',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      "Your PayPal account will be suspended unless you verify immediately. Click http://paypa1-login.com/verify"
                    </div>
                  </div>

                  {/* Scan Results */}
                  <div className="space-y-2">
                    {[
                      { label: 'Brand Impersonation (PayPal)', value: '94% Homoglyph Match', color: '#ef4444' },
                      { label: 'Urgency NLP Language', value: 'Account Suspension Flag', color: '#f97316' },
                      { label: 'Deceptive Link Path', value: 'Insecure HTTP Link', color: '#eab308' },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between p-2.5 rounded-lg text-xs font-mono"
                        style={{
                          background: `${color}08`,
                          border: `1px solid ${color}25`,
                          color,
                        }}
                      >
                        <span>{label}</span>
                        <span className="font-bold">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Score Widget */}
                  <div
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div>
                      <span
                        className="text-[10px] uppercase font-bold block mb-0.5 font-mono"
                        style={{ color: '#334155' }}
                      >
                        Threat Score
                      </span>
                      <span className="text-4xl font-black font-mono" style={{ color: '#ef4444' }}>94</span>
                      <span className="text-lg font-mono text-slate-600"> /100</span>
                    </div>
                    <div className="text-right">
                      <span
                        className="block text-sm font-bold font-mono"
                        style={{ color: '#f87171' }}
                      >
                        LIKELY PHISHING
                      </span>
                      <span className="text-xs font-mono" style={{ color: '#334155' }}>96% Confidence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURES SECTION
      ================================================================ */}
      <section
        className="py-24"
        style={{ background: 'linear-gradient(180deg, #070a12 0%, #0a0f1e 50%, #070a12 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold mb-2"
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                color: '#34d399',
              }}
            >
              DETECTION CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Comprehensive Phishing Analysis
            </h2>
            <p className="text-sm font-mono" style={{ color: '#475569' }}>
              Multi-layered SOC detection vectors operating in real time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, idx) => {
              const IconComp = f.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-6 space-y-4 transition-all duration-300 cursor-default group"
                  style={{
                    background: 'linear-gradient(135deg, #0d1424, #0a0f1e)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.4), 0 0 20px ${f.accent}12`;
                    e.currentTarget.style.borderColor = `${f.accent}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div
                    className="p-3 rounded-xl w-fit"
                    style={{ background: f.iconBg, border: `1px solid ${f.iconBorder}` }}
                  >
                    <IconComp className="w-5 h-5" style={{ color: f.accent }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: f.accent }}>
                    <span>Learn more</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS SECTION
      ================================================================ */}
      <section
        className="py-20"
        style={{
          background: 'linear-gradient(180deg, #0a0f1e 0%, #070a12 100%)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold mb-2"
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                color: '#34d399',
              }}
            >
              ANALYSIS PIPELINE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">How It Works</h2>
            <p className="text-sm font-mono" style={{ color: '#475569' }}>
              7-stage automated forensic investigation pipeline
            </p>
          </div>

          {/* Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center relative">
                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div
                      className="absolute top-6 left-1/2 w-full h-px hidden lg:block"
                      style={{
                        background: 'linear-gradient(90deg, rgba(16,185,129,0.4), rgba(16,185,129,0.1))',
                        zIndex: 0,
                      }}
                    />
                  )}

                  <div
                    className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, rgba(16,185,129,0.15), rgba(20,184,166,0.08))`,
                      border: '1px solid rgba(16,185,129,0.3)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}
                  >
                    <IconComp className="w-5 h-5 text-emerald-400" />
                  </div>

                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono mb-2"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
                  >
                    {idx + 1}
                  </span>

                  <p
                    className="text-[11px] font-semibold text-center leading-tight"
                    style={{ color: '#94a3b8' }}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA at bottom */}
          <div className="text-center mt-14">
            <Link to="/analyzer" className="btn-primary text-base" style={{ padding: '14px 32px', fontSize: '15px' }}>
              <Search className="w-5 h-5" />
              Try It Now — Analyze an Email
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
