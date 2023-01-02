import { ExtendedEvent } from "@/types/Event";
import { Prisma, User } from "@prisma/client";
import prisma from "@/lib/prisma";

export const getPrivateEvents = async (
	email: User["email"] | undefined,
	where?: Partial<Prisma.EventWhereInput>,
): Promise<ExtendedEvent[]> => {
	if (!email) return [];
	const events = (await prisma.event.findMany({
		where: {
			OR: [
				{
					creator: { email },
				},
				{
					invitations: { some: { receiver: { email } } },
				},
				{
					participants: { some: { email } },
				},
			],
			private: true,
			...where,
		},
		include: { participants: true, creator: true, invitations: true },
	})) as ExtendedEvent[];

	return events;
};
