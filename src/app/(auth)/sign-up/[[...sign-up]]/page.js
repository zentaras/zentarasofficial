// src/app/(auth)/sign-up/[[...sign-up]]/page.js

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp />
    </div>
  );
}