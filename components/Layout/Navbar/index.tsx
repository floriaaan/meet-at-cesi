import Link from "next/link";
import classnames from "classnames";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { Logo } from "@/components/Logo/CESI";
import { MobileMenu } from "@/components/Layout/Navbar/MobileMenu";
import { AuthDropdown } from "@/components/Layout/Navbar/AuthDropdown";

import { ExtendedSession } from "@/types/Session";
import { getPlural } from "@/lib/string";
import { Chip } from "@/components/UI/Chip";
import { isAdmin, isModerator } from "@/lib/role";
import { MdSearch } from "react-icons/md";
import { getEnv } from "@/lib/env";
import { useState } from "react";
import { SearchBar } from "@/components/UI/SearchBar";
import { i } from "vitest/dist/index-81973d31";

export const Navbar = () => {
	const { data: session } = useSession() as {
		data: ExtendedSession | null | undefined;
	};
	const { user } = session || {};
	const { receivedInvitations, role } = user || {};
	const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
	const router = useRouter();
	const env = getEnv();

	return (
		<>
			<div className="sticky top-0 z-[41] flex flex-col bg-white shadow-xl lg:shadow-none">
				<div
					aria-label="Navigation principale"
					className="inline-flex items-center justify-between w-full px-5 gap-x-5 py-2.5"
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
								<Logo className="shrink-0 lg:w-[38px] lg:h-[38px] w-12 h-12 rounded-[12px] lg:rounded-[9px]" />
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
									className="border border-black border-dashed rounded-none "
									inputClassName="rounded-l-none placeholder-invisible sm:placeholder-visible"
									buttonClassName="rounded-r-none"
									inputPaddingClassName="px-2 py-1 w-48 sm:w-96 md:w-full"
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
					<MobileMenu />
					<AuthDropdown />
				</div>

				{user && !router.pathname.includes("/admin") ? (
					<div className="hidden md:inline-flex items-center justify-between w-full py-2.5 bg-gray-100 px-9 gap-x-5">
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
									className="pl-5 border-l border-black subnav__link"
								>
									{role === "ADMIN" ? "Administration" : "Modération"}
								</Link>
							) : null}
						</div>
						{receivedInvitations ? (
							<div className="inline-flex items-center gap-x-5">
								<Link
									href="/profile#invitations"
									className="font-bold subnav__link"
								>
									<span className="inline-flex items-center gap-x-1 group">
										<Chip
											className={
												receivedInvitations.length > 0
													? "bg-red text-xs font-bold text-white hover:decoration-red py-0.5 px-2"
													: ""
											}
										>
											{receivedInvitations.length}
										</Chip>
										{getPlural(
											receivedInvitations.length,
											"nouvelle invitation reçue",
											"nouvelles invitations reçues",
										)}
									</span>
								</Link>
							</div>
						) : null}
					</div>
				) : null}
				{env !== "production" ? (
					<div className="flex items-center justify-center w-full h-6 text-xs font-bold text-white bg-green">
						Environnement : <u className="ml-1 uppercase">{env}</u>
					</div>
				) : null}
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
