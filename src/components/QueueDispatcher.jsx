import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  SkipForward, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  Clock, 
  Search, 
  ExternalLink, 
  Play, 
  Pause, 
  AlertCircle,
  AlertTriangle,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  Info,
  Loader2
} from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/phoneValidator';
import { exportToCSV } from '../utils/csvExporter';

export default function QueueDispatcher({
  queue,
  setQueue,
  currentIndex,
  setCurrentIndex,
  message,
  delaySeconds,
  isDesktopApp
}) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoSending, setIsAutoSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Refs to avoid stale closures
  const queueRef = useRef(queue);
  queueRef.current = queue;

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const messageRef = useRef(message);
  messageRef.current = message;

  const isDesktopAppRef = useRef(isDesktopApp);
  isDesktopAppRef.current = isDesktopApp;

  const timerRef = useRef(null);

  const total = queue.length;
  const sentCount = queue.filter(q => q.status === 'sent').length;
  const skippedCount = queue.filter(q => q.status === 'skipped').length;
  const pendingCount = queue.filter(q => q.status === 'pending' || q.status === 'sending').length;
  const progressPercent = total > 0 ? Math.round((sentCount / total) * 100) : 0;

  const currentContact = queue[currentIndex] || null;

  const filteredQueue = queue.filter((item) => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.cleaned.toLowerCase().includes(q) ||
        (item.raw && item.raw.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Action: Launch WhatsApp for target index with 100% Guaranteed Non-Blocking Link
  const sendContactByIndex = (index, isFromTimer = false) => {
    const currentQ = queueRef.current;
    if (index < 0 || index >= currentQ.length) return false;
    const contact = currentQ[index];

    let finalMessage = messageRef.current;
    if (finalMessage.includes('{phone}')) {
      finalMessage = finalMessage.replaceAll('{phone}', contact.formatted);
    }

    const url = buildWhatsAppUrl(contact.cleaned, finalMessage, isDesktopAppRef.current);

    // Guaranteed single tab launch: Always reuses 'WASingleTab' so Chrome does not open 10 tabs!
    try {
      const win = window.open(url, 'WASingleTab');
      if (!win) {
        const link = document.createElement('a');
        link.href = url;
        link.target = 'WASingleTab';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      window.open(url, '_blank');
    }

    // Set contact to 'sent'
    const updated = [...currentQ];
    updated[index] = {
      ...updated[index],
      status: 'sent',
      sentAt: new Date().toISOString()
    };
    setQueue(updated);

    // Find next contact to target
    const nextPendingIdx = updated.findIndex((item, i) => i > index && item.status === 'pending');
    if (nextPendingIdx !== -1) {
      setCurrentIndex(nextPendingIdx);
    } else {
      const firstPending = updated.findIndex(item => item.status === 'pending');
      if (firstPending !== -1) {
        setCurrentIndex(firstPending);
      } else {
        setIsAutoSending(false);
      }
    }

    return true;
  };

  // Manual Trigger: "Send Next" Button or Space/Enter
  const handleSendNext = () => {
    let targetIndex = currentIndexRef.current;
    const currentQ = queueRef.current;

    if (!currentQ[targetIndex] || currentQ[targetIndex].status !== 'pending') {
      const firstPending = currentQ.findIndex(item => item.status === 'pending');
      if (firstPending !== -1) {
        targetIndex = firstPending;
      }
    }

    if (targetIndex >= 0 && targetIndex < currentQ.length) {
      sendContactByIndex(targetIndex, false);
    }
  };

  // Skip Current Contact
  const handleSkipCurrent = () => {
    const idx = currentIndexRef.current;
    const currentQ = queueRef.current;
    if (idx < 0 || idx >= currentQ.length) return;

    const updated = [...currentQ];
    updated[idx] = {
      ...updated[idx],
      status: 'skipped'
    };
    setQueue(updated);

    const nextPendingIdx = updated.findIndex((item, i) => i > idx && item.status === 'pending');
    if (nextPendingIdx !== -1) {
      setCurrentIndex(nextPendingIdx);
    } else {
      const firstPending = updated.findIndex(item => item.status === 'pending');
      if (firstPending !== -1) {
        setCurrentIndex(firstPending);
      }
    }
  };

  // Toggle Auto-Timer Mode
  const handleToggleAutoTimer = () => {
    if (isAutoSending) {
      setIsAutoSending(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setCountdown(0);
      return;
    }

    if (pendingCount === 0) {
      alert('Sabhi contacts already sent ya skipped hain! Pehle naye contacts add karein.');
      return;
    }

    let targetIndex = currentIndexRef.current;
    const currentQ = queueRef.current;
    if (!currentQ[targetIndex] || currentQ[targetIndex].status !== 'pending') {
      const firstPending = currentQ.findIndex(item => item.status === 'pending');
      if (firstPending !== -1) {
        targetIndex = firstPending;
      }
    }

    sendContactByIndex(targetIndex, true);
    setIsAutoSending(true);
    setCountdown(delaySeconds);
  };

  // Auto-Timer Loop
  useEffect(() => {
    if (!isAutoSending) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCountdown(0);
      return;
    }

    if (pendingCount === 0) {
      setIsAutoSending(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setCountdown(delaySeconds);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const currentQ = queueRef.current;
          let nextTarget = currentQ.findIndex(item => item.status === 'pending');

          if (nextTarget !== -1) {
            setCurrentIndex(nextTarget);
            sendContactByIndex(nextTarget, true);
          } else {
            setIsAutoSending(false);
          }

          return delaySeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoSending, delaySeconds, pendingCount]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName = e.target.tagName.toLowerCase();
      if (tagName === 'textarea' || tagName === 'input' || e.target.isContentEditable) {
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleSendNext();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleSkipCurrent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateContactStatus = (index, status) => {
    const updated = [...queue];
    updated[index] = {
      ...updated[index],
      status,
      sentAt: status === 'sent' ? new Date().toISOString() : undefined
    };
    setQueue(updated);
  };

  const handleResetQueue = () => {
    if (window.confirm('Reset all contacts back to "Pending" status?')) {
      const reset = queue.map(item => ({
        ...item,
        status: 'pending',
        sentAt: undefined
      }));
      setQueue(reset);
      setCurrentIndex(0);
      setIsAutoSending(false);
    }
  };

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 flex flex-col">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Send className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              3. Dispatch &amp; Smart Queue System
            </h2>
            <p className="text-xs text-slate-600 font-bold">
              1-Click WhatsApp Launcher &bull; Auto Progress &bull; Spacebar/Enter Shortcut
            </p>
          </div>
        </div>

        {/* Global Queue Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetQueue}
            disabled={total === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all text-xs font-black border-2 border-slate-200 shadow-2xs hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Reset all contacts back to Pending"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Reset Queue</span>
          </button>

          <button
            type="button"
            onClick={() => exportToCSV(queue)}
            disabled={total === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-all text-xs font-black shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Export CSV report with timestamps and status"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Bold Counters */}
      <div className="my-5 bg-gradient-to-r from-slate-50 via-emerald-50/40 to-teal-50/50 border-2 border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
              Live Progress:
            </span>
            <span className="text-base font-black text-emerald-700 font-mono">
              Sent: {sentCount} / {total} Contacts ({progressPercent}%)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-black">
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border-2 border-amber-300 px-3 py-1 rounded-xl shadow-xs">
              Pending: {pendingCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border-2 border-emerald-400 px-3 py-1 rounded-xl shadow-xs">
              Sent: {sentCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-800 border-2 border-slate-300 px-3 py-1 rounded-xl shadow-xs">
              Skipped: {skippedCount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-300">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 h-full rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* High-Impact Dispatch Console */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/80 to-cyan-50 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 mb-4 shadow-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          
          {/* Active Contact Showcase */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex flex-col items-center justify-center font-mono shrink-0 shadow-xl shadow-emerald-500/30">
              <span className="text-[10px] text-emerald-200 uppercase font-black">Target</span>
              <span className="text-2xl font-black">
                {currentContact ? `#${currentIndex + 1}` : '--'}
              </span>
            </div>

            <div className="space-y-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-extrabold uppercase">Current Contact:</span>
                {currentContact && (
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase border ${
                    currentContact.status === 'sent'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : currentContact.status === 'skipped'
                      ? 'bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-amber-100 text-amber-900 border-amber-400'
                  }`}>
                    {currentContact.status}
                  </span>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight truncate">
                {currentContact ? currentContact.formatted : 'Queue is Empty'}
              </div>
              <p className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                Press <kbd className="px-2 py-0.5 bg-white border-2 border-slate-300 rounded-md text-emerald-800 font-mono font-black text-xs shadow-2xs">Spacebar</kbd> or <kbd className="px-2 py-0.5 bg-white border-2 border-slate-300 rounded-md text-emerald-800 font-mono font-black text-xs shadow-2xs">Enter</kbd> to launch WhatsApp Web
              </p>
            </div>
          </div>

          {/* Controls: Giant "Send Next", "Skip", & "Auto-Timer" */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            
            {/* Auto Timer Button */}
            <button
              type="button"
              onClick={handleToggleAutoTimer}
              disabled={pendingCount === 0}
              className={`px-5 py-3.5 rounded-2xl border-2 flex items-center gap-2 text-xs font-black transition-all shadow-md cursor-pointer ${
                isAutoSending
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-600 text-white animate-pulse'
                  : 'bg-white hover:bg-amber-50 border-amber-400 text-amber-900'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              title="Automatically countdown and advance contacts with safety interval"
            >
              {isAutoSending ? (
                <>
                  <Pause className="w-4 h-4 stroke-[3]" />
                  <span>Pause Timer ({countdown}s)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-amber-600 stroke-[3]" />
                  <span>Auto-Timer Mode</span>
                </>
              )}
            </button>

            {/* Skip Button */}
            <button
              type="button"
              onClick={handleSkipCurrent}
              disabled={!currentContact || pendingCount === 0}
              className="px-4 py-3.5 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-800 text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Skip this contact and move to next (Press S)"
            >
              <SkipForward className="w-4 h-4 text-slate-600 stroke-[3]" />
              <span>Skip (S)</span>
            </button>

            {/* Giant High-Visibility "Send Next" Button */}
            <button
              type="button"
              onClick={handleSendNext}
              disabled={pendingCount === 0 && !currentContact}
              className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base sm:text-lg flex items-center gap-3 shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-600/60 transition-all transform hover:-translate-y-1 active:translate-y-0 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed animate-button-glow"
              title="Open WhatsApp Web with pre-filled message"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
              <span>Send Next</span>
              <span className="hidden sm:inline-block text-xs bg-white/25 text-white px-2.5 py-1 rounded-lg font-mono font-black border border-white/30">
                ↵ Enter
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* Queue Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 border-2 border-slate-200 rounded-2xl text-xs font-black">
          {[
            { id: 'all', label: `All (${total})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'sent', label: `Sent (${sentCount})` },
            { id: 'skipped', label: `Skipped (${skippedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Contact in Queue */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 stroke-[2.5] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phone number in queue..."
            className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* Queue Table */}
      <div className="border-2 border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="max-h-[340px] overflow-y-auto">
          {filteredQueue.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-bold">
              {total === 0 
                ? 'No contacts in the queue yet. Paste numbers in Step 1 and click "Sync Valid Contacts".'
                : 'No contacts match the current filter or search.'
              }
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-black border-b-2 border-slate-200 sticky top-0 z-10 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4 w-28 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold">
                {filteredQueue.map((item, index) => {
                  const originalIndex = queue.findIndex(q => q.id === item.id);
                  const isCurrent = originalIndex === currentIndex;

                  return (
                    <tr
                      key={item.id || index}
                      className={`transition-colors hover:bg-slate-50 ${
                        isCurrent ? 'bg-emerald-50/90 border-l-4 border-emerald-600' : ''
                      }`}
                    >
                      {/* Row Index */}
                      <td className="py-3 px-4 text-center font-mono text-slate-500 text-xs font-black">
                        {originalIndex + 1}
                      </td>

                      {/* Phone Number */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-slate-900">
                            {item.formatted}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black shadow-xs">
                              ACTIVE TARGET
                            </span>
                          )}
                        </div>
                        {item.sentAt && (
                          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                            Sent at: {new Date(item.sentAt).toLocaleTimeString()}
                          </div>
                        )}
                      </td>

                      {/* Status Tag */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full border ${
                          item.status === 'sent'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-400 shadow-2xs'
                            : item.status === 'skipped'
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-amber-100 text-amber-900 border-amber-400'
                        }`}>
                          {item.status === 'sent' && <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />}
                          {item.status === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
                          <span className="capitalize">{item.status}</span>
                        </span>
                      </td>

                      {/* Row Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentIndex(originalIndex);
                              sendContactByIndex(originalIndex, false);
                            }}
                            className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 hover:border-emerald-600 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                            title="Open WhatsApp Web for this number"
                          >
                            <span>Send</span>
                            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>

                          {item.status !== 'sent' ? (
                            <button
                              type="button"
                              onClick={() => updateContactStatus(originalIndex, 'sent')}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                              title="Mark as Sent manually"
                            >
                              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateContactStatus(originalIndex, 'pending')}
                              className="p-1.5 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                              title="Mark as Pending"
                            >
                              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
