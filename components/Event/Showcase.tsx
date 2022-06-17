import { ArrowRightIcon } from "@heroicons/react/outline";
import { Event } from "types/Event";

export const EventShowcase = ({
  name,
  location,
  targetAudience,
  schedule,
}: Event) => {
  return (
    <div className="flex flex-col rounded-2xl bg-secondary-100 shadow-md p-5">
      <h6 className="font-medium font-heading text-2xl mb-2">{name}</h6>
      <p className="text-sm font-normal">{location?.address}</p>
      <p className="font-medium text-sm">
        {schedule.timeFrom} {schedule.timeTo ? `- ${schedule.timeTo}` : ""} -{" "}
        {schedule.date}
      </p>
      <div className="mt-4 inline-flex items-center justify-between w-full">
        <p className="font-medium">{targetAudience?.join(", ")}</p>
        <a className="text-primary-600 inline-flex items-center">
          Rejoindre
          <ArrowRightIcon className="ml-2 w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
