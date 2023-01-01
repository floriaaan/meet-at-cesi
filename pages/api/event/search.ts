import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { EventSearchRequestInput } from "@/lib/fetchers";
import { log } from "@/lib/log";
import { getSession } from "next-auth/react";
import { Prisma } from "@prisma/client";
import { getPrivateEvents } from "@/lib/transformers/event";

const getDateFilter = (
	dateMin: string | undefined,
	dateMax: string | undefined,
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

const DEFAULT_WHERE = ({
	dateMin,
	dateMax,
	campus,
	title,
	promotion,
}: EventSearchRequestInput): Partial<Prisma.EventWhereInput> => ({
	date: getDateFilter(dateMin, dateMax),
	audienceCampus: campus,
	title: {
		contains: title,
		mode: "insensitive",
	},
	audience: promotion?.split(":")[0], // todo: add year support
	// todo: proximity requires location coordinates
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "POST") {
		try {
			const { dateMin, dateMax, campus, title, promotion } =
				req.body as EventSearchRequestInput;

			const session = await getSession({ req });
			const userEmail = session?.user?.email;
			log.info(`User ${userEmail} is searching for events.`);

			const publicEvents = await prisma.event.findMany({
				where: {
					...DEFAULT_WHERE({ dateMin, dateMax, campus, title, promotion }),
					private: false,
				},
				include: { participants: true, creator: true },
				orderBy: { date: "asc" },
			});
			const privateEvents = await getPrivateEvents(
				userEmail,
				DEFAULT_WHERE({ dateMin, dateMax, campus, title, promotion }),
			);

			const events = [...publicEvents, ...privateEvents].sort((a, b) => {
				return a.date.getTime() - b.date.getTime();
			});

			res.status(200).json({ events });
		} catch (e) {
			log.error(e);
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
