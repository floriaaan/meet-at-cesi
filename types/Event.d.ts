import { UserMinimum } from "./User";

export type Event = {
  _id: string;
  name: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  schedule: {
    date: string;
    timeFrom: string;
    timeTo: string;
  };
  targetAudience?: string[];
  participants: UserMinimum[];
};
