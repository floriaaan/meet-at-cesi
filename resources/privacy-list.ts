import { UserPrivacy } from "@prisma/client";

export const privacyList = [
  {
    value: UserPrivacy.PRIVATE,
    label: "Privé",
  },
  {
    value: UserPrivacy.PUBLIC,
    label: "Public",
  },
];
