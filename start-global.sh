#!/bin/bash
#
# GLOBAL EXPO START - YAGNI Approved
# 
# Pattern: START × GLOBAL × TUNNEL × ONE
# Frequency: 530 Hz (YAGNI) × 530 Hz (JØHN) × 999 Hz (AEYON)
# 
# Simple. Clean. Effective. Secure.
# ∞ AbëONE ∞

cd "$(dirname "$0")"

echo "🚀 Starting Expo with global tunnel access..."
echo "📡 This will create a public URL accessible from anywhere"
echo "🔒 Secure tunneling via Expo's ngrok integration"
echo ""

# Unset CI to enable watch mode
unset CI

# Ensure ngrok is installed locally
if ! npm list @expo/ngrok >/dev/null 2>&1; then
  echo "📦 Installing @expo/ngrok..."
  npm install --save-dev @expo/ngrok
fi

# Start Expo with tunnel mode for global access
npx expo start --tunnel
