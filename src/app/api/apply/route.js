import { prisma } from "../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const body = await req.json();
  const { userId } = await auth();

  const {
    project, fullName, email, phone,
    college, branch, graduationYear, cgpa,
    linkedinUrl, githubUrl, resumeLink,
    toolsKnown, whyInterested, priorExperience,
    availability, startDate, projectLink, nlpExperience,
  } = body;

  if (!project || !fullName || !email || !college || !branch ||
      !graduationYear || !resumeLink || !toolsKnown ||
      !whyInterested || !priorExperience || !availability || !startDate) {
    return Response.json({ error: "Missing required fields." }, { status: 400 });
  }

  const common = {
    clerkUserId: userId ?? null,
    fullName, email,
    phone: phone || null,
    college, branch, graduationYear,
    cgpa: cgpa || null,
    linkedinUrl: linkedinUrl || null,
    githubUrl: githubUrl || null,
    resumeLink, toolsKnown,
    whyInterested, priorExperience,
    availability, startDate,
  };

  try {
    if (project === "ai-resume-screener") {
      await prisma.aiResumeScreenerApplicant.create({ data: common });
    } else if (project === "ecommerce-analytics") {
      await prisma.ecommerceAnalyticsApplicant.create({
        data: { ...common, projectLink: projectLink || null },
      });
    } else if (project === "sentiment-dashboard") {
      if (!nlpExperience) {
        return Response.json({ error: "NLP experience is required." }, { status: 400 });
      }
      await prisma.sentimentDashboardApplicant.create({
        data: { ...common, nlpExperience },
      });
    } else {
      return Response.json({ error: "Invalid project." }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Apply error:", err);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}