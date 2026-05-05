// app/internship/page.js
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import InternshipClient from "./InternshipClient";

export default async function InternshipPage({ searchParams }) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // Next.js 15: searchParams is a Promise — must await
  const params      = await searchParams;
  const applicantId = params?.applicantId;
  if (!applicantId) redirect("/dashboard");

  // Try each table — exactly one will return a row
  const [ai, ecom, sentiment] = await Promise.all([
    prisma.aiResumeScreenerApplicant.findFirst({
      where: { id: applicantId, clerkUserId: clerkUser.id },
    }),
    prisma.ecommerceAnalyticsApplicant.findFirst({
      where: { id: applicantId, clerkUserId: clerkUser.id },
    }),
    prisma.sentimentDashboardApplicant.findFirst({
      where: { id: applicantId, clerkUserId: clerkUser.id },
    }),
  ]);

  const applicant = ai ?? ecom ?? sentiment;
  if (!applicant)                         redirect("/dashboard");
  if (applicant.status !== "Shortlisted") redirect("/dashboard");

  // Determine project key from which table actually returned a row
  // (don't use a key-map with optional-chaining keys — they collapse to undefined)
  let projectKey, projectName;
  if (ai) {
    projectKey  = "ai-resume-screener";
    projectName = "AI Resume Screener";
  } else if (ecom) {
    projectKey  = "ecommerce-analytics";
    projectName = "E-Commerce Analytics";
  } else {
    projectKey  = "sentiment-dashboard";
    projectName = "Sentiment Dashboard";
  }

  // Fetch or auto-create the internship track
  let track = await prisma.internshipTrack.findUnique({
    where: {
      clerkUserId_applicantId: {
        clerkUserId: clerkUser.id,
        applicantId,
      },
    },
    include: { steps: { orderBy: { stepNumber: "asc" } } },
  });

  if (!track) {
    track = await prisma.internshipTrack.create({
      data: {
        clerkUserId: clerkUser.id,
        applicantId,
        projectKey,
        projectName,
        currentStep: 1,
      },
      include: { steps: { orderBy: { stepNumber: "asc" } } },
    });
  }

  return (
    <InternshipClient
      clerkUser={{
        id:        clerkUser.id,
        firstName: clerkUser.firstName,
        imageUrl:  clerkUser.imageUrl,
      }}
      applicant={JSON.parse(JSON.stringify(applicant))}
      track={JSON.parse(JSON.stringify(track))}
      projectKey={projectKey}
      projectName={projectName}
    />
  );
}