import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdClose, MdOutlineMenu } from "react-icons/md";

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

export const MobileMenu = ({ isTop = true }: { isTop: boolean }) => {
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
        className="inline-flex items-center md:hidden gap-x-3"
        onClick={toggleMenu}
      >
        <span className="underline underline-offset-2">Menus</span>
        <span className="flex items-center justify-center rounded-full w-9 h-9 btn__colors">
          {!isMenuOpen ? (
            <MdOutlineMenu className="w-4 h-4" />
          ) : (
            <MdClose className="w-4 h-4" />
          )}
        </span>
      </button>
      {isMenuOpen ? (
        <ul
          className={classNames(
            isTop ? "top-12" : "top-16",
            styles.menu,
            "flex flex-col h-full bg-white",
            isMenuRendered && styles.menuRendered
          )}
        >
          {LINKS.map((link, i) => (
            <li
              key={link.href}
              className="text-sm font-semibold border-b text-neutral-900 border-neutral-300"
              style={{ transitionDelay: `${150 + 25 * i}ms` }}
            >
              <Link href={link.href} className="flex w-auto pb-4">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};
