import { ArrowRightIcon } from "@heroicons/react/outline";
import { Event } from "types/Event";

export const EventShowcase = ({
  name,
  location,
  targetAudience,
  schedule,
}: Event) => {
  return (
    <div className="flex flex-col p-5 bg-opacity-50 border-2 shadow-xl border-primary-200 shadow-primary-50 text-secondary-600 rounded-[20px] bg-primary-100">
      <h6 className="mb-2 text-2xl font-medium font-heading">{name}</h6>
      <p className="text-sm font-normal">{location?.address}</p>
      <p className="text-sm font-medium">
        {schedule.timeFrom} {schedule.timeTo ? `- ${schedule.timeTo}` : ""} -{" "}
        {schedule.date}
      </p>
      <div className="inline-flex items-center justify-between w-full mt-4">
        <p className="font-medium">{targetAudience?.join(", ")}</p>
        <a className="inline-flex items-center text-primary-600">
          Rejoindre
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
};
