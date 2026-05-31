# Quick Start - 5 Minutes to Full Integration

## Prerequisites ✅
- Python 3.7+ installed
- Node.js 16+ installed  
- Gmail account with API credentials (see setup below)

## Step 1: Setup Gmail API (5 minutes)

1. **Get credentials.json from Google Cloud:**
   - Go to https://console.cloud.google.com/
   - Create new project
   - Enable Gmail API
   - Create OAuth 2.0 credentials (Desktop app)
   - Download JSON file

2. **Place credentials:**
   ```
   Move credentials.json to: c:\DevelopmentEnviroment\GmailReader\credentials\
   ```

## Step 2: Start Backend Server

### Terminal 1 - Backend:
```bash
cd c:\DevelopmentEnviroment\GmailReader
pip install -r requirements.txt
python api_server.py
```

✅ You should see:
```
============================================================
GMAIL READER API SERVER
============================================================
Starting server on http://localhost:5000
```

**On first run:** A browser window will open for Gmail login. Authenticate and the app will save your token.

## Step 3: Start Frontend Server

### Terminal 2 - Frontend:
```bash
cd c:\DevelopmentEnviroment\GmailReaderUI
npm install
npm run dev
```

✅ Frontend will open automatically at http://localhost:5173/

## Done! 🎉

Your app should now:
- ✅ Show "Gmail Connected" in green
- ✅ Display your emails in the list
- ✅ Show full email details on click
- ✅ Display extracted URLs, emails, and phone numbers
- ✅ Allow export to JSON/CSV

## Common Issues

**"Gmail not connected"**
- Delete `GmailReader/credentials/token.pickle`
- Restart api_server.py
- Follow the browser OAuth login

**"Cannot connect to backend"** 
- Ensure api_server.py is running on port 5000
- Check firewall isn't blocking port 5000

**"Frontend showing blank page"**
- Ensure npm install completed
- Check browser console for errors
- Try: npm run dev -- --port 3001

## Detailed Setup Guide

For complete documentation with troubleshooting, see: [INTEGRATION_STARTUP.md](../INTEGRATION_STARTUP.md)

## File Structure

```
c:\DevelopmentEnviroment\
├── GmailReader/                    (Backend - Python)
│   ├── api_server.py               ← Flask API (port 5000)
│   ├── gmail_reader.py             ← Gmail integration
│   ├── email_parser.py             ← Content extraction
│   ├── requirements.txt            ← Dependencies
│   └── credentials/
│       └── credentials.json        ← Your Google API key
│
└── GmailReaderUI/                  (Frontend - React)
    ├── src/
    │   ├── api.js                  ← API client
    │   ├── App.jsx                 ← Main app
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── EmailList.jsx
    │   │   └── EmailDetails.jsx
    │   ├── data.js                 ← Sample data (not used with backend)
    │   └── index.css               ← Tailwind styles
    ├── package.json                ← Node dependencies
    ├── .env.local                  ← API URL config
    └── vite.config.js              ← Vite config
```

## What Happens Behind the Scenes

1. **Frontend** (React) sends API requests to backend
2. **Backend** (Flask) authenticates with Gmail API
3. **Gmail API** returns your emails
4. **Backend** processes and formats emails
5. **Frontend** displays them beautifully

```
You → Gmail UI ← Backend ← Gmail API
      (React)    (Flask)   (Google)
```

## Next Steps

After getting everything running:

1. **Customize filters** - Edit category detection in `api_server.py`
2. **Add features** - Email composition, drafts, archive
3. **Deploy** - Host backend on cloud, frontend on CDN
4. **Mobile** - Create React Native app using same API

---

🚀 **Ready to start?** Follow the 3 steps above!
