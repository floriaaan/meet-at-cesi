import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

const getDateFilter = (dateMin: string, dateMax: string) => {
  const dateMinFilter = dateMin ? { gte: new Date(dateMin) } : {};
  const dateMaxFilter = dateMax ? { lte: new Date(dateMax) } : {};
  return {
    ...dateMinFilter,
    ...dateMaxFilter,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Create new home
  if (req.method === "POST") {
    try {
      let { dateMin, dateMax, proximity, campus } = req.body;
      dateMin = dateMin || undefined;
      dateMax = dateMax || undefined;
      proximity = proximity || undefined;
      campus = campus || undefined;

      const events = await prisma.event.findMany({
        where: {
          date: getDateFilter(dateMin, dateMax),
          audienceCampus: campus,
          // proximity requires location coordinates
        },
        include: { participants: true, creator: true },
      });

      res.status(201).json({ events });
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
