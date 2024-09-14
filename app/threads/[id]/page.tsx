// app/threads/[id]/page.tsx
"use client";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import useAdminStatus from "@/app/hooks/useAdminStatus";

export default function ThreadDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as Id<"threads">;
  const threadData = useQuery(api.threads.getThreadById, { id }) as ThreadType | undefined;
  const commentsData = useQuery(api.comments.getComments, { threadId: id }) as { author: string; content: string }[] | undefined;
  const createComment = useMutation(api.comments.createComment);
  const editThread = useMutation(api.threads.editThread);
  const deleteThread = useMutation(api.threads.deleteThread);
  const { user, isLoaded } = useUser();
  const isAdmin = useAdminStatus();
  const [commentContent, setCommentContent] = useState("");
  const [thread, setThread] = useState<ThreadType | undefined>(threadData);
  const [comments, setComments] = useState<{ author: string; content: string }[]>(commentsData || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (threadData) {
      setThread(threadData);
      setEditTitle(threadData.title);
      setEditContent(threadData.content);
    }
  }, [threadData]);

  useEffect(() => {
    if (commentsData) {
      setComments(commentsData);
    }
  }, [commentsData]);

  const getDisplayName = () => {
    if (user?.fullName) {
      return user.fullName;
    }
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.split("@")[0];
    }
    return "Guest";
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !user) {
      console.error("User is not authenticated or data is still loading");
      return;
    }
    if (id && commentContent) {
      const author = getDisplayName();
      await createComment({ threadId: id, author, content: commentContent });
      setComments([...comments, { author, content: commentContent }]);
      setCommentContent("");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !user) {
      console.error("User is not authenticated or data is still loading");
      return;
    }
    await editThread({ threadId: id, userId: user.id, title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!isLoaded || !user) {
      console.error("User is not authenticated or data is still loading");
      return;
    }
    try {
      await deleteThread({ threadId: id, userId: user.id });
      router.push("/");
    } catch (error) {
      console.error("Failed to delete thread:", error);
    }
  };

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl p-4 rounded-lg bg-white" style={{ height: "100vh" }}>
        <div className="flex justify-between items-center mb-4 mt-4">
          {isEditing ? (
            <form onSubmit={handleEditSubmit}>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="text-4xl font-bold mb-4" />
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-2 border rounded mb-4" rows={4} />
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                Save
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded ml-2">
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h1 className="text-4xl font-bold">{thread.title}</h1>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{thread.category}</span>
            </>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-4">by {thread.author}</p>
        {!isEditing && <p className="mb-4">{thread.content}</p>}
        {user && (user.id === thread.authorId || isAdmin) && (
          <div className="flex space-x-4 mb-4">
            {user.id === thread.authorId && (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-yellow-500 text-white rounded">
                Edit
              </button>
            )}
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
              Delete
            </button>
          </div>
        )}
        {comments.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Comments</h3>
            <div className="space-y-2">
              {comments.map((comment, index) => (
                <div key={index} className="p-2 border rounded bg-gray-100" style={{ width: "80%" }}>
                  <strong>{comment.author}:</strong> {comment.content}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Add a Comment</h3>
          <SignedIn>
            <form onSubmit={handleCommentSubmit}>
              <textarea className="w-full p-2 border rounded mb-2" rows={4} placeholder="Write your comment here..." value={commentContent} onChange={(e) => setCommentContent(e.target.value)}></textarea>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                Submit
              </button>
            </form>
          </SignedIn>
          <SignedOut>
            <div className="text-center mb-8">
              <p className="text-lg mb-4">Sign in to add a comment.</p>
              <SignInButton>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">Sign In</button>
              </SignInButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
