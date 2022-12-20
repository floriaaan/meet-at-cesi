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

export const Navbar = () => {
	const { data: session } = useSession() as {
		data: ExtendedSession | null | undefined;
	};
	const { user } = session || {};
	const { receivedInvitations, role } = user || {};
	const router = useRouter();

	return (
		<>
			<div className="sticky top-0 z-[41] flex flex-col bg-white shadow-xl lg:shadow-none">
				<div
					aria-label="Navigation principale"
					className="inline-flex items-center justify-between w-full px-5 py-2.5"
				>
					<nav className="inline-flex items-center gap-x-2.5 lg:gap-x-5">
						<Link href="/">
							<span>
								<Logo className="shrink-0 lg:w-[38px] lg:h-[38px] w-12 h-12 rounded-[12px] lg:rounded-[9px]" />
								<span className="sr-only">Meet at CESI</span>
							</span>
						</Link>

						<NavLink href="/event">Tous les événements</NavLink>
						{user && (
							<>
								<NavLink href="/event/create">Organiser mon événement</NavLink>
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
									<span className="inline-flex items-center gap-x-1">
										<Chip
											className={
												receivedInvitations.length > 0
													? "bg-red text-xs font-bold text-white hover:decoration-red py-0.5 px-2"
													: ""
											}
										>
											{receivedInvitations.length}
										</Chip>
										{`${
											receivedInvitations.length > 0
												? getPlural(
														receivedInvitations.length,
														"nouvelle",
														"nouvelles"
												  )
												: ""
										} ${getPlural(
											receivedInvitations.length,
											"invitation reçue",
											"invitations reçues"
										)}`}
									</span>
								</Link>
							</div>
						) : null}
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
			className={classnames("hidden nav__link border md:inline-flex", {
				"border-transparent": !isActive,
				"bg-primary text-black border-black": isActive,
			})}
		>
			{children}
		</Link>
	);
};
