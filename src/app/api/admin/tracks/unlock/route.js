

// // app/api/admin/tracks/unlock/route.js
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
//   // action: "unlock" | "lock" | "update_deadline"

//   if (!trackId || !stepNumber || !["unlock", "lock", "update_deadline"].includes(action)) {
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

//     // ── Update deadline only — don't touch currentStep ────────────────────────
//     if (action === "update_deadline") {
//       const deadlineDate = deadline ? new Date(deadline) : null;
//       const existing     = track.steps.find(s => s.stepNumber === stepNumber);

//       if (existing) {
//         await prisma.internshipStep.update({
//           where: { id: existing.id },
//           data:  { deadline: deadlineDate },
//         });
//       } else {
//         // Create stub step row just to store the deadline
//         await prisma.internshipStep.create({
//           data: {
//             trackId,
//             stepNumber,
//             stepTitle: STEP_TITLES[stepNumber] ?? `Step ${stepNumber}`,
//             status:    "pending",
//             deadline:  deadlineDate,
//           },
//         });
//       }
//       return Response.json({ ok: true, action: "deadline_updated" });
//     }

//     // ── Unlock: set currentStep to requested step ─────────────────────────────
//     if (action === "unlock") {
//       await prisma.internshipTrack.update({
//         where: { id: trackId },
//         data:  { currentStep: stepNumber },
//       });

//       // Store deadline if provided
//       if (deadline) {
//         const deadlineDate = new Date(deadline);
//         const existing     = track.steps.find(s => s.stepNumber === stepNumber);
//         if (existing) {
//           await prisma.internshipStep.update({
//             where: { id: existing.id },
//             data:  { deadline: deadlineDate },
//           });
//         } else {
//           await prisma.internshipStep.create({
//             data: {
//               trackId,
//               stepNumber,
//               stepTitle: STEP_TITLES[stepNumber] ?? `Step ${stepNumber}`,
//               status:    "pending",
//               deadline:  deadlineDate,
//             },
//           });
//         }
//       }
//       return Response.json({ ok: true, action: "unlocked", currentStep: stepNumber });
//     }

//     // ── Lock: set currentStep to stepNumber - 1 ───────────────────────────────
//     if (action === "lock") {
//       const newCurrentStep = Math.max(1, stepNumber - 1);
//       await prisma.internshipTrack.update({
//         where: { id: trackId },
//         data:  { currentStep: newCurrentStep },
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
  1: "Project Briefing & Setup",
  2: "Week 1–2: EDA & Data Cleaning",
  3: "Mid-Point: Analysis & Insights",
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

  // Step 1 unlock is handled automatically via publish_briefing — block manual unlock
  if (action === "unlock" && stepNumber === 1) {
    return Response.json(
      { error: "Step 1 is auto-unlocked when you publish the project briefing." },
      { status: 400 }
    );
  }

  try {
    const track = await prisma.internshipTrack.findUnique({
      where: { id: trackId },
      include: { steps: true },
    });
    if (!track) return Response.json({ error: "Track not found" }, { status: 404 });

    // ── update_deadline only ──────────────────────────────────────────────────
    if (action === "update_deadline") {
      const deadlineDate = deadline ? new Date(deadline) : null;
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
      return Response.json({ ok: true, action: "deadline_updated" });
    }

    // ── unlock: advance currentStep ───────────────────────────────────────────
    if (action === "unlock") {
      await prisma.internshipTrack.update({
        where: { id: trackId },
        data:  { currentStep: stepNumber },
      });

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

    // ── lock: roll back currentStep ───────────────────────────────────────────
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