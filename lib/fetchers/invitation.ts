// invitations

import { ExtendedInvitation } from "@/types/Event";
import { InvitationStatus } from "@prisma/client";

export const acceptInvitation = async (id: string): Promise<boolean> => {
	const res = await fetch("/api/user/invitation", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			invitationId: id,
			status: InvitationStatus.ACCEPTED,
		}),
	});
	if (res.ok) return true;
	return false;
};

export const declineInvitation = async (id: string): Promise<boolean> => {
	const res = await fetch("/api/user/invitation", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			invitationId: id,
			status: InvitationStatus.REFUSED,
		}),
	});
	if (res.ok) return true;
	return false;
};

export const deleteInvitation = async (id: string): Promise<boolean> => {
	const res = await fetch("/api/user/invitation", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			invitationId: id,
		}),
	});
	if (res.ok) return true;
	return false;
};

export const createInvitation = async (
	eventId: string,
	receiver: string[],
): Promise<ExtendedInvitation[] | false> => {
	const res = await fetch("/api/user/invitation", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			eventId,
			receiver,
		}),
	});
	if (res.ok) {
		const { invitations } = await res.json();
		return invitations;
	}
	return false;
};
