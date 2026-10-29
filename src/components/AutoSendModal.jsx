import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Terminal, 
  Bookmark, 
  Copy, 
  Check, 
  Zap, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export default function AutoSendModal({ isOpen, onClose }) {
  const [copiedConsole, setCopiedConsole] = useState(false);
  const [copiedMacCmd, setCopiedMacCmd] = useState(false);

  if (!isOpen) return null;

  // Clean JS for DevTools Console (without javascript: prefix)
  const consoleCode = `setInterval(() => {
  const btn = document.querySelector('button[aria-label="Send"], span[data-icon="send"]');
  if (btn) {
    const actualBtn = btn.closest('button') || btn;
    if (!actualBtn.disabled) {
      actualBtn.click();
      console.log('✅ Auto-Sent message!');
    }
  }
}, 1000);
alert('🚀 WhatsApp Auto-Clicker ACTIVATED! Ab saare message apne aap 1 second mein send ho jayenge!');`;

  const macCmd = `cd /Users/anilkumar/Documents/whatapps && ./auto-send-mac.sh`;

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-100 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Bot className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              100% Fully Automatic Mode (Zero Clicks)
            </h3>
            <p className="text-xs text-slate-600 font-bold">
              Bina ek bhi baar Enter dabaye saare 50–500 messages apne aap kaise bhejein
            </p>
          </div>
        </div>

        {/* Chrome "allow pasting" Solution Box */}
        <div className="mb-5 bg-blue-50 border-2 border-blue-400 rounded-2xl p-4 text-xs font-bold text-blue-950 flex items-start gap-3 shadow-xs">
          <Lightbulb className="w-5 h-5 text-blue-600 stroke-[2.5] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-black text-blue-900">
              💡 Chrome Console Warning Solution:
            </p>
            <p className="text-slate-700">
              Agar Chrome Console mein paste nahi ho raha hai, toh Console mein pehle <code className="bg-blue-200/80 text-blue-900 px-1.5 py-0.5 rounded font-mono font-bold">allow pasting</code> likhkar <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded font-mono">Enter</kbd> dabayein! Uske baad paste allow ho jayega.
            </p>
          </div>
        </div>

        {/* Option 1: WhatsApp Web Auto-Clicker Code */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-emerald-600 text-white px-3 py-1 rounded-full shadow-xs">
                <Bookmark className="w-3.5 h-3.5 stroke-[3]" /> Option 1: WhatsApp Web Console Script (Recommended)
              </span>
              <span className="text-xs text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                100% Automatic
              </span>
            </div>

            <p className="text-xs text-slate-700 font-bold mb-3">
              1. WhatsApp Web tab par Console kholiye. Agar pehli baar hai, toh <code className="bg-white px-1 border rounded">allow pasting</code> likhkar Enter dabayein.<br/>
              2. Niche diya gaya code copy karke Paste karein aur Enter dabayein!
            </p>

            {/* Code Box */}
            <div className="relative bg-slate-900 rounded-xl p-3 border border-slate-700 text-emerald-400 font-mono text-xs overflow-x-auto">
              <pre className="text-[11px] whitespace-pre-wrap">{consoleCode}</pre>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(consoleCode, setCopiedConsole)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedConsole ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                <span>{copiedConsole ? 'Copied to Clipboard!' : 'Copy Console Code'}</span>
              </button>
              <span className="text-[11px] text-slate-500 font-bold">
                WhatsApp tab kholkar <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-[10px]">Inspect &gt; Console</kbd> mein Paste karein!
              </span>
            </div>
          </div>

          {/* Option 2: Mac Assistant Script */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 shadow-xs">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-indigo-600 text-white px-3 py-1 rounded-full shadow-xs mb-2">
              <Terminal className="w-3.5 h-3.5 stroke-[3]" /> Option 2: Mac Terminal Assistant (Console ki bhi zaroorat nahi)
            </span>

            <p className="text-xs text-slate-700 font-bold mb-3">
              Mac ke Terminal mein ye command chala dein. Ye background mein automatically Enter press karta rahega:
            </p>

            <div className="flex items-center justify-between bg-slate-900 text-cyan-300 p-3 rounded-xl font-mono text-xs border border-slate-700">
              <code>{macCmd}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(macCmd, setCopiedMacCmd)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                title="Copy Terminal Command"
              >
                {copiedMacCmd ? <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
          >
            Samajh Gaya, Start Karein!
          </button>
        </div>

      </div>
    </div>
  );
}
