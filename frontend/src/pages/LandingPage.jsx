import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Search, Activity, Mail, Globe, Link2, MessageSquare, 
  CheckCircle2, AlertOctagon, Terminal, ArrowRight, Lock, Zap, Cpu, Sparkles 
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Mail,
      title: "Sender Analysis",
      description: "Detect suspicious sender addresses, free mail provider impersonations, and display-name mismatches.",
      color: "text-cyan-400"
    },
    {
      icon: Globe,
      title: "Domain Intelligence",
      description: "Scan look-alike domains, typosquatting homoglyphs, and brand impersonations using Levenshtein fuzzy matching.",
      color: "text-indigo-400"
    },
    {
      icon: Link2,
      title: "URL Analysis",
      description: "Analyze embedded links for HTTP protocol risk, IP address targets, URL shorteners, and credential harvest paths.",
      color: "text-amber-400"
    },
    {
      icon: MessageSquare,
      title: "NLP Threat Detection",
      description: "Detect urgency, panic language, account suspension warnings, financial demands, and suspicious keywords.",
      color: "text-red-400"
    },
    {
      icon: Cpu,
      title: "Explainable Risk Score",
      description: "Understand exactly why an email received its score with transparent factor weights normalized from 0 to 100.",
      color: "text-purple-400"
    },
    {
      icon: Terminal,
      title: "Automatic Incident Report",
      description: "Instantly export complete security incident reports, extracted IOC lists, and PDF forensic dossiers.",
      color: "text-emerald-400"
    }
  ];

  const steps = [
    "Upload or paste email",
    "Extract indicators",
    "Analyze sender/domain/URLs",
    "Detect suspicious language",
    "Calculate risk score",
    "Generate evidence",
    "Create incident report"
  ];

  return (
    <div className="space-y-24 py-6">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEXT-GEN SOC PHISHING INVESTIGATION</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              PHISHLENS
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 mt-2">
                Explainable Phishing Investigation Platform
              </span>
            </h1>

            <p className="text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
              Analyze suspicious emails in seconds. Detect phishing indicators, understand the evidence, extract indicators of compromise, and automatically generate an incident report.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/analyzer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Analyze an Email</span>
              </Link>

              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center gap-2 transition-all"
              >
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>View Security Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> Deterministic Rules</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Zero AI Dependency</span>
              <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-purple-400" /> Instant PDF Export</span>
            </div>
          </div>

          {/* Right Graphic: Simulated Email Analysis Scanner */}
          <div className="lg:col-span-5 relative">
            <div className="glass-panel glass-card-critical rounded-3xl p-6 border border-cyan-500/30 shadow-2xl relative space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">PhishLens_Inspector.exe</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                  🔴 CRITICAL THREAT
                </span>
              </div>

              {/* Email Mock */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="text-slate-400"><strong className="text-red-400">From:</strong> security@paypa1-login.com</div>
                <div className="text-slate-400"><strong className="text-amber-400">Subject:</strong> Your account will be suspended!</div>
                <div className="text-slate-300 pt-2 border-t border-slate-900 leading-relaxed text-[11px]">
                  "Your PayPal account will be suspended unless you verify immediately. Click http://paypa1-login.com/verify"
                </div>
              </div>

              {/* Real-time Indicator Scans */}
              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-red-500/30 text-red-300">
                  <span>Brand Impersonation (PayPal)</span>
                  <span className="font-bold">94% Homoglyph Match</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-orange-500/30 text-orange-300">
                  <span>Urgency NLP Language</span>
                  <span className="font-bold">Account Suspension Flag</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-yellow-500/30 text-yellow-300">
                  <span>Deceptive Link Path</span>
                  <span className="font-bold">Insecure HTTP Link</span>
                </div>
              </div>

              {/* Score Gauge Widget */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Risk Score</span>
                  <span className="text-3xl font-extrabold font-mono text-red-500">94 / 100</span>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="text-red-400 font-bold block">LIKELY PHISHING</span>
                  <span className="text-slate-400 text-[10px]">96% Confidence</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FEATURE CARDS GRID */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Comprehensive Phishing Analysis Capabilities
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Multi-layered SOC detection vectors operating in real time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const IconComp = f.icon;
            return (
              <div key={idx} className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                <div className={`p-3 rounded-xl bg-slate-900 w-fit border border-slate-800 ${f.color}`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="glass-panel rounded-3xl p-8 lg:p-12 border border-slate-800 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-xs font-mono text-slate-400">
            7-stage automated forensic investigation pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {steps.map((stepName, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-xs mx-auto">
                {idx + 1}
              </div>
              <p className="text-xs font-mono font-bold text-slate-200 leading-snug">{stepName}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
