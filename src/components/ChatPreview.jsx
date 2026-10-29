import React from 'react';
import { 
  Smartphone, 
  Phone, 
  Video, 
  MoreVertical, 
  CheckCheck, 
  Smile, 
  Paperclip, 
  Mic
} from 'lucide-react';

function renderWhatsAppFormattedText(text) {
  if (!text) return null;

  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    if (line === '') {
      return <div key={lineIndex} className="h-2" />;
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = line.split(urlRegex);

    return (
      <div key={lineIndex} className="min-h-[1.25em] leading-relaxed break-words text-slate-900">
        {parts.map((part, partIndex) => {
          if (part.match(urlRegex)) {
            return (
              <a
                key={partIndex}
                href={part}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-800 transition-colors font-medium"
              >
                {part}
              </a>
            );
          }

          return parseInlineStyles(part, partIndex);
        })}
      </div>
    );
  });
}

function parseInlineStyles(text, keyPrefix) {
  const formattedRegex = /(\*[^*]+\*|_[^_]+_|~[^~]+~|```[^`]+```)/g;
  const tokens = text.split(formattedRegex);

  return (
    <span key={keyPrefix}>
      {tokens.map((token, idx) => {
        if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
          return <strong key={idx} className="font-bold text-slate-950">{token.slice(1, -1)}</strong>;
        }
        if (token.startsWith('_') && token.endsWith('_') && token.length > 2) {
          return <em key={idx} className="italic text-slate-800">{token.slice(1, -1)}</em>;
        }
        if (token.startsWith('~') && token.endsWith('~') && token.length > 2) {
          return <s key={idx} className="line-through opacity-70">{token.slice(1, -1)}</s>;
        }
        if (token.startsWith('```') && token.endsWith('```') && token.length > 6) {
          return <code key={idx} className="bg-slate-200/80 text-emerald-800 font-mono px-1 rounded text-xs">{token.slice(3, -3)}</code>;
        }
        return token;
      })}
    </span>
  );
}

export default function ChatPreview({ message, currentContact }) {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-5 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/60 transition-all duration-300 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Live WhatsApp Chat Preview
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Realistic mobile phone simulator
            </p>
          </div>
        </div>
      </div>

      {/* Phone Mockup Frame */}
      <div className="flex-1 flex flex-col justify-center items-center py-1">
        <div className="w-full max-w-[320px] bg-slate-900 rounded-[32px] border-[5px] border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[460px] transform hover:scale-[1.01] transition-transform">
          
          {/* Phone Status Bar */}
          <div className="bg-[#008069] text-white/90 px-4 pt-1.5 pb-1 flex items-center justify-between text-[10px] font-mono select-none">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2 rounded-[2px] border border-white/80 relative">
                <div className="absolute inset-0.5 bg-white rounded-[1px] w-3/4"></div>
              </div>
            </div>
          </div>

          {/* WhatsApp Chat Header */}
          <div className="bg-[#008069] text-white px-3 py-2 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                {currentContact ? currentContact.cleaned.slice(-2) : '👤'}
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold truncate max-w-[130px] text-white">
                  {currentContact ? currentContact.formatted : 'Recipient'}
                </div>
                <div className="text-[10px] text-emerald-100 font-medium">online</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-white">
              <Video className="w-3.5 h-3.5 cursor-pointer hover:opacity-80" />
              <Phone className="w-3.5 h-3.5 cursor-pointer hover:opacity-80" />
              <MoreVertical className="w-3.5 h-3.5 cursor-pointer hover:opacity-80" />
            </div>
          </div>

          {/* Chat Background & Message Bubbles */}
          <div className="flex-1 wa-chat-bg p-3 overflow-y-auto flex flex-col justify-end space-y-2">
            
            {/* Date divider */}
            <div className="flex justify-center my-1">
              <span className="bg-white/90 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs border border-slate-200/60 uppercase">
                TODAY
              </span>
            </div>

            {/* Outgoing Message Bubble (Official WhatsApp light green: #d9fdd3) */}
            <div className="self-end max-w-[92%] bg-[#d9fdd3] text-[#111b21] rounded-2xl rounded-tr-none px-3.5 py-2.5 shadow-md relative text-xs border border-emerald-200/50">
              {message ? (
                renderWhatsAppFormattedText(message)
              ) : (
                <span className="italic text-slate-400">
                  Your message text will appear here...
                </span>
              )}

              {/* Timestamp & double blue ticks */}
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500 select-none font-medium">
                <span>{currentTime}</span>
                <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
              </div>
            </div>

          </div>

          {/* Input Bar Mockup */}
          <div className="bg-[#f0f2f5] p-2 flex items-center gap-1.5 border-t border-slate-200">
            <div className="flex items-center gap-1 text-slate-500">
              <Smile className="w-4 h-4 cursor-pointer hover:text-slate-800" />
              <Paperclip className="w-4 h-4 cursor-pointer hover:text-slate-800" />
            </div>
            <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[11px] text-slate-400 select-none truncate border border-slate-200 shadow-2xs">
              Type a message
            </div>
            <div className="w-7 h-7 rounded-full bg-[#00a884] flex items-center justify-center text-white cursor-pointer shadow-xs">
              <Mic className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
