import { NextApiRequest, NextApiResponse } from "next";
import { ExtendedUser } from "@/types/User";
import {
	getNotificationOrThrow,
	getSessionOrThrow,
	getUserOrThrow,
} from "@/lib/api";
import {
	EditNotificationSettingsRequestInput,
	NotificationRequestInput,
} from "@/lib/fetchers/user";
import {
	getContentUrl,
	toExtendedNotification,
	toExtendedNotifications,
} from "@/lib/transformers/notification";
import prisma from "@/lib/prisma";
import { log } from "@/lib/log";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req, res);

	if (req.method === "GET") {
		const { notifications: n } = (await getUserOrThrow(session, {
			include: { notifications: true },
		})) as ExtendedUser;

		const notifications = (await toExtendedNotifications(n)).sort((a, b) => {
			// sort by isRead and createdAt
			if (a.isRead === b.isRead) {
				return a.createdAt > b.createdAt ? -1 : 1;
			}
			return a.isRead ? 1 : -1;
		});

		return res.status(200).json({
			notifications: notifications,
		});
	} else if (req.method === "PUT" && req.query.action === "read") {
		try {
			const { id } = req.body as NotificationRequestInput;
			const n = await getNotificationOrThrow(id);
			const notification = await toExtendedNotification(n);
			if (!notification) throw new Error("Notification not found.");
			const update = await prisma.notification.update({
				where: { id },
				data: { isRead: true },
			});

			return res
				.status(200)
				.json({ notification: update, url: getContentUrl(notification) });
		} catch (e) {
			log.error(e);
			res.status(500).json({ message: e instanceof Error ? e.message : e });
		}
	} else if (req.method === "PUT" && req.query.action === "read-all") {
		try {
			const { id } = await getUserOrThrow(session);
			const update = await prisma.notification.updateMany({
				where: { userId: id },
				data: { isRead: true },
			});

			return res.status(200).json({ notifications: update });
		} catch (e) {
			log.error(e);
			res.status(500).json({ message: e instanceof Error ? e.message : e });
		}
	} else if (req.method === "PUT" && req.query.action === "edit-settings") {
		try {
			const { id } = await getUserOrThrow(session);
			const input = req.body as EditNotificationSettingsRequestInput;

			const update = await prisma.notificationSettings.upsert({
				where: { userId: id },
				update: input,
				create: { ...input, userId: id },
			});

			return res.status(200).json({ notificationSettings: update });
		} catch (e) {
			log.error(e);
			res.status(500).json({ message: e instanceof Error ? e.message : e });
		}
	} else if (req.method === "DELETE") {
		try {
			const { id: notificationId } = req.body as NotificationRequestInput;
			const { id } = await getNotificationOrThrow(notificationId);

			const result = await prisma.notification.delete({
				where: { id },
			});

			return res.status(200).json({ result });
		} catch (e) {
			log.error(e);
			res.status(500).json({ message: e instanceof Error ? e.message : e });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
		res
			.status(405)
			.json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
