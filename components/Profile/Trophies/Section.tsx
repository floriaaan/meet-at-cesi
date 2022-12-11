import { Chip } from "@/components/UI/Chip";
import { ExtendedUser } from "@/types/User";
import Image from "next/image";

type Props = {
  user: ExtendedUser;
};

export const TrophiesSection = ({ user }: Props) => {
  return (
    <section
      className="flex flex-col w-full h-48 p-2 mb-2 text-white bg-black border-b border-gray-100 gap-y-2 scroll-mt-48 last:border-b-0"
      id="trophies"
      aria-label="Trophies section"
    >
      <div className="inline-flex items-center gap-x-2">
        <h3 className="text-xl font-bold underline decoration-primary decoration-dashed underline-offset-2">
          Trophées obtenus
        </h3>
        <Chip className="text-xs font-bold text-black bg-primary py-0.5 px-2">
          6
        </Chip>
      </div>
      <div className="inline-flex items-center pb-2 overflow-x-auto overflow-y-hidden gap-x-4">
        <Trophy trophyKey="PARTICIPATION_1" />
        <Trophy trophyKey="PARTICIPATION_10" />
        <Trophy trophyKey="PARTICIPATION_100" />
        <Trophy trophyKey="EVENT_CREATION_1" />
        <Trophy trophyKey="EVENT_CREATION_5" />
        <Trophy trophyKey="EVENT_CREATION_20" />
      </div>
    </section>
  );
};

export const Trophy = ({ trophyKey }: { trophyKey: string }) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-32 h-32 shrink-0"
      key={trophyKey}
    >
      <Image
        src={`/img/trophies/${trophyKey}.png`}
        className="-m-2 w-28 h-28 shrink-0"
        alt={`Trophée ${trophyKey}`}
        aria-hidden="true"
        width={512}
        height={512}
      />
      <p className="text-[0.7rem] font-bold">{trophyKey}</p>
      <p className="text-[0.55rem]">obtenu le 1 janv. 22</p>
    </div>
  );
};
