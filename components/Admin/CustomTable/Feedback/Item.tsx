import { useState } from "react";
import { useRouter } from "next/router";

import routes from "@/resources/routes";
import { AvatarWithName } from "@/components/UI/Avatar/WithName";
import { ExtendedFeedback } from "@/types/Feedback";
import { FeedbackTableModal } from "@/components/Admin/CustomTable/Feedback/Modal";
import { formatDate } from "@/lib/date";
import { Chip } from "@/components/UI/Chip";

export const FeedbackTableItem = (props: ExtendedFeedback) => {
	const router = useRouter();
	const { id } = router.query;
	const [isModalOpen, setIsModalOpen] = useState(id === props.id);
	const openModal = () => {
		setIsModalOpen(true);
		router.push(`/admin/feedback?id=${props.id}`, undefined, { shallow: true });
	};
	function closeModal() {
		setIsModalOpen(false);
		router.push(`/admin/feedback`, undefined, { shallow: true });
	}

	const { createdAt, history, page, text, user } = props;
	return (
		<>
			<tr
				className="w-full text-black bg-white cursor-pointer dark:text-white dark:bg-black hover:bg-neutral-100 hover:dark:bg-neutral-900"
				onClick={openModal}
			>
				<td className="max-w-[16rem] px-6 py-4 text-sm truncate">{text}</td>
				<td className="px-3">
					<AvatarWithName
						user={user}
						avatarClassName="w-6 h-6 text-xs"
						textClassName="text-[0.75rem] font-bold"
						direction="row"
					/>
				</td>
				<td className="px-3 text-xs">{routes[page as keyof typeof routes]}</td>
				<td className="px-3">
					{history.length > 0 ? (
						<span className="inline-flex items-center gap-x-1">
							✅<span className="sr-only">Oui</span>
							<Chip>{history.length}</Chip>
						</span>
					) : (
						<span>
							❌<span className="sr-only">Non</span>
						</span>
					)}
				</td>
				<td className="pl-3 pr-6 text-sm">
					{formatDate(createdAt, {
						day: "numeric",
						month: "short",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
					})}
				</td>
			</tr>
			<FeedbackTableModal
				{...props}
				isModalOpen={isModalOpen}
				closeModal={closeModal}
			/>
		</>
	);
};
