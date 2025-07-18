"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataPolicyDisclaimer from "@/components/DataPolicyDisclaimer";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <DataPolicyDisclaimer />
      <div className="flex-grow">
        <Hero />
      </div>
      <Footer />
    </main>
  );
}
