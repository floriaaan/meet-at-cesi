import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";

export const Subnav = () => {
  const router = useRouter();
  const { pathname } = router;
  console.log(pathname);
  return (
    <div className="hidden md:inline-flex items-center justify-between w-full py-2.5 bg-black text-white px-9 gap-x-5">
      <div className="inline-flex items-center gap-x-5">
        <Link
          href="/admin/"
          className={classNames(
            "pr-5 border-r border-white subnav__link hover:decoration-white",
            {
              "decoration-dotted underline decoration-primary":
                pathname === "/admin",
            }
          )}
        >
          Tableau de bord
        </Link>
        <Link
          href="/admin/user"
          className={classNames("subnav__link hover:decoration-white", {
            "decoration-dotted underline decoration-primary":
              pathname === "/admin/user",
          })}
        >
          Utilisateurs
        </Link>
        <Link
          href="/admin/event"
          className={classNames("subnav__link hover:decoration-white", {
            "decoration-dotted underline decoration-primary":
              pathname === "/admin/event",
          })}
        >
          Événements
        </Link>
        <Link
          href="/admin/report"
          className={classNames("subnav__link hover:decoration-white", {
            "decoration-dotted underline decoration-primary":
              pathname === "/admin/report",
          })}
        >
          Signalements
        </Link>
      </div>
    </div>
  );
};
