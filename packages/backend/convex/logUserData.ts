import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Auth } from "convex/server";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

export const logUserData = mutation({
  args: {
    data: v.any(), 
  },
  handler: async (ctx, args) => {
    const identity = await getUserId(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("userDataLogs", {
      userId: identity,
      timestamp: Date.now(),
      data: args.data,
    });
  },
});

export const getUserDataLogs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await getUserId(ctx);
    if (!identity) return null;

    const notes = await ctx.db
      .query("userDataLogs")
      .filter((q) => q.eq(q.field("userId"), identity))
      .collect();

    return notes;
  },
});

// export const getUserDataLog = query({
//   args: {
//     userId: v.optional(v.id("userDataLogs")),
//   },
//   handler: async (ctx, args) => {
//     const { userId } = args;
//     if (!userId) return null;
//     const note = await ctx.db.get(userId);
//     return note;
//   },
// });