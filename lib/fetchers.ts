import type { User } from "@prisma/client";

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
