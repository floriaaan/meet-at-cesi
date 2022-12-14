import { getEventOrThrow, getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { createEventParticipationTrophy } from "@/lib/api/trophy/event";
import { ExtendedEvent } from "@/types/Event";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is authenticated
  const session = await getSessionOrThrow(req);

  // Create new home
  if (req.method === "POST") {
    try {
      const { id } = req.body;
      const user = (await getUserOrThrow(session, {
        include: { participations: true },
      })) as User & { participations: ExtendedEvent[] };

      const { participants: oldParticipants } = (await getEventOrThrow(id, {
        include: { participants: true },
      })) as ExtendedEvent;

      const isAlreadyParticipant = oldParticipants.some(
        (p) => p.id === user.id
      );
      const updatedParticipants = isAlreadyParticipant
        ? oldParticipants.filter((p) => p.id !== user.id)
        : [...oldParticipants, user];

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

      if (!isAlreadyParticipant)
        createEventParticipationTrophy(user, user.participations.length + 1);

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
