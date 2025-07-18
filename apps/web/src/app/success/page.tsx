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
    if (userId && isClerkLoaded && sessionId) {
      setMessage('Payment successful! Your Pro plan is now active.');
      upgradeUserPlan({ userId: userId});
    }
    else {
      router.push('/');
    }
  }, [sessionId, userId, upgradeUserPlan]);

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