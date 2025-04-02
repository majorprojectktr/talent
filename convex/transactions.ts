import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

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

      if(transaction.isDeposited){
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
