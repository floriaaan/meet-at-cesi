import prisma from "@/lib/prisma";
import { trophies } from "@/resources/trophies-list";
import { Trophy, User } from "@prisma/client";

export const createEventCreationTrophy = async (
	user: User,
	createdEvents: number
): Promise<Trophy | undefined> => {
	const possiblesTrophies = Object.values(trophies).filter((t) =>
		t.id.startsWith("EVENT_CREATION")
	);
	const earnedTrophy = possiblesTrophies
		.filter((t) => t.trigger(createdEvents))
		.at(0);

	if (!earnedTrophy) return undefined;

	const trophy = await prisma.trophy.create({
		data: {
			key: earnedTrophy.id,
			userId: user.id,
			reference: `${user.id}:${earnedTrophy.id}`,
		},
	});
	return trophy;
};

export const createEventParticipationTrophy = async (
	user: User,
	participations: number
): Promise<Trophy | undefined> => {
	const possiblesTrophies = Object.values(trophies).filter((t) =>
		t.id.startsWith("PARTICIPATION")
	);
	const earnedTrophy = possiblesTrophies
		.filter((t) => t.trigger(participations))
		.at(0);

	if (!earnedTrophy) return undefined;

	const trophy = await prisma.trophy.create({
		data: {
			key: earnedTrophy.id,
			userId: user.id,
			reference: `${user.id}:${earnedTrophy.id}`,
		},
	});
	return trophy;
};
