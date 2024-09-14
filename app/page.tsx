// app/page.tsx
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import ThreadList from "./components/ThreadList";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-8">Discussion Hub</h1>
      <p className="text-lg mb-8">Here you can create a thread, read about other people's threads, and vote or comment on them.</p>
      <SignedIn>
        <Link href="/create-thread">
          <button className="mb-8 px-4 py-2 bg-blue-500 text-white rounded">Create Thread</button>
        </Link>
      </SignedIn>
      <SignedOut>
        <div className="text-center mb-8">
          <p className="text-lg mb-4">Sign in to create a thread or comment on existing threads.</p>
          <SignInButton>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>
      <ThreadList />
    </main>
  );
}
