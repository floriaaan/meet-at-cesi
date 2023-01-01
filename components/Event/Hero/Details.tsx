import { AvatarWithName } from "@/components/UI/Avatar";
import { fromLocalDate } from "@/lib/date";
import { audienceList } from "@/resources/audience-list";
import { campusList } from "@/resources/campus-list";
import { ExtendedEvent } from "@/types/Event";
import classNames from "classnames";
import {
	MdCalendarToday,
	MdLocationPin,
	MdLock,
	MdPerson,
	MdPublic,
} from "react-icons/md";

export const HeroDetails = ({
	event,
	className,
}: {
	event: ExtendedEvent;
	className?: string;
}) => {
	const { location, date, audienceCampus, creator, private: isPrivate } = event;
	const audience = audienceList.find((a) => a.value === event.audience)?.label;
	const campus = campusList.find((c) => c.value === audienceCampus)?.label;
	return (
		<div
			className={classNames(
				"flex flex-col items-start justify-between w-full px-2 py-2 -mt-4 text-sm font-bold lg:shrink lg:w-fit sm:px-6 md:-mt-12 lg:mt-0 md:px-2 whitespace-nowrap md:items-end",
				!className?.includes("bg-") ? "bg-primary" : "",
				className,
			)}
		>
			<div className="flex flex-col md:items-end">
				<div className="inline-flex items-start text-black whitespace-pre-wrap md:text-right gap-x-1">
					<MdLocationPin className="w-4 h-4 shrink-0" />
					{location}
				</div>
				<div className="inline-flex items-center text-black gap-x-1">
					<MdCalendarToday className="w-4 h-4" />
					{fromLocalDate(new Date(date)).toLocaleDateString("fr-FR", {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",

						hour: "numeric",
						minute: "numeric",
					})}
				</div>
				<div className="inline-flex items-start text-black whitespace-pre-wrap md:text-right gap-x-1">
					<MdPerson className="w-4 h-4 shrink-0" />
					{audience} - {campus}
				</div>
				<div className="inline-flex items-start text-black whitespace-pre-wrap md:text-right gap-x-1">
					{!isPrivate ? (
						<>
							<MdPublic className="w-4 h-4 shrink-0" />
							Événement public
						</>
					) : (
						<>
							<MdLock className="w-4 h-4 shrink-0" />
							Événement privé
						</>
					)}
				</div>
				<AvatarWithName
					link
					user={creator}
					direction="row"
					avatarClassName="w-4 h-4 bg-purple text-[0.5rem]"
					// className="mt-1"
				/>
			</div>
		</div>
	);
};
