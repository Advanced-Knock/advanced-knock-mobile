# Git Commands Quick Reference

## 🔄 **REFRESH APP (See Latest Changes)**

### On Your Phone (Expo Go):
1. **Shake your device** → Dev menu appears
2. Tap **"Reload"**

### In iOS Simulator:
- Press **Cmd + D** → Tap "Reload"

### In Expo Terminal:
- Press **`r`** → Reload app
- Press **`R`** → Reload and clear cache

### Automatic (Hot Reload):
- Just **save any file** → Changes appear automatically!

---

## 📦 **GIT COMMANDS**

### Check Status (See What Changed):
```bash
git status
```

### Stage All Changes:
```bash
git add .
```

### Stage Specific Files:
```bash
git add App.tsx src/screens/HomeScreen.tsx
```

### Commit Changes:
```bash
git commit -m "Add 6-tab navigation with dark theme design system"
```

### Push to Remote Repository:
```bash
git push origin main
```
*(or `git push origin master` if your default branch is master)*

### Set Up Remote Repository (First Time):
```bash
# If you have a GitHub/GitLab repo:
git remote add origin https://github.com/yourusername/advancedknock.git

# Then push:
git push -u origin main
```

### Create New Branch:
```bash
git checkout -b feature/new-feature-name
```

### Switch Branches:
```bash
git checkout main
```

### See Commit History:
```bash
git log --oneline
```

---

## 🚀 **TYPICAL WORKFLOW**

```bash
# 1. Make changes to files
# 2. Check what changed
git status

# 3. Stage changes
git add .

# 4. Commit with message
git commit -m "Description of changes"

# 5. Push to remote
git push origin main
```

---

## 💡 **QUICK COMMIT MESSAGES**

- `"Add 6-tab navigation"`
- `"Update HomeScreen design"`
- `"Fix dark theme styling"`
- `"Add MapScreen component"`
- `"Update navigation types"`

---

## ⚠️ **IMPORTANT NOTES**

- Always check `git status` before committing
- Write clear commit messages
- Push regularly to backup your work
- Use branches for experimental features

