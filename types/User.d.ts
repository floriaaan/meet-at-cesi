import { Preference, User } from "@prisma/client";

export type UserMinimum = {
  image: User["image"];
  name: User["name"];
};

export type ExtendedUser = User & {
  preferences?: Preference;
};
