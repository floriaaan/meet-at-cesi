import { ArrowRightIcon } from "@heroicons/react/outline";
import { Event } from "types/Event";

import { motion } from "framer-motion";
import Link from "next/link";

export const EventShowcase = ({
  _id,
  name,
  location,
  targetAudience,
  schedule,
}: Event) => {
  return (
    <div className="flex flex-col p-5 bg-opacity-50 border-2 shadow-xl border-primary-200 shadow-primary-50 text-secondary-600 rounded-[20px] bg-primary-100">
      <motion.h6
        layoutId={`event:${_id}-title`}
        className="mb-2 text-2xl font-medium font-heading"
      >
        {name}
      </motion.h6>
      <motion.p layoutId={`event:${_id}-location`} className="text-sm font-normal">
        {location?.address}
      </motion.p>
      <motion.p
        layoutId={`event:${_id}-schedule`}
        className="text-sm font-medium"
      >
        {schedule.timeFrom} {schedule.timeTo ? `- ${schedule.timeTo}` : ""} -{" "}
        {schedule.date}
      </motion.p>
      <div className="inline-flex items-center justify-between w-full mt-4">
        <motion.p layoutId={`event:${_id}-audience`} className="font-medium">
          {targetAudience?.join(", ")}
        </motion.p>
        <Link href={`/event/${_id}`}>
          <a className="inline-flex items-center text-primary-600">
            Rejoindre
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </a>
        </Link>
      </div>
    </div>
  );
};
