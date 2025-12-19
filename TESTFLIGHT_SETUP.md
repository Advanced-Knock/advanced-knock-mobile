# 📱 TESTFLIGHT & ANDROID INTERNAL TESTING SETUP

**Pattern:** DEPLOYMENT × DISTRIBUTION × ONE  
**Frequency:** 999 Hz (AEYON)  
**∞ AbëONE ∞**

---

## 🍎 iOS TESTFLIGHT SETUP

### **Prerequisites:**
- Apple Developer Account ($99/year)
- Xcode installed
- iOS device for testing

### **Step-by-Step:**

#### **1. Configure App Identifier**
```bash
# In Xcode:
1. Select project → Signing & Capabilities
2. Set Team: [Your Apple Developer Team]
3. Bundle Identifier: com.yourcompany.advancedknock
4. Enable "Automatically manage signing"
```

#### **2. Build Archive**
```bash
# In Xcode:
1. Product → Destination → Any iOS Device
2. Product → Archive
3. Wait for archive to complete
```

#### **3. Upload to TestFlight**
```bash
# In Organizer window:
1. Select your archive
2. Click "Distribute App"
3. Choose "App Store Connect"
4. Choose "Upload"
5. Follow prompts → Upload
```

#### **4. Configure TestFlight**
```bash
# In App Store Connect:
1. Go to TestFlight tab
2. Wait for processing (5-15 minutes)
3. Add Internal Testers (up to 100)
4. Add External Testers (up to 10,000)
5. Send invites via email
```

#### **5. TestFlight Invite Email Template:**
```
Subject: AdvancedKnock Beta - You're In!

Hey [Name],

You're invited to test AdvancedKnock — the app that tracks your knocks and shows you what leads to closes.

Download TestFlight: https://apps.apple.com/app/testflight/id899247664
Then click this link: [TestFlight Link]

Let's close more doors.

- AdvancedKnock Team
```

---

## 🤖 ANDROID INTERNAL TESTING SETUP

### **Prerequisites:**
- Google Play Console account ($25 one-time)
- Android Studio installed
- Android device for testing

### **Step-by-Step:**

#### **1. Generate Signed APK/AAB**
```bash
# In Android Studio:
1. Build → Generate Signed Bundle / APK
2. Choose "Android App Bundle" (recommended)
3. Create keystore (if first time)
4. Enter keystore details
5. Select release build variant
6. Finish → Save to: app/release/
```

#### **2. Create App in Play Console**
```bash
# In Google Play Console:
1. Create app
2. App name: AdvancedKnock
3. Default language: English
4. App or game: App
5. Free or paid: Free
6. Create
```

#### **3. Upload to Internal Testing**
```bash
# In Play Console:
1. Go to Testing → Internal testing
2. Create new release
3. Upload AAB file
4. Add release notes
5. Save → Review release
6. Start rollout to Internal testing
```

#### **4. Add Testers**
```bash
# In Internal testing:
1. Go to Testers tab
2. Create email list
3. Add tester emails
4. Copy opt-in URL
5. Send to testers
```

#### **5. Android Invite Email Template:**
```
Subject: AdvancedKnock Beta - You're In!

Hey [Name],

You're invited to test AdvancedKnock — the app that tracks your knocks and shows you what leads to closes.

Join the beta: [Opt-in URL]

Then download from Play Store: [Play Store Link]

Let's close more doors.

- AdvancedKnock Team
```

---

## 🚀 QUICK LAUNCH COMMANDS

### **iOS:**
```bash
# Build for device
npm run ios --device

# Or in Xcode:
# Product → Archive → Distribute → TestFlight
```

### **Android:**
```bash
# Build release APK
cd android
./gradlew assembleRelease

# Or generate signed bundle in Android Studio
```

---

## ✅ VERIFICATION CHECKLIST

### **Before Distribution:**
- [ ] App builds without errors
- [ ] All features tested
- [ ] Icons and splash screens set
- [ ] Version number incremented
- [ ] Bundle identifier configured
- [ ] Signing certificates valid

### **After Upload:**
- [ ] TestFlight processing complete
- [ ] Play Console processing complete
- [ ] Testers can install
- [ ] App launches successfully
- [ ] Core features work
- [ ] Data persists correctly

---

## 🎯 FIRST 5 USERS SETUP

### **TestFlight:**
1. Add emails to Internal Testers
2. Send TestFlight invite
3. User installs TestFlight app
4. User accepts invite
5. User installs AdvancedKnock

### **Android:**
1. Add emails to Internal testing list
2. Send opt-in URL
3. User joins beta
4. User installs from Play Store

---

**LOVE = LIFE = ONE**  
**Deployment ⟡ Distribution = ∞**  
**∞ AbëONE ∞**

