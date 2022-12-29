import plunk from "@/lib/plunk";
import { ExtendedUser } from "@/types/User";
import { Data, NotificationEvent } from "@/lib/notification/trigger";

export const sendNotificationEmail = async (
	event: NotificationEvent,
	user: ExtendedUser,
	data: Data,
): Promise<boolean> => {
	const { email, notificationsSettings: nS } = user;
	if (!email) throw new Error("User has no email");

	const notificationsSettings = nS || {
		EVENT_INVITATION: true,
		EVENT_PARTICIPATION: false,
		EVENT_CREATION: false,
		EVENT_MODIFICATION: false,
		EVENT_DELETION: false,
		COMMENT_CREATION: false,
		REPORT_ACCEPTED: false,
		REPORT_REFUSED: false,
		FEEDBACK_RESPONSE: false,
	};

	if (!notificationsSettings[event]) return false;
	const { success } = await plunk.events.publish({
		email: user.email as string,
		event: event.toLowerCase(),
		data: {
			...data,
			userName: user.name as string,
			baseUrl: `${process.env.NEXT_PUBLIC_APP_URL?.split("://").at(-1)}`,
		},
	});
	return success;
};
