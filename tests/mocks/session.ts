import { ExtendedSession } from "@/types/Session";
import { Role } from "@prisma/client";

const __session__: ExtendedSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: {
    email: "user@viacesi.fr",
    id: "123",
    name: "Utilisateur",

    emailVerified: null,
    image: null,
    role: Role.USER,

    receivedInvitations: [],
    sendedInvitations: [],
    verificationTokens: [],
    createdEvents: [],
    participations: [],
    preferences: undefined,
    trophies: [],
    privacy: undefined,

    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  id: "123",
};

export default __session__;
