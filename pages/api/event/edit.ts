import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ExtendedEvent } from "@/types/Event";
import { isAdmin } from "@/lib/role";
import { getEventOrThrow, getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { triggerNotification } from "@/lib/notification/trigger";
import { ExtendedUser } from "@/types/User";
import { getCoordinates } from "@/lib/fetchers/api-adresse-data-gouv";
import { log } from "@/lib/log";
import { EventCreateRequestInput } from "@/lib/fetchers/event";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req, res);

	// Edit event
	if (req.method === "PUT") {
		try {
			const { id, ...data } = req.body as EventCreateRequestInput & {
				id: string;
			};
			const user = await getUserOrThrow(session);

			const {
				creator,
				participants,
				title: oldTitle,
			} = (await getEventOrThrow(id, {
				include: {
					creator: true,
					participants: { include: { notificationSettings: true } },
				},
			})) as ExtendedEvent;
			if (creator.id !== user.id && !isAdmin(user)) {
				return res.status(401).json({ message: "Unauthorized." });
			}

			const coordinates = await getCoordinates(data.location);

			const updatedEvent = await prisma.event.update({
				where: { id },
				data: {
					...data,
					date: new Date(data.date),
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
			log.error(e);
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
