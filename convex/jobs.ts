import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    budget: v.number(),
    requiredSkills: v.array(v.string()),
    deadline: v.string(),
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

    if (user.role !== "hirer") {
      throw new Error("only hirers can create jobs");
    }

    const jobId = await ctx.db.insert("jobs", {
      title: args.title,
      description: args.description,
      budget: args.budget,
      hirerId: user._id,
      status: "open",
      requiredskills: args.requiredSkills,
      deadline: args.deadline,
    });

    //todo this should triggered when hirer approves a job application
    //escrow transaction
    // await ctx.runMutation(
    //   internal.escrow.fundEscrow,
    //   {
    //     hirerId: user._id,
    //     jobId,
    //     amount: args.budget,
    //   }
    // );

    return jobId;
  },
});

export const update = mutation({
  args: {
    id: v.id("jobs"),
    field: v.string(),
    value: v.union(v.string(), v.number(), v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const value = args.value;

    const gig = await ctx.db.patch(args.id, {
      [args.field]: value,
    });

    return gig;
  },
});

export const remove = mutation({
  args: { id: v.id("jobs") },
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

    if (user.role !== "hirer") {
      throw new Error("only hirers can delete jobs");
    }

    const userId = user._id;

    // 1. Delete favorites
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_userId_jobId", (q) =>
        q.eq("userId", userId).eq("jobId", args.id)
      )
      .unique();

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
    }

    // 2. Delete job media files
    const jobMedias = await ctx.db
      .query("jobMedia")
      .withIndex("by_jobId", (q) => q.eq("jobId", args.id))
      .collect();

    await Promise.all(
      jobMedias.map(async (media) => {
        if (media.storageId) {
          await ctx.storage.delete(media.storageId);
        }
        return ctx.db.delete(media._id);
      })
    );

    // 3. Delete applications and their media
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_jobId", (q) => q.eq("jobId", args.id))
      .collect();

    await Promise.all(
      applications.map(async (application) => {
        return ctx.db.delete(application._id);
      })
    );
    
    // Finally delete the job
    await ctx.db.delete(args.id);
  },
});

export const favorite = mutation({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const job = await ctx.db.get(args.id);

    if (!job) {
      throw new Error("Job not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const userId = user._id;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_userId_jobId", (q) =>
        q.eq("userId", userId).eq("jobId", job._id)
      )
      .unique();

    if (existingFavorite) {
      throw new Error("Job already favorited");
    }

    await ctx.db.insert("userFavorites", {
      userId,
      jobId: job._id,
    });

    return job;
  },
});

export const unfavorite = mutation({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const job = await ctx.db.get(args.id);

    if (!job) {
      throw new Error("Job not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const userId = user._id;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_userId_jobId", (q) =>
        q.eq("userId", userId).eq("jobId", job._id)
      )
      .unique();

    if (!existingFavorite) {
      throw new Error("Favorited job not found");
    }

    await ctx.db.delete(existingFavorite._id);

    return job;
  },
});

export const updateApplicant = internalMutation({
  args: {
    jobId: v.id("jobs"),
    applicationtId: v.id("applications"),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ), // "pending", "accepted", "rejected", "completed",
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

    if (user.role !== "hirer") {      
      throw new Error("Unauthorized");
    }

    const job = await ctx.db.get(args.jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    await ctx.db.patch(args.jobId, {
      selectedApplicationId: args.applicationtId,
      status: args.status,
    });

    return job;
  },
});

export const get = query({
  args: {
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.search as string;

    let jobs = [];

    if (title) {
      jobs = await ctx.db
        .query("jobs")
        .withSearchIndex("search_title", (q) => q.search("title", title))
        .collect();
    } else {
      jobs = await ctx.db
        .query("jobs")
        // .withIndex("by_status", (q) => q.eq("status", "open"))
        .order("desc")
        .collect();
    }

    let jobsWithFavoriteRelation = jobs;

    if (identity !== null) {
      jobsWithFavoriteRelation = await Promise.all(
        jobs.map(async (job) => {
          return ctx.db
            .query("userFavorites")
            .withIndex("by_userId_jobId", (q) =>
              q.eq("userId", job.hirerId).eq("jobId", job._id)
            )
            .unique()
            .then((favorite) => {
              return {
                ...job,
                favorited: !!favorite,
              };
            });
        })
      );
    }

    return jobsWithFavoriteRelation;
  },
});

export const getJobsByHirer = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (!args.id) return null;

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_hirerId", (q) => q.eq("hirerId", args.id))
      .collect();

    return jobs;
  },
});

export const getJobsByStatus = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("open"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    if (!args.status) return null;
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", args.status!))
      .collect();

    return jobs;
  },
});

export const getJobsById = query({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const job = await ctx.db.get(args.jobId);

    if (!job) {
      return null;
    }

    // get images
    const images = await ctx.db
      .query("jobMedia")
      .withIndex("by_jobId", (q) => q.eq("jobId", args.jobId))
      .collect();

    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const imageUrl = await ctx.storage.getUrl(image.storageId);
        if (!imageUrl) {
          throw new Error("Image not found");
        }
        return { ...image, url: imageUrl };
      })
    );

    return { ...job, images: imagesWithUrls };
  },
});
