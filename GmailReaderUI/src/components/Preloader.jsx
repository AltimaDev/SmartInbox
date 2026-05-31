import React, { useEffect, useState } from 'react';

export default function Preloader({ onFinish }) {
  const text = 'SmartInbox';

  const [displayedText, setDisplayedText] = useState('');
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    let index = 0;

    const typing = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typing);

        setTimeout(() => {
          setShowLogo(true);

          setTimeout(() => {
            onFinish();
          }, 1000);
        }, 500);
      }
    }, 120);

    return () => clearInterval(typing);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      {!showLogo ? (
        <h1 className="text-5xl font-bold tracking-wide text-gray-900">
          {displayedText}
          <span className="animate-pulse">|</span>
        </h1>
      ) : (
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <img
            src="/logo.png"
            alt="SmartInbox"
            className="w-32 h-32 object-contain"
          />

          <h1 className="text-4xl font-bold">
            SmartInbox
          </h1>
        </div>
      )}
    </div>
  );
}