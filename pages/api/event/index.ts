import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { MapFeature } from "@/types/Event";
import { getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { Event, User } from "@prisma/client";
import { createEventCreationTrophy } from "@/lib/api/trophy/event";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSessionOrThrow(req);

    // Create new event
    if (req.method === "POST") {
      try {
        const { title, location, date, audience } = req.body;
        const audienceCampus = req.body["audience-campus"];

        const user = (await getUserOrThrow(session, {
          include: { createdEvents: true },
        })) as User & { createdEvents: Event[] };

        // Destructure location object to get coordinates
        const {
          features: [
            {
              geometry: { coordinates },
            },
          ],
        } = (await (
          await fetch(`https://api-adresse.data.gouv.fr/search/?q=${location}`)
        ).json()) as { features: MapFeature[] };
        const [lng, lat] = coordinates;

        const event = await prisma.event.create({
          data: {
            title,
            location,
            date: new Date(date),
            audience,
            audienceCampus,
            coordinates: [lat, lng],
            creatorId: user.id,
          },
        });

        await createEventCreationTrophy(user, user.createdEvents.length + 1);

        res.status(201).json(event);
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
  } catch (e) {
    res.status(500).json({ message: e instanceof Error ? e.message : e });
  }
}
