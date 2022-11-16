import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { ExtendedUser } from "@/types/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  if (req.method === "GET") {
    let user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { preferences: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user);
  } else if (req.method === "PUT") {
    try {
      let { campus, promotion, promotionYear } = req.body;
      campus = campus || null;
      promotion = promotion || null;
      promotionYear = promotionYear || null;

      let user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        include: { preferences: true },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (!campus && !promotion && !promotionYear) {
        if (user.preferences) {
          // @ts-ignore
          user = {
            ...(await prisma.user.update({
              where: { email: session.user.email as string },
              data: {
                preferences: {
                  delete: true,
                },
              },
            })),
            preferences: undefined,
          } as ExtendedUser;

          return res.status(200).json({ user });
        } else return res.status(200).json({ user });
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

      res.status(202).json({ user });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e instanceof Error ? e.message : e });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
