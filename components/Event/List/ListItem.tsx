import type { Event, User } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";
import { TbChevronRight } from "react-icons/tb";

import { DetailsList } from "@/components/Event/List/DetailsList";
import { DateComponent } from "@/components/Event/List/Date";

type Props = Event & {
	creator: User;
	participants: User[];

	forceVertical?: boolean;
	forceHorizontal?: boolean;
};

// TODO: Change the layout when the event is over
export const EventListItem = ({
	id,
	title,
	audience,
	audienceCampus,
	date,
	location,
	creator,
	participants,
	private: isPrivate,

	forceHorizontal = false,
	forceVertical = false,
}: Props) => {
	const dateObject = new Date(date);
	const isPast =
		dateObject.getTime() <
		new Date(new Date().setDate(new Date().getDate() - 1)).getTime();

	return (
		<Link
			href={`/event/${id}`}
			className={classNames(
				"flex group w-full border border-black dark:border-neutral-700  divide-black bg-white grow dark:bg-black",
				isPast ? "opacity-50" : "",
				forceHorizontal && "flex-row",
				forceVertical && "flex-col",
				!(forceVertical || forceHorizontal) && " flex-col md:flex-row",
			)}
		>
			<DateComponent
				date={dateObject}
				private={isPrivate}
				forceHorizontal={forceHorizontal}
				forceVertical={forceVertical}
			/>
			<div className="flex flex-col p-2 ">
				<h3 className="overflow-hidden text-xl font-bold text-black dark:text-white line-clamp-1 group-hover:underline underline-offset-2 decoration-dashed decoration-purple">
					{title}
				</h3>
				<DetailsList
					creator={creator}
					location={location}
					audience={audience}
					audienceCampus={audienceCampus}
					participants={participants}
					private={isPrivate}
				/>
			</div>
			<div
				className={
					classNames("flex flex-col items-center justify-center w-8 h-8 ml-auto text-white bg-black border-t border-l dark:bg-neutral-800 shrink-0  group-hover:bg-pink group-hover:text-black dark:text-white",
					!forceVertical && "md:border-t-0 md:border-b")
				}
			>
				<TbChevronRight className="w-4 h-4 stroke-[3]" />
			</div>
		</Link>
	);
};
