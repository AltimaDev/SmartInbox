import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

export default function Sidebar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  emails,
  onRefresh,
  loading
}) {
  const categories = ['All', 'Payment', 'Education', 'Information', 'Promo', 'Work'];
  const unreadCount = emails.filter(e => !e.read).length;

  return (
    <div className="w-80 border-r border-brand-border bg-white flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-brand-border">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-brand-text-secondary" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={loading}
            className="w-full pl-10 pr-4 py-2 rounded border border-brand-border bg-brand-light text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:opacity-50"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-brand-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-brand-text flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </h3>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 text-brand-text-secondary ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => onCategoryChange(e.target.value)}
                disabled={loading}
                className="w-4 h-4 accent-brand-primary disabled:opacity-50"
              />
              <span className="text-sm text-brand-text group-hover:text-brand-primary">
                {category}
              </span>
              {category === 'All' && unreadCount > 0 && (
                <span className="ml-auto text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="p-4 border-b border-brand-border">
        <h3 className="text-sm font-semibold text-brand-text mb-3">Date Range</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-brand-text-secondary">From</label>
            <input
              type="date"
              disabled={loading}
              className="w-full px-3 py-2 rounded border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs text-brand-text-secondary">To</label>
            <input
              type="date"
              disabled={loading}
              className="w-full px-3 py-2 rounded border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Sender Filter */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-brand-text mb-3">Sender</h3>
        <input
          type="text"
          placeholder="Filter by sender..."
          disabled={loading}
          className="w-full px-3 py-2 rounded border border-brand-border text-sm text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50"
        />
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-brand-border mt-auto space-y-2">
        <button 
          disabled={loading}
          className="w-full px-4 py-2 rounded border border-brand-border text-sm font-medium text-brand-text hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Fetching...' : 'Fetch Emails'}
        </button>
      </div>
    </div>
  );
}
