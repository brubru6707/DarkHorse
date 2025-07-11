import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userDataLogs: defineTable({
    userId: v.string(),
    timestamp: v.number(),
    data: v.any(), // original scan data (clientData)

    // New fields
    nmapData: v.optional(v.string()),             // Nmap scan output (or JSON stringified)
    imageDescription: v.optional(v.string()),          // Gemini Flash-generated image description
    imageURL: v.optional(v.string()),             // URL or base64 of generated image
    recommendations: v.optional(v.string()),      // Optional LLM-generated recommendations

    // Optional progress tracking (if you want it)
    status: v.optional(
      v.object({
        nmap: v.union(v.literal("pending"), v.literal("done"), v.literal("error")),
        image: v.union(v.literal("pending"), v.literal("done"), v.literal("error")),
        recommendations: v.union(v.literal("pending"), v.literal("done"), v.literal("error")),
      })
    ),
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
