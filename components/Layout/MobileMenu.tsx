import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";


import styles from "@/styles/mobile-menu.module.css";
import useDelayedRender from "@/hooks/useDelayedRender";

const LINKS = [
  {
    href: "/",
    label: "Accueil",
  },
  {
    href: "/event",
    label: "Événements",
  },
  {
    href: "/event/create",
    label: "Organiser un événement",
  },
];

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

  return (
    <>
      <button
        className="flex items-center justify-center rounded-full w-9 h-9 md:hidden btn__colors"
        onClick={toggleMenu}
      >
        {!isMenuOpen ? (
          <HiBars3 className="w-4 h-4 stroke-[1.25]" />
        ) : (
          <HiXMark className="w-4 h-4 stroke-[1.25]" />
        )}
      </button>
      {isMenuOpen ? (
        <ul
          className={classNames(
            styles.menu,
            "flex flex-col h-full bg-white dark:bg-neutral-900",
            isMenuRendered && styles.menuRendered
          )}
        >
          {LINKS.map((link, i) => (
            <li
              key={link.href}
              className="text-sm font-semibold border-b text-neutral-900 border-neutral-300 dark:border-neutral-700 dark:text-neutral-100"
              style={{ transitionDelay: `${150 + 25 * i}ms` }}
            >
              <Link href={link.href}>
                <a className="flex w-auto pb-4">{link.label}</a>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};
