import type { Preference, User, VerificationToken } from "@prisma/client";
import type { ExtendedEvent, ExtendedInvitation } from "@/types/Event";

export type UserMinimum = {
  id: User["id"];
  image: User["image"];
  name: User["name"];
};

export type ExtendedUser = User & {
  preferences?: Preference;
  participations?: ExtendedEvent[];
  createdEvents?: ExtendedEvent[];
  receivedInvitations: ExtendedInvitation[];
  sendedInvitations: ExtendedInvitation[];

  verificationTokens: VerificationToken[];
};
