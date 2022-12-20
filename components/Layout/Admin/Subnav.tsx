import { isAdmin } from "@/lib/role";
import { ExtendedSession } from "@/types/Session";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export const Subnav = () => {
	const router = useRouter();
	const { pathname } = router;

	const { data: session } = useSession();
	const { user } = (session as ExtendedSession) || {};

	return (
		<div className="hidden md:inline-flex items-center justify-between w-full py-2.5 bg-black text-white px-9 gap-x-5">
			<div className="inline-flex items-center gap-x-5">
				<Link
					href="/admin"
					className={classNames(
						"pr-5 border-r border-white subnav__link hover:decoration-white",
						{
							"decoration-dotted underline decoration-primary":
								pathname === "/admin",
						}
					)}
				>
					Tableau de bord
				</Link>
				{isAdmin(user) ? (
					<Link
						href="/admin/user"
						className={classNames("subnav__link hover:decoration-white", {
							"decoration-dotted underline decoration-primary":
								pathname === "/admin/user",
						})}
					>
						Utilisateurs
					</Link>
				) : null}
				{isAdmin(user) ? (
					<Link
						href="/admin/event"
						className={classNames("subnav__link hover:decoration-white", {
							"decoration-dotted underline decoration-primary":
								pathname === "/admin/event",
						})}
					>
						Événements
					</Link>
				) : null}
				{isAdmin(user) ? (
					<Link
						href="/admin/feedback"
						className={classNames("subnav__link hover:decoration-white", {
							"decoration-dotted underline decoration-primary":
								pathname === "/admin/feedback",
						})}
					>
						Feedbacks
					</Link>
				) : null}

				<Link
					href="/admin/report"
					className={classNames("subnav__link hover:decoration-white", {
						"decoration-dotted underline decoration-primary":
							pathname === "/admin/report",
					})}
				>
					Signalements
				</Link>
			</div>
		</div>
	);
};
