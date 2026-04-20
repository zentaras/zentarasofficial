import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const analyses = await prisma.resumeAnalysis.findMany({
    where: { clerkUserId: userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ analyses });
}

export async function POST(req) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
const analysis = await prisma.resumeAnalysis.create({
  data: {
    clerkUserId: userId,
    resumeVersion: body.resumeVersion ?? null,
    matchScore: body.matchScore,
    verdict: body.verdict,
  },
});

  return NextResponse.json({ analysis });
}