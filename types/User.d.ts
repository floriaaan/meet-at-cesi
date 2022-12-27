import type {
	Feedback,
	Notification,
	Preference,
	PrivacySettings,
	Trophy,
	User,
	VerificationToken,
} from "@prisma/client";
import type { ExtendedEvent, ExtendedInvitation } from "@/types/Event";
import { ExtendedNotification } from "@/types/Notification";

export type UserMinimum = {
	id: User["id"];
	image: User["image"];
	name: User["name"];
};

export type ExtendedUser = User & {
	preferences?: Preference;
	privacy?: PrivacySettings;

	trophies: Trophy[];
	participations?: ExtendedEvent[];
	createdEvents?: ExtendedEvent[];
	receivedInvitations: ExtendedInvitation[];
	sendedInvitations: ExtendedInvitation[];
	feedbacks: Feedback[];
	notifications: ExtendedNotification[];

	verificationTokens: VerificationToken[];
};
