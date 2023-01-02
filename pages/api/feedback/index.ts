import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { FeedbackCreateRequestInput } from "@/lib/fetchers";
import { log } from "@/lib/log";
import { getSessionOrThrow, getUserOrThrow } from "@/lib/api";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req);

	if (req.method === "POST") {
		try {
			const { history, page, text } = req.body as FeedbackCreateRequestInput;
			if (!text) return res.status(400).json({ message: "Text is required." });
			if (!page) return res.status(400).json({ message: "Page is required." });
			if (!history)
				return res.status(400).json({ message: "History is required." });

			const user = await getUserOrThrow(session);

			const feedback = await prisma.feedback.create({
				data: {
					text,
					page,
					history,
					user: { connect: { id: user.id } },
				},
			});

			return res.status(200).json(feedback);
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
