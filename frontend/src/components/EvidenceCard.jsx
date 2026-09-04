import React from 'react';
import ThreatBadge from './ThreatBadge';

export default function EvidenceCard({ domainAnalysis, languageAnalysis, urlAnalysis, senderAnalysis, attachmentAnalysis }) {
  const hasContent = domainAnalysis?.is_brand_impersonation || languageAnalysis?.detected_keywords?.length > 0 || urlAnalysis?.urls?.length > 0 || attachmentAnalysis?.attachments?.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
          Forensic Telemetry
        </span>
        <h3 className="text-2xl font-normal font-serif text-neutral-900">
          Why is this email suspicious?
        </h3>
      </div>

      {!hasContent && (
        <div className="p-8 text-center bg-white space-y-2">
          <p className="text-base font-serif text-neutral-900">No threat indicators detected</p>
          <p className="text-xs text-neutral-500 font-sans">This email passed all forensic rule engine checks.</p>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Brand Impersonation */}
        {domainAnalysis?.is_brand_impersonation && (
          <div className="p-6 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-3">
              <span className="text-[11px] uppercase tracking-widest font-mono font-semibold text-neutral-900">
                Brand Impersonation
              </span>
              <ThreatBadge severity="CRITICAL" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Suspicious Domain</span>
                <span className="font-semibold text-neutral-900">{domainAnalysis.domain}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Target Brand</span>
                <span className="font-semibold text-neutral-900">{domainAnalysis.detected_brand}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Similarity Match</span>
                <span className="font-semibold text-neutral-900">{domainAnalysis.brand_similarity_score}%</span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 font-sans leading-relaxed pt-2">
              The domain <code className="font-mono text-neutral-900 bg-[#F4F4F0] px-1 py-0.5">{domainAnalysis.domain}</code> closely resembles the legitimate brand {domainAnalysis.detected_brand} using character substitution or typosquatting to deceive recipients.
            </p>
          </div>
        )}

        {/* 2. Urgency Language */}
        {languageAnalysis?.detected_keywords?.length > 0 && (
          <div className="p-6 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-3">
              <span className="text-[11px] uppercase tracking-widest font-mono font-semibold text-neutral-900">
                Psychological Coercion
              </span>
              <ThreatBadge severity={languageAnalysis.risk_level} />
            </div>

            <div className="flex flex-wrap gap-2">
              {languageAnalysis.detected_keywords.map((kw, idx) => (
                <span key={idx} className="font-mono text-xs px-2.5 py-1 bg-[#F4F4F0] text-neutral-800">
                  "{kw}"
                </span>
              ))}
            </div>

            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              The email text creates artificial urgency threatening account suspension or immediate deadlines to compel hasty action.
            </p>
          </div>
        )}

        {/* 3. Suspicious URLs */}
        {urlAnalysis?.urls?.length > 0 && (
          <div className="p-6 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-3">
              <span className="text-[11px] uppercase tracking-widest font-mono font-semibold text-neutral-900">
                Extracted Links ({urlAnalysis.total_urls})
              </span>
              <ThreatBadge severity={urlAnalysis.risk_level} />
            </div>

            <div className="space-y-3 font-mono text-xs">
              {urlAnalysis.urls.map((u, idx) => (
                <div key={idx} className="p-3 bg-[#F4F4F0] space-y-1">
                  <div className="flex items-center justify-between font-semibold text-neutral-900 break-all">
                    <span>{u.url}</span>
                    <ThreatBadge severity={u.risk_level} />
                  </div>
                  <div className="text-[11px] text-neutral-500 flex gap-4">
                    <span>Protocol: {u.protocol}</span>
                    <span>Domain: {u.domain}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Attachments */}
        {attachmentAnalysis?.attachments?.length > 0 && (
          <div className="p-6 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-3">
              <span className="text-[11px] uppercase tracking-widest font-mono font-semibold text-neutral-900">
                Attachment Forensics
              </span>
              <ThreatBadge severity={attachmentAnalysis.risk_level} />
            </div>

            <div className="space-y-2 font-mono text-xs">
              {attachmentAnalysis.attachments.map((att, idx) => (
                <div key={idx} className="p-3 bg-[#F4F4F0] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-neutral-900 block">{att.filename}</span>
                    <span className="text-[11px] text-neutral-500">{att.file_type} · {Math.round((att.size_bytes || 0) / 1024)} KB</span>
                  </div>
                  <ThreatBadge severity={att.risk_level} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
