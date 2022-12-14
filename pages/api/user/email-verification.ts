import { NextApiRequest, NextApiResponse } from "next";
import { VerificationTokenType } from "@prisma/client";

import { getSessionOrThrow, getUserOrThrow, SessionWithEmail } from "@/lib/api";
import { checkEmail } from "@/lib/validators/email";
import plunk from "@/lib/plunk";
import { ExtendedUser } from "@/types/User";
import prisma from "@/lib/prisma";
import generateToken from "@/lib/tokens/email-verification";
import { getTokenIfValidOrThrow } from "@/lib/api/handler";

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

  if (req.method === "GET") return GET(req, res, session);
  else if (req.method === "POST") return POST(req, res, session);
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}

const GET = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: SessionWithEmail
) => {
  try {
    const { token } = req.query as { token: string };
    const { email, id, verificationTokens } = (await getUserOrThrow(session, {
      include: {
        verificationTokens: {
          where: {
            identifier: VerificationTokenType.EMAIL_VERIFICATION,
            token,
          },
        },
      },
    })) as ExtendedUser;

    const verificationToken = await getTokenIfValidOrThrow(verificationTokens);

    await plunk.events.publish({
      email: email as string,
      event: "email-verified",
    });
    await prisma.user.update({
      where: { id },
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
    return res.status(200).redirect("/");
  } catch (err) {
    return res.status(400).json({
      data: null,
      error: { message: err instanceof Error ? err.message : err },
    });
  }
};

const POST = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: SessionWithEmail
) => {
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
    return res.status(400).json({
      data: null,
      error: { message: err instanceof Error ? err.message : err },
    });
  }
};

