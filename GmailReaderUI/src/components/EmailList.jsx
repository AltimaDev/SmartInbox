import React from 'react';
import { getAvatarColor, getCategoryBadgeColor } from '../data';
import { htmlToText } from 'html-to-text';

export default function EmailList({ emails, selectedEmail, onSelectEmail }) {
  const getInitials = (name) => {
    return (name || '')
      .split(' ')
      .map(n => n?.[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // ✅ Clean HTML safely
  const cleanBody = (html) => {
    if (!html) return '';
    return htmlToText(html, {
      wordwrap: false,
      selectors: [
        { selector: 'script', format: 'skip' },
        { selector: 'style', format: 'skip' }
      ]
    });
  };

  // ✅ Safe time formatter
  const formatTime = (time) => {
    if (!time) return '--';

    const date = new Date(time);

    if (isNaN(date.getTime())) return '--';

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-96 border-r border-brand-border bg-white overflow-y-auto">
      {emails.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-brand-text-secondary">No emails found</p>
        </div>
      ) : (
        <div className="divide-y divide-brand-border">
          {emails.map((email, index) => (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email)}
              className={`p-4 cursor-pointer transition-colors ${
                selectedEmail?.id === email.id
                  ? 'bg-blue-50 border-l-4 border-brand-primary'
                  : 'hover:bg-brand-light'
              }`}
            >
              <div className="flex gap-3">

                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${getAvatarColor(
                    index
                  )}`}
                >
                  {getInitials(email.fromName)}
                </div>

                {/* Email Info */}
                <div className="flex-1 min-w-0">

                  {/* Sender + Time */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-brand-text truncate">
                      {email.fromName || 'Unknown'}
                    </p>

                    <span className="text-xs text-brand-text-secondary flex-shrink-0">
                      {formatTime(email.time)}
                    </span>
                  </div>

                  {/* Subject */}
                  <p className="text-sm text-brand-text truncate mb-2">
                    {email.subject || '(No Subject)'}
                  </p>

                  {/* Body preview + category */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-brand-text-secondary truncate">
                      {cleanBody(email.body).substring(0, 60)}
                      {cleanBody(email.body).length > 60 ? '...' : ''}
                    </p>

                    <span
                      className={`text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${getCategoryBadgeColor(
                        email.category
                      )}`}
                    >
                      {email.category || 'General'}
                    </span>
                  </div>
                </div>

                {/* Unread Indicator */}
                {!email.read && (
                  <div className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0 mt-1"></div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}