'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DataPolicyDisclaimer from '@/components/DataPolicyDisclaimer';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoPro = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        console.error('Stripe.js failed to load.');
        setErrorMessage('Stripe payment system failed to load. Please try again.');
        return;
      }

      const priceId = 'price_1RWvmMKMKPh8TPXqQNgzwXkdc';

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const session = await response.json();

      if (response.ok) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (error) {
          console.error('Error redirecting to Stripe Checkout:', error);
          setErrorMessage(`Error redirecting to checkout: ${error.message}`);
        }
      } else {
        console.error('Failed to create Stripe Checkout session:', session.message);
        setErrorMessage(`Failed to start checkout: ${session.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <DataPolicyDisclaimer />
      <div className="min-h-screen text-green-300 flex flex-col items-center py-12 px-4 font-inter">
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-8 text-center">
          Flexible Plans for Your Security Needs
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-12 text-center max-w-2xl">
          Start with our free scans to experience the power of AI-driven network analysis.
          When you're ready for more, our Pro plan offers comprehensive benefits.
        </p>

        {errorMessage && (
          <div className="bg-red-800 text-white p-4 rounded-md mb-8 max-w-xl text-center">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <div className="bg-gray-900 border border-green-700 rounded-xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-green-500/50 transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-green-400 mb-4">Free</h2>
            <p className="text-5xl font-extrabold text-white mb-6">
              $0<span className="text-lg font-normal text-gray-400">/month</span>
            </p>
            <ul className="text-lg text-gray-300 space-y-3 mb-8">
              <li className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                3 Scans
              </li>
            </ul>
          </div>

          <div className="bg-gray-900 border-2 border-green-500 rounded-xl p-8 flex flex-col items-center text-center shadow-xl shadow-green-700/50 relative transform scale-105">
            <h2 className="text-3xl font-bold text-green-400 mb-4">Pro</h2>
            <p className="text-5xl font-extrabold text-white mb-6">
              $9.99<span className="text-lg font-normal text-gray-400">/month</span>
            </p>
            <ul className="text-lg text-gray-300 space-y-3 mb-8">
              <li className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                30 Scans / month
              </li>
            </ul>
            <button
              className="bg-green-500 text-black border border-green-500 rounded-md px-8 py-3 text-lg font-semibold hover:bg-green-600 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoPro}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Go Pro'}
            </button>
          </div>
        </div>

        <div className="mt-16 text-center max-w-2xl">
          <h3 className="text-2xl font-bold text-green-400 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4 text-left">
            <div>
              <h4 className="font-semibold text-green-300">What happens after my 3 free scans?</h4>
              <p className="text-gray-400">
                After you've used your initial 3 free scans, you'll need to subscribe to our Pro plan to continue using the service.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-green-300">What if I need more than 30 scans in a month?</h4>
              <p className="text-gray-400">
                Currently, the Pro plan includes 30 scans per month. If you consistently need more, please contact us, and we can discuss custom solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-green-300">Can I cancel my subscription at any time?</h4>
              <p className="text-gray-400">
                Yes, you can cancel your Pro subscription at any time. Your access will continue until the end of your current billing cycle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-green-300">How do I request data deletion?</h4>
              <p className="text-gray-400">
                You can request deletion of your stored scan data by contacting our support team directly. We will process your request promptly.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
