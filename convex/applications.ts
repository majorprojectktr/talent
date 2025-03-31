import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    jobId: v.id("jobs"),
    freelancerId: v.id("users"),
    coverLetter: v.string(),
    proposedRate: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "freelancer") {
      throw new Error("only freelancers can create applications");
    }

    const applicationId = await ctx.db.insert("applications", {
      jobId: args.jobId,
      freelancerId: args.freelancerId,
      coverLetter: args.coverLetter,
      status: "pending",
      proposedRate: args.proposedRate,
    });

    return applicationId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "freelancer") {
      throw new Error("only freelancers can create applications");
    }

    const applications = await ctx.db
      .query("applications")
      .withIndex("by_freelancerId", (q) => q.eq("freelancerId", user._id))
      .collect();

    const jobsWithApplications = await Promise.all(
      applications.map(async (application) => {
        const job = await ctx.db.get(application.jobId);
        return {
          ...application,
          job
        };
      })
    );

    return jobsWithApplications;
  },
});

export const getApplicationById = query({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const application = await ctx.db.get(args.applicationId);

    if (!application) {
      return null;
    }

    return application;
  },
});
