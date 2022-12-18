import { useState } from "react";
import { useRouter } from "next/router";

import { AvatarWithName } from "@/components/UI/Avatar/WithName";
import { getPlural } from "@/lib/string";
import { ExtendedEvent } from "@/types/Event";
import { EventTableModal } from "@/components/Admin/CustomTable/Event/Modal";

export const EventTableItem = (props: ExtendedEvent) => {
	const router = useRouter();
	const { id } = router.query;
	const [isModalOpen, setIsModalOpen] = useState(id === props.id);
	const openModal = () => {
		setIsModalOpen(true);
		router.push(`/admin/event?id=${props.id}`, undefined, { shallow: true });
	};
	function closeModal() {
		setIsModalOpen(false);
		router.push(`/admin/event`, undefined, { shallow: true });
	}

	const { title, creator, participants, comments } = props;
	return (
		<>
			<tr
				className="text-black bg-white cursor-pointer w-fit hover:bg-neutral-100"
				onClick={openModal}
			>
				<td className="max-w-[16rem] px-6 py-4 truncate">{title}</td>
				<td>
					<AvatarWithName
						user={creator}
						avatarClassName="w-6 h-6 text-xs"
						textClassName="text-[0.75rem] font-bold"
						direction="row"
					/>
				</td>
				<td>
					{participants.length > 0 ? (
						<span className="inline-flex items-center text-xs text-left text-black gap-x-1">
							<strong>{participants.length}</strong>
							{getPlural(participants.length, "participant", "participants")}
						</span>
					) : (
						<span className="text-xs text-black text-left inline-flex items-center gap-x-0.5">
							aucun participant
						</span>
					)}
				</td>
				<td>
					{comments.length > 0 ? (
						<span className="inline-flex items-center text-xs text-left text-black gap-x-1">
							<strong>{comments.length}</strong>
							{getPlural(comments.length, "commentaire", "commentaires")}
						</span>
					) : (
						<span className="text-xs text-black text-left inline-flex items-center gap-x-0.5">
							aucun commentaire
						</span>
					)}
				</td>
			</tr>
			<EventTableModal
				{...props}
				isModalOpen={isModalOpen}
				closeModal={closeModal}
			/>
		</>
	);
};
