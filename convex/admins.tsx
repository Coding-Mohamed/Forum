import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const checkAdmin = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    return !!admin;
  },
});

export const makeAdmin = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { userId, email }) => {
    const existingAdmin = await ctx.db
      .query("admins")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    if (existingAdmin) {
      throw new Error("User is already an admin");
    }

    await ctx.db.insert("admins", { userId, email });
  },
});
