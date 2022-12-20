import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { FeedbackCreateRequestInput } from "@/lib/fetchers";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Check if user is authenticated
	const session = await getSession({ req });
	if (!session || !session.user) {
		return res.status(401).json({ message: "Unauthorized." });
	}

	if (req.method === "POST") {
		try {
			const { history, page, text } = req.body as FeedbackCreateRequestInput;
			if (!text) return res.status(400).json({ message: "Text is required." });
			if (!page) return res.status(400).json({ message: "Page is required." });
			if (!history)
				return res.status(400).json({ message: "History is required." });

			const user = await prisma.user.findUnique({
				where: { email: session.user.email as string },
			});
			if (!user) return res.status(404).json({ message: "User not found." });

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
			console.error(e);
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
