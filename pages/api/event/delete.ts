import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/role";
import { triggerNotification } from "@/lib/notification/trigger";
import { getEventOrThrow, getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { ExtendedEvent } from "@/types/Event";
import { ExtendedUser } from "@/types/User";
import { log } from "@/lib/log";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req, res);

	// Create new home
	if (req.method === "DELETE") {
		try {
			const { id } = req.body;

			const user = await getUserOrThrow(session, {
				include: { notificationSettings: true },
			});

			const { creator, title, participants } = (await getEventOrThrow(id, {
				include: {
					creator: true,
					participants: { include: { notificationSettings: true } },
				},
			})) as ExtendedEvent;

			if (creator.id !== user.id && !isAdmin(user)) {
				return res.status(401).json({ message: "Unauthorized." });
			}

			await prisma.event.delete({
				where: { id },
			});

			for await (const participant of participants) {
				await triggerNotification(
					participant as ExtendedUser,
					"EVENT_DELETION",
					{
						eventId: id,
						eventTitle: title,
						senderId: creator.id,
						senderName: creator.name as string,
					},
				);
			}

			res.status(201).json({ message: "Event deleted." });
		} catch (e) {
			log.error(e);
			res.status(500).json({ message: e instanceof Error ? e.message : e });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader("Allow", ["DELETE"]);
		res
			.status(405)
			.json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
