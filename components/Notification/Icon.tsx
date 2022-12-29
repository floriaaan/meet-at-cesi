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
					<TypeIcon icon={CommentIcon} className="text-black bg-pink" />
				)}
			</>

			<>
				{type === e_creation && (
					<TypeIcon icon={CalendarTodayIcon} className="text-white bg-green" />
				)}
				{type === e_deletion && (
					<TypeIcon icon={DeleteIcon} className="text-white bg-green" />
				)}
				{type === e_invitation && (
					<TypeIcon
						icon={PermContactCalendarIcon}
						className="text-white bg-green"
					/>
				)}
				{type === e_modification && (
					<TypeIcon icon={EditCalendarIcon} className="text-white bg-green" />
				)}
				{type === e_participation && (
					<TypeIcon icon={PersonAddIcon} className="text-white bg-green" />
				)}
			</>

			<>{type === f_response && <TypeIcon icon={FeedbackIcon} />}</>

			<>
				{type === r_accepted && (
					<TypeIcon icon={WarningIcon} className="text-black bg-purple" />
				)}
				{type === r_refused && (
					<TypeIcon icon={WarningIcon} className="text-black bg-purple" />
				)}
			</>
		</div>
	);
};

const TypeIcon = ({
	icon,
	className,
}: {
	// eslint-disable-next-line no-unused-vars
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

type IconProps = {
	className?: string;
};

function CommentIcon({ className }: IconProps) {
	return <MdComment className={className} />;
}
function CalendarTodayIcon({ className }: IconProps) {
	return <MdCalendarToday className={className} />;
}
function DeleteIcon({ className }: IconProps) {
	return <MdDelete className={className} />;
}
function PermContactCalendarIcon({ className }: IconProps) {
	return <MdPermContactCalendar className={className} />;
}
function EditCalendarIcon({ className }: IconProps) {
	return <MdEditCalendar className={className} />;
}
function PersonAddIcon({ className }: IconProps) {
	return <MdPersonAdd className={className} />;
}
function FeedbackIcon({ className }: IconProps) {
	return <MdFeedback className={className} />;
}
function WarningIcon({ className }: IconProps) {
	return <MdWarning className={className} />;
}
