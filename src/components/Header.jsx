import React from 'react';
import { 
  MessageSquare, 
  HelpCircle, 
  Globe, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Zap,
  Bot
} from 'lucide-react';

export default function Header({ 
  countryCode, 
  setCountryCode, 
  delaySeconds, 
  setDelaySeconds,
  isDesktopApp,
  setIsDesktopApp,
  onOpenHelp,
  onOpenAutoMode,
  onOpenDirectBot
}) {
  const commonCountryCodes = [
    { code: '91', label: '🇮🇳 India (+91)' },
    { code: '1', label: '🇺🇸 USA / Canada (+1)' },
    { code: '44', label: '🇬🇧 UK (+44)' },
    { code: '971', label: '🇦🇪 UAE (+971)' },
    { code: '966', label: '🇸🇦 Saudi Arabia (+966)' },
    { code: '61', label: '🇦🇺 Australia (+61)' },
    { code: '65', label: '🇸🇬 Singapore (+65)' },
    { code: '60', label: '🇲🇾 Malaysia (+60)' },
    { code: '49', label: '🇩🇪 Germany (+49)' },
    { code: '33', label: '🇫🇷 France (+33)' },
    { code: '55', label: '🇧🇷 Brazil (+55)' },
    { code: '234', label: '🇳🇬 Nigeria (+234)' },
    { code: '92', label: '🇵🇰 Pakistan (+92)' },
    { code: '880', label: '🇧🇩 Bangladesh (+880)' },
  ];

  return (
    <header className="border-b-2 border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white transform hover:scale-105 transition-transform shrink-0">
              <MessageSquare className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  WhatsApp <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Bulk Sender</span>
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-500 text-white px-3 py-0.5 rounded-full shadow-md shadow-emerald-500/20 uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[3]" /> 100% Free
                </span>
              </div>
              <p className="text-xs text-slate-600 font-bold mt-0.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Zero API Keys Required &bull; Direct WhatsApp Web Queue &bull; Safe Anti-Ban
              </p>
            </div>
          </div>

          {/* Quick Settings Bar with Bold, High-Contrast Colorful Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
            
            {/* 100% Guaranteed Direct Bot Button */}
            <button
              type="button"
              onClick={onOpenDirectBot}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 cursor-pointer text-xs animate-button-glow border-2 border-emerald-300"
              title="100% Guaranteed Direct WhatsApp Engine (Zero Tabs, Real Delivery)"
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>⚡ 100% Direct Send (Zero Tabs)</span>
            </button>

            {/* Country Code Picker */}
            <div className="flex items-center bg-emerald-50/80 border-2 border-emerald-200/90 hover:border-emerald-400 rounded-xl px-3 py-1.5 gap-1.5 shadow-xs transition-all">
              <Globe className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
              <label htmlFor="country-select" className="text-emerald-950 font-black text-xs uppercase">Prefix:</label>
              <select
                id="country-select"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-transparent text-emerald-800 font-extrabold focus:outline-none cursor-pointer text-xs"
              >
                {commonCountryCodes.map((item) => (
                  <option key={item.code} value={item.code} className="bg-white text-slate-900 font-bold">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Delay Interval Setting */}
            <div className="flex items-center bg-amber-50/80 border-2 border-amber-200/90 hover:border-amber-400 rounded-xl px-3 py-1.5 gap-1.5 shadow-xs transition-all">
              <Clock className="w-4 h-4 text-amber-700 stroke-[2.5]" />
              <label htmlFor="delay-select" className="text-amber-950 font-black text-xs uppercase">Delay:</label>
              <select
                id="delay-select"
                value={delaySeconds}
                onChange={(e) => setDelaySeconds(Number(e.target.value))}
                className="bg-transparent text-amber-800 font-extrabold focus:outline-none cursor-pointer text-xs"
              >
                <option value={6} className="bg-white text-slate-900 font-bold">6 Seconds (Fast)</option>
                <option value={8} className="bg-white text-slate-900 font-bold">8 Seconds (Recommended)</option>
                <option value={10} className="bg-white text-slate-900 font-bold">10 Seconds (Safe)</option>
                <option value={15} className="bg-white text-slate-900 font-bold">15 Seconds (Anti-Ban)</option>
              </select>
            </div>

            {/* Web vs App Toggle */}
            <div className="flex items-center bg-slate-100 border-2 border-slate-200 rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setIsDesktopApp(false)}
                className={`px-3 py-1 rounded-lg transition-all font-black text-xs cursor-pointer ${
                  !isDesktopApp 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                Web
              </button>
              <button
                type="button"
                onClick={() => setIsDesktopApp(true)}
                className={`px-3 py-1 rounded-lg transition-all font-black text-xs cursor-pointer ${
                  isDesktopApp 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                App
              </button>
            </div>

            {/* Guide Button */}
            <button
              type="button"
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/25 hover:scale-105 active:scale-95 cursor-pointer text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />
              <span>Guide</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
