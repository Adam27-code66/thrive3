import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import AnalysisProgress from '../components/AnalysisProgress';
import { Search, Upload, Mail, Sparkles, AlertCircle } from 'lucide-react';

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
    { type: 'paypal', label: 'PayPal Impersonation', bg: 'rgba(239,68,68,0.08)', color: '#f87171', border: 'rgba(239,68,68,0.25)', dot: '#ef4444' },
    { type: 'amazon', label: 'Amazon Account Lock', bg: 'rgba(249,115,22,0.08)', color: '#fb923c', border: 'rgba(249,115,22,0.25)', dot: '#f97316' },
    { type: 'microsoft', label: 'Microsoft Reset', bg: 'rgba(234,179,8,0.08)', color: '#fbbf24', border: 'rgba(234,179,8,0.25)', dot: '#eab308' },
    { type: 'safe', label: 'Safe Company Email', bg: 'rgba(34,197,94,0.08)', color: '#4ade80', border: 'rgba(34,197,94,0.25)', dot: '#22c55e' },
  ];

  const inputStyle = {
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontFamily: 'JetBrains Mono, monospace',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#475569',
    fontFamily: 'JetBrains Mono, monospace',
    marginBottom: '6px',
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#10b981';
    e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.12)';
  };
  const handleInputBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10 space-y-6">

      {/* Analysis Overlay */}
      <AnalysisProgress isAnalyzing={isAnalyzing} currentStep={analysisStep} steps={steps} />

      {/* Page Header */}
      <div className="text-center space-y-3 pb-2">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono font-bold"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}
        >
          <Search className="w-3.5 h-3.5" />
          SOC EMAIL INVESTIGATION WORKSPACE
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Analyze Suspicious Email</h1>
        <p className="text-sm font-mono" style={{ color: '#475569' }}>
          Provide raw email headers/text or upload an EML/MSG file for instant forensic breakdown
        </p>
      </div>

      {/* Demo Email Quick Selector */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-mono uppercase font-bold flex items-center gap-1.5"
            style={{ color: '#94a3b8' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Load Demo Email Scenarios
          </span>
          <span className="text-[10px] font-mono" style={{ color: '#334155' }}>1-Click Demos</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {demoButtons.map(({ type, label, bg, color, border, dot }) => (
            <button
              key={type}
              type="button"
              onClick={() => loadDemoEmail(type)}
              className="px-3 py-2.5 rounded-xl text-left text-xs font-mono font-bold transition-all"
              style={{ background: bg, color, border: `1px solid ${border}` }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
      >
        {/* Tabs */}
        <div
          className="flex items-center gap-1 px-5 py-4"
          style={{ background: '#0d1424', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {[
            { id: 'paste', icon: Mail, label: 'Method 1 — Paste Email' },
            { id: 'upload', icon: Upload, label: 'Method 2 — Upload File' },
          ].map(({ id, icon: Icon, label }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all"
                style={{
                  background: active ? 'rgba(16,185,129,0.1)' : 'transparent',
                  color: active ? '#34d399' : '#64748b',
                  border: active ? '1px solid rgba(16,185,129,0.25)' : '1px solid transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>

        <div className="p-6 space-y-4" style={{ background: '#090d18' }}>
          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* METHOD 1: PASTE FORM */}
          {activeTab === 'paste' && (
            <form onSubmit={handleAnalyzePaste} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>From (Sender Email)</label>
                  <input
                    type="text"
                    required
                    placeholder="security@paypa1-login.com"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
                <div>
                  <label style={labelStyle}>To (Recipient Email)</label>
                  <input
                    type="text"
                    placeholder="employee@company.com"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Your account will be suspended!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label style={labelStyle}>Email Body Text</label>
                <textarea
                  rows="7"
                  required
                  placeholder="Paste full raw email body text or message contents here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="btn-primary w-full justify-center"
                style={{ padding: '14px', fontSize: '14px' }}
              >
                <Search className="w-5 h-5" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Email'}
              </button>
            </form>
          )}

          {/* METHOD 2: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <form onSubmit={handleAnalyzeFile} className="space-y-5">
              <div
                className="relative rounded-2xl p-10 text-center space-y-3 transition-all cursor-pointer"
                style={{
                  background: dragOver ? 'rgba(16,185,129,0.06)' : 'rgba(0,0,0,0.2)',
                  border: dragOver
                    ? '2px dashed rgba(16,185,129,0.5)'
                    : selectedFile
                    ? '2px dashed rgba(16,185,129,0.35)'
                    : '2px dashed rgba(255,255,255,0.1)',
                  transition: 'all 0.2s ease',
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]); }}
              >
                <input
                  type="file"
                  accept=".eml,.msg,.txt"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload
                  className="w-10 h-10 mx-auto"
                  style={{ color: selectedFile ? '#10b981' : '#334155' }}
                />
                <div>
                  <p className="text-sm font-bold text-white">
                    {selectedFile ? selectedFile.name : 'Drag & drop email file here or click to browse'}
                  </p>
                  <p className="text-xs font-mono mt-1" style={{ color: '#475569' }}>
                    Supported formats: <strong>EML, MSG, TXT</strong>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedFile || isAnalyzing}
                className="btn-primary w-full justify-center"
                style={{
                  padding: '14px',
                  fontSize: '14px',
                  opacity: !selectedFile || isAnalyzing ? 0.5 : 1,
                }}
              >
                <Search className="w-5 h-5" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Uploaded File'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
