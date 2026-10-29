import React, { useState, useRef } from 'react';
import { 
  Users, 
  CheckCircle, 
  Copy, 
  AlertTriangle, 
  Upload, 
  Trash2, 
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Check
} from 'lucide-react';

export default function NumbersPanel({
  rawInput,
  setRawInput,
  stats,
  cleanedResult,
  onApplyToQueue,
  defaultCountryCode,
  queueCount
}) {
  const [showInvalidDetails, setShowInvalidDetails] = useState(false);
  const fileInputRef = useRef(null);

  const handleLoadSample = (count = 5) => {
    if (count === 5) {
      const sample = [
        "9876543210",               // 10 digit, needs +91
        "919876543211",             // 12 digit with 91
        "+91 98765 43212",          // Formatted with spaces & +
        "(987) 654-3210",           // US formatted or 10 digits
        "09876543213",              // Leading 0
        "9876543210",               // Duplicate of #1
        "12345",                    // Invalid (too short)
      ].join('\n');
      setRawInput(sample);
    } else if (count === 50) {
      const list = [];
      const base = 9812300000;
      for (let i = 0; i < 50; i++) {
        if (i % 5 === 0) list.push(`+91 ${base + i}`);
        else if (i % 7 === 0) list.push(`0${base + i}`);
        else if (i % 11 === 0) list.push(`${base + (i - 1)}`); // duplicate
        else list.push(`${base + i}`);
      }
      setRawInput(list.join('\n'));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setRawInput((prev) => (prev ? `${prev}\n${text}` : text));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const invalidItems = cleanedResult.items.filter(item => !item.isValid);
  const duplicateItems = cleanedResult.items.filter(item => item.isDuplicate);

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b-2 border-slate-100 mb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Users className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              1. Numbers Input Panel
            </h2>
            <p className="text-xs text-slate-600 font-bold">
              Paste or upload mobile numbers
            </p>
          </div>
        </div>

        {/* Quick Action Bold Buttons */}
        <div className="flex items-center gap-2">
          {/* Sample 5 Button */}
          <button
            type="button"
            onClick={() => handleLoadSample(5)}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-black shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 cursor-pointer"
            title="Load 5 sample numbers with duplicates & formatting"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 stroke-[3]" />
            <span>Sample 5</span>
          </button>

          {/* Batch 50 Button */}
          <button
            type="button"
            onClick={() => handleLoadSample(50)}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all hidden sm:flex items-center gap-1 text-xs font-black shadow-md shadow-indigo-500/25 hover:scale-105 active:scale-95 cursor-pointer"
            title="Load 50 sample numbers"
          >
            <span>Batch 50</span>
          </button>
          
          {/* Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.txt"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-black shadow-md shadow-emerald-500/25 hover:scale-105 active:scale-95 cursor-pointer"
            title="Import numbers from .csv or .txt file"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-200 stroke-[3]" />
            <span>Upload</span>
          </button>

          {rawInput && (
            <button
              type="button"
              onClick={() => setRawInput('')}
              className="p-1.5 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl transition-all shadow-xs ml-1 cursor-pointer"
              title="Clear input text"
            >
              <Trash2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Textarea with High-Contrast Border and Background */}
      <div className="relative flex-1 min-h-[170px]">
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder={`Paste contact numbers here...\nExamples:\n9876543210\n+91 98765 43211\n9876543212, 9876543213\n09876543214`}
          className="w-full h-full min-h-[170px] bg-slate-50 border-2 border-slate-300 hover:border-slate-400 rounded-2xl p-4 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all resize-y shadow-inner leading-relaxed"
          spellCheck={false}
        />
        {rawInput.length === 0 && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 gap-1.5 p-6 text-center">
            <span className="text-3xl animate-bounce">📋</span>
            <p className="text-sm font-extrabold text-slate-700">
              Paste 50 to 500 phone numbers here.
            </p>
            <p className="text-xs text-slate-500 font-bold">
              Country prefix <span className="text-emerald-700 font-mono font-black bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">+{defaultCountryCode}</span> is automatically attached.
            </p>
          </div>
        )}
      </div>

      {/* Bold, Highly Visible Live Counter Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        
        {/* Total Pasted */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/60 border-2 border-slate-300 hover:border-blue-400 rounded-2xl p-3 flex items-center justify-between shadow-sm hover:scale-102 transition-transform">
          <div>
            <div className="text-[11px] text-slate-600 uppercase tracking-wider font-black">
              Total
            </div>
            <div className="text-xl font-black text-slate-900">
              {stats.total}
            </div>
          </div>
          <span className="text-xs bg-slate-900 text-white px-2.5 py-1 rounded-xl font-mono font-black shadow-xs">
            {stats.total}
          </span>
        </div>

        {/* Valid Numbers */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-100/50 border-2 border-emerald-400 hover:border-emerald-500 rounded-2xl p-3 flex items-center justify-between shadow-sm hover:scale-102 transition-transform">
          <div>
            <div className="text-[11px] text-emerald-800 uppercase tracking-wider font-black">
              Valid
            </div>
            <div className="text-xl font-black text-emerald-700">
              {stats.valid}
            </div>
          </div>
          <span className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-xl font-mono font-black shadow-md shadow-emerald-600/30">
            {stats.valid}
          </span>
        </div>

        {/* Duplicates Removed */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-100/50 border-2 border-amber-400 hover:border-amber-500 rounded-2xl p-3 flex items-center justify-between shadow-sm hover:scale-102 transition-transform">
          <div>
            <div className="text-[11px] text-amber-800 uppercase tracking-wider font-black">
              Duplicates
            </div>
            <div className="text-xl font-black text-amber-700">
              {stats.duplicates}
            </div>
          </div>
          <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-xl font-mono font-black shadow-md shadow-amber-500/30">
            -{stats.duplicates}
          </span>
        </div>

        {/* Invalid Numbers */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-100/50 border-2 border-rose-400 hover:border-rose-500 rounded-2xl p-3 flex items-center justify-between shadow-sm hover:scale-102 transition-transform">
          <div>
            <div className="text-[11px] text-rose-800 uppercase tracking-wider font-black">
              Invalid
            </div>
            <div className="text-xl font-black text-rose-700">
              {stats.invalid}
            </div>
          </div>
          <span className="text-xs bg-rose-600 text-white px-2.5 py-1 rounded-xl font-mono font-black shadow-md shadow-rose-600/30">
            {stats.invalid}
          </span>
        </div>

      </div>

      {/* Invalid Details Accordion */}
      {(stats.invalid > 0 || stats.duplicates > 0) && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowInvalidDetails(!showInvalidDetails)}
            className="text-xs text-slate-800 hover:text-emerald-700 font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 stroke-[2.5]" />
            <span>
              {showInvalidDetails ? 'Hide' : 'Review'} {stats.invalid} invalid &amp; {stats.duplicates} duplicate numbers
            </span>
          </button>

          {showInvalidDetails && (
            <div className="mt-2 p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs space-y-2.5 max-h-36 overflow-y-auto">
              {stats.invalid > 0 && (
                <div>
                  <span className="text-rose-800 font-black text-xs uppercase">Invalid Entries:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {invalidItems.slice(0, 15).map((item, idx) => (
                      <span key={idx} className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2 py-0.5 rounded-lg text-xs font-mono">
                        {item.raw}
                      </span>
                    ))}
                    {invalidItems.length > 15 && (
                      <span className="text-slate-600 font-bold text-xs">+{invalidItems.length - 15} more</span>
                    )}
                  </div>
                </div>
              )}
              {stats.duplicates > 0 && (
                <div>
                  <span className="text-amber-800 font-black text-xs uppercase">Duplicates Filtered:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {duplicateItems.slice(0, 15).map((item, idx) => (
                      <span key={idx} className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-lg text-xs font-mono">
                        {item.formatted}
                      </span>
                    ))}
                    {duplicateItems.length > 15 && (
                      <span className="text-slate-600 font-bold text-xs">+{duplicateItems.length - 15} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Bold Animated Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onApplyToQueue}
          disabled={stats.valid === 0}
          className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all ${
            stats.valid > 0
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/35 hover:shadow-2xl hover:shadow-emerald-500/45 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 animate-pulse-attention'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300'
          }`}
        >
          <span>Sync {stats.valid} Valid Contacts into Queue</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
        {queueCount > 0 && (
          <p className="text-xs text-center text-slate-700 font-bold mt-2.5 flex items-center justify-center gap-1">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            Currently <span className="text-emerald-700 font-black">{queueCount} contacts</span> loaded in queue.
          </p>
        )}
      </div>

    </div>
  );
}
