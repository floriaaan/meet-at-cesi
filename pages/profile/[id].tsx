import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { getSession } from "next-auth/react";

import type { ExtendedUser } from "@/types/User";
import prisma from "@/lib/prisma";
import { AppLayout } from "@/components/Layout";
import { ProfileLayout } from "@/components/Layout/Profile/Layout";
import { ParticipatingSection } from "@/components/Profile/Event/ParticipatingSection";
import { CreatedSection } from "@/components/Profile/Event/CreatedSection";
import { ProfileCard } from "@/components/Profile/Card";
import { Preference, PreferencePrivacy, UserPrivacy } from "@prisma/client";
import { TrophiesSection } from "@/components/Profile/Trophies/Section";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (!session?.user?.email)
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	const { id } = context.params as { id: string };

	const today = new Date(new Date().setDate(new Date().getDate() - 1));
	const user = (await prisma.user.findFirst({
		where: { id },
		include: {
			privacy: true,
			preferences: { select: { privacy: true } },
		},
	})) as ExtendedUser;
	if (!user)
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};

	if (user.email === session.user.email) {
		return {
			redirect: {
				destination: "/profile",
				permanent: false,
			},
		};
	}
	const preferences = await prisma.preference.findFirst({
		where: { userId: user.id },
		select: {
			campus:
				user.preferences?.privacy === PreferencePrivacy.PUBLIC ||
				user.preferences?.privacy === PreferencePrivacy.CAMPUS_ONLY,
			promotion:
				user.preferences?.privacy === PreferencePrivacy.PUBLIC ||
				user.preferences?.privacy === PreferencePrivacy.PROMOTION_ONLY,
			userId: true,
		},
	});

	user.preferences = {
		campus: undefined,
		promotion: undefined,
		privacy: user.preferences?.privacy || PreferencePrivacy.PUBLIC,
		...preferences,
	} as Preference;

	if (user.privacy?.trophies === UserPrivacy.PUBLIC) {
		user.trophies = await prisma.trophy.findMany({
			where: { userId: user.id },
		});
	}

	if (user.privacy?.participations === UserPrivacy.PUBLIC) {
		user.participations = (await prisma.event.findMany({
			where: {
				date: { gte: today },
			},
			include: { creator: true, participants: true },
		})) as ExtendedUser["participations"];
	}

	if (user.privacy?.createdEvents === UserPrivacy.PUBLIC) {
		user.createdEvents = (await prisma.event.findMany({
			where: { creatorId: user.id },
			include: { creator: true, participants: true },
		})) as ExtendedUser["createdEvents"];
	}

	return {
		props: { user: JSON.parse(JSON.stringify(user)) },
	};
};

type Props = {
	user: ExtendedUser;
};
const ProfileIndexPage: NextPage<Props> = ({ user }) => {
	const { participations, createdEvents, privacy } = user;

	return (
		<AppLayout>
			<ProfileLayout noSidebar>
				<NextSeo noindex title={user.name || "Profil"} />
				<section
					className="flex flex-col items-start w-full px-4 mx-auto mt-6 mb-12 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-4"
					aria-label="Profile index page"
				>
					<ProfileCard user={user} />
					<div className="w-full h-auto">
						{privacy?.trophies === UserPrivacy.PUBLIC ||
						privacy?.trophies === undefined ? (
							<TrophiesSection user={user} />
						) : null}
						<section id="events" className="flex flex-col w-full">
							{privacy?.participations === UserPrivacy.PUBLIC ? (
								<ParticipatingSection events={participations || []} />
							) : null}
							{privacy?.createdEvents === UserPrivacy.PUBLIC ? (
								<CreatedSection events={createdEvents || []} />
							) : null}
						</section>
					</div>
				</section>
			</ProfileLayout>
		</AppLayout>
	);
};

export default ProfileIndexPage;
