import { User } from "@prisma/client";
import {
  MdAccountCircle,
  MdCalendarToday,
  MdLocationPin,
  MdPerson,
} from "react-icons/md";

/**
 * TODO: maybe add a button "Ajouter à mon calendrier"
 */
export const HeroDetails = ({
  location,
  date,
  audience,
  campus,
  creator,
}: {
  location: string;
  date: string;
  audience: string;
  campus: string;
  creator: User;
}) => {
  return (
    <div className="flex flex-col items-start justify-start px-6 py-2 -mt-4 text-sm font-bold md:-mt-12 lg:mt-0 md:px-2 md:items-end whitespace-nowrap bg-primary">
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
  );
};
