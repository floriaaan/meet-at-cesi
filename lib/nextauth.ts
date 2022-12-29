import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { InvitationStatus } from "@prisma/client";
import { Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

import prisma from "@/lib/prisma";
import generateToken from "@/lib/tokens/email-verification";
import { ExtendedSession } from "@/types/Session";
import { checkEmail } from "@/lib/validators/email";
import { getUserFromIdOrThrow } from "./api";

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

	const extendedUser = await getUserFromIdOrThrow(user.id);

	// extend session with user details
	session = {
		...session,
		user: extendedUser as ExtendedSession["user"],
	};

	return session as ExtendedSession;
};
