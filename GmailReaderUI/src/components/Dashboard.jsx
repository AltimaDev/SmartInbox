import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  GraduationCap, 
  Info, 
  Mail, 
  Percent, 
  TrendingUp, 
  FileText, 
  Link2, 
  Phone, 
  ArrowUpRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Calendar,
  IndianRupee
} from 'lucide-react';

export default function Dashboard({ emails, onSelectEmail, onViewInbox }) {
  const [activeCategoryTab, setActiveCategoryTab] = useState('Payment');

  // Stats calculation
  const totalEmails = emails.length;
  
  const paymentEmails = emails.filter(e => e.category === 'Payment');
  const educationEmails = emails.filter(e => e.category === 'Education');
  const infoEmails = emails.filter(e => e.category === 'Information');
  const promoEmails = emails.filter(e => e.category === 'Promo');
  const workEmails = emails.filter(e => e.category === 'Work');

  // Total payment amount
  const totalPaymentAmount = useMemo(() => {
    return paymentEmails.reduce((sum, e) => sum + (e.totalAmount || 0), 0);
  }, [paymentEmails]);

  const formatCurrency = (amount) => {
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
    if (amount >= 1000) return '₹' + (amount / 1000).toFixed(1) + 'K';
    return '₹' + amount.toFixed(2);
  };

  const getPercentage = (count) => {
    if (totalEmails === 0) return 0;
    return Math.round((count / totalEmails) * 100);
  };

  // Unique elements extraction
  const totalUrls = emails.reduce((acc, curr) => acc + (curr.urls?.length || 0), 0);
  const totalPhones = emails.reduce((acc, curr) => acc + (curr.phones?.length || 0), 0);
  const totalEmailAddresses = emails.reduce((acc, curr) => acc + (curr.emails?.length || 0), 0);
  const totalSummaries = emails.filter(e => e.summary && e.summary.trim() !== '').length;

  // Group emails for the charts
  const categoryStats = [
    { name: 'Payment', count: paymentEmails.length, percent: getPercentage(paymentEmails.length), color: 'bg-emerald-500', textColor: 'text-emerald-500', ringColor: 'stroke-emerald-500', icon: DollarSign, gradient: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/30' },
    { name: 'Education', count: educationEmails.length, percent: getPercentage(educationEmails.length), color: 'bg-blue-500', textColor: 'text-blue-500', ringColor: 'stroke-blue-500', icon: GraduationCap, gradient: 'from-blue-500/10 to-indigo-500/10 hover:border-blue-500/30' },
    { name: 'Information', count: infoEmails.length, percent: getPercentage(infoEmails.length), color: 'bg-violet-500', textColor: 'text-violet-500', ringColor: 'stroke-violet-500', icon: Info, gradient: 'from-violet-500/10 to-purple-500/10 hover:border-violet-500/30' },
    { name: 'Promo', count: promoEmails.length, percent: getPercentage(promoEmails.length), color: 'bg-rose-500', textColor: 'text-rose-500', ringColor: 'stroke-rose-500', icon: Sparkles, gradient: 'from-rose-500/10 to-pink-500/10 hover:border-rose-500/30' },
    { name: 'Work', count: workEmails.length, percent: getPercentage(workEmails.length), color: 'bg-amber-500', textColor: 'text-amber-500', ringColor: 'stroke-amber-500', icon: FileText, gradient: 'from-amber-500/10 to-orange-500/10 hover:border-amber-500/30' }
  ];

  // Daily timeline calculations
  const dateCounts = emails.reduce((acc, curr) => {
    const date = curr.date || 'Unknown';
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const timelineData = Object.entries(dateCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7); // Last 7 dates

  const maxDailyCount = Math.max(...timelineData.map(d => d.count), 1);

  // Tab contents
  const getTabEmails = () => {
    switch (activeCategoryTab) {
      case 'Payment': return paymentEmails;
      case 'Education': return educationEmails;
      case 'Information': return infoEmails;
      case 'Promo': return promoEmails;
      case 'Work': return workEmails;
      default: return [];
    }
  };

  const currentTabEmails = getTabEmails();
  const currentTabColor = categoryStats.find(c => c.name === activeCategoryTab)?.textColor || 'text-brand-primary';
  const currentTabBg = categoryStats.find(c => c.name === activeCategoryTab)?.color || 'bg-brand-primary';

  // Extract recent links
  const recentLinks = emails
    .filter(e => e.urls && e.urls.length > 0)
    .flatMap(e => e.urls.map(url => ({ url, subject: e.subject, from: e.fromName, date: e.date })))
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto bg-brand-light p-8">
      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">Analytics Dashboard</h2>
          <p className="text-brand-text-secondary text-sm">Real-time intelligence from your inbox</p>
        </div>
        <button
          onClick={onViewInbox}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-border text-brand-text hover:bg-gray-50 rounded shadow-sm text-sm font-medium transition-all hover:scale-[1.02]"
        >
          <Mail className="w-4 h-4 text-brand-primary" />
          View Full Inbox
        </button>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        {categoryStats.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategoryTab === cat.name;
          return (
            <div
              key={cat.name}
              onClick={() => setActiveCategoryTab(cat.name)}
              className={`cursor-pointer bg-white border rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-gradient-to-br ${cat.gradient} ${
                isSelected ? `ring-2 ring-offset-2 ring-brand-primary border-transparent` : 'border-brand-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${cat.color} text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-brand-text-secondary">
                  <Percent className="w-3.5 h-3.5" />
                  {cat.percent}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-brand-text-secondary mb-1">{cat.name}</h3>
              <p className="text-2xl font-bold text-brand-text">{cat.count}</p>
              {cat.name === 'Payment' && totalPaymentAmount > 0 && (
                <div className="mt-2 pt-2 border-t border-emerald-200/50">
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-600">
                      {formatCurrency(totalPaymentAmount)}
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-text-secondary mt-0.5">Total Amount</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts & Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Chart 1: Source Distribution Donut Chart */}
        <div className="bg-white p-6 border border-brand-border rounded-xl shadow-sm flex flex-col items-center">
          <h3 className="text-base font-semibold text-brand-text mb-6 w-full flex items-center justify-between">
            <span>Source Share</span>
            <span className="text-xs text-brand-text-secondary font-normal">All Loaded Emails</span>
          </h3>
          
          {totalEmails === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-brand-text-secondary h-48">
              No email data available
            </div>
          ) : (
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* SVG Circle chart */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="10" />
                {(() => {
                  let accumulatedPercent = 0;
                  return categoryStats.map((cat, idx) => {
                    const strokeDasharray = `${cat.percent} ${100 - cat.percent}`;
                    const strokeDashoffset = 100 - accumulatedPercent + 25; // Adjusted to match angle rotation
                    accumulatedPercent += cat.percent;
                    if (cat.count === 0) return null;
                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        className={cat.ringColor}
                        strokeWidth="10"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        pathLength="100"
                        strokeLinecap="round"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-brand-text">{totalEmails}</span>
                <span className="text-xxs uppercase tracking-wider text-brand-text-secondary font-semibold">Total</span>
              </div>
            </div>
          )}

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-4 mt-6 w-full">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <span className={`w-3 h-3 rounded-full ${cat.color} flex-shrink-0`}></span>
                <span className="text-brand-text font-medium truncate">{cat.name}</span>
                <span className="text-brand-text-secondary ml-auto">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Daily Activity Bar Chart */}
        <div className="bg-white p-6 border border-brand-border rounded-xl shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="text-base font-semibold text-brand-text mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-primary" />
              Daily Email Traffic
            </span>
            <span className="text-xs text-brand-text-secondary font-normal">Last 7 Days</span>
          </h3>

          {timelineData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-brand-text-secondary h-48">
              No timeline data available
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-end">
              <div className="h-44 flex items-end gap-6 px-4">
                {timelineData.map((data, idx) => {
                  const heightPercent = Math.max(10, (data.count / maxDailyCount) * 100);
                  const displayDate = new Date(data.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 bg-brand-text text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                        {data.count} emails
                      </div>
                      
                      {/* Bar */}
                      <div 
                        style={{ height: `${heightPercent}%` }} 
                        className="w-full bg-gradient-to-t from-brand-primary/80 to-brand-primary rounded-t-md hover:opacity-80 transition-all duration-300 shadow-sm"
                      ></div>
                      
                      {/* Date label */}
                      <span className="text-xxs font-medium text-brand-text-secondary mt-3 whitespace-nowrap">
                        {displayDate}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-brand-border mt-4 pt-3 flex justify-between text-xxs text-brand-text-secondary px-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Chronological Volume
                </span>
                <span>Max Peak: {maxDailyCount} / day</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Extraction Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Insight Cards */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-5 border border-brand-border rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Links Extracted</h4>
              <p className="text-2xl font-bold text-brand-text">{totalUrls}</p>
            </div>
          </div>

          <div className="bg-white p-5 border border-brand-border rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Phone Numbers</h4>
              <p className="text-2xl font-bold text-brand-text">{totalPhones}</p>
            </div>
          </div>

          <div className="bg-white p-5 border border-brand-border rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">AI Summaries Created</h4>
              <p className="text-2xl font-bold text-brand-text">{totalSummaries}</p>
            </div>
          </div>
        </div>

        {/* Recent Resources / Links Panel */}
        <div className="bg-white p-6 border border-brand-border rounded-xl shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="text-base font-semibold text-brand-text mb-4 flex items-center justify-between">
            <span>Extracted Web Links & Resources</span>
            <span className="text-xs text-brand-text-secondary font-normal">Ready to navigate</span>
          </h3>

          <div className="flex-1 divide-y divide-brand-border overflow-y-auto max-h-56">
            {recentLinks.length === 0 ? (
              <div className="flex items-center justify-center text-sm text-brand-text-secondary py-8 h-full">
                No web resources found in recent emails.
              </div>
            ) : (
              recentLinks.map((link, idx) => (
                <div key={idx} className="py-3 flex items-start justify-between gap-4 group">
                  <div className="min-w-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-brand-primary hover:underline truncate block flex items-center gap-1.5"
                    >
                      {link.url}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <span className="text-xs text-brand-text-secondary block mt-0.5 truncate">
                      Found in: <strong className="text-brand-text font-medium">{link.subject}</strong> from {link.from}
                    </span>
                  </div>
                  <span className="text-xxs bg-brand-light text-brand-text-secondary px-2 py-0.5 rounded border border-brand-border flex-shrink-0">
                    {link.date}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Category Deep-Dive Table */}
      <div className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden mb-4">
        <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${currentTabBg}`}></span>
            <h3 className="text-lg font-bold text-brand-text">
              {activeCategoryTab} Source Deep-Dive
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {activeCategoryTab === 'Payment' && totalPaymentAmount > 0 && (
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                <IndianRupee className="w-3 h-3" />
                {totalPaymentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
            <span className="text-xs font-semibold bg-brand-light text-brand-text-secondary border border-brand-border px-3 py-1 rounded-full">
              {currentTabEmails.length} messages found
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {currentTabEmails.length === 0 ? (
            <div className="text-center py-12 text-sm text-brand-text-secondary">
              No emails categorized under <strong>{activeCategoryTab}</strong> found in current filters.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-light text-brand-text-secondary text-xs uppercase font-bold tracking-wider border-b border-brand-border">
                  <th className="px-6 py-3.5">Sender</th>
                  <th className="px-6 py-3.5">Subject</th>
                  <th className="px-6 py-3.5">Date</th>
                  {activeCategoryTab === 'Payment' && <th className="px-6 py-3.5 text-right">Amount</th>}
                  <th className="px-6 py-3.5">AI Extracts</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {currentTabEmails.map((email) => {
                  const urlCount = email.urls?.length || 0;
                  const phoneCount = email.phones?.length || 0;
                  return (
                    <tr key={email.id} className="hover:bg-brand-light/50 transition-colors text-sm text-brand-text">
                      <td className="px-6 py-4 font-semibold max-w-[180px] truncate">
                        {email.fromName}
                      </td>
                      <td className="px-6 py-4 font-medium max-w-[320px] truncate">
                        {email.subject}
                      </td>
                      <td className="px-6 py-4 text-brand-text-secondary whitespace-nowrap">
                        {email.date} at {email.time}
                      </td>
                      {activeCategoryTab === 'Payment' && (
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {email.totalAmount > 0 ? (
                            <span className="text-sm font-bold text-emerald-600 flex items-center justify-end gap-0.5">
                              <IndianRupee className="w-3.5 h-3.5" />
                              {email.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-xs text-brand-text-secondary">—</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {urlCount > 0 && (
                            <span className="text-xxs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Link2 className="w-3 h-3" />
                              {urlCount} Links
                            </span>
                          )}
                          {phoneCount > 0 && (
                            <span className="text-xxs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {phoneCount} Phones
                            </span>
                          )}
                          {!urlCount && !phoneCount && (
                            <span className="text-xxs text-brand-text-secondary">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectEmail(email)}
                          className="text-xs font-semibold text-brand-primary hover:text-blue-700 inline-flex items-center gap-1 group/btn"
                        >
                          Open in Inbox
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
