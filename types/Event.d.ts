import type { Event, Invitation, User, Comment } from "@prisma/client";

export type ExtendedEvent = Event & {
  creator: User;
  participants: User[];
  comments: ExtendedComment[];
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

export type ExtendedComment = Comment & {
  author: User;
  parent: ExtendedComment | null;
  children: ExtendedComment[];
};
