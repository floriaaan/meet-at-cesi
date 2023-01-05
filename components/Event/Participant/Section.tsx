import { InvitationStatus, User } from "@prisma/client";

import classNames from "classnames";
import { useState } from "react";
import { useSession } from "next-auth/react";

import {
	InvitationReceiverCard,
	ParticipantCard,
} from "@/components/Event/Participant/Card";
import { InvitationModal } from "@/components/Invitation/InvitationModal";
import { Chip } from "@/components/UI/Chip";
import { getPlural } from "@/lib/string";
import { ExtendedInvitation } from "@/types/Event";
import { ExtendedSession } from "@/types/Session";

type ParticipantSectionProps = {
	eventId: string;
	participants: User[];
	invitations: Omit<ExtendedInvitation, "sender" | "event">[];
	isCreator: boolean;
};

export const ParticipantSection = ({
	eventId,
	participants,
	invitations,
	isCreator,
}: ParticipantSectionProps) => {
	const { data: session } = useSession();
	const { user } = (session as ExtendedSession) || {};

	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<div className="flex flex-col w-full p-2 bg-gray-100 md:p-4 max-h-64 lg:max-h-full lg:h-full gap-y-2">
				<div className="inline-flex justify-between w-full ">
					<p className="inline-flex items-center text-xs font-bold md:text-base gap-x-1">
						<Chip>{participants.length}</Chip>{" "}
						{getPlural(participants.length, "participant", "participants")}
					</p>
					<div className="inline-flex items-center gap-x-2">
						{user ? (
							<button
								className="btn__pill"
								onClick={() => setIsModalOpen(true)}
							>
								Inviter
							</button>
						) : null}
					</div>
				</div>
				{user ? (
					<div
						className={classNames(
							"w-full gap-2 mt-2 overflow-y-auto max-h-full",
							"flex flex-col",
						)}
					>
						{invitations
							.filter(
								(i) =>
									i.senderId === user?.id ||
									i.receiverId === user?.id ||
									isCreator,
							)
							.filter((i) => i.status === InvitationStatus.PENDING)
							.map((i) => (
								<InvitationReceiverCard
									key={i.receiver.id}
									receiver={i.receiver}
								/>
							))}
						{participants.map((participant) => (
							<ParticipantCard key={participant.id} participant={participant} />
						))}
					</div>
				) : (
					<div className="flex items-center justify-center w-full h-16">
						<p className="text-sm text-gray-500">
							Connectez-vous pour voir les participants de cet événement
						</p>
					</div>
				)}
			</div>
			{user && isModalOpen ? (
				<InvitationModal
					closeModal={() => setIsModalOpen(false)}
					eventId={eventId}
					participants={participants}
					invitations={invitations}
				/>
			) : null}
		</>
	);
};
