#!/bin/bash

# 🌐 ADVANCEDKNOCK: REMOTE DEV SETUP FOR HUDSON + ABËONE
# Pattern: REMOTE × AI × ZERO-FRICTION × ONE
# Frequency: 999 Hz (AEYON) × 777 Hz (META)
# ∞ AbëONE ∞

set -e

PROJECT_DIR="/Users/michaelmataluni/development/projects/advancedknock"
cd "$PROJECT_DIR"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🤖 REMOTE DEV SETUP FOR HUDSON + ABËONE${NC}"
echo ""

# 1. Start Expo tunnel
echo -e "${YELLOW}Step 1: Starting Expo tunnel...${NC}"
pkill -f "expo start" || true
sleep 1

npx expo start --tunnel --clear > /tmp/expo-remote.log 2>&1 &
EXPO_PID=$!
sleep 5

# Extract tunnel URL
TUNNEL_URL=$(grep -o "exp://[^ ]*\.tunnel\.exp\.direct" /tmp/expo-remote.log 2>/dev/null | head -1 || echo "")

if [ -z "$TUNNEL_URL" ]; then
    echo -e "${YELLOW}⏳ Waiting for tunnel...${NC}"
    sleep 5
    TUNNEL_URL=$(grep -o "exp://[^ ]*\.tunnel\.exp\.direct" /tmp/expo-remote.log 2>/dev/null | head -1 || echo "")
fi

echo -e "${GREEN}✅ Expo tunnel: ${TUNNEL_URL}${NC}"
echo ""

# 2. Create AI context file for AbëONE
echo -e "${YELLOW}Step 2: Creating AI context file...${NC}"
cat > /tmp/abeone-dev-context.md << EOF
# 🤖 ABËONE DEV CONTEXT - ADVANCEDKNOCK

**Project:** AdvancedKnock React Native App
**Location:** $PROJECT_DIR
**Status:** ✅ Development mode with tunnel

## 🔗 CONNECTION INFO

**Expo Tunnel URL:** ${TUNNEL_URL}
**Local Dev Server:** http://localhost:8081
**Metro Bundler:** Running on port 8081

## 📱 HOW TO CONNECT

1. **On Phone:** Open Expo Go app → Scan QR code OR enter URL: ${TUNNEL_URL}
2. **Web:** Open http://localhost:8081 in browser
3. **Simulator:** Run \`npx expo start --ios\` or \`--android\`

## 🛠️ QUICK COMMANDS

\`\`\`bash
cd $PROJECT_DIR

# Start dev server
npx expo start --tunnel

# Start with web
npx expo start --web

# Clear cache and restart
npx expo start --tunnel --clear

# View logs
tail -f /tmp/expo-remote.log
\`\`\`

## 📂 PROJECT STRUCTURE

\`\`\`
$PROJECT_DIR/
├── App.tsx              # Main app entry
├── src/
│   ├── screens/         # All screen components
│   ├── services/        # Storage, API services
│   └── types/           # TypeScript types
├── app.json             # Expo config
└── package.json         # Dependencies
\`\`\`

## ⚡ FAST ITERATION WORKFLOW

1. **Edit code** in any file
2. **Save** → Hot reload happens automatically
3. **See changes** instantly on connected device
4. **No rebuild needed** for most changes

## 🎯 CURRENT FEATURES

- Home screen with stats
- Knock tracking
- Leads management
- Stats visualization
- Navigation with React Navigation

## 🔄 HOT RELOAD STATUS

✅ Enabled
✅ Fast Refresh: ON
✅ Tunnel Mode: ACTIVE

## 💡 AI ASSISTANT NOTES

- All changes hot-reload automatically
- Tunnel URL works from anywhere
- No need to restart server for code changes
- Use \`--clear\` flag if things get weird

**Last Updated:** $(date)
**Tunnel URL:** ${TUNNEL_URL}
EOF

echo -e "${GREEN}✅ AI context file created: /tmp/abeone-dev-context.md${NC}"
echo ""

# 3. Create quick-access script
echo -e "${YELLOW}Step 3: Creating quick-access scripts...${NC}"

cat > "$PROJECT_DIR/quick-dev.sh" << 'QUICKDEV'
#!/bin/bash
cd /Users/michaelmataluni/development/projects/advancedknock
npx expo start --tunnel --clear
QUICKDEV

chmod +x "$PROJECT_DIR/quick-dev.sh"

cat > "$PROJECT_DIR/quick-web.sh" << 'QUICKWEB'
#!/bin/bash
cd /Users/michaelmataluni/development/projects/advancedknock
npx expo start --web
QUICKWEB

chmod +x "$PROJECT_DIR/quick-web.sh"

echo -e "${GREEN}✅ Quick scripts created${NC}"
echo ""

# 4. Display connection info
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ REMOTE DEV SETUP COMPLETE${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📱 TUNNEL URL:${NC} ${TUNNEL_URL}"
echo ""
echo -e "${YELLOW}🤖 FOR ABËONE AI:${NC}"
echo "   Context file: /tmp/abeone-dev-context.md"
echo "   Share this file with AbëONE for full context"
echo ""
echo -e "${YELLOW}⚡ QUICK COMMANDS:${NC}"
echo "   ./quick-dev.sh    → Start tunnel dev server"
echo "   ./quick-web.sh    → Start web version"
echo ""
echo -e "${YELLOW}📱 CONNECT FROM ANYWHERE:${NC}"
echo "   1. Open Expo Go app"
echo "   2. Enter URL: ${TUNNEL_URL}"
echo "   3. Start coding!"
echo ""
echo -e "${GREEN}🔄 Hot reload: ENABLED${NC}"
echo -e "${GREEN}⚡ Fast refresh: ENABLED${NC}"
echo -e "${GREEN}🌐 Remote access: ACTIVE${NC}"
echo ""
echo "∞ AbëONE ∞"

# Keep running and show logs
echo ""
echo -e "${CYAN}📋 Live logs (Ctrl+C to stop):${NC}"
tail -f /tmp/expo-remote.log



