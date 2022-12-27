import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { ExtendedUser } from "@/types/User";
import { getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { EditPrivacyRequestInput } from "@/lib/fetchers/user";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req);

	if (req.method === "GET") {
		const user = await getUserOrThrow(session, { include: { privacy: true } });
		return res.status(200).json(user);
	} else if (req.method === "PUT") {
		try {
			const { createdEvents, participations, trophies } =
				req.body as EditPrivacyRequestInput;

			let user = (await getUserOrThrow(session)) as ExtendedUser;

			const privacyObject = { createdEvents, participations, trophies };
			user = (await prisma.user.update({
				where: { id: user.id },
				data: {
					privacy: {
						upsert: { create: privacyObject, update: privacyObject },
					},
				},
				include: { privacy: true },
			})) as ExtendedUser;

			res.status(202).json({ user });
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
