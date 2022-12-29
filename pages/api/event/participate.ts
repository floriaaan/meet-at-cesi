import { NextApiRequest, NextApiResponse } from "next";

import { getEventOrThrow, getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { createEventParticipationTrophy } from "@/lib/api/trophy/event";
import { ExtendedEvent } from "@/types/Event";
import { ExtendedUser } from "@/types/User";
import prisma from "@/lib/prisma";
import { triggerNotification } from "@/lib/notification/trigger";
import { InvitationStatus } from "@prisma/client";
import { log } from "@/lib/log";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req);

	// Create new participation
	if (req.method === "POST") {
		try {
			const { id } = req.body;
			const user = (await getUserOrThrow(session, {
				include: { participations: true },
			})) as ExtendedUser;

			const {
				participants: oldParticipants,
				creator,
				title,
			} = (await getEventOrThrow(id, {
				include: {
					participants: true,
					creator: {
						include: { notificationSettings: true },
					},
				},
			})) as ExtendedEvent;

			const isAlreadyParticipant = oldParticipants.some(
				(p) => p.id === user.id,
			);
			const updatedParticipants = isAlreadyParticipant
				? oldParticipants.filter((p) => p.id !== user.id)
				: [...oldParticipants, user];

			const { participants } = await prisma.event.update({
				where: { id },
				data: {
					participants: {
						set: updatedParticipants.map((participant) => ({
							id: participant.id,
						})),
					},
				},
				include: { participants: true },
			});

			if (!isAlreadyParticipant) {
				createEventParticipationTrophy(
					user,
					user.participations ? user.participations.length + 1 : -1,
				);

				// remove invitation
				const invitation = await prisma.invitation.findFirst({
					where: { eventId: id, receiverId: user.id },
				});
				if (invitation) {
					await prisma.invitation.update({
						where: { id: invitation.id },
						data: {
							status: InvitationStatus.ACCEPTED,
						},
					});
				}

				await triggerNotification(
					creator as ExtendedUser,
					"EVENT_PARTICIPATION",
					{
						eventId: id,
						eventTitle: title,
						senderId: user.id,
						senderName: user.name as string,
					},
				);
			}

			res.status(201).json({ participants });
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
