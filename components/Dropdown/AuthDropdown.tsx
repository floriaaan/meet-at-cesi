import { signIn, signOut, useSession } from "next-auth/react";
import { MdChevronRight, MdVerified } from "react-icons/md";
import classNames from "classnames";
import nProgress from "nprogress";
import { User } from "@prisma/client";

import PopperMenu from "@/components/Helpers/PopperMenu";
import { Spinner } from "@/components/UI/Fallback/Spinner";
import { Category } from "@/components/UI/Link/Category";
import { Avatar } from "@/components/UI/Avatar";
import { useTheme } from "next-themes";

export const AuthDropdown = () => {
	const { data: session, status } = useSession();

	return (
		<>
			{status === "loading" ? (
				<div className="hidden w-5 h-5 lg:block">
					<Spinner />
				</div>
			) : null}
			{status !== "loading" ? (
				<div
					aria-roledescription="authentication"
					className="hidden md:inline-flex"
				>
					{status === "unauthenticated" && (
						<button
							className="nav__link"
							onClick={async () => {
								// trigger progress bar linked to sign in method
								nProgress.start();

								await signIn("azure-ad", {
									redirect: false,
								}).then(() => {
									nProgress.done();
								});
							}}
						>
							Se connecter
						</button>
					)}
					{status === "authenticated" && session?.user && (
						<PopperMenu
							buttonChildren={({ open }) => (
								<MenuButton user={session.user as User} open={open} />
							)}
							popperOptions={{
								strategy: "absolute",
								modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
							}}
						>
							{() => <MenuPanel />}
						</PopperMenu>
					)}
				</div>
			) : null}
		</>
	);
};

const MenuButton = ({ user, open }: { user?: User; open: boolean }) =>
	user ? (
		<span
			className={classNames(
				"pr-2 gap-x-1 nav__link border whitespace-nowrap transition-none relative bg-white dark:bg-black z-[50] focus:outline-none",
				open ? "border-neutral-400 dark:border-neutral-600 border-b-white relative" : "border-transparent",
			)}
		>
			<Avatar user={user} className="w-8 h-8 mr-2 ring-white" />
			Hello {user?.name?.split(" ").at(-1)}
			{user.emailVerified ? <MdVerified className="w-4 h-4 shrink-0" /> : null}
			<MdChevronRight
				className={classNames(
					"inline-block w-5 h-5 transition-transform duration-200",
					open ? "rotate-[270deg]" : "rotate-90",
				)}
			/>
		</span>
	) : null;

const MenuPanel = () => {
	const { theme, setTheme } = useTheme();
	return (
		<div className="flex -top-px z-[49] flex-col min-w-[16rem] lg:min-w-[24rem] max-w-fit w-full right-0 absolute py-4 px-5 bg-white dark:bg-black border rounded-tl-3xl rounded-b-3xl border-neutral-400 dark:border-neutral-600 gap-x-2 gap-y-3 lg:grid grid-cols-2">
			<Category
				title="🧑 Mon compte"
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
				title="🗓️ Événements"
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
				title="👫 Social"
				options={[{ name: "Invitations", href: "/profile#invitations" }]}
			/>
			<Category
				title="Autres"
				options={[
					{
						name: theme === "dark" ? "Thème clair" : "Thème sombre",
						onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
					},
				]}
			/>
		</div>
	);
};
