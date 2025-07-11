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

    const userDataLogs = await ctx.db
      .query("userDataLogs")
      .filter((q) => q.eq(q.field("userId"), identity))
      .collect();

    return userDataLogs;
  },
});

export const updateRecommendation = mutation({
  args: {
    id: v.id("userDataLogs"),
    recommendation: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await getUserId(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== identity) {
      throw new Error("Unauthorized or log not found");
    }

    await ctx.db.patch(args.id, {
      recommendations: args.recommendation,
    });
  },
});

export const updateImageDescription = mutation({
  args: {
    id: v.id("userDataLogs"),
    imageDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await getUserId(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== identity) {
      throw new Error("Unauthorized or log not found");
    }

    await ctx.db.patch(args.id, {
      imageDescription: args.imageDescription,
    });
  },
});

export const updateImageURL = mutation({
  args: {
    id: v.id("userDataLogs"),
    imageURL: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await getUserId(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== identity) {
      throw new Error("Unauthorized or log not found");
    }

    await ctx.db.patch(args.id, {
      imageURL: args.imageURL,
    });
  },
});

export const updateNmapData = mutation({
  args: {
    id: v.id("userDataLogs"),
    nmapData: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await getUserId(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== identity) {
      throw new Error("Unauthorized or log not found");
    }

    await ctx.db.patch(args.id, {
      nmapData: args.nmapData,
    });
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