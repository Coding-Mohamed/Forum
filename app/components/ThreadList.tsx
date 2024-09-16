// app/components/ThreadList.tsx
"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

export default function ThreadList() {
  const { user } = useUser();
  const threads = useQuery(api.threads.getThreads) as ThreadType[] | undefined;
  const rawCategories = useQuery(api.threads.getCategories) as string[] | undefined;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortCriteria, setSortCriteria] = useState<string>("newest");
  const [filteredThreads, setFilteredThreads] = useState<ThreadType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const upvoteThread = useMutation(api.threads.upvoteThread);
  const downvoteThread = useMutation(api.threads.downvoteThread);
  const [userVotes, setUserVotes] = useState<{ [key: string]: "upvote" | "downvote" | null }>({});

  // Normalize categories
  const normalizeCategory = (category: string) => category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  const categories = rawCategories ? Array.from(new Set(rawCategories.map((category) => normalizeCategory(category)))) : [];

  useEffect(() => {
    console.log("Threads:", threads);
    if (threads !== undefined) {
      setLoading(false);
      let filtered = [...threads]; // Create a copy of the threads array
      if (selectedCategory) {
        filtered = filtered.filter((thread) => normalizeCategory(thread.category) === selectedCategory);
      }
      if (sortCriteria === "newest") {
        filtered = filtered.sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
      } else if (sortCriteria === "oldest") {
        filtered = filtered.sort((a, b) => a.createdAt - b.createdAt); // Sort by oldest first
      } else if (sortCriteria === "mostVoted") {
        filtered = filtered.sort((a, b) => Number(b.upvotes) - Number(b.downvotes) - (Number(a.upvotes) - Number(a.downvotes))); // Sort by most votes
      } else if (sortCriteria === "mostCommented") {
        filtered = filtered.sort((a, b) => b.commentCount - a.commentCount); // Sort by most comments
      }
      setFilteredThreads(filtered);
    }
  }, [threads, selectedCategory, sortCriteria]);

  const handleVote = async (threadId: string, voteType: "upvote" | "downvote") => {
    if (user) {
      const mutationFn = voteType === "upvote" ? upvoteThread : downvoteThread;
      await mutationFn({ threadId: threadId as Id<"threads">, userId: user.id });
      // Update local state immediately for responsive UI
      setUserVotes((prev) => ({
        ...prev,
        [threadId]: prev[threadId] === voteType ? null : voteType,
      }));
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <select value={selectedCategory || ""} onChange={(e) => setSelectedCategory(e.target.value || null)} className="p-2 border rounded mb-2 md:mb-0 md:mr-2">
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)} className="p-2 border rounded">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="mostVoted">Most Voted</option>
          <option value="mostCommented">Most Commented</option>
        </select>
      </div>
      {loading ? (
        <p className="text-center text-gray-500 text-lg mt-10">Loading threads...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredThreads.map((thread: ThreadType) => (
            <div key={thread._id} className="p-2 md:p-4 border rounded shadow-lg bg-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <h2 className="text-lg md:text-2xl font-bold">
                  <Link href={`/threads/${thread._id}`} className="text-blue-500 hover:underline">
                    {thread.title}
                  </Link>
                </h2>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mt-2 md:mt-0">{normalizeCategory(thread.category)}</span>
              </div>
              <p className="text-sm text-gray-500 mb-1">by {thread.author}</p>
              <p className="mb-4 text-sm md:text-base">
                {thread.content.length > 100 ? `${thread.content.substring(0, 100)}...` : thread.content}
                {thread.content.length > 100 && (
                  <Link href={`/threads/${thread._id}`} className="text-blue-500 ml-2">
                    Read more
                  </Link>
                )}
              </p>
              <div className="flex items-center space-x-4">
                <SignedIn>
                  <button onClick={() => handleVote(thread._id, "upvote")} className={`flex items-center space-x-1 p-1 rounded transition ${userVotes[thread._id] === "upvote" ? "bg-green-500 text-white" : "text-green-500 hover:bg-green-100"}`}>
                    <span>👍</span>
                    <span>{thread.upvotes}</span>
                  </button>
                  <button onClick={() => handleVote(thread._id, "downvote")} className={`flex items-center space-x-1 p-1 rounded transition ${userVotes[thread._id] === "downvote" ? "bg-red-500 text-white" : "text-red-500 hover:bg-red-100"}`}>
                    <span>👎</span>
                    <span>{thread.downvotes}</span>
                  </button>
                </SignedIn>
                <SignedOut>
                  <div className="text-gray-500">Sign in to vote</div>
                </SignedOut>
              </div>
              {thread.comments && thread.comments.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Comments</h3>
                  <ul className="list-disc list-inside">
                    {thread.comments.map((comment: string, index: number) => (
                      <li key={index}>{comment}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
