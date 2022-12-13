import { TrophyKey } from "@prisma/client";

export const trophies: {
  [key in TrophyKey]: {
    id: TrophyKey;
    name: string;
    description: string;
  };
} = {
  EVENT_CREATION_1: {
    id: "EVENT_CREATION_1",
    name: "Premier événement",
    description: "Vous avez créé(e) votre premier événement",
  },
  EVENT_CREATION_5: {
    id: "EVENT_CREATION_5",
    name: "Organisateur né",
    description: "Vous avez créé(e) 5 événements",
  },
  EVENT_CREATION_20: {
    id: "EVENT_CREATION_20",
    name: "Créateur d'événement",
    description: "Vous avez créé(e) 20 événements",
  },
  PARTICIPATION_1: {
    id: "PARTICIPATION_1",
    name: "Première participation",
    description: "Vous avez participé(e) à votre premier événement",
  },
  PARTICIPATION_10: {
    id: "PARTICIPATION_10",
    name: "Habitué(e)",
    description: "Vous avez participé(e) à 10 événements",
  },
  PARTICIPATION_100: {
    id: "PARTICIPATION_100",
    name: "Pilier de la communauté",
    description: "Vous avez participé(e) à 100 événements",
  },
};
