import type { User } from "@prisma/client";

import classNames from "classnames";
import { useState } from "react";
import { MdGridView, MdList } from "react-icons/md";

import { ParticipantCard } from "@/components/Event/Participant/Card";
import { InvitationModal } from "@/components/Invitation/InvitationModal";
import { useSession } from "next-auth/react";
import { Chip } from "@/components/UI/Chip";
import { getPlural } from "@/lib/string";

export const ParticipantSection = ({
	eventId,
	participants,
}: {
	eventId: string;
	participants: User[];
}) => {
	const { data: session } = useSession();
	const { user } = session || {};

	const [display, setDisplay] = useState<"column" | "grid">("column");
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
						<button
							className="px-1 py-1 md:px-2 md:py-2 btn__pill"
							onClick={() =>
								setDisplay((oldValue) =>
									oldValue === "column" ? "grid" : "column"
								)
							}
						>
							{display === "grid" ? (
								<MdGridView className="w-4 h-4 text-current shrink-0" />
							) : (
								<MdList className="w-4 h-4 text-current shrink-0" />
							)}
						</button>
					</div>
				</div>
				<div
					className={classNames(
						"w-full gap-2 mt-2 overflow-y-auto max-h-full",
						display === "grid"
							? "grid grid-cols-2 lg:grid-cols-3 grid-rows-3"
							: "flex flex-col"
					)}
				>
					{participants.map((participant) => (
						<ParticipantCard
							style={display}
							key={participant.id}
							participant={participant}
						/>
					))}
				</div>
			</div>
			{user && isModalOpen ? (
				<InvitationModal
					closeModal={() => setIsModalOpen(false)}
					eventId={eventId}
					participants={participants}
				/>
			) : null}
		</>
	);
};
