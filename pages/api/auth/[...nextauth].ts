import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import adapter, { sessionCallback } from "@/lib/nextauth";

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
    session: sessionCallback,
  },
});
