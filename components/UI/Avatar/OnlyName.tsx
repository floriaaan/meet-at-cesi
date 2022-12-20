import { User } from "@prisma/client";
import { MdVerified } from "react-icons/md";

type NameProps = {
	user: User;
	className?: string;
	badgeClassName?: string;
};

export const Name = ({ user, className, badgeClassName }: NameProps) => {
	return (
		<div
			className="inline-flex items-center gap-0.5 whitespace-nowrap"
			data-testid="avatar-name"
		>
			<span className={className || "text-sm font-bold"}>{user?.name || "Anonyme"}</span>
			{user?.emailVerified ? (
				<MdVerified className={badgeClassName || "w-4 h-4 shrink-0"} />
			) : null}
		</div>
	);
};
