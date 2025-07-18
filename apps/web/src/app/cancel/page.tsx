import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CancelPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen text-green-300 flex flex-col items-center justify-center py-12 px-4 font-inter text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-red-400 mb-6">
          Payment Canceled
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl">
          Your payment was not completed. You can try again or contact support if you encountered any issues.
        </p>
        <p className="text-md text-gray-500">
          No charges were made. Feel free to explore our free tier.
        </p>
        <a href="/pricing" className="mt-8 bg-gray-700 text-green-300 border border-gray-700 rounded-md px-8 py-3 text-lg font-semibold hover:bg-gray-600 transition-colors duration-200">
          Return to Pricing
        </a>
      </div>
      <Footer />
    </>
  );
}