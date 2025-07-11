"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { collectClientData } from "@/lib/collectClientData";
import Header from "@/components/Header";
import ScanDataDisplay from "@/components/scan/ScanDataDisplay";
import NmapOutputDisplay from "@/components/scan/NmapOutputDisplay";
import HistoryTimeline from "@/components/scan/History";
import ImageVisualization from "@/components/scan/ImageVisualization";
import Recommendation from "@/components/scan/Recommendation";
import { useRouter } from "next/navigation";
import { extractEssentialDetails } from '@/lib/essentialDetails';

export default function ScanPage() {
  const logUserData = useMutation(api.logUserData.logUserData);
  const latestDataLogs = useQuery(api.logUserData.getUserDataLogs);
  const router = useRouter();

  const [initialScanAttempted, setInitialScanAttempted] = useState(false);

  const latestDataEntry = useMemo(() => {
    if (!latestDataLogs || latestDataLogs.length === 0) {
      return null;
    }
    return latestDataLogs[latestDataLogs.length - 1];
  }, [latestDataLogs]);

  "use client";

  const essentialDetails = useMemo(() => {
      if (!latestDataLogs || latestDataLogs.length === 0) {
          return null;
      }
      const lastEntry = latestDataLogs[latestDataLogs.length - 1];
      return extractEssentialDetails(lastEntry.data);
  }, [latestDataLogs]);

  const sendUserData = useCallback(async () => {
    try {
      const data = await collectClientData();
      await logUserData({ data });
      console.log("User data logged successfully.");
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

  const handleStartNewScan = useCallback(() => {
    console.log("Starting a new scan...");
    sendUserData();
  }, [sendUserData]);

  return (
    <div className="min-h-screen text-green-300">
      <Header />
      <main className="container mx-auto p-4">
        <div className="text-center my-8">
          <button
            className="bg-transparent cursor-pointer text-green-300 border border-green-300 rounded-md px-8 py-3 text-lg hover:bg-green-300 hover:text-black transition-colors duration-200"
            onClick={handleStartNewScan}
          >
            Start New Scan?
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <NmapOutputDisplay
              latestData={latestDataEntry?.data ?? {}}
              logId={latestDataEntry?._id ?? null}
              previousNmapData={latestDataEntry?.nmapData ?? null}
            />
            <ScanDataDisplay data={latestDataEntry?.data ?? {}} />
          </div>

          <div className="space-y-8">
            <div className="bg-black p-4 border border-green-300 rounded-md">
              <ImageVisualization
                latestData={essentialDetails ?? {}}
                logId={latestDataEntry?._id ?? null}
                previousImageURL={latestDataEntry?.imageURL ?? null}
                previousImageDescription={latestDataEntry?.imageDescription ?? null}
              />
              <p className="text-center text-lg mt-2">Is this you? 👀</p>
            </div>
            <div className="bg-black p-4 border border-green-300 rounded-md text-sm">
              <p>
                <Recommendation
                  latestData={essentialDetails ?? {}}
                  logId={latestDataEntry?._id ?? null}
                  previousRecommendation={latestDataEntry?.recommendations ?? null}
                />
              </p>
            </div>
          </div>
        </div>
      </main>
      <HistoryTimeline
        historicalEntries={
          latestDataLogs?.map(entry => ({
            id: entry._id as string,
            timestamp: new Date(entry.timestamp).toISOString(),
            data: entry.data,
            nmapData: entry.nmapData ?? '',
            imageDescription: entry.imageDescription ?? '',
            imageURL: entry.imageURL ?? '',
            recommendation: entry.recommendations ?? ''
          })) ?? []
        }
      />
    </div>
  );
}