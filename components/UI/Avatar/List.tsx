import { User } from "@prisma/client";
import classNames from "classnames";
import { Avatar } from ".";

type AvatarListProps = {
  users: User[];
  className?: string;
  avatarClassName: string;
  limit?: number;
};

export const AvatarList = ({
  users,
  className,
  avatarClassName,
  limit = 5,
}: AvatarListProps) => {
  return (
    <div
      className={classNames(
        "inline-flex  items-center shrink-0",
        className
      )}
      data-testid="avatar-list"
    >
      {users.map((user, index) =>
        index < limit ? (
          <Avatar
            key={user.id}
            user={user}
            className={classNames(
              avatarClassName,
              " ring-white first:ml-0 -ml-2 ring-1 shrink-0"
            )}
          />
        ) : null
      )}
      {users.length > limit && (
        <span
          className={classNames(
            "flex items-center rounded-full bg-black -ml-2 text-white  justify-center ring-1 ring-white font-bold select-none",
            avatarClassName
          )}
        >
          +{users.length - limit}
        </span>
      )}
    </div>
  );
};
