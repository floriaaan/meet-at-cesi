import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { MdChevronRight } from "react-icons/md";
import PopperMenu from "@/components/UI/PopperMenu";
import classNames from "classnames";
import { Spinner } from "@/components/UI/Spinner";

export const AuthDropdown = () => {
  const { data: session, status } = useSession();

  return (
    <>
      {status === "loading" ? (
        <Spinner className="w-5 h-5 text-primary" />
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
                <MenuButton name={session?.user?.name || ""} open={open} />
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

const MenuButton = ({ name, open }: { name: string; open: boolean }) => (
  <span
    className={classNames(
      "pr-2 gap-x-1 nav__link border transition-none relative bg-white z-[50]",
      open ? "border-gray-400 border-b-white relative" : "border-transparent"
    )}
  >
    Hello {name.split(" ").at(-1)}
    <MdChevronRight
      className={classNames(
        "inline-block w-5 h-5 transition-transform duration-200",
        open ? "rotate-[270deg]" : "rotate-90"
      )}
    />
  </span>
);

const MenuPanel = ({ open }: { open: boolean }) => {
  return (
    <div className="flex -top-px z-[49] flex-col min-w-[16rem] lg:min-w-[24rem] max-w-fit w-full right-0 absolute py-4 px-5 bg-white border rounded-tl-3xl rounded-b-3xl border-gray-400 gap-x-2 gap-y-3 lg:grid grid-cols-2">
      <Category
        title="Mon compte"
        options={[
          { name: "Mon profil", href: "/profile" },
          { name: "Mes événements", href: "/profile/events" },
          { name: "Paramètres", href: "/profile/settings" },
        ]}
      />
      <Category
        title="Social"
        options={[{ name: "Invitations", href: "/profile/invitations" }]}
      />
      <Category
        title="Autres"
        options={[
          {
            name: "Thème sombre (bientôt)",
            onClick: () => signOut(),
            disabled: true,
          },
          {
            name: "Se déconnecter",
            onClick: () => signOut(),
          },
        ]}
      />
    </div>
  );
};

type CategoryOptions = {
  name: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};
type CategoryProps = {
  title: string;
  options: CategoryOptions[];
};
const Category = ({ title, options }: CategoryProps) => (
  <div className="flex flex-col gap-y-1">
    <span
      className={classNames(
        "relative font-bold select-none",
        "before:absolute before:bottom-0 before:h-[0.2rem] before:w-4 before:bg-primary"
      )}
    >
      {title}
    </span>
    <div className="flex flex-col pl-4 gap-y-1">
      {options.map(({ name, href, onClick, disabled }, i) =>
        href ? (
          <Link
            key={`${title}-${i}`}
            href={href}
            className="p-0 font-normal normal-case nav__link">
            {name}
          </Link>
        ) : (
          <button
            disabled={disabled || false}
            key={`${title}-${i}`}
            className="p-0 font-normal normal-case nav__link"
            onClick={onClick}
          >
            {name}
          </button>
        )
      )}
    </div>
  </div>
);
