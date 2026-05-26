import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

export async function GET(req) {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [dataAnalyst, webDev] = await Promise.all([
    prisma.dataAnalystApplicant.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.webDevApplicant.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return Response.json({
    applicants: [
      ...dataAnalyst.map(a => ({ ...a, projectKey: "data-analyst-intern", projectName: "Data Analyst Intern" })),
      ...webDev.map(a =>      ({ ...a, projectKey: "web-dev-intern",       projectName: "Web Developer Intern" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  });
}