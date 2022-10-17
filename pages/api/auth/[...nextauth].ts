import NextAuth from "next-auth";
// import EmailProvider from "next-auth/providers/email";
// import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "../../../lib/prisma";

export default NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID?.toString() || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET?.toString() || "",
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/",
//     signOut: "/",
//     error: "/",
//     verifyRequest: "/",
//   },
});
