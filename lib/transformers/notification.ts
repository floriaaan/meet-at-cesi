import { ExtendedNotification } from "@/types/Notification";
import { Notification } from "@prisma/client";
import prisma from "@/lib/prisma";

const isNotNull = <T>(value: T | null): value is T => value !== null;
const getOptions = (ids: string[]) => ({ where: { id: { in: ids } } });

export const toExtendedNotifications = async (
	notifications: Notification[],
): Promise<ExtendedNotification[]> => {
	const eventsIds = notifications.map((n) => n.eventId).filter(isNotNull);
	const commentsIds = notifications.map((n) => n.commentId).filter(isNotNull);
	const reportIds = notifications.map((n) => n.reportId).filter(isNotNull);
	const feedbackIds = notifications.map((n) => n.feedbackId).filter(isNotNull);

	const events =
		eventsIds.length > 0
			? await prisma.event.findMany(getOptions(eventsIds))
			: [];
	const comments =
		commentsIds.length > 0
			? await prisma.comment.findMany(getOptions(commentsIds))
			: [];
	const reports =
		reportIds.length > 0
			? await prisma.report.findMany(getOptions(reportIds))
			: [];
	const feedbacks =
		feedbackIds.length > 0
			? await prisma.feedback.findMany(getOptions(feedbackIds))
			: [];

	return notifications.map((n) => ({
		...n,
		event: events.find((e) => e.id === n.eventId),
		comment: comments.find((c) => c.id === n.commentId),
		report: reports.find((r) => r.id === n.reportId),
		feedback: feedbacks.find((f) => f.id === n.feedbackId),
	})) as ExtendedNotification[];
};

export const toExtendedNotification = async (
	notification: Notification,
): Promise<ExtendedNotification | null> => {
	const notifications = await toExtendedNotifications([notification]);
	return notifications[0] || null;
};
