import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

import {
  getCommentOrThrow,
  getEventOrThrow,
  getSessionOrThrow,
  getUserFromIdOrThrow,
  getUserOrThrow,
} from "@/lib/api";
import { ReportCreateRequestInput } from "@/lib/fetchers";
import { Comment, Event, User } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is authenticated
  const session = await getSessionOrThrow(req);

  if (req.method === "POST") {
    try {
      const user = await getUserOrThrow(session, { select: { id: true } });
      const {
        content,
        object: objectType,
        objectId,
        page,
        type,
      } = req.body as ReportCreateRequestInput;

      const { object, blamedUserId } = await getReportSubject(
        objectId,
        objectType
      );

      const report = await prisma.report.create({
        data: {
          content,
          page,
          type,
          object: objectType,
          objectId: object.id,

          sender: { connect: { id: user.id } },
          blamedUser: { connect: { id: blamedUserId } },
        },
      });

      res.status(201).json(report);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e instanceof Error ? e.message : e });
    }
  }

  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}

const getReportSubject = async (
  objectId: string,
  objectType: ReportCreateRequestInput["object"]
) => {
  let object: Event | Comment | User | null = null;
  let blamedUserId: string | null = null;
  if (objectType === "COMMENT") {
    object = await getCommentOrThrow(objectId);
    blamedUserId = object.authorId;
  }
  if (objectType === "EVENT") {
    object = await getEventOrThrow(objectId);
    blamedUserId = object.creatorId;
  }
  if (objectType === "USER") {
    object = await getUserFromIdOrThrow(objectId);
    blamedUserId = object.id;
  }
  if (!object) throw new Error("Object not found.");
  if (!blamedUserId) throw new Error("Blamed user not found.");
  return { object, blamedUserId };
};