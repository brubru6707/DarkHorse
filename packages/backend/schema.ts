import { defineSchema, v } from "convex/schema";

export default defineSchema({
  exposures: {
    fields: {
      userId: v.string(),
      ip: v.string(),
      userAgent: v.string(),
      timezone: v.string(),
      language: v.string(),
      referrer: v.string(),
      screenSize: v.string(),
      createdAt: v.number(),
    },
  },
});
