import { ChevronRightIcon } from "@heroicons/react/outline";
import { Event } from "types/Event";

export const EventLink = ({ name, schedule }: Event) => {
  return (
    <div className="inline-flex snap-center w-full justify-between items-center p-4 rounded-[20px] bg-tertiary-50 text-tertiary">
      <div className="flex flex-col">
        <h6 className="font-medium font-heading text-2xl mb-1 truncate">{name}</h6>
        <p className="font-light text-xs truncate">
          {schedule.timeFrom} {schedule.timeTo ? `- ${schedule.timeTo}` : ""} -{" "}
          {schedule.date}
        </p>{" "}
      </div>
        <a className="text-tertiary inline-flex items-center mr-2">
            <ChevronRightIcon className="w-4 h-4" />
        </a>
    </div>
  );
};
