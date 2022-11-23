import Link from "next/link";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { CESILogo } from "@/components/Logo/CESI";
import { MobileMenu } from "@/components/Layout/Navbar/MobileMenu";
import { AuthDropdown } from "@/components/Layout/Navbar/AuthDropdown";
import { ExtendedSession } from "@/types/Session";
import { getPlural } from "@/lib/string";
import { Chip } from "@/components/UI/Chip";

export const Navbar = () => {
  const { data: session } = useSession() as {
    data: ExtendedSession | null | undefined;
  };
  const { user, receivedInvitations } = session || {};
  const [isTop, setIsTop] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 20 && setIsTop(false);
      window.scrollY === 0 && setIsTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [isTop]);

  return (
    <>
      <div className="sticky top-0 z-[41] flex flex-col bg-white shadow-xl lg:shadow-none">
        <div
          aria-label="Navigation principale"
          className="inline-flex items-center justify-between w-full px-5 py-2.5"
        >
          <nav className="inline-flex items-center gap-x-2.5 lg:gap-x-5">
            <Link href="/">
              <CESILogo
                className={classnames(
                  "shrink-0 border",
                  // "transition-all duration-150", // BUG: #3 causes a flicker when the user scrolls down
                  {
                    "lg:w-[38px] lg:h-[38px] w-12 h-12": !isTop,
                    "w-12 h-12 lg:w-28 lg:h-28":
                      isTop && router.pathname === "/",
                    " w-12 h-12 lg:w-16 lg:h-16":
                      isTop && router.pathname !== "/",
                  },
                  {
                    "bg-primary text-black  border-[#afabba] ":
                      router.pathname === "/",
                  },
                  {
                    "border-transparent text-primary": router.pathname !== "/",
                  }
                )}
              />
              <span className="sr-only">Meet at CESI</span>
            </Link>

            <NavLink href="/event">Tout les événements</NavLink>
            {user && (
              <>
                <NavLink href="/event/create">Organiser mon événement</NavLink>
              </>
            )}
          </nav>
          <MobileMenu />
          <AuthDropdown />
        </div>

        {user ? (
          <div className="hidden md:inline-flex items-center justify-between w-full py-2.5 bg-gray-100 px-9 gap-x-5">
            <div className="inline-flex items-center gap-x-5">
              <Link
                href="/event?campus=user_preferred_campus"
                className="subnav__link"
              >
                Mon école
              </Link>
              <Link
                href="/event?promotion=user_preferred_promotion"
                className="subnav__link"
              >
                Ma promotion
              </Link>
            </div>
            {receivedInvitations ? (
              <div className="inline-flex items-center gap-x-5">
                <Link
                  href="/profile#invitations"
                  className="font-bold subnav__link"
                >
                  <Chip
                    className={receivedInvitations.length > 0 ? "bg-red text-xs font-bold text-white hover:decoration-red py-0.5 px-2" : ""}
                  >
                    {receivedInvitations.length}
                  </Chip>
                  {`${
                    receivedInvitations.length > 0
                      ? getPlural(
                          receivedInvitations.length,
                          "nouvelle",
                          "nouvelles"
                        )
                      : ""
                  } ${getPlural(
                    receivedInvitations.length,
                    "invitation",
                    "invitations"
                  )} ${getPlural(
                    receivedInvitations.length,
                    "reçue",
                    "reçues"
                  )}`}
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
};

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link
      href={href}
      className={classnames("hidden nav__link border md:inline-flex", {
        "border-transparent": !isActive,
        "bg-primary text-black border-black": isActive,
      })}
    >
      {children}
    </Link>
  );
};
