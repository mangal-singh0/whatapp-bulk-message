import express from 'express';
import cors from 'cors';
import QRCode from 'qrcode';
import pino from 'pino';
import { 
  makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  fetchLatestBaileysVersion,
  Browsers
} from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const authFolder = path.join(__dirname, 'baileys_auth_info');

let sock = null;
let currentQR = null;
let isConnected = false;
let connectedUser = null;
let broadcastProgress = {
  isSending: false,
  total: 0,
  sent: 0,
  failed: 0,
  current: '',
  logs: []
};

let isConnecting = false;

// Initialize Baileys Connection
async function connectToWhatsApp() {
  if (isConnecting) return;
  isConnecting = true;

  try {
    if (!fs.existsSync(authFolder)) {
      fs.mkdirSync(authFolder, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const { version } = await fetchLatestBaileysVersion();

    if (sock) {
      try {
        sock.ev.removeAllListeners();
        sock.end();
      } catch (e) {}
    }

    sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: Browsers.macOS('Desktop'),
      syncFullHistory: false
    });

    sock.ev.on('creds.update', async () => {
      try {
        await saveCreds();
      } catch (err) {
        console.warn('Silent creds save warning:', err.message);
      }
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        currentQR = await QRCode.toDataURL(qr);
        console.log('⚡ New WhatsApp QR Code generated! Scan it with WhatsApp > Linked Devices.');
      }

      if (connection === 'close') {
        isConnected = false;
        connectedUser = null;
        currentQR = null;
        isConnecting = false;
        const statusCode = (lastDisconnect?.error)?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut;
        const isConflict = statusCode === 440 || (lastDisconnect?.error)?.data?.tag === 'conflict';
        
        console.log(`⚠️ Connection closed (statusCode: ${statusCode}, isConflict: ${isConflict}, isLoggedOut: ${isLoggedOut})`);

        if (isLoggedOut || isConflict) {
          console.log('🔄 Session reset required (Conflict or Logged out). Cleaning auth cache for fresh QR...');
          try {
            if (sock) {
              sock.ev.removeAllListeners();
              sock.end();
            }
          } catch (e) {}
          try {
            fs.rmSync(authFolder, { recursive: true, force: true });
          } catch (e) {}
          setTimeout(connectToWhatsApp, 1500);
        } else {
          console.log('Reconnecting in 2 seconds...');
          setTimeout(connectToWhatsApp, 2000);
        }
      } else if (connection === 'open') {
        isConnected = true;
        currentQR = null;
        isConnecting = false;
        connectedUser = sock.user?.id || 'Connected';
        console.log('🎉 100% CONNECTED TO WHATSAPP SERVER SUCCESSFULLY!');
      }
    });
  } catch (err) {
    console.error('Error in connectToWhatsApp:', err.message);
    isConnecting = false;
    setTimeout(connectToWhatsApp, 3000);
  }
}

// Start connection
connectToWhatsApp();

// API: Status & QR
app.get('/api/status', (req, res) => {
  res.json({
    connected: isConnected,
    qr: isConnected ? null : currentQR,
    user: connectedUser,
    broadcast: broadcastProgress
  });
});

// API: Force Refresh / New QR Code
app.post('/api/refresh-qr', async (req, res) => {
  try {
    console.log('🔄 User requested instant QR refresh...');
    if (sock) {
      try { sock.end(); } catch (e) {}
    }
    fs.rmSync(authFolder, { recursive: true, force: true });
    isConnected = false;
    currentQR = null;
    connectedUser = null;
    await connectToWhatsApp();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Send Real WhatsApp Message directly via WhatsApp Server
app.post('/api/send-batch', async (req, res) => {
  const { contacts, message, delaySeconds = 4 } = req.body;

  if (!isConnected || !sock) {
    return res.status(400).json({ error: 'WhatsApp is not connected! Scan the QR code first.' });
  }

  if (!contacts || !contacts.length) {
    return res.status(400).json({ error: 'No contacts provided.' });
  }

  if (broadcastProgress.isSending) {
    return res.status(400).json({ error: 'A broadcast is already in progress!' });
  }

  broadcastProgress = {
    isSending: true,
    total: contacts.length,
    sent: 0,
    failed: 0,
    current: '',
    logs: []
  };

  res.json({ success: true, message: 'Broadcast started in background!' });

  // Process in background asynchronously
  (async () => {
    for (let i = 0; i < contacts.length; i++) {
      if (!broadcastProgress.isSending) break; // cancelled

      const item = contacts[i];
      const rawDigits = (item.cleaned || item.raw || item || '').replace(/\D/g, '');
      const jid = `${rawDigits}@s.whatsapp.net`;

      broadcastProgress.current = rawDigits;

      try {
        // Send message directly to WhatsApp servers
        await sock.sendMessage(jid, { text: message });

        broadcastProgress.sent++;
        broadcastProgress.logs.unshift({
          phone: rawDigits,
          status: 'sent',
          time: new Date().toLocaleTimeString()
        });
        console.log(`[${i + 1}/${contacts.length}] Sent to +${rawDigits} ✅`);
      } catch (err) {
        console.error(`Error sending to +${rawDigits}:`, err?.message || err);
        broadcastProgress.failed++;
        broadcastProgress.logs.unshift({
          phone: rawDigits,
          status: 'failed',
          error: err?.message || 'Failed',
          time: new Date().toLocaleTimeString()
        });
      }

      // Safe Delay interval between messages
      if (i < contacts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
      }
    }

    broadcastProgress.isSending = false;
    broadcastProgress.current = '';
    console.log(`🎉 Broadcast finished! Sent: ${broadcastProgress.sent}, Failed: ${broadcastProgress.failed}`);
  })();
});

// API: Stop Broadcast
app.post('/api/stop-broadcast', (req, res) => {
  broadcastProgress.isSending = false;
  res.json({ success: true });
});

// API: Disconnect / Logout
app.post('/api/logout', async (req, res) => {
  try {
    if (sock) {
      await sock.logout();
    }
    fs.rmSync(authFolder, { recursive: true, force: true });
    isConnected = false;
    currentQR = null;
    connectedUser = null;
    setTimeout(connectToWhatsApp, 2000);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Serve Vite Built Frontend
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 WhatsApp Direct Engine Server running on http://localhost:${PORT}`);
});

