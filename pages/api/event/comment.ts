import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {
  CommentCreateRequestInput,
  CommentDeleteRequestInput,
  CommentEditRequestInput,
} from "@/lib/fetchers";
import {
  getCommentOrThrow,
  getEventOrThrow,
  getSessionOrThrow,
  getUserOrThrow,
} from "@/lib/api";

const getComments = async (eventId: string) => {
  const comments = await prisma.comment.findMany({
    where: { eventId, parentId: null },
    include: {
      author: true,
      children: {
        include: { author: true },
      },
    },
  });
  return comments;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is authenticated
  const session = await getSessionOrThrow(req);

  if (req.method === "POST") {
    try {
      const {
        content,
        eventId: requestedEventId,
        parentId,
      } = req.body as CommentCreateRequestInput;

      const { id: authorId } = await getUserOrThrow(session, {
        select: { id: true },
      });
      const { id: eventId } = await getEventOrThrow(requestedEventId, {
        select: { id: true },
      });

      if (parentId) {
        const { deletedAt } = await getCommentOrThrow(parentId, {
          select: { deletedAt: true },
        });
        if (deletedAt) throw new Error("Parent comment has been deleted.");
      }

      if (!content || content.length < 1)
        return res
          .status(400)
          .json({ message: "Comment content is required." });

      await prisma.comment.create({
        data: {
          content,
          eventId,
          parentId,
          authorId,
        },
      });

      return res.status(201).json({ comments: await getComments(eventId) });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e instanceof Error ? e.message : e });
    }
  }

  if (req.method === "PUT") {
    try {
      const { content, commentId: requestedCommentId } =
        req.body as CommentEditRequestInput;

      const { id: authorId } = await getUserOrThrow(session, {
        select: { id: true },
      });

      const {
        id: commentId,
        eventId,
        authorId: commentAuthorId,
      } = await getCommentOrThrow(requestedCommentId, {
        select: { id: true, eventId: true, authorId: true },
      });

      if (commentAuthorId !== authorId)
        return res
          .status(403)
          .json({ message: "You are not the author of this comment." });

      if (!content || content.length < 1)
        return res
          .status(400)
          .json({ message: "Comment content is required." });

      await prisma.comment.update({
        where: { id: commentId },
        data: { content },
      });

      return res.status(200).json({ comments: await getComments(eventId) });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e instanceof Error ? e.message : e });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { commentId: requestedCommentId } =
        req.body as CommentDeleteRequestInput;

      const { id: authorId } = await getUserOrThrow(session, {
        select: { id: true },
      });
      const {
        id: commentId,
        eventId,
        authorId: commentAuthorId,
      } = await getCommentOrThrow(requestedCommentId, {
        select: { id: true, eventId: true, authorId: true },
      });

      if (commentAuthorId !== authorId)
        return res
          .status(403)
          .json({ message: "You are not the author of this comment." });

      await prisma.comment.update({
        where: { id: commentId },
        data: {
          content: "Ce commentaire a été supprimé.",
          deletedAt: new Date(),
          authorId: null,
        },
      });

      return res.status(200).json({ comments: await getComments(eventId) });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e instanceof Error ? e.message : e });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
