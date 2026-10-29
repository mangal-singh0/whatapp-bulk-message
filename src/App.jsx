import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import NumbersPanel from './components/NumbersPanel';
import MessageComposer from './components/MessageComposer';
import ChatPreview from './components/ChatPreview';
import QueueDispatcher from './components/QueueDispatcher';
import HelpModal from './components/HelpModal';
import AutoSendModal from './components/AutoSendModal';
import { parseAndValidateNumbers } from './utils/phoneValidator';

export default function App() {
  const [countryCode, setCountryCode] = useState(() => {
    return localStorage.getItem('wa_country_code') || '91';
  });

  const [delaySeconds, setDelaySeconds] = useState(() => {
    const saved = localStorage.getItem('wa_delay_seconds');
    return saved ? Number(saved) : 5;
  });

  const [isDesktopApp, setIsDesktopApp] = useState(() => {
    return localStorage.getItem('wa_is_desktop_app') === 'true';
  });

  const [rawInput, setRawInput] = useState(() => {
    return localStorage.getItem('wa_raw_input') || '';
  });

  const [message, setMessage] = useState(() => {
    return localStorage.getItem('wa_message') || 
`Hello! ✨\n\nWe are reaching out with an exclusive update for you! 📢\n\n👉 Learn more at: https://example.com/promo\n\nFeel free to reply if you have any questions. Thank you! 💬`;
  });

  const [queue, setQueue] = useState(() => {
    try {
      const saved = localStorage.getItem('wa_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('wa_current_index');
    return saved ? Number(saved) : 0;
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('wa_country_code', countryCode);
  }, [countryCode]);

  useEffect(() => {
    localStorage.setItem('wa_delay_seconds', String(delaySeconds));
  }, [delaySeconds]);

  useEffect(() => {
    localStorage.setItem('wa_is_desktop_app', String(isDesktopApp));
  }, [isDesktopApp]);

  useEffect(() => {
    localStorage.setItem('wa_raw_input', rawInput);
  }, [rawInput]);

  useEffect(() => {
    localStorage.setItem('wa_message', message);
  }, [message]);

  useEffect(() => {
    localStorage.setItem('wa_queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('wa_current_index', String(currentIndex));
  }, [currentIndex]);

  const cleanedResult = useMemo(() => {
    return parseAndValidateNumbers(rawInput, countryCode);
  }, [rawInput, countryCode]);

  const handleApplyToQueue = () => {
    if (cleanedResult.validList.length === 0) return;

    const hasSentItems = queue.some(item => item.status === 'sent');
    if (hasSentItems) {
      const confirmOverwrite = window.confirm(
        'You have existing progress in the queue. Do you want to replace the queue with the new validated list of numbers?'
      );
      if (!confirmOverwrite) return;
    }

    setQueue(cleanedResult.validList);
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/25 text-slate-800 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Animated Subtle Colorful Ambient Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-300/25 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-teal-200/20 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Top Navigation & Settings Bar */}
      <Header
        countryCode={countryCode}
        setCountryCode={setCountryCode}
        delaySeconds={delaySeconds}
        setDelaySeconds={setDelaySeconds}
        isDesktopApp={isDesktopApp}
        setIsDesktopApp={setIsDesktopApp}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenAutoMode={() => setIsAutoModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
        
        {/* Row 1: Composer & Inputs & Phone Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column A: Numbers Input & Smart Cleaner */}
          <div className="lg:col-span-4 flex flex-col">
            <NumbersPanel
              rawInput={rawInput}
              setRawInput={setRawInput}
              stats={cleanedResult.stats}
              cleanedResult={cleanedResult}
              onApplyToQueue={handleApplyToQueue}
              defaultCountryCode={countryCode}
              queueCount={queue.length}
            />
          </div>

          {/* Column B: Message Composer Box */}
          <div className="lg:col-span-4 flex flex-col">
            <MessageComposer
              message={message}
              setMessage={setMessage}
            />
          </div>

          {/* Column C: Live WhatsApp Chat Preview */}
          <div className="lg:col-span-4 flex flex-col">
            <ChatPreview
              message={message}
              currentContact={queue[currentIndex] || null}
            />
          </div>

        </div>

        {/* Row 2: Dispatch / Sending Workflow (Smart Queue System) */}
        <div>
          <QueueDispatcher
            queue={queue}
            setQueue={setQueue}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            message={message}
            delaySeconds={delaySeconds}
            isDesktopApp={isDesktopApp}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-4 text-center text-xs text-slate-500 font-medium relative z-10">
        <p>
          WhatsApp Bulk Message Sender &bull; Privacy First (All data remains securely in your browser)
        </p>
      </footer>

      {/* Help & User Guide Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* 100% Fully Automatic Mode Guide Modal */}
      <AutoSendModal
        isOpen={isAutoModalOpen}
        onClose={() => setIsAutoModalOpen(false)}
      />
    </div>
  );
}
