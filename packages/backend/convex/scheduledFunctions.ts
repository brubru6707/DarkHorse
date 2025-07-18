// convex/scheduledFunctions.ts
import { internalMutation, internalAction, action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

// This mutation resets scans for a single user. It's an internal mutation
// because it's only called by our internal scheduled action, not directly by clients.
export const _resetUserScans = internalMutation({ // Renamed to _resetUserScans for clarity as it's internal
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user) {
      console.warn(`Attempted to reset scans for non-existent user: ${args.userId}`);
      return;
    }

    const maxScansForPlan = user.stripeCustomerId ? 30 : 3;

    await ctx.db.patch(user._id, {
      scansRemaining: maxScansForPlan,
      lastScanResetAt: Date.now(), // Update the reset timestamp
    });

    console.log(`User ${args.userId} scan count reset to ${maxScansForPlan}`);
  },
});

// This is the action that gets triggered by the cron job.
// It iterates through users and calls the _resetUserScans mutation.
export const monthlyScanResetAction = internalAction({ // Renamed for clarity that it's an action
  handler: async (ctx) => {
    console.log("Running monthly scan reset action...");

    // Get all users (you might want to paginate this if you have many users)
    const users = await ctx.runQuery(internal.users.getAllUsersForResetInternal); // Calling an internal query

    const now = Date.now();
    // Using a simpler "beginning of current month" check, as your _cron.ts suggests "day: 1"
    const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();

    for (const user of users) {
      const lastResetAt = user.lastScanResetAt ?? 0; // Default to 0 if not set yet (for new users)

      // Check if the user's last reset was before the beginning of the current month
      // This ensures we only reset once per month.
      if (lastResetAt < startOfCurrentMonth) {
        console.log(`Resetting scans for user: ${user.userId}`);
        await ctx.runMutation(internal.scheduledFunctions._resetUserScans, { userId: user.userId });
      } else {
        console.log(`User ${user.userId} reset not due yet. Last reset: ${new Date(lastResetAt).toDateString()}`);
      }
    }
    console.log("Monthly scan reset action completed.");
  },
});
