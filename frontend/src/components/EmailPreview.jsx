import React from 'react';
import { Mail, User, Send, FileText } from 'lucide-react';

export default function EmailPreview({ sender, recipient, subject, body }) {
  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center gap-2">
          <Mail className="w-4 h-4 text-cyan-400" />
          <span>Analyzed Email Payload Header & Body</span>
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
          Raw Inspection
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2 text-slate-400">
          <Send className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-500 uppercase font-bold text-[10px]">From:</span>
          <span className="text-white font-bold">{sender}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <User className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-500 uppercase font-bold text-[10px]">To:</span>
          <span className="text-slate-300">{recipient || 'employee@company.com'}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 border-t border-slate-900 pt-2">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-500 uppercase font-bold text-[10px]">Subject:</span>
          <span className="text-amber-300 font-bold">{subject}</span>
        </div>
      </div>

      <div className="bg-slate-950/90 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
        <span className="text-slate-500 text-[10px] uppercase font-bold block mb-2">Email Body Content:</span>
        {body}
      </div>
    </div>
  );
}
