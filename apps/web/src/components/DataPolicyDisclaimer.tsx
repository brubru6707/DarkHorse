"use client";

import React, { useState, useEffect } from 'react';

export default function DataPolicyDisclaimer() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const disclaimerClosed = localStorage.getItem('dataPolicyDisclaimerClosed');
    if (disclaimerClosed === 'true') {
      setIsVisible(false);
    }
    setIsLoaded(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('dataPolicyDisclaimerClosed', 'true');
  };

  // Don't render anything until we've checked localStorage
  if (!isLoaded) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-black p-4 mt-4 mb-4 border border-green-700 rounded-lg shadow-lg text-green-300 mx-auto max-w-4xl relative">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-green-400 hover:text-green-300 text-xl font-bold cursor-pointer transition-colors duration-200"
        aria-label="Close data policy disclaimer"
      >
        ×
      </button>
      <h3 className="text-lg font-bold text-green-400 mb-2 text-center">Your Data Privacy</h3>
      <p className="text-sm md:text-base leading-relaxed text-center">
        When you sign up for an account and perform a scan (which starts automatically if you haven&apos;t done one yet),
        your scan data, Nmap output, image visualizations, and recommendations are securely saved to our database.
        This is done to provide you with a personalized visual history and timeline of your scans, allowing you to
        track changes and review past analyses.
      </p>
      <p className="text-sm md:text-base leading-relaxed mt-2 text-center">
        Your privacy is important to us. You can request to have your data deleted from our database at any time.
        Please contact support for data deletion requests.
      </p>
    </div>
  );
}
