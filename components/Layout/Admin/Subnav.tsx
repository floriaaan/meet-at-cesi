import Link from "next/link";

export const Subnav = () => {
  return (
    <div className="hidden md:inline-flex items-center justify-between w-full py-2.5 bg-black text-white px-9 gap-x-5">
      <div className="inline-flex items-center gap-x-5">
        <Link href="#" className="subnav__link hover:decoration-white">
          Utilisateurs
        </Link>
        <Link href="#" className="subnav__link hover:decoration-white">
          Événements
        </Link>
        <Link href="#" className="subnav__link hover:decoration-white">
          Signalements
        </Link>
      </div>
    </div>
  );
};
