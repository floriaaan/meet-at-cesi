import classNames from "classnames";
import { useEffect, useState } from "react";
import { MdClose, MdDownload, MdOutlineMenu } from "react-icons/md";
import { signIn, signOut, useSession } from "next-auth/react";

import useDelayedRender from "@/hooks/useDelayedRender";
import { Category } from "@/components/UI/Link/Category";
import { HeroTitle } from "@/components/UI/HeroTitle";
import { Avatar } from "@/components/UI/Avatar";
import { UserMinimum } from "@/types/User";
import { PWAPopup } from "@/components/Helpers/PWAPopup";

export const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { rendered: isMenuRendered } = useDelayedRender(isMenuOpen, {
    enterDelay: 20,
    exitDelay: 300,
  });

  function toggleMenu() {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = "";
    } else {
      setIsMenuOpen(true);
      document.body.style.overflow = "hidden";
    }
  }

  useEffect(() => {
    return function cleanup() {
      document.body.style.overflow = "";
    };
  }, []);

  const { data: session } = useSession();

  return (
    <>
      <button
        className="inline-flex items-center md:hidden gap-x-3"
        onClick={toggleMenu}
      >
        <span className="underline underline-offset-2">
          {session?.user ? "Menus" : "Se connecter"}
        </span>
        {!isMenuOpen ? (
          <>
            {session?.user ? (
              <Avatar
                user={session.user as UserMinimum}
                className="w-9 h-9 shrink-0"
              />
            ) : (
              <span className="flex items-center justify-center rounded-full shrink-0 w-9 h-9 btn__colors">
                <MdOutlineMenu className="w-4 h-4" />
              </span>
            )}
          </>
        ) : (
          <span className="flex items-center justify-center rounded-full shrink-0 w-9 h-9 btn__colors">
            <MdClose className="w-4 h-4" />
          </span>
        )}
      </button>
      {isMenuOpen ? <MobileMenuPanel isMenuRendered={isMenuRendered} /> : null}
    </>
  );
};

const MobileMenuPanel = ({ isMenuRendered }: { isMenuRendered: boolean }) => {
  const { data: session } = useSession();

  const LINKS = [
    session?.user
      ? {
          title: "Mon compte",
          options: [
            { name: "Mon profil", href: "/profile" },
            { name: "Mes événements", href: "/profile#events" },
            { name: "Paramètres", href: "/profile/settings" },
            {
              name: "Se déconnecter",
              onClick: () => signOut(),
            },
          ],
        }
      : {
          title: "Authentification",
          options: [
            {
              name: "Se connecter",
              onClick: () =>
                signIn("azure-ad", {
                  redirect: false,
                }),
            },
          ],
        },
    // {
    //   title: "Navigation",
    //   options: [
    //     {
    //       name: "Accueil",
    //       href: "/",
    //     },
    //   ],
    // },
    {
      title: "Événements",
      options: session?.user
        ? [
            { name: "Les événements à venir", href: "/event" },
            { name: "Organiser un événement", href: "/event/create" },
            {
              name: "Les événements de mon campus",
              href: "/event?campus=user_preferred_campus",
            },
            {
              name: "Les événements de ma promotion",
              href: "/event?promotion=user_preferred_promotion",
            },
          ]
        : [{ name: "Les événements à venir", href: "/event" }],
    },
  ];

  return (
    <>
      <ul
        className={classNames(
          "top-16 fixed px-4 pt-7 w-full h-screen m-0 z-[9999] transition-opacity duration-300 ease-linear left-0 grow",
          "flex flex-col bg-white",
          isMenuRendered ? "opacity-100" : "opacity-0"
        )}
      >
        {session?.user?.name ? (
          <li className="relative inline-flex w-full bg-primary">
            <span className="z-10 flex items-center h-full pl-4 bg-primary w-fit">
              <Avatar
                user={session.user as UserMinimum}
                className="w-16 h-16 text-xl bg-black text-primary"
              />
            </span>
            <span className="relative -left-2">
              <HeroTitle
                text={session?.user?.name.toLowerCase()}
                className="capitalize text-[2.5rem]"
              />
            </span>
          </li>
        ) : null}
        {LINKS.map((data, i) => (
          <li
            key={i}
            className={classNames(
              "transition-all duration-300 ease-linear first:pt-0 py-4", // mobile-menu.module.css
              "text-sm font-semibold border-b last:border-b-0 text-neutral-900 border-neutral-200",
              isMenuRendered
                ? "opacity-100 w-full translate-x-0"
                : "opacity-0 w-0 -translate-x-4"
            )}
            style={{ transitionDelay: `${150 + 25 * i}ms` }}
          >
            <Category {...data} />
          </li>
        ))}
      </ul>
      <PWAPopup isMenuRendered={isMenuRendered} />
    </>
  );
};
