import type { User } from "@prisma/client";
import {
	MdFace,
	MdLocationPin,
	MdLock,
	MdPublic,
} from "react-icons/md";

import { audienceList } from "@/resources/audience-list";
import { campusList } from "@/resources/campus-list";
import { DetailsListItem } from "@/components/Event/List/DetailsListItem";
import { getPlural } from "@/lib/string";
import { AvatarWithName } from "@/components/UI/Avatar/WithName";

type DetailsListProps = {
	creator: User;
	location: string;
	audience: string;
	audienceCampus: string;
	participants: User[];
	private: boolean;
};
export const DetailsList = ({
	creator,
	location,
	audience,
	audienceCampus,
	participants,
	private: isPrivate,
}: DetailsListProps) => {
	const audienceDisplay = audienceList.find((a) => a.value === audience)?.label;
	const campusDisplay =
		campusList.find((c) => c.value === audienceCampus) || null;
	return (
		<ul className="flex flex-col mt-1 gap-y-1">
			<DetailsListItem
				icon={<MdLocationPin className="w-4 h-4 text-black shrink-0 dark:text-white" />}
				value={location}
			/>

			<DetailsListItem
				icon={
					!isPrivate ? (
						<MdPublic className="w-4 h-4 text-black shrink-0 dark:text-white" />
					) : (
						<MdLock className="w-4 h-4 text-black shrink-0 dark:text-white" />
					)
				}
				value={`${!isPrivate ?audienceDisplay: "Privé"}${
					campusDisplay ? ` - ${campusDisplay.label}` : ""
				}`}
			/>
			<DetailsListItem
				icon={<MdFace className="w-4 h-4 text-black shrink-0 dark:text-white" />}
				value={`${participants.length} ${getPlural(
					participants.length,
					"participant inscrit",
					"participants inscrits",
				)}`}
			/>
			<DetailsListItem
				icon={undefined}
				value={
					<AvatarWithName
						user={creator}
						direction="row"
						avatarClassName="w-8 h-8 shrink-0 text-xs bg-purple"
						textClassName="text-sm font-bold"
					/>
				}
			/>
		</ul>
	);
};
