// types/types.d.ts
interface ThreadType {
  _id: string;
  title: string;
  author: string;
  content: string;
  createdAt: number;
  category: string;
  authorId: string;
  comments?: string[];
  votes?: number;
  commentCount: number;
  upvotes: number;
  downvotes: number;
  userVote?: "upvote" | "downvote" | null;
}

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: number;
  threadId: string;
  parentCommentId?: string;
}

interface FunctionReference<T extends "query" | "mutation"> {
  _type: T;
  _visibility: "public";
  _args: any;
  _returnType: any;
  _componentPath: string;
}
