import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { InvitationStatus } from "@prisma/client";
import { Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

import prisma from "@/lib/prisma";
import { ExtendedSession } from "@/types/Session";
import { checkEmail } from "@/functions/validateEmail";
import generateToken from "./tokens/email-verification";

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
  session.user = user;

  const userDetails = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      preferences: true,
      receivedInvitations: {
        include: { event: true, sender: true, receiver: true },
        where: { status: InvitationStatus.PENDING },
      },
      sendedInvitations: true,
      participations: true,
      createdEvents: true,
    },
  });
  if (!userDetails) throw new Error("User not found");

  // extend session with user details
  session = {
    ...session,
    ...userDetails,
  };

  return session as ExtendedSession;
};
