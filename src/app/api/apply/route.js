import { prisma } from "../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const body = await req.json();
  const { userId } = await auth();

  const {
    project, fullName, email,
    college, branch, graduationYear, cgpa,
    githubUrl, resumeLink,
  } = body;

  // Validate only the fields that actually exist in the form now
  if (!project || !fullName || !email || !college || !branch ||
      !graduationYear || !githubUrl || !resumeLink) {
    return Response.json({ error: "Missing required fields." }, { status: 400 });
  }

  const common = {
    clerkUserId: userId ?? null,
    fullName,
    email,
    college,
    branch,
    graduationYear,
    cgpa: cgpa || null,
    githubUrl,
    resumeLink,
  };

  try {
    if (project === "data-analyst-intern") {
      await prisma.dataAnalystApplicant.create({ data: common });
    } else if (project === "web-dev-intern") {
      await prisma.webDevApplicant.create({ data: common });
    } else {
      return Response.json({ error: "Invalid project." }, { status: 400 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Apply error:", err);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}