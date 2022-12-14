import { formatRelative } from "@/lib/date";
import { ExtendedUser } from "@/types/User";
import { Avatar } from "@/components/UI/Avatar";
import { Header } from "@/components/UI/Header";
import { Preferences } from "@/components/Profile/Preferences/Card";

export const ProfileCard = ({ user }: { user: ExtendedUser }) => {
  return (
    <div className="relative inline-flex w-full bg-primary">
      <span className="z-10 flex items-center h-auto pl-4 shrink-0 bg-primary w-fit">
        <Avatar
          user={user}
          className="w-16 h-16 text-xl bg-black lg:w-32 lg:h-32 text-primary"
        />
      </span>

      <span className="relative flex flex-col -left-2 ">
        <Header
          text={(user.name as string).toLowerCase()}
          className="capitalize text-[32px] sm:text-[3.5rem]  md:text-[4rem]"
        />

        <div className="relative z-10 flex flex-col -mb-2 left-6 -top-6 md:-top-10">
          <Preferences preferences={user.preferences} />
          <span className="text-xs md:text-sm">
            {`inscrit il y a ${formatRelative(user.createdAt.toString())}`}
          </span>
        </div>
      </span>
    </div>
  );
};
