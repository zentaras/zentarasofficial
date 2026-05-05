// import { prisma } from "../../../../lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

// export async function POST(req) {
//   const { userId } = await auth();
//   if (!userId || !ADMIN_IDS.includes(userId)) {
//     return Response.json({ error: "Unauthorized" }, { status: 403 });
//   }

//   const { id, table, status, adminNote } = await req.json();
//   if (!id || !table || !status) {
//     return Response.json({ error: "Missing fields" }, { status: 400 });
//   }

//   const data = {
//     status,
//     adminNote: adminNote || null,
//     reviewedAt: new Date(),
//     reviewedBy: userId,
//   };

//   try {
//     if (table === "ai-resume-screener") {
//       await prisma.aiResumeScreenerApplicant.update({ where: { id }, data });
//     } else if (table === "ecommerce-analytics") {
//       await prisma.ecommerceAnalyticsApplicant.update({ where: { id }, data });
//     } else if (table === "sentiment-dashboard") {
//       await prisma.sentimentDashboardApplicant.update({ where: { id }, data });
//     } else {
//       return Response.json({ error: "Invalid table" }, { status: 400 });
//     }
//     return Response.json({ ok: true });
//   } catch (err) {
//     console.error(err);
//     return Response.json({ error: "DB error" }, { status: 500 });
//   }
// }

// app/api/admin/review/route.js
import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

const PROJECT_KEY_MAP = {
  "ai-resume-screener":  "ai-resume-screener",
  "ecommerce-analytics": "ecommerce-analytics",
  "sentiment-dashboard": "sentiment-dashboard",
};

const PROJECT_NAME_MAP = {
  "ai-resume-screener":  "AI Resume Screener",
  "ecommerce-analytics": "E-Commerce Analytics",
  "sentiment-dashboard": "Sentiment Dashboard",
};

export async function POST(req) {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id, table, status, adminNote } = await req.json();
  if (!id || !table || !status) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const data = {
    status,
    adminNote: adminNote || null,
    reviewedAt: new Date(),
    reviewedBy: userId,
  };

  try {
    let applicant = null;

    if (table === "ai-resume-screener") {
      applicant = await prisma.aiResumeScreenerApplicant.update({ where: { id }, data });
    } else if (table === "ecommerce-analytics") {
      applicant = await prisma.ecommerceAnalyticsApplicant.update({ where: { id }, data });
    } else if (table === "sentiment-dashboard") {
      applicant = await prisma.sentimentDashboardApplicant.update({ where: { id }, data });
    } else {
      return Response.json({ error: "Invalid table" }, { status: 400 });
    }

    // ── Auto-create InternshipTrack when shortlisted ──────────────────────────
    if (status === "Shortlisted" && applicant?.clerkUserId) {
      await prisma.internshipTrack.upsert({
        where: {
          clerkUserId_applicantId: {
            clerkUserId: applicant.clerkUserId,
            applicantId: id,
          },
        },
        update: {}, // already exists — no-op
        create: {
          clerkUserId: applicant.clerkUserId,
          applicantId: id,
          projectKey:  PROJECT_KEY_MAP[table],
          projectName: PROJECT_NAME_MAP[table],
          currentStep: 1,
          isCompleted: false,
        },
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}