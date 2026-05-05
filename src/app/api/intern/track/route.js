// app/api/intern/track/route.js
import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { INTERNSHIP_STEPS } from "../../../../lib/internshipSteps";

// ─── GET: fetch the current user's internship track ───────────────────────────
export async function GET(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const applicantId = searchParams.get("applicantId");

  if (!applicantId) {
    return Response.json({ error: "applicantId required" }, { status: 400 });
  }

  try {
    const track = await prisma.internshipTrack.findUnique({
      where: {
        clerkUserId_applicantId: {
          clerkUserId: userId,
          applicantId,
        },
      },
      include: {
        steps: { orderBy: { stepNumber: "asc" } },
      },
    });

    return Response.json({ track });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}

// ─── POST: submit a step ──────────────────────────────────────────────────────
export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { applicantId, stepNumber, data } = await req.json();

  if (!applicantId || !stepNumber || !data) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const stepConfig = INTERNSHIP_STEPS.find(s => s.number === stepNumber);
  if (!stepConfig) {
    return Response.json({ error: "Invalid step" }, { status: 400 });
  }

  // Validate required fields
  for (const field of stepConfig.fields) {
    if (field.required && !data[field.key]?.trim()) {
      return Response.json(
        { error: `Field "${field.label}" is required.` },
        { status: 400 }
      );
    }
  }

  try {
    // Ensure a track record exists
    const track = await prisma.internshipTrack.findUnique({
      where: { clerkUserId_applicantId: { clerkUserId: userId, applicantId } },
      include: { steps: { orderBy: { stepNumber: "asc" } } },
    });

    if (!track) {
      return Response.json({ error: "Track not found. Contact admin." }, { status: 404 });
    }

    // Guard: can only submit the currentStep
    if (stepNumber !== track.currentStep) {
      return Response.json(
        { error: `You can only submit step ${track.currentStep} right now.` },
        { status: 400 }
      );
    }

    // Guard: step 5 is admin-controlled
    if (stepConfig.isAdminControlled) {
      return Response.json({ error: "This step is managed by admin." }, { status: 400 });
    }

    const existingStep = track.steps.find(s => s.stepNumber === stepNumber);

    if (existingStep) {
      // Only allow resubmission if rejected
      if (existingStep.status === "submitted" || existingStep.status === "approved") {
        return Response.json(
          { error: "This step has already been submitted." },
          { status: 400 }
        );
      }
      // Update (re-submit after rejection)
      await prisma.internshipStep.update({
        where: { id: existingStep.id },
        data: {
          data,
          status: "submitted",
          adminNote: null,
          reviewedAt: null,
          reviewedBy: null,
          submittedAt: new Date(),
        },
      });
    } else {
      // Create new step row
      await prisma.internshipStep.create({
        data: {
          trackId: track.id,
          stepNumber,
          stepTitle: stepConfig.title,
          data,
          status: "submitted",
          submittedAt: new Date(),
        },
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}