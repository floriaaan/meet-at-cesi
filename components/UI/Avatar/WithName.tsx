import classNames from "classnames";

import { Avatar, AvatarProps } from "@/components/UI/Avatar";
import { Name } from "@/components/UI/Avatar/OnlyName";

type AvatarWithNameProps = AvatarProps & {
  direction: "column" | "row";
  avatarClassName?: string;
  textClassName?: string;
  badgeClassName?: string;
};

export const AvatarWithName = ({
  user,
  direction,
  textClassName,
  avatarClassName,
  badgeClassName,
  className,
  link,
}: AvatarWithNameProps) => {
  return (
    <div
      className={classNames(
        "flex gap-1",
        {
          "flex-col justify-center": direction === "column",
          "flex-row items-center": direction === "row",
        },
        className
      )}
      data-testid="avatar-with-name"
    >
      <Avatar link={link} user={user} className={avatarClassName} />
      <Name
        user={user}
        className={textClassName}
        badgeClassName={badgeClassName}
      />
    </div>
  );
};
