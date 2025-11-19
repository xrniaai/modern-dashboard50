import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getUserRedemptions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const redemptions = await ctx.db
      .query("redemptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return redemptions;
  },
});

export const createRedemptionRequest = mutation({
  args: {
    amount: v.number(),
    pointsUsed: v.number(),
    method: v.string(),
    accountDetails: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const redemptionId = await ctx.db.insert("redemptions", {
      userId: user._id,
      amount: args.amount,
      pointsUsed: args.pointsUsed,
      method: args.method,
      accountDetails: args.accountDetails,
      status: "pending",
      requestedAt: Date.now(),
    });

    return redemptionId;
  },
});
