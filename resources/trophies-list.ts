import { TrophyKey } from "@prisma/client";

export type TrophyList = {
	[key in TrophyKey]: Trophy;
};

export type Trophy = {
	id: TrophyKey;
	name: string;
	description: string;
	trigger: (...args: any) => boolean;
};

export const trophies: TrophyList = {
	EVENT_CREATION_1: {
		id: "EVENT_CREATION_1",
		name: "Premier événement",
		description: "Vous avez créé(e) votre premier événement",
		trigger: (createdEvents: number) => createdEvents === 1,
	},
	EVENT_CREATION_5: {
		id: "EVENT_CREATION_5",
		name: "Organisateur né",
		description: "Vous avez créé(e) 5 événements",
		trigger: (createdEvents: number) => createdEvents === 5,
	},
	EVENT_CREATION_20: {
		id: "EVENT_CREATION_20",
		name: "Créateur d'événement",
		description: "Vous avez créé(e) 20 événements",
		trigger: (createdEvents: number) => createdEvents === 20,
	},
	PARTICIPATION_1: {
		id: "PARTICIPATION_1",
		name: "Première participation",
		description: "Vous avez participé(e) à votre premier événement",
		trigger: (participatedEvents: number) => participatedEvents === 1,
	},
	PARTICIPATION_10: {
		id: "PARTICIPATION_10",
		name: "Habitué(e)",
		description: "Vous avez participé(e) à 10 événements",
		trigger: (participatedEvents: number) => participatedEvents === 10,
	},
	PARTICIPATION_100: {
		id: "PARTICIPATION_100",
		name: "Pilier de la communauté",
		description: "Vous avez participé(e) à 100 événements",
		trigger: (participatedEvents: number) => participatedEvents === 100,
	},
};
