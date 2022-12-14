import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * TODO: This middleware is not working as expected, it is called multiple times when updating a comment
 * ! See if we can call prisma instance in `params` instead of importing it
 *
 * This middleware is called when a comment is updated
 * It will create a new comment history record if the content has changed
 *
 * */
export const commentHistoryMiddleware: Prisma.Middleware<any> = async (
  params,
  next
) => {
  const { model, action, args } = params;
  if (model == "Comment" && action == "update") {
    const {
      where: { id },
      data: { content: toContent },
    } = args || {};
    // Get the previous comment content
    const { content: fromContent, id: commentId } =
      (await prisma.comment.findUnique({
        where: { id },
        select: { content: true, id: true },
      })) || {};

    if (!fromContent || !commentId) throw new Error("Comment not found");

    // If the content has changed, create a new history record
    if (fromContent !== toContent) {
      await prisma.commentHistory.create({
        data: {
          fromContent,
          toContent,
          commentId,
        },
      });
    }
  }

  return next(params);
};
