import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { InvitationStatus, Notification } from "@prisma/client";
import { Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

import prisma from "@/lib/prisma";
import generateToken from "@/lib/tokens/email-verification";
import { ExtendedSession } from "@/types/Session";
import { checkEmail } from "@/lib/validators/email";
import { toExtendedNotifications } from "@/lib/transformers/notification";

const adapter = PrismaAdapter(prisma);
const oldLinkAccount = adapter.linkAccount;
const oldCreateUser = adapter.createUser;
adapter.linkAccount = ({ ext_expires_in, ...data }) => oldLinkAccount(data);
adapter.createUser = async (data) => {
	const user = await oldCreateUser(data);
	if (checkEmail(data.email)) await generateToken(user);

	return user;
};

export default adapter;

export const sessionCallback = async ({
	session,
	user,
}: {
	session: Session;
	user: User | AdapterUser;
}) => {
	// Send properties to the client, like an access_token from a provider.

	const extendedUser = await prisma.user.findUniqueOrThrow({
		where: { id: user.id },
		include: {
			privacy: true,
			preferences: true,
			receivedInvitations: {
				include: { event: true, sender: true, receiver: true },
				where: { status: InvitationStatus.PENDING },
			},
			sendedInvitations: true,
			participations: true,
			createdEvents: true,
			feedbacks: true,
			notifications: true,
		},
	});

	// extend session with user details
	session = {
		...session,
		user: {
			...extendedUser,
			// extends notifications with event, comment, report and feedback
			notifications: await toExtendedNotifications(extendedUser.notifications),
		} as ExtendedSession["user"],
	};

	return session as ExtendedSession;
};
