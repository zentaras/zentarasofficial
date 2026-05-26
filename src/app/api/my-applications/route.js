import { prisma } from "../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ applications: [] });

  const [dataAnalyst, webDev] = await Promise.all([
    prisma.dataAnalystApplicant.findMany({
      where: { clerkUserId: userId },
      select: { id: true, status: true, adminNote: true },
    }),
    prisma.webDevApplicant.findMany({
      where: { clerkUserId: userId },
      select: { id: true, status: true, adminNote: true },
    }),
  ]);

  return Response.json({
    applications: {
      "data-analyst-intern": dataAnalyst[0] ?? null,
      "web-dev-intern":      webDev[0] ?? null,
    },
  });
}