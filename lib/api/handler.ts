import { VerificationToken } from "@prisma/client";
import prisma from "@/lib/prisma";

export const getTokenIfValidOrThrow = async (
  verificationTokens: VerificationToken[]
): Promise<VerificationToken> => {
  if (verificationTokens.length === 0) throw new Error("Invalid token");
  const verificationToken = verificationTokens[0];
  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token: verificationToken.token },
    });
    throw new Error("Token expired");
  }
  return verificationToken;
};
