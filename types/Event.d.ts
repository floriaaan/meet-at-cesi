import type { Event, User } from "@prisma/client";

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
