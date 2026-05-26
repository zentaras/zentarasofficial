// app/internship/page.js
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import InternshipClient from "./InternshipClient";

export default async function InternshipPage({ searchParams }) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const params      = await searchParams;
  const applicantId = params?.applicantId;
  if (!applicantId) redirect("/dashboard");

  // Try each new table
  const [dataAnalyst, webDev] = await Promise.all([
    prisma.dataAnalystApplicant.findFirst({
      where: { id: applicantId, clerkUserId: clerkUser.id },
    }),
    prisma.webDevApplicant.findFirst({
      where: { id: applicantId, clerkUserId: clerkUser.id },
    }),
  ]);

  const applicant = dataAnalyst ?? webDev;
  if (!applicant)                         redirect("/dashboard");
  if (applicant.status !== "Shortlisted") redirect("/dashboard");

  let projectKey, projectName;
  if (dataAnalyst) {
    projectKey  = "data-analyst-intern";
    projectName = "Data Analyst Intern";
  } else {
    projectKey  = "web-dev-intern";
    projectName = "Web Developer Intern";
  }

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