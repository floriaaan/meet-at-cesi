import Link from "next/link";
import {
	MdCalendarToday,
	MdChatBubble,
	MdGroup,
	MdGroups,
	MdLocationPin,
} from "react-icons/md";
import { useSession } from "next-auth/react";

import audienceList from "@/resources/audience-list";
import campusList from "@/resources/campus-list";
import { Avatar, AvatarList, Name } from "@/components/UI/Avatar";
import { Modal } from "@/components/UI/Modal";
import { formatDate } from "@/lib/date";
import { ExtendedEvent } from "@/types/Event";
import { UserListItem } from "@/components/User/ListItem";
import { Chip } from "@/components/UI/Chip";
import { CommentFeedItem } from "@/components/Event/Comment/FeedItem";
import { ExtendedSession } from "@/types/Session";

type EventTableModalProps = ExtendedEvent & {
	isModalOpen: boolean;
	closeModal: () => void;
};

export const EventTableModal = ({
	isModalOpen,
	closeModal,
	...event
}: EventTableModalProps) => {
	const {
		title,
		creator,
		audience,
		audienceCampus,
		location,
		createdAt,
		date,
		participants,
		comments,
	} = event;
	const promotion = audienceList.find((a) => a.value === audience)?.label;
	const campus = campusList.find((c) => c.value === audienceCampus)?.label;
	const { data: session } = useSession();
	const { user } = (session as ExtendedSession) || {};

	return (
		<Modal
			isOpen={isModalOpen}
			onClose={closeModal}
			title={title}
			maxWidth="md:max-w-2xl"
			overflow="overflow-y-auto"
		>
			<div className="grid md:grid-cols-2 gap-x-4 gap-y-2">
				<div className="inline-flex items-center pb-3 border-b gap-x-2 md:col-span-2 border-neutral-300 ">
					<Avatar user={creator} className="w-10 h-10" />
					<div className="flex flex-col">
						<Name user={creator} />
						<p className="text-xs leading-3 text-neutral-500">
							Événement créé le {formatDate(createdAt)}
						</p>
					</div>
				</div>
				<div className="">
					<p className="inline-flex items-center text-lg font-bold gap-x-1">
						<MdLocationPin />
						Emplacement
					</p>
					<p className="text-sm text-neutral-700">{location}</p>
				</div>
				<div className="">
					<p className="inline-flex items-center text-lg font-bold gap-x-1">
						<MdCalendarToday />
						Date
					</p>
					<p className="text-sm text-neutral-700">
						{formatDate(date, {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
						})}
					</p>
				</div>
				<div className="md:col-span-2">
					<p className="inline-flex items-center text-lg font-bold gap-x-1">
						<MdGroup />
						Audience
					</p>
					<p className="text-sm text-neutral-700">{promotion}</p>
					<p className="text-sm text-neutral-700">{campus}</p>
				</div>
				<hr className="md:col-span-2 border-neutral-300" />
				<div className="md:col-span-2">
					<div className="inline-flex items-center justify-between w-full text-lg font-bold gap-x-1">
						<div className="inline-flex items-center gap-x-1">
							<MdGroups />
							Participants
							<Chip extendClassName="ml-1">{participants.length}</Chip>
						</div>
						<AvatarList
							users={participants}
							avatarClassName="w-6 h-6 text-xs"
						/>
					</div>
					{participants.length > 0 ? (
						<div className="flex flex-col w-full p-2 mt-1.5 overflow-y-auto border max-h-32 gap-y-1 bg-neutral-50">
							{participants.map((participant) => (
								<UserListItem
									avatarClassName="w-6 text-xs h-6"
									user={participant}
									key={participant.id}
								/>
							))}
						</div>
					) : (
						<p className="text-sm">Pas de participant.</p>
					)}
				</div>
				<div className="md:col-span-2">
					<div className="inline-flex items-center justify-between w-full text-lg font-bold gap-x-1">
						<div className="inline-flex items-center gap-x-1">
							<MdChatBubble />
							Commentaires
							<Chip extendClassName="ml-1">{comments.length}</Chip>
						</div>
					</div>
					{comments.length > 0 ? (
						<div className="flex flex-col w-full p-2 mt-1.5 overflow-y-auto border max-h-32 gap-y-1 bg-neutral-50">
							{comments.map((c) => (
								<CommentFeedItem {...c} event={event} key={c.id} />
							))}
						</div>
					) : (
						<p className="text-sm">Pas de commentaire.</p>
					)}
				</div>

				<div className="flex flex-col items-center w-full gap-2 md:justify-end md:flex-row md:col-span-2">
					{user?.role === "ADMIN" ? (
						<Link
							href={`/event/${event.id}/edit`}
							className="border-0 md:w-fit btn-black"
						>
							Modifier
						</Link>
					) : null}
					<Link
						href={`/event/${event.id}`}
						className="border-0 md:w-48 btn-black"
					>
						Aller
					</Link>
				</div>
			</div>
		</Modal>
	);
};
