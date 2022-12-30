import { ExtendedEvent } from "@/types/Event";
import mobile from 'is-mobile';


export type SupportedCalendar = "google" | "outlookcom" | "yahoo";

export const buildUrl = (
	event: ExtendedEvent,
	type: SupportedCalendar | string,
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
			const startDate = date.toISOString().split("T")[0].replaceAll("-", "");
			calendarUrl = [
				"BEGIN:VCALENDAR",
				"CALSCALE:GREGORIAN",
				"METHOD:PUBLISH",
				"PRODID:-//TESTCAL//EN",
				"VERSION:2.0",
				"BEGIN:VEVENT",
				"UID:" + id,
				"URL:" + document.URL,
				"DTSTART;VALUE=DATE:" + startDate,
				"DTEND;VALUE=DATE:" + startDate,
				"SUMMARY:" + title,
				"LOCATION:" + event.location,
				"END:VEVENT",
				"END:VCALENDAR",
			].join("\n");

			if (mobile()) {
				calendarUrl = encodeURI(
					"data:text/calendar;charset=utf8," + calendarUrl,
				);
			}
		}
	}

	return calendarUrl;
};
