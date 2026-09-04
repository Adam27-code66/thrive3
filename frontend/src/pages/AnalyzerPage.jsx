import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import AnalysisProgress from '../components/AnalysisProgress';
import { Search, Upload, Mail, AlertCircle } from 'lucide-react';

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
  const [dragOver, setDragOver] = useState(false);

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
      await runAnalysis({ sender, recipient, subject, body });
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

  const demoButtons = [
    { type: 'paypal', label: 'PayPal Impersonation', dot: '#DC2626' },
    { type: 'amazon', label: 'Amazon Account Lock', dot: '#EA580C' },
    { type: 'microsoft', label: 'Microsoft Reset', dot: '#D97706' },
    { type: 'safe', label: 'Safe Company Email', dot: '#16A34A' },
  ];

  return (
    <div className="bg-[#FBFBF9] min-h-screen py-16 px-6 lg:px-12 animate-fade-in">

      {/* Analysis Overlay */}
      <AnalysisProgress isAnalyzing={isAnalyzing} currentStep={analysisStep} steps={steps} />

      <div className="max-w-4xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="space-y-2 border-b border-[#E5E5E0] pb-6">
          <span className="text-[11px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold block">
            SOC INVESTIGATION WORKSPACE
          </span>
          <h1 className="text-4xl lg:text-5xl font-normal font-serif text-neutral-900 tracking-tight">
            Analyze Suspicious Email
          </h1>
          <p className="text-sm text-neutral-600 font-sans max-w-xl">
            Provide raw email headers/text or upload an EML/MSG file for instant forensic breakdown.
          </p>
        </div>

        {/* Demo Quick-Loader Section */}
        <div className="p-6 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-3">
            <span className="text-[11px] font-sans uppercase tracking-[0.18em] text-neutral-400 font-semibold">
              LOAD DEMO EMAIL SCENARIOS
            </span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-[0.15em]">1-Click Demos</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {demoButtons.map(({ type, label, dot }) => (
              <button
                key={type}
                type="button"
                onClick={() => loadDemoEmail(type)}
                className="py-2.5 px-3 bg-[#F4F4F0] text-left text-xs font-mono text-neutral-800 transition-colors hover:bg-neutral-200 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white p-8 space-y-8">

          {/* Tab Selector */}
          <div className="flex items-center gap-8 border-b border-[#E5E5E0] pb-4">
            {[
              { id: 'paste', label: 'Method 1 — Paste Email' },
              { id: 'upload', label: 'Method 2 — Upload File' },
            ].map(({ id, label }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="text-xs uppercase tracking-[0.18em] font-sans py-1 transition-colors"
                  style={{
                    color: active ? '#111111' : '#737373',
                    fontWeight: active ? 600 : 400,
                    borderBottom: active ? '1px solid #111111' : '1px solid transparent',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 text-red-800 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Method 1: Paste Form */}
          {activeTab === 'paste' && (
            <form onSubmit={handleAnalyzePaste} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold mb-1">
                    FROM (SENDER EMAIL)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="security@paypa1-login.com"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="editorial-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold mb-1">
                    TO (RECIPIENT EMAIL)
                  </label>
                  <input
                    type="text"
                    placeholder="employee@company.com"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="editorial-input font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold mb-1">
                  SUBJECT
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your account will be suspended!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="editorial-input font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] font-sans text-neutral-400 font-semibold mb-1">
                  EMAIL BODY TEXT
                </label>
                <textarea
                  rows="6"
                  required
                  placeholder="Paste full raw email body text or message contents here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="editorial-input font-mono leading-relaxed"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Single Heavy Primary CTA */}
              <button
                type="submit"
                disabled={isAnalyzing}
                className="btn-editorial-primary w-full py-4 text-sm font-medium"
              >
                <Search className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Email'}
              </button>
            </form>
          )}

          {/* Method 2: File Upload */}
          {activeTab === 'upload' && (
            <form onSubmit={handleAnalyzeFile} className="space-y-6">
              <div className="space-y-2">
                <div
                  className="p-12 text-center bg-[#F4F4F0] border border-[#E5E5E0] transition-colors cursor-pointer"
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]); }}
                >
                  <input
                    type="file"
                    accept=".eml,.msg,.txt"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label htmlFor="file-upload-input" className="cursor-pointer space-y-3 block">
                    <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
                    <p className="text-sm font-medium text-neutral-900">
                      {selectedFile ? selectedFile.name : 'Click to select or drag & drop email file'}
                    </p>
                    <p className="text-xs font-mono text-neutral-500">
                      Supported formats: EML, MSG, TXT
                    </p>
                  </label>
                </div>
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 text-center">
                  FIG 2.0 — DIRECT EML / MSG FILE STREAM INPUT
                </p>
              </div>

              <button
                type="submit"
                disabled={!selectedFile || isAnalyzing}
                className="btn-editorial-primary w-full py-4 text-sm font-medium"
                style={{ opacity: !selectedFile || isAnalyzing ? 0.5 : 1 }}
              >
                <Search className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing File...' : 'Analyze Uploaded File'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
