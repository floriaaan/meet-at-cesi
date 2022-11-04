import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";

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
      const { title, location, date, audience } = req.body;
      const audienceCampus = req.body["audience-campus"];

      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // @ts-ignore
      const event = await prisma.event.create({
        data: {
          title,
          location,
          date: new Date(date),
          audience,
          audienceCampus,
          creatorId: user.id,
        },
      });

      res.status(201).json(event);
    } catch (e) {
        console.error(e)
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
