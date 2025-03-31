import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - synced with Clerk
  users: defineTable({
    clerkId: v.string(),
    role: v.optional(v.string()), // "admin", "hirer", "freelancer"
    email: v.string(),
    fullname: v.string(),
    username: v.string(),
    isActive: v.boolean(),
    profileImageUrl: v.optional(v.string()),
    // Role-specific fields
    // For freelancers
    skills: v.optional(v.array(v.string())),
    experience: v.optional(v.number()),
    resumeFileId: v.optional(v.string()),
    // For hirers
    companyName: v.optional(v.string()),
    balance: v.optional(v.number()), // Wallet balance
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_username", ["username"]),
  // Jobs table
  jobs: defineTable({
    title: v.string(),
    description: v.string(),
    budget: v.number(),
    requiredskills: v.array(v.string()),
    deadline: v.string(),
    hirerId: v.id("users"),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ), // "open", "in_progress", "completed", "cancelled"
    selectedApplicant: v.optional(v.id("applications")),
  })
    .index("by_hirerId", ["hirerId"])
    .index("by_status", ["status"])
    .searchIndex("search_title", {
      searchField: "title",
    }),
  userFavorites: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobs"),
  })
    .index("by_jobId", ["jobId"])
    .index("by_userId_jobId", ["userId", "jobId"])
    .index("by_userId", ["userId"]),
  // Applications table
  applications: defineTable({
    jobId: v.id("jobs"),
    freelancerId: v.id("users"),
    coverLetter: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("completed")
    ), // "pending", "accepted", "rejected", "completed"
    proposedRate: v.number(),
  })
    .index("by_jobId", ["jobId"])
    .index("by_freelancerId", ["freelancerId"])
    .index("by_jobId_and_status", ["jobId", "status"]),
  //store media files for jobs eg: resume, cover letter, etc
  applicationMedia: defineTable({
    format: v.string(),
    storageId: v.id("_storage"),
    applicationId: v.id("applications"),
  })
    .index("by_applicationId", ["applicationId"])
    .index("by_storageId", ["storageId"]),
});
