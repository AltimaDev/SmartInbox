# Deployment Configuration for Gmail Reader on Vercel

This project is now set up for full-stack deployment on Vercel, with the React frontend and Python Flask backend running together.

## Deployment Steps

### 1. Set up Environment Variables on Vercel

Add these environment variables in your Vercel project settings:

- `GMAIL_CLIENT_ID`: From your Google Cloud OAuth app
- `GMAIL_CLIENT_SECRET`: From your Google Cloud OAuth app  
- `GMAIL_REFRESH_TOKEN`: Obtained from initial OAuth flow
- `GMAIL_TOKEN_URI`: https://oauth2.googleapis.com/token (default)

### 2. Get Gmail Refresh Token

To get your `GMAIL_REFRESH_TOKEN`, run the setup locally first:

```bash
cd GmailReader
python main.py
# This will open a browser for OAuth authentication
# Then use the token from the token.pickle file
```

### 3. Deploy to Vercel

```bash
npm install -g vercel
cd /path/to/Gmail
vercel
```

### 4. Configure for Production

When deploying, ensure:
- Frontend builds from `GmailReaderUI/dist`
- API routes point to `/api/**`
- Python dependencies are installed from `GmailReader/requirements.txt`

## File Structure

```
Gmail/
├── GmailReader/              # Python backend
│   ├── api_server.py         # Flask API app
│   ├── gmail_reader.py       # Gmail OAuth client
│   ├── email_parser.py       # Email extraction
│   ├── requirements.txt       # Python dependencies
│   └── credentials/
├── GmailReaderUI/            # React frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   └── dist/                 # Built frontend
├── api/
│   └── index.py              # Vercel serverless handler
├── vercel.json               # Deployment config
└── README.md
```

## Local Development

### Terminal 1: Backend API

```bash
cd GmailReader
pip install -r requirements.txt
python api_server.py
# Runs on http://localhost:5000
```

### Terminal 2: Frontend

```bash
cd GmailReaderUI
npm install
npm run dev
# Runs on http://localhost:3000 (or 5173 with Vite)
```

### Connect Locally

The frontend will automatically connect to `http://localhost:5000/api` in development mode.

## API Routes

All routes are prefixed with `/api/`:

- `GET  /health` - Health check
- `GET  /gmail/status` - Gmail connection status
- `GET  /emails` - List emails
- `GET  /emails/:id` - Get email details
- `GET  /emails/search` - Search emails
- `POST /emails/export/json` - Export as JSON
- `POST /emails/export/csv` - Export as CSV

## Production Notes

- Frontend is served from `GmailReaderUI/dist`
- All `/api/**` requests route to the Python backend
- OAuth credentials are pulled from environment variables on Vercel
- Local `.gitignore` prevents credentials from being committed

## Troubleshooting

**"Gmail not connected" error:**
- Check that `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and `GMAIL_REFRESH_TOKEN` are set in Vercel environment variables
- Token may have expired; regenerate and update the env variable

**Frontend can't reach API:**
- In dev: ensure backend runs on port 5000
- In production: Vercel routes `/api/**` to the serverless handler automatically

**Build failures:**
- Ensure `GmailReader/requirements.txt` has all dependencies
- Check Node.js version compatibility with `GmailReaderUI/package.json`
