import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { ExtendedUser } from "@/types/User";
import { getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { log } from "@/lib/log";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req);

	if (req.method === "GET") {
		const user = await getUserOrThrow(session, { include: { preferences: true } });
		return res.status(200).json(user);
	} else if (req.method === "PUT") {
		try {
			let { campus, promotion, promotionYear, privacy } = req.body;
			campus = campus || null;
			promotion = promotion || null;
			promotionYear = promotionYear || null;
			privacy = privacy || null;

			let user = (await getUserOrThrow(session, {
				include: { preferences: true },
			})) as ExtendedUser;

			if (!campus && !promotion && !promotionYear) {
				if (user.preferences) {
					user = {
						...(await prisma.user.update({
							where: { email: session.user.email as string },
							data: {
								preferences: {
									delete: true,
								},
							},
						})),
						preferences: null,
					} as unknown as ExtendedUser;

					return res.status(200).json({ user });
				} else return res.status(200).json({ user });
			}

			const preferencesObject = {
				campus,
				promotion: `${promotion}:${promotionYear}`,
				privacy,
			};
			user = (await prisma.user.update({
				where: { id: user.id },
				data: {
					preferences: {
						upsert: { create: preferencesObject, update: preferencesObject },
					},
				},
				include: { preferences: true },
			})) as ExtendedUser;

			res.status(202).json({ user });
		} catch (e) {
			log.error(e);
			res.status(500).json({ message: e instanceof Error ? e.message : e });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader("Allow", ["GET", "PUT"]);
		res
			.status(405)
			.json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
