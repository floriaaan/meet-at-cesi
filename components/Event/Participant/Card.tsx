import type { User } from "@prisma/client";
import classNames from "classnames";

import { Avatar } from "@/components/UI/Avatar";
import { Name } from "@/components/UI/Avatar/OnlyName";

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
        className={
          style === "grid" ? "w-16 h-16 text-xl border-2" : "w-8 h-8 text-xs"
        }
      />
      <Name
        user={participant}
        className={classNames(" h-fit font-bold truncate w-full", {
          "text-base": style === "column",
          "text-xs text-center ": style === "grid",
        })}
      />
    </div>
  );
};
