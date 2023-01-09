import classNames from "classnames";
import { useEffect, useState } from "react";
import { MdClose, MdOutlineMenu } from "react-icons/md";
import { signIn, signOut, useSession } from "next-auth/react";

import useDelayedRender from "@/hooks/useDelayedRender";
import { Category, CategoryProps } from "@/components/UI/Link/Category";
import { Header } from "@/components/UI/Header";
import { Avatar } from "@/components/UI/Avatar";
import { PWAPopup } from "@/components/Helpers/Popup/PWA";
import { ExtendedSession } from "@/types/Session";
import { getPlural } from "@/lib/string";
import { Spinner } from "@/components/UI/Fallback/Spinner";
import { useTheme } from "next-themes";

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

	const { data: session, status } = useSession();
	const { user } = (session as ExtendedSession) || {};

	return (
		<div className="inline-flex items-center md:hidden shrink-0 gap-x-5">
			{status === "loading" ? <Spinner /> : null}
			{status !== "loading" && !user ? (
				<button
					onClick={() =>
						signIn("azure-ad", {
							redirect: false,
						})
					}
					className="block text-sm font-bold underline uppercase md:hidden decoration-dotted decoration-black underline-offset-2"
				>
					Se connecter
				</button>
			) : null}
			<button
				className="inline-flex items-center md:hidden gap-x-3"
				onClick={toggleMenu}
			>
				{/* <span className="underline underline-offset-2">
					{user ? "Menus" : ""}
				</span> */}
				<span className="sr-only">Ouvrir le menu</span>
				{!isMenuOpen ? (
					<>
						{user ? (
							<Avatar user={user} className="w-9 h-9 shrink-0" />
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
		</div>
	);
};

const MobileMenuPanel = ({ isMenuRendered }: { isMenuRendered: boolean }) => {
	const { data: session } = useSession() as {
		data: ExtendedSession | null | undefined;
	};
	const { user } = session || {};
	const { role } = user || {};

	const { theme, setTheme } = useTheme();

	const LINKS = [
		user
			? {
					title: "🧑 Mon compte",
					options: [
						{ name: "Mon profil", href: "/profile" },
						{ name: "Mes événements", href: "/profile#events" },
						{ name: "Mes invitations", href: "/profile#invitations" },
						{ name: "Paramètres", href: "/profile/settings" },
					],
			  }
			: {
					title: "🧑 Authentification",
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

		{
			title: "🗓️ Événements",
			options: user
				? [
						{ name: "Tout les événements", href: "/event" },
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
				: [{ name: "Tout les événements", href: "/event" }],
		},
		{
			title: "⚙️ Autres",
			options: [
				{
					name: theme === "dark" ? "Thème clair" : "Thème sombre",
					onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
				},
			],
		},
		user
			? {
					title: "👋 Déconnexion",
					options: [
						{
							name: "Se déconnecter",
							onClick: () => signOut(),
						},
					],
			  }
			: null,
		role === "ADMIN" || role === "MODERATOR"
			? {
					title: "🥸 Administration",
					options: [{ name: "Tableau de bord", href: "/admin" }],
			  }
			: null,
	].filter((link) => link !== null) as CategoryProps[];

	return (
		<>
			<ul
				className={classNames(
					"top-16 fixed px-4 pt-7 w-full h-screen m-0 z-[9999] transition-opacity duration-300 ease-linear left-0 grow md:hidden",
					"flex flex-col bg-white dark:bg-black",
					isMenuRendered ? "opacity-100" : "opacity-0",
				)}
			>
				{session?.user?.name ? (
					<li className="relative inline-flex w-full bg-primary">
						<span className="z-10 flex items-center h-full pl-4 shrink-0 bg-primary w-fit">
							<Avatar
								user={session.user}
								className="w-16 h-16 text-xl bg-black dark:bg-white text-primary"
							/>
						</span>
						<span className="relative -left-2">
							<Header
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
							"transition-all duration-300 ease-linear first:pt-0 py-2.5", // mobile-menu.module.css
							"text-sm font-semibold border-b last:border-b-0 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-800",
							isMenuRendered
								? "opacity-100 w-full translate-x-0"
								: "opacity-0 w-0 -translate-x-4",
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
