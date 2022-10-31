import type { User } from "@prisma/client";
import classNames from "classnames";

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
      {participant.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={participant.image}
          alt={participant.name || "Participant picture"}
          className={classNames("rounded-full", {
            "w-8 h-8": style === "column",
            "w-16 h-16": style === "grid",
          })}
        />
      ) : (
        <span
          className={classNames(
            "rounded-full select-none flex justify-center items-center bg-primary font-bold",
            {
              "w-8 h-8 text-xs": style === "column",
              "w-16 h-16 text-xl": style === "grid",
            }
          )}
        >
          {participant.name
            ? participant.name.split(" ")[0][0] +
              participant.name.split(" ")[1][0]
            : "?"}
        </span>
      )}
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
