import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { ExtendedUser } from "@/types/User";
import { getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { EditPrivacyRequestInput } from "@/lib/fetchers/user";
import { toExtendedNotifications } from "@/lib/transformers/notification";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req);

	if (req.method === "GET") {
		const { notifications: n } = (await getUserOrThrow(session, {
			include: { notifications: true },
		})) as ExtendedUser;

		const notifications = await toExtendedNotifications(n);

		return res.status(200).json({ notifications });
	} else if (req.method === "PUT") {
		try {
			throw new Error("Not implemented yet.");
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
