# Download & Install Notion Image Uploader

## 📥 Download the App

### Option 1: Download from Repository (Current Location)

The app is already available at:
```
/home/user/repository-1/NotionImageUploader-v1.0.0.zip
```

To copy it to your Mac:
1. Copy `NotionImageUploader-v1.0.0.zip` to your Mac
2. Double-click the ZIP file to extract it
3. Continue with installation below

### Option 2: Download from GitHub

Once this branch is merged or you create a release, you can download from:
- Go to your GitHub repository
- Navigate to Releases
- Download `NotionImageUploader-v1.0.0.zip`

---

## 🚀 Installation Steps

### 1. Extract the ZIP File

- Double-click `NotionImageUploader-v1.0.0.zip` on your Mac
- This creates a folder with all the files

### 2. Install Node.js (If Not Already Installed)

- Download from: https://nodejs.org
- Install it
- Restart Terminal

### 3. Configure Notion Credentials

Open Terminal and navigate to the extracted folder:

```bash
cd ~/Downloads/NotionImageUploader-v1.0.0
# (or wherever you extracted it)
```

Copy the example configuration:

```bash
cp .env.example .env
```

Edit the configuration file:

```bash
nano .env
```

Add your Notion credentials:
```
NOTION_API_KEY=your_actual_api_key_here
NOTION_DATABASE_ID=your_actual_database_id_here
```

Save with: `Ctrl+X`, then `Y`, then `Enter`

**Don't have these yet?** See the [Notion Setup Guide](#notion-setup-guide) below.

### 4. Install the App

Make the installer executable and run it:

```bash
chmod +x install-app.sh
./install-app.sh
```

Choose installation location:
- **1** = Applications folder (recommended)
- **2** = Desktop

### 5. Launch the App!

**From Spotlight:**
- Press `⌘` + `Space`
- Type "Notion Image Uploader"
- Press Enter

**From Applications/Desktop:**
- Double-click "Notion Image Uploader"

**First launch:**
- Terminal opens
- Dependencies install automatically (~1 minute)
- Browser opens with upload interface
- Ready to use!

---

## 🔑 Notion Setup Guide

### Get Your API Key

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Name: "Image Uploader"
4. Select your workspace
5. Click "Submit"
6. Copy the "Internal Integration Token" → This is your **API KEY**

### Create a Database

1. In Notion, create a new page
2. Type `/database` → select "Table - Inline"
3. Name it "My Images"
4. Ensure it has a "Name" column (title type)

### Share Database with Integration

1. In your database, click "Share" (top right)
2. Click "Invite"
3. Select "Image Uploader" integration
4. Give it "Can edit" permissions

### Get Database ID

1. Open your database in Notion
2. Look at the URL:
   ```
   https://www.notion.so/workspace/XXXXXXXXXXXXXXXXXXXXX?v=YYYYY
   ```
3. Copy the `XXXXXXXXXXXXXXXXXXXXX` part (32 characters)
4. This is your **DATABASE ID**

---

## 📱 How to Use

1. **Launch the app** (double-click or Spotlight)
2. **Browser opens** automatically
3. **Drag a folder** onto the upload zone
   - OR click "Browse Folders" to select one
4. **Watch progress** as images upload
5. **See results** when complete

To stop the app: Press `Ctrl+C` in the Terminal window

---

## 🛠️ Troubleshooting

### "App can't be opened - unidentified developer"

**Solution:**
1. Right-click the app
2. Select "Open"
3. Click "Open" in the dialog
4. Only needed once

### "Node.js is not installed"

**Solution:**
- Download from https://nodejs.org
- Install it
- Restart Terminal

### "Connection failed" or "Notion error"

**Solution:**
- Check `.env` file has correct credentials
- Verify database is shared with integration in Notion
- Run the test: `npm run cli test-connection`

### Dependencies won't install

**Solution:**
```bash
cd ~/Downloads/NotionImageUploader-v1.0.0
npm install
```

---

## 📦 What's Included

- ✅ `Notion Image Uploader.app` - Mac application
- ✅ `START_HERE.txt` - Quick start guide
- ✅ `README.md` - Full documentation
- ✅ `INSTALL.txt` - Installation details
- ✅ `.env.example` - Configuration template
- ✅ Source code and dependencies

---

## 💡 Tips

- **Add to Dock**: Drag the app from Applications to your Dock
- **Spotlight Search**: Use `⌘+Space` for quick launch
- **Keep Terminal Open**: The app needs Terminal running
- **First Launch**: Takes ~1 minute to install dependencies

---

## 📚 Additional Help

- Full docs: See `README.md` in the package
- Quick start: See `START_HERE.txt`
- Installation: See `INSTALL.txt`

---

**File Size:** 89 KB
**Version:** 1.0.0
**Compatible with:** macOS 10.13+
**Requires:** Node.js 18+

Enjoy uploading your images to Notion! 🎉
