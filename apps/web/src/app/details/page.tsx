import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataPolicyDisclaimer from "@/components/DataPolicyDisclaimer";

const dataFields = [
  {
    title: "IP Address",
    danger:
      "Your IP can reveal your location, ISP, and open you to network scans like nmap.",
  },
  {
    title: "City / Region / Country",
    danger:
      "Your general location is exposed — often accurate within a few miles, which could compromise your anonymity.",
  },
  {
    title: "Canvas Fingerprint",
    danger:
      "A unique fingerprint can be generated based on how your system renders invisible images, allowing for user tracking even without cookies.",
  },
  {
    title: "GPU Information",
    danger:
      "WebGL exposes your graphics card model, which contributes to fingerprinting and device uniqueness.",
  },
  {
    title: "Fonts",
    danger:
      "The list of installed fonts can be used to uniquely identify users, especially when combined with other metadata.",
  },
  {
    title: "Features (e.g., clipboard, notifications)",
    danger:
      "Exposed capabilities show what your browser can access, which could be exploited if you're tricked into granting permissions.",
  },
  {
    title: "Permissions (camera, mic, etc.)",
    danger:
      "Even if not yet granted, knowing what your browser can ask for helps attackers plan targeted exploits.",
  },
  {
    title: "User Agent & Platform",
    danger:
      "Exposes your operating system, browser version, and can be used to fingerprint you or tailor attacks.",
  },
  {
    title: "Screen Details",
    danger:
      "Your screen size, orientation, and pixel density can contribute to a unique fingerprint.",
  },
  {
    title: "Languages",
    danger:
      "Language preferences can hint at your region and make fingerprinting more accurate.",
  },
  {
    title: "Hardware Concurrency & Memory",
    danger:
      "Knowing your number of CPU threads and memory gives insight into your device class and performance.",
  },
  {
    title: "Battery Status",
    danger:
      "Battery level and charging status have been exploited for low-level tracking in the past.",
  },
  {
    title: "Connection Type & Speed (RTT, Downlink)",
    danger:
      "These network details can reveal your environment (e.g., mobile vs fiber) and affect fingerprinting accuracy.",
  },
  {
    title: "Referrer & URL",
    danger:
      "Exposes where you came from and where you are — helps attackers profile browsing behavior.",
  },
  {
    title: "Ad Block Detection",
    danger:
      "Knowing if you block ads helps sites adjust their strategies and may contribute to a fingerprint.",
  },
  {
    title: "Timezone",
    danger:
      "Timezone is a small but consistent signal that helps in narrowing down location.",
  },
  {
    title: "Do Not Track",
    danger:
      "Ironically, the 'do not track' signal itself is rarely honored and adds to your unique profile.",
  },
];

export default function DetailsPage() {
  return (
    <>
    <Header />
    <DataPolicyDisclaimer />
    <main className="p-6 bg-[--background-color] text-white min-h-screen">
      <h1 className="text-5xl font-bold text-[--color-primary] mb-10">🔐 Data Exposure Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dataFields.map((field, idx) => (
          <div
            key={idx}
            className="border-2 border-green-500 bg-[--background-color] p-10 rounded-2xl shadow-lg"
          >
            <h2 className="text-3xl font-semibold text-[--color-primary] mb-4">
              {field.title}
            </h2>
            <p className="text-2xl text-white">{field.danger}</p>
          </div>
        ))}
      </div>
    </main>
    <Footer />
    </>
  );
}
