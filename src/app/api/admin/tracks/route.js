// app/api/admin/tracks/route.js
import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

function isAdmin(userId) {
  return userId && ADMIN_IDS.includes(userId);
}

// ─── GET: list all internship tracks with their steps ────────────────────────
export async function GET(req) {
  const { userId } = await auth();
  if (!isAdmin(userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const projectKey = searchParams.get("projectKey"); // optional filter
  const trackId    = searchParams.get("trackId");    // fetch single track

  try {
    if (trackId) {
      const track = await prisma.internshipTrack.findUnique({
        where: { id: trackId },
        include: {
          steps: { orderBy: { stepNumber: "asc" } },
          user:  { select: { firstName: true, lastName: true, email: true, imageUrl: true } },
        },
      });
      return Response.json({ track });
    }

    const tracks = await prisma.internshipTrack.findMany({
      where: projectKey ? { projectKey } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        steps: { orderBy: { stepNumber: "asc" } },
        user:  { select: { firstName: true, lastName: true, email: true, imageUrl: true } },
      },
    });

    return Response.json({ tracks });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}

// ─── POST: admin reviews a specific step ─────────────────────────────────────
// body: { stepId, action: "approve" | "reject", adminNote?: string }
export async function POST(req) {
  const { userId } = await auth();
  if (!isAdmin(userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { stepId, action, adminNote } = await req.json();

  if (!stepId || !["approve", "reject"].includes(action)) {
    return Response.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    const step = await prisma.internshipStep.findUnique({
      where: { id: stepId },
      include: { track: true },
    });

    if (!step) return Response.json({ error: "Step not found" }, { status: 404 });
    if (step.status !== "submitted") {
      return Response.json({ error: "Step is not in submitted state" }, { status: 400 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    await prisma.internshipStep.update({
      where: { id: stepId },
      data: {
        status:     newStatus,
        adminNote:  adminNote ?? null,
        reviewedAt: new Date(),
        reviewedBy: userId,
      },
    });

    // If approved → advance track's currentStep (unless this is the last step)
    if (action === "approve") {
      const track = step.track;
      const nextStep = track.currentStep + 1;
      const MAX_STEPS = 5;

      if (track.currentStep === MAX_STEPS) {
        // Mark internship completed
        await prisma.internshipTrack.update({
          where: { id: track.id },
          data: { isCompleted: true, completedAt: new Date() },
        });
      } else {
        await prisma.internshipTrack.update({
          where: { id: track.id },
          data: { currentStep: nextStep },
        });
      }
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}