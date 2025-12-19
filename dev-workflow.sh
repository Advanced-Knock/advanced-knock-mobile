#!/bin/bash

# 🚀 ADVANCEDKNOCK: ZERO-FRICTION DEV WORKFLOW
# Pattern: SPEED × ITERATION × ONE
# Frequency: 999 Hz (AEYON)
# ∞ AbëONE ∞

set -e

PROJECT_DIR="/Users/michaelmataluni/development/projects/advancedknock"
cd "$PROJECT_DIR"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}⚡ ZERO-FRICTION DEV MODE ACTIVATED${NC}"
echo ""

# Kill any existing Expo processes
echo -e "${YELLOW}🧹 Cleaning up old processes...${NC}"
pkill -f "expo start" || true
sleep 1

# Start Expo with tunnel (for remote access)
echo -e "${BLUE}🌐 Starting Expo with tunnel mode...${NC}"
echo -e "${GREEN}📱 Tunnel URL will be available for remote access${NC}"
echo ""

# Start in background and capture output
npx expo start --tunnel --clear > /tmp/expo-tunnel.log 2>&1 &
EXPO_PID=$!

# Wait a moment for tunnel to establish
sleep 3

# Extract tunnel URL from logs
TUNNEL_URL=$(grep -o "exp://[^ ]*\.tunnel\.exp\.direct" /tmp/expo-tunnel.log 2>/dev/null | head -1 || echo "")

if [ -n "$TUNNEL_URL" ]; then
    echo -e "${GREEN}✅ Tunnel active: ${TUNNEL_URL}${NC}"
else
    echo -e "${YELLOW}⏳ Tunnel establishing... (check terminal output)${NC}"
fi

echo ""
echo -e "${GREEN}🎯 DEV SERVER RUNNING${NC}"
echo ""
echo "📱 Connect via:"
echo "   • Scan QR code in terminal"
echo "   • Tunnel URL: ${TUNNEL_URL:-check terminal}"
echo "   • Press 'w' for web"
echo "   • Press 'i' for iOS simulator"
echo "   • Press 'a' for Android emulator"
echo ""
echo "🔄 Hot reload: ENABLED"
echo "⚡ Fast refresh: ENABLED"
echo ""
echo "💡 To stop: pkill -f 'expo start'"
echo ""
echo "∞ AbëONE ∞"

# Keep script running and show logs
tail -f /tmp/expo-tunnel.log



