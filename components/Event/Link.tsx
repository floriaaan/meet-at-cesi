import { ChevronRightIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { Event } from "types/Event";

export const EventLink = ({ name, schedule, _id }: Event) => {
  return (
    <Link href={"/event/" + _id}>
      <a className="inline-flex snap-center w-full overflow-hidden justify-between items-center p-4 rounded-[20px] bg-tertiary-50 text-tertiary">
        <div className="flex flex-col w-[90%]">
          <h6 className="mb-1 text-xl font-medium truncate font-heading">
            {name}
          </h6>
          <p className="text-xs font-light truncate">
            {schedule.timeFrom} {schedule.timeTo ? `- ${schedule.timeTo}` : ""}{" "}
            - {schedule.date}
          </p>{" "}
        </div>
        <span className="inline-flex items-center justify-end w-fit shrink-0 text-tertiary">
          <ChevronRightIcon className="w-4 h-4" />
        </span>
      </a>
    </Link>
  );
};
