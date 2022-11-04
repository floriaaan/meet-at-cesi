import audienceList from "@/resources/audience-list";
import campusList from "@/resources/campus-list";
import type { Event, User } from "@prisma/client";
import Link from "next/link";

import {
  MdAccountCircle,
  MdCalendarToday,
  MdChevronRight,
  MdLocationPin,
  MdPerson,
} from "react-icons/md";

type Props = Event & {
  creator: User;
  participants: User[];
};

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
  const dateDisplay = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/event/${id}`}>
      <a className="flex flex-col w-full py-4 border-b border-gray-100 last:pb-12 gap-y-2 last:border-0">
        <div className="inline-flex items-start w-full gap-x-1.5 group">
          <MdChevronRight className="w-8 h-8 shrink-0 text-purple group-hover:text-pink" />
          <h2 className="text-2xl mt-0.5 md:-mt-0.5 md:text-3xl leading-[1.15] font-bold group-hover:underline underline-offset-4 decoration-purple first-letter:uppercase">
            {title}
          </h2>
        </div>
        <div className="flex items-end justify-between w-full lg:flex-row">
          <ul className="flex flex-col w-full gap-0.5">
            <LiItem
              label="Date"
              value={dateDisplay}
              icon={<MdCalendarToday className="w-4 h-4 mr-2 text-purple" />}
            />
            <LiItem
              label="Lieu"
              value={location}
              icon={<MdLocationPin className="w-4 h-4 mr-2 text-purple" />}
            />
            <LiItem
              label="Invités"
              value={`${
                audienceList.find((item) => item.value === audience)?.label ||
                ""
              } - Campus CESI ${
                campusList.find((item) => item.value === audienceCampus)
                  ?.label || ""
              }`}
              icon={<MdPerson className="w-4 h-4 mr-2 text-purple" />}
            />
            <div className="inline-flex items-center justify-between w-full">
              <LiItem
                label="Organisateur"
                value={
                  <span className="capitalize">
                    {creator.name?.toLocaleLowerCase()}
                  </span>
                }
                icon={<MdAccountCircle className="w-4 h-4 mr-2 text-purple" />}
              />
              <span className="text-xs md:text-sm">
                <strong>{participants.length}</strong> participant(s) inscrit(s)
              </span>
            </div>
          </ul>
          {/* <div className="flex flex-col items-end gap-y-1">
            <button className="z-20 btn__pill-secondary">Participer</button>
          </div> */}
        </div>
      </a>
    </Link>
  );
};

const LiItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | JSX.Element;
  icon: JSX.Element;
}) => {
  return (
    <li className="inline-flex text-xs md:text-sm items-start gap-x-1.5 ml-2">
      {icon}
      <span className="hidden font-bold sm:block">{label} : </span>
      <span className="whitespace-pre-line sm:whitespace-normal">{value}</span>
    </li>
  );
};
