import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

export async function GET(req) {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [ai, ecom, sentiment] = await Promise.all([
    prisma.aiResumeScreenerApplicant.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.ecommerceAnalyticsApplicant.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.sentimentDashboardApplicant.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return Response.json({
    applicants: [
      ...ai.map(a => ({ ...a, projectKey: "ai-resume-screener", projectName: "AI Resume Screener" })),
      ...ecom.map(a => ({ ...a, projectKey: "ecommerce-analytics", projectName: "E-Commerce Analytics" })),
      ...sentiment.map(a => ({ ...a, projectKey: "sentiment-dashboard", projectName: "Sentiment Dashboard" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  });
}