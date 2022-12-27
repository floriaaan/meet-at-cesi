import { ExtendedNotification } from "@/types/Notification";
import { Notification } from "@prisma/client";
import prisma from "@/lib/prisma";

const isNotNull = <T>(value: T | null): value is T =>
	value !== null && value !== undefined;
const getOptions = (ids: string[]) => ({ where: { id: { in: ids } } });

const {
	event: { findMany: findEvents },
	comment: { findMany: findComments },
	report: { findMany: findReports },
	feedback: { findMany: findFeedbacks },
	user: { findMany: findUsers },
} = prisma;

export const toExtendedNotifications = async (
	notifications: Notification[],
): Promise<ExtendedNotification[]> => {
	const eventsIds = notifications.map((n) => n.eventId).filter(isNotNull);
	const commentsIds = notifications.map((n) => n.commentId).filter(isNotNull);
	const reportIds = notifications.map((n) => n.reportId).filter(isNotNull);
	const feedbackIds = notifications.map((n) => n.feedbackId).filter(isNotNull);

	const usersIds = [
		...notifications.map((n) => n.userId).filter(isNotNull),
		...notifications.map((n) => n.senderId).filter(isNotNull),
	];

	const events =
		eventsIds.length > 0
			? await findEvents({
					...getOptions(eventsIds),
					include: { creator: true, participants: true },
			  })
			: [];
	const comments =
		commentsIds.length > 0
			? await findComments({
					...getOptions(commentsIds),
					include: { event: true },
			  })
			: [];
	const reports =
		reportIds.length > 0 ? await findReports(getOptions(reportIds)) : [];
	const feedbacks =
		feedbackIds.length > 0
			? await findFeedbacks({
					...getOptions(feedbackIds),
					include: { user: true },
			  })
			: [];
	const users =
		usersIds.length > 0 ? await findUsers(getOptions(usersIds)) : [];

	return notifications.map((n) => ({
		...n,
		event: events.find((e) => e.id === n.eventId),
		comment: comments.find((c) => c.id === n.commentId),
		report: reports.find((r) => r.id === n.reportId),
		feedback: feedbacks.find((f) => f.id === n.feedbackId),
		user: users.find((u) => u.id === n.userId),
		sender: users.find((u) => u.id === n.senderId),
	})) as ExtendedNotification[];
};

export const toExtendedNotification = async (
	notification: Notification,
): Promise<ExtendedNotification | null> => {
	const notifications = await toExtendedNotifications([notification]);
	return notifications[0] || null;
};
