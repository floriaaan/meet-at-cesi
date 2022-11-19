import { UserMinimum } from "@/types/User";
import { Avatar } from "@/components/UI/Avatar";
import classNames from "classnames";

type Props = {
  user: UserMinimum;

  className?: string;
  avatarClassName?: string;

  checked?: boolean;
  onCheck?: (user: UserMinimum) => void;
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
      <div className="inline-flex items-center gap-x-2">
        <Avatar user={user} className={avatarClassName || "w-8 h-8"} />
        <p className="text-sm font-bold grow">{user.name}</p>
      </div>
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
