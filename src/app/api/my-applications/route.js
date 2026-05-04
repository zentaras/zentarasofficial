import { prisma } from "../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ applications: [] });

  const [ai, ecom, sentiment] = await Promise.all([
    prisma.aiResumeScreenerApplicant.findMany({
      where: { clerkUserId: userId },
      select: { id: true, status: true, adminNote: true },
    }),
    prisma.ecommerceAnalyticsApplicant.findMany({
      where: { clerkUserId: userId },
      select: { id: true, status: true, adminNote: true },
    }),
    prisma.sentimentDashboardApplicant.findMany({
      where: { clerkUserId: userId },
      select: { id: true, status: true, adminNote: true },
    }),
  ]);

  return Response.json({
    applications: {
      "ai-resume-screener": ai[0] ?? null,
      "ecommerce-analytics": ecom[0] ?? null,
      "sentiment-dashboard": sentiment[0] ?? null,
    },
  });
}