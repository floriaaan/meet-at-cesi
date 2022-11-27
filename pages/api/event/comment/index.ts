import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import {
  CommentCreateRequestInput,
  CommentDeleteRequestInput,
  CommentEditRequestInput,
} from "@/lib/fetchers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  if (req.method === "POST") {
    try {
      const { content, eventId, parentId } =
        req.body as CommentCreateRequestInput;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        select: { id: true },
      });
      if (!user) return res.status(404).json({ message: "User not found." });

      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true },
      });
      if (!event) return res.status(404).json({ message: "Event not found." });

      if (!content || content.length < 1)
        return res
          .status(400)
          .json({ message: "Comment content is required." });

      await prisma.comment.create({
        data: {
          content,
          eventId,
          parentId,
          authorId: user.id,
        },
      });

      const comments = await prisma.comment.findMany({
        where: { eventId, parentId: null },
        include: {
          author: true,
          children: {
            include: { author: true },
          },
        },
      });

      return res.status(201).json({ comments });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e instanceof Error ? e.message : e });
    }
  }

  if (req.method === "PUT") {
    try {
      const { content, commentId } = req.body as CommentEditRequestInput;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        select: { id: true },
      });
      if (!user) return res.status(404).json({ message: "User not found." });

      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { id: true, authorId: true, eventId: true },
      });
      if (!comment)
        return res.status(404).json({ message: "Comment not found." });
      if (comment.authorId !== user.id)
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

      const comments = await prisma.comment.findMany({
        where: { eventId: comment.eventId, parentId: null },
        include: {
          author: true,
          children: { include: { author: true } },
        },
      });

      return res.status(200).json({ comments });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e instanceof Error ? e.message : e });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { commentId } = req.body as CommentDeleteRequestInput;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        select: { id: true },
      });
      if (!user) return res.status(404).json({ message: "User not found." });

      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { id: true, authorId: true, eventId: true },
      });
      if (!comment)
        return res.status(404).json({ message: "Comment not found." });
      if (comment.authorId !== user.id)
        return res
          .status(403)
          .json({ message: "You are not the author of this comment." });

      await prisma.comment.update({
        where: { id: commentId },
        data: {
          content: "Ce commentaire a été supprimé.",
          isDeleted: true,
          // remove relation with author
          authorId: null,
        },
      });

      const comments = await prisma.comment.findMany({
        where: { eventId: comment.eventId, parentId: null },
        include: {
          author: true,
          children: { include: { author: true } },
        },
      });

      return res.status(200).json({ comments });
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
