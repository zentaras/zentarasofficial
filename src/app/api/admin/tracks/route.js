

// // app/api/admin/tracks/route.js
// import { prisma } from "../../../../lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());
// function isAdmin(userId) { return userId && ADMIN_IDS.includes(userId); }

// const STEP_TITLES = {
//   1: "Project Briefing & Setup",
//   2: "Week 1–2: EDA & Data Cleaning",
//   3: "Mid-Point: Analysis & Insights",
//   4: "Final Submission",
//   5: "Certificate & Completion",
// };

// // ─── GET ──────────────────────────────────────────────────────────────────────
// export async function GET(req) {
//   const { userId } = await auth();
//   if (!isAdmin(userId)) return Response.json({ error: "Unauthorized" }, { status: 403 });

//   const { searchParams } = new URL(req.url);
//   const projectKey = searchParams.get("projectKey");
//   const trackId    = searchParams.get("trackId");

//   try {
//     if (trackId) {
//       const track = await prisma.internshipTrack.findUnique({
//         where: { id: trackId },
//         include: {
//           steps: { orderBy: { stepNumber: "asc" } },
//           user:  { select: { firstName: true, lastName: true, email: true, imageUrl: true } },
//         },
//       });
//       return Response.json({ track });
//     }

//     const tracks = await prisma.internshipTrack.findMany({
//       where:   projectKey ? { projectKey } : undefined,
//       orderBy: { createdAt: "desc" },
//       include: {
//         steps: { orderBy: { stepNumber: "asc" } },
//         user:  { select: { firstName: true, lastName: true, email: true, imageUrl: true } },
//       },
//     });
//     return Response.json({ tracks });
//   } catch (err) {
//     console.error(err);
//     return Response.json({ error: "DB error" }, { status: 500 });
//   }
// }

// // ─── POST ─────────────────────────────────────────────────────────────────────
// // Actions:
// //   "approve" | "reject"  → review a submitted step (steps 2–4)
// //   "publish_briefing"    → admin publishes Step 1 briefing data + auto-approves it
// //   "award_points"        → admin sets pointsAwarded on a step (steps 2–4)
// //   "evaluate"            → admin saves Step 5 evaluation (analyticalFeedback, insightsFeedback, links)
// export async function POST(req) {
//   const { userId } = await auth();
//   if (!isAdmin(userId)) return Response.json({ error: "Unauthorized" }, { status: 403 });

//   const body = await req.json();
//   const { action } = body;

//   // ── publish_briefing: admin publishes Step 1 data ─────────────────────────
//   if (action === "publish_briefing") {
//     const { trackId, assignedDataset, problemStatement, toolsPlanned, approach } = body;

//     if (!trackId) return Response.json({ error: "trackId required" }, { status: 400 });
//     if (!assignedDataset || !problemStatement || !toolsPlanned || !approach) {
//       return Response.json({ error: "All briefing fields are required." }, { status: 400 });
//     }

//     try {
//       const track = await prisma.internshipTrack.findUnique({
//         where: { id: trackId }, include: { steps: true },
//       });
//       if (!track) return Response.json({ error: "Track not found" }, { status: 404 });

//       const briefingData = { assignedDataset, problemStatement, toolsPlanned, approach };
//       const existing     = track.steps.find(s => s.stepNumber === 1);

//       if (existing) {
//         await prisma.internshipStep.update({
//           where: { id: existing.id },
//           data: {
//             data:         briefingData,
//             status:       "approved",
//             pointsAwarded: 100,          // auto 100 pts for step 1
//             reviewedAt:   new Date(),
//             reviewedBy:   userId,
//           },
//         });
//       } else {
//         await prisma.internshipStep.create({
//           data: {
//             trackId,
//             stepNumber:   1,
//             stepTitle:    STEP_TITLES[1],
//             data:         briefingData,
//             status:       "approved",
//             pointsAwarded: 100,
//             reviewedAt:   new Date(),
//             reviewedBy:   userId,
//             submittedAt:  new Date(),
//           },
//         });
//       }

//       // Auto-advance currentStep to 2 so intern can now see Step 2 active
//       if (track.currentStep <= 1) {
//         await prisma.internshipTrack.update({
//           where: { id: trackId },
//           data:  { currentStep: 2 },
//         });
//       }

//       return Response.json({ ok: true, action: "briefing_published" });
//     } catch (err) {
//       console.error(err);
//       return Response.json({ error: err.message ?? "DB error" }, { status: 500 });
//     }
//   }

//   // ── award_points: admin awards points to a step (steps 2–4) ───────────────
//   if (action === "award_points") {
//     const { stepId, points } = body;

//     if (!stepId || points == null) {
//       return Response.json({ error: "stepId and points are required." }, { status: 400 });
//     }
//     if (typeof points !== "number" || points < 0 || points > 100) {
//       return Response.json({ error: "Points must be a number between 0 and 100." }, { status: 400 });
//     }

//     try {
//       const step = await prisma.internshipStep.findUnique({ where: { id: stepId } });
//       if (!step) return Response.json({ error: "Step not found" }, { status: 404 });
//       if (step.stepNumber === 1) return Response.json({ error: "Step 1 points are auto-awarded." }, { status: 400 });
//       if (step.stepNumber === 5) return Response.json({ error: "Step 5 has no points." }, { status: 400 });

//       await prisma.internshipStep.update({
//         where: { id: stepId },
//         data:  { pointsAwarded: points },
//       });

//       return Response.json({ ok: true, action: "points_awarded", points });
//     } catch (err) {
//       console.error(err);
//       return Response.json({ error: err.message ?? "DB error" }, { status: 500 });
//     }
//   }

//   // ── evaluate: admin publishes Step 5 evaluation ───────────────────────────
//   if (action === "evaluate") {
//     const {
//       trackId,
//       analyticalFeedback,
//       insightsFeedback,
//       certificateLink,
//       lorLink,
//       projectRepoLink,
//       evaluationNotes,
//     } = body;

//     if (!trackId) return Response.json({ error: "trackId required" }, { status: 400 });
//     if (!analyticalFeedback || !insightsFeedback) {
//       return Response.json({ error: "Both feedback fields are required to complete the evaluation." }, { status: 400 });
//     }

//     try {
//       // Save evaluation fields to the track
//       await prisma.internshipTrack.update({
//         where: { id: trackId },
//         data: {
//           analyticalFeedback: analyticalFeedback,
//           insightsFeedback:   insightsFeedback,
//           certificateLink:    certificateLink  ?? null,
//           lorLink:            lorLink          ?? null,
//           projectRepoLink:    projectRepoLink  ?? null,
//           evaluationNotes:    evaluationNotes  ?? null,
//         },
//       });

//       const track = await prisma.internshipTrack.findUnique({
//         where: { id: trackId }, include: { steps: true },
//       });

//       // Upsert Step 5 row as approved
//       const step5 = track?.steps.find(s => s.stepNumber === 5);
//       if (step5) {
//         await prisma.internshipStep.update({
//           where: { id: step5.id },
//           data: {
//             status:     "approved",
//             reviewedAt: new Date(),
//             reviewedBy: userId,
//           },
//         });
//       } else if (track) {
//         await prisma.internshipStep.create({
//           data: {
//             trackId,
//             stepNumber: 5,
//             stepTitle:  STEP_TITLES[5],
//             status:     "approved",
//             reviewedAt: new Date(),
//             reviewedBy: userId,
//           },
//         });
//       }

//       // Mark track as completed
//       await prisma.internshipTrack.update({
//         where: { id: trackId },
//         data:  { isCompleted: true, completedAt: new Date() },
//       });

//       return Response.json({ ok: true, action: "evaluated" });
//     } catch (err) {
//       console.error(err);
//       return Response.json({ error: err.message ?? "DB error" }, { status: 500 });
//     }
//   }

//   // ── approve / reject: review a submitted step (steps 2–4) ────────────────
//   const { stepId, adminNote, points } = body;
//   if (!stepId || !["approve", "reject"].includes(action)) {
//     return Response.json({ error: "Missing or invalid fields" }, { status: 400 });
//   }

//   try {
//     const step = await prisma.internshipStep.findUnique({
//       where: { id: stepId }, include: { track: true },
//     });
//     if (!step)                       return Response.json({ error: "Step not found" }, { status: 404 });
//     if (step.stepNumber === 1)       return Response.json({ error: "Step 1 is managed via publish_briefing." }, { status: 400 });
//     if (step.stepNumber === 5)       return Response.json({ error: "Step 5 is managed via evaluate." }, { status: 400 });
//     if (step.status !== "submitted") return Response.json({ error: "Step is not in submitted state." }, { status: 400 });

//     const newStatus = action === "approve" ? "approved" : "rejected";

//     // When approving, allow optional points to be set at the same time
//     const pointsData = (action === "approve" && points != null && points >= 0 && points <= 100)
//       ? { pointsAwarded: points }
//       : {};

//     await prisma.internshipStep.update({
//       where: { id: stepId },
//       data: {
//         status:     newStatus,
//         adminNote:  adminNote ?? null,
//         reviewedAt: new Date(),
//         reviewedBy: userId,
//         ...pointsData,
//       },
//     });

//     return Response.json({ ok: true, action: newStatus });
//   } catch (err) {
//     console.error(err);
//     return Response.json({ error: "DB error" }, { status: 500 });
//   }
// }


// app/api/admin/tracks/route.js
import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getStepsByProjectKey } from "../../../../lib/internshipSteps";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());
function isAdmin(userId) { return userId && ADMIN_IDS.includes(userId); }

// Helper: get the correct step title for a given projectKey + stepNumber
function getStepTitle(projectKey, stepNumber) {
  const steps = getStepsByProjectKey(projectKey);
  return steps.find(s => s.number === stepNumber)?.title ?? `Step ${stepNumber}`;
}

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
// Actions:
//   "approve" | "reject"   → review a submitted step (steps 2–4)
//   "publish_briefing"     → admin publishes Step 1 briefing + auto-approves it
//   "award_points"         → admin sets pointsAwarded on a step (steps 2–4)
//   "evaluate"             → admin saves Step 5 evaluation
export async function POST(req) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();
  const { action } = body;

  // ── publish_briefing ───────────────────────────────────────────────────────
  if (action === "publish_briefing") {
    const { trackId, assignedDataset, problemStatement, toolsPlanned, approach } = body;

    if (!trackId) return Response.json({ error: "trackId required" }, { status: 400 });
    if (!assignedDataset || !problemStatement || !toolsPlanned || !approach) {
      return Response.json({ error: "All briefing fields are required." }, { status: 400 });
    }

    try {
      const track = await prisma.internshipTrack.findUnique({
        where: { id: trackId }, include: { steps: true },
      });
      if (!track) return Response.json({ error: "Track not found" }, { status: 404 });

      const briefingData = { assignedDataset, problemStatement, toolsPlanned, approach };
      const existing     = track.steps.find(s => s.stepNumber === 1);
      // Use role-specific title for step 1
      const step1Title   = getStepTitle(track.projectKey, 1);

      if (existing) {
        await prisma.internshipStep.update({
          where: { id: existing.id },
          data: {
            data:          briefingData,
            status:        "approved",
            pointsAwarded: 100,
            reviewedAt:    new Date(),
            reviewedBy:    userId,
          },
        });
      } else {
        await prisma.internshipStep.create({
          data: {
            trackId,
            stepNumber:    1,
            stepTitle:     step1Title,
            data:          briefingData,
            status:        "approved",
            pointsAwarded: 100,
            reviewedAt:    new Date(),
            reviewedBy:    userId,
            submittedAt:   new Date(),
          },
        });
      }

      // Auto-advance currentStep to 2
      if (track.currentStep <= 1) {
        await prisma.internshipTrack.update({
          where: { id: trackId },
          data:  { currentStep: 2 },
        });
      }

      return Response.json({ ok: true, action: "briefing_published" });
    } catch (err) {
      console.error(err);
      return Response.json({ error: err.message ?? "DB error" }, { status: 500 });
    }
  }

  // ── award_points ───────────────────────────────────────────────────────────
  if (action === "award_points") {
    const { stepId, points } = body;

    if (!stepId || points == null) {
      return Response.json({ error: "stepId and points are required." }, { status: 400 });
    }
    if (typeof points !== "number" || points < 0 || points > 100) {
      return Response.json({ error: "Points must be a number between 0 and 100." }, { status: 400 });
    }

    try {
      const step = await prisma.internshipStep.findUnique({ where: { id: stepId } });
      if (!step) return Response.json({ error: "Step not found" }, { status: 404 });
      if (step.stepNumber === 1) return Response.json({ error: "Step 1 points are auto-awarded." }, { status: 400 });
      if (step.stepNumber === 5) return Response.json({ error: "Step 5 has no points." }, { status: 400 });

      await prisma.internshipStep.update({
        where: { id: stepId },
        data:  { pointsAwarded: points },
      });

      return Response.json({ ok: true, action: "points_awarded", points });
    } catch (err) {
      console.error(err);
      return Response.json({ error: err.message ?? "DB error" }, { status: 500 });
    }
  }

  // ── evaluate ───────────────────────────────────────────────────────────────
  if (action === "evaluate") {
    const {
      trackId, analyticalFeedback, insightsFeedback,
      certificateLink, lorLink, projectRepoLink, evaluationNotes,
    } = body;

    if (!trackId) return Response.json({ error: "trackId required" }, { status: 400 });
    if (!analyticalFeedback || !insightsFeedback) {
      return Response.json({ error: "Both feedback fields are required to complete the evaluation." }, { status: 400 });
    }

    try {
      await prisma.internshipTrack.update({
        where: { id: trackId },
        data: {
          analyticalFeedback,
          insightsFeedback,
          certificateLink:  certificateLink  ?? null,
          lorLink:          lorLink          ?? null,
          projectRepoLink:  projectRepoLink  ?? null,
          evaluationNotes:  evaluationNotes  ?? null,
        },
      });

      const track = await prisma.internshipTrack.findUnique({
        where: { id: trackId }, include: { steps: true },
      });

      const step5Title = getStepTitle(track.projectKey, 5);
      const step5      = track?.steps.find(s => s.stepNumber === 5);

      if (step5) {
        await prisma.internshipStep.update({
          where: { id: step5.id },
          data: { status: "approved", reviewedAt: new Date(), reviewedBy: userId },
        });
      } else if (track) {
        await prisma.internshipStep.create({
          data: {
            trackId,
            stepNumber: 5,
            stepTitle:  step5Title,
            status:     "approved",
            reviewedAt: new Date(),
            reviewedBy: userId,
          },
        });
      }

      await prisma.internshipTrack.update({
        where: { id: trackId },
        data:  { isCompleted: true, completedAt: new Date() },
      });

      return Response.json({ ok: true, action: "evaluated" });
    } catch (err) {
      console.error(err);
      return Response.json({ error: err.message ?? "DB error" }, { status: 500 });
    }
  }

  // ── approve / reject ───────────────────────────────────────────────────────
  const { stepId, adminNote, points } = body;
  if (!stepId || !["approve", "reject"].includes(action)) {
    return Response.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    const step = await prisma.internshipStep.findUnique({
      where: { id: stepId }, include: { track: true },
    });
    if (!step)                       return Response.json({ error: "Step not found" }, { status: 404 });
    if (step.stepNumber === 1)       return Response.json({ error: "Step 1 is managed via publish_briefing." }, { status: 400 });
    if (step.stepNumber === 5)       return Response.json({ error: "Step 5 is managed via evaluate." }, { status: 400 });
    if (step.status !== "submitted") return Response.json({ error: "Step is not in submitted state." }, { status: 400 });

    const newStatus  = action === "approve" ? "approved" : "rejected";
    const pointsData = (action === "approve" && points != null && points >= 0 && points <= 100)
      ? { pointsAwarded: points }
      : {};

    await prisma.internshipStep.update({
      where: { id: stepId },
      data: {
        status:     newStatus,
        adminNote:  adminNote ?? null,
        reviewedAt: new Date(),
        reviewedBy: userId,
        ...pointsData,
      },
    });

    return Response.json({ ok: true, action: newStatus });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}