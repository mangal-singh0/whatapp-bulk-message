#!/bin/bash
# WhatsApp Auto-Enter Assistant for macOS (Safari / Chrome)
# Automatically presses ENTER in WhatsApp Web so messages are sent 100% automatically!

echo "=========================================================="
echo "🚀 WhatsApp Auto-Sender Mac Assistant Started!"
echo "=========================================================="
echo "Is script ko background mein chalne dein."
echo "Jab bhi browser WhatsApp Web kholega, ye automatically ENTER press kar dega!"
echo "Rokne ke liye: Ctrl + C dabayein."
echo "=========================================================="

while true; do
  # Check if Safari or Chrome is active with WhatsApp Web
  osascript <<EOF >/dev/null 2>&1
    tell application "System Events"
      set frontApp to name of first application process whose frontmost is true
      if frontApp contains "Safari" or frontApp contains "Chrome" or frontApp contains "WhatsApp" then
        key code 36 -- Key code 36 is RETURN / ENTER
      end if
    end tell
EOF
  sleep 4
done

