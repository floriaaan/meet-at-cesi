import {
	getCommentOrThrow,
	getEventOrThrow,
	getUserFromIdOrThrow,
} from "@/lib/api";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 *
 * This middleware is called when a row will be delete
 * It will create prevent the deletion and update the deletedAt field
 *
 * */
export const softDelete: Prisma.Middleware<any> = async (params, next) => {
	const { model, action, args } = params;

	/**
	 * Updating the deletedAt field when deleting and prevent the deletion
	 * */
	if (action === "delete" && args.where.id) {
		switch (model) {
			case "Comment":
				await softDeleteComment(args);
				return;

			case "Event":
				await softDeleteEvent(args);
				return;

			case "User":
				await softDeleteUser(args);
				return;

			default:
				break;
		}
	}

	/**
	 * Filter deleted rows when selecting
	 */
	if (action === "findFirst" || action === "findUnique") {
		switch (model) {
			case "Comment":
				// Change to findFirst - you cannot filter
				// by anything except ID / unique with findUnique
				params.action = "findFirst";
				// Add 'deleted' filter
				// ID filter maintained
				params.args.where["deletedAt"] = null;
				break;
			case "Event":
				params.action = "findFirst";
				params.args.where["deletedAt"] = null;
				break;

			case "User":
				params.action = "findFirst";
				params.args.where["deletedAt"] = null;
				break;

			default:
				break;
		}
	}
	if (params.action === "findMany") {
		switch (model) {
			case "Comment":
				if (params.args.where) {
					if (params.args.where.deletedAt === undefined) {
						// Exclude deleted records if they have not been explicitly requested
						params.args.where["deletedAt"] = null;
					}
				} else {
					params.args["where"] = { deletedAt: null };
				}
				break;
			case "Event":
				if (params.args.where) {
					if (params.args.where.deletedAt === undefined)
						params.args.where["deletedAt"] = null;
				} else params.args["where"] = { deletedAt: null };
				break;

			case "User":
				if (params.args.where) {
					if (params.args.where.deletedAt === undefined)
						params.args.where["deletedAt"] = null;
				} else params.args["where"] = { deletedAt: null };
				break;

			default:
				break;
		}
	}

	return next(params);
};



const softDeleteComment = async ({
	where: { id },
}: Prisma.MiddlewareParams["args"]) => {
	await getCommentOrThrow(id);
	await prisma.comment.update({
		where: { id },
		data: { deletedAt: new Date() },
	});
};
const softDeleteEvent = async ({
	where: { id },
}: Prisma.MiddlewareParams["args"]) => {
	await getEventOrThrow(id);
	await prisma.event.update({
		where: { id },
		data: { deletedAt: new Date() },
	});
};
const softDeleteUser = async ({
	where: { id },
}: Prisma.MiddlewareParams["args"]) => {
	await getUserFromIdOrThrow(id);
	await prisma.user.update({
		where: { id },
		data: { deletedAt: new Date() },
	});
};
