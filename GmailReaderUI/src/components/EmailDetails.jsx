import React, { useState } from 'react';
import { Download, Link2, Mail, Phone, MessageSquare } from 'lucide-react';

export default function EmailDetails({ email, onExportJSON, onExportCSV }) {
  const [expandedSections, setExpandedSections] = useState({
    urls: true,
    emails: true,
    phones: true,
    summary: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-light">
        <p className="text-brand-text-secondary">Select an email to view details</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Email Header */}
      <div className="border-b border-brand-border p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-brand-text mb-2">
              {email.subject}
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-brand-text-secondary">From:</span>
                <span className="text-sm text-brand-text font-medium">
                  {email.fromName}
                </span>
              </div>
              <span className="text-xs text-brand-text-secondary">•</span>
              <span className="text-sm text-brand-text-secondary">
                {email.date} at {email.time}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onExportJSON}
              className="p-2 rounded border border-brand-border text-brand-text-secondary hover:text-brand-text hover:bg-brand-light transition-colors"
              title="Export as JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onExportCSV}
              className="p-2 rounded border border-brand-border text-brand-text-secondary hover:text-brand-text hover:bg-brand-light transition-colors"
              title="Export as CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-brand-text-secondary mb-1">To: {email.to}</p>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose prose-sm max-w-none mb-8">
          {(() => {
            const bodyContent = email.fullBody || email.body || '';
            const isHTML = /<\s*(html|table|div|tr|td|p|br|span|a|img|head|body)\b[^>]*>/i.test(bodyContent);
            
            if (isHTML) {
              return (
                <iframe
                  srcDoc={bodyContent}
                  title="Email content"
                  sandbox="allow-popups allow-popups-to-escape-sandbox"
                  style={{
                    width: '100%',
                    minHeight: '500px',
                    border: '1px solid var(--color-border, #e5e7eb)',
                    borderRadius: '8px',
                    background: '#fff',
                  }}
                  onLoad={(e) => {
                    // Auto-resize iframe to fit content
                    try {
                      const doc = e.target.contentDocument;
                      if (doc && doc.body) {
                        e.target.style.height = Math.max(500, doc.body.scrollHeight + 40) + 'px';
                      }
                    } catch (err) {
                      // Cross-origin restriction, keep default height
                    }
                  }}
                />
              );
            }

            return (
              <div className="text-brand-text whitespace-pre-wrap leading-relaxed text-sm">
                {bodyContent}
              </div>
            );
          })()}
        </div>

        {/* Extracted Data Sections */}
        <div className="space-y-4">
          {/* AI Summary */}
          {email.summary && (
            <div className="border border-brand-border rounded">
              <button
                onClick={() => toggleSection('summary')}
                className="w-full flex items-center justify-between p-4 hover:bg-brand-light transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-brand-primary" />
                  <h3 className="font-semibold text-brand-text">AI Summary</h3>
                </div>
                <span className={`transform transition-transform ${expandedSections.summary ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSections.summary && (
                <div className="px-4 pb-4 border-t border-brand-border">
                  <p className="text-sm text-brand-text-secondary bg-blue-50 p-3 rounded border border-blue-100">
                    {email.summary}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* URLs */}
          {email.urls && email.urls.length > 0 && (
            <div className="border border-brand-border rounded">
              <button
                onClick={() => toggleSection('urls')}
                className="w-full flex items-center justify-between p-4 hover:bg-brand-light transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Link2 className="w-4 h-4 text-brand-primary" />
                  <h3 className="font-semibold text-brand-text">
                    URLs ({email.urls.length})
                  </h3>
                </div>
                <span className={`transform transition-transform ${expandedSections.urls ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSections.urls && (
                <div className="px-4 pb-4 border-t border-brand-border space-y-2">
                  {email.urls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-brand-primary hover:underline truncate p-2 bg-blue-50 rounded border border-blue-100"
                      title={url}
                    >
                      {url}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Email Addresses */}
          {email.emails && email.emails.length > 0 && (
            <div className="border border-brand-border rounded">
              <button
                onClick={() => toggleSection('emails')}
                className="w-full flex items-center justify-between p-4 hover:bg-brand-light transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-primary" />
                  <h3 className="font-semibold text-brand-text">
                    Email Addresses ({email.emails.length})
                  </h3>
                </div>
                <span className={`transform transition-transform ${expandedSections.emails ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSections.emails && (
                <div className="px-4 pb-4 border-t border-brand-border space-y-2">
                  {email.emails.map((addr, idx) => (
                    <div
                      key={idx}
                      className="text-sm text-brand-text p-2 bg-green-50 rounded border border-green-100 truncate"
                      title={addr}
                    >
                      {addr}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Phone Numbers */}
          {email.phones && email.phones.length > 0 && (
            <div className="border border-brand-border rounded">
              <button
                onClick={() => toggleSection('phones')}
                className="w-full flex items-center justify-between p-4 hover:bg-brand-light transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-primary" />
                  <h3 className="font-semibold text-brand-text">
                    Phone Numbers ({email.phones.length})
                  </h3>
                </div>
                <span className={`transform transition-transform ${expandedSections.phones ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSections.phones && (
                <div className="px-4 pb-4 border-t border-brand-border space-y-2">
                  {email.phones.map((phone, idx) => (
                    <div
                      key={idx}
                      className="text-sm text-brand-text p-2 bg-purple-50 rounded border border-purple-100"
                    >
                      {phone}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
