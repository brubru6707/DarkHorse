"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from "@packages/backend/convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const { userId, isLoaded: isClerkLoaded } = useAuth();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [message, setMessage] = useState('Processing your payment...');
  const upgradeUserPlan = useMutation(api.users.upgradeUserPlan);

  const router = useRouter();

  useEffect(() => {
    const handleSuccessfulPayment = async () => {
      if (!userId || !isClerkLoaded || !sessionId) {
        // If essential data is missing, redirect to home
        router.push('/');
        return;
      }

      try {
        // 1. Call your Next.js API route to fetch Stripe session details
        const response = await fetch(`/api/get-stripe-session-details?sessionId=${sessionId}`);
        const data = await response.json();

        if (response.ok && data.stripeCustomerId) {
          // 2. Use the retrieved stripeCustomerId to upgrade the user's plan in Convex
          await upgradeUserPlan({
            userId: userId,
            stripeCustomerId: data.stripeCustomerId,
          });
          setMessage('Payment successful! Your Pro plan is now active.');
        } else {
          setMessage(`Payment processing failed: ${data.message || 'Could not retrieve session details.'}`);
          console.error('Failed to get Stripe session details:', data.message);
        }
      } catch (error) {
        console.error('Error during success page processing:', error);
        setMessage('An error occurred during payment processing. Please contact support.');
      }
    };

    // Only run this effect once we have the userId, Clerk loaded, and sessionId
    if (isClerkLoaded && userId && sessionId) {
      handleSuccessfulPayment();
    } else if (isClerkLoaded && !userId) {
      // If Clerk is loaded but no userId, means user is not logged in, redirect
      router.push('/sign-in'); // Or your main page
    }
  }, [sessionId, userId, isClerkLoaded, upgradeUserPlan, router]);

  return (
    <>
      <Header />
      <div className="min-h-screen text-green-300 flex flex-col items-center justify-center py-12 px-4 font-inter text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-6">
          Payment Status
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl">
          {message}
        </p>
        <p className="text-md text-gray-500">
          You can now return to your dashboard or continue exploring DarkHorse.
        </p>
        <a href="/" className="mt-8 bg-green-500 text-black border border-green-500 rounded-md px-8 py-3 text-lg font-semibold hover:bg-green-600 transition-colors duration-200">
          Go to Dashboard
        </a>
      </div>
      <Footer />
    </>
  );
}