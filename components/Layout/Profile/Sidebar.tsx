import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import classNames from "classnames";
import Link from "next/link";

import { Category } from "@/components/UI/Link/Category";

export const ProfileLayoutSidebar = () => {
	const { data: session } = useSession();
	return (
		<aside
			className="sticky flex-col justify-between hidden h-auto min-h-full px-6 py-6 overflow-y-auto top-6 grow w-72 xl:w-96 md:flex bg-gray-50 "
			aria-label="Sidebar"
		>
			<ul className="flex flex-col gap-y-2 xl:gap-y-4">
				<Category
					title="Mon compte"
					options={[
						{
							name: `🧑 ${session?.user?.name || "Mon compte"}`,
							href: "/profile",
						},
						{
							name: "🏆 Mes trophées",
							href: "/profile#trophies",
						},
						{
							name: "🗓️ Mes événements",
							href: "/profile#events",
						},
						{
							name: "🎟️ Mes invitations",
							href: "/profile#invitations",
						},
					]}
				/>
				<Category
					title="Paramètres"
					options={[
						{
							name: "📸 Changement de photo de profil",
							href: "/profile/settings#avatar",
						},
						{
							name: "🎓 Sélection du campus et de la promotion",
							href: "/profile/settings#preferences",
						},
						{
							name: "🔐 Confidentialité des données",
							href: "/profile/settings#privacy",
						},
						{
							name: "📬 Préférences des notifications",
							href: "/profile/settings#notifications",
						},
						{
							name: "📨 Vérification de l'adresse email",
							href: "/profile/settings#email-verification",
						},
					]}
				/>
			</ul>
		</aside>
	);
};

