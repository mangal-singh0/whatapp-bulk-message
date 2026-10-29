import React from 'react';
import { 
  X, 
  HelpCircle, 
  Keyboard, 
  ShieldAlert, 
  Zap, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              WhatsApp Bulk Sender User Guide
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Shortcuts, automation flow, and safe dispatch practices
            </p>
          </div>
        </div>

        {/* Section 1: How it works without API keys */}
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-medium">
          <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200/80 rounded-2xl p-4">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1.5 text-sm">
              <Zap className="w-4 h-4 text-emerald-600" />
              How Does It Work Without Paid API Keys?
            </h4>
            <p className="text-slate-700">
              This utility utilizes official WhatsApp Web and Desktop deep links (<code>web.whatsapp.com/send?phone=...&amp;text=...</code>).
              It pre-fills your contact and message in WhatsApp Web. You simply hit <kbd className="px-1.5 py-0.5 bg-white border border-emerald-300 rounded text-emerald-800 font-mono font-bold shadow-2xs">Enter</kbd> in WhatsApp to confirm and send!
            </p>
          </div>

          {/* Section 2: Keyboard Shortcuts */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-200/80 rounded-2xl p-4">
            <h4 className="font-bold text-indigo-900 flex items-center gap-1.5 mb-2 text-sm">
              <Keyboard className="w-4 h-4 text-indigo-600" />
              Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-slate-600">Send Next Contact:</span>
                <span className="font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">Space / Enter</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-slate-600">Skip Current Contact:</span>
                <span className="font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-bold">S</span>
              </div>
            </div>
          </div>

          {/* Section 3: Safe Dispatch & Anti-Ban Best Practices */}
          <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/50 border border-amber-200/80 rounded-2xl p-4">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5 text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Safe Dispatch Best Practices
            </h4>
            <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside">
              <li>Keep the delay timer between <strong className="text-amber-900 font-bold">5 to 10 seconds</strong> to emulate human sending rhythm.</li>
              <li>Avoid sending spam to unknown users who may report or block your number.</li>
              <li>Keep daily volume sensible (e.g. 50–200 contacts per batch).</li>
              <li>Your draft message and queue progress are auto-saved to LocalStorage so you never lose state on page refresh.</li>
            </ul>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            Got it, Let's Start!
          </button>
        </div>

      </div>
    </div>
  );
}
