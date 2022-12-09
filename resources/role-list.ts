import { Role } from "@prisma/client";

export const roleList: {
  label: string;
  value: Role;
}[] = [
  { label: "Administrateur", value: Role.ADMIN },
  { label: "Modérateur", value: Role.MODERATOR },
  { label: "Utilisateur", value: Role.USER },
];

export const EXCEPTIONS_EMAIL = ["florian.leroux@viacesi.fr"];
