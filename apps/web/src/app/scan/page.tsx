"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { collectClientData } from "@/lib/collectClientData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataPolicyDisclaimer from "@/components/DataPolicyDisclaimer";
import ScanDataDisplay from "@/components/scan/ScanDataDisplay";
import NmapOutputDisplay from "@/components/scan/NmapOutputDisplay";
import HistoryTimeline from "@/components/scan/History";
import ImageVisualization from "@/components/scan/ImageVisualization";
import Recommendation from "@/components/scan/Recommendation";
import { useRouter } from "next/navigation";
import { extractEssentialDetails } from '@/lib/essentialDetails';
import { Id } from '@packages/backend/convex/_generated/dataModel';
import { useAuth } from "@clerk/nextjs";

interface HistoricalEntry {
  id: Id<"userDataLogs">;
  timestamp: string;
  data: object;
  nmapData: string;
  imageDescription: string;
  imageURL: string;
  recommendation: string;
}

export default function ScanPage() {
  const { userId, isLoaded: isClerkLoaded } = useAuth();
  const logUserData = useMutation(api.logUserData.logUserData);
  const latestDataLogs = useQuery(api.logUserData.getUserDataLogs);
  const router = useRouter();
  const addUser = useMutation(api.users.addUser);
  const isUserInConvex = useQuery(api.users.isUserInConvex);
  const getUserRemainingScans = useQuery(api.users.getUserRemainingScans);
  const [initialScanAttempted, setInitialScanAttempted] = useState(false);
  const [selectedHistoricalEntry, setSelectedHistoricalEntry] = useState<HistoricalEntry | null>(null);
  const [scanCount, setScanCountFrontend] = useState(3);

  const latestDataEntry = useMemo(() => {
    if (!latestDataLogs || latestDataLogs.length === 0)
      return null;
    return latestDataLogs[latestDataLogs.length - 1];
  }, [latestDataLogs]);

  const essentialDetails = useMemo(() => {
    const dataToExtract = selectedHistoricalEntry?.data || latestDataEntry?.data;
    if (!dataToExtract) {
        return null;
    }
    return extractEssentialDetails(dataToExtract);
  }, [latestDataEntry, selectedHistoricalEntry]);

  useEffect(() => {
    if (isClerkLoaded && userId) {
      const userRemainingScans = getUserRemainingScans;
      setScanCountFrontend(userRemainingScans ?? 3);
    }
  }, [isClerkLoaded, userId, getUserRemainingScans]);

  const sendUserData = useCallback(async () => {
    try {
      const data = await collectClientData();
      await logUserData({ data });
    } catch (error: any) {
      console.error("Failed to log user data:", error);
      if (error.message && error.message.includes("Not authenticated")) {
        console.log("User not authenticated, redirecting to Clerk sign-in.");
        router.push("/sign-in");
      }
    }
  }, [logUserData, router]);

  useEffect(() => {
    if (latestDataLogs !== undefined && latestDataLogs?.length === 0 && !initialScanAttempted) {
      console.log("Performing initial scan due to no existing data.");
      sendUserData();
      setInitialScanAttempted(true);
    }
  }, [latestDataLogs, initialScanAttempted, sendUserData]);

  useEffect(() => {
    if (isClerkLoaded && userId) {
      if (!isUserInConvex) {
        console.log("Clerk user exists but not in Convex. Adding to Convex.");
        addUser({
          userId: userId,
          email: '',
          name: '',
          plan: 'free',
          scansRemaining: 3,
          stripeCustomerId: undefined,
        })
        .catch((error) => console.error('Error adding user to Convex:', error));
      } else {
        console.log("User already exists in Convex.");
      }
    }
  }, [isClerkLoaded, userId, isUserInConvex, addUser]);


  
  const handleSelectHistoricalEntry = useCallback((entry: HistoricalEntry | null) => {
    setSelectedHistoricalEntry(entry);
  }, []);

  const handleStartNewScan = useCallback(() => {
    if (scanCount <= 0) {
      alert("You have no scans left :(");
      return;
    }
    console.log("Starting a new scan...");
    setSelectedHistoricalEntry(null);
    sendUserData();
  }, [sendUserData, scanCount]);

  const displayDataEntry = selectedHistoricalEntry ? {
    _id: selectedHistoricalEntry.id,
    data: selectedHistoricalEntry.data,
    nmapData: selectedHistoricalEntry.nmapData,
    imageDescription: selectedHistoricalEntry.imageDescription,
    imageURL: selectedHistoricalEntry.imageURL,
    recommendations: selectedHistoricalEntry.recommendation
  } : latestDataEntry;

  const currentCityData = useMemo(() => {
    const data = (selectedHistoricalEntry || latestDataEntry)?.data;
    if (data && typeof data === 'object' && 'city' in data && 'region' in data && 'country' in data) {
      return {
        city: (data as any).city as string,
        region: (data as any).region as string,
        country: (data as any).country as string,
      };
    }
    return null;
  }, [latestDataEntry, selectedHistoricalEntry]);

  const mapIframeSrc = useMemo(() => {
    if (!currentCityData?.city || !currentCityData?.region || !currentCityData?.country) {
      return null;
    }
    const fullAddress = encodeURIComponent(`${currentCityData.city}, ${currentCityData.region}, ${currentCityData.country}`);
    return `http://maps.google.com/maps?q=${fullAddress}&output=embed`;
  }, [currentCityData]);

  return (
    <div className="min-h-screen text-green-300 flex flex-col">
      <Header />
      <DataPolicyDisclaimer />
      <main className="container mx-auto p-4 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col justify-center items-center">
            <div className="text-center">
              <button
                className="bg-transparent cursor-pointer text-green-300 border border-green-300 rounded-md px-8 py-3 text-lg hover:bg-green-300 hover:text-black transition-colors duration-200"
                onClick={handleStartNewScan}
              >
                Start New Scan?
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <HistoryTimeline
              historicalEntries={
                latestDataLogs?.map(entry => ({
                  id: entry._id as Id<"userDataLogs">,
                  timestamp: new Date(entry.timestamp).toISOString(),
                  data: entry.data,
                  nmapData: entry.nmapData ?? '',
                  imageDescription: entry.imageDescription ?? '',
                  imageURL: entry.imageURL ?? '',
                  recommendation: entry.recommendations ?? ''
                })) ?? []
              }
              onSelectEntry={handleSelectHistoricalEntry}
              selectedEntryIdFromParent={selectedHistoricalEntry?.id || latestDataEntry?._id || null}
            />
          </div>
        </div>
        {mapIframeSrc && (
            <div className="bg-black p-4 border border-green-300 rounded-md mb-8">
                <h2 className="text-xl font-semibold mb-4 text-center">Your Approximate Location</h2>
                <iframe
                    title="User Location Map"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen={true}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapIframeSrc}
                ></iframe>
                <p className="text-center text-sm mt-2 text-gray-400">
                    This location is based on your IP address and may not be exact.
                </p>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <NmapOutputDisplay
              latestData={displayDataEntry?.data ?? {}}
              logId={displayDataEntry?._id ?? null}
              previousNmapData={displayDataEntry?.nmapData ?? null}
            />
            <ScanDataDisplay data={displayDataEntry?.data ?? {}} />
          </div>

          <div className="space-y-8">
            <div className="bg-black p-4 border border-green-300 rounded-md">
              <ImageVisualization
                latestData={essentialDetails ?? {}}
                logId={displayDataEntry?._id ?? null}
                previousImageURL={displayDataEntry?.imageURL ?? null}
                previousImageDescription={displayDataEntry?.imageDescription ?? null}
              />
              <p className="text-center text-lg mt-2">Is this you? 👀</p>
            </div>
            <div className="bg-black p-4 border border-green-300 rounded-md text-sm">
              <p>
                <Recommendation
                  latestData={essentialDetails ?? {}}
                  logId={displayDataEntry?._id ?? null}
                  previousRecommendation={displayDataEntry?.recommendations ?? null}
                />
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}