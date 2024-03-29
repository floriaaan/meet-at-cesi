import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { MdArrowRightAlt, MdAdd } from "react-icons/md";
import Link from "next/link";

import type { ExtendedEvent } from "@/types/Event";
import prisma from "@/lib/prisma";
import { AppLayout } from "@/components/Layout";
import { EventList } from "@/components/Event/List";
import { Header } from "@/components/UI/Header";
import { SearchBar } from "@/components/UI/Form/SearchBar";
import { FilterSidebar } from "@/components/Event/Filter/Sidebar";
import { Chip } from "@/components/UI/Chip";
import { FilterProvider, useFilter } from "@/components/Event/Filter/Provider";
import { FilterList } from "@/components/Event/Filter/List";

export const defaultDate = new Date();

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { query } = context;
	if (query.campus || query.promotion) {
		const session = await getSession(context);
		if (session?.user?.email) {
			const user = await prisma.user.findUnique({
				where: { email: session?.user?.email as string },
				include: { preferences: true },
			});
			if (!user) throw new Error("User not found");
			if (query.campus === "user_preferred_campus")
				return {
					redirect: {
						destination: `/event?campus=${user.preferences?.campus}`,
						permanent: false,
					},
				};
			if (query.promotion === "user_preferred_promotion") {
				const splitPromotion = user.preferences?.promotion.split(":");
				return {
					redirect: {
						destination: `/event?promotion=${
							splitPromotion?.[0] || "undefined"
						}&campus=${user.preferences?.campus}`,
						permanent: false,
					},
				};
			}
		}
	}

	// const events = await prisma.event.findMany({
	// 	include: { creator: true, participants: true },
	// 	orderBy: { date: "asc" },
	// 	where: { date: { gte: defaultDate } },
	// });

	const events: ExtendedEvent[] = [];

	return { props: { events: JSON.parse(JSON.stringify(events)) } };
};

type Props = {
	events: ExtendedEvent[];
};

const EventIndexPageWrapper: NextPage<Props> = ({ events }) => {
	return (
		<AppLayout>
			<NextSeo title="Événements" />
			<FilterProvider initialsEvents={events}>
				<EventIndexPage />
			</FilterProvider>
		</AppLayout>
	);
};

export default EventIndexPageWrapper;

const EventIndexPage = () => {
	const { query, push } = useRouter();
	const { filters, events, loading } = useFilter();
	return (
		<section className="flex flex-col min-h-full pb-4 mx-auto bg-neutral-100 dark:bg-black lg:gap-x-8 lg:py-8 lg:flex-row lg:px-12 lg:bg-transparent">
			<div className="flex h-auto flex-col pt-4 lg:pt-0 w-full lg:min-h-[80vh] lg:sticky lg:top-32 bg-white dark:bg-neutral-900 lg:bg-neutral-100  lg:w-2/5 max-w-lg md:max-w-xl lg:max-w-xs mx-auto lg:mx-0">
				<FilterSidebar />
			</div>
			<div className="flex flex-col w-full h-full max-w-lg p-3 mx-auto mb-8 bg-white dark:bg-black md:max-w-xl lg:pt-0 2xl:max-w-7xl lg:shadow-none lg:p-0 lg:max-w-4xl">
				<Header
					className="relative"
					text={
						<div className="inline-flex items-end justify-between w-full lg:items-start">
							<div>
								Liste des événements{" "}
								<Chip extendClassName="absolute bottom-2 ml-2 py-2 text-xl">
									{events.length}
								</Chip>
							</div>
							<Link
								href="/event/create"
								className="inline-flex items-center gap-1 px-2 py-1 mb-2 text-sm font-bold text-white bg-black border border-transparent hover:text-black shrink-0 font-body dark:bg-neutral-900 hover:border-black hover:bg-primary dark:hover:border-black dark:hover:bg-primary w-fit"
							>
								<MdAdd className="w-4 h-4" />
								Créer un événement
							</Link>
						</div>
					}
				/>

				<div className="flex flex-col gap-2 p-4 px-6 -mt-8 bg-primary">
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							const form = e.target as HTMLFormElement;
							const input = form[0] as HTMLInputElement;
							if (
								input.value &&
								typeof input.value === "string" &&
								input.value !== ""
							) {
								push({ query: { ...filters, title: input.value } }, undefined, {
									shallow: true,
								});
							} else {
								const newFilters = { ...filters };
								delete newFilters.title;
								push({ query: newFilters }, undefined, { shallow: true });
							}
						}}
						className="w-full xl:w-4/5"
					>
						<SearchBar
							className="border border-black"
							labelClassName="text-black"
							loading={loading}
						/>
					</form>

					<FilterList />
				</div>
				<EventList className="w-full mt-2 md:mt-6" events={events} />
				{query.campus === "undefined" || query.promotion === "undefined" ? (
					<div>
						<p className="text-lg">Zût, on aurait dû vous prévenir... 😣</p>

						<p className="text-sm whitespace-pre-line">
							{query.campus === "undefined" &&
								"Vous n'avez pas de campus associé à votre profil, vous pouvez en choisir un dans vos préférences.\n"}
							{query.promotion === "undefined" &&
								"Vous n'avez pas de promotion associé à votre profil, vous pouvez en choisir une dans vos préférences.\n"}
						</p>
						<Link
							href="/profile/settings#preferences"
							className="inline-flex items-center gap-1 mt-4 text-sm font-bold underline"
						>
							Aller aux préférences
							<MdArrowRightAlt className="w-4 h-4" />
						</Link>
					</div>
				) : null}
			</div>
		</section>
	);
};
