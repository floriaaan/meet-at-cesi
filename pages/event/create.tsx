import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";

import { EventForm } from "@/components/Event/Form";
import { AppLayout } from "@/components/Layout";
import { Header } from "@/components/UI/Header";
import { createEvent } from "@/lib/fetchers";

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getSession(context);
	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	return {
		props: {},
	};
}

const EventCreatePage: NextPage = () => {
	return (
		<AppLayout>
			<NextSeo title="Créer un événement" />
			<section className="flex flex-col items-start h-auto px-4 mx-auto mt-6 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-8">
				<Header text="Organiser un événement" />
				<EventForm
					// TODO: fix this
					// @ts-ignore
					onSubmit={createEvent}
				/>
			</section>
		</AppLayout>
	);
};

export default EventCreatePage;
