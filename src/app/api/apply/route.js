// import { prisma } from "../../../lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// export async function POST(req) {
//   const body = await req.json();
//   const { userId } = await auth();

//   const {
//     project, fullName, email,
//     college, branch, graduationYear, cgpa,
//     githubUrl, resumeLink,
//   } = body;

//   // Validate only the fields that actually exist in the form now
//   if (!project || !fullName || !email || !college || !branch ||
//       !graduationYear || !githubUrl || !resumeLink) {
//     return Response.json({ error: "Missing required fields." }, { status: 400 });
//   }

//   const common = {
//     clerkUserId: userId ?? null,
//     fullName,
//     email,
//     college,
//     branch,
//     graduationYear,
//     cgpa: cgpa || null,
//     githubUrl,
//     resumeLink,
//   };

//   try {
//     if (project === "data-analyst-intern") {
//       await prisma.dataAnalystApplicant.create({ data: common });
//     } else if (project === "web-dev-intern") {
//       await prisma.webDevApplicant.create({ data: common });
//     } else {
//       return Response.json({ error: "Invalid project." }, { status: 400 });
//     }

//     return Response.json({ ok: true });
//   } catch (err) {
//     console.error("Apply error:", err);
//     return Response.json({ error: "Server error." }, { status: 500 });
//   }
// }



import { prisma } from "../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const body = await req.json();
  const { userId } = await auth();

  const {
    project, fullName, email,
    college, branch, graduationYear, cgpa,
    githubUrl, resumeLink,
  } = body;

  if (!project || !fullName || !email || !college || !branch ||
      !graduationYear || !githubUrl || !resumeLink) {
    return Response.json({ error: "Missing required fields." }, { status: 400 });
  }

  const common = {
    clerkUserId: userId ?? null,
    fullName,
    email,
    college,
    branch,
    graduationYear,
    cgpa: cgpa || null,
    githubUrl,
    resumeLink,
  };

  try {
    // If user is signed in, ensure their User row exists in Postgres.
    // This heals the "Clerk account created but webhook missed" case.
    if (userId) {
      const fallbackUsername = email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "")
        .slice(0, 30) || `user_${userId.slice(-8)}`;

      await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},  // no-op if row already exists
        create: {
          clerkId:   userId,
          email:     email,
          firstName: fullName.split(" ")[0]  ?? null,
          lastName:  fullName.split(" ").slice(1).join(" ") || null,
          username:  fallbackUsername,
        },
      });
    }

    if (project === "data-analyst-intern") {
      await prisma.dataAnalystApplicant.create({ data: common });
    } else if (project === "web-dev-intern") {
      await prisma.webDevApplicant.create({ data: common });
    } else {
      return Response.json({ error: "Invalid project." }, { status: 400 });
    }

    return Response.json({ ok: true });

  } catch (err) {
    console.error("Apply error:", err);

    // Username collision on create — retry with a more unique fallback
    if (err.code === "P2002" && err.meta?.target?.includes("username")) {
      try {
        if (userId) {
          await prisma.user.upsert({
            where: { clerkId: userId },
            update: {},
            create: {
              clerkId:  userId,
              email:    email,
              username: `user_${userId.slice(-12)}`,
            },
          });
        }

        if (project === "data-analyst-intern") {
          await prisma.dataAnalystApplicant.create({ data: common });
        } else if (project === "web-dev-intern") {
          await prisma.webDevApplicant.create({ data: common });
        }

        return Response.json({ ok: true });
      } catch (retryErr) {
        console.error("Apply retry error:", retryErr);
        return Response.json({ error: "Server error." }, { status: 500 });
      }
    }

    // Email collision — their Clerk email already exists under a different clerkId
    // (rare but possible if someone deleted + recreated their account)
    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      return Response.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    return Response.json({ error: "Server error." }, { status: 500 });
  }
}