import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./logUserData";

export const upgradeUserPlan = mutation({
  args: {
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user) 
      throw new Error("User not found");
    if (user && user.plan === "free") {
      console.log("Upgrading user plan...");
      await ctx.db.patch(user._id, {
        plan: "pro",
        scansRemaining: 30,
      });
    } else {
      console.warn(`User with email ${args.userId} not found when updating plan.`);
    }
  },
});

export const setScanCount = mutation({
  args: {
    userId: v.string(),
    scansRemaining: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user) 
      throw new Error("User not found");
    await ctx.db.patch(user._id, {
      scansRemaining: args.scansRemaining,
    });
  },
});

export const addUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro")),
    scansRemaining: v.number(),
    stripeCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();

    if (existingUser) {
      console.log(`User with Clerk ID ${args.userId} already exists. Skipping creation.`);
      return existingUser._id;
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) {
      throw new Error("Unauthenticated or mismatched Clerk ID for addUser");
    }

    const newUserId = await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      plan: args.plan,
      scansRemaining: args.scansRemaining,
      stripeCustomerId: args.stripeCustomerId,
    });
    console.log(`New user created with ID: ${newUserId}`);
    return newUserId;
  },
});

export const isUserInConvex = query({
  args: {},
  handler: async (ctx) => {
    const identity = await getUserId(ctx);
    if (!identity) return null;

    const findings = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", identity))
      .unique();

    return findings !== null;
  },
});

export const getUserRemainingScans = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await getUserId(ctx);
    if (!identity) return null;

    const findings = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", identity))
      .unique();

    return findings?.scansRemaining;
  },
});

export const getUserPlan = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await getUserId(ctx);
    if (!identity) return null;

    const user = await ctx.db.query("users").withIndex("by_user_id", (q) => q.eq("userId", identity)).unique();
    if (!user) return null;
    return user.plan;
  },
});