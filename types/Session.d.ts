import type { Event, Invitation, Preference, User } from "@prisma/client";
import type { Session } from "next-auth";

import type { ExtendedInvitation } from "@/types/Event";
import { ExtendedUser } from "@/types/User";

export type ExtendedSession = Session & {
  id: string;
  user: ExtendedUser;
  // preferences: Preference;
  // receivedInvitations: ExtendedInvitation[];
  // sendedInvitations: Invitation[];
  // participations: Event[];
  // createdEvents: Event[];
};
