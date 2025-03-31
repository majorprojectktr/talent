import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const sendDocument = mutation({
    args: { storageId: v.id("_storage"), format: v.string(), applicationId: v.id("applications")},
    handler: async (ctx, args) => {
        // check how many images are already uploaded
        const applicationMedia = await ctx.db
            .query("applicationMedia")
            .withIndex("by_applicationId", (q) => q.eq("applicationId", args.applicationId))
            .collect();

        if (applicationMedia.length >= 1) {
            throw new Error("You can upload up to 1 media files.");
        }

        await ctx.db.insert("applicationMedia", {
            storageId: args.storageId,
            format: args.format,
            applicationId: args.applicationId,
        });
    },
});

export const remove = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        const media = await ctx.db.query("applicationMedia")
            .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
            .unique();

        if (!media) {
            throw new Error("Media not found");
        }

        await ctx.db.delete(media._id);

        await ctx.storage.delete(args.storageId);
    },
});


export const getMediaUrl = query({
    args: { storageId: v.optional(v.id("_storage")) },
    handler: async (ctx, args) => {
        if (!args.storageId) return null;
        return await ctx.storage.getUrl(args.storageId);
    },
});