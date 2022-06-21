import { Avatar } from "components/UI/Avatar/Avatar";
import { BellIcon } from "@heroicons/react/outline";

type HomeHeaderProps = {
  title?: string;
  subtitle?: string;
};

const __MOCK_USER__ = {
  name: "Thierry Becarro",
};

export const HomeHeader = ({ title, subtitle }: HomeHeaderProps) => {
  return (
    <>
      <header className="sticky top-0 inline-flex items-center justify-between w-full">
        <Avatar src="https://i.pravatar.cc/300" alt="User picture" />
        <div className="inline-flex items-center shrink-0">
          <div className="relative">
            <BellIcon className="w-8 h-8 text-tertiary" />
            <span className="absolute top-1.5 right-1.5  text-xs h-1.5 w-1.5 bg-primary rounded-full ring-white ring-2" />
          </div>
        </div>
      </header>
      <div className="flex flex-col mt-2 text-secondary">
        <h2 className="text-xl font-medium font-heading">{title || "Bonne journée,"}</h2>
        <h3 className="text-2xl font-bold font-heading">{subtitle || __MOCK_USER__.name}</h3>
      </div>
    </>
  );
};
