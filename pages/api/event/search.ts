import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { EventSearchRequestInput } from "@/lib/fetchers";

const getDateFilter = (
	dateMin: string | undefined,
	dateMax: string | undefined
) => {
	const dateMinFilter = dateMin
		? { gte: new Date(new Date(dateMin).setHours(0, 0, 0, 0)) }
		: {};
	const dateMaxFilter = dateMax
		? { lte: new Date(new Date(dateMax).setHours(23, 59, 59, 0)) }
		: {};
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
			let { dateMin, dateMax, proximity, campus, title, promotion } =
				req.body as EventSearchRequestInput;
			dateMin = dateMin || undefined;
			dateMax = dateMax || undefined;
			proximity = proximity || undefined;
			campus = campus || undefined;
			promotion = promotion || undefined;
			title = title || undefined;

			const events = await prisma.event.findMany({
				where: {
					date: getDateFilter(dateMin, dateMax),
					audienceCampus: campus,
					title: {
						contains: title,
						mode: "insensitive",
					},
					audience: promotion?.split(":")[0], // todo: add year support
					// todo: proximity requires location coordinates
				},
				include: { participants: true, creator: true },
				orderBy: { date: "asc" },
			});

			res.status(200).json({ events });
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
