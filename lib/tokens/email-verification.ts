import { User, VerificationTokenType } from "@prisma/client";
import prisma from "@/lib/prisma";
import plunk from "@/lib/plunk";

const generateToken = async (user: {
  id: User["id"];
  email: User["email"];
}) => {
  const { id, email } = user;
  if (!id) throw new Error("User id not found");
  if (!email) throw new Error("User has no email");

  const generatedToken = await prisma.verificationToken.create({
    data: {
      identifier: VerificationTokenType.EMAIL_VERIFICATION,
      user: { connect: { id } },
      token: Math.random().toString(36).substring(2, 15),
    },
  });

  await plunk.events.publish({
    email: email,
    event: "viacesi-email-verification",
    data: {
      token: generatedToken.token,
      url: `${process.env.NEXT_PUBLIC_APP_URL?.split("://").at(
        -1
      )}/api/user/email-verification?token=${generatedToken.token}`,
    },
  });
};

export default generateToken;
