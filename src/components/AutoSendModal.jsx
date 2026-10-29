import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Terminal, 
  Puzzle, 
  Copy, 
  Check, 
  Zap, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  FolderOpen
} from 'lucide-react';

export default function AutoSendModal({ isOpen, onClose }) {
  const [copiedExtensionPath, setCopiedExtensionPath] = useState(false);
  const [copiedConsole, setCopiedConsole] = useState(false);
  const [copiedMacCmd, setCopiedMacCmd] = useState(false);

  if (!isOpen) return null;

  const extensionPath = `/Users/anilkumar/Documents/whatapps/chrome-extension`;

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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Bot className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              100% Automatic WhatsApp Sender Setup
            </h3>
            <p className="text-xs text-slate-600 font-bold">
              Bina ek bhi baar Enter dabaye saare contacts ko automatic message kaise bhejein
            </p>
          </div>
        </div>

        {/* METHOD 1: CHROME EXTENSION (100% FOOLPROOF & PERMANENT) */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-400 rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-emerald-600 text-white px-3 py-1 rounded-full shadow-xs">
              <Puzzle className="w-4 h-4 stroke-[2.5]" /> Sabse Aasan Tareeqa: 1-Click Chrome Extension
            </span>
            <span className="text-xs text-emerald-800 font-black bg-emerald-200/80 px-2 py-0.5 rounded-md border border-emerald-300">
              100% Automatic
            </span>
          </div>

          <p className="text-xs text-slate-700 font-bold mb-3 leading-relaxed">
            Humne aapke project mein ek **Chrome Extension** bana di hai. Ise Chrome mein add karne ke baad aapko <strong>ek baar bhi click ya Enter nahi dabana padega</strong> — har contact ko message apne aap send ho jayega!
          </p>

          {/* Step by step guide */}
          <div className="bg-white border-2 border-emerald-200 rounded-xl p-3.5 space-y-2 text-xs font-bold text-slate-800">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] shrink-0 font-black">1</span>
              <span>Google Chrome mein naya tab kholkar type karein: <code className="bg-slate-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-black border border-slate-300">chrome://extensions</code></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] shrink-0 font-black">2</span>
              <span>Right-top corner mein <strong>"Developer mode"</strong> ka toggle ON kijiye.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] shrink-0 font-black">3</span>
              <span>Top-left corner mein <strong>"Load unpacked"</strong> button dabayein aur ye folder select karein:</span>
            </div>

            {/* Folder Path Box with Copy Button */}
            <div className="flex items-center justify-between bg-slate-900 text-emerald-400 p-2.5 rounded-xl font-mono text-xs border border-slate-700 mt-1">
              <span className="truncate">{extensionPath}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(extensionPath, setCopiedExtensionPath)}
                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                title="Copy Folder Path"
              >
                {copiedExtensionPath ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* METHOD 2: DEVTOOLS CONSOLE SCRIPT */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-slate-800 text-white px-3 py-1 rounded-full shadow-xs mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 stroke-[3]" /> Tareeqa 2: WhatsApp Web Console Script
          </span>

          <p className="text-xs text-slate-700 font-bold mb-3">
            Agar extension install nahi karni, toh WhatsApp Web tab mein Console kholiye. Pehle <code className="bg-white border px-1 rounded font-bold">allow pasting</code> likhkar Enter dabayein, fir ye code paste karke Enter dabayein:
          </p>

          <div className="relative bg-slate-900 rounded-xl p-3 border border-slate-700 text-emerald-400 font-mono text-xs overflow-x-auto mb-2">
            <pre className="text-[11px] whitespace-pre-wrap">{consoleCode}</pre>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(consoleCode, setCopiedConsole)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedConsole ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
            <span>{copiedConsole ? 'Copied to Clipboard!' : 'Copy Console Script'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t-2 border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
          >
            Samajh Gaya, Start Karein!
          </button>
        </div>

      </div>
    </div>
  );
}
