import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  admins: defineTable({
    email: v.string(),
    userId: v.string(),
  }),
  comments: defineTable({
    author: v.string(),
    content: v.string(),
    createdAt: v.float64(),
    threadId: v.id("threads"),
    parentCommentId: v.optional(v.id("comments")),
  }),
  threads: defineTable({
    author: v.string(),
    authorId: v.optional(v.string()), // Make this field optional temporarily
    category: v.string(),
    content: v.string(),
    createdAt: v.float64(),
    downvotes: v.int64(),
    title: v.string(),
    upvotes: v.int64(),
  }),
  votes: defineTable({
    userId: v.string(),
    threadId: v.id("threads"),
    voteType: v.string(),
  }).index("by_user_and_thread", ["userId", "threadId"]),
});
