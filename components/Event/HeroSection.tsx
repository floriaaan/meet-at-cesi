import type { User } from "@prisma/client";

import classNames from "classnames";
import Link from "next/link";

import { HeroTitle } from "@/components/UI/HeroTitle";
import { HeroDetails } from "@/components/Event/HeroDetails";

export const HeroSection = ({
  id,
  title,
  date,
  location,
  campus,
  audience,
  creator,
  isParticipant,
  isOwner,

  participate,
}: {
  id: string;
  title: string;
  date: Date;
  location: string;
  campus: string;
  audience: string;
  creator: User;

  isParticipant: boolean;
  isOwner: boolean;

  participate: () => void;
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="inline-flex items-end justify-between w-full">
        <div className="overflow-hidden text-white uppercase">
          <div
            className={classNames(
              "hidden sm:inline-block", // responsive : hidden on small screens like mobile
              "relative mb-8 ml-12 bg-black py-1 pr-4 text-sm",
              "before:absolute before:top-[3.8rem] before:w-[11rem] before:h-[150%] before:bg-black before:translate-x-[-100%] before:left-0 before:skew-y-[-35deg]",
              "after:translate-y-[100%] after:absolute after:bg-black after:right-[7.85rem] after:bottom-0 after:w-[150%] after:h-[11rem] after:skew-x-[-55deg] "
            )}
          >
            <div className="inline-flex items-start py-2 divide-x-2 divide-white gap-x-4">
              <div className="flex flex-col">
                <span className="">Campus</span>
                <strong
                  // @ts-ignore
                  before="_"
                  className={classNames(
                    "relative -mt-1.5 -mb-1 w-min md:w-auto",
                    "before:content-[attr(before)] before:absolute before:right-[100%]"
                  )}
                >
                  {campus}
                </strong>
              </div>
              <div className="flex flex-col pl-4">
                <span className="">Invités</span>
                <strong
                  // @ts-ignore
                  before="_"
                  className={classNames(
                    "relative -mt-1.5 -mb-1 w-min xs:w-auto",
                    "before:content-[attr(before)] before:absolute before:right-[100%]"
                  )}
                >
                  {audience}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end ml-2 md:gap-2 md:flex-row md:pr-2 lg:ml-0">
          {isOwner && (
            <Link href={`/event/${id}/edit`}>
              <a className="py-2.5 btn-black">Modifier</a>
            </Link>
          )}
          <button className="py-2.5 btn-black" onClick={() => participate()}>
            {isParticipant ? "Ne plus participer" : "Participer"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <HeroTitle text={title} />
        <HeroDetails
          date={date as unknown as string}
          location={location}
          creator={creator}
          audience={audience}
          campus={campus}
        />
      </div>
    </div>
  );
};
