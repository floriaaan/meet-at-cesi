import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { MapFeature } from "@/types/Event";

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
  if (req.method === "PUT") {
    try {
      const { title, location, date, audience, id } = req.body;
      const audienceCampus = req.body["audience-campus"];

      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      let event = await prisma.event.findUnique({
        where: { id },
        include: { creator: true },
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }
      if (event.creator.id !== user.id && user.role !== "ADMIN") {
        return res.status(401).json({ message: "Unauthorized." });
      }

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

      // @ts-ignore
      event = await prisma.event.update({
        where: { id },
        data: {
          title,
          location,
          date: new Date(date),
          audience,
          audienceCampus,
          coordinates: [lat, lng],
        },
      });

      res.status(201).json(event);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e instanceof Error ? e.message : e });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["PUT"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
