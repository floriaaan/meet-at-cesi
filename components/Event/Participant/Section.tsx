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

export const ParticipantSection = ({
	eventId,
	participants,
	invitations,
}: {
	eventId: string;
	participants: User[];
	invitations: Omit<ExtendedInvitation, "sender" | "event">[];
}) => {
	const { data: session } = useSession();
	const { user } = session || {};

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
				<div
					className={classNames(
						"w-full gap-2 mt-2 overflow-y-auto max-h-full",
						"flex flex-col",
					)}
				>
					{/* TODO: add invitations receivers */}
					{invitations
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
