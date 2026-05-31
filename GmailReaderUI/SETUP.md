## Quick Start Guide

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd c:\DevelopmentEnviroment\GmailReaderUI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. The browser will automatically open at `http://localhost:3000`

### Features Overview

#### Header
- Company logo and title
- Gmail connection status (green dot = connected)
- Connect/Reconnect button
- Settings menu

#### Left Sidebar (35% width)
- **Search Box**: Full-text search across emails
- **Category Filter**: All, Work, Alert, HR, Finance
- **Date Range Filter**: Filter by date range
- **Sender Filter**: Filter by email address
- **Fetch Emails Button**: Refresh email list
- **Unread Counter**: Shows unread email count

#### Email List
- Sender avatar with initials
- Sender name and subject preview
- Email preview text (first 60 characters)
- Category badge with color coding
- Time sent
- Unread indicator (blue dot)
- Active state highlighting

#### Email Details (65% width)
- Full email subject and headers
- From, To, Date information
- Full email body content
- Action buttons (Export JSON, Export CSV)

#### Extracted Data Sections (Collapsible)
- **AI Summary** (blue background): Generated summary of email
- **URLs** (blue accent): All links extracted from email
- **Email Addresses** (green accent): All emails found in content
- **Phone Numbers** (purple accent): All phone numbers found

### Sample Data

The application includes 5 sample emails demonstrating:

1. **Sarah Chen** - Q2 Marketing Campaign Review
   - Contains metrics, analytics links, and marketing email addresses
   
2. **James Rodriguez** - Server Maintenance Alert
   - Contains incident management links and ops team contacts
   
3. **Priya Patel** - Presentation Feedback
   - Contains positive feedback with improvement suggestions
   
4. **Recruitment Team** - Interview Scheduled
   - Contains Zoom link, candidate info, and interview details
   
5. **Finance Department** - Expense Report
   - Contains financial summary and report links

### Category Color Coding

- **Work**: Blue badge
- **Alert**: Red badge
- **HR**: Purple badge
- **Finance**: Green badge

### Export Functionality

**Export as JSON:**
- Click download icon
- Creates `emails.json` with all filtered emails
- Includes full email data with extracted content

**Export as CSV:**
- Click download icon
- Creates `emails.csv` with tabular format
- Includes: From, Subject, Date, Category

### Customization

#### Change Color Palette
Edit `tailwind.config.js`:
```js
colors: {
  'brand': {
    'primary': '#2563EB',      // Change this for primary color
    'light': '#F5F7F9',        // Light backgrounds
    'border': '#E5E7EB',       // Borders
    'text': '#111827',         // Text color
    'text-secondary': '#6B7280' // Secondary text
  }
}
```

#### Add More Sample Emails
Edit `src/data.js` and add to the `sampleEmails` array:
```js
{
  id: 'X',
  from: 'sender@email.com',
  fromName: 'Sender Name',
  to: 'you@company.com',
  subject: 'Email Subject',
  date: '2024-05-30',
  time: '2:45 PM',
  category: 'Work', // or 'Alert', 'HR', 'Finance'
  body: 'Full email content here...',
  urls: ['https://example.com'],
  emails: ['contact@example.com'],
  phones: ['+1 (415) 555-0142'],
  summary: 'Email summary goes here',
  read: false
}
```

#### Modify Layout Widths
In `src/App.jsx`, change the width classes:
- Sidebar: currently `w-80` (fixed 320px)
- Email list: currently `w-96` (fixed 384px)
- Email details: `flex-1` (takes remaining space)

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance

- No external API calls (uses sample data)
- Lightweight components
- Fast rendering with React 18
- Optimized Tailwind CSS
- ~50KB gzipped bundle size

### Next Steps for Integration

1. **Connect Real Gmail API**:
   - Use the existing Gmail Python backend
   - Create API endpoints to fetch real emails
   - Implement OAuth 2.0 flow

2. **Add Backend**:
   - Node.js/Express server
   - Database for email caching
   - Real-time email sync

3. **Enhance Features**:
   - Email composition
   - Draft support
   - Archive functionality
   - Star/bookmark emails
   - Advanced search syntax
   - Email threading

4. **Mobile Responsiveness**:
   - Tablet layout adjustments
   - Mobile-optimized view

### Troubleshooting

**Port 3000 already in use:**
```bash
npm run dev -- --port 3001
```

**npm install fails:**
```bash
npm install --legacy-peer-deps
```

**Clear cache and reinstall:**
```bash
rm -r node_modules
rm package-lock.json
npm install
```
