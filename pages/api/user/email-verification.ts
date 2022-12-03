import { NextApiRequest, NextApiResponse } from "next";
import { VerificationTokenType } from "@prisma/client";

import { getSessionOrThrow, getUserOrThrow } from "@/lib/api";
import { checkEmail } from "@/functions/validateEmail";
import plunk from "@/lib/plunk";
import { ExtendedUser } from "@/types/User";
import prisma from "@/lib/prisma";
import generateToken from "@/lib/tokens/email-verification";

type Result = {
  email: {
    sent: boolean;
    alreadyVerified: boolean;
    gotVerified: boolean;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is authenticated
  const session = await getSessionOrThrow(req);

  if (req.method === "GET") {
    try {
      const { token } = req.query as { token: string };
      const user = (await getUserOrThrow(session, {
        include: {
          verificationTokens: {
            where: {
              identifier: VerificationTokenType.EMAIL_VERIFICATION,
              token,
            },
          },
        },
      })) as ExtendedUser;
      if (user.verificationTokens.length === 0)
        throw new Error("Invalid token");
      const verificationToken = user.verificationTokens[0];
      if (verificationToken.expires < new Date()) {
        await prisma.verificationToken.delete({
          where: { token: verificationToken.token },
        });
        throw new Error("Token expired");
      }

      await plunk.events.publish({
        email: user.email as string,
        event: "email-verified",
      });
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          verificationTokens: {
            delete: {
              token: verificationToken.token,
            },
          },
        },
      });

      // redirect to "/"
      res.status(200).redirect("/");

      // res.status(200).json({
      //   email: {
      //     sent: false,
      //     alreadyVerified: false,
      //     gotVerified: true,
      //   },
      // });
    } catch (err) {
      res.status(400).json({
        data: null,
        error: { message: err instanceof Error ? err.message : err },
      });
    }
  } else if (req.method === "POST") {
    try {
      const user = (await getUserOrThrow(session, {
        include: {
          verificationTokens: {
            where: {
              identifier: VerificationTokenType.EMAIL_VERIFICATION,
            },
          },
        },
      })) as ExtendedUser;
      if (user.verificationTokens.length > 0) {
        await prisma.verificationToken.deleteMany({
          where: {
            identifier: VerificationTokenType.EMAIL_VERIFICATION,
            userId: user.id,
          },
        });
      }
      const { email, emailVerified } = user as {
        email: string;
        emailVerified: Date | null;
      };

      if (emailVerified) {
        return res.status(200).json({
          email: {
            sent: false,
            alreadyVerified: true,
            gotVerified: false,
          },
        });
      } else {
        if (checkEmail(email)) {
          await generateToken(user);
          return res.status(200).json({
            email: {
              sent: true,
              alreadyVerified: false,
              gotVerified: false,
            },
          });
        }
        return res.status(200).json({
          email: {
            sent: false,
            alreadyVerified: false,
            gotVerified: false,
          },
        });
      }
    } catch (err) {
      res.status(400).json({
        data: null,
        error: { message: err instanceof Error ? err.message : err },
      });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
