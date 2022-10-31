import type { Event, User } from "@prisma/client";

export type ExtendedEvent = Event & {
  creator: User;
  participants: User[];
};
