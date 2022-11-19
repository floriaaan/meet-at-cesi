import Link from "next/link";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { CESILogo } from "@/components/Logo/CESI";
import { MobileMenu } from "@/components/Layout/Navbar/MobileMenu";
import { AuthDropdown } from "@/components/Layout/Navbar/AuthDropdown";

export const Navbar = () => {
  const { data: session } = useSession();
  const [isTop, setIsTop] = useState<boolean>(true);
  const router = useRouter();

  console.log(session)

  useEffect(() => {
    const scrollHandler = () => {
      //   window.pageYOffset > 0 ? setIsTop(false) : setIsTop(true);
      window.scrollY > 15 ? setIsTop(false) : setIsTop(true);
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

            <NavLink href="/event">Événements à venir</NavLink>
            {session?.user && (
              <>
                <NavLink href="/event/create">Organiser mon événement</NavLink>
              </>
            )}
          </nav>
          <MobileMenu />
          <AuthDropdown />
        </div>

        {session?.user ? (
          <div className="hidden lg:inline-flex items-center w-full py-2.5 bg-gray-100 px-9 gap-x-5">
            <>
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
            </>
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
