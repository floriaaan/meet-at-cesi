import { trophies } from "@/resources/trophies-list";
import { TrophyKey } from "@prisma/client";
import Image from "next/image";

export const Trophy = ({ trophyKey }: { trophyKey: TrophyKey }) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-40 h-32 shrink-0"
      key={trophyKey}
    >
      <Image
        src={`/img/trophies/${trophyKey}.png`}
        className="-m-2 w-28 h-28 shrink-0"
        alt={`Trophée ${trophyKey}`}
        aria-hidden="true"
        width={512}
        height={512}
        quality={100}
      />
      <p className="text-sm font-bold whitespace-nowrap">
        {trophies[trophyKey].name}
      </p>
      <p className="text-xs">obtenu le 1 janv. 22</p>
    </div>
  );
};
