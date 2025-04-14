import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const deposit = internalMutation({
  args: {
    amount: v.number(),
    stripeSessionId: v.string(),
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
      throw new Error("only hirers can delete jobs");
    }

    // Create transaction record
    const transactionId = await ctx.db.insert("transactions", {
      type: "deposit",
      amount: args.amount,
      status: "pending",
      fromUserId: user._id,
      description: "Funds added to wallet",
      stripeSessionId: args.stripeSessionId,
      isDeposited: false,
    });

    return transactionId;
  },
});

export const updateBalance = internalMutation({
  args: {
    stripeSessionId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("disputed")
    ),
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
      throw new Error("only hirers can delete jobs");
    }

    const transaction = await ctx.db
      .query("transactions")
      .withIndex("by_stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId)
      )
      .unique();

    if (args.status === "completed") {
      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction.isDeposited) {
        return transaction;
      }

      // Update user's balance
      await ctx.db.patch(user._id, {
        balance: user.balance + transaction.amount,
      });

      // Update transaction status to completed
      await ctx.db.patch(transaction._id, {
        status: args.status,
        isDeposited: true,
      });
    }

    return transaction;
  },
});

export const withdraw = mutation({
  args: {
    amount: v.number(),
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
      throw new Error("only freelaners can withdraw funds");
    }

    if(user.balance < args.amount) {
      throw new Error("Insufficient funds");
    }

    // Update user's balance
    await ctx.db.patch(user._id, {
      balance: user.balance - args.amount,
    });

    // Create transaction record
    const transactionId = await ctx.db.insert("transactions", {
      type: "withdraw",
      amount: args.amount,
      status: "completed",
      fromUserId: user._id,
      description: "Withdraw funds from wallet",
    });

    return transactionId;
  },
});

export const getTransactionJobId = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_jobId", (q) => q.eq("jobId", args.jobId))
      .collect();

    return transactions;
  },
});
