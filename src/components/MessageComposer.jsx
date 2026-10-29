import React from 'react';
import { 
  FileText, 
  Smile, 
  Bold, 
  Italic, 
  Strikethrough, 
  Sparkles, 
  RotateCcw,
  Hash,
  Check
} from 'lucide-react';

export default function MessageComposer({
  message,
  setMessage
}) {
  const quickEmojis = ['✨', '📢', '🔥', '📞', '💬', '👋', '🚀', '🎁', '✅', '⚠️', '🕒', '📍', '🛒', '🏷️', '💡', '🎉'];

  const templates = [
    {
      title: '📢 Promo',
      color: 'from-emerald-600 to-teal-600 shadow-emerald-500/25',
      text: `Hello! ✨\n\nWe are excited to share our exclusive special discount with you today! 🎁\n\n👉 Get 30% OFF on all packages.\nVisit: https://example.com/special-deal\n\nFeel free to reply directly here! 💬\nHave a wonderful day! 🌟`
    },
    {
      title: '🕒 Reminder',
      color: 'from-blue-600 to-indigo-600 shadow-blue-500/25',
      text: `Hi there! 👋\n\nThis is a quick reminder regarding our scheduled catch-up today at 4:00 PM. 📅\n\nJoin link: https://meet.google.com/xyz-abc\n\nPlease let us know if you need to reschedule. Thank you! 🙏`
    },
    {
      title: '📦 Order',
      color: 'from-purple-600 to-pink-600 shadow-purple-500/25',
      text: `Dear Customer, 🛍️\n\nYour order has been confirmed and is currently being packed with care! 🚚\n\nTracking info will be sent shortly.\nThank you for choosing us! ✨`
    }
  ];

  const charCount = message.length;
  const wordCount = message.trim().length > 0 ? message.trim().split(/\s+/).length : 0;
  const lineCount = message ? message.split('\n').length : 0;

  const insertEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
  };

  const applyFormatting = (prefix, suffix = prefix) => {
    setMessage((prev) => {
      if (!prev) return `${prefix}text${suffix}`;
      return `${prev} ${prefix}highlighted${suffix}`;
    });
  };

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b-2 border-slate-100 mb-3 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <FileText className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              2. Message Composer Box
            </h2>
            <p className="text-xs text-slate-600 font-bold">
              Compose custom broadcasts with emojis &amp; links
            </p>
          </div>
        </div>

        {/* Colorful Template Buttons */}
        <div className="flex items-center gap-1.5">
          {templates.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setMessage(tpl.text)}
              className={`text-xs font-black bg-gradient-to-r ${tpl.color} text-white px-2.5 py-1.5 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer`}
              title={`Load ${tpl.title} template`}
            >
              {tpl.title}
            </button>
          ))}
          {message && (
            <button
              type="button"
              onClick={() => setMessage('')}
              className="p-1.5 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl transition-all shadow-xs ml-0.5 cursor-pointer"
              title="Clear message"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Formatting & Emoji Toolbar with High Visibility */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 p-2 bg-slate-100 border-2 border-slate-200 rounded-2xl">
        {/* Style Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => applyFormatting('*')}
            className="p-2 bg-white hover:bg-emerald-600 hover:text-white text-slate-800 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer border border-slate-200"
            title="Bold (*text*)"
          >
            <Bold className="w-4 h-4 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('_')}
            className="p-2 bg-white hover:bg-emerald-600 hover:text-white text-slate-800 rounded-xl text-xs italic transition-all shadow-xs cursor-pointer border border-slate-200"
            title="Italic (_text_)"
          >
            <Italic className="w-4 h-4 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('~')}
            className="p-2 bg-white hover:bg-emerald-600 hover:text-white text-slate-800 rounded-xl text-xs line-through transition-all shadow-xs cursor-pointer border border-slate-200"
            title="Strikethrough (~text~)"
          >
            <Strikethrough className="w-4 h-4 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('```')}
            className="p-2 bg-white hover:bg-emerald-600 hover:text-white text-slate-800 rounded-xl text-xs font-mono transition-all shadow-xs cursor-pointer border border-slate-200"
            title="Monospace (```code```)"
          >
            <Hash className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Emoji Bar with High-Visibility Touch Target */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {quickEmojis.map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="text-lg hover:scale-135 transition-transform px-1.5 py-0.5 hover:bg-white rounded-xl cursor-pointer"
              title={`Insert ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative flex-1 min-h-[170px]">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here... You can use paragraphs, emojis, custom links, and WhatsApp formatting like *bold*, _italics_, and ~strikethrough~."
          className="w-full h-full min-h-[170px] bg-slate-50 border-2 border-slate-300 hover:border-slate-400 rounded-2xl p-4 text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all resize-y leading-relaxed shadow-inner"
          spellCheck={false}
        />
      </div>

      {/* Live Counter Indicators with Bold Colorful Badges */}
      <div className="flex flex-wrap items-center justify-between mt-3 pt-3 text-xs text-slate-700 border-t-2 border-slate-100 font-extrabold gap-2">
        <div className="flex items-center gap-3">
          <span className="bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
            Characters: <strong className="text-emerald-700 font-mono font-black">{charCount}</strong>
          </span>
          <span className="bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
            Words: <strong className="text-slate-900 font-mono font-black">{wordCount}</strong>
          </span>
          <span className="bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
            Lines: <strong className="text-slate-900 font-mono font-black">{lineCount}</strong>
          </span>
        </div>
        <div className="text-xs text-emerald-800 font-black bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 shadow-2xs">
          WhatsApp Formatted
        </div>
      </div>

    </div>
  );
}
