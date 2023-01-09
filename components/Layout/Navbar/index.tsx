import Link from "next/link";
import classnames from "classnames";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { MdSearch } from "react-icons/md";

import { Logo } from "@/components/Logo/CESI";
import { MobileMenu } from "@/components/Layout/Navbar/MobileMenu";
import { AuthDropdown } from "@/components/Dropdown/AuthDropdown";
import { ExtendedSession } from "@/types/Session";
import { isAdmin, isModerator } from "@/lib/role";
import { SearchBar } from "@/components/UI/Form/SearchBar";
import { NotificationDropdown } from "@/components/Dropdown/NotificationDropdown";
import { getEnv } from "@/lib/env";

export const Navbar = () => {
	const { data: session } = useSession() as {
		data: ExtendedSession | null | undefined;
	};
	const { user } = session || {};
	const { role } = user || {};
	const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
	const router = useRouter();
	const env = getEnv();

	return (
		<>
			<div className="sticky top-0 z-[41] flex flex-col bg-white dark:bg-black shadow-xl lg:shadow-none">
				<div
					aria-label="Navigation principale"
					className="inline-flex items-center justify-between w-full px-5 gap-x-2 md:gap-x-5 py-2.5"
				>
					<nav
						onClick={(e) => {
							if (e.target === e.currentTarget) setIsSearchBarVisible(false);
						}}
						className={classnames(
							"inline-flex items-center gap-x-2.5 2xl:gap-x-5 shrink md:shrink-0 md:grow",
							isSearchBarVisible && "cursor-pointer",
						)}
					>
						<Link
							href="/"
							className="md:mr-4 shrink-0"
							onClick={(e) => {
								if (isSearchBarVisible) {
									e.preventDefault();
									setIsSearchBarVisible(false);
								}
							}}
						>
							<>
								<Logo className="w-12 h-12 shrink-0 " />
								<span className="sr-only">Meet at CESI</span>
							</>
						</Link>

						<button
							onClick={() => setIsSearchBarVisible(!isSearchBarVisible)}
							className={classnames(isSearchBarVisible && "hidden md:block")}
						>
							<MdSearch className="w-5 h-5 shrink-0" />
						</button>

						{isSearchBarVisible ? (
							<form
								className="w-full overflow-hidden md:max-w-md"
								action="#"
								onSubmit={(e) => {
									e.preventDefault();
									const form = e.target as HTMLFormElement;
									const input = form[0] as HTMLInputElement;
									if (
										input.value &&
										typeof input.value === "string" &&
										input.value !== ""
									) {
										router.push(`/event?title=${input.value}`);
									}
								}}
							>
								<SearchBar
									label={null}
									className="border border-black border-dashed rounded-none dark:border-white "
									inputClassName="rounded-l-none placeholder-invisible sm:placeholder-visible"
									buttonClassName="rounded-r-none"
									inputPaddingClassName="px-2 py-1 w-inherit max-w-[12rem] md:max-w-none sm:w-96 md:w-full"
									buttonPaddingClassName="px-2 py-1"
									icon={false}
								/>
							</form>
						) : (
							<>
								<NavLink href="/event">Tous les événements</NavLink>
								{user && (
									<>
										<NavLink href="/event/create">
											Organiser mon événement
										</NavLink>
									</>
								)}
							</>
						)}
					</nav>
					<span className="inline-flex items-center md:hidden gap-x-5">
						<NotificationDropdown />
						<MobileMenu />
					</span>
					<AuthDropdown />
				</div>

				{user && !router.pathname.includes("/admin") ? (
					<div className="hidden md:inline-flex items-center justify-between w-full py-2.5 bg-neutral-100 dark:bg-neutral-900 px-9 gap-x-5">
						<div className="inline-flex items-center gap-x-5">
							<Link
								href="/event?campus=user_preferred_campus"
								className="subnav__link"
							>
								Mon école
							</Link>
							<Link
								href="/event?promotion=user_preferred_promotion"
								className="subnav__link"
							>
								Ma promotion
							</Link>

							{isModerator(user) || isAdmin(user) ? (
								<Link
									href="/admin"
									className="pl-5 border-l border-black dark:border-white subnav__link"
								>
									{role === "ADMIN" ? "Administration" : "Modération"}
								</Link>
							) : null}
						</div>
						<NotificationDropdown />
					</div>
				) : null}
				{/* {env !== "production" ? (
					<div className="flex items-center justify-center w-full h-6 text-xs font-bold text-white bg-green">
						Environnement : <u className="ml-1 uppercase">{env}</u>
					</div>
				) : null} */}
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
	const router = useRouter();
	const isActive = router.pathname === href;
	return (
		<Link
			href={href}
			className={classnames(
				"hidden nav__link shrink-0 whitespace-nowrap md:inline-flex",
				{
					"underline decoration-dotted decoration-black underline-offset-2":
						isActive,
				},
			)}
		>
			{children}
		</Link>
	);
};
