import { ExtendedUser } from "@/types/User";

type Props = {
  user: ExtendedUser;
};

export const TrophiesSection = ({ user }: Props) => {
  return (
    <section
      className="flex flex-col w-full h-40 p-2 mb-2 text-white bg-black border-b border-gray-100 gap-y-2 scroll-mt-48 last:border-b-0"
      id="trophies"
      aria-label="Trophies section"
    >
      <h3 className="text-xl font-bold">Trophées obtenus</h3>
      <div className="inline-flex items-center overflow-x-auto overflow-y-hidden gap-x-4"></div>
    </section>
  );
};
