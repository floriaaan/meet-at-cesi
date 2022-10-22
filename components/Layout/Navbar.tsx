import Link from "next/link";
import { useEffect, useState } from "react";
import { CESILogo } from "../Logo/CESI";
import classnames from "classnames";
import { useSession, signOut, signIn } from "next-auth/react";

import { HiChevronDown } from "react-icons/hi2";

export const Navbar = () => {
  const [isTop, setIsTop] = useState<boolean>(true);
  const { data: session, status } = useSession();

  // detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 0 ? setIsTop(false) : setIsTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [isTop]);

  return (
    <div className="sticky top-0 z-50 flex flex-col bg-white">
      <div
        aria-label="Navigation principale"
        className="inline-flex items-center justify-between w-full px-5 py-2.5"
      >
        <nav className="inline-flex items-center gap-x-10">
          <Link href="/">
            <a>
              <CESILogo
                className={classnames(
                  "border border-[#afabba] shrink-0",
                //   "transition-all duration-150", // BUG: causes a flicker when the user scrolls down
                  {
                    "w-[38px] h-[38px]": !isTop,
                    "w-28 h-28": isTop,
                  }
                )}
              />
              <span className="sr-only">Meet at CESI</span>
            </a>
          </Link>

          <NavLink href="#">Évenements à venir</NavLink>
          <NavLink href="#">Organiser mon événement</NavLink>
          <button className="nav__link" onClick={() => setIsTop(!isTop)}>
            test
          </button>
        </nav>
        {status !== "loading" && (
          <div aria-roledescription="authentication">
            {status === "unauthenticated" && (
              <button
                className="nav__link"
                onClick={() =>
                  signIn("azure-ad", {
                    redirect: false,
                  })
                }
              >
                Se connecter
              </button>
            )}
            {status === "authenticated" && session?.user && (
              <button
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
                className="text-white hover:no-underline bg-pink nav__link"
              >
                Hello {session.user.name}
                <HiChevronDown className="inline-block w-3 h-3 stroke-2" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="inline-flex items-center w-full py-2.5 bg-gray-100 px-9 gap-x-5">
        <Link href="#">
          <a className="subnav__link">Ma promotion</a>
        </Link>
        <Link href="#">
          <a className="subnav__link">Mon école</a>
        </Link>
      </div>
    </div>
  );
};

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link href={href}>
      <a className="nav__link">{children}</a>
    </Link>
  );
};
