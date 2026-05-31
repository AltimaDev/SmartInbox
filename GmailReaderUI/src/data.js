export const sampleEmails = [
  {
    id: '1',
    from: 'sarah.chen@techcorp.com',
    fromName: 'Sarah Chen',
    to: 'you@company.com',
    subject: 'Q2 Marketing Campaign Review',
    date: '2024-05-30',
    time: '2:45 PM',
    category: 'Work',
    body: `Hi,

I've completed the analysis for our Q2 marketing campaign. The results are better than expected:

• Email engagement: 24% (target was 18%)
• Click-through rate: 3.8% (industry average 2.1%)
• Conversion rate: 2.1% (up from 1.8% in Q1)

The new A/B testing strategy seems to be working well. I've attached the detailed report with breakdowns by region.

Key highlights:
- APAC region saw 31% increase in engagement
- Mobile users had higher conversion rates than desktop
- Friday sends performed 15% better than Tuesday sends

Next steps: I recommend we scale this approach for Q3 planning.

Best regards,
Sarah`,
    urls: [
      'https://analytics.company.com/reports/q2-2024',
      'https://docs.company.com/marketing-strategy-q2'
    ],
    emails: [
      'marketing-team@company.com',
      'analytics@company.com'
    ],
    phones: ['+1 (415) 555-0142'],
    summary: 'Q2 marketing campaign exceeded targets with 24% email engagement and 2.1% conversion rate. APAC region led with 31% engagement increase.',
    read: true
  },
  {
    id: '2',
    from: 'james.rodriguez@techcorp.com',
    fromName: 'James Rodriguez',
    to: 'you@company.com',
    subject: 'Urgent: Server Maintenance Window Tonight',
    date: '2024-05-30',
    time: '1:20 PM',
    category: 'Alert',
    body: `Team,

Please be aware of the following maintenance window:

Date: May 30, 2024
Time: 9:00 PM - 11:30 PM PST
Duration: ~2.5 hours
Impact: Production services will be unavailable

Services affected:
- API Gateway (all endpoints)
- Database cluster (read-write operations)
- Dashboard and analytics portal

Action items:
1. Notify all external stakeholders by 5 PM
2. Pause automated jobs before 8:45 PM
3. Have team on standby during maintenance
4. Monitor logs in #incident-channel

For questions or concerns, reach out to ops-team@company.com

Thank you,
James`,
    urls: [
      'https://status.company.com/incidents',
      'https://docs.company.com/maintenance-guide'
    ],
    emails: [
      'ops-team@company.com',
      'devops@company.com'
    ],
    phones: ['+1 (415) 555-0198'],
    summary: 'Scheduled production server maintenance tonight 9:00 PM - 11:30 PM PST. All services including API, database, and dashboard will be offline.',
    read: true
  },
  {
    id: '3',
    from: 'priya.patel@techcorp.com',
    fromName: 'Priya Patel',
    to: 'you@company.com',
    subject: 'Feedback on Your Presentation',
    date: '2024-05-29',
    time: '4:15 PM',
    category: 'Work',
    body: `Hi,

I wanted to share some feedback on your presentation from the strategy meeting.

What went well:
- Clear data visualization of the roadmap
- Strong narrative around customer pain points
- Good audience engagement with the Q&A section

Areas for improvement:
- Consider adding more context about competitive landscape
- The timeline could be more detailed with specific milestones
- Some of the technical jargon might not resonate with non-technical stakeholders

Overall, it was a solid presentation! I think the team is aligned on the direction.

I'd suggest we schedule a follow-up meeting with the product team next week to dive deeper into the implementation details.

Great work!
Priya

P.S. Don't forget to send the slides to the wider team.`,
    urls: [
      'https://slides.company.com/strategy-2024',
      'https://calendar.company.com/events/strategy-followup'
    ],
    emails: [
      'product-team@company.com'
    ],
    phones: [],
    summary: 'Positive feedback on your strategy presentation with suggestions for competitive landscape context and more detailed timeline.',
    read: false
  },
  {
    id: '4',
    from: 'recruitment@techcorp.com',
    fromName: 'Recruitment Team',
    to: 'you@company.com',
    subject: 'Interview Scheduled: Senior Engineer - May 31',
    date: '2024-05-28',
    time: '10:30 AM',
    category: 'HR',
    body: `Dear Hiring Manager,

Your interview for the Senior Engineer position has been scheduled:

Interview Details:
- Candidate: Michael Thompson
- Position: Senior Backend Engineer
- Date: May 31, 2024
- Time: 10:00 AM - 11:00 AM PST
- Location: Conference Room B (or via Zoom)
- Interviewer: You

Zoom Link: https://zoom.us/j/951234567
Meeting ID: 951 234 567

Candidate Background:
- 8 years of backend development experience
- Expertise in Node.js, Python, and Go
- Previous role: Lead Engineer at StartupXYZ

Interview Guide: https://company.com/hiring/interview-guide-backend

Please let us know if you have any questions or need to reschedule.

Best regards,
Recruitment Team`,
    urls: [
      'https://zoom.us/j/951234567',
      'https://company.com/hiring/interview-guide-backend',
      'https://company.com/candidate-profile/michael-thompson'
    ],
    emails: [
      'recruitment@company.com',
      'michael.thompson@email.com'
    ],
    phones: [],
    summary: 'Scheduled interview with Michael Thompson for Senior Backend Engineer position on May 31 at 10:00 AM PST via Zoom.',
    read: false
  },
  {
    id: '5',
    from: 'finance@techcorp.com',
    fromName: 'Finance Department',
    to: 'you@company.com',
    subject: 'Expense Report Q2 - Approval Required',
    date: '2024-05-27',
    time: '11:00 AM',
    category: 'Finance',
    body: `Hi,

Your Q2 expense report is ready for review and approval.

Summary:
- Total Amount: $3,245.67
- Items: 12
- Status: Pending Approval

Breakdown:
- Travel: $1,800.00 (flights, hotels)
- Meals & Entertainment: $945.67
- Office Supplies: $250.00
- Software Subscriptions: $250.00

All expenses have been categorized and receipts are attached. Please review and approve through the expense portal.

Link: https://expenses.company.com/reports/q2-2024

Deadline: June 2, 2024

If you have any questions about specific expenses, please let me know.

Best regards,
Finance Team`,
    urls: [
      'https://expenses.company.com/reports/q2-2024'
    ],
    emails: [
      'finance@company.com',
      'accounting@company.com'
    ],
    phones: ['+1 (415) 555-0156'],
    summary: 'Q2 expense report for $3,245.67 pending approval. Includes travel, meals, office supplies, and software subscriptions.',
    read: false
  }
];

export const getAvatarColor = (index) => {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
  ];
  return colors[index % colors.length];
};

export const getCategoryBadgeColor = (category) => {
  switch (category) {
    case 'Work':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'Alert':
      return 'bg-red-50 text-red-700 border border-red-200';
    case 'HR':
      return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'Finance':
      return 'bg-green-50 text-green-700 border border-green-200';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};
