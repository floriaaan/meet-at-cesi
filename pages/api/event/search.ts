import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { SearchRequestInput } from "@/lib/fetchers";

const getDateFilter = (
  dateMin: string | undefined,
  dateMax: string | undefined
) => {
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
      let { dateMin, dateMax, proximity, campus, name } =
        req.body as SearchRequestInput;
      dateMin = dateMin || undefined;
      dateMax = dateMax || undefined;
      proximity = proximity || undefined;
      campus = campus || undefined;
      name = name || undefined;

      const events = await prisma.event.findMany({
        where: {
          date: getDateFilter(dateMin, dateMax),
          audienceCampus: campus,
          title: {
            contains: name,
          },
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
