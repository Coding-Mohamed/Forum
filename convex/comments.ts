// convex/comments.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Function to check for inappropriate language
const containsInappropriateLanguage = (content: string): boolean => {
  const inappropriateWords = ["bitch", "fuck", "shit", "asshole", "bastard", "cunt", "dick", "pussy", "damn", "whore", "slut", "prick", "cock", "faggot", "nigger", "retard", "spic", "chink", "kike", "gook", "twat", "wanker", "motherfucker", "crap", "bollocks", "arse", "jerk", "douche", "moron", "idiot"];
  return inappropriateWords.some((word) => content.toLowerCase().includes(word));
};

export const getComments = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, { threadId }) => {
    return await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("threadId"), threadId))
      .collect();
  },
});

export const createComment = mutation({
  args: {
    threadId: v.id("threads"),
    author: v.string(),
    content: v.string(),
    parentCommentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, { threadId, author, content, parentCommentId }) => {
    if (containsInappropriateLanguage(content)) {
      content = "This comment has been censored due to inappropriate language.";
    }

    await ctx.db.insert("comments", {
      threadId,
      author,
      content,
      createdAt: Date.now(),
      parentCommentId,
    });
  },
});
