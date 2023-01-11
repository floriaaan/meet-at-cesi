import { getCalendarEvent } from "@/lib/fetchers/event";
import { Event } from "@prisma/client";
import { MdCalendarToday } from "react-icons/md";

type CalendarAddProps = {
	eventId: Event["id"];
	title: Event["title"];
};

export const CalendarAdd = ({ eventId, title }: CalendarAddProps) => {
	async function fetchCalendarICSFile() {
		const content = await getCalendarEvent(eventId);
		// build file
		const blob = new Blob([content], { type: "text/calendar" });
		const url = URL.createObjectURL(blob);
		// download file
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `${title}-meet_at_cesi.ics`);
		link.click();
	}
	return (
		<>
			<button className="text-black border-b btn-black bg-pink dark:bg-purple dark:text-black" onClick={fetchCalendarICSFile}>
				<MdCalendarToday/>
				Ajouter au calendrier
			</button>
		</>
	);
};
