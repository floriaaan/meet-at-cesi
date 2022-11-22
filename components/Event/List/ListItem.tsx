import type { Event, User } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";
import { TbChevronRight } from "react-icons/tb";

import { DetailsList } from "@/components/Event/List/DetailsList";

type Props = Event & {
  creator: User;
  participants: User[];
};

// TODO: Add a "See more" button to display the full event
// TODO: Change the layout when the event is over
export const EventListItem = ({
  id,
  title,
  audience,
  audienceCampus,
  createdAt,
  date,
  location,
  updatedAt,
  creator,
  participants,
}: Props) => {
  const dateObject = new Date(date);
  const isPast =
    dateObject.getTime() <
    new Date(new Date().setDate(new Date().getDate() - 1)).getTime();

  return (
    <Link
      href={`/event/${id}`}
      className={classNames(
        "flex flex-col group w-full border border-black  divide-black md:flex-row ",
        isPast ? "opacity-50" : ""
      )}
    >
      <div
        className={
          "flex flex-col items-center justify-center w-auto h-24 md:h-auto px-4 md:min-h-max bg-black aspect-video md:aspect-square"
        }
      >
        <span className="text-sm font-bold leading-3 text-white">
          {dateObject.toLocaleDateString("fr-FR", {
            month: "short",
          })}
        </span>
        <>
          <span className="hidden text-xl font-bold text-white md:block">
            {dateObject.toLocaleDateString("fr-FR", {
              day: "numeric",
              weekday: "short",
            })}
          </span>
          <span className="block text-xl font-bold text-white md:hidden">
            {dateObject.toLocaleDateString("fr-FR", {
              day: "numeric",
              weekday: "long",
            })}
          </span>
        </>
        <hr className="w-24 border-white md:w-8" />
        <span className="mt-1 text-xs text-white">
          {dateObject.toLocaleDateString("fr-FR")}
        </span>
      </div>
      <div className="flex flex-col p-2 grow">
        <h3 className="overflow-hidden text-xl font-bold text-black group-hover:underline underline-offset-2 decoration-dashed decoration-black">
          {title}
        </h3>
        <DetailsList
          creator={creator}
          location={location}
          audience={audience}
          audienceCampus={audienceCampus}
          participants={participants}
        />
      </div>
      <div className="flex flex-col items-center justify-center w-8 h-8 ml-auto text-white bg-black border-t border-l md:border-t-0 md:border-b group-hover:bg-primary group-hover:text-black">
        <TbChevronRight className="w-4 h-4 stroke-[3]" />
      </div>
    </Link>
  );
};
