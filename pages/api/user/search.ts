import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { UserSearchRequestInput } from "@/lib/fetchers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Create new home
  if (req.method === "POST") {
    try {
      let { name, offset = 0 } = req.body as UserSearchRequestInput;
      name = name || undefined;

      const users = await prisma.user.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        orderBy: { name: "asc" },
        skip: offset !== -1 ? offset : undefined,
        take: offset !== -1 ? 10 : undefined,
      });

      res.status(200).json({ users });
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
