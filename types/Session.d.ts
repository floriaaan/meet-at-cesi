import type { Event, Invitation, Preference } from "@prisma/client";
import type { Session } from "next-auth";

import type { ExtendedInvitation } from "@/types/Event";

export type ExtendedSession = Session & {
  id: string;
  preferences: Preference;
  receivedInvitations: ExtendedInvitation[];
  sendedInvitations: Invitation[];
  participations: Event[];
  createdEvents: Event[];
};
