import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userDataLogs: defineTable({
    userId: v.string(),
    timestamp: v.number(),
    data: v.any(),

    nmapData: v.optional(v.string()),
    imageDescription: v.optional(v.string()),
    imageURL: v.optional(v.string()),
    recommendations: v.optional(v.string()),
  }),
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro")),
    scansRemaining: v.number(), 
    stripeCustomerId: v.optional(v.string()), 
    lastScanResetAt: v.optional(v.number()),
  })
  .index("by_user_id", ["userId"])
  .index("by_email", ["email"]), 
});