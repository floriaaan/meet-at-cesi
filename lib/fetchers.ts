import type { User } from "@prisma/client";
import type { FilterValues } from "@/components/Event/FilterSidebar";
import type { ExtendedEvent } from "@/types/Event";

export const participate = async (
  id: string
): Promise<{ participants: User[] } | false> => {
  const response = await fetch(`/api/event/participate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (response.ok) {
    const { participants: newParticipants } = await response.json();
    return { participants: newParticipants };
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

export const search = async ({
  dateMin,
  dateMax,
  proximity,
  campus
}:FilterValues): Promise<ExtendedEvent[]> => {
  const response = await fetch(`/api/event/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dateMin, dateMax, proximity, campus }),
  });
  if (response.ok) {
    const { events } = await response.json();
    return events;
  }
  return [];
}
