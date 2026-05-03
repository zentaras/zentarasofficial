// src/app/dashboard/page.js

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Fetch user from your own DB
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  return (
    <div className="min-h-screen p-8">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-12">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </nav>

      {/* Welcome */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">
          Hello, {clerkUser.firstName ?? "there"} 👋
        </h2>
        <p className="text-gray-500 mb-8">You are successfully signed in.</p>

        {/* User info card */}
        <div className="rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg">Your Profile (from Database)</h3>

          {dbUser ? (
            <div className="space-y-2 text-sm">
              <Row label="DB ID" value={dbUser.id} />
              <Row label="Clerk ID" value={dbUser.clerkId} />
              <Row label="Email" value={dbUser.email} />
              <Row
                label="Name"
                value={`${dbUser.firstName ?? ""} ${dbUser.lastName ?? ""}`.trim() || "—"}
              />
              <Row label="Username" value={dbUser.username ?? "—"} />
              <Row
                label="Created At"
                value={new Date(dbUser.createdAt).toLocaleString()}
              />
            </div>
          ) : (
            <p className="text-yellow-600 text-sm">
              ⚠️ User not found in database yet. Make sure the Clerk webhook is
              configured and has fired for your account.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-4">
      <span className="w-28 text-gray-400 shrink-0">{label}</span>
      <span className="font-mono break-all">{value}</span>
    </div>
  );
}