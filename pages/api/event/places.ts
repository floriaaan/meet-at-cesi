import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

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
  if (req.method === "GET") {
    const { query } = req.query as { query?: string };
    if (!query) {
      return res.status(400).json({ message: "Missing query." });
    }

    const result = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&language=fr&types=establishment&region=fr&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    const data = await result.json();
    res.status(200).json(data);
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["GET"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
