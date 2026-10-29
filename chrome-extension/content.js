// WhatsApp Bulk Auto-Sender Content Script
// Automatically detects pre-filled message and clicks Send!

console.log('🚀 WhatsApp Bulk Auto-Sender Extension Loaded!');

// Create a visual indicator badge on WhatsApp Web
function showBanner(text, color = '#10b981') {
  let banner = document.getElementById('wa-auto-sender-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'wa-auto-sender-banner';
    banner.style.position = 'fixed';
    banner.style.top = '12px';
    banner.style.right = '20px';
    banner.style.zIndex = '999999';
    banner.style.padding = '8px 16px';
    banner.style.borderRadius = '12px';
    banner.style.color = '#ffffff';
    banner.style.fontWeight = 'bold';
    banner.style.fontSize = '13px';
    banner.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    banner.style.fontFamily = 'system-ui, sans-serif';
    banner.style.transition = 'all 0.3s ease';
    document.body.appendChild(banner);
  }
  banner.style.backgroundColor = color;
  banner.innerText = text;
}

let hasSent = false;

function attemptAutoSend() {
  if (hasSent) return;

  // Check if we are on a send URL or chat is active
  const sendBtnIcon = document.querySelector('span[data-icon="send"], span[data-testid="send"]');
  const sendBtn = sendBtnIcon ? (sendBtnIcon.closest('button') || sendBtnIcon) : document.querySelector('button[aria-label="Send"]');

  const inputBox = document.querySelector('footer div[contenteditable="true"]');

  if (sendBtn && !sendBtn.disabled) {
    showBanner('⏳ Auto-Sender: Sending message in 1s...', '#f59e0b');

    setTimeout(() => {
      if (hasSent) return;
      hasSent = true;

      // Method 1: Click the Send Button
      sendBtn.click();
      console.log('✅ Clicked WhatsApp Send Button!');

      // Method 2: Simulate Enter Keypress on Input Box
      if (inputBox) {
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        });
        inputBox.dispatchEvent(enterEvent);
      }

      showBanner('✅ Message Sent Automatically!', '#10b981');

      // Auto close tab after 2 seconds if opened via deep link
      if (window.location.search.includes('phone=') && window.location.search.includes('text=')) {
        setTimeout(() => {
          showBanner('⚡ Done! Returning to batch...', '#06b6d4');
        }, 1500);
      }
    }, 1000);
  }
}

// Polling interval to detect when WhatsApp Web finishes loading the chat
const checkInterval = setInterval(() => {
  if (hasSent) {
    clearInterval(checkInterval);
    return;
  }
  attemptAutoSend();
}, 800);

// Also watch for DOM changes
const observer = new MutationObserver(() => {
  attemptAutoSend();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

showBanner('⚡ WhatsApp Auto-Sender Ready', '#0284c7');
