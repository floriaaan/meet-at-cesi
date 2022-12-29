import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

import {
	getCommentOrThrow,
	getEventOrThrow,
	getReportOrThrow,
	getSessionOrThrow,
	getUserFromIdOrThrow,
	getUserOrThrow,
	SessionWithEmail,
} from "@/lib/api";
import { ReportCreateRequestInput } from "@/lib/fetchers";
import { Comment, Event, ReportStatus, User } from "@prisma/client";
import { ReportActionRequestInput } from "@/lib/fetchers/report";
import { isAdmin, isModerator } from "@/lib/role";
import { ExtendedReport } from "@/types/Report";
import { triggerNotification } from "@/lib/notification/trigger";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req);

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
		object = await getCommentOrThrow(objectId);
		blamedUserId = object.authorId;
	}
	if (objectType === "EVENT") {
		object = await getEventOrThrow(objectId);
		blamedUserId = object.creatorId;
	}
	if (objectType === "USER") {
		object = await getUserFromIdOrThrow(objectId);
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

		const report = await prisma.report.create({
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
		console.error(e);
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
			include: { sender: { include: { notificationsSettings: true } } },
		})) as ExtendedReport;
		const user = await getUserOrThrow(session, { select: { role: true } });
		if (!isModerator(user) && !isAdmin(user)) throw new Error("Unauthorized.");

		let result;
		switch (status) {
			case ReportStatus.PENDING:
				result = await prisma.report.update({
					where: { id },
					data: { status },
				});
				break;
			case ReportStatus.ACCEPTED:
				const { object } = await getReportSubject(
					objectId as string,
					objectType,
				);
				if (objectType === "COMMENT")
					await prisma.comment.delete({ where: { id: object.id } });
				if (objectType === "EVENT")
					await prisma.event.delete({ where: { id: object.id } });
				if (objectType === "USER")
					await prisma.user.delete({ where: { id: object.id } });

				result = await prisma.report.update({
					where: { id },
					data: { status },
				});
				break;
			case ReportStatus.REFUSED:
				result = await prisma.report.update({
					where: { id },
					data: { status },
				});
				break;
			default:
				throw new Error("Invalid report status.");
		}

		if (status === ReportStatus.ACCEPTED) {
			await triggerNotification(sender, "REPORT_ACCEPTED", {
				reportId: id,
				senderName: user.name as string,
			});
		}

		if (status === ReportStatus.REFUSED) {
			await triggerNotification(sender, "REPORT_REFUSED", {
				reportId: id,
				senderName: user.name as string,
			});
		}

		return res.status(200).json({ data: result, error: null });
	} catch (e) {
		console.error(e);
		return res.status(500).json({
			data: null,
			error: { message: e instanceof Error ? e.message : e },
		});
	}
};
