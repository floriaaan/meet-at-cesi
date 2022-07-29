import {
  ClockIcon,
  LocationMarkerIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import { Event } from "types/Event";

import { motion } from "framer-motion";

type Props = {
  _id: Event["_id"];
  targetAudience: Event["targetAudience"];
  location: Event["location"];
  schedule: Event["schedule"];
};

export const Details = ({ _id, targetAudience, schedule, location }: Props) => {
  return (
    <div className="flex flex-col px-3 py-1 bg-tertiary-50 rounded-2xl">
      {location && (
        <div className="h-12 border-b inline-flex items-center last:border-b-0 border-[#EBE8E0]">
          <LocationMarkerIcon className="w-5 h-5 text-secondary-500" />
          <motion.span
            layoutId={`event:${_id}-location`}
            className="ml-2 text-xs truncate text-secondary-400"
          >
            {location?.address}
          </motion.span>
        </div>
      )}
      <div className="h-12 border-b inline-flex w-full items-center justify-between last:border-b-0 border-[#EBE8E0]">
        <div className="inline-flex items-center ">
          <ClockIcon className="w-5 h-5 text-secondary-500" />
          <motion.span
            layoutId={`event:${_id}-schedule`}
            className="ml-2 text-xs truncate text-secondary-400"
          >
            {schedule.timeFrom} - {schedule.timeTo} - {schedule.date}
          </motion.span>
        </div>
        <button>iCal</button>
      </div>
      <div className="h-12 border-b inline-flex items-center last:border-b-0 border-[#EBE8E0]">
        <UsersIcon className="w-5 h-5 text-secondary-500" />
        <motion.span
          layoutId={`event:${_id}-audience`}
          className="ml-2 text-xs truncate text-secondary-400"
        >
          {targetAudience?.join(", ") || "Tout le monde"}
        </motion.span>
      </div>
    </div>
  );
};
