import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const primaryEmail = clerkUser.emailAddresses?.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  // Fetch user, their applications, and their internship progress tracks
  const dbUser = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {},
    create: {
      clerkId: clerkUser.id,
      email: primaryEmail ?? "",
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      imageUrl: clerkUser.imageUrl ?? null,
      username: clerkUser.username ?? null,
    },
    include: {
      aiResumeScreenerApps: { orderBy: { createdAt: "desc" } },
      ecommerceAnalyticsApps: { orderBy: { createdAt: "desc" } },
      sentimentDashboardApps: { orderBy: { createdAt: "desc" } },
      internshipTracks: true, // Crucial: Fetch the progress tracking data
    },
  });

  // Map all applications and attach their specific tracking "track" object
  const allApps = [
    ...dbUser.aiResumeScreenerApps.map(a => ({
      ...a,
      projectKey: "ai-resume-screener",
      projectName: "AI Resume Screener",
      icon: "🤖",
      color: "#6366f1",
    })),
    ...dbUser.ecommerceAnalyticsApps.map(a => ({
      ...a,
      projectKey: "ecommerce-analytics",
      projectName: "E-Commerce Analytics",
      icon: "📊",
      color: "#22a06b",
    })),
    ...dbUser.sentimentDashboardApps.map(a => ({
      ...a,
      projectKey: "sentiment-dashboard",
      projectName: "Sentiment Dashboard",
      icon: "🧠",
      color: "#e2b203",
    })),
  ].map(app => ({
    ...app,
    // Attach track info if it exists for this application
    track: dbUser.internshipTracks.find(t => t.applicationId === app.id) || null
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <DashboardClient
      clerkUser={{
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        imageUrl: clerkUser.imageUrl,
      }}
      dbUser={{
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        username: dbUser.username,
        createdAt: dbUser.createdAt.toISOString(),
      }}
      allApps={JSON.parse(JSON.stringify(allApps))}
      primaryEmail={primaryEmail}
    />
  );
}