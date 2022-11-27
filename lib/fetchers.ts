import { Event, InvitationStatus, Preference, User } from "@prisma/client";
import type { ExtendedComment, ExtendedEvent } from "@/types/Event";
import type { ExtendedUser } from "@/types/User";
import { EventFormValues } from "@/components/Event/Form";
import { toLocalDate } from "@/lib/date";

export const participate = async (
  id: string
): Promise<{ participants: User[] } | false> => {
  const response = await fetch(`/api/event/participate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (response.ok) {
    const { participants } = await response.json();
    return { participants };
  }
  return false;
};

type EventCreateRequestInput = EventFormValues;
export const createEvent = async (
  values: EventCreateRequestInput
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
    console.error(error);
    return await Promise.reject(error);
  }
};

export const editEvent = async (
  eventId: string,
  values: EventCreateRequestInput
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
    if (res.ok && res.status === 201) return await res.json();
    else return false;
  } catch (error) {
    console.error(error);
    return await Promise.reject(error);
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
  name?: string;
};

export const search = async (
  params: EventSearchRequestInput
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

type EditPreferencesRequest = {
  campus?: string;
  promotion?: string;
  promotionYear?: string;
};

export const editPreferences = async ({
  campus,
  promotion,
  promotionYear,
}: EditPreferencesRequest): Promise<{ user: ExtendedUser } | false> => {
  const response = await fetch(`/api/user/preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campus, promotion, promotionYear }),
  });
  if (response.ok) {
    const { user } = await response.json();
    return { user };
  }
  return false;
};

export const uploadImage = async (image: string): Promise<string | false> => {
  const res = await fetch("/api/user/image-upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image }),
  });
  const { url } = await res.json();
  if (res.ok) return url;
  return false;
};

export const deleteImage = async (): Promise<boolean> => {
  const res = await fetch("/api/user/image-upload", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) return true;
  return false;
};

export const getPlaceSuggestions = async (query: string) => {
  const res = await fetch(`/api/event/places?query=${query}`);
  const { predictions } = await res.json();
  if (res.ok) return predictions;
  return [];
};

export const getPreferences = async (): Promise<Preference | undefined> => {
  const res = await fetch("/api/user/preferences");
  const { preferences } = await res.json();
  if (res.ok) return preferences || undefined;
  return undefined;
};

// invitations

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
  receiver: string[]
): Promise<boolean> => {
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
  if (res.ok) return true;
  return false;
};

export type UserSearchRequestInput = {
  name?: string;
  offset: number;
};

export const searchUsers = async (
  params: UserSearchRequestInput
): Promise<User[]> => {
  const response = await fetch(`/api/user/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (response.ok) {
    const { users } = await response.json();
    return users;
  }
  return [];
};

export type FeedbackCreateRequestInput = {
  text: string;
  page: string;
  history: string[];
};
export const createFeedback = async (
  feedback: FeedbackCreateRequestInput
): Promise<boolean> => {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedback),
  });
  if (res.ok) return true;
  return false;
};

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
