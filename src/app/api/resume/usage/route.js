import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

const DAILY_LIMIT = 10;

function getISTDateStr() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  ).toISOString().split("T")[0];
}

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = getISTDateStr();
  const usage = await prisma.resumeUsage.findUnique({
    where: { clerkUserId: userId },
  });

  const count = usage?.date === today ? usage.count : 0;
  const remaining = Math.max(0, DAILY_LIMIT - count);

  return NextResponse.json({ remaining, used: count, limit: DAILY_LIMIT });
}

export async function POST() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = getISTDateStr();
  const usage = await prisma.resumeUsage.findUnique({
    where: { clerkUserId: userId },
  });

  const isNewDay = !usage || usage.date !== today;
  const currentCount = isNewDay ? 0 : usage.count;

  if (currentCount >= DAILY_LIMIT)
    return NextResponse.json({ error: "Daily limit reached" }, { status: 429 });

  const updated = await prisma.resumeUsage.upsert({
    where: { clerkUserId: userId },
    update: { count: isNewDay ? 1 : { increment: 1 }, date: today },
    create: { clerkUserId: userId, count: 1, date: today },
  });

  return NextResponse.json({
    remaining: Math.max(0, DAILY_LIMIT - updated.count),
    used: updated.count,
    limit: DAILY_LIMIT,
  });
}