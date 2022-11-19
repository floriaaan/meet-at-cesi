import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { ExtendedUser } from "@/types/User";
import { InvitationStatus } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Creation
  if (req.method === "POST") {
    const sender = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });
    if (!sender) return res.status(404).json({ message: "Sender not found." });

    const { receiver, eventId } = req.body as {
      receiver: string[];
      eventId: string;
    };

    if (!receiver || receiver.length === 0)
      return res.status(404).json({ message: "Receiver not found." });

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: "Event not found." });

    const users = await prisma.user.findMany({
      where: { id: { in: receiver } },
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
    const invitations = await prisma.invitation.createMany({
      data: users
        .filter((user) => {
          return !existingInvitations.some(
            (invitation) => invitation.receiverId === user.id
          );
        })
        .map((user) => ({
          eventId,
          senderId: sender.id,
          receiverId: user.id,
        })),
    });

    return res.status(201).json(invitations);
  } else if (req.method === "PUT") {
    const { invitationId, status } = req.body as {
      invitationId: string;
      status: InvitationStatus;
    };
    const receiver = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      include: { receivedInvitations: true },
    });
    if (!receiver)
      return res.status(404).json({ message: "Receiver not found." });
    if (
      !receiver.receivedInvitations.some(
        (invitation) => invitation.id === invitationId
      )
    )
      return res.status(404).json({ message: "Invitation not found." });

    const invitation = await prisma.invitation.update({
      where: { id: invitationId },
      data: { status },
    });

    // If invitation is accepted, add user to event
    if (status === InvitationStatus.ACCEPTED) {
      let event = await prisma.event.findUnique({
        where: { id: invitation.eventId },
        include: { participants: true },
      });
      if (!event) return res.status(404).json({ message: "Event not found." });
      const { participants: oldParticipants } = event;

      const isParticipant = oldParticipants.some(
        (p) => p.id === invitation.receiverId
      );
      let updatedParticipants = oldParticipants;

      if (!isParticipant) {
        updatedParticipants = [...oldParticipants, receiver];
      }

      event = await prisma.event.update({
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
        (invitation) => invitation.id === invitationId
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
