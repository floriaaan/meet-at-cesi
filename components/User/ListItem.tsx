import { Avatar } from "@/components/UI/Avatar";
import classNames from "classnames";
import { User } from "@prisma/client";
import { AvatarWithName } from "../UI/Avatar/WithName";

type Props = {
  user: User;

  className?: string;
  avatarClassName?: string;

  checked?: boolean;
  onCheck?: (user: User) => void;
};

export const UserListItem = ({
  user,
  onCheck,
  avatarClassName,
  checked,
  className,
}: Props) => {
  return (
    <div
      className={classNames(
        "inline-flex items-center justify-between w-full",
        className,
        checked ? "bg-gray-50" : ""
      )}
      onClick={() => onCheck?.(user)}
    >
      <AvatarWithName
        user={user}
        direction="row"
        avatarClassName={avatarClassName || "w-8 h-8 shrink-0"}
      />
      {onCheck !== undefined && checked !== undefined ? (
        <input
          type={"checkbox"}
          checked={checked}
          className="accent-primary"
          onClick={() => onCheck(user)}
        ></input>
      ) : (
        <></>
      )}
    </div>
  );
};
