import { Event, User } from "@prisma/client";

import { EventFormValues } from "@/components/Event/Form";
import { toLocalDate } from "@/lib/date";
import { ExtendedEvent, ExtendedInvitation } from "@/types/Event";
import { log } from "@/lib/log";

export const participate = async (
	id: string,
): Promise<
	| {
			participants: User[];
			invitations: Omit<ExtendedInvitation, "event" | "sender">[];
	  }
	| false
> => {
	const response = await fetch(`/api/event/participate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id }),
	});
	if (response.ok) {
		const { participants, invitations } = await response.json();
		return { participants, invitations };
	}
	return false;
};

export type EventCreateRequestInput = EventFormValues;
export const createEvent = async (
	values: EventCreateRequestInput,
): Promise<Event | false | Error> => {
	try {
		const res = await fetch("/api/event", {
			body: JSON.stringify({ ...values, date: toLocalDate(values.date) }),
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});
		if (res.ok && res.status === 201) return await res.json();
		else return false;
	} catch (error) {
		log.error(error);
		return await Promise.reject(error);
	}
};

export const editEvent = async (
	eventId: string,
	values: EventCreateRequestInput,
): Promise<Event | false | Error> => {
	try {
		const res = await fetch(`/api/event/edit`, {
			body: JSON.stringify({
				...values,
				id: eventId,
				date: toLocalDate(values.date),
			}),
			method: "PUT",
			headers: { "Content-Type": "application/json" },
		});
		if (res.ok && res.status === 201) return res.json();
		else return false;
	} catch (error) {
		log.error(error);
		return Promise.reject(error);
	}
};

export const deleteEvent = async (id: string): Promise<true | false> => {
	const response = await fetch(`/api/event/delete`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id }),
	});
	if (response.ok) return true;
	return false;
};

export type EventSearchRequestInput = {
	dateMin?: string;
	dateMax?: string;
	proximity?: number;
	campus?: string;
	promotion?: string;
	title?: string;
};

export const search = async (
	params: EventSearchRequestInput,
): Promise<ExtendedEvent[]> => {
	const response = await fetch(`/api/event/search`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params),
	});
	if (response.ok) {
		const { events } = await response.json();
		return events;
	}
	return [];
};

export const getPlaceSuggestions = async (query: string) => {
	const res = await fetch(`/api/event/places?query=${query}`);
	const { predictions } = await res.json();
	if (res.ok) return predictions;
	return [];
};

export const restoreEvent = async (id: string): Promise<true | false> => {
	const response = await fetch(`/api/admin/event/restore`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id }),
	});
	if (response.ok) return true;
	return false;
};
