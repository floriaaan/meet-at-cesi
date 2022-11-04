import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/lib/prisma";

const adapter = PrismaAdapter(prisma);
const oldLinkAccount = adapter.linkAccount;
adapter.linkAccount = ({ ext_expires_in, ...data }) =>
  oldLinkAccount(data);

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
});
