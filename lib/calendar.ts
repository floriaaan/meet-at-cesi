import mobile from "is-mobile";
export const isMobile = mobile;

import { ExtendedEvent } from "@/types/Event";
import { fromLocalDate } from "@/lib/date";

export type SupportedCalendar = "google" | "outlookcom" | "yahoo" | string;

export const buildCalendarUrl = (
	event: ExtendedEvent,
	type: SupportedCalendar,
) => {
	const { title, date, location, id } = event;
	let calendarUrl = "";

	// allow mobile browsers to open the gmail data URI within native calendar app
	// type = (type == "google" && this.isMobile()) ? "outlook" : type;

	switch (type) {
		case "google":
			calendarUrl = "https://calendar.google.com/calendar/render";
			calendarUrl += "?action=TEMPLATE";
			calendarUrl += "&dates=" + encodeURIComponent(date.toISOString());
			calendarUrl += "&location=" + encodeURIComponent(location);
			calendarUrl += "&text=" + encodeURIComponent(title);
			break;

		case "yahoo":
			// yahoo doesn't utilize endTime so we need to calulate duration
			calendarUrl = "https://calendar.yahoo.com/?v=60&view=d&type=20";
			calendarUrl += "&title=" + encodeURIComponent(title);
			calendarUrl += "&st=" + encodeURIComponent(date.toISOString());
			calendarUrl += "&in_loc=" + encodeURIComponent(location);
			break;

		case "outlookcom":
			calendarUrl = "https://outlook.live.com/owa/?rru=addevent";
			calendarUrl += "&startdt=" + encodeURIComponent(date.toISOString());
			calendarUrl += "&subject=" + encodeURIComponent(title);
			calendarUrl += "&location=" + encodeURIComponent(event.location);
			calendarUrl += "&allday=false";
			calendarUrl += "&uid=" + encodeURIComponent(id);
			calendarUrl += "&path=/calendar/view/Month";
			break;

		default: {
			// const startDate = date.toISOString().split("T")[0].replaceAll("-", "");
			// let endDate: string | Date = date;
			// endDate.setDate(endDate.getDate() + 1);
			// endDate = endDate.toISOString().split("T")[0].replaceAll("-", "");
			const start = fromLocalDate(date);
			const end = fromLocalDate(date);
			end.setHours(end.getHours() + 2);

			calendarUrl = [
				"BEGIN:VCALENDAR",
				"CALSCALE:GREGORIAN",
				"METHOD:PUBLISH",
				"VERSION:2.0",
				"BEGIN:VEVENT",
				"UID:" + id,
				"URL:" + `${process.env.NEXT_PUBLIC_APP_URL}/event/${id}`,
				"DTSTART:" +
					start
						.toISOString()
						.replaceAll(":", "")
						.replaceAll("-", "")
						.replaceAll(".", "")
						.replace("000Z", "Z"),
				"DTEND:" +
					end
						.toISOString()
						.replaceAll(":", "")
						.replaceAll("-", "")
						.replaceAll(".", "")
						.replace("000Z", "Z"),
				"SUMMARY:" + title,
				"LOCATION:" + event.location,
				...event.participants.map(
					(p) => `ATTENDEE;CN=${p.name};RSVP=FALSE:MAILTO:${p.email}`,
				),
				"END:VEVENT",
				"END:VCALENDAR",
			].join("\n");

			if (isMobile()) {
				calendarUrl = encodeURI(
					"data:text/calendar;charset=utf8," + calendarUrl,
				);
			}
		}
	}

	return calendarUrl;
};
