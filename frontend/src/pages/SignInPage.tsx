import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {/* The path prop ensures Clerk knows where this component lives */}
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" forceRedirectUrl="/demo" />
    </div>
  );
};

export default SignInPage;