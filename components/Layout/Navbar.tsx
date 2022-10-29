import Link from "next/link";
import { useEffect, useState } from "react";
import classnames from "classnames";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { HiChevronDown } from "react-icons/hi2";

import { CESILogo } from "@/components/Logo/CESI";
import { MobileMenu } from "@/components/Layout/MobileMenu";

export const Navbar = () => {
  const [isTop, setIsTop] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  // detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      //   window.pageYOffset > 0 ? setIsTop(false) : setIsTop(true);
      // better to use window.scrollY
      window.scrollY > 0 ? setIsTop(false) : setIsTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [isTop]);

  return (
    <>
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
                    "shrink-0 border",
                    // "transition-all duration-150", // BUG: #3 causes a flicker when the user scrolls down
                    {
                      "w-[38px] h-[38px]": !isTop,
                      "w-[38px] h-[38px] lg:w-28 lg:h-28":
                        isTop && router.pathname === "/",
                      "w-[38px] h-[38px] lg:w-16 lg:h-16":
                        isTop && router.pathname !== "/",
                    },
                    {
                      "bg-primary text-black  border-[#afabba] ":
                        router.pathname === "/",
                    },
                    {
                      "border-transparent text-primary":
                        router.pathname !== "/",
                    }
                  )}
                />
                <span className="sr-only">Meet at CESI</span>
              </a>
            </Link>

            <NavLink href="/event">Évenements à venir</NavLink>
            <NavLink href="/event/create">Organiser mon événement</NavLink>
          </nav>
          <MobileMenu />
          {status !== "loading" && (
            <div
              aria-roledescription="authentication"
              className="hidden md:inline-flex"
            >
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
                  className="space-x-1 btn__pill"
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
  return (
    <Link href={href}>
      <a className="hidden nav__link md:inline-flex">{children}</a>
    </Link>
  );
};
