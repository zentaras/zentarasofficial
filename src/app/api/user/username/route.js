import { prisma } from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { username } = await req.json();
  if (!username || !/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
    return Response.json(
      { error: "Username must be 3–30 chars, letters/numbers/underscore/hyphen only." },
      { status: 400 }
    );
  }

  try {
    await prisma.user.update({
      where: { clerkId: userId },
      data: { username: username.toLowerCase() },
    });
    return Response.json({ ok: true });
  } catch (err) {
    if (err.code === "P2002") {
      return Response.json({ error: "Username already taken." }, { status: 409 });
    }
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}