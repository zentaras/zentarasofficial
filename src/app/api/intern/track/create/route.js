


// app/api/intern/track/create/route.js
// Called by admin when shortlisting — bootstraps the InternshipTrack
import { prisma } from "../../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

export async function POST(req) {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { clerkUserId, applicantId, projectKey, projectName } = await req.json();

  if (!clerkUserId || !applicantId || !projectKey || !projectName) {
    return Response.json({ error: "Missing fields: clerkUserId, applicantId, projectKey, projectName all required." }, { status: 400 });
  }

  try {
    // Idempotent upsert — safe to call multiple times
    const track = await prisma.internshipTrack.upsert({
      where: {
        clerkUserId_applicantId: { clerkUserId, applicantId },
      },
      update: {}, // already exists — no-op
      create: {
        clerkUserId,
        applicantId,
        projectKey,
        projectName,
        currentStep: 1,   // starts at 1 — Step 1 unlocked once briefing published
      },
    });

    return Response.json({ ok: true, trackId: track.id });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}