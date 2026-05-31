import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-brand-light">
      <div className="text-center">
        <div className="inline-flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-brand-text-secondary mt-4">{message}</p>
      </div>
    </div>
  );
}
