// src/app/page.js

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome</h1>
        <p className="text-gray-500">Sign up to get started</p>
      </div>

      <SignedOut>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition font-medium">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <Link
            href="/dashboard"
            className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition font-medium"
          >
            Go to Dashboard →
          </Link>
        </div>
      </SignedIn>
    </main>
  );
}