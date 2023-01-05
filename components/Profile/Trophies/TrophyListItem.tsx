import Image from "next/image";
import classNames from "classnames";

import { formatDate } from "@/lib/date";
import { Trophy } from "@/resources/trophies-list";
import { Trophy as UserTrophy } from "@prisma/client";

type TrophyListItemProps = Trophy & { userTrophy?: UserTrophy };
export const TrophyListItem = ({
	id,
	description,
	name,
	userTrophy,
}: TrophyListItemProps) => {
	const { createdAt } = userTrophy || {};
	return (
		<div
			className={classNames(
				"inline-flex items-center w-full py-2 border-b gap-x-2 md:gap-x-4 last:border-b-0 border-neutral-200 dark:border-neutral-800",
				createdAt === undefined ? "opacity-50" : "",
			)}
		>
			<Image
				src={`/img/trophies/${id}.png`}
				alt={name}
				width={128}
				height={128}
				className="w-24 h-24 -mt-2 -mb-1 md:w-32 md:h-32"
			/>
			<div className="flex flex-col grow gap-y-1">
				<h3
					className={classNames(
						"text-lg md:text-xl font-bold text-black dark:text-white",
						createdAt
							? "underline decoration-primary decoration-dotted underline-offset-2"
							: "",
					)}
				>
					{name}
				</h3>
				<p className="text-xs md:text-sm text-neutral-800 dark:text-neutral-200">{description}</p>
				{createdAt ? (
					<p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 ">
						Obtenu le {formatDate(createdAt)}
					</p>
				) : (
					<p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 ">Non obtenu</p>
				)}
			</div>
		</div>
	);
};
