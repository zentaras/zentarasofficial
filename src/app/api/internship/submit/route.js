import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { trackId, step, data } = await req.json();

  const track = await prisma.internshipTrack.findUnique({ where: { id: trackId } });
  if (!track || track.clerkUserId !== userId) return Response.json({ error: "Not found" }, { status: 404 });

  let update = {};
  if (step === 2) {
    update = {
      step2Status: "Pending",
      githubLink: data.githubLink,
      liveLink: data.liveLink,
      statsUpdate: data.statsUpdate
    };
  } else if (step === 3) {
    update = {
      step3Status: "Pending",
      reportLink: data.reportLink,
      demoVideoLink: data.demoVideoLink
    };
  }

  const updatedTrack = await prisma.internshipTrack.update({
    where: { id: trackId },
    data: update
  });

  return Response.json(updatedTrack);
}