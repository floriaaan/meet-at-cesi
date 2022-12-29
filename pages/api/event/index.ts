import { NextApiRequest, NextApiResponse } from "next";
import { Event, User } from "@prisma/client";

import prisma from "@/lib/prisma";
import { getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { createEventCreationTrophy } from "@/lib/api/trophy/event";
import { getCoordinates } from "@/lib/fetchers/api-adresse-data-gouv";
import { ExtendedUser } from "@/types/User";
import { triggerNotification } from "@/lib/notification/trigger";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const session = await getSessionOrThrow(req);

		// Create new event
		if (req.method === "POST") {
			try {
				const { title, location, date, audience } = req.body;
				const audienceCampus = req.body["audience-campus"];

				const user = (await getUserOrThrow(session, {
					include: { createdEvents: true, preferences: true },
				})) as ExtendedUser;

				const coordinates = await getCoordinates(location);
				const event = await prisma.event.create({
					data: {
						title,
						location,
						date: new Date(date),
						audience,
						audienceCampus,
						coordinates,
						creatorId: user.id,
					},
				});

				const potentialsParticipants = await prisma.user.findMany({
					where: {
						preferences: {
							campus: user.preferences?.campus,
							promotion: {
								startsWith: user.preferences?.promotion?.split(":")[0],
							},
						},
					},
					include: { notificationSettings: true },
				});

				for await (const participant of potentialsParticipants) {
					await triggerNotification(
						participant as unknown as ExtendedUser,
						"EVENT_CREATION",
						{
							eventId: event.id,
							eventTitle: title,
							senderName: user.name as string,
						},
					);
				}

				await createEventCreationTrophy(
					user,
					user.createdEvents ? user.createdEvents.length + 1 : -1,
				);

				res.status(201).json(event);
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
	} catch (e) {
		res.status(500).json({ message: e instanceof Error ? e.message : e });
	}
}
