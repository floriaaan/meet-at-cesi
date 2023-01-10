import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextSeo } from "next-seo";

import { campusList } from "@/resources/campus-list";
import { AppLayout } from "@/components/Layout";
import { SearchBar } from "@/components/UI/Form/SearchBar";
import { EventListItem } from "@/components/Event/List/ListItem";
import { Star } from "@/components/Icons/Neobrutalism";
import { ExtendedEvent } from "@/types/Event";
import { Category } from "@/components/UI/Link/Category";
import { slugify } from "@/lib/slugify";
import prisma from "@/lib/prisma";

type Props = {
	event: ExtendedEvent;
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const event = (await prisma.event.findFirst({
		where: {
			date: { gt: new Date() },
			private: false,
		},
		include: {
			creator: true,
			participants: true,
		},
		orderBy: {
			// comments: { _count: "asc" },
			participants: { _count: "desc" },
		},
	})) as ExtendedEvent;

	return {
		props: {
			event,
		},
	};
};

const Home: NextPage<Props> = ({ event }) => {
	const router = useRouter();
	return (
		<AppLayout>
			<NextSeo title="Accueil" />
			<div className="relative">
				<section className="flex flex-col w-full h-auto md:h-[700px]  border-t-2 border-black divide-y-2 divide-black md:flex-row md:divide-x-2 md:divide-y-0">
					<div className="w-full p-8 text-black md:w-1/2 bg-green md:p-16">
						<div className="flex flex-col gap-y-12 h-fit">
							<h1 className="text-5xl font-bold md:text-4xl xl:text-6xl font-heading">
								Planifiez vos soirées et révisions facilement avec Meet at CESI
							</h1>
							<div className="flex flex-col text-sm leading-6 gap-y-4 lg:text-base">
								<p className="font-bold whitespace-pre-wrap">
									Gérez vos invitations et participations en toute simplicité,
									et faites en sorte que chaque rendez-vous soit une réussite.
								</p>
								<p className="font-bold whitespace-pre-wrap">
									Avec Meet at CESI, plus besoin de perdre du temps à envoyer
									des dizaines de messages pour savoir qui sera présent ou non.
								</p>
								<p className="font-bold whitespace-pre-wrap">
									Toutes les informations sont regroupées au même endroit, pour
									que vous puissiez vous concentrer sur {"l'essentiel"} : passer
									un bon moment avec vos amis.
								</p>
							</div>
							<Link
								href="/event/create"
								className="py-4 border-0 btn-black hover:bg-pink hover:text-white md:hidden"
							>
								Créer mon événement
							</Link>
						</div>
					</div>
					<div className="w-full p-8 text-black md:w-1/2 bg-primary md:p-16 ">
						<div className="flex flex-col gap-y-12 h-fit">
							<h1 className="text-3xl font-bold md:text-4xl xl:text-6xl font-heading">
								Événement du moment
							</h1>
							<div className="flex items-center justify-center w-full ">
								<div className="relative">
									<div className="h-fit w-fit shadow-neobrutalism group" data-testid="home-event-list-item">
										<EventListItem
											{...event}
											forceVertical
											
										/>
									</div>
									<div className="absolute -left-6 lg:left-auto -top-12 lg:-right-12">
										<Star className="w-24 h-24 rotate-6 lg:w-32 lg:h-32 animate-wiggle" />
									</div>
								</div>
							</div>
							<Link
								href="/event"
								className="py-4 border-0 btn-black hover:bg-purple md:hidden"
							>
								Voir les événements
							</Link>
						</div>
					</div>
				</section>
				<section className="absolute flex flex-col w-full px-8 pb-16 -mt-16 md:-mt-24 lg:-mt-48 md:px-16 gap-y-8">
					<div className="items-center hidden w-full gap-x-16 md:gap-x-32 md:inline-flex">
						<Link
							href="/event/create"
							className="py-4 border-0 btn-black hover:bg-pink hover:text-white"
						>
							Créer mon événement
						</Link>
						<Link
							href="/event"
							className="py-4 border-0 btn-black hover:bg-purple"
						>
							Voir les événements
						</Link>
					</div>
					<div className="flex flex-col w-full p-6 bg-black dark:bg-neutral-950 gap-y-8">
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
									router.push("/event", {
										query: {
											title: input.value,
										},
									});
								}
							}}
							className="flex flex-col w-full max-w-5xl mx-auto"
						>
							<SearchBar
								label="Trouvez votre prochain événement étudiant"
								labelClassName="text-white mb-2"
								inputClassName="dark:bg-white dark:text-black"
							/>
						</form>
						<div
							className="grid md:mx-auto md:max-w-5xl gap-x-16 gap-y-4 sm:grid-cols-2 md:grid-cols-3 "
							data-testid="home-campus-list"
						>
							{campusList
								// group by category
								.reduce((acc, campus) => {
									const category = acc.find(
										(cat) => cat.value === slugify(campus.category),
									);
									if (category) {
										category.options.push(campus);
									} else {
										acc.push({
											value: slugify(campus.category),
											label: campus.category,
											options: [campus],
										});
									}
									return acc;
								}, [] as { value: string; label: string; options: typeof campusList }[])

								.map((category) => (
									<Category
										title={category.label}
										options={category.options.map((campus) => ({
											name: campus.label,
											href: `/event?campus=${campus.value}`,
										}))}
										optionsClassName="text-white"
										titleClassName="text-white"
										key={category.value}
									/>
								))}
						</div>
					</div>
				</section>
			</div>
		</AppLayout>
	);
};

export default Home;
