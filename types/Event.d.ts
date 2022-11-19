import type { Event, Invitation, User } from "@prisma/client";

export type ExtendedEvent = Event & {
  creator: User;
  participants: User[];
};

export type MapFeature = {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    name: string;
    score: number;
    postcode: string;
    city: string;
    context: string;
  };
};

export type ExtendedInvitation = Invitation & {
  event: ExtendedEvent;
  receiver: User;
  sender: User;
};