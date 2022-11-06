import type { User } from "@prisma/client";
import classNames from "classnames";

import { Avatar } from "@/components/UI/Avatar";

export const ParticipantCard = ({
  participant,
  style,
}: {
  participant: User;
  style: "column" | "grid";
}) => {
  return (
    <div
      className={classNames({
        "inline-flex items-center w-full h-fit gap-x-2 border-b pb-2 last:border-b-0":
          style === "column",
        "flex flex-col justify-center items-center gap-y-2": style === "grid",
      })}
    >
      <Avatar
        user={participant}
        className={style === "grid" ? "w-16 h-16 text-xl" : "w-8 h-8 text-xs"}
      />
      <p
        className={classNames(" h-fit font-bold truncate w-4/5", {
          "text-base": style === "column",
          "text-xs text-center ": style === "grid",
        })}
      >
        {participant.name}
      </p>
    </div>
  );
};
