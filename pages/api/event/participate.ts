import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Create new home
  if (req.method === "POST") {
    try {
      const { id } = req.body;
      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const event = await prisma.event.findUnique({
        where: { id },
        include: { participants: true },
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }
      const { participants: oldParticipants } = event;

      const isParticipant = oldParticipants.some((p) => p.id === user.id);
      let updatedParticipants = oldParticipants;

      if (isParticipant) {
        updatedParticipants = oldParticipants.filter((p) => p.id !== user.id);
      } else {
        updatedParticipants = [...oldParticipants, user];
      }

      const { participants } = await prisma.event.update({
        where: { id },
        data: {
          participants: {
            set: updatedParticipants.map((participant) => ({
              id: participant.id,
            })),
          },
        },
        include: { participants: true },
      });

      res.status(201).json({ participants });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e instanceof Error ? e.message : e });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
