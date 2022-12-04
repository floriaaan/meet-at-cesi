import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import classNames from "classnames";
import Link from "next/link";

import { Category } from "@/components/UI/Link/Category";

export const ProfileLayoutSidebar = () => {
  const { data: session } = useSession();
  return (
    <aside
      className="sticky flex-col justify-between hidden h-auto min-h-full px-6 py-6 overflow-y-auto top-6 grow w-72 md:flex bg-gray-50 "
      aria-label="Sidebar"
    >
      <ul className="flex flex-col gap-y-2">
        <Category
          title="Mon compte"
          options={[
            {
              name: session?.user?.name || "Mon compte",
              href: "/profile",
            },
            {
              name: "Mes événements",
              href: "/profile#events",
            },
            {
              name: "Mes invitations",
              href: "/profile#invitations",
            },
          ]}
        />
        <Category
          title="Paramètres"
          options={[
            {
              name: "Changement de photo de profil",
              href: "/profile/settings#avatar",
            },
            {
              name: "Sélection du campus et de la promotion",
              href: "/profile/settings#preferences",
            },
            {
              name: "Vérification de l'adresse email",
              href: "/profile/settings#email-verification",
            },
          ]}
        />
      </ul>
    </aside>
  );
};

type SidebarLinkProps = {
  href: string;
  children: React.ReactNode;
};
const SidebarLink = ({ href, children }: SidebarLinkProps) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <li>
      <Link
        className={classNames("nav__link", {
          "text-pink underline decoration-pink": isActive,
        })}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
};

{
  /* <div
        id="dropdown-cta"
        className="p-4 bg-blue-50 dark:bg-blue-900"
        role="alert"
      >
        <div className="flex items-center mb-3">
          <span className="bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">
            Beta
          </span>
          <button
            type="button"
            className="px-0.5 py-0.5 btn__pill"
            data-collapse-toggle="dropdown-cta"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <p className="mb-3 text-sm text-blue-900 dark:text-blue-400">
          Preview the new Flowbite dashboard navigation! You can turn the new
          navigation off for a limited time in your profile.
        </p>
        <a
          className="text-sm text-blue-900 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          href="#"
        >
          Turn new navigation off
        </a>
      </div> */
}
