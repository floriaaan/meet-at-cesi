import classNames from "classnames";
import { MouseEventHandler } from "react";

import {
	IoLogoApple,
	IoLogoGoogle,
	IoLogoMicrosoft,
	IoLogoYahoo,
} from "react-icons/io5";

import PopperMenu from "@/components/Helpers/PopperMenu";
import { buildCalendarUrl, isMobile } from "@/lib/calendar";
import { ExtendedEvent } from "@/types/Event";
import { MdChevronRight } from "react-icons/md";

type AddToCalendarProps = { event: ExtendedEvent };
export const AddToCalendar = ({ event }: AddToCalendarProps) => {
	return (
		<PopperMenu
			buttonChildren={({ open }) => <MenuButton open={open} />}
			popperOptions={{
				modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
			}}
		>
			{({ open }) => <MenuPanel open={open} event={event} />}
		</PopperMenu>
	);
};

const MenuButton = ({ open }: { open: boolean }) => {
	return (
		<span
			className={classNames(
				"p-0 nav__link bg-transparent text-black dark:text-white transition-none relative z-[50]",
				open ? "underline underline-offset-2" : "underline-0"
			)}
		>
			<MdChevronRight
				className={classNames(
					open ? "rotate-[270deg]" : "rotate-90",
					"transition-all duration-300"
				)}
			/>
			Ajouter au calendrier
		</span>
	);
};

const MenuPanel = ({ event }: { open: boolean; event: ExtendedEvent }) => {
	const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		e.preventDefault();
		const type = e.currentTarget.getAttribute("data-type") as string;
		const url = buildCalendarUrl(event, type);

		if (!isMobile() && (url.startsWith("data") || url.startsWith("BEGIN"))) {
			const filename = "download.ics";
			const blob = new Blob([url], { type: "text/calendar;charset=utf-8" });

			/****************************************************************
        // many browsers do not properly support downloading data URIs
        // (even with "download" attribute in use) so this solution
        // ensures the event will download cross-browser
        ****************************************************************/
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.setAttribute("download", filename);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			window.open(url, "_blank");
		}
	};
	return (
		<div className="flex flex-col p-2 bg-white border shadow-xl dark:bg-black border-neutral-400 dark:border-neutral-600 gap-y-2">
			<a
				data-type="google"
				className="inline-flex items-center text-sm cursor-pointer gap-x-1 hover:underline underline-offset-2"
				onClick={handleClick}
			>
				<IoLogoGoogle />
				Google Calendar
			</a>
			<a
				data-type="apple"
				className="inline-flex items-center text-sm cursor-pointer gap-x-1 hover:underline underline-offset-2"
				onClick={handleClick}
			>
				<IoLogoApple />
				Apple
			</a>
			<a
				data-type="outlookcom"
				className="inline-flex items-center text-sm cursor-pointer gap-x-1 hover:underline underline-offset-2"
				onClick={handleClick}
			>
				<IoLogoMicrosoft />
				Outlook
			</a>
			<a
				data-type="yahoo"
				className="inline-flex items-center text-sm cursor-pointer gap-x-1 hover:underline underline-offset-2"
				onClick={handleClick}
			>
				<IoLogoYahoo />
				Yahoo
			</a>
		</div>
	);
};
