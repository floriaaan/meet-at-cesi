import { ChevronRightIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { Event } from "types/Event";

import { motion } from "framer-motion";

export const EventLink = ({ name, schedule, _id }: Event) => {
  return (
    <Link href={"/event/" + _id}>
      <motion.a
        layoutId={`event:${_id}-card`}
        className="inline-flex snap-center w-full overflow-hidden justify-between items-center p-4 rounded-[20px] bg-tertiary-50 text-tertiary"
      >
        <div className="flex flex-col w-[90%]">
          <motion.h6
            layoutId={`event:${_id}-title`}
            className="mb-1 text-xl font-medium truncate font-heading"
          >
            {name}
          </motion.h6>
          <motion.p
            layoutId={`event:${_id}-schedule`}
            className="text-xs font-light truncate"
          >
            {schedule.timeFrom} {schedule.timeTo ? `- ${schedule.timeTo}` : ""}{" "}
            - {schedule.date}
          </motion.p>{" "}
        </div>
        <span className="inline-flex items-center justify-end w-fit shrink-0 text-tertiary">
          <ChevronRightIcon className="w-4 h-4" />
        </span>
      </motion.a>
    </Link>
  );
};
