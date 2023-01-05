import classNames from "classnames";
import { AvatarList } from "@/components/UI/Avatar/List";
import { AvatarWithName } from "@/components/UI/Avatar/WithName";
import { Name } from "@/components/UI/Avatar/OnlyName";
import { User } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

import { getInitials } from "@/lib/string";

export type AvatarProps = {
	user: User;
	className?: string;
	link?: boolean;
	linkClassName?: string;
};

const AvatarPicture = ({ user, className }: AvatarProps) => (
	<>
		{user?.image ? (
			<Image
				width={64}
				height={64}
				src={user?.image}
				alt={user?.name || "Participant picture"}
				className={classNames(
					"rounded-full object-cover object-center border border-black  shrink-0",
					className
				)}
				data-testid="avatar"
			/>
		) : (
			<span
				className={classNames(
					"rounded-full select-none flex justify-center shrink-0 items-center font-bold",
					className,
					!className?.includes("bg-") ? "bg-primary" : null,
					!className?.includes("text-") && !(className?.includes("text-[")) ? "text-black" : null
				)}
				data-testid="avatar"
			>
				{user?.name ? getInitials(user.name) : "?"}
			</span>
		)}
	</>
);

const Avatar = ({ user, className, link = false, linkClassName }: AvatarProps) => {
	return link ? (
		<Link
			href={`/profile/${user.id}`}
			className={classNames("hover:opacity-80 shrink-0", linkClassName)}
		>
			<AvatarPicture user={user} className={className} />
		</Link>
	) : (
		<AvatarPicture user={user} className={className} />
	);
};

export { Avatar, AvatarList, AvatarWithName, Name };
