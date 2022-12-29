import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ExtendedUser } from "@/types/User";
import { InvitationStatus } from "@prisma/client";
import { getEventOrThrow, getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { triggerNotification } from "@/lib/notification/trigger";
import { ExtendedEvent } from "@/types/Event";
import { createEventParticipationTrophy } from "@/lib/api/trophy/event";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req);

	// Creation
	if (req.method === "POST") {
		const sender = await getUserOrThrow(session);

		const { receiver, eventId } = req.body as {
			receiver: string[];
			eventId: string;
		};

		if (!receiver || receiver.length === 0)
			return res.status(404).json({ message: "Receiver not found." });

		const { id, title } = await getEventOrThrow(eventId);

		const users = await prisma.user.findMany({
			where: { id: { in: receiver } },
			include: { notificationSettings: true },
		});
		if (!users || users.length === 0)
			return res.status(404).json({ message: "Users not found." });

		// check if user is already invited
		const existingInvitations = await prisma.invitation.findMany({
			where: {
				eventId,
				receiverId: { in: users.map((user) => user.id) },
			},
		});
		const newInvitationsUsers = users.filter((user) => {
			return !existingInvitations.some(
				(invitation) => invitation.receiverId === user.id,
			);
		});
		const invitations = await prisma.invitation.createMany({
			data: newInvitationsUsers.map((user) => ({
				eventId,
				senderId: sender.id,
				receiverId: user.id,
			})),
		});

		// trigger notification
		for await (const invitedUser of newInvitationsUsers) {
			await triggerNotification(
				invitedUser as unknown as ExtendedUser,
				"EVENT_INVITATION",
				{
					userName: invitedUser.name as string,
					eventId: id,
					eventTitle: title,
					senderId: sender.id,
					senderName: sender.name as string,
				},
			);
		}

		return res.status(201).json(invitations);
	} else if (req.method === "PUT") {
		const { invitationId, status } = req.body as {
			invitationId: string;
			status: InvitationStatus;
		};
		const receiver = getUserOrThrow(session, {
			include: { receivedInvitations: true, participations: true },
		}) as unknown as ExtendedUser;

		if (
			!receiver.receivedInvitations.some(
				(invitation) => invitation.id === invitationId,
			)
		)
			return res.status(404).json({ message: "Invitation not found." });

		const invitation = await prisma.invitation.update({
			where: { id: invitationId },
			data: { status },
		});

		// If invitation is accepted, add user to event
		if (status === InvitationStatus.ACCEPTED) {
			const {
				participants: oldParticipants,
				creator,
				title,
			} = (await getEventOrThrow(invitation.eventId, {
				include: {
					participants: true,
					creator: {
						include: { notificationSettings: true },
					},
				},
			})) as ExtendedEvent;

			const isAlreadyParticipant = oldParticipants.some(
				(p) => p.id === receiver.id,
			);
			const updatedParticipants = isAlreadyParticipant
				? oldParticipants.filter((p) => p.id !== receiver.id)
				: [...oldParticipants, receiver];

			const event = await prisma.event.update({
				where: { id: invitation.eventId },
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
					receiver,
					receiver.participations ? receiver.participations.length + 1 : -1,
				);

				await triggerNotification(
					creator as ExtendedUser,
					"EVENT_PARTICIPATION",
					{
						eventId: invitation.eventId,
						eventTitle: title,
						senderName: receiver.name as string,
						senderId: receiver.id,
					},
				);
			}

			return res.status(200).json({ event, invitation });
		}

		return res.status(200).json({ invitation });
	} else if (req.method === "DELETE") {
		const { invitationId } = req.body as { invitationId: string };
		const sender = await prisma.user.findUnique({
			where: { email: session.user?.email as string },
			include: { sendedInvitations: true },
		});
		if (!sender) return res.status(404).json({ message: "Sender not found." });
		if (
			!sender.sendedInvitations.some(
				(invitation) => invitation.id === invitationId,
			)
		)
			return res.status(404).json({ message: "Invitation not found." });

		const invitation = await prisma.invitation.delete({
			where: { id: invitationId },
		});

		return res.status(200).json(invitation);
	}

	// HTTP method not supported!
	else {
		res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
		res
			.status(405)
			.json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
