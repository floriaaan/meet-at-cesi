import { Comment, Event, Report, User } from "@prisma/client";
import { NextApiRequest } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

import prisma from "@/lib/prisma";

export type SessionWithEmail = Session & { user: { email: string } };

export const getSessionOrThrow = async (
  req: NextApiRequest
): Promise<SessionWithEmail> => {
  const session = await getSession({ req });
  if (!session || !session.user || !session.user.email)
    throw new Error("Unauthorized.");

  return { ...session, user: { email: session.user.email } };
};

export const getUserOrThrow = async (
  session: SessionWithEmail,
  options?: any
): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    ...options,
  });
  if (!user) throw new Error("User not found.");

  return user;
};

export const getUserFromIdOrThrow = async (
  userId: string,
  options?: any
): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    ...options,
  });
  if (!user) throw new Error("User not found.");

  return user;
};

export const getEventOrThrow = async (
  eventId: string,
  options?: any
): Promise<Event> => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    ...options,
  });
  if (!event) throw new Error("Event not found.");

  return event;
};

export const getCommentOrThrow = async (
  commentId: string,
  options?: any
): Promise<Comment> => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    ...options,
  });
  if (!comment) throw new Error("Comment not found.");

  return comment;
};

export const getReportOrThrow = async (
  reportId: string,
  options?: any
): Promise<Report> => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    ...options,
  });
  if (!report) throw new Error("Report not found.");

  return report;
};
