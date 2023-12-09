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
import { ExtendedEvent } from "@/types/Event";
import { ExtendedUser } from "@/types/User";
import { triggerNotification } from "@/lib/notification/trigger";
import { log } from "@/lib/log";

const getComments = async (eventId: string) => {
	const comments = await prisma.comment.findMany({
		where: { eventId, parentId: null, deletedAt: null },
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
	res: NextApiResponse,
) {
	// Check if user is authenticated
	const session = await getSessionOrThrow(req, res);

	if (req.method === "POST") {
		try {
			const {
				content,
				eventId: requestedEventId,
				parentId,
			} = req.body as CommentCreateRequestInput;

			const { id: authorId, name: authorName } = await getUserOrThrow(session);
			const {
				id: eventId,
				creator: eventCreator,
				title: eventTitle,
			} = (await getEventOrThrow(requestedEventId, {
				include: { creator: { include: { notificationSettings: true } } },
			})) as ExtendedEvent;

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

			const { id } = await prisma.comment.create({
				data: {
					content,
					eventId,
					parentId,
					authorId,
				},
			});

			await triggerNotification(
				eventCreator as ExtendedUser,
				"COMMENT_CREATION",
				{
					senderId: authorId,
					senderName: authorName as string,
					eventId,
					eventTitle: eventTitle as string,
					commentId: id,
					commentContent: content,
				},
			);

			const comments = await getComments(eventId);

			return res.status(201).json({ comments });
		} catch (e) {
			log.error(e);
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

			const comments = await getComments(eventId);

			return res.status(200).json({ comments });
		} catch (e) {
			log.error(e);
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
			log.error(e);
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
