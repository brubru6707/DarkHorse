"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataPolicyDisclaimer from "@/components/DataPolicyDisclaimer";
import HeroMain from "@/components/home/HeroMain";
import HeroInfo from "@/components/home/HeroInfo";
import DemoVideo from "@/components/home/DemoVideo";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <DataPolicyDisclaimer />
      <div className="flex-grow">
          <HeroMain />
          <DemoVideo />
          <HeroInfo />
      </div>
      <Footer />
    </main>
  );
}
