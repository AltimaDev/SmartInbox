import React from 'react';
import { X } from 'lucide-react';

export default function ErrorBanner({ message, onClose }) {
  return (
    <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between">
      <p className="text-sm text-red-700">{message}</p>
      <button
        onClick={onClose}
        className="text-red-700 hover:text-red-900"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
