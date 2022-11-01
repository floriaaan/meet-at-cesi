import type { User } from "@prisma/client";

import classNames from "classnames";
import { useState } from "react";
import { MdGridView, MdList } from "react-icons/md";

import { ParticipantCard } from "@/components/Event/ParticipantCard";

export const ParticipantsSection = ({
  participants,
}: {
  participants: User[];
}) => {
  const [display, setDisplay] = useState<"column" | "grid">("column");
  return (
    <div className="flex flex-col w-full h-full p-4 bg-gray-100 gap-y-2">
      <div className="inline-flex justify-between w-full ">
        <p className="inline-flex items-center gap-x-1">
          <strong>{participants.length}</strong> participant(s)
        </p>
        <div className="inline-flex items-center gap-x-2">
          <button className="btn__pill">Inviter</button>
          <button
            className="px-1 py-1 md:px-2 md:py-2 btn__pill"
            onClick={() =>
              setDisplay((oldValue) =>
                oldValue === "column" ? "grid" : "column"
              )
            }
          >
            {display === "grid" ? (
              <MdGridView className="w-4 h-4 text-current shrink-0" />
            ) : (
              <MdList className="w-4 h-4 text-current shrink-0" />
            )}
          </button>
        </div>
      </div>
      <div
        className={classNames(
          "w-full gap-2 mt-2 overflow-y-auto h-80",
          display === "grid"
            ? "grid grid-cols-2 lg:grid-cols-3 grid-rows-3"
            : "flex flex-col"
        )}
      >
        {participants.map((participant) => (
          <ParticipantCard
            style={display}
            key={participant.id}
            participant={participant}
          />
        ))}
      </div>
    </div>
  );
};