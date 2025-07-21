"use client";

export default function HeroInfo() {
  return (
    <div className="w-full bg-[--background-color] text-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-lg pb-16 pt-16">
        <div className="bg-green-950/60 rounded-2xl p-10 shadow-lg flex flex-col h-full">
          <h2 className="text-3xl font-semibold text-[--color-primary] mb-3">🔍 What is DarkHorse?</h2>
          <p className="text-xl">
            DarkHorse is an AI-powered tool that collects and visualizes personal, technical, and environmental data your browser leaks online. It transforms metadata into a rich image and readable fingerprint — helping you understand what others can infer about you, instantly.
          </p>
        </div>
        <div className="bg-green-950/60 rounded-2xl p-10 shadow-lg flex flex-col h-full">
          <h2 className="text-3xl font-semibold text-[--color-primary] mb-3">✅ Consent-Based Scanning</h2>
          <p className="text-xl">
            When you sign up for an account and perform a scan (which starts automatically if you haven&apos;t done one yet),
            your scan data, Nmap output, image visualizations, and recommendations are securely saved to our database.
            This is done to provide you with a personalized visual history and timeline of your scans, allowing you to
            track changes and review past analyses.
          </p>
        </div>
        <div className="bg-green-950/60 rounded-2xl p-10 shadow-lg flex flex-col h-full">
          <h2 className="text-3xl font-semibold text-[--color-primary] mb-3">🌐 Why Online Exposure Matters</h2>
          <p className="text-xl">
            Your browser gives away more than you think — from fonts and hardware to battery life and GPU models. When combined, these traits can uniquely identify and profile you. DarkHorse visualizes this exposure, so you&apos;re no longer in the dark.
          </p>
        </div>
        <div className="bg-green-950/60 rounded-2xl p-10 shadow-lg flex flex-col h-full">
          <h2 className="text-3xl font-semibold text-[--color-primary] mb-3">📊 What We Use</h2>
          <p className="text-xl">
            DarkHorse collects metadata including IP address, location, device type, browser capabilities, permissions, WebGL/Canvas fingerprints, and (if enabled) open port results via Nmap. All of this is then used to generate a uniquely AI-powered image reflecting your digital fingerprint.
          </p>
        </div>
      </div>
    </div>
  );
} 