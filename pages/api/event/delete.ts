import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/role";

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
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;

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

      if (event.creator.id !== user.id && !isAdmin(user)) {
        return res.status(401).json({ message: "Unauthorized." });
      }

      // @ts-ignore
      await prisma.event.delete({
        where: { id },
      });

      res.status(201).json({ message: "Event deleted." });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e instanceof Error ? e.message : e });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["DELETE"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
