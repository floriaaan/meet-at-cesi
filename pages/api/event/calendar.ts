import { NextApiRequest, NextApiResponse } from "next";
import { log } from "@/lib/log";
import { ExtendedEvent } from "@/types/Event";
import { getEventOrThrow } from "@/lib/api";

import { buildCalendarUrl } from "@/lib/calendar";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Create new home
	if (req.method === "GET") {
		try {
			const { id } = req.query as {
				id: ExtendedEvent["id"];
			};
			const event = (await getEventOrThrow(id, {
				include: { creator: true, participants: true },
			})) as ExtendedEvent;


			const content = buildCalendarUrl(event, "default");
			res.setHeader("Content-Type", "text/calendar");
			res.setHeader("Content-Disposition", "attachment");
			res.status(200).send(content);
		} catch (e) {
			log.error(e);
			res.status(500).json({ message: e instanceof Error ? e.message : e });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader("Allow", ["GET"]);
		res
			.status(405)
			.json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
