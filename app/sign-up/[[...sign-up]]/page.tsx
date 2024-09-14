import { SignUp } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md w-full px-4">
        <SignUp path="/sign-up" />
      </div>
    </div>
  );
}
