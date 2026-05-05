// app/api/admin/tracks/unlock/route.js
import { prisma } from "../../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

export async function POST(req) {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { trackId, stepNumber } = await req.json();

  if (!trackId || !stepNumber) {
    return Response.json({ error: "Missing trackId or stepNumber" }, { status: 400 });
  }

  try {
    const track = await prisma.internshipTrack.findUnique({
      where: { id: trackId },
    });

    if (!track) {
      return Response.json({ error: "Track not found" }, { status: 404 });
    }

    // Only allow unlocking the very next step
    if (stepNumber !== track.currentStep + 1) {
      return Response.json(
        { error: `Can only unlock step ${track.currentStep + 1} right now.` },
        { status: 400 }
      );
    }

    const MAX_STEPS = 5;
    if (stepNumber > MAX_STEPS) {
      return Response.json({ error: "No more steps to unlock." }, { status: 400 });
    }

    await prisma.internshipTrack.update({
      where: { id: trackId },
      data:  { currentStep: stepNumber },
    });

    return Response.json({ ok: true, currentStep: stepNumber });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}