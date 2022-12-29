import { Event, Feedback, Notification, Report, User } from "@prisma/client";

export type ExtendedNotification = Notification & {
	event?: Event;
	comment?: Comment;
	report?: Report;
	feedback?: Feedback;

	user: User;
	sender?: User;
};
