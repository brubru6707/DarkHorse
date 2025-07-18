"use client";

import React, { useState, useCallback } from 'react';
import { useAuth } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CancelSubscriptionPage() {
  const { userId, isLoaded: isClerkLoaded } = useAuth();
  const [cancellationStatus, setCancellationStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleCancelSubscription = useCallback(async () => {
    if (!isClerkLoaded || !userId) {
      setMessage("Please log in to manage your subscription.");
      return;
    }

    setCancellationStatus('processing');
    setMessage('Processing your cancellation...');

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setCancellationStatus('success');
        setMessage('Your subscription has been successfully scheduled for cancellation.');
      } else {
        setCancellationStatus('error');
        setMessage(`Cancellation failed: ${data.message || 'An unknown error occurred.'}`);
        console.error('Cancellation API error:', data.message);
      }
    } catch (error) {
      setCancellationStatus('error');
      setMessage('An error occurred while trying to cancel your subscription. Please try again or contact support.');
      console.error('Client-side cancellation error:', error);
    }
  }, [userId, isClerkLoaded]);

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background-color)] px-2 py-6">
        <div className="w-full max-w-md bg-[#101610] border border-green-700 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center gap-6 mt-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-400 mb-2 text-center">Manage Subscription</h1>
          {cancellationStatus === 'idle' && (
            <>
              <p className="text-base sm:text-lg text-gray-300 mb-4 max-w-xs sm:max-w-none text-center">
                Are you sure you want to cancel your <span className="font-semibold text-green-300">Pro</span> subscription?
              </p>
              <button
                onClick={handleCancelSubscription}
                disabled={!isClerkLoaded || !userId}
                className="cursor-pointer w-full sm:w-auto bg-red-600 text-white border border-red-600 rounded-lg px-6 py-3 text-base sm:text-lg font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Cancel Subscription
              </button>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
                Your service will continue until the end of your current billing period.
              </p>
            </>
          )}
          {cancellationStatus === 'processing' && (
            <p className="text-base sm:text-lg text-yellow-400 mb-4 text-center animate-pulse">{message}</p>
          )}
          {cancellationStatus === 'success' && (
            <>
              <p className="text-base sm:text-lg text-green-400 mb-4 text-center">
                {message}
              </p>
              <p className="text-sm text-gray-400 text-center">
                Your Pro features will remain active until the end of your current billing cycle.
              </p>
              <a href="/" className="w-full sm:w-auto mt-6 bg-green-500 text-black border border-green-500 rounded-lg px-6 py-3 text-base sm:text-lg font-semibold hover:bg-green-600 transition-colors duration-200 text-center block focus:outline-none focus:ring-2 focus:ring-green-400">
                Go to the Homepage
              </a>
            </>
          )}
          {cancellationStatus === 'error' && (
            <>
              <p className="text-base sm:text-lg text-red-500 mb-4 text-center">
                {message}
              </p>
              <p className="text-sm text-gray-400 text-center">
                Please try again or contact support if the issue persists.
              </p>
              <button
                onClick={handleCancelSubscription}
                className="w-full sm:w-auto mt-6 bg-green-500 text-black border border-green-500 rounded-lg px-6 py-3 text-base sm:text-lg font-semibold hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}