import { ExtendedUser } from "@/types/User";
import { sendNotificationEmail } from "@/lib/notification/email";
import prisma from "@/lib/prisma";

export type NotificationEvent =
	| "EVENT_INVITATION"
	| "EVENT_PARTICIPATION"
	| "EVENT_CREATION"
	| "EVENT_MODIFICATION"
	| "EVENT_DELETION"
	| "COMMENT_CREATION"
	| "REPORT_ACCEPTED"
	| "REPORT_REFUSED"
	| "FEEDBACK_RESPONSE";

export type Data = {
	senderId?: string;
	
	userName?: string;
	
	eventId?: string;
	eventTitle?: string;
	senderName?: string;
	commentId?: string;
	commentContent?: string;
	
	[key: string]: string | undefined;
};

/**
 *
 * @param user ExtendedUser with email, name, id and notificationsSettings
 * @param event type of notification (TRIGGERED_EVENT)
 * @param data needed data for the notification and plunk email template
 * @returns \{notification, email} notification and email status
 */
export const triggerNotification = async (
	user: ExtendedUser,
	event: NotificationEvent,
	data: Data,
) => {
	const notification = await prisma.notification.create({
		data: {
			type: event,
			userId: user.id,
			senderId: data.senderId,

			eventId: data.eventId,
			feedbackId: data.feedbackId,
			reportId: data.reportId,
			commentId: data.commentId,

		},
	});
	const email = await sendNotificationEmail(event, user, data);

	return { notification, email };
};
