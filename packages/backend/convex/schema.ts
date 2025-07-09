import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userDataLogs: defineTable({
      userId: v.string(),
      timestamp: v.number(),
      data: v.any(),
  }),
});


// export default defineSchema({
//   notes: defineTable({
//     userId: v.string(),
//     title: v.string(),
//     content: v.string(),
//     summary: v.optional(v.string()),
//   }),
// });
