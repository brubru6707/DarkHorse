"use client";

import { useRouter } from "next/navigation";

export default function HeroMain() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 text-white text-center bg-gradient-to-b from-[--background-color] via-green-900 via-70% to-green-700">
      <h1 className="text-7xl font-extrabold mb-6 text-[--color-primary]">DarkHorse — See What the Web Sees</h1>
      <p className="text-2xl max-w-3xl mx-auto mb-10">
        A powerful privacy visualization tool that reveals just how much of your digital fingerprint is exposed the moment you load a website.
      </p>
      <button className="scan-button mb-16 cursor-pointer" onClick={() => router.push("/scan")}>Start Your Scan</button>
    </div>
  );
} 