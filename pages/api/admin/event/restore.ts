import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { isAdmin } from "@/lib/role";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "PUT") {
		try {
			const session = await getSessionOrThrow(req, res);
			const user = await getUserOrThrow(session);
			if (!isAdmin(user)) throw new Error("Unauthorized.");

			const { id } = req.body;
			const event = await prisma.event.update({
				where: { id },
				data: { deletedAt: null },
			});

			return res.status(200).json({ data: { event }, error: null });
		} catch (error) {
			return res.status(500).json({
				data: null,
				error: {
					message: error instanceof Error ? error.message : error,
				},
			});
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
