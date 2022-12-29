import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { ExtendedEvent, MapFeature } from "@/types/Event";
import { isAdmin } from "@/lib/role";
import { getEventOrThrow, getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { triggerNotification } from "@/lib/notification/trigger";
import { ExtendedUser } from "@/types/User";
import { getCoordinates } from "@/lib/fetchers/api-adresse-data-gouv";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req);

	// Edit event
	if (req.method === "PUT") {
		try {
			const { title, location, date, audience, id } = req.body;
			const audienceCampus = req.body["audience-campus"];

			const user = await getUserOrThrow(session);

			const {
				creator,
				participants,
				title: oldTitle,
			} = (await getEventOrThrow(id, {
				include: {
					creator: true,
					participants: { include: { notificationsSettings: true } },
				},
			})) as ExtendedEvent;
			if (creator.id !== user.id && !isAdmin(user)) {
				return res.status(401).json({ message: "Unauthorized." });
			}

			const coordinates = await getCoordinates(location);

			const updatedEvent = await prisma.event.update({
				where: { id },
				data: {
					title,
					location,
					date: new Date(date),
					audience,
					audienceCampus,
					coordinates,
				},
			});

			for await (const participant of participants) {
				await triggerNotification(
					participant as ExtendedUser,
					"EVENT_MODIFICATION",
					{
						eventId: id,
						eventTitle: oldTitle,
						senderId: creator.id,
						senderName: creator.name as string,
					},
				);
			}

			res.status(201).json(updatedEvent);
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
