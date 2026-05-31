import React from 'react';
import { MoreVertical } from 'lucide-react';

export default function Header({
  connected,
  onConnect,
  isLoading,
  activeTab,
  onTabChange,
}) {
  return (
    <header className="border-b border-brand-border bg-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        
        {/* Left Side */}
        <div className="flex items-center gap-8">
          
          {/* Logo + Brand */}
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl p-1 shadow-md border border-gray-100">
              <img
                src="/logo.png"
                alt="SmartInbox Logo"
                className="w-16 h-16 object-contain"
              />
            </div>

            <h1 className="text-2xl font-bold text-brand-text tracking-tight">
              SmartInbox
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-brand-light p-1 rounded-lg border border-brand-border shadow-inner">
            <button
              onClick={() => onTabChange?.('inbox')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeTab === 'inbox'
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-brand-text-secondary hover:text-brand-text'
              }`}
            >
              Inbox
            </button>

            <button
              onClick={() => onTabChange?.('dashboard')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-brand-text-secondary hover:text-brand-text'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />

            <span className="text-sm text-brand-text">
              {connected ? 'Gmail Connected' : 'Disconnected'}
            </span>
          </div>

          <button
            onClick={onConnect}
            disabled={isLoading}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              connected
                ? 'bg-brand-light text-brand-text border border-brand-border hover:bg-gray-100 disabled:opacity-50'
                : 'bg-brand-primary text-white hover:bg-blue-600 disabled:opacity-50'
            }`}
          >
            {isLoading
              ? 'Loading...'
              : connected
              ? 'Reconnect'
              : 'Connect Gmail'}
          </button>

          <button className="text-brand-text-secondary hover:text-brand-text p-2">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}