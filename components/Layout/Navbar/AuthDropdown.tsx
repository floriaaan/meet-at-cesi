import { signIn, signOut, useSession } from "next-auth/react";
import { MdChevronRight } from "react-icons/md";
import classNames from "classnames";

import type { UserMinimum } from "@/types/User";
import PopperMenu from "@/components/UI/PopperMenu";
import { Spinner } from "@/components/UI/Spinner";
import { Category } from "@/components/UI/Link/Category";
import { Avatar } from "@/components/UI/Avatar";

export const AuthDropdown = () => {
  const { data: session, status } = useSession();

  return (
    <>
      {status === "loading" ? (
        <Spinner className="hidden w-5 h-5 lg:block text-primary" />
      ) : null}
      {status !== "loading" ? (
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
            <PopperMenu
              buttonChildren={({ open }) => (
                <MenuButton user={session.user as UserMinimum} open={open} />
              )}
              popperOptions={{
                strategy: "absolute",
                modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
              }}
            >
              {({ open }) => <MenuPanel open={open} />}
            </PopperMenu>
          )}
        </div>
      ) : null}
    </>
  );
};

const MenuButton = ({ user, open }: { user?: UserMinimum; open: boolean }) =>
  user ? (
    <span
      className={classNames(
        "pr-2 gap-x-1 nav__link border transition-none relative bg-white z-[50]",
        open ? "border-gray-400 border-b-white relative" : "border-transparent"
      )}
    >
      <Avatar user={user} className="w-8 h-8 mr-2 ring-white" />
      Hello {user?.name?.split(" ").at(-1)}
      <MdChevronRight
        className={classNames(
          "inline-block w-5 h-5 transition-transform duration-200",
          open ? "rotate-[270deg]" : "rotate-90"
        )}
      />
    </span>
  ) : null;

const MenuPanel = ({ open }: { open: boolean }) => {
  return (
    <div className="flex -top-px z-[49] flex-col min-w-[16rem] lg:min-w-[24rem] max-w-fit w-full right-0 absolute py-4 px-5 bg-white border rounded-tl-3xl rounded-b-3xl border-gray-400 gap-x-2 gap-y-3 lg:grid grid-cols-2">
      <Category
        title="Mon compte"
        options={[
          { name: "Mon profil", href: "/profile" },
          { name: "Mes événements", href: "/profile#events" },
          { name: "Paramètres", href: "/profile/settings" },
          {
            name: "Se déconnecter",
            onClick: () => signOut(),
          },
        ]}
      />
      <Category
        title="Événements"
        options={[
          { name: "À venir", href: "/event" },
          {
            name: "Mon campus",
            href: "/event?campus=user_preferred_campus",
          },
          {
            name: "Ma promotion",
            href: "/event?promotion=user_preferred_promotion",
          },
          { name: "Organiser", href: "/event/create" },
        ]}
      />
      <Category
        title="Social"
        options={[{ name: "Invitations", href: "/profile#invitations" }]}
      />
      <Category
        title="Autres"
        options={[
          {
            name: "Thème sombre (bientôt)",
            onClick: () => signOut(),
            disabled: true,
          },
        ]}
      />
    </div>
  );
};
