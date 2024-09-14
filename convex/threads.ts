// convex/threads.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// convex/threads.ts
export const getAllThreads = query(async ({ db }) => {
  return await db.query("threads").collect();
});

// Query to get all threads with comment count
export const getThreads = query({
  handler: async (ctx) => {
    const threads = await ctx.db.query("threads").collect();
    const threadsWithCommentCount = await Promise.all(
      threads.map(async (thread) => {
        const comments = await ctx.db
          .query("comments")
          .filter((q) => q.eq(q.field("threadId"), thread._id))
          .collect();
        const commentCount = comments.length;
        return { ...thread, commentCount };
      })
    );
    return threadsWithCommentCount;
  },
});

// Query to get a thread by its ID
export const getThreadById = query({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Query to get all unique categories
export const getCategories = query({
  handler: async (ctx) => {
    const threads = await ctx.db.query("threads").collect();
    const categories = [...new Set(threads.map((thread) => thread.category))];
    return categories;
  },
});

// Mutation to create a new thread
export const createThread = mutation({
  args: {
    author: v.string(),
    authorId: v.string(),
    title: v.string(),
    content: v.string(),
    category: v.string(),
  },
  handler: async (ctx, { author, authorId, title, content, category }) => {
    await ctx.db.insert("threads", {
      author,
      authorId, // Include authorId in the inserted document
      title,
      content,
      category,
      createdAt: Date.now(),
      upvotes: BigInt(0),
      downvotes: BigInt(0),
    });
  },
});

// Mutation to edit a thread
export const editThread = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { threadId, userId, title, content }) => {
    const thread = await ctx.db.get(threadId);
    if (thread && thread.authorId === userId) {
      await ctx.db.patch(threadId, { title, content });
    } else {
      throw new Error("Unauthorized");
    }
  },
});

// Helper function to check if a user is an admin
async function isAdmin(ctx: any, userId: string) {
  const admin = await ctx.db
    .query("admins")
    .filter((q: any) => q.eq(q.field("userId"), userId))
    .unique();
  return !!admin;
}

// Mutation to delete a thread
export const deleteThread = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
  },
  handler: async (ctx, { threadId, userId }) => {
    const thread = await ctx.db.get(threadId);
    if (thread && (thread.authorId === userId || (await isAdmin(ctx, userId)))) {
      await ctx.db.delete(threadId);
    } else {
      throw new Error("Unauthorized");
    }
  },
});

// Updated mutation to upvote a thread
export const upvoteThread = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
  },
  handler: async (ctx, { threadId, userId }) => {
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_and_thread", (q) => q.eq("userId", userId).eq("threadId", threadId))
      .unique();

    if (existingVote) {
      if (existingVote.voteType === "upvote") {
        // User already upvoted, remove the vote
        await ctx.db.delete(existingVote._id);
        await ctx.db.patch(threadId, { upvotes: (await ctx.db.get(threadId))!.upvotes - BigInt(1) });
      } else {
        // User previously downvoted, change to upvote
        await ctx.db.patch(existingVote._id, { voteType: "upvote" });
        await ctx.db.patch(threadId, {
          upvotes: (await ctx.db.get(threadId))!.upvotes + BigInt(1),
          downvotes: (await ctx.db.get(threadId))!.downvotes - BigInt(1),
        });
      }
    } else {
      // New upvote
      await ctx.db.insert("votes", { userId, threadId, voteType: "upvote" });
      await ctx.db.patch(threadId, { upvotes: (await ctx.db.get(threadId))!.upvotes + BigInt(1) });
    }
  },
});

// Updated mutation to downvote a thread
export const downvoteThread = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
  },
  handler: async (ctx, { threadId, userId }) => {
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_and_thread", (q) => q.eq("userId", userId).eq("threadId", threadId))
      .unique();

    if (existingVote) {
      if (existingVote.voteType === "downvote") {
        // User already downvoted, remove the vote
        await ctx.db.delete(existingVote._id);
        await ctx.db.patch(threadId, { downvotes: (await ctx.db.get(threadId))!.downvotes - BigInt(1) });
      } else {
        // User previously upvoted, change to downvote
        await ctx.db.patch(existingVote._id, { voteType: "downvote" });
        await ctx.db.patch(threadId, {
          upvotes: (await ctx.db.get(threadId))!.upvotes - BigInt(1),
          downvotes: (await ctx.db.get(threadId))!.downvotes + BigInt(1),
        });
      }
    } else {
      // New downvote
      await ctx.db.insert("votes", { userId, threadId, voteType: "downvote" });
      await ctx.db.patch(threadId, { downvotes: (await ctx.db.get(threadId))!.downvotes + BigInt(1) });
    }
  },
});

// New query to get user's vote for a specific thread
export const getUserVote = query({
  args: { threadId: v.id("threads"), userId: v.string() },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("votes")
      .withIndex("by_user_and_thread", (q) => q.eq("userId", args.userId).eq("threadId", args.threadId))
      .unique();

    return vote ? vote.voteType : null;
  },
});
