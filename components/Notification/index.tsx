import { ExtendedNotification } from "@/types/Notification";
import { NotificationIcon } from "@/components/Notification/Icon";
import { NotificationType, User } from "@prisma/client";
import { Name } from "../UI/Avatar";
import { formatDate } from "@/lib/date";
import { ExtendedComment } from "@/types/Event";
import classNames from "classnames";
import { useNotifications } from "@/hooks/useNotifications";
import { MdDeleteForever } from "react-icons/md";

const notificationText = new Map([
	[NotificationType.COMMENT_CREATION, "a commenté.e l'événement"],
	[NotificationType.EVENT_CREATION, "a créé.e un événement"],
	[NotificationType.EVENT_DELETION, "a supprimée.e un événement"],
	[NotificationType.EVENT_INVITATION, "vous a invité.e à un événement"],
	[NotificationType.EVENT_MODIFICATION, "a modifié.e un événement"],
	[NotificationType.EVENT_PARTICIPATION, "participe à un événement"],
	[NotificationType.FEEDBACK_RESPONSE, "a répondu.e à votre feedback"],
	[NotificationType.REPORT_ACCEPTED, "a accepté.e votre signalement"],
	[NotificationType.REPORT_REFUSED, "a refusé.e votre signalement"],
]);

export const NotificationItem = ({
	type,
	sender,
	comment,
	event,
	feedback,
	report,
	isRead,
	createdAt,
	id,
}: ExtendedNotification) => {
	const { read, remove } = useNotifications();
	const handleRead = () => read(id);
	const handleRemove = () => remove(id);

	return (
		<div
			className={classNames(
				"inline-flex  w-full px-1 py-1 pb-2 overflow-x-hidden overflow-y-visible border bg-neutral-100 gap-x-3",
				isRead ? "border-neutral-200 opacity-60" : "border-black border-dashed",
			)}
		>
			<div
				className="inline-flex w-full cursor-pointer group gap-x-3"
				onClick={handleRead}
			>
				<NotificationIcon type={type} sender={sender} />
				<div className="flex flex-col gap-1 ">
					<div className="flex flex-col text-sm xl:gap-1 xl:flex-row">
						<Name user={sender || ({ name: "Inconnu" } as User)} />
						<div className="text-neutral-600">{notificationText.get(type)}</div>
					</div>
					<p className="overflow-hidden max-w-[18rem] lg:max-w-[22rem] text-sm leading-4 truncate text-neutral-800 line-clamp-1 group-hover:underline decoration-dashed underline-offset-2">
						{(comment as ExtendedComment | undefined)?.event.title ||
							event?.title ||
							feedback?.text ||
							report?.content}
					</p>
					<span className="mt-0.5 text-xs text-neutral-500">
						{formatDate(createdAt, {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
						})}
					</span>
				</div>
			</div>

			<div className="flex flex-col shrink-0">
				<button
					className="p-1 text-xs font-bold border border-transparent border-dashed hover:border-black"
					onClick={handleRemove}
				>
					<MdDeleteForever className="w-4 h-4 shrink-0" />
				</button>
			</div>
		</div>
	);
};
