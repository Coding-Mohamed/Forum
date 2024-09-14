import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  const { userId } = auth();

  return (
    <header className="bg-blue-900 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/">
            <span className="text-2xl font-bold transition duration-300 ease-in-out hover:text-yellow-500">Home</span>
          </Link>
        </div>

        <div>
          {userId ? (
            <div>
              <UserButton />
            </div>
          ) : (
            <div>
              <Link href="/sign-up">
                <span className="text-lg mr-4 transition duration-300 ease-in-out hover:text-yellow-500">Create Account</span>
              </Link>
              <Link href="/sign-in">
                <span className="text-lg transition duration-300 ease-in-out hover:text-yellow-500">Sign-In</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
