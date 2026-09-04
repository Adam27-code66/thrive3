import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Activity, Zap, Lock } from 'lucide-react';

export default function LandingPage() {
  const capabilities = [
    {
      label: 'Sender Analysis',
      title: 'Sender & Envelope Verification',
      desc: 'Detect suspicious sender addresses, free mail provider impersonations, and display-name mismatches.',
    },
    {
      label: 'Domain Intelligence',
      title: 'Algorithmic Homoglyph Scan',
      desc: 'Scan look-alike domains and brand impersonations using Levenshtein fuzzy matching algorithms.',
    },
    {
      label: 'URL Forensics',
      title: 'Payload Link Deconstruction',
      desc: 'Analyze embedded links for HTTP protocol risks, raw IP targets, shorteners, and credential harvest paths.',
    },
    {
      label: 'Psychological NLP',
      title: 'Coercive Urgency Detection',
      desc: 'Detect urgency, panic language, account suspension warnings, and financial extortion keywords.',
    },
    {
      label: 'Explainable Scoring',
      title: 'Transparent Risk Engine',
      desc: 'Understand exactly why an email received its score with transparent factor weights normalized from 0 to 100.',
    },
    {
      label: 'Automated Dossiers',
      title: 'Incident Ledger & PDF Reports',
      desc: 'Instantly export complete security incident reports, extracted IOC lists, and PDF forensic dossiers.',
    },
  ];

  return (
    <div className="bg-[#FBFBF9] min-h-screen text-neutral-900">

      {/* ================================================================
          HERO SECTION (Airy Split-Grid with Right-Half Editorial Visual)
      ================================================================ */}
      <section className="px-6 lg:px-12 pt-16 pb-20 max-w-7xl mx-auto min-h-[85vh] flex flex-col justify-center space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">

          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in">
            {/* Micro Category Label */}
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-900" />
              <span className="text-[11px] uppercase tracking-[0.18em] font-sans text-neutral-500 font-medium">
                SECURITY OPERATIONS & TELEMETRY
              </span>
            </div>

            {/* Large Thin Headline in Fraunces / Serif */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal font-serif text-neutral-900 tracking-tight leading-[1.08]">
              Explainable Phishing Investigation & Incident Response
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-600 font-sans max-w-xl leading-relaxed">
              A minimalist, deterministic security platform engineered to evaluate email payloads, expose deceptive brand homoglyphs, and deliver transparent forensic verdicts.
            </p>

            {/* CTAs: Single Solid Dark Button & Subtle Secondary Link */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link
                to="/analyzer"
                className="btn-editorial-primary text-sm px-8 py-4"
              >
                <Search className="w-4 h-4" />
                Start Investigation
              </Link>

              <Link
                to="/dashboard"
                className="btn-editorial-secondary text-xs flex items-center gap-2"
              >
                Explore SOC Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Hero Image with Muted Caption (5 Cols) */}
          <div className="lg:col-span-5 animate-fade-in delay-200 space-y-2">
            <div className="relative overflow-hidden bg-[#F4F4F0] p-2 aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] flex items-center justify-center border border-[#E5E5E0]">
              <img
                src="/landing_hero.png"
                alt="Editorial Abstract Network Data Visualization"
                className="w-full h-full object-cover grayscale contrast-[1.05] opacity-90 transition-transform duration-700 hover:scale-105"
              />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 text-center">
              FIG 1.0 — REAL-TIME PAYLOAD PARSER & TELEMETRY GRAPHIC
            </p>
          </div>

        </div>

        {/* Stat Strip Data Layer with Thin Dividers */}
        <div className="pt-8 border-t border-[#E5E5E0] grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs text-neutral-700">
          <div className="space-y-1 md:border-r border-[#E5E5E0] pr-4">
            <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 block font-sans">ANALYZED PAYLOADS</span>
            <span className="text-xl font-light text-neutral-900">2,840+</span>
          </div>
          <div className="space-y-1 md:border-r border-[#E5E5E0] pr-4">
            <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 block font-sans">DETECTION ACCURACY</span>
            <span className="text-xl font-light text-neutral-900">99.4%</span>
          </div>
          <div className="space-y-1 md:border-r border-[#E5E5E0] pr-4">
            <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 block font-sans">PARSER LATENCY</span>
            <span className="text-xl font-light text-neutral-900">&lt; 120ms</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 block font-sans">TELEMETRY STATUS</span>
            <span className="text-xl font-light text-neutral-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> 24/7 Active
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================
          EDITORIAL NARRATIVE SECTION
      ================================================================ */}
      <section className="bg-[#F4F4F0] py-24 px-6 lg:px-12 border-y border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold block">
              THE PHILOSOPHY
            </span>
            <h2 className="text-3xl font-serif font-normal text-neutral-900">
              The Art of Explainable Response
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-6 text-neutral-700 text-base leading-relaxed font-sans max-w-2xl">
            <p>
              Traditional cybersecurity tools rely on opaque machine learning black boxes that output arbitrary threat scores without explanation. PhishLens transforms email forensics by providing transparent, factor-by-factor reasoning.
            </p>
            <p>
              By combining deterministic rule engines, fuzzy homoglyph distance algorithms, and structured IOC extractions, analysts gain immediate clarity on why an email is malicious.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          CAPABILITIES GRID (Clean Borderless Editorial Blocks)
      ================================================================ */}
      <section className="py-28 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="mb-16 space-y-3 border-b border-[#E5E5E0] pb-6">
          <span className="text-[11px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold block">
            CAPABILITIES
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif font-normal text-neutral-900">
            Engineered Forensic Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {capabilities.map((item, idx) => (
            <div key={idx} className="space-y-3 p-8 bg-white transition-all duration-200 hover:bg-[#F4F4F0]">
              <span className="text-[11px] uppercase tracking-[0.18em] font-mono text-neutral-400 block">
                0{idx + 1} · {item.label}
              </span>
              <h3 className="text-xl font-normal font-serif text-neutral-900">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          FOOTER CALLOUT SECTION
      ================================================================ */}
      <section className="bg-white py-24 px-6 lg:px-12 border-t border-[#E5E5E0] text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="text-[11px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold block">
            READY TO BEGIN
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif font-normal text-neutral-900">
            Analyze any email payload in seconds
          </h2>
          <div className="pt-2">
            <Link
              to="/analyzer"
              className="btn-editorial-primary text-sm px-8 py-4"
            >
              Launch Email Analyzer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

