import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

export async function POST(req) {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id, table, status, adminNote } = await req.json();
  if (!id || !table || !status) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const data = {
    status,
    adminNote:  adminNote || null,
    reviewedAt: new Date(),
    reviewedBy: userId,
  };

  const PROJECT_NAME_MAP = {
    "data-analyst-intern": "Data Analyst Intern",
    "web-dev-intern":      "Web Developer Intern",
  };

  try {
    let applicant = null;

    if (table === "data-analyst-intern") {
      applicant = await prisma.dataAnalystApplicant.update({ where: { id }, data });
    } else if (table === "web-dev-intern") {
      applicant = await prisma.webDevApplicant.update({ where: { id }, data });
    } else {
      return Response.json({ error: "Invalid table" }, { status: 400 });
    }

    // Auto-create InternshipTrack when shortlisted
    if (status === "Shortlisted" && applicant?.clerkUserId) {
      await prisma.internshipTrack.upsert({
        where: {
          clerkUserId_applicantId: {
            clerkUserId: applicant.clerkUserId,
            applicantId: id,
          },
        },
        update: {},
        create: {
          clerkUserId: applicant.clerkUserId,
          applicantId: id,
          projectKey:  table,
          projectName: PROJECT_NAME_MAP[table],
          currentStep: 1,
          isCompleted: false,
        },
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}