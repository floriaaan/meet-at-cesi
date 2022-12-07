import classNames from "classnames";
import { User } from "@prisma/client";
import Image from "next/image";

import { getInitials } from "@/lib/string";

export type AvatarProps = {
  user: User;
  className?: string;
};

const Avatar = ({ user, className }: AvatarProps) => {
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
            "rounded-full select-none flex justify-center shrink-0 items-center font-bold",
            className,
            !className?.includes("bg-") ? "bg-primary" : null
          )}
        >
          {user.name ? getInitials(user.name) : "?"}
        </span>
      )}
    </>
  );
};

import { AvatarList } from "@/components/UI/Avatar/List";
import { AvatarWithName } from "@/components/UI/Avatar/WithName";
import { Name } from "@/components/UI/Avatar/OnlyName";

export { Avatar, AvatarList, AvatarWithName, Name };
