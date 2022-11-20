import NextAuth, { Session } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/lib/prisma";
import { ExtendedSession } from "@/types/Session";
import { InvitationStatus } from "@prisma/client";

const adapter = PrismaAdapter(prisma);
const oldLinkAccount = adapter.linkAccount;
adapter.linkAccount = ({ ext_expires_in, ...data }) => oldLinkAccount(data);

export default NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID?.toString() || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET?.toString() || "",
    }),
  ],
  adapter,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
  },
  callbacks: {
    async session({ session, user }) {
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
    },
  },
});
