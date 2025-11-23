import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" forceRedirectUrl="/demo" />
    </div>
  );
};

export default SignUpPage;