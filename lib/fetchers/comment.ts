import { ExtendedComment } from "@/types/Event";

export type CommentCreateRequestInput = {
	content: string;
	eventId: string;
	parentId?: string;
};

export const createComment = async (
	values: CommentCreateRequestInput
): Promise<ExtendedComment[] | false> => {
	const res = await fetch("/api/event/comment", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(values),
	});
	if (res.ok) return (await res.json()).comments;
	return false;
};

export type CommentEditRequestInput = {
	content: string;
	commentId: string;
};

export const editComment = async (
	values: CommentEditRequestInput
): Promise<ExtendedComment[] | false> => {
	const res = await fetch("/api/event/comment", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(values),
	});
	if (res.ok) return (await res.json()).comments;
	return false;
};

export type CommentDeleteRequestInput = {
	commentId: string;
};

export const deleteComment = async (
	values: CommentDeleteRequestInput
): Promise<ExtendedComment[] | false> => {
	const res = await fetch("/api/event/comment", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(values),
	});
	if (res.ok) return (await res.json()).comments;
	return false;
};
