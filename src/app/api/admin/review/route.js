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
    adminNote: adminNote || null,
    reviewedAt: new Date(),
    reviewedBy: userId,
  };

  try {
    if (table === "ai-resume-screener") {
      await prisma.aiResumeScreenerApplicant.update({ where: { id }, data });
    } else if (table === "ecommerce-analytics") {
      await prisma.ecommerceAnalyticsApplicant.update({ where: { id }, data });
    } else if (table === "sentiment-dashboard") {
      await prisma.sentimentDashboardApplicant.update({ where: { id }, data });
    } else {
      return Response.json({ error: "Invalid table" }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}