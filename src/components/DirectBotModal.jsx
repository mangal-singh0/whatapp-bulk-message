import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bot, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  Zap, 
  Loader2, 
  Play, 
  Square, 
  LogOut, 
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Send
} from 'lucide-react';

export default function DirectBotModal({ 
  isOpen, 
  onClose, 
  queue, 
  message, 
  delaySeconds 
}) {
  const [status, setStatus] = useState({
    connected: false,
    qr: null,
    user: null,
    broadcast: { isSending: false, total: 0, sent: 0, failed: 0, current: '', logs: [] }
  });
  const [loading, setLoading] = useState(false);
  const [refreshingQR, setRefreshingQR] = useState(false);
  const [serverError, setServerError] = useState(false);
  const API_BASE = '';

  // Poll status from server every 1.5 seconds
  useEffect(() => {
    if (!isOpen) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/status`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
          setServerError(false);
        } else {
          setServerError(true);
        }
      } catch (err) {
        setServerError(true);
        console.warn('Direct engine server not responding:', err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleForceRefreshQR = async () => {
    setRefreshingQR(true);
    try {
      await fetch(`${API_BASE}/api/refresh-qr`, { method: 'POST' });
    } catch (e) {
      console.warn('QR refresh error', e);
    } finally {
      setTimeout(() => setRefreshingQR(false), 2000);
    }
  };

  if (!isOpen) return null;

  // Start Direct Broadcast
  const handleStartBroadcast = async () => {
    if (!status.connected) {
      alert('Pehle apna phone connect karein (QR code scan karke)!');
      return;
    }
    if (!queue || queue.length === 0) {
      alert('Pehle Step 1 mein contacts add karein!');
      return;
    }
    if (!message || !message.trim()) {
      alert('Pehle Step 2 mein message likhein!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/send-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: queue,
          message,
          delaySeconds
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Broadcast start nahi ho paya');
      }
    } catch (e) {
      alert('Server error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Stop Broadcast
  const handleStopBroadcast = async () => {
    try {
      await fetch(`${API_BASE}/api/stop-broadcast`, { method: 'POST' });
    } catch (e) {}
  };

  // Logout WhatsApp
  const handleLogout = async () => {
    if (window.confirm('WhatsApp session logout karein? Naya QR code aayega.')) {
      try {
        await fetch(`${API_BASE}/api/logout`, { method: 'POST' });
      } catch (e) {}
    }
  };

  const progressPercent = status.broadcast.total > 0 
    ? Math.round((status.broadcast.sent / status.broadcast.total) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border-2 border-emerald-300 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b-2 border-slate-100 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Zap className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900">
                100% Direct WhatsApp Engine (Zero Tabs, Zero Popups)
              </h3>
              <span className="text-[11px] font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                Real Delivery
              </span>
            </div>
            <p className="text-xs text-slate-600 font-bold">
              Seedha WhatsApp server se message send hota hai &bull; Har recipient ke phone par deliver guaranteed!
            </p>
          </div>
        </div>

        {/* STATE 1: NOT CONNECTED -> SHOW QR CODE */}
        {!status.connected ? (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 text-xs font-bold text-amber-950 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 stroke-[2.5] shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-black text-amber-900">
                  Ye Tareeqa 100% Guaranteed Kaam Karta Hai!
                </strong>
                <p className="text-slate-700 mt-0.5">
                  Isme koi browser tab nahi khulega, koi extension nahi chahiye, koi Safari permission nahi chahiye. Bas ek baar apne phone se QR code scan kijiye, fir tool sabhi 50-500 numbers ko apne aap background mein message bhej dega!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-slate-50 border-2 border-slate-200 rounded-3xl">
              {/* QR Code Container */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-56 h-56 bg-white p-3 rounded-2xl border-2 border-emerald-400 shadow-xl flex items-center justify-center shrink-0">
                  {status.qr ? (
                    <img src={status.qr} alt="WhatsApp QR Code" className="w-full h-full object-contain" />
                  ) : serverError ? (
                    <div className="flex flex-col items-center justify-center text-amber-700 gap-2 text-center p-3">
                      <AlertTriangle className="w-8 h-8 text-amber-500 animate-pulse" />
                      <span className="text-xs font-bold">Connecting to WhatsApp Server...</span>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        Agar Render par <strong>Static Site</strong> hai, toh QR bot ke liye <strong>Web Service (node server.js)</strong> chahiye.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2 text-center p-4">
                      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                      <span className="text-xs font-bold text-slate-600">Generating secure QR code...</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleForceRefreshQR}
                  disabled={refreshingQR}
                  className="flex items-center gap-1.5 text-[11px] font-black text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingQR ? 'animate-spin' : ''}`} />
                  <span>{refreshingQR ? 'Naya QR ban raha hai...' : '🔄 Naya QR Code Load Karein'}</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-3 text-xs font-bold text-slate-800">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  📱 Phone Se Scan Karein:
                </h4>
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 font-black">1</span>
                  <span>Apne phone mein **WhatsApp** open karein.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 font-black">2</span>
                  <span><strong>Settings</strong> (iPhone) ya <strong>3-Dots</strong> (Android) ➔ <strong>"Linked Devices"</strong> par click karein.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 font-black">3</span>
                  <span><strong>"Link a Device"</strong> dabakar is QR code ko scan kar lijiye!</span>
                </div>

                <div className="pt-2 text-[11px] text-emerald-700 font-black flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning ke turant baad screen apne aap connect ho jayegi!</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STATE 2: CONNECTED -> SHOW DIRECT BROADCAST CONSOLE */
          <div className="space-y-5">
            {/* Connection Banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                  <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                    WhatsApp 100% Connected!
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-black">
                      ACTIVE SESSION
                    </span>
                  </h4>
                  <p className="text-xs text-emerald-800 font-bold">
                    Connected ID: <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono font-black">{status.user || 'Linked'}</code>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-300 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                title="Disconnect & Scan another number"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Target Contacts Info */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-xs font-bold text-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-slate-500 uppercase font-black text-[10px]">Queue Contacts:</span>
                <div className="text-lg font-black text-slate-900">{queue.length} Contacts Ready</div>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-black text-[10px]">Safety Delay:</span>
                <div className="text-lg font-black text-amber-700 font-mono">{delaySeconds} Seconds / msg</div>
              </div>
            </div>

            {/* Progress Bar (if sending) */}
            {status.broadcast.isSending && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-emerald-400 shadow-xl space-y-2.5">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    Sending to: <span className="font-mono text-white">+{status.broadcast.current}</span>
                  </span>
                  <span className="text-emerald-300">
                    {status.broadcast.sent} / {status.broadcast.total} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Live Logs */}
            {status.broadcast.logs && status.broadcast.logs.length > 0 && (
              <div className="border-2 border-slate-200 rounded-2xl p-3 bg-slate-50 max-h-40 overflow-y-auto">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Live Delivery Log:</h5>
                <div className="space-y-1 font-mono text-xs font-bold">
                  {status.broadcast.logs.slice(0, 10).map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-800 bg-white p-1.5 rounded-lg border border-slate-200">
                      <span>+{log.phone}</span>
                      <span className={log.status === 'sent' ? 'text-emerald-600 font-black' : 'text-rose-600 font-black'}>
                        {log.status === 'sent' ? 'SENT ✅' : 'FAILED ❌'} ({log.time})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {!status.broadcast.isSending ? (
                <button
                  type="button"
                  onClick={handleStartBroadcast}
                  disabled={loading || queue.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/35 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-5 h-5 stroke-[3]" />
                  <span>Start 100% Direct Broadcast Now</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopBroadcast}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-rose-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Square className="w-5 h-5 fill-white" />
                  <span>Stop Broadcast</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

