import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const userCreate: Prisma.UserCreateWithoutCommentsInput = {
	email: "soft-delete@test.fr",
};

const eventCreate: Prisma.EventCreateWithoutCommentsInput = {
	id: "test:soft-delete",
	title: "soft-delete event",
	audience: "everyone",
	audienceCampus: "rouen",
	creator: {
		connectOrCreate: {
			where: { email: "soft-delete@test.fr" },
			create: userCreate,
		},
	},
	date: new Date(),
	location: "soft-delete location",
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const create = await prisma.comment.create({
		include: { event: true, author: true },
		data: {
			id: "test:soft-delete",
			content: "soft-delete comment",
			author: {
				connectOrCreate: {
					where: { email: "soft-delete@test.fr" },
					create: userCreate,
				},
			},
			event: {
				connectOrCreate: {
					where: { id: "test:soft-delete" },
					create: eventCreate,
				},
			},
		},
	});

	console.log(create);

	const deleteEvent = await prisma.event.delete({
		where: { id: "test:soft-delete" },
	});

	res.status(200).json({ deleteEvent, create });
}
