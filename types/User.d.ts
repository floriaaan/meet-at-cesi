import { User } from "@prisma/client";

export type UserMinimum = {
  image: User["image"];
  name: User["name"];
};
