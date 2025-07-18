// convex/_cron.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Schedule the internal mutation to reset scan counts monthly
crons.monthly(
  "resetScanCounts", // A unique name for your cron job
  { day: 1, hourUTC: 0, minuteUTC: 0 }, // Every 1st of the month at midnight UTC
  internal.scheduledFunctions.resetAllScanCounts // Reference to your internal mutation
);

export default crons; // Export the crons object