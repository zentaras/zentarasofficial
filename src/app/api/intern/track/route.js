

// // app/api/intern/track/route.js
// import { prisma } from "../../../../lib/prisma";
// import { auth } from "@clerk/nextjs/server";
// import { INTERNSHIP_STEPS } from "../../../../lib/internshipSteps";

// // ─── GET: fetch the current user's internship track ───────────────────────────
// export async function GET(req) {
//   const { userId } = await auth();
//   if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

//   const { searchParams } = new URL(req.url);
//   const applicantId = searchParams.get("applicantId");

//   if (!applicantId) {
//     return Response.json({ error: "applicantId required" }, { status: 400 });
//   }

//   try {
//     const track = await prisma.internshipTrack.findUnique({
//       where: {
//         clerkUserId_applicantId: { clerkUserId: userId, applicantId },
//       },
//       include: {
//         steps: { orderBy: { stepNumber: "asc" } },
//       },
//     });

//     return Response.json({ track });
//   } catch (err) {
//     console.error(err);
//     return Response.json({ error: "DB error" }, { status: 500 });
//   }
// }

// // ─── POST: intern submits a step (steps 2–4 only) ────────────────────────────
// export async function POST(req) {
//   const { userId } = await auth();
//   if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

//   const { applicantId, stepNumber, data } = await req.json();

//   if (!applicantId || !stepNumber || !data) {
//     return Response.json({ error: "Missing fields" }, { status: 400 });
//   }

//   const stepConfig = INTERNSHIP_STEPS.find(s => s.number === stepNumber);
//   if (!stepConfig) {
//     return Response.json({ error: "Invalid step" }, { status: 400 });
//   }

//   // Guard: Step 1 is admin-controlled (published via publish_briefing)
//   if (stepNumber === 1) {
//     return Response.json(
//       { error: "Step 1 is assigned by admin. No submission required." },
//       { status: 400 }
//     );
//   }

//   // Guard: Step 5 is admin-controlled (published via evaluate)
//   if (stepConfig.isAdminControlled) {
//     return Response.json(
//       { error: "This step is managed by admin." },
//       { status: 400 }
//     );
//   }

//   // Validate required fields
//   for (const field of stepConfig.fields) {
//     if (field.required && !data[field.key]?.trim()) {
//       return Response.json(
//         { error: `"${field.label}" is required.` },
//         { status: 400 }
//       );
//     }
//   }

//   // Validate URL fields
//   for (const field of stepConfig.fields) {
//     if (field.type === "url" && data[field.key]) {
//       try { new URL(data[field.key]); } catch {
//         return Response.json(
//           { error: `"${field.label}" must be a valid URL.` },
//           { status: 400 }
//         );
//       }
//     }
//   }

//   try {
//     const track = await prisma.internshipTrack.findUnique({
//       where: { clerkUserId_applicantId: { clerkUserId: userId, applicantId } },
//       include: { steps: { orderBy: { stepNumber: "asc" } } },
//     });

//     if (!track) {
//       return Response.json({ error: "Track not found. Contact admin." }, { status: 404 });
//     }

//     // Guard: can only submit the currentStep
//     if (stepNumber !== track.currentStep) {
//       return Response.json(
//         { error: `You can only submit Step ${track.currentStep} right now.` },
//         { status: 400 }
//       );
//     }

//     // Guard: track must not be completed
//     if (track.isCompleted) {
//       return Response.json(
//         { error: "Your internship is already completed." },
//         { status: 400 }
//       );
//     }

//     const existingStep = track.steps.find(s => s.stepNumber === stepNumber);

//     if (existingStep) {
//       // Block resubmission if already submitted or approved
//       if (existingStep.status === "submitted") {
//         return Response.json(
//           { error: "This step is already under review. Wait for admin feedback." },
//           { status: 400 }
//         );
//       }
//       if (existingStep.status === "approved") {
//         return Response.json(
//           { error: "This step has already been approved." },
//           { status: 400 }
//         );
//       }
//       // Resubmit after rejection — reset points so admin re-awards
//       await prisma.internshipStep.update({
//         where: { id: existingStep.id },
//         data: {
//           data,
//           status:       "submitted",
//           adminNote:    null,
//           pointsAwarded: null,   // reset — admin will re-award after review
//           reviewedAt:   null,
//           reviewedBy:   null,
//           submittedAt:  new Date(),
//         },
//       });
//     } else {
//       // First submission
//       await prisma.internshipStep.create({
//         data: {
//           trackId:    track.id,
//           stepNumber,
//           stepTitle:  stepConfig.title,
//           data,
//           status:     "submitted",
//           submittedAt: new Date(),
//         },
//       });
//     }

//     return Response.json({ ok: true });
//   } catch (err) {
//     console.error(err);
//     return Response.json({ error: "DB error" }, { status: 500 });
//   }
// }



// app/api/intern/track/route.js
import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getStepsByProjectKey } from "../../../../lib/internshipSteps";

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
        clerkUserId_applicantId: { clerkUserId: userId, applicantId },
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

// ─── POST: intern submits a step (steps 2–4 only) ────────────────────────────
export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { applicantId, stepNumber, data } = await req.json();

  if (!applicantId || !stepNumber || !data) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    // Fetch track first so we know the projectKey for step config lookup
    const track = await prisma.internshipTrack.findUnique({
      where: { clerkUserId_applicantId: { clerkUserId: userId, applicantId } },
      include: { steps: { orderBy: { stepNumber: "asc" } } },
    });

    if (!track) {
      return Response.json({ error: "Track not found. Contact admin." }, { status: 404 });
    }

    // ── Derive the correct step config for this intern's role ──
    const INTERNSHIP_STEPS = getStepsByProjectKey(track.projectKey);
    const stepConfig = INTERNSHIP_STEPS.find(s => s.number === stepNumber);

    if (!stepConfig) {
      return Response.json({ error: "Invalid step" }, { status: 400 });
    }

    // Guard: Step 1 is admin-controlled (published via publish_briefing)
    if (stepNumber === 1) {
      return Response.json(
        { error: "Step 1 is assigned by admin. No submission required." },
        { status: 400 }
      );
    }

    // Guard: Step 5 is admin-controlled (published via evaluate)
    if (stepConfig.isAdminControlled) {
      return Response.json(
        { error: "This step is managed by admin." },
        { status: 400 }
      );
    }

    // Validate required fields
    for (const field of stepConfig.fields) {
      if (field.required && !data[field.key]?.trim()) {
        return Response.json(
          { error: `"${field.label}" is required.` },
          { status: 400 }
        );
      }
    }

    // Validate URL fields
    for (const field of stepConfig.fields) {
      if (field.type === "url" && data[field.key]) {
        try { new URL(data[field.key]); } catch {
          return Response.json(
            { error: `"${field.label}" must be a valid URL.` },
            { status: 400 }
          );
        }
      }
    }

    // Guard: can only submit the currentStep
    if (stepNumber !== track.currentStep) {
      return Response.json(
        { error: `You can only submit Step ${track.currentStep} right now.` },
        { status: 400 }
      );
    }

    // Guard: track must not be completed
    if (track.isCompleted) {
      return Response.json(
        { error: "Your internship is already completed." },
        { status: 400 }
      );
    }

    const existingStep = track.steps.find(s => s.stepNumber === stepNumber);

    if (existingStep) {
      // Block resubmission if already submitted or approved
      if (existingStep.status === "submitted") {
        return Response.json(
          { error: "This step is already under review. Wait for admin feedback." },
          { status: 400 }
        );
      }
      if (existingStep.status === "approved") {
        return Response.json(
          { error: "This step has already been approved." },
          { status: 400 }
        );
      }
      // Resubmit after rejection — reset points so admin re-awards
      await prisma.internshipStep.update({
        where: { id: existingStep.id },
        data: {
          data,
          status:        "submitted",
          adminNote:     null,
          pointsAwarded: null,
          reviewedAt:    null,
          reviewedBy:    null,
          submittedAt:   new Date(),
        },
      });
    } else {
      // First submission
      await prisma.internshipStep.create({
        data: {
          trackId:     track.id,
          stepNumber,
          stepTitle:   stepConfig.title,   // correct title for this role
          data,
          status:      "submitted",
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