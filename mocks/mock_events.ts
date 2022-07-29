import { Event } from "types/Event";
import { __MOCK_USERS__ } from "./mock_users";

export const __MOCK_EVENTS__: Event[] = [
  {
    _id: "event-1a0",
    name: "Soirée saississante",
    location: {
      address: "Le Saxo - 11 Pl. Saint-Marc, 76000 Rouen",
      lat: 49.4383297,
      lng: 1.0999773,
    },
    targetAudience: ["Inter-promotion"],
    schedule: {
      date: "2020-01-01",
      timeFrom: "17:00",
      timeTo: "19:00",
    },
    participants: __MOCK_USERS__,
  },
  {
    _id: "event-1a1",
    name: "Révisions studieuses",
    location: {
      address: "Le Saxo - 11 Pl. Saint-Marc, 76000 Rouen",
      lat: 49.4383297,
      lng: 1.0999773,
    },
    targetAudience: ["RIL21-1", "RIL21-2"],
    schedule: {
      date: "2020-01-01",
      timeFrom: "17:00",
      timeTo: "19:00",
    },
    participants: [__MOCK_USERS__[2], __MOCK_USERS__[3]],
  },
  {
    _id: "event-1a2",
    name: "Beuverie post-soutenance",
    location: {
      address: "Quartier Libre - 76000 Rouen",
      lat: 49.4317311,
      lng: 1.0915696,
    },
    targetAudience: ["RIL21-1", "RIL21-2"],
    schedule: {
      date: "2020-01-01",
      timeFrom: "17:00",
      timeTo: "19:00",
    },
    participants: [__MOCK_USERS__[1], __MOCK_USERS__[3]],
  },
];
