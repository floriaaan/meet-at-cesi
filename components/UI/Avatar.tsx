import classNames from "classnames";

import type { UserMinimum } from "@/types/User";
import Image from "next/image";

type AvatarProps = {
  user: UserMinimum;
  className?: string;
};

export const Avatar = ({ user, className }: AvatarProps) => {
  return (
    <>
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <Image
          width={64}
          height={64}
          src={user.image}
          alt={user.name || "Participant picture"}
          className={classNames("rounded-full", className)}
        />
      ) : (
        <span
          className={classNames(
            "rounded-full select-none flex justify-center items-center bg-primary font-bold",
            className
          )}
        >
          {user.name
            ? user.name.split(" ")[0][0] + user.name.split(" ")[1][0]
            : "?"}
        </span>
      )}
    </>
  );
};
