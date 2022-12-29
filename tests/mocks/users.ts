import { ExtendedSession } from "@/types/Session";
import { Role, User } from "@prisma/client";

const __session__: ExtendedSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: {
    email: "jean.bon@viacesi.fr",
    id: "001",
    name: "Jean Bon",
    emailVerified: new Date("2021-01-01T00:00:00.000Z"),
    image: null,
    role: Role.USER,

    preferences: undefined,
    privacy: undefined,
		notificationsSettings: undefined,

    createdEvents: [],
    participations: [],
    sendedInvitations: [],
    receivedInvitations: [],
		notifications: [],
    trophies: [],
		feedbacks: [],

    verificationTokens: [],

    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  id: "123",
};

export default __session__;

export const unverifiedUser: User = {
  email: "ze.bon@viacesi.fr",
  id: "002",
  name: "Zé Bon",

  emailVerified: null,
  image: null,
  role: Role.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export const administrator: User = {
  email: "pierre.bon@viacesi.fr",
  id: "003",
  name: "Pierre Bon",

  emailVerified: new Date("2021-01-01T00:00:00.000Z"),
  image: null,
  role: Role.ADMIN,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
export const moderator: User = {
  email: "pierre.bon@viacesi.fr",
  id: "003",
  name: "Michel Bon",

  emailVerified: new Date("2021-01-01T00:00:00.000Z"),
  image: null,
  role: Role.MODERATOR,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
