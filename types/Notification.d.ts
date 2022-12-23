import { Event, Feedback, Notification, Report } from "@prisma/client";

export type ExtendedNotification = Notification & {
	event?: Event;
	comment?: Comment;
	report?: Report;
	feedback?: Feedback;
};
