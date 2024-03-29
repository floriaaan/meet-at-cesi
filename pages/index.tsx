import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextSeo } from "next-seo";

import campusList from "@/resources/campus-list";
import { AppLayout } from "@/components/Layout";
import { SearchBar } from "@/components/UI/Form/SearchBar";

const POSSIBLE_CAPTIONS = [
  "On partage une bière après les cours ? 🍻",
  "Révisons ensemble ce soir ! 📚",
  "Organisons une fête pour célébrer ! 🎉",
  "On court ensemble ce midi ? 🏃‍♂️",
  "Entraînement sportif pour se motiver ? 💪🏋️‍♂️",
  "Soirée jeux de société chez moi ce week-end ? 🎲🃏",
  "Randonnée en forêt pour changer d'air ? 🌳🍂",
  "Brainstorming pour booster notre créativité ? 💡🧠",
  "Pause-café pour se détendre ? ☕️",
];
export const getServerSideProps: GetServerSideProps = async () => {
	const caption =
		POSSIBLE_CAPTIONS[Math.floor(Math.random() * POSSIBLE_CAPTIONS.length)];

	return {
		props: {
			caption,
		},
	};
};

type Props = {
	caption: string;
};

const Home: NextPage<Props> = ({ caption }) => {
	const router = useRouter();
	return (
		<AppLayout>
			<NextSeo title="Accueil" />
			<section className="relative w-full h-[50vh] md:h-[70vh] mb-48">
				<Image
					priority={false}
					src={"/img/hero.avif"}
					alt="Hero image"
					width={360}
					height={200}
					quality={1}
					sizes="33vw"
					className="absolute top-0 left-0 object-cover w-full h-full blur"
				/>

				<div className="absolute top-0 left-0 w-full h-full opacity-50 bg-gradient-to-b from-transparent to-black" />
				<div className="absolute left-0 right-0 flex flex-col items-start w-full h-full px-4 mx-auto md:px-12 xl:px-0 xl:max-w-6xl gap-y-8 -bottom-24 md:-bottom-48 xl:-bottom-64 ">
					<h1 className="text-7xl title" data-testid="home-caption">{caption}</h1>
					<div className="flex flex-col w-full">
						<div className="flex flex-col items-center w-full px-4 pt-4 pb-6 bg-purple gap-y-4 lg:gap-y-0 lg:flex-row xl:pb-4 ">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									const form = e.target as HTMLFormElement;
									const input = form[0] as HTMLInputElement;


									if (
										input.value &&
										typeof input.value === "string" &&
										input.value !== ""
									) {
										router.push({
											pathname: "/event",
											query: {
												title: input.value,
											},
										});
									}
								}}
								className="flex flex-col w-full"
							>
								<SearchBar className="input__shadow-purple" labelClassName="dark:text-black" />
							</form>
						</div>
						<div className="w-full px-8 py-6 bg-white shadow-2xl dark:bg-neutral-900 font-body">
							<span className="pb-2 pr-2 bg-white dark:bg-neutral-900">
								Découvrez les événements organisés par des étudiant.e.s CESI
							</span>
							<div
								className="flex flex-wrap p-6 -mt-3 border border-black dark:border-neutral-800 gap-x-2 gap-y-3 md:gap-4"
								data-testid="home-campus-list"
							>
								{campusList.sort().map((campus) => (
									<Link
										href={`/event?campus=${campus.value}`}
										className="btn__pill"
										key={campus.value}
									>
										{campus.label}
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</AppLayout>
	);
};

export default Home;
