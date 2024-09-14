import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md w-full px-4">
        <SignIn path="/sign-in" />
      </div>
    </div>
  );
}
