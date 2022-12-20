import type { GetServerSideProps, NextPage } from "next";

import Link from "next/link";
import { getSession } from "next-auth/react";
import { MdChevronLeft, MdDelete } from "react-icons/md";
import { NextSeo } from "next-seo";
import { useState } from "react";

import prisma from "@/lib/prisma";
import type { ExtendedEvent } from "@/types/Event";
import { EventForm, EventFormValues } from "@/components/Event/Form";
import { AppLayout } from "@/components/Layout";
import { Header } from "@/components/UI/Header";
import { DeleteModal } from "@/components/Event/DeleteModal";
import { editEvent } from "@/lib/fetchers";
import { ExtendedSession } from "@/types/Session";

type Props = {
	event: ExtendedEvent;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = (await getSession(context)) as ExtendedSession;
	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	const { id } = context.params as { id: string };

	let event = await prisma.event.findUnique({
		where: {
			id,
		},
		include: {
			creator: true,
			participants: true,
		},
	});
	event = JSON.parse(JSON.stringify(event));

	if (
		!event ||
		(event.creator.email !== session?.user?.email &&
			session?.user?.role !== "ADMIN")
	) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: { event },
	};
};

const EventCreatePage: NextPage<Props> = ({ event }) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const closeModal = () => setIsDeleteModalOpen(false);
	const openModal = () => setIsDeleteModalOpen(true);

	return (
		<AppLayout>
			<NextSeo noindex title={`Modifier ${event.title}`} />
			<section className="flex flex-col items-start w-full h-auto px-4 mx-auto mt-6 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-8">
				<div className="inline-flex items-center justify-between w-full -mb-8 gap-x-2 md:px-2">
					<Link
						href={`/event/${event.id}`}
						className="pl-2 pr-4 btn-black w-fit hover:border-transparent"
					>
						<MdChevronLeft className="w-4 h-4 mr-0.5 shrink-0" />
						Retour
					</Link>

					<button
						onClick={openModal}
						className="pl-3 pr-4 btn-red w-fit hover:border-transparent"
					>
						<MdDelete className="w-4 h-4 mr-0.5 shrink-0" />
						Supprimer
					</button>
				</div>
				<Header text="Modifier un événement" />
				<EventForm
					isEditing
					initialValues={
						{
							title: event.title,
							audience: event.audience,
							"audience-campus": event.audienceCampus,
							date: event.date.toString().split("Z")[0] as unknown as Date,
							location: event.location,
						} as EventFormValues
					}
					// TODO: fix this
					// @ts-ignore
					onSubmit={async (values: EventFormValues) =>
						editEvent(event.id, values)
					}
				/>
			</section>
			<section>
				<DeleteModal
					event={event}
					isOpen={isDeleteModalOpen}
					closeModal={closeModal}
				/>
			</section>
		</AppLayout>
	);
};

export default EventCreatePage;
