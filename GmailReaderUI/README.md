# Gmail Reader UI

A professional, clean Gmail Reader web application built with React and Tailwind CSS. Features a SaaS/business software style inspired by Gmail, Google Workspace, Notion, and Slack.

## Features

✅ **Professional Design**
- Light theme only (no dark mode)
- Clean, minimal aesthetic
- Inspired by Gmail, Google Workspace, Notion, and Slack
- Responsive desktop-first design

✅ **Email Management**
- Email list with sender avatars and categories
- Real-time email search
- Filter by category (Work, Alert, HR, Finance)
- Date range filtering
- Sender filtering

✅ **Email Details View**
- Full email content display
- Extracted URLs with links
- Extracted email addresses
- Extracted phone numbers
- AI-generated summaries
- Collapsible sections for extracted data

✅ **Data Export**
- Export emails as JSON
- Export emails as CSV
- Batch operations

✅ **Professional UI Components**
- Gmail connection status indicator
- Reconnect button
- Category badges
- Unread email indicators
- Professional typography
- Subtle borders instead of heavy shadows
- Plenty of white space

## Color Palette

- **White background**: #FFFFFF
- **Light gray sections**: #F5F7F9
- **Border color**: #E5E7EB
- **Primary blue**: #2563EB
- **Text color**: #111827
- **Secondary text**: #6B7280

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Top navigation bar with Gmail status
│   ├── Sidebar.jsx         # Left sidebar with search and filters
│   ├── EmailList.jsx       # Email list with avatars and previews
│   └── EmailDetails.jsx    # Right panel with full email and extracted data
├── App.jsx                 # Main application component
├── data.js                 # Sample email data
├── App.css                 # Global styles
├── index.css               # Tailwind CSS imports
└── main.jsx                # React entry point
index.html                  # HTML entry point
package.json               # Dependencies
tailwind.config.js         # Tailwind CSS configuration
vite.config.js             # Vite configuration
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd GmailReaderUI
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

### 4. Deploy on Vercel

1. Create a Vercel account at https://vercel.com/.
2. Import this repository and set the project root to `GmailReaderUI`.
3. Use:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

If you want to use the Vercel CLI from the `GmailReaderUI` folder:

```bash
cd GmailReaderUI
npm install
npx vercel
```

## Usage

1. **Search**: Use the search box to filter emails by subject, sender, or content
2. **Filter by Category**: Select from Work, Alert, HR, Finance, or All
3. **Filter by Date**: Set a date range for emails
4. **Filter by Sender**: Enter a sender email to filter
5. **View Email**: Click any email in the list to view its full details
6. **View Extracted Data**: Expand sections to see URLs, email addresses, phone numbers, and AI summary
7. **Export**: Use the download buttons to export as JSON or CSV

## Sample Data

The application includes realistic sample emails demonstrating:
- Q2 marketing campaign review with metrics
- Server maintenance alerts
- Performance feedback
- Interview scheduling
- Expense report processing

Each email includes extracted data (URLs, emails, phones) and AI summaries.

## Technologies

- **React 18**: UI library
- **Tailwind CSS 3**: Utility-first CSS framework
- **Vite**: Fast build tool
- **Lucide React**: Icon library
- **PostCSS**: CSS processing

## Design Principles

- **Functional over decorative**: Focus on usability
- **Professional aesthetic**: Enterprise-grade design
- **Minimal animations**: Smooth transitions without distraction
- **Generous whitespace**: Clear visual hierarchy
- **Subtle interactions**: Hover states and focus indicators
- **Responsive layout**: Desktop-first approach

## Future Enhancements

- Gmail API integration for real email data
- Real-time email sync
- Advanced search syntax
- Email threading
- Attachment support
- Email composition
- Calendar integration
- Notification system
