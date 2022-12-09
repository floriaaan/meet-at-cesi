import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {
  getSessionOrThrow,
  getUserFromIdOrThrow,
  getUserOrThrow,
} from "@/lib/api";
import { isAdmin } from "@/lib/role";
import { Role } from "@prisma/client";
import { EXCEPTIONS_EMAIL } from "@/resources/role-list";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const session = await getSessionOrThrow(req);
      const user = await getUserOrThrow(session);
      if (!isAdmin(user)) throw new Error("Unauthorized.");

      const { role, userId } = req.body;
      const updatedUser = await getUserFromIdOrThrow(userId);

      if (
        !role ||
        (role !== Role.USER && role !== Role.MODERATOR && role !== Role.ADMIN)
      )
        throw new Error("Role is required.");

      if (EXCEPTIONS_EMAIL.includes(updatedUser.email as string))
        throw new Error("You can't change this user's role.");

      const result = await prisma.user.update({
        where: { id: updatedUser.id },
        data: { role },
      });

      return res.status(200).json({ data: { user: result }, error: null });
    } catch (error) {
      return res.status(500).json({
        data: null,
        error: {
          message: error instanceof Error ? error.message : error,
        },
      });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["PUT"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
