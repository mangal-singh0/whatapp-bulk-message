// WhatsApp Bulk Auto-Sender Content Script - Auto-Resolve "Use Here" & Send Edition
console.log('🚀 [WA Auto-Sender] Active on web.whatsapp.com');

let statusWidget = null;

function createStatusWidget() {
  if (statusWidget && document.contains(statusWidget)) return statusWidget;
  statusWidget = document.createElement('div');
  statusWidget.id = 'wa-auto-sender-floating-widget';
  statusWidget.style.cssText = `
    position: fixed;
    top: 14px;
    right: 20px;
    z-index: 99999999;
    background: #0f172a;
    color: #ffffff;
    border: 2px solid #10b981;
    border-radius: 14px;
    padding: 10px 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    font-weight: bold;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 270px;
    pointer-events: none;
    transition: all 0.3s ease;
  `;
  statusWidget.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
      <span style="color:#34d399; font-size:13px; font-weight:800;">⚡ WA Auto-Sender</span>
      <span id="wa-auto-badge" style="background:#059669; font-size:10px; padding:2px 8px; border-radius:99px; font-weight:bold;">INITIALIZING</span>
    </div>
    <div id="wa-auto-msg" style="color:#94a3b8; font-size:11px; font-weight:normal;">Connecting to WhatsApp Web...</div>
  `;
  document.body.appendChild(statusWidget);
  return statusWidget;
}

function updateStatus(title, message, isSuccess = false, isError = false) {
  createStatusWidget();
  const badge = document.getElementById('wa-auto-badge');
  const msg = document.getElementById('wa-auto-msg');

  if (badge && msg) {
    badge.innerText = title;
    msg.innerText = message;
    if (isSuccess) {
      statusWidget.style.borderColor = '#10b981';
      badge.style.background = '#10b981';
    } else if (isError) {
      statusWidget.style.borderColor = '#ef4444';
      badge.style.background = '#ef4444';
    } else {
      statusWidget.style.borderColor = '#3b82f6';
      badge.style.background = '#3b82f6';
    }
  }
}

let isSending = false;
let sentDone = false;

// 1. Automatically resolve "Use Here" conflict if multiple WhatsApp tabs are opened
function resolveMultiTabConflict() {
  const buttons = document.querySelectorAll('button, div[role="button"]');
  for (const b of buttons) {
    const txt = (b.innerText || '').toLowerCase();
    if (txt.includes('use here') || txt.includes('use-here') || txt.includes('yahan use karein')) {
      updateStatus('RESOLVING', 'Clicking "Use Here" to activate WhatsApp...');
      b.click();
      return true;
    }
  }
  return false;
}

// 2. Automatically resolve "Continue to Chat" & "use WhatsApp Web"
function handleLandingPage() {
  const continueBtn = document.querySelector('#action-button, a[href*="whatsapp.com/send"]');
  if (continueBtn) {
    updateStatus('CONNECTING', 'Clicking Continue to chat...');
    continueBtn.click();
  }

  const webLink = document.querySelector('a[href*="web.whatsapp.com"]');
  if (webLink) {
    updateStatus('CONNECTING', 'Clicking use WhatsApp Web...');
    webLink.click();
  }
}

// 3. Find Send Button across all WhatsApp Web DOM structures
function findSendButton() {
  const selectors = [
    'button[aria-label="Send"]',
    'button[data-testid="compose-btn-send"]',
    'button[data-tab="11"]',
    'span[data-icon="send"]',
    'span[data-testid="send"]',
    'span[data-icon="wds-ic-send-filled"]',
    'span[data-icon="wds-ic-send"]'
  ];

  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      const btn = el.closest('button') || el;
      if (!btn.disabled) return btn;
    }
  }

  const footerButtons = document.querySelectorAll('footer button');
  for (const btn of footerButtons) {
    if (btn.querySelector('svg') && !btn.disabled) {
      const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
      if (aria.includes('send') || btn.innerHTML.includes('send') || aria.length === 0) {
        return btn;
      }
    }
  }

  return null;
}

// 4. Click Send and dispatch
function executeSend() {
  if (sentDone || isSending) return;
  isSending = true;

  updateStatus('SENDING 🚀', 'Clicking Send button now...', false, false);

  const sendBtn = findSendButton();
  const inputBox = document.querySelector('footer div[contenteditable="true"]');

  if (sendBtn) {
    try {
      ['mousedown', 'mouseup', 'click'].forEach(eventType => {
        const ev = new MouseEvent(eventType, { bubbles: true, cancelable: true, view: window });
        sendBtn.dispatchEvent(ev);
      });
      console.log('✅ Send Button clicked!');
    } catch (e) {
      console.error('Send error:', e);
    }
  }

  if (inputBox) {
    try {
      inputBox.focus();
      ['keydown', 'keypress', 'keyup'].forEach(eventType => {
        const ev = new KeyboardEvent(eventType, {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        });
        inputBox.dispatchEvent(ev);
      });
      console.log('✅ Enter key dispatched!');
    } catch (e) {
      console.error('Enter error:', e);
    }
  }

  setTimeout(() => {
    sentDone = true;
    isSending = false;
    updateStatus('SENT ✅', 'Message sent successfully! 🚀', true, false);

    try {
      if (window.opener) {
        window.opener.postMessage({ type: 'WA_MESSAGE_SENT', timestamp: Date.now() }, '*');
      }
    } catch (e) {}

    // Auto-close tab after 2.5s if it was an automated popup/tab
    setTimeout(() => {
      if (window.location.search.includes('phone=') && window.location.search.includes('text=')) {
        window.close();
      }
    }, 2500);
  }, 1200);
}

// 5. Main loop
function checkAndAutoSend() {
  if (sentDone) return;

  // Check multi-tab conflict first
  resolveMultiTabConflict();
  handleLandingPage();

  // Check if phone number is invalid
  const errorDialog = document.querySelector('div[data-animate-modal-popup="true"]');
  if (errorDialog && errorDialog.innerText.toLowerCase().includes('invalid')) {
    updateStatus('INVALID ❌', 'Phone number is not registered on WhatsApp!', false, true);
    if (window.opener) {
      window.opener.postMessage({ type: 'WA_MESSAGE_INVALID', timestamp: Date.now() }, '*');
    }
    sentDone = true;
    return;
  }

  // Look for Send Button
  const sendBtn = findSendButton();
  const inputBox = document.querySelector('footer div[contenteditable="true"]');

  if (sendBtn) {
    updateStatus('READY ⚡', 'Send button found! Dispatching message...');
    executeSend();
  } else if (inputBox && inputBox.innerText.trim().length > 0) {
    updateStatus('PRE-FILLED 📝', 'Message ready! Waiting for send button...');
    setTimeout(executeSend, 1200);
  } else if (document.querySelector('footer')) {
    updateStatus('CHAT READY 💬', 'Chat open! Loading message...');
  }
}

createStatusWidget();
const loop = setInterval(checkAndAutoSend, 1000);
const observer = new MutationObserver(checkAndAutoSend);
observer.observe(document.body, { childList: true, subtree: true });
