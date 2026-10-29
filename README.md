# 💬 WhatsApp Bulk Message Sender (Standalone Software)

An independent, lightweight, and modern web software utility that allows users to broadcast any WhatsApp message to 50 to 500 contacts at once using WhatsApp Web automation/queue, without requiring any paid WhatsApp Business API keys.

---

## 🚀 Key Features

### 1. Numbers Input Panel & Smart Cleaner
- **Multi-Format Ingestion**: Paste mobile numbers separated by commas, spaces, tabs, or line breaks, or import via CSV/TXT files.
- **Smart Cleaner & Validator**:
  - Automatically strips extra spaces, hyphens, brackets, and non-numeric characters.
  - Automatically validates 10-digit mobile numbers and attaches default country code (default: `+91`, configurable to any country prefix).
  - Automatically detects and removes duplicate phone numbers.
  - Flags and displays invalid entries (e.g. less than 10 digits).
- **Live Counter Badges**:
  - 📋 **Total Pasted**
  - ✅ **Valid Numbers**
  - 🔄 **Duplicates Removed**
  - ❌ **Invalid Numbers**

### 2. Message Composer Box & Live WhatsApp Preview
- **Full Formatting Support**:
  - Paragraphs and multi-line breaks (`\n`)
  - Full Emoji palette support (✨, 📢, 📞, 💬, 🔥, 🚀, 🎁, etc.)
  - URL detection and custom links
  - WhatsApp text stylers: `*bold*`, `_italic_`, `~strikethrough~`, and monospace code
- **Live Counters**: Real-time character, word, and line counts.
- **Live WhatsApp Chat Preview**: Realistic mobile phone preview with WhatsApp green bubble, wallpaper, timestamps, and double blue checkmarks (✓✓).

### 3. Dispatch / Sending Workflow (Smart Queue System)
- **Zero API Keys Required**: Uses official WhatsApp Web / WhatsApp Desktop deep link protocol:
  `https://web.whatsapp.com/send?phone=[PHONE_NUMBER]&text=[ENCODED_MESSAGE]`
- **1-Click "Send Next"**: Opens WhatsApp Web with the contact and message pre-filled. You just press Enter inside WhatsApp to dispatch.
- **Keyboard Shortcuts**:
  - <kbd>Spacebar</kbd> or <kbd>Enter</kbd>: Trigger Send Next
  - <kbd>S</kbd>: Skip current contact
- **Auto-Advance & Delay Timer**: Optional configurable delay (3s, 5s, 8s, 10s, 15s) with live countdown to maintain safe human-like sending intervals.
- **Progress Tracking & CSV Export**:
  - Live progress bar: `Sent: 45 / 90 Contacts (50%)`
  - Real-time counters for Pending, Sent, and Skipped contacts
  - **Export CSV**: 1-click download of batch report with phone numbers, timestamps, and status tags.
- **Browser LocalStorage Persistence**: Draft messages, pending queues, and active states persist across browser refreshes.

---

## 🛠️ How to Run Locally

You have **two easy ways** to run this software:

### Option A: Modern React + Vite App (Recommended for development)

1. Open your terminal in this directory:
   ```bash
   cd /Users/anilkumar/Documents/whatapps
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open the displayed local URL in your browser:
   ```
   http://localhost:5173
   ```

To build for production:
```bash
npm run build
```

---

### Option B: Standalone Single HTML File (Zero Installation)

If you want to use the tool immediately without running Node/npm:
1. Simply double-click the file `whatsapp-sender.html` in your file explorer, OR open it in any web browser (Google Chrome, Edge, Safari, Brave, or Firefox).
2. Everything is completely self-contained.

---

## 💡 Quick Dispatch Walkthrough

1. **Step 1**: Paste your contact numbers into **Numbers Input Panel** (or click **Sample 5** / **Batch 50** to test).
2. **Step 2**: Click **"Sync Valid Contacts into Dispatch Queue"**.
3. **Step 3**: Compose your message in the **Message Composer Box** (check the **Live WhatsApp Chat Preview** on the right).
4. **Step 4**: Click **"Send Next"** (or press <kbd>Spacebar</kbd> / <kbd>Enter</kbd>). WhatsApp Web will open with the number and message pre-filled.
5. In WhatsApp Web, hit <kbd>Enter</kbd> to send. Return to the tool and press <kbd>Spacebar</kbd> again for the next contact!
6. Click **"Export CSV"** when finished to download a detailed summary report.

---

## 🔒 Privacy & Security

- **100% Client-Side**: All contacts, messages, and dispatch queues stay strictly inside your local browser. No data is ever transmitted to any third-party server or database.
- **No Third-Party Paid Dependencies**: No WhatsApp Business API keys, Twilio credits, or subscriptions required.

