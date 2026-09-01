import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import AnalysisProgress from '../components/AnalysisProgress';
import { Search, Upload, Mail, FileText, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function AnalyzerPage() {
  const navigate = useNavigate();
  const { runAnalysis, runFileAnalysis, isAnalyzing, analysisStep, steps, error } = useAnalysis();

  const [activeTab, setActiveTab] = useState('paste'); // 'paste' | 'upload'
  
  // Form fields
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('employee@company.com');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);

  const loadDemoEmail = (demoType = 'paypal') => {
    if (demoType === 'paypal') {
      setSender('security@paypa1-login.com');
      setRecipient('employee@company.com');
      setSubject('Your account will be suspended!');
      setBody('Your PayPal account will be suspended unless you verify your account immediately. Click the link below to verify your identity.\n\nhttp://paypa1-login.com/verify');
    } else if (demoType === 'amazon') {
      setSender('billing-alert@amaz0n-security.net');
      setRecipient('finance@company.com');
      setSubject('Urgent: Amazon Business Account Locked');
      setBody('Dear Customer,\n\nWe detected unauthorized access to your Amazon corporate account. Your payment methods have been disabled.\nAction required within 24 hours: http://amaz0n-security.net/signin');
    } else if (demoType === 'microsoft') {
      setSender('admin@micros0ft-support.org');
      setRecipient('dev@company.com');
      setSubject('Security Alert: Microsoft 365 Password Expiration');
      setBody('Your Office365 corporate password expires today. Confirm your password immediately to prevent email disruption:\n\nhttp://104.28.16.8/login');
    } else if (demoType === 'safe') {
      setSender('hr-updates@company.com');
      setRecipient('staff@company.com');
      setSubject('Quarterly Company Town Hall & Policy Update');
      setBody('Hi Team,\n\nPlease join us for our Q3 Town Hall meeting this Thursday at 2 PM EST. The meeting agenda and slides are attached below.\n\nBest regards,\nHuman Resources');
    }
  };

  const handleAnalyzePaste = async (e) => {
    e.preventDefault();
    if (!sender && !body) return;

    try {
      await runAnalysis({
        sender,
        recipient,
        subject,
        body
      });
      navigate('/results');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyzeFile = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await runFileAnalysis(formData);
      navigate('/results');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Animated Multi-Step Scanner Overlay */}
      <AnalysisProgress isAnalyzing={isAnalyzing} currentStep={analysisStep} steps={steps} />

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
          <Search className="w-3.5 h-3.5" />
          <span>SOC EMAIL INVESTIGATION WORKSPACE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Analyze Suspicious Email
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Provide raw email headers/text or upload an EML/MSG file for instant forensic breakdown
        </p>
      </div>

      {/* Demo Email Quick Selector Buttons */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Load Quick Demo Email Scenarios</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">1-Click Hackathon Demos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => loadDemoEmail('paypal')}
            className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-mono text-xs font-bold transition-all text-left flex items-center justify-between"
          >
            <span>🔴 PayPal Impersonation</span>
          </button>

          <button
            type="button"
            onClick={() => loadDemoEmail('amazon')}
            className="px-3 py-2 rounded-xl bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/40 text-orange-300 font-mono text-xs font-bold transition-all text-left flex items-center justify-between"
          >
            <span>🟠 Amazon Account Lock</span>
          </button>

          <button
            type="button"
            onClick={() => loadDemoEmail('microsoft')}
            className="px-3 py-2 rounded-xl bg-yellow-950/40 hover:bg-yellow-900/60 border border-yellow-500/40 text-yellow-300 font-mono text-xs font-bold transition-all text-left flex items-center justify-between"
          >
            <span>🟡 Microsoft Reset</span>
          </button>

          <button
            type="button"
            onClick={() => loadDemoEmail('safe')}
            className="px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-all text-left flex items-center justify-between"
          >
            <span>🟢 Safe Company Email</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'paste'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Method 1 — Paste Email</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Method 2 — Upload File</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 font-mono text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* METHOD 1: PASTE FORM */}
        {activeTab === 'paste' && (
          <form onSubmit={handleAnalyzePaste} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">From (Sender Email):</label>
                <input
                  type="text"
                  required
                  placeholder="security@paypa1-login.com"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">To (Recipient Email):</label>
                <input
                  type="text"
                  placeholder="employee@company.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold uppercase text-[10px]">Subject:</label>
              <input
                type="text"
                required
                placeholder="Your account will be suspended!"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold uppercase text-[10px]">Email Body Text:</label>
              <textarea
                rows="6"
                required
                placeholder="Paste full raw email body text or message contents here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Search className="w-5 h-5" />
              <span>🔍 Analyze Email</span>
            </button>
          </form>
        )}

        {/* METHOD 2: FILE UPLOAD */}
        {activeTab === 'upload' && (
          <form onSubmit={handleAnalyzeFile} className="space-y-6">
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-10 text-center space-y-3 bg-slate-950/60 transition-all cursor-pointer relative">
              <input
                type="file"
                accept=".eml,.msg,.txt"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-cyan-400 mx-auto animate-bounce" />
              <div>
                <p className="text-sm font-bold text-white">
                  {selectedFile ? selectedFile.name : "Drag & drop email file here or click to browse"}
                </p>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Supported formats: <strong>EML, MSG, TXT</strong>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedFile || isAnalyzing}
              className="w-full py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              <Search className="w-5 h-5" />
              <span>🔍 Analyze Uploaded File</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
