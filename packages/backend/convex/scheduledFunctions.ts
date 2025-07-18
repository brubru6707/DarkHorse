// convex/scheduledFunctions.ts
import { internalMutation } from "./_generated/server";
import { v } from "convex/values"; // Import v for schema validation

export const resetAllScanCounts = internalMutation({
  args: {}, // No arguments needed for this internal function
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    await Promise.all(users.map(async (user) => {
      // Assuming 'plan' and 'scansRemaining' exist on your 'users' table
      // You might want to add schema validation for these fields using 'v'
      await ctx.db.patch(user._id, {
        scansRemaining: user.plan === 'pro' ? 30 : 3
      });
    }));
  },
});