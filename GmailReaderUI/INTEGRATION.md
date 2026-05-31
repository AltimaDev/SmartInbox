# Email Reader UI - Features & API Integration Guide

## Current Features

### ✅ Implemented
- Professional SaaS-style light theme
- Email list with sender information
- Real-time search across email content
- Category filtering (Work, Alert, HR, Finance)
- Date range filtering
- Sender email filtering
- Email details view with full content
- Extracted data visualization (URLs, emails, phones)
- AI-generated email summaries
- Export to JSON format
- Export to CSV format
- Gmail connection status indicator
- Professional typography and spacing
- Smooth interactions and transitions
- Sample data for demonstration

### 🔄 Ready for Integration
- Backend API endpoints
- Real email data fetching
- OAuth 2.0 flow
- Email body parsing
- Content extraction (URLs, emails, phones)
- Email categorization
- Attachment support

## API Integration Points

### 1. Email List Endpoint

**Expected API Response:**

```javascript
GET /api/emails
Query Parameters:
  - search: "search term"
  - category: "Work|Alert|HR|Finance"
  - from_date: "2024-05-01"
  - to_date: "2024-05-31"
  - sender: "email@company.com"
  - limit: 50
  - offset: 0

Response:
{
  status: "success",
  data: {
    emails: [
      {
        id: "email_id_123",
        from: "sender@email.com",
        fromName: "Sender Name",
        to: "recipient@email.com",
        subject: "Email Subject",
        body: "Email body content...",
        date: "2024-05-30",
        time: "2:45 PM",
        category: "Work",
        read: true,
        urls: ["https://example.com"],
        emails: ["contact@example.com"],
        phones: ["+1 (415) 555-0142"],
        summary: "AI-generated summary"
      }
    ],
    total_count: 150,
    unread_count: 12
  }
}
```

**Implementation in App.jsx:**

```javascript
const [emails, setEmails] = useState([]);
const [loading, setLoading] = useState(false);

const fetchEmails = async (filters) => {
  setLoading(true);
  try {
    const params = new URLSearchParams({
      search: searchQuery,
      category: selectedCategory,
      limit: 50
    });
    
    const response = await fetch(`/api/emails?${params}`);
    const data = await response.json();
    setEmails(data.data.emails);
  } catch (error) {
    console.error('Failed to fetch emails:', error);
  } finally {
    setLoading(false);
  }
};
```

### 2. Email Details Endpoint

**Expected API Response:**

```javascript
GET /api/emails/:id

Response:
{
  status: "success",
  data: {
    id: "email_id_123",
    from: "sender@email.com",
    fromName: "Sender Name",
    to: "recipient@email.com",
    cc: ["cc@email.com"],
    bcc: ["bcc@email.com"],
    subject: "Email Subject",
    body: "Full email body with HTML",
    bodyText: "Plain text version",
    date: "2024-05-30",
    time: "2:45 PM",
    category: "Work",
    read: true,
    starred: false,
    archived: false,
    urls: ["https://example.com"],
    emails: ["contact@example.com"],
    phones: ["+1 (415) 555-0142"],
    summary: "AI-generated summary",
    attachments: [
      {
        id: "att_123",
        filename: "document.pdf",
        size: 2048000,
        mimeType: "application/pdf"
      }
    ]
  }
}
```

### 3. Gmail Connection Endpoint

**Expected API Response:**

```javascript
GET /api/gmail/status

Response:
{
  status: "success",
  data: {
    connected: true,
    email: "user@gmail.com",
    lastSync: "2024-05-30T14:30:00Z",
    syncStatus: "synced"
  }
}

// Or if not connected:
{
  status: "success",
  data: {
    connected: false,
    authUrl: "https://accounts.google.com/o/oauth2/auth?..."
  }
}
```

### 4. Export Data Endpoint

**For Backend Processing:**

```javascript
POST /api/emails/export

Request Body:
{
  format: "json" | "csv",
  filters: {
    search: "",
    category: "All",
    from_date: "2024-05-01",
    to_date: "2024-05-31"
  }
}

Response:
File download with appropriate headers
```

## Sample Backend Integration Code

### Node.js + Express Example

```javascript
// backend/routes/emails.js
import express from 'express';
import { GmailService } from '../services/gmail.js';

const router = express.Router();

router.get('/emails', async (req, res) => {
  try {
    const { search, category, from_date, to_date, limit = 50, offset = 0 } = req.query;
    
    const emails = await GmailService.searchEmails({
      search,
      category,
      from_date,
      to_date,
      limit,
      offset
    });
    
    res.json({
      status: 'success',
      data: {
        emails: emails.map(email => ({
          id: email.id,
          from: email.from,
          fromName: email.fromName,
          to: email.to,
          subject: email.subject,
          body: email.body,
          date: email.date,
          time: email.time,
          category: email.category,
          read: email.read,
          urls: email.urls,
          emails: email.emails,
          phones: email.phones,
          summary: email.summary
        })),
        total_count: emails.total,
        unread_count: emails.unread
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get('/emails/:id', async (req, res) => {
  try {
    const email = await GmailService.getEmailDetails(req.params.id);
    res.json({
      status: 'success',
      data: email
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
```

### Python Flask Example

```python
# backend/routes/emails.py
from flask import Blueprint, request, jsonify
from services.gmail_service import GmailService

emails_bp = Blueprint('emails', __name__, url_prefix='/api/emails')

@emails_bp.route('', methods=['GET'])
def get_emails():
    try:
        search = request.args.get('search', '')
        category = request.args.get('category', 'All')
        from_date = request.args.get('from_date')
        to_date = request.args.get('to_date')
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        emails, total, unread = GmailService.search_emails(
            search=search,
            category=category,
            from_date=from_date,
            to_date=to_date,
            limit=limit,
            offset=offset
        )
        
        return jsonify({
            'status': 'success',
            'data': {
                'emails': [email.to_dict() for email in emails],
                'total_count': total,
                'unread_count': unread
            }
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@emails_bp.route('/<email_id>', methods=['GET'])
def get_email_details(email_id):
    try:
        email = GmailService.get_email_details(email_id)
        return jsonify({
            'status': 'success',
            'data': email.to_dict()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
```

## Integration Steps

### Phase 1: API Setup
1. Create backend API endpoints matching the specification above
2. Set up authentication (OAuth 2.0 for Gmail)
3. Implement email parsing and extraction logic
4. Create database schema for caching

### Phase 2: Frontend Connection
1. Replace sample data with API calls in `src/App.jsx`
2. Add loading states and error handling
3. Implement real-time email search
4. Add pagination for large email lists

### Phase 3: Advanced Features
1. Real-time email sync
2. Email composition
3. Attachment handling
4. Advanced search syntax

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_GMAIL_REDIRECT_URI=http://localhost:3000/oauth/callback
VITE_APP_ENV=development
```

Reference in code:

```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL;
```

## Error Handling

Add to App.jsx:

```javascript
const [error, setError] = useState(null);

useEffect(() => {
  const fetchEmails = async () => {
    try {
      setError(null);
      // API call here
    } catch (err) {
      setError(err.message);
    }
  };
  
  fetchEmails();
}, [searchQuery, selectedCategory]);

// Display error banner
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
    {error}
  </div>
)}
```

## Performance Optimization

### Implement Pagination

```javascript
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(50);

const loadMore = () => {
  setPage(prev => prev + 1);
};

// In fetch:
const response = await fetch(
  `/api/emails?offset=${page * pageSize}&limit=${pageSize}`
);
```

### Add Caching

```javascript
const emailCache = new Map();

const fetchEmail = async (id) => {
  if (emailCache.has(id)) {
    return emailCache.get(id);
  }
  
  const response = await fetch(`/api/emails/${id}`);
  const data = await response.json();
  emailCache.set(id, data);
  return data;
};
```

### Implement Virtual Scrolling

For large email lists, use `react-window`:

```bash
npm install react-window
```

```javascript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={emails.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <EmailItem email={emails[index]} />
    </div>
  )}
</FixedSizeList>
```

## Security Considerations

1. **CORS Setup**: Configure CORS headers on backend
2. **Authentication**: Implement JWT tokens
3. **Data Validation**: Validate all user input
4. **Rate Limiting**: Implement API rate limits
5. **Sensitive Data**: Never store tokens in localStorage; use httpOnly cookies

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Configuration

Set appropriate environment variables for production:

```env
VITE_API_BASE_URL=https://api.company.com/api
VITE_APP_ENV=production
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Testing

Add tests for components and API integration:

```javascript
// __tests__/EmailList.test.jsx
import { render, screen } from '@testing-library/react';
import EmailList from '../components/EmailList';

test('renders email list', () => {
  const emails = [/* sample data */];
  render(<EmailList emails={emails} />);
  expect(screen.getByText('From Name')).toBeInTheDocument();
});
```

```bash
npm install --save-dev @testing-library/react vitest
```

## Monitoring & Analytics

Track user interactions:

```javascript
const trackEvent = (eventName, properties) => {
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
};

// Usage:
trackEvent('email_opened', { email_id: email.id });
trackEvent('search_performed', { query: searchQuery });
```

## Support & Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure backend has correct CORS headers
- Check API URL configuration

**2. Auth Failures**
- Verify OAuth credentials
- Check redirect URI configuration
- Review token expiration

**3. Slow Email Loading**
- Implement pagination
- Add virtual scrolling for large lists
- Cache frequently accessed emails

**4. Search Not Working**
- Verify search API endpoint
- Check query parameter formatting
- Ensure backend search logic

## Future Enhancements

1. **Machine Learning**: Better email categorization
2. **Natural Language**: Advanced search queries
3. **Notifications**: Real-time email alerts
4. **Collaboration**: Shared email folders
5. **Integration**: Calendar, Drive, Docs integration
6. **Mobile App**: React Native version
