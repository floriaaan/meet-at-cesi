import { Chip } from "@/components/UI/Chip";
import { ExtendedUser } from "@/types/User";
import { Trophy } from "@/components/Profile/Trophies";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";

type Props = {
	user: ExtendedUser;
};

const TrophiesSectionComponent = ({ user }: Props) => {
	const { trophies } = user || {};
	return (
		<section
			className="flex flex-col w-full h-48 p-2 mb-2 text-white bg-black border-b border-gray-100 gap-y-2 scroll-mt-48 last:border-b-0"
			id="trophies"
			aria-label="Trophies section"
		>
			<div className="inline-flex items-center justify-between w-full">
				<div className="inline-flex items-center gap-x-2">
					<h3 className="text-xl font-bold underline decoration-primary decoration-dashed underline-offset-2">
						🏆 Trophées obtenus
					</h3>
					<Chip className="text-xs font-bold text-black bg-primary py-0.5 px-2">
						{trophies?.length || 0}
					</Chip>
				</div>
				<Link
					href="/profile/trophies"
					className="inline-flex items-center gap-1 text-xs font-bold hover:underline decoration-white underline-offset-2"
				>
					Voir tout les trophées
					<MdArrowRightAlt />
				</Link>
			</div>
			{trophies?.length > 0 ? (
				<div className="inline-flex items-center pb-2 overflow-x-auto overflow-y-hidden gap-x-4">
					{trophies?.map((trophy) => (
						<Trophy
							key={trophy.key}
							trophyKey={trophy.key}
							createdAt={trophy.createdAt}
						/>
					))}
				</div>
			) : (
				<div className="flex items-center justify-center h-full">
					<p className="-mt-6 text-sm font-bold">Aucun trophée obtenu</p>
				</div>
			)}
		</section>
	);
};

export const TrophiesSection = dynamic(
	() => Promise.resolve(TrophiesSectionComponent),
	{
		ssr: false,
	},
);
