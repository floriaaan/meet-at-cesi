import classNames from "classnames";

import type { UserMinimum } from "@/types/User";
import Image from "next/image";
import { getInitials } from "@/lib/string";

type AvatarProps = {
  user: UserMinimum;
  className?: string;
};

export const Avatar = ({ user, className }: AvatarProps) => {
  return (
    <>
      {user.image ? (
        <Image
          width={64}
          height={64}
          src={user.image}
          alt={user.name || "Participant picture"}
          className={classNames(
            "rounded-full object-cover object-center border border-black shrink-0",
            className
          )}
        />
      ) : (
        <span
          className={classNames(
            "rounded-full select-none flex justify-center shrink-0 items-center bg-primary font-bold",
            className
          )}
        >
          {user.name ? getInitials(user.name) : "?"}
        </span>
      )}
    </>
  );
};
