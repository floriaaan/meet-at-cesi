import classNames from "classnames";

import {
	MdMoreVert,
	MdNotifications,
	MdOutlineNotifications,
	MdSettings,
} from "react-icons/md";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

import PopperMenu from "@/components/Helpers/PopperMenu";
import { ChipList } from "@/components/UI/Chip/List";
import { Chip } from "@/components/UI/Chip";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "@/components/Notification";

const CHIP_CLASSNAME =
	"py-1 px-3 md:py-0.5 md:px-2 font-bold text-sm md:text-xs cursor-pointer";

export const NotificationDropdown = () => {
	// web socket notifications or polling
	const { isLoaded } = useNotifications();
	const { status } = useSession();
	if (status === "unauthenticated") return null;

	return (
		<PopperMenu
			buttonChildren={({ open }) => (
				<MenuButtonWrapper open={open} isLoaded={isLoaded} />
			)}
			popperOptions={{
				strategy: "absolute",
				modifiers: [{ name: "offset", options: { offset: [0, 6] } }],
			}}
		>
			{() => <MenuPanel />}
		</PopperMenu>
	);
};

const MenuButton = ({ open }: { open: boolean }) => {
	const { notifications } = useNotifications();
	const count = notifications?.filter((n) => !n.isRead).length || 0;

	return (
		<span
			className={classNames(
				"hover:underline underline-offset-2 gap-x-1 text-sm  whitespace-nowrap transition-none z-[50] focus:outline-none inline-flex items-center",
				open ? "underline" : "",
			)}
		>
			<span className="relative">
				{count > 0 ? (
					<>
						<MdNotifications className="w-5 h-5 shrink-0" />
						<span className="absolute right-0.5 top-0.5 w-1.5 h-1.5 bg-red animate-ping rounded-full"></span>
						<span className="w-1.5 h-1.5 rounded-full bg-red absolute right-0.5 top-0.5 "></span>
					</>
				) : (
					<MdOutlineNotifications className="w-5 h-5 shrink-0" />
				)}
			</span>
			<span className="items-center hidden md:inline-flex gap-x-1">
				<Chip
					extendClassName={classNames("py-px px-1.5", count > 0 && "bg-red")}
				>
					{count}
				</Chip>
				Notifications
			</span>
		</span>
	);
};

const MenuPanel = () => {
	const { notifications, isLoaded } = useNotifications();
	const [filter, setFilter] = useState<"all" | "unread">("unread");

	const display = notifications.filter((n) => {
		if (filter === "all") return true;
		if (filter === "unread") return !n.isRead;
	});

	return (
		<div className="flex -top-px z-[49] flex-col md:min-w-[28rem] xl:min-w-[32rem]  w-full md:w-full md:right-0 md:absolute p-2 bg-white dark:bg-black md:border border-dashed shadow-2xl mt-[1.125rem] md:mt-0 border-neutral-400 dark:border-neutral-600 md:shadow-xl">
			{isLoaded ? (
				<div className="flex flex-col gap-y-2">
					<div className="inline-flex items-center justify-between w-full pr-2">
						<div className="flex flex-col">
							<h4 className="text-2xl font-bold">Notifications</h4>
							<ChipList
								chips={[
									{
										children: `Tout (${notifications.length})`,
										onClick: () => setFilter("all"),
										className:
											filter === "all"
												? `bg-black dark:bg-white text-white ${CHIP_CLASSNAME}`
												: `bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white ${CHIP_CLASSNAME}`,
									},
									{
										children: `Non lus (${
											notifications.filter((n) => !n.isRead).length
										})`,
										onClick: () => setFilter("unread"),
										className:
											filter === "unread"
												? `bg-red text-white ${CHIP_CLASSNAME}`
												: `bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white ${CHIP_CLASSNAME}`,
									},
								]}
							/>
						</div>
						<SubMenu />
					</div>

					{display.length > 0 ? (
						<>
							{display.map((notification) => (
								<NotificationItem {...notification} key={notification.id} />
							))}
						</>
					) : (
						<div className="flex items-center justify-center h-12">
							<p className="text-neutral-600 dark:text-neutral-400">Aucune notification</p>
						</div>
					)}
				</div>
			) : (
				<div className="flex items-center justify-center h-16">
					Chargement en cours... ⌛️
				</div>
			)}
		</div>
	);
};

const SubMenu = () => {
	return (
		<PopperMenu
			buttonChildren={() => <SubMenuButton />}
			popperOptions={{
				strategy: "absolute",
				modifiers: [{ name: "offset", options: { offset: [8, 8] } }],
			}}
		>
			{() => <SubMenuPanel />}
		</PopperMenu>
	);
};

const MenuButtonWrapper = (props: { isLoaded: boolean; open: boolean }) => {
	return props.isLoaded ? (
		<MenuButton open={props.open} />
	) : (
		<span className="inline-flex items-center text-xs gap-x-1">
			<span className="hidden md:block">Chargement des notifications</span>⌛️
		</span>
	);
};

const SubMenuButton = () => <MdMoreVert className="w-6 h-6 shrink-0" />;
const SubMenuPanel = () => (
	<div className="flex -top-px z-[50] flex-col gap-y-2 w-fit p-2 bg-white dark:bg-black md:border border-dashed shadow-2xl border-neutral-400 dark:border-neutral-600 md:shadow-xl text-sm">
		<Link
			href="/profile/settings#notifications"
			className="inline-flex items-center w-full gap-x-2 hover:underline underline-offset-2"
		>
			<MdSettings className="w-5 h-5 shrink-0" />
			<span className="">Paramètres des notifications</span>
		</Link>
	</div>
);
