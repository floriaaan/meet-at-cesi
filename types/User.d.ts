import type { Preference, User } from "@prisma/client";
import type { ExtendedInvitation } from "@/types/Event";

export type UserMinimum = {
  id: User["id"];
  image: User["image"];
  name: User["name"];
};

export type ExtendedUser = User & {
  preferences?: Preference;
  receivedInvitations: ExtendedInvitation[];
  sendedInvitations: ExtendedInvitation[];
};
