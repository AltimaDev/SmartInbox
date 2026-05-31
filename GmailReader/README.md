# Gmail Reader & Content Extractor

A Python project to connect to Gmail, read emails, and extract structured content like URLs, email addresses, phone numbers, and more.

## Features

✅ **Gmail Integration**
- OAuth 2.0 authentication
- Read emails from Gmail account
- Filter emails with Gmail search queries
- Extract email headers and body content

✅ **Content Extraction**
- Extract URLs from email content
- Extract email addresses
- Extract phone numbers
- Strip HTML from email body
- Identify promotional and alert emails
- Email summarization

✅ **Data Processing**
- Clean and normalize text
- Parse HTML content
- Export data to JSON

## Prerequisites

- Python 3.7+
- Google Account with Gmail enabled
- Google Cloud Console access

## Installation

### 1. Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Gmail API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Desktop Application**
5. Download the credentials JSON file

### 2. Configure Local Project

1. Place the downloaded `credentials.json` file in the `credentials/` folder
2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

```bash
python main.py
```

This will:
- Authenticate with your Gmail account (first time only)
- Fetch your latest 5 unread emails
- Extract content from each email
- Display results and save to `extracted_emails.json`

### Advanced Usage

Customize queries in `main.py`:

```python
# Fetch emails from last 7 days
emails = gmail.get_emails(query='newer_than:7d', max_results=10)

# Fetch emails from specific sender
emails = gmail.get_emails(query='from:sender@example.com', max_results=5)

# Fetch emails with specific subject
emails = gmail.get_emails(query='subject:important', max_results=10)

# Combine queries
emails = gmail.get_emails(query='is:unread from:sender@example.com newer_than:3d', max_results=20)
```

### Gmail Query Examples

- `is:unread` - Unread emails
- `is:read` - Read emails
- `from:email@example.com` - From specific sender
- `subject:keywords` - Subject contains keywords
- `newer_than:1d` - Last 24 hours
- `newer_than:7d` - Last 7 days
- `has:attachment` - Emails with attachments
- `label:inbox` - In inbox label

## Project Structure

```
GmailReader/
├── main.py              # Main application entry point
├── gmail_reader.py      # Gmail API interaction
├── email_parser.py      # Content extraction and parsing
├── api_server.py        # Flask REST API server
├── requirements.txt     # Python dependencies
├── credentials/         # OAuth credentials folder
│   ├── credentials.json # (Download from Google Cloud)
│   └── token.pickle     # (Auto-generated after first auth)
└── extracted_emails.json # Output file
```

## Running the Backend Locally

### 1. Set up the API

From the GmailReader directory:

```bash
pip install -r requirements.txt
python api_server.py
```

The API server will start on `http://localhost:5000`

### 2. Connect the Frontend

From the GmailReaderUI directory:

```bash
npm run dev
```

The frontend will automatically connect to `http://localhost:5000/api`

## Deploying on Vercel

For **full-stack deployment** (frontend + backend together), see [DEPLOYMENT.md](../DEPLOYMENT.md) in the root directory.

In short:
1. Push code to GitHub
2. Import the repository to Vercel
3. Set environment variables (`GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`)
4. Deploy

## API Reference

### GmailReader

```python
from gmail_reader import GmailReader

gmail = GmailReader()

# Get emails
emails = gmail.get_emails(query='is:unread', max_results=10)

# Get email details
message = gmail.get_email_details(message_id)

# Get headers
headers = gmail.get_email_headers(message)

# Get body
body = gmail.get_email_body(message)
```

### EmailExtractor

```python
from email_parser import EmailExtractor

extractor = EmailExtractor(subject, body, sender)
data = extractor.extract_all()

# Returns:
# {
#     'sender': str,
#     'subject': str,
#     'body': str,
#     'urls': list,
#     'email_addresses': list,
#     'phone_numbers': list,
#     'summary': dict,
#     'is_promotional': bool,
#     'is_alert': bool
# }
```

### EmailParser

```python
from email_parser import EmailParser

parser = EmailParser()

# Extract URLs
urls = parser.extract_links(text)

# Extract emails
emails = parser.extract_email_addresses(text)

# Extract phone numbers
phones = parser.extract_phone_numbers(text)

# Strip HTML
clean_text = parser.strip_html(html_content)

# Clean text
cleaned = parser.clean_text(text)
```

## REST API Endpoints

All endpoints are prefixed with `/api`:

- `GET /health` - Health check
- `GET /gmail/status` - Gmail connection status
- `GET /emails?search=...&category=...&limit=20&offset=0` - Get emails
- `GET /emails/<id>` - Get email details
- `GET /emails/search?q=...&sender=...&from_date=...&to_date=...` - Search emails
- `POST /emails/export/json` - Export as JSON
- `POST /emails/export/csv` - Export as CSV

## Project Structure

```
GmailReader/
├── main.py              # Main application entry point
├── gmail_reader.py      # Gmail API interaction
├── email_parser.py      # Content extraction and parsing
├── requirements.txt     # Python dependencies
├── credentials/         # OAuth credentials folder
│   ├── credentials.json # (Download from Google Cloud)
│   └── token.pickle     # (Auto-generated after first auth)
└── extracted_emails.json # Output file
```

## Output Example

```json
[
  {
    "sender": "example@gmail.com",
    "subject": "Meeting Tomorrow",
    "body": "Hi, let's meet tomorrow at 2 PM...",
    "body_html_stripped": "Hi, let's meet tomorrow at 2 PM...",
    "urls": [
      "https://example.com/meeting"
    ],
    "email_addresses": [
      "contact@example.com"
    ],
    "phone_numbers": [
      ["555", "123", "4567"]
    ],
    "summary": {
      "subject": "Meeting Tomorrow",
      "preview": "Hi, let's meet tomorrow at 2 PM...",
      "word_count": 45,
      "char_count": 250
    },
    "is_promotional": false,
    "is_alert": false,
    "date": "Tue, 28 May 2026 10:30:00 +0000",
    "to": "user@gmail.com",
    "message_id": "abc123..."
  }
]
```

## Troubleshooting

### Authentication Issues

- **First run:** Browser will open for authentication. Grant permissions.
- **Token refresh:** Delete `credentials/token.pickle` to re-authenticate
- **Missing credentials.json:** Download from Google Cloud Console

### No emails found

- Check your Gmail search query
- Try different queries
- Ensure Gmail API is enabled in Google Cloud

### HTML parsing errors

- Email content will fall back to raw text if parsing fails
- Check email formatting

## Security Notes

⚠️ **Important:**
- Keep `credentials/credentials.json` and `token.pickle` confidential
- Never commit credentials to version control
- Use `.gitignore` to exclude credentials folder
- Regenerate credentials if compromised

## Limitations

- Gmail API has rate limits (check Google documentation)
- Large attachments are not downloaded
- Some email formatting may not be preserved
- Plaintext extraction best for text emails

## Future Enhancements

- [ ] Download attachments
- [ ] Send emails
- [ ] Schedule periodic email checks
- [ ] Advanced filtering and categorization
- [ ] Machine learning classification
- [ ] Web UI dashboard

## License

MIT

## Support

For issues or questions, refer to:
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google Cloud Console](https://console.cloud.google.com/)
