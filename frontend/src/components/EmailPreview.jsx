import React from 'react';

export default function EmailPreview({ sender, recipient, subject, body }) {
  return (
    <div className="p-6 bg-white space-y-4">
      <div className="border-b border-[#F4F4F0] pb-3">
        <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-400 font-medium block mb-1">
          Raw Email Inspection
        </span>
        <h4 className="text-base font-normal font-serif text-neutral-900">
          Headers & Payload Body
        </h4>
      </div>

      <div className="space-y-2 font-mono text-xs text-neutral-800 bg-[#F4F4F0] p-4">
        <div>
          <span className="text-neutral-400 font-normal uppercase text-[10px] w-16 inline-block">From:</span>
          <span>{sender}</span>
        </div>
        <div>
          <span className="text-neutral-400 font-normal uppercase text-[10px] w-16 inline-block">To:</span>
          <span>{recipient || 'employee@company.com'}</span>
        </div>
        <div>
          <span className="text-neutral-400 font-normal uppercase text-[10px] w-16 inline-block">Subject:</span>
          <span className="font-semibold">{subject || '(No Subject)'}</span>
        </div>
      </div>

      <div className="pt-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
          Email Body Content
        </span>
        <p className="font-mono text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap bg-[#F4F4F0] p-4 max-h-56 overflow-y-auto">
          {body}
        </p>
      </div>
    </div>
  );
}
