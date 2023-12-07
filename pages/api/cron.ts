import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`)
		return res.status(401).json({ error: "Unauthorized" });

	const results = await prisma.$transaction([
		prisma.session.deleteMany({ where: { expires: { lt: new Date() } } }),
		prisma.verificationToken.deleteMany({ where: { expires: { lt: new Date() } } }),
	]);

	return res.status(200).json({ results });
}
