// src/app/dashboard/DashboardLoader.js

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardLoader() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const primaryEmail = clerkUser.emailAddresses?.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  const dbUser = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {},
    create: {
      clerkId:   clerkUser.id,
      email:     primaryEmail ?? "",
      firstName: clerkUser.firstName ?? null,
      lastName:  clerkUser.lastName  ?? null,
      imageUrl:  clerkUser.imageUrl  ?? null,
      username:  clerkUser.username  ?? null,
    },
    include: {
      dataAnalystApps:  { orderBy: { createdAt: "desc" } },
      webDevApps:       { orderBy: { createdAt: "desc" } },
      internshipTracks: true,
    },
  });

  const allApps = [
    ...dbUser.dataAnalystApps.map(a => ({
      ...a,
      projectKey:  "data-analyst-intern",
      projectName: "Data Analyst Intern",
      icon:  "📊",
      color: "#22a06b",
    })),
    ...dbUser.webDevApps.map(a => ({
      ...a,
      projectKey:  "web-dev-intern",
      projectName: "Web Developer Intern",
      icon:  "🌐",
      color: "#6366f1",
    })),
  ].map(app => ({
    ...app,
    track: dbUser.internshipTracks.find(t => t.applicantId === app.id) || null,
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <DashboardClient
      clerkUser={{
        id:        clerkUser.id,
        firstName: clerkUser.firstName,
        imageUrl:  clerkUser.imageUrl,
      }}
      dbUser={{
        firstName: dbUser.firstName,
        lastName:  dbUser.lastName,
        email:     dbUser.email,
        username:  dbUser.username,
        createdAt: dbUser.createdAt.toISOString(),
      }}
      allApps={JSON.parse(JSON.stringify(allApps))}
      primaryEmail={primaryEmail}
    />
  );
}