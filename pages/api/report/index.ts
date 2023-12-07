import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

import {
	getReportOrThrow,
	getSessionOrThrow,
	getUserOrThrow,
	SessionWithEmail,
} from "@/lib/api";
import { ReportCreateRequestInput } from "@/lib/fetchers";
import { Comment, Event, ReportStatus, User } from "@prisma/client";
import { ReportActionRequestInput } from "@/lib/fetchers/report";
import { isAdmin, isModerator } from "@/lib/role";
import { ExtendedReport } from "@/types/Report";
import { triggerNotification } from "@/lib/notification/trigger";
import { log } from "@/lib/log";

const { comment: c, event: e, report: r, user: u } = prisma;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req, res);

	if (req.method === "POST") POST(req, res, session);
	else if (req.method === "PUT") PUT(req, res, session);
	// HTTP method not supported!
	else {
		res.setHeader("Allow", ["POST", "PUT"]);
		res
			.status(405)
			.json({ message: `HTTP method ${req.method} is not supported.` });
	}
}

const getReportSubject = async (
	objectId: string,
	objectType: ReportCreateRequestInput["object"],
) => {
	let object: Event | Comment | User | null = null;
	let blamedUserId: string | null = null;
	if (objectType === "COMMENT") {
		object = await c.findFirstOrThrow({
			where: {
				id: objectId,
				OR: [{ deletedAt: null }, { deletedAt: { not: null } }],
			},
		});
		blamedUserId = object.authorId;
	}
	if (objectType === "EVENT") {
		object = await e.findFirstOrThrow({
			where: {
				id: objectId,
				OR: [{ deletedAt: null }, { deletedAt: { not: null } }],
			},
		});
		blamedUserId = object.creatorId;
	}
	if (objectType === "USER") {
		object = await u.findFirstOrThrow({
			where: {
				id: objectId,
				OR: [{ deletedAt: null }, { deletedAt: { not: null } }],
			},
		});
		blamedUserId = object.id;
	}
	if (!object) throw new Error("Object not found.");
	if (!blamedUserId) throw new Error("Blamed user not found.");
	return { object, blamedUserId };
};

const POST = async (
	req: NextApiRequest,
	res: NextApiResponse,
	session: SessionWithEmail,
) => {
	try {
		const user = await getUserOrThrow(session, { select: { id: true } });
		const {
			content,
			object: objectType,
			objectId,
			page,
			type,
		} = req.body as ReportCreateRequestInput;

		const { object, blamedUserId } = await getReportSubject(
			objectId,
			objectType,
		);

		const report = await r.create({
			data: {
				content,
				page,
				type,
				object: objectType,
				objectId: object.id,

				sender: { connect: { id: user.id } },
				blamedUser: { connect: { id: blamedUserId } },
			},
		});

		res.status(201).json(report);
	} catch (e) {
		log.error(e);
		res.status(500).json({ message: e instanceof Error ? e.message : e });
	}
};

const PUT = async (
	req: NextApiRequest,
	res: NextApiResponse,
	session: SessionWithEmail,
) => {
	try {
		const { reportId, status } = req.body as ReportActionRequestInput;
		if (!reportId) throw new Error("Missing report id.");
		if (!status || !Object.values(ReportStatus).includes(status))
			throw new Error("Missing report status.");

		const {
			id,
			objectId,
			object: objectType,
			sender,
		} = (await getReportOrThrow(reportId, {
			include: { sender: { include: { notificationSettings: true } } },
		})) as ExtendedReport;
		const user = await getUserOrThrow(session, { select: { role: true } });
		if (!isModerator(user) && !isAdmin(user)) throw new Error("Unauthorized.");

		let result;
		switch (status) {
			case ReportStatus.PENDING:
				result = await r.update({
					where: { id },
					data: { status },
				});
				break;
			case ReportStatus.ACCEPTED: {
				const { object } = await getReportSubject(
					objectId as string,
					objectType,
				);
				const params = { where: { id: object.id } };
				if (objectType === "COMMENT") await c.delete(params);
				if (objectType === "EVENT") await e.delete(params);
				if (objectType === "USER") await u.delete(params);

				result = await r.update({ where: { id }, data: { status } });
				break;
			}
			case ReportStatus.REFUSED: {
				const { object } = await getReportSubject(
					objectId as string,
					objectType,
				);
				const params = { where: { id: object.id }, data: { deletedAt: null } };
				if (objectType === "COMMENT") await c.update(params);
				if (objectType === "EVENT") await e.update(params);
				if (objectType === "USER") await u.update(params);
				result = await r.update({ where: { id }, data: { status } });
				break;
			}
			default:
				throw new Error("Invalid report status.");
		}

		if (status === ReportStatus.ACCEPTED) {
			await triggerNotification(sender, "REPORT_ACCEPTED", {
				reportId: id,
				senderId: user.id,
				senderName: user.name as string,
			});
		}

		if (status === ReportStatus.REFUSED) {
			await triggerNotification(sender, "REPORT_REFUSED", {
				reportId: id,
				senderId: user.id,
				senderName: user.name as string,
			});
		}

		return res.status(200).json({ data: result, error: null });
	} catch (e) {
		log.error(e);
		return res.status(500).json({
			data: null,
			error: { message: e instanceof Error ? e.message : e },
		});
	}
};
