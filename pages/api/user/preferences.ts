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
  if (req.method === "PUT") {
    try {
      const { campus, promotion, promotionYear } = req.body;

      let user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        include: { preferences: true },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          preferences: {
            upsert: {
              create: { campus, promotion: `${promotion}:${promotionYear}` },
              update: { campus, promotion: `${promotion}:${promotionYear}` },
            },
          },
        },
        include: { preferences: true },
      });

      res.status(201).json({ user });
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
