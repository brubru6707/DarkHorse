// convex/_cron.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.monthly(
  "monthlySubscriptionScanReset",
  { day: 1, hourUTC: 0, minuteUTC: 0 },
  // Make sure this matches the export name in scheduledFunctions.ts
  internal.scheduledFunctions.monthlyScanResetAction
);

export default crons;