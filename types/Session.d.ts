import type { Event, Invitation, Preference, User } from "@prisma/client";
import type { Session } from "next-auth";

import type { ExtendedInvitation } from "@/types/Event";

export type ExtendedSession = Session & {
  id: string;
  user: User;
  preferences: Preference;
  receivedInvitations: ExtendedInvitation[];
  sendedInvitations: Invitation[];
  participations: Event[];
  createdEvents: Event[];
};
