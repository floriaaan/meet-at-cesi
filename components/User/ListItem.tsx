import classNames from "classnames";
import { User } from "@prisma/client";
import { AvatarWithName } from "../UI/Avatar/WithName";

type Props = {
	user: User;

	className?: string;
	avatarClassName?: string;

	checked?: boolean;
	onCheck?: (user: User) => void;

	optionalNode?: JSX.Element;
};

export const UserListItem = ({
	user,
	onCheck,
	avatarClassName,
	checked,
	className,

	optionalNode,
}: Props) => {
	return (
		<div
			className={classNames(
				"inline-flex items-center justify-between w-full",
				className,
				checked ? "bg-neutral-50 dark:bg-neutral-950" : "",
			)}
			onClick={() => onCheck?.(user)}
		>
			<AvatarWithName
				link
				user={user}
				direction="row"
				avatarClassName={avatarClassName || "w-8 h-8 shrink-0"}
			/>
			<span className="inline-flex items-center gap-x-1">
				{optionalNode}
				{onCheck !== undefined && checked !== undefined ? (
					<input
						type={"checkbox"}
						defaultChecked={checked}
						className="accent-primary"
					></input>
				) : (
					<></>
				)}
			</span>
		</div>
	);
};
