import type { User } from "@prisma/client";
import type { ExtendedEvent } from "@/types/Event";
import type { ExtendedUser } from "@/types/User";

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

export const deleteEvent = async (id: string): Promise<true | false> => {
  const response = await fetch(`/api/event/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (response.ok) return true;
  return false;
};

export type SearchRequestInput = {
  dateMin?: string;
  dateMax?: string;
  proximity?: number;
  campus?: string;
  promotion?: string;
  name?: string;
};

export const search = async (
  params: SearchRequestInput
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
