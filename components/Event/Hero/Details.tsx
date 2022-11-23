import audienceList from "@/resources/audience-list";
import campusList from "@/resources/campus-list";
import { ExtendedEvent } from "@/types/Event";
import { User } from "@prisma/client";
import {
  MdAccountCircle,
  MdCalendarToday,
  MdLocationPin,
  MdPerson,
} from "react-icons/md";
import { AddToCalendar } from "../../Helpers/AddToCalendar";

export const HeroDetails = ({ event }: { event: ExtendedEvent }) => {
  const { location, date, audienceCampus, creator } = event;
  const audience = audienceList.find(
    (a) => a.value === event.audience
  )?.shortLabel;
  const campus = campusList.find((c) => c.value === audienceCampus)?.label;
  return (
    <div className="flex flex-col items-start justify-between px-6 py-2 -mt-4 text-sm font-bold md:-mt-12 lg:mt-0 md:px-2 whitespace-nowrap bg-primary md:items-end">
      <div className="flex flex-col md:items-end">
        <div className="inline-flex items-start text-black whitespace-pre-wrap md:whitespace-nowrap gap-x-1">
          <MdLocationPin className="w-4 h-4" />
          {location}
        </div>
        <div className="inline-flex items-center text-black gap-x-1">
          <MdCalendarToday className="w-4 h-4" />
          {new Date(date).toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="inline-flex items-center text-black sm:hidden gap-x-1">
          <MdPerson className="w-4 h-4" />
          {audience} - {campus}
        </div>
        <div className="inline-flex items-center text-black gap-x-1">
          <MdAccountCircle className="w-4 h-4" />
          {creator.name}
        </div>
      </div>

      <div className="">
        <AddToCalendar event={{ ...event, date: new Date(event.date) }} />
      </div>
    </div>
  );
};
