// // app/api/admin/tracks/unlock/route.js
// import { prisma } from "../../../../../lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

// export async function POST(req) {
//   const { userId } = await auth();
//   if (!userId || !ADMIN_IDS.includes(userId)) {
//     return Response.json({ error: "Unauthorized" }, { status: 403 });
//   }

//   const { trackId, stepNumber } = await req.json();

//   if (!trackId || !stepNumber) {
//     return Response.json({ error: "Missing trackId or stepNumber" }, { status: 400 });
//   }

//   try {
//     const track = await prisma.internshipTrack.findUnique({
//       where: { id: trackId },
//     });

//     if (!track) {
//       return Response.json({ error: "Track not found" }, { status: 404 });
//     }

//     // Only allow unlocking the very next step
//     if (stepNumber !== track.currentStep + 1) {
//       return Response.json(
//         { error: `Can only unlock step ${track.currentStep + 1} right now.` },
//         { status: 400 }
//       );
//     }

//     const MAX_STEPS = 5;
//     if (stepNumber > MAX_STEPS) {
//       return Response.json({ error: "No more steps to unlock." }, { status: 400 });
//     }

//     await prisma.internshipTrack.update({
//       where: { id: trackId },
//       data:  { currentStep: stepNumber },
//     });

//     return Response.json({ ok: true, currentStep: stepNumber });
//   } catch (err) {
//     console.error(err);
//     return Response.json({ error: "DB error" }, { status: 500 });
//   }
// }

// app/api/admin/tracks/unlock/route.js
// import { prisma } from "../../../../../lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

// const STEP_TITLES = {
//   1: "Internship Introduction & Project Briefing",
//   2: "Week 1–2 Progress Update",
//   3: "Mid-Point Project Status",
//   4: "Final Submission",
//   5: "Certificate & Completion",
// };

// export async function POST(req) {
//   const { userId } = await auth();
//   if (!userId || !ADMIN_IDS.includes(userId)) {
//     return Response.json({ error: "Unauthorized" }, { status: 403 });
//   }

//   const { trackId, stepNumber, action, deadline } = await req.json();

//   if (!trackId || !stepNumber || !["unlock", "lock"].includes(action)) {
//     return Response.json({ error: "Missing or invalid fields" }, { status: 400 });
//   }

//   if (stepNumber < 1 || stepNumber > 5) {
//     return Response.json({ error: "Invalid step number" }, { status: 400 });
//   }

//   try {
//     const track = await prisma.internshipTrack.findUnique({
//       where: { id: trackId },
//       include: { steps: true },
//     });
//     if (!track) return Response.json({ error: "Track not found" }, { status: 404 });

//     if (action === "unlock") {
//       // Set currentStep to the requested step number
//       await prisma.internshipTrack.update({
//         where: { id: trackId },
//         data: { currentStep: stepNumber },
//       });

//       // Handle deadline — upsert the step record
//       if (deadline) {
//         const deadlineDate = new Date(deadline);
//         const existing = track.steps.find(s => s.stepNumber === stepNumber);

//         if (existing) {
//           // Update existing step record with deadline
//           await prisma.internshipStep.update({
//             where: { id: existing.id },
//             data: { deadline: deadlineDate },
//           });
//         } else {
//           // Create a stub step record to store the deadline
//           await prisma.internshipStep.create({
//             data: {
//               trackId,
//               stepNumber,
//               stepTitle:  STEP_TITLES[stepNumber] ?? `Step ${stepNumber}`,
//               status:     "pending",
//               deadline:   deadlineDate,
//             },
//           });
//         }
//       }

//       return Response.json({ ok: true, action: "unlocked", currentStep: stepNumber });
//     }

//     if (action === "lock") {
//       // Lock step N → currentStep goes back to N-1
//       const newCurrentStep = Math.max(1, stepNumber - 1);
//       await prisma.internshipTrack.update({
//         where: { id: trackId },
//         data: { currentStep: newCurrentStep },
//       });
//       return Response.json({ ok: true, action: "locked", currentStep: newCurrentStep });
//     }
//   } catch (err) {
//     console.error("Unlock route error:", err);
//     return Response.json({ error: err.message ?? "DB error" }, { status: 500 });
//   }
// }


// app/api/admin/tracks/unlock/route.js
import { prisma } from "../../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

const STEP_TITLES = {
  1: "Internship Introduction & Project Briefing",
  2: "Week 1–2 Progress Update",
  3: "Mid-Point Project Status",
  4: "Final Submission",
  5: "Certificate & Completion",
};

export async function POST(req) {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { trackId, stepNumber, action, deadline } = await req.json();
  // action: "unlock" | "lock" | "update_deadline"

  if (!trackId || !stepNumber || !["unlock", "lock", "update_deadline"].includes(action)) {
    return Response.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  if (stepNumber < 1 || stepNumber > 5) {
    return Response.json({ error: "Invalid step number" }, { status: 400 });
  }

  try {
    const track = await prisma.internshipTrack.findUnique({
      where: { id: trackId },
      include: { steps: true },
    });
    if (!track) return Response.json({ error: "Track not found" }, { status: 404 });

    // ── Update deadline only — don't touch currentStep ────────────────────────
    if (action === "update_deadline") {
      const deadlineDate = deadline ? new Date(deadline) : null;
      const existing     = track.steps.find(s => s.stepNumber === stepNumber);

      if (existing) {
        await prisma.internshipStep.update({
          where: { id: existing.id },
          data:  { deadline: deadlineDate },
        });
      } else {
        // Create stub step row just to store the deadline
        await prisma.internshipStep.create({
          data: {
            trackId,
            stepNumber,
            stepTitle: STEP_TITLES[stepNumber] ?? `Step ${stepNumber}`,
            status:    "pending",
            deadline:  deadlineDate,
          },
        });
      }
      return Response.json({ ok: true, action: "deadline_updated" });
    }

    // ── Unlock: set currentStep to requested step ─────────────────────────────
    if (action === "unlock") {
      await prisma.internshipTrack.update({
        where: { id: trackId },
        data:  { currentStep: stepNumber },
      });

      // Store deadline if provided
      if (deadline) {
        const deadlineDate = new Date(deadline);
        const existing     = track.steps.find(s => s.stepNumber === stepNumber);
        if (existing) {
          await prisma.internshipStep.update({
            where: { id: existing.id },
            data:  { deadline: deadlineDate },
          });
        } else {
          await prisma.internshipStep.create({
            data: {
              trackId,
              stepNumber,
              stepTitle: STEP_TITLES[stepNumber] ?? `Step ${stepNumber}`,
              status:    "pending",
              deadline:  deadlineDate,
            },
          });
        }
      }
      return Response.json({ ok: true, action: "unlocked", currentStep: stepNumber });
    }

    // ── Lock: set currentStep to stepNumber - 1 ───────────────────────────────
    if (action === "lock") {
      const newCurrentStep = Math.max(1, stepNumber - 1);
      await prisma.internshipTrack.update({
        where: { id: trackId },
        data:  { currentStep: newCurrentStep },
      });
      return Response.json({ ok: true, action: "locked", currentStep: newCurrentStep });
    }

  } catch (err) {
    console.error("Unlock route error:", err);
    return Response.json({ error: err.message ?? "DB error" }, { status: 500 });
  }
}