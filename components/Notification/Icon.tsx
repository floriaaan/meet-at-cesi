import {
	MdCalendarToday,
	MdComment,
	MdDelete,
	MdEditCalendar,
	MdFeedback,
	MdPermContactCalendar,
	MdPersonAdd,
	MdWarning,
} from "react-icons/md";
import { NotificationType, User } from "@prisma/client";
import classNames from "classnames";

import { ExtendedNotification } from "@/types/Notification";
import { Avatar } from "@/components/UI/Avatar";

const {
	COMMENT_CREATION: c_creation,
	EVENT_CREATION: e_creation,
	EVENT_DELETION: e_deletion,
	EVENT_INVITATION: e_invitation,
	EVENT_MODIFICATION: e_modification,
	EVENT_PARTICIPATION: e_participation,
	FEEDBACK_RESPONSE: f_response,
	REPORT_ACCEPTED: r_accepted,
	REPORT_REFUSED: r_refused,
} = NotificationType;

type NotificationIconProps = {
	type: ExtendedNotification["type"];
	sender: ExtendedNotification["sender"];
	className?: string;
	avatarClassName?: string;
};

export const NotificationIcon = ({
	type,
	sender,
	className,
	avatarClassName,
}: NotificationIconProps) => {
	return (
		<div
			className={classNames(
				"flex items-center justify-center relative shrink-0",
				!className?.includes("w-") && "w-16",
				!className?.includes("h-") && "h-16",
				className,
			)}
		>
			<Avatar
				user={sender || ({ name: "?" } as User)}
				className={classNames(
					"shrink-0 border-neutral-500",
					!avatarClassName?.includes("w-") && "w-16",
					!avatarClassName?.includes("h-") && "h-16",
					avatarClassName,
				)}
			/>

			<>
				{type === c_creation && (
					<TypeIcon
						icon={({ className }) => <MdComment className={className} />}
						className="text-black bg-pink"
					/>
				)}
			</>

			<>
				{type === e_creation && (
					<TypeIcon
						icon={({ className }) => <MdCalendarToday className={className} />}
						className="text-white bg-green"
					/>
				)}
				{type === e_deletion && (
					<TypeIcon
						icon={({ className }) => <MdDelete className={className} />}
						className="text-white bg-green"
					/>
				)}
				{type === e_invitation && (
					<TypeIcon
						icon={({ className }) => (
							<MdPermContactCalendar className={className} />
						)}
						className="text-white bg-green"
					/>
				)}
				{type === e_modification && (
					<TypeIcon
						icon={({ className }) => <MdEditCalendar className={className} />}
						className="text-white bg-green"
					/>
				)}
				{type === e_participation && (
					<TypeIcon
						icon={({ className }) => <MdPersonAdd className={className} />}
						className="text-white bg-green"
					/>
				)}
			</>

			<>
				{type === f_response && (
					<TypeIcon
						icon={({ className }) => <MdFeedback className={className} />}
					/>
				)}
			</>

			<>
				{type === r_accepted && (
					<TypeIcon
						icon={({ className }) => <MdWarning className={className} />}
						className="text-black bg-purple"
					/>
				)}
				{type === r_refused && (
					<TypeIcon
						icon={({ className }) => <MdWarning className={className} />}
						className="text-black bg-purple"
					/>
				)}
			</>
		</div>
	);
};

const TypeIcon = ({
	icon,
	className,
}: {
	icon: ({ className }: { className: string }) => React.ReactNode;
	className?: string;
}) => {
	return (
		<span
			className={classNames(
				"absolute flex items-center shadow justify-center  w-7 h-7 -bottom-1 -right-1",
				className || "text-white bg-black",
			)}
		>
			{icon({ className: "w-4 h-4 shrink-0" })}
		</span>
	);
};
