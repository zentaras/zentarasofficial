// app/api/admin/tracks/route.js
import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());
function isAdmin(userId) { return userId && ADMIN_IDS.includes(userId); }

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const projectKey = searchParams.get("projectKey");
  const trackId    = searchParams.get("trackId");

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
      where:   projectKey ? { projectKey } : undefined,
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

// ─── POST ─────────────────────────────────────────────────────────────────────
// Two modes:
//   1. action = "approve" | "reject"  → review a submitted step
//   2. action = "evaluate"            → admin saves Step 5 evaluation to InternshipTrack
export async function POST(req) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();
  const { action } = body;

  // ── Mode 2: save evaluation (Step 5) ──────────────────────────────────────
  if (action === "evaluate") {
    const {
      trackId,
      performanceRating,
      overallFeedback,
      certificateLink,
      lorLink,
      projectRepoLink,
      evaluationNotes,
    } = body;

    if (!trackId) return Response.json({ error: "trackId required" }, { status: 400 });

    try {
      // Update evaluation fields on the track
      await prisma.internshipTrack.update({
        where: { id: trackId },
        data: {
          performanceRating: performanceRating ?? null,
          overallFeedback:   overallFeedback   ?? null,
          certificateLink:   certificateLink   ?? null,
          lorLink:           lorLink           ?? null,
          projectRepoLink:   projectRepoLink   ?? null,
          evaluationNotes:   evaluationNotes   ?? null,
        },
      });

      // Also mark Step 5 as "approved" and track as completed
      // if admin provides at least a rating + feedback
      if (performanceRating && overallFeedback) {
        const track = await prisma.internshipTrack.findUnique({
          where:   { id: trackId },
          include: { steps: true },
        });

        const step5 = track?.steps.find(s => s.stepNumber === 5);
        if (step5) {
          await prisma.internshipStep.update({
            where: { id: step5.id },
            data: {
              status:     "approved",
              reviewedAt: new Date(),
              reviewedBy: userId,
              adminNote:  overallFeedback,
            },
          });
        } else if (track) {
          // Create step 5 row if it doesn't exist yet
          await prisma.internshipStep.create({
            data: {
              trackId,
              stepNumber: 5,
              stepTitle:  "Certificate & Completion",
              status:     "approved",
              reviewedAt: new Date(),
              reviewedBy: userId,
              adminNote:  overallFeedback,
            },
          });
        }

        // Mark track completed
        await prisma.internshipTrack.update({
          where: { id: trackId },
          data:  { isCompleted: true, completedAt: new Date() },
        });
      }

      return Response.json({ ok: true });
    } catch (err) {
      console.error(err);
      return Response.json({ error: err.message ?? "DB error" }, { status: 500 });
    }
  }

  // ── Mode 1: approve / reject a submitted step ────────────────────────────
  const { stepId, adminNote } = body;
  if (!stepId || !["approve", "reject"].includes(action)) {
    return Response.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    const step = await prisma.internshipStep.findUnique({
      where: { id: stepId }, include: { track: true },
    });
    if (!step) return Response.json({ error: "Step not found" }, { status: 404 });
    if (step.status !== "submitted") return Response.json({ error: "Step is not in submitted state" }, { status: 400 });

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

    // Step 5 completion is handled via "evaluate" action above, not here
    // Steps 1-4: approval does NOT auto-advance currentStep (admin does that manually)

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}