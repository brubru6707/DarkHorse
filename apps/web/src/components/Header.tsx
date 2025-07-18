'use client';

import Image from 'next/image';
import Link from 'next/link';
import SignOutComponent from './SignOutComponent';
import { useEffect, useState } from 'react';
import { SignOutButton, useAuth } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';

export default function Header() {
  const { userId, isLoaded: isClerkLoaded } = useAuth();
  const setScanCount = useMutation(api.users.setScanCount);
  const isUserInConvex = useQuery(api.users.isUserInConvex);
  const latestDataLogs = useQuery(api.logUserData.getUserDataLogs);
  const getUserPlan = useQuery(api.users.getUserPlan);
  const [scanCount, setScanCountFrontend] = useState(3);
  const [userPlan, setUserPlan] = useState<"free" | "pro" | null | undefined>(undefined);

  useEffect(() => {
    if (isClerkLoaded && userId) {
      const plan = getUserPlan;
      setUserPlan(plan);
      if (latestDataLogs?.length && latestDataLogs?.length >= (userPlan === "pro" ? 30 : 3)) {
        setScanCountFrontend(0);
        setScanCount({
          userId: userId,
          scansRemaining: 0,
        });
      }
      else {
        setScanCountFrontend((userPlan === "pro" ? 30 : 3) - (latestDataLogs?.length ?? 0));
        setScanCount({
        userId: userId,
          scansRemaining: (userPlan === "pro" ? 30 : 3) - (latestDataLogs?.length ?? 0),
          });
        }
    }
  }, [isClerkLoaded, userId, latestDataLogs, setScanCount, scanCount]);

  return (
    <div className="w-[90vw] max-w-full bg-background-color text-white py-2 sm:py-4 mt-4 rounded-lg border-2 border-green-500 mx-auto">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 bg-logo-background-green py-2 px-3 sm:px-4 rounded-md">
              <Image
                src="/images/logo.png"
                alt="DarkHorse Logo"
                width={32}
                height={32}
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <div className="flex flex-col items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-montserrat">
                  DarkHorse
                </h1>
                {isClerkLoaded && userId && isUserInConvex === true && (
                  <span className="text-green-400 text-sm mt-1 text-center w-full">
                    {userPlan}: {scanCount} scans left
                  </span>
                )}
              </div>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center sm:justify-end">
            <Link
              href="/"
              className="px-3 sm:px-6 py-2 text-white hover:text-primary font-medium transition-colors duration-200 text-sm sm:text-base"
            >
              About
            </Link>
            <Link
              href="/details"
              className="details-button"
            >
              Details
            </Link>
            <Link
              href="/pricing"
              className="px-3 sm:px-6 py-2 text-white hover:text-primary font-medium transition-colors duration-200 text-sm sm:text-base"
            >
              Pricing
            </Link>
            <Link
              href="/scan"
              className="scan-button"
            >
              Scan
            </Link>
            {isClerkLoaded && userId && (
              <div className="cursor-pointer hover:text-primary font-medium transition-colors duration-200 px-3 sm:px-4 py-2 text-sm sm:text-base">
                <SignOutButton />
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}